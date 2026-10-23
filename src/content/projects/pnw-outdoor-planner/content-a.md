# PNW Outdoor Planner

## Overview [!id](overview)

Planning a mountain trip requires quite a fair amount of data wrangling. Living in the Pacific Northwest, a two-day ski tour on Mt. Baker, for example, touches any number of NWS point forecast and the forecaster's discussion, trailhead access, SNOTEL data, NWAC observations, Forest Service alerts, WSDOT road/pass conditions, trip reports (information and conditions), and sunrise and sunset. Each piece of data adds different factors to a Go/No-Go verdict that is catastrophic in the true-negative (you go and something bad or unexpected happens) case.

I built a Claude Code plugin that answers that question for backcountry travel in Washington, Oregon, Idaho, and the British Columbia fringe. It takes an itinerary with a coordinate for every day, resolves each day to the sources that govern it, sends six research agents to read them, and returns one report containing the verdict, the reasoning chain under it, and what would flip it. Recently, I added to the report optional morning-of check, timing, contingency plans, a self-curated list of interactive maps, and route GPX files for Gaia or CalTopo.

## How it works [!id](how)

1. First, bundle each day of a trip's trailhead and high point, finds the state, NWS office and grid cell, avalanche zone (for winter trips), land units that contain the trail, nearest SNOTEL stations, river gauges, and webcams by distance. Each bundle contains forecast URLs, the permit systems in window, the sun times, and the curated filled in map links.
2. Using the bundle as context, run six agents in parallel, each owning a key decision factor:
- Access reads roads, gates, permits, and fire.
- Sky reads the forecast, the discussion, alerts, and smoke.
- Ground reads trail conditions, crossings, glacier state, and trip reports.
- Snow reads avalanche products and telemetry and lays the problem types over the route's own slope angles and aspects.
- Clock computes pace, daylight, and turnaround from the route stats.
- Contingency covers bailouts, coverage, and search and rescue.
3. An Opus agent synthesizes the 6 reports using a seven-step protocol that weighs the reports together, taking into account strict No-Go use cases. It provides a Go/No-Go verdict that a critic then checks to ensure sound reasoning, sending back for at most one revision.
