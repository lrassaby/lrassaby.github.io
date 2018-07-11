---
layout: post
title: Converge — Ports Hackathon
date: 2017-01-22 00:00:00 -0000
github: https://github.com/lrassaby/converge
demo: http://rassaby.com/converge/
image: converge-bg.png
tags: [projects, tech, design, hackathon]
excerpt_separator: <!--more-->
---
In its 2016 "Visions of Future Shipping" [paper][wartsila-visions], [Wärtsilä][wartsila] proposed ideas that could change the way
that shipping companies operate in the future. One of the most novel ideas was ships traveling in convoy. 
[Researchers at MIT][mit-study] explain that "like birds and fighter jets flying in formation, or bikers 
and race car drivers drafting in packs, vehicles experience less aerodynamic drag when they drive close together."

For the 2017 Ports and Logistics [Hackathon][hackathon], we set about to take create a platform for helping
ships to form convoys for 10 - 20% in improved fuel efficiency. <!--more--> Aside from the fuel efficiency gains, 
traveling in convoys also allows ships to share resources like medical supplies rather than make expensive detours.

The following visualization, created by [Kiln][kiln] and the [UCL Energy Institute][ucl], shows the global movement of 
ships in 2012.

<iframe src="//www.shipmap.org" style="width: 100%; height: 600px; border: 0" frameborder="0"></iframe>

To allow these ships to become convoys, we created [Converge]. The target market is small shipping companies that could 
collaborate with each other to compete with the [giant, more fuel-efficient ships][maersk-eee] 
of their goliath competitors. Based on the data shown above and other ship lane data, we chose 5 of the highest-traffic 
routes for the first version of the product.

Each dot represents a convoy of ships traveling along one of the routes.


![converge-img]


[kiln]: https://www.kiln.digital/
[maersk-eee]: https://en.wikipedia.org/wiki/Maersk_Triple_E-class_container_ship
[ucl]: http://www.bartlett.ucl.ac.uk/energy
[hackathon]: https://nyc-portshackathon.devpost.com/
[wartsila]: https://www.wartsila.com/
[wartsila-visions]: https://www.wartsila.com/media/news/06-09-2016-wartsila-presents-its-visions-of-future-shipping
[mit-study]: http://news.mit.edu/2016/driverless-truck-platoons-save-time-fuel-1221
[converge]: http://rassaby.com/converge/
[converge-img]: /assets/img/converge.png "Converge Screenshot"