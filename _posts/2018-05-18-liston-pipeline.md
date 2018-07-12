---
layout: post
title: Liston Lab Light Field Microscopy Pipeline
date: 2018-05-20 00:00:00 -0000
tags: [projects]
image: lfmicroscope-crayons.jpg
---

Light field microscopes are regular microscopes that have been retrofitted with a microlens array. With those extra lenses,
researchers can create a 3D model of the object a microscope is focusing on. The code to turn 2D images into 3D images, 
LFAnalyze, is a pipeline that runs a series of steps on a cluster of up to 300 nodes.

The steps in LFAnalyze's pipeline are:
1. Image normalization – converts the images into a standard format 
2. Precompute 2D to 3D transforms – CPU processing on up to 100 machines
3. Calibration – Calibrating the algorithm based on optical parameters (One machine)
4. Converting 2D images to 3D images – GPU machine learning processing on up to 300 machines

Weill-Cornell's [Liston Lab][liston-lab] asked me to modernize LFAnalyze, with the goals of improving stability, speed, 
and cost. I started the project by learning about light field microscopy and the codebase.

## Background

This 2006 video does a great job explaining light field microscopy, courtesy of Stanford's 
[Light Field Microscopy][stanford-paper] lab, where the technique and LFAnalyze code were first developed.

<video controls style="width: 100%; max-width: 640px; display: block; margin: 30px auto;">
  <source src="/assets/video/lfmicroscope-intro.mp4" type="video/mp4">
</video>


Previously, code was deployed by hand and jobs were queued through a combination of RabbitMQ, Celery, and 
Redis. The master branch was out of date and the release process was loosely defined.

## Architecture

After investigating a few different architectures, I decided that AWS Batch provided the best combination of features we needed. Designed 
for high performance computing (HPC), AWS Batch is a thin wrapper around AWS Elastic Container Service that allows
users to run jobs in a scalable cluster and chain them together into pipelines.

The biggest issue I ran into was gaps in documentation, particularly around AWS Batch and using GPUs inside Docker containers. 
I'm working on separate articles that dive into specifics on my dev blog to help others who are working on similar 
projects.

![liston-aws-architecture]

The architecture I ended up choosing uses CircleCI to push Docker images to Amazon ECR. Those images are later used by 
AWS Batch to launch ECS clusters to run jobs. That's a bit of a mouthful, so I'll try to unpack the architecture in 
the rest of this post.

## Code Deployment
 
The first order of business was cleaning up the repository. The master branch was out of date with other branches,
so I worked with the scientists at Cornell to get the repo up to scratch.

Next, I Dockerized the codebase. This was complicated by GPU processing, which is architecture-dependent. 
My Mac (with an Intel GPU) wouldn't behave in the same way as AWS (NVIDIA). 

I ended up revising this dozens of times before I got it right. Here's a snippet of the Dockerfile ended up with:
```docker
FROM python:2.7-jessie

# ... install other dependencies

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

## LFAnalyze Client

The goal of the client was to create a simple way to set up, run, and monitor batch jobs.

### Setup

Setup is performed by a series of CloudFormation templates, each of which exports variables that can be subsequently
used by other templates.
1. Set up permissions (`deploy_iam_roles.yaml`)
2. Set up an ECR repository (`deploy_ecr_repository.yaml`)
3. Set up a custom GPU AMI based on Amazon Linux with `nvidia-docker2` installed (`deploy_custom_ami.yaml`)
4. Set up AWS Batch queues, CPU and GPU compute environments of spot instances, and job definitions. (`deploy_batch_env.yaml`)

### LFAnalyze CLI: run, monitor, and stop jobs

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

On the same reconstructions, here's a rough benchmark for improvements. 

{:.table .table-bordered}
Pipeline | CPU Cluster | GPU Cluster Size | Time | Cost 
--- | --- | --- | ---  | ---
Before | 100 instances | 300 instances | 8 hours | $200-300
After | 10 m3.8xlarge or similar instances | 10 P3.2xlarge instances | 2 hours | $10-20



[stanford-paper]: https://graphics.stanford.edu/papers/lfmicroscope/
[liston-lab]: https://www.listonlab.net/
[liston-aws-architecture]: /assets/img/liston-aws-architecture.png "AWS Architecture"