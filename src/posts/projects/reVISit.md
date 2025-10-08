---
title: "ReVISit"
subtitle: "Tools to analyze user interactions in detail"
category: "Projects"
subcategory: "Seedling"
planted_at: "2020-01-01"
tags:
  - UX Research
  - Session Replay
  - Visualization
desc: "Tools to analyze user interactions in detail"
thumbnail: "./images/reVISit/thumbnail.png"
alt: "apple and shaking hands"
githubLink: "https://github.com/visdesignlab/revisit/"
demoLink: "https://www.youtube.com/watch?v=_8AkZQZ4L1Q"
liveLink: "https://vdl.sci.utah.edu/reVISit/"
paperLink: "https://www.dylanwootton.com/papers/2021_chi_revisit.pdf"
---

<iframe width="100%" height="315" src="https://www.youtube.com/embed/_8AkZQZ4L1Q" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

### Abstract

How do users _actually_ use your websites? In contrast to interviews, session replay technology can let you see what your users actually click in on; however, existing session replay tools like HotJar and LogRocket provide high level feedback that isn't useful when analyzing user behavior of complex applications. reVISit is a visualization tool that enable UX researchers to quickly analyze user interactions to evaluate design decisions and improve user experience.

### Problem

When visualization researchers develop new interactive visualizations, how do they know if they're effective? Typically, researchers will conduct a user study to evaluate their design. However, these studies often give users a task and measure a user's time and accuracy completing it. However, [many researchers have acknowledged](https://beliv-workshop.github.io/) that these metrics are insufficent for evaluation. reVISit is a design methodology and tool to derive new measures for evaluation methods. reVISit allows researchers to replay participant sessions for qualitative coding and craft new quantitative metrics from user interactions through ReGex-like filtering, grouping, and analysis of interaction traces.

### User Research

Our target user were interaction designers and visualization researchers who wanted to analyze user interactions in detail. We conducted a reflective analysis of our own experience of running user studies, and conducted informal interviews

### Solution

This project contributed reVISit, a methodology for studying how interactive visualizations are used. This methodology involves instrumenting the visualization with a session replay tool and analyzing the interaction traces to derive new metrics for evaluation (such as time-to-first-click or number-of-action-reversals). The methodology was implemented for 2 user studies (300+ participants).

![reVISit Methodology](https://i.imgur.com/XTPQW4o.png)

The reVISit tool allows researchers to view both overviews and participant level data through two views: an overview interface and a replay interface. The overview interface automatically creates meaningful groups of users to show how different interaction patterns change performance.

![reVISIT Overview Interface](https://i.imgur.com/QxmQO3o.png)

The replay interface allows researchers to quickly filter and group interaction traces to identify patterns in user behavior. It also allows researchers to tag participant data, view individual participant sessions and analyze their interaction traces in detail.

![reVISit Qual Coding Interface](https://i.imgur.com/exavJfD.png)

### Reception

We found that this methodology revealed novel interaction patterns, and the analysis of individual analysis strategies helped to provide a more nuanced understanding of user performance. The reVISit methodology enabled designers to better understand how their design decisions impact user performance and helps to identify usability problems with interactive visualization tools.

This work [led to a 1M+ grant](https://www.nsf.gov/awardsearch/showAward?AWD_ID=2213756&HistoricalAwards=false) from the National Science Foundation to further improve the methodology and reVISit tool.
