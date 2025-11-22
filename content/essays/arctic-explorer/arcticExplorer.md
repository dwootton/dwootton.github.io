---
title: "Arctic Explorer"
subtitle: "Google Maps for the Arctic"
category: "Essays"
date: "2019-01-01"
tags:
  - Mapping
  - Representations
  - Arctic
desc: "Interactive mapping tools for Arctic exploration and navigation"
thumbnail: "thumbnail.png"
alt: "apple and shaking hands"
githubLink: "https://github.com/dwootton/Arctic-Explorer"
liveLink: "https://www.dylanwootton.com/Arctic-Explorer/"
demoLink: "https://www.youtube.com/watch?v=EbsGiAUuHX0"
paperLink: "https://www.dylanwootton.com/papers/2019_infovis_arctic_explorer.pdf"
assumed_audience: "Researchers who work in data visualization"
---

![A Mockup of the interface](https://i.imgur.com/BXEx4bd.png)

### Abstract

The Arctic seascape plays an important role in North American trade and defense; however, over recent years, the Arctic has undergone radical changes, altering current shipping routes and opening up new previously blocked paths. This work presents Arctic Explorer, a tool to visualize sea-ice concentration along paths over time. Arctic Explorer is used to circumnavigate areas expected to be blocked with ice and discover new routes that may have opened up.

### Problem

Current approaches to understanding sea-ice in the arctic often rely on static maps. While useful, these maps do not provide the ability to understand how sea-ice changes over time and space– this is particularly important where spatial-temporal ice concentration is needed to understand the impact of sea-ice on shipping routes.

### User Research

We conducted **semi-structured interviews** with two Arctic researchers who are part of [The Golden Lab](https://www.math.utah.edu/~golden/). The researchers were asked to describe their current workflow and using a [modified creative visualization workshop](https://vdl.sci.utah.edu/publications/2018_infovis_creative-workshops/), we elicited their analysis goals. This highlighted the researchers' need for seeing how sea-ice changes across specific landmark locations over time.

![Whiteboard prototypes of Arctic Explorer](https://i.imgur.com/MiY0wQ7.png)

### Solution

We developed a prototype visualization tool using [D3.js](https://d3js.org/) and Python that allowed researchers to interactively analyze their data across specific locations and time ranges of interest. This prototype contributed multiple novel interaction techniques, including: Temporal Ordered Spatial Matrix Highlights, Heatmap-based Temporal Selection, and Path Highlighting.
![A user interacting with the prototype](https://i.imgur.com/s96oiXg.gif)

### Reception

Arctic Explorer was awarded a Best Poster Honorable Mention (top 3/68) at the [IEEE Visualization Conference 2019](https://ieeevis.org/year/2019/info/awards/best-poster-awards). It's interaction techniques further contributed to spatial-temporal data analysis literature, and spawned additional research projects such as AQ Routes.

We conducted a followup interview with the researchers to understand their experience with the prototype. The researchers were able to quickly understand the visualization and identified patterns and trends in sea-ice concentration that would have been difficult to detect using traditional methods.
