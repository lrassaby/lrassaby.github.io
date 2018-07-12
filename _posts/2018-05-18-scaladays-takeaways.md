---
layout: post
title: Scaladays Takeaways
date: 2018-05-18 00:00:00 -0000
tags: [tech-blog]
image: scala-bg.jpg
published: false
---

Light field microscopes are regular microscopes that have been modified with a microlens array. With those extra lenses,
researchers can create a 3D model of the object a microscope is focusing on. The code to process these images, 
LFAnalyze, is a pipeline that runs a series of steps.

1. **Image normalization** converts the images into a standard format 
2. **PSF creation** CPU processing on multiple machines
3. **Calibration** Calibrating the algorithm based on optical parameters (One machine)
4. **Deconvolution** GPU machine learning processing on multiple machines

Weill-Cornell's [Liston Lab][liston-lab] asked me to modernize LFAnalyze, with the goals of improving stability, speed, 
and cost.

AWS Batch provided the features we needed for running the pipelines, but there were various gaps in documentation. 

## Background

This 2006 video does a great job explaining light field microscopy, courtesy of Stanford's 
[Light Field Microscopy][stanford-paper] lab, where the technique and LFAnalyze code were first developed.

<video controls style="width: 100%; max-width: 640px; display: block; margin: 0 auto;">
  <source src="/assets/video/lfmicroscope-intro.mp4" type="video/mp4">
</video>




[stanford-paper]: https://graphics.stanford.edu/papers/lfmicroscope/
[liston-lab]: https://www.listonlab.net/