# PNW Outdoor Planner

## Design decisions [!id](design)

- **The workflow script has no clock and no filesystem.** Today's date and the plugin root arrive as arguments, so a run is reproducible from its inputs and the same itinerary can be re-run a week later against the same code.
- **Sonnet reads, Opus judges.** divvying up trip planning into its atomic factors allows smaller models to focus on smaller tasks. This enforces a cleaner no-go verdict by the synthesizer, which uses a strong model for the important inference. The adversarial critic is just as important, ensuring that irreversible hazards are taken into account in a never-fail scenario. This dramatically improved the quality of contingency plans in contested evals.
- **The source catalog is a loose contract.** Common sources (weather.gov, NWAC, etc) are important to use, but not always the full picture. For example, a run on Mt. Baker added regional road news and USGS 3DEP slope sampling.
- **Aggressively validate information** Permit windows change year-to-year, using a March 2025 trip report in March 2026 is catastrophic, so we tag any source as unverified until proven otherwise.

## Install [!id](install)

**From claude.ai/Cowork:**
Settings $\rightarrow$ Plugins $\rightarrow$ search 'tannerorourke' $\rightarrow$ Add

**From CLI:**

```bash
claude plugin marketplace add tannerorourke/pnw-outdoor-planner
claude plugin install pnw-outdoor-planner@pnw-outdoor-planner
```

Then `/pnw-outdoor-planner:plan` with a description of the trip. Intake pins down the dates and daily coordinates, shows the bundles before research spends tokens, and lastly adds the report plus a GPX of the route in a cache folder for Gaia or CalTopo.
