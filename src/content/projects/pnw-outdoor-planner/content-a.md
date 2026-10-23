# PNW Outdoor Planner

## Overview [!id](overview)

Planning a mountain trip in the Pacific Northwest is a reading problem before it is a judgment problem. A two-day ski tour on Mt. Baker touches the NWS point forecast and the forecaster's discussion, SNOTEL telemetry, the avalanche center, the Forest Service alert page, WSDOT's gate schedule, trip reports, a river gauge, sunrise and sunset, and the volcano observatory. Each has its own as-of and its own idea of where the trip is. The question at the end is never *what is the weather*. It is *go or not, and what would change that answer*.

I built a Claude Code plugin that answers that question for Washington, Oregon, Idaho, and the British Columbia fringe. It takes an itinerary with a coordinate for every day, resolves each day to the sources that govern it, sends six research agents to read them, and returns one report: the verdict on top, the reasoning chain under it, what would flip it, a morning-of check, the timing, the contingency plan, and every source opened with its date.

## Resolution before reasoning [!id](resolver)

The part that decides which sources matter is deterministic Python. The resolver takes each day's trailhead and high point and finds the state, the NWS office and grid cell, the avalanche zone, the land units that contain the point (from a registry of fifty, smallest first), the nearest SNOTEL stations, river gauges, and webcams by distance, and the season switches that are on for that date. The output is one bundle per day, with the forecast URLs, the permit systems in window, the sun times, and the curated map links already filled in.

A model that opens the wrong forecast office or a stale closure page is usually a model that was never handed the right one. Making the choice in code puts it where it can be tested: the Baker run resolved to Seattle's office, zone WAZ301, Northwest Avalanche Center's West Slopes North, and the Mt. Baker-Snoqualmie National Forest, with the SR 542 season window flagged as past, before any agent spent a token.

## How a verdict is made [!id](verdict)

Six agents read in parallel, each owning a slice of the source catalog. Access reads roads, gates, permits, and fire. Sky reads the forecast, the discussion, alerts, and smoke. Ground reads trail conditions, crossings, glacier state, and trip reports. Snow reads avalanche products and telemetry and lays the problem types over the route's own slope angles and aspects. Clock computes pace, daylight, and turnaround from the route stats. Contingency covers bailouts, coverage, and search and rescue. Every reading carries a color, a source, an as-of, and a consequence stated for this party on this route, never the reading's generic meaning. When Access or Ground move the start or the distance, Clock runs again on the new numbers.

Hard stops come next, and they are applied by the script. An avalanche rating of High in a band the route touches, a warning-level weather product on the push day, a closed road or trailhead, an unavailable permit, a glacier with no report inside fourteen days, and an active fire or volcano alert each set a floor. The floor is *Wait* when the hit has a clearing time and *No-go* when it does not. The synthesizer, an Opus agent with a seven-step protocol, then weighs what is left: it weighs reversibility, so a hazard that commits the party before it shows is taken at its worst plausible reading, and it calibrates to the party. If it returns a verdict above the floor, the script lowers it and logs that it did. A critic then checks that every reading reached the report and sends it back for one revision at most.
