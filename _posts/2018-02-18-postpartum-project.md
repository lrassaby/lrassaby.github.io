---
layout: post
title: Postpartum Project
date: 2018-02-18 00:00:00 -0000
tags: [projects, tech, design]
image: ppp-landing.jpg
website: https://postpartumproject.com
published: true
---
The Postpartum Project is one of the one of the largest online resource directories of postpartum specialists, with over 10k unique users per month. I had been curious about startups like [Quartet](https://quartethealth.com) and [Talkspace](https://talkspace.com) for a while, and I wanted to explore the space in a more concrete way. 

Zoe Hicks, a friend of mine who is therapist and mother herself, founded the Postpartum Project a few years ago to help new mothers find the care they need. This year, we decided to team up.

I started with a redesign of the site.

{% include captioned-image.html url="postpartum-old-landing.jpg" description="Before redesign" style="width: 100%" %}
{% include captioned-image.html url="postpartum-new-landing.jpg" description="After redesign" style="width: 100%" %}

## Design Elements


##### Logo


{% include captioned-image.html url="ppp-old-new-logos.jpg" description="Redesign of the logo" style="width: 100%;" %}

My goal in updating the logo was to create a memorable brand that symbolizes the link between parents and children. I 
considered hands, or arms holding a child. In the end, I chose to use feet because of how important walking is in 
childhood development. Feet also symbolize moving forward for the 1/5 of women who experience postpartum depression.

Finally, because Zoe is thinking of expanding with an app, we also wanted the logo to be something that could be used as an app logo.

##### Move blogs to the front page

Fundamentally, the Postpartum Project is both a blog and a provider network. We decided to move blog posts to the front 
page to highlight some of the content.

##### Simplified menus

There were too many menu options, and many were unused. Meanwhile, login wasn't possible directly from the front
page. I reduced the menu options, and added login functionality.

##### Fewer stock images of babies

For women who are going through postpartum depression, Zoe and I thought it might be challenging to see photos of happy babies
and families. We tried as much as possible to symbolize parenthood throughout the site without explicitly showing images of it.

##### Less verbose content

A lot of the content on the previous iteration of PPP was overly wordy and not very actionable. In this version, we
updated some of the pages with the most traffic so that people would be able to more easily find what they need.

##### Tech debt

Enabling a CDN, updating dependencies, and adding Google Analytics all helped modernize the way we developed the site.

## What's next?
My next plans are to improve search functionality and speed of the site. 

Working on the Postpartum Project has inspired me to understand the therapy-tech space better. There are hundreds of treatable 
mental health conditions. Multiply that with dozens of different treatment techniques and approaches, and it’s a headache to even know where 
to start looking for a therapist. Even if you find some promising therapists, getting [past their voicemail][atlantic] might 
mean calling multiple different therapists. And yet, many therapists still struggle to fill their caseloads. 

It’s clear there’s still plenty of room for startups to improve the space.





[ppp]: https://postpartumproject.com/
[ppp-old-landing]: /assets/img/postpartum-old-landing.jpg
[ppp-new-landing]: /assets/img/postpartum-new-landing.jpg
[atlantic]:  https://www.theatlantic.com/health/archive/2016/06/the-struggle-of-seeking-therapy-while-poor/484970/