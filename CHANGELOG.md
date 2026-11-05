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
- Onboarding in two batches: a trial batch on the last month, started after a short volume recap and an explicit go, is used to build and calibrate the first tree; the full history (all time or a chosen start date) is then processed with the rules learned during calibration, again after an explicit go.
- Shipped features check: opportunities are checked against documentation and release notes. A feature that addresses an opportunity becomes a `shipped` solution with its release date, evidence is split before and after the release, and opportunities with no evidence since the release are proposed as `addressed`. The weekly synthesis checks new release notes.
- Onboarding tree workspace: the agent asks where in Notion to create the tree, checks the connector can write there, flags who will see the customer verbatims, reuses existing databases instead of duplicating them, and creates them only after confirmation.
- Onboarding progress: the agent shows the whole path at the start, opens and closes each step with its position ("Step 4 of 9"), keeps a progress line of what is done and what comes next, and reports progress during long steps. The change of course follows the same pattern.

### Changed
- The repository is now `anthonyverbois-ai/live-product-discovery-skills`: the install command and the plugin manifest links point to the new name. The plugin name and its commands (`/live-product-discovery:…`) are unchanged.
