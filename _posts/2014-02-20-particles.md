---
layout: post
title: GPU Particle Simulations
date: 2014-06-20 13:35:00 -0400
tags: [projects, tech, visualization, shaders]
image: particles.jpg
type: video
github: https://github.com/lrassaby/magical-particles
---

For our final graphics project, [Jayme Woogerd][jayme] and I implemented a
configurable particle system in C using OpenGL buffer 
objects, instancing, and GLSL shaders.

We started by using fixed-pipeline OpenGL, rendering each particle as a point.
Most of the parameters are configurable, including the number of 
particles generated, the randomness spread, camera direction, 
and location of particle generation, and the physical forces.

<div class="iframe-wrapper">
<iframe width="560" height="315" src="https://www.youtube.com/embed/d2dnotW9SSY" frameborder="0" allowfullscreen></iframe>
</div>

We then added vertex buffer objects and instancing. Instancing 
allows us to define a single two-dimensional template billboard, 
shared by all particles. This 2-dimensional image is 
rotated to always face the camera - giving the illusion 
that the particles are 3-dimensional, while keeping the 
rendering fast.

<div class="iframe-wrapper">
<iframe width="560" height="315" src="https://www.youtube.com/embed/kWU0Iwb4JR0" frameborder="0" allowfullscreen></iframe>
</div>           
               
Attributes that are unique to a given particle (such as size, 
color, position and age) are stored and sent to the GPU via 
buffer objects.
                
<div class="iframe-wrapper">
<iframe width="560" height="315" src="https://www.youtube.com/embed/RpUe9H8xyJo" frameborder="0" allowfullscreen></iframe>
</div>          

 Finally, we used the GL shader language to implement different
                texture maps and animations.

<div class="iframe-wrapper">
<iframe width="560" height="315" src="https://www.youtube.com/embed/1RiWas8iHeU" frameborder="0" allowfullscreen></iframe>
</div>          

        
[github]: https://github.com/lrassaby/magical-particles
[jayme]: http://jwoogerd.github.io/