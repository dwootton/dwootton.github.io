---
title: "Interaction Archaeology"
subtitle: "What We Can Learn from the Traces of Our Interactions"
category: "Essays"
date: "2024-11-22"
planted_at: "2021-01-01"
tags:
  - Interaction Archaeology
  - UX Research
  - Session Replay
  - Visualization
  - User Behavior Analysis
desc: "Exploring how session replay and interaction trace analysis reveals hidden patterns in user behavior"
thumbnail: "./images/reVISit/thumbnail.png"
alt: "ReVISit interaction analysis interface"
githubLink: "https://github.com/visdesignlab/revisit/"
demoLink: "https://www.youtube.com/watch?v=_8AkZQZ4L1Q"
liveLink: "https://vdl.sci.utah.edu/reVISit/"
paperLink: "https://www.dylanwootton.com/papers/2021_chi_revisit.pdf"
assumed_audience: "Researchers who work in data visualization and UX"
---

Imagine you are watching a video of someone using a piece of software you designed. You see their mouse cursor hover over a button, hesitate for a split second, circle around it, and then finally click.

In that hesitation, you see a whole world of human cognition. You see uncertainty. You see them checking the surrounding context. You see the decision being weighed.

Now, imagine looking at the database log for that exact same moment:

```json
{"event": "click", "target": "submit_btn", "timestamp": 161902344}
```

The data is technically accurate, yet spiritually it *feels* false.

It captures the action, but it completely discards the thought that humans easily generate from watching the interaction. We are left with the "fossilized" remains of behavior, while the living intent has decayed away.

Back in '21 we published the first installation of the reVISit system. The goal of this system was to enable a sort of Interaction Archeology with the goal of asking "what can we learn from our users' interactions with our software?"

Here are some thoughts on future systems that aim to do this work:

## 1. The "In Situ" Principle: Context is King

In archaeology, an artifact loses almost all its value if you remove it from its context. A coin found in a market means trade; the same coin found in a mouth means burial rite. 

The same is true for digital interaction.

A "click" is meaningless if you don't know the state of the world when it happened. This is the fundamental difference between standard "logging" (recording events) and true "interaction snapshots" (recording state). Snapshots allow us to fully reconstruct the application's reality—using provenance systems like MobX, Trrack, or full session replay—to see exactly what the user saw.

Without capturing this "surrounding context"—such as what data was filtered out, or which error message was flashing in the corner—our interpretation of the user's intent is just a guess. We have to analyze behavior *in situ*.

> **Note:** This aligns with what anthropologist Lucy Suchman calls *Situated Action*. She argues that human behavior isn't just the execution of a cognitive plan, but an improvisation based on the immediate surroundings. If we just look at the plan (the log), we miss the "improvisation" (the struggle with the interface). But exploring how the environment drives the action is a dig for another day.

## 2. Typology: Grouping the Shards

Archaeologists deal with millions of pottery shards. To make sense of them, they create "typologies". These typologies group items by style or function to see patterns across a population.

In interaction analysis, we face a similar "shards" problem: thousands of low-level mouse and keyboard events that don't mean much individually. To solve this, reVISit uses an "Event Manager" that allows analysts to group low-level actions into high-level strategies.

For example, in one study, we found users dragging nodes in a network graph. On their own, these were just "drag" events. But by grouping them, we discovered a distinct "multi-drag" typology: users were using screen space to manually sort items, a strategy the tool wasn't explicitly designed for but that users invented to help them think.

## 3. Experimental Archaeology: The Playback

Sometimes, archaeologists can't figure out how a tool was used, so they build a replica and try to use it themselves. They re-enact the past.

We built this capability directly into reVISit. The "Playback View" allows analysts to re-run a participant's session step-by-step, rendering it in the original interface. This is essential because abstract data often fails to distinguish between different strategies.

By watching the "re-enactment," we could see why a user failed a task—for example, seeing that they misunderstood how neighbors were represented in a matrix. We moved from guessing at the log to witnessing the behavior.

