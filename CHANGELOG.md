# Changelog

All notable changes to this plugin are listed here.

## Unreleased

### Added
- Live view technical choices in `docs/live-view.md`: built with Astryx (Meta's design system), pinned version, packaged as one self-contained file.
- Live view metadata: the run log now records the finish time, the status of each source and the plugin version, and who made each change (agent or squad). They feed the "last refresh" date and the tree changelog of the v0.2 live view, specified in `docs/live-view.md`.
- Repository skeleton: plugin manifest, marketplace entry, contribution guide, pull request and issue templates.
- Draft skills: `ost-setup` (onboarding), `ost-rules`, `daily-run`, `weekly-synthesis`.
- Templates: Notion data model and sources configuration example.
- Change of course: new `ost-change-outcome` skill to re-anchor the tree on a new outcome or north star, with an outcome history, a `parked` status for opportunities and a `paused` status for solutions. The weekly synthesis now flags drift between the evidence and the active outcome.
- Onboarding pre-flight check: before the backfill, a recap of what will be processed per source (connector, period, volume, filters, samples, alerts, what is left out, estimated duration), with three choices: go, adjust, or run on a two-week sample first. The backfill never starts without an explicit go.

### Changed
- The repository is now `anthonyverbois-ai/live-product-discovery-skills`: the install command and the plugin manifest links point to the new name. The plugin name and its commands (`/live-product-discovery:…`) are unchanged.
