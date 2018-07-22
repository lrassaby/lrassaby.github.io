---
layout: post
title: AWS Batch Array Jobs and GPU Processing
date: 2018-07-22 00:00:00 -0000
tags: [projects, tech-blog]
image: hpc.jpg
---

For a recent contract job, I had to build a batch computing pipeline for scientific computation.

The steps were:
1. A pre-processing step running across a small CPU cluster
2. A processing step running on a 100-machine CPU cluster
3. A calibration step running on one machine
4. A processing step running on a 100-machine GPU cluster

## Architecture

After investigating a few different architectures, I concluded that AWS Batch provided the best combination of features we needed. Designed 
for high performance computing (HPC), AWS Batch is a thin wrapper around AWS Elastic Container Service that allows
users to run jobs in a scalable cluster and chain them together into pipelines.

The biggest issue I ran into was gaps in documentation, particularly around AWS Batch and using GPUs inside Docker containers. 

![aws-architecture]

The architecture I ended up choosing uses CircleCI to push Docker images to Amazon ECR. Those images are later used by 
AWS Batch to launch ECS clusters to run jobs on CPU and GPU clusters. That's a bit of a mouthful, so I'll try to unpack the architecture in 
the rest of this post.

## Code Deployment
 
The first order of business was cleaning up the repository. The master branch was out of date with other branches,
so I worked with the scientists to solve some tech debt. 

Next, I Dockerized the codebase. This was complicated by GPU processing, which is architecture-dependent. 
My Mac (with an Intel GPU) wouldn't behave in the same way as AWS (NVIDIA).

I ended up revising this dozens of times before I got it right. Here's a snippet of the Dockerfile ended up with:
```docker
FROM python:2.7-jessie

# ... install other dependencies (not shown)

# nvidia-container-runtime
ENV NVIDIA_VISIBLE_DEVICES all
ENV NVIDIA_DRIVER_CAPABILITIES compute,utility

# OpenCL (https://gitlab.com/nvidia/opencl/blob/ubuntu16.04/runtime/Dockerfile)
RUN apt-get update && apt-get install -y --no-install-recommends \
        ocl-icd-libopencl1 \
        opencl-headers && \
    rm -rf /var/lib/apt/lists/*

# :(
RUN ln -s /usr/lib/x86_64-linux-gnu/libOpenCL.so.1 /usr/lib/x86_64-linux-gnu/libOpenCL.so
RUN pip install pyopencl

# NVIDIA driver
RUN mkdir -p /etc/OpenCL/vendors && \
    echo "libnvidia-opencl.so.1" > /etc/OpenCL/vendors/nvidia.icd
```

After I got Docker images working, I set up CircleCI to run builds and tests, and deploy images to Amazon's EC2 Container Registry (ECR).

## Getting things running

The goal of the client was to create a simple way to set up, run, and monitor batch jobs.

### Setup

Setup is performed by a series of CloudFormation templates, each of which exports variables that can be subsequently
used by other templates.
1. Set up permissions (`deploy_iam_roles.yaml`)
2. Set up an ECR repository (`deploy_ecr_repository.yaml`)
3. Set up a custom GPU AMI based on Amazon Linux with `nvidia-docker2` installed (`deploy_custom_ami.yaml`)
4. Set up AWS Batch queues, CPU and GPU compute environments of spot instances, and job definitions. (`deploy_batch_env.yaml`)

### CLI: run, monitor, and stop jobs

For running the pipeline, I built a simple command line tool that can launch new pipelines, monitor existing ones, and 
stop jobs if things go wrong.

### Behind the scenes

AWS Batch launches either normal jobs (1 Docker container) or "array jobs" (any number of Docker containers) for each step. Those 
Docker containers in turn run on a cluster of EC2 instances. 

The CLI will decide based on the job name which of two queues to run the job in:
- An auto-managed CPU-optimized cluster of standard AMIs
- A self-managed GPU-optimized cluster using a custom Amazon Machine Image (AMI) 

Each Docker container in a cluster receives the following environment variables:
- `AWS_BATCH_JOB_ARRAY_INDEX`: an integer passed in by AWS to indicate which machine is running. This is the only 
variable that distinguishes jobs from each other, a limitation imposed by AWS Batch.
- `ARRAY_SIZE`: the total number of jobs running in a step of the pipeline.
- `LIST_FILE_S3_PATH`: a link to S3 where commands are being housed. 

To calculate which commands it should execute, each instance runs:

```python
# this cannot be changed -- it comes from Amazon
array_job_idx = os.getenv("AWS_BATCH_JOB_ARRAY_INDEX")
if array_job_idx:
    array_job_idx = int(array_job_idx)
else:
    array_job_idx = 0

# total number of docker machines
array_size = os.getenv("ARRAY_SIZE")
if array_size:
    array_size = int(array_size)
else:
    array_size = 1

all_commands = get_list_file(os.getenv("LIST_FILE_S3_PATH"))
total_commands = len(all_commands)

try:
    all_commands = get_list_file(os.getenv("LIST_FILE_S3_PATH"))

    # get command from list of commands using job array index
    lower_bound = (total_commands * array_job_idx) / array_size
    upper_bound = (total_commands * (array_job_idx + 1)) / array_size

    # 0-n commands per instance
    commands = all_commands[lower_bound:upper_bound]
```

## Benchmarking

On the same reconstructions, here's a rough benchmark for improvements. Most of the performance improvement can be attributed
to the newer hardware the jobs run on. 

{:.table .table-bordered}
Pipeline | CPU Cluster | GPU Cluster Size | Time | Cost Per Run
--- | --- | --- | ---  | ---
Before | ~100 instances | ~100 instances | 8 hours | $100-300
After | ~10 m3.8xlarge or similar instances | ~10 p3.2xlarge instances | 2-4 hours | $10-100


[aws-architecture]: /assets/img/aws-architecture.png "AWS Architecture"