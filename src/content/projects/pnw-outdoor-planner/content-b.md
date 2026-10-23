# PNW Outdoor Planner

## The first real run [!id](first-run)

The acceptance test was a two-day ski tour on Mt. Baker, Oct 31 to Nov 1, 2026: the lower Coleman Glacier via Heliotrope Ridge, then Herman Saddle from Artist Point. The run took ten and a half minutes, ten agents, and no errors. The verdict was *Wait, reassess by Oct 28*.

The reasons were the ones a careful partner would have given. No forecast reached either day; the NWS grid ended Oct 29, and the discussion hinted at an active pattern in early November at low confidence. SNOTEL read zero at 4,940 ft, so the second day sat at the snow line with no evidenced cover. No Coleman Glacier report existed inside fourteen days, which put the glacier hard stop at borderline and set a date by which it would fire. The avalanche center was off season, so any slab that formed would have no rating to read it against. The first day's daylight margin came to 1.44 hours, which crevasse probing eats.

It also caught something I had wrong. My itinerary notes said the access road was closed at mile three, which was stale text from a trail page. The Access agent found an August reopening in a local newspaper and October trip reports of cars at the trailhead, and the synthesizer superseded the Contingency agent's five-mile walk-out plan with that evidence. It found the Artist Point gate too, and re-timed the second day from the lower lot.

Reading the report against its sources changed four things. Webcams now resolve nearest-by-coordinate, because a static list had put two passes a hundred miles away on a Baker trip. Satellite imagery is mandatory on a glaciated trip with no recent report, because it is the one lever that clears the glacier rule and the Ground agent had skipped it. Itinerary notes are hints to check and never readings, because mine had reached an agent as fact. And the Clock agent now states each row's return time as start plus moving plus stops, because the critic had let one row through with a return before its turnaround.

## Design decisions [!id](design)

- **The workflow script has no clock and no filesystem.** Today's date and the plugin root arrive as arguments, so a run is reproducible from its inputs and the same itinerary can be re-run a week later against the same code.
- **Sonnet reads, Opus judges.** Five of the six research agents run on Sonnet. Snow and the synthesizer run on Opus, because laying avalanche problems over terrain and weighing an irreversible hazard are the two places judgment carries the result.
- **The source catalog is the contract.** Every source has an owner agent, what it provides, and how it enters the plan. An ad hoc source an agent reached for on a trip earns a row after the trip; the Baker run added regional road news and USGS 3DEP slope sampling.
- **Season windows carry a verify-by date.** A gate schedule or a permit window is a fact with a shelf life. The resolver warns when one lapses, and the agent reading that unit treats the window as unverified instead of trusting it silently.

## Install [!id](install)

The plugin installs from its own marketplace in two commands:

```bash
claude plugin marketplace add tannerorourke/pnw-outdoor-planner
claude plugin install pnw-outdoor-planner@pnw-outdoor-planner
```

Then `/pnw-outdoor-planner:plan` with a trip in a sentence. Intake pins down the dates and a coordinate for every day, the resolver shows the bundles before any research spends tokens, and the report and a GPX of the route land in a cache folder for Gaia or CalTopo.
