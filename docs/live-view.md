# Live view (v0.2) – specification

The live view is a page that shows the tree as it is now. Notion stays the source of truth: the page reads it each time it opens, so it never needs to be republished. The onboarding publishes it for each user, connected to their own Notion databases.

## Main content

- **The whole tree**: north star (if any), active outcome, opportunities, sub-opportunities, solutions, assumptions. The size or color of each opportunity reflects the volume and recency of its evidence. Parked opportunities are shown apart, dimmed.
- **What changed today**: a badge on everything that moved since the previous run, and the latest daily recap in a side panel.
- **Evidence**: clicking an opportunity shows its verbatims, each with a link to the original call or ticket.
- **Pending decisions**: approve or reject structural proposals from the page. The decision is written to Notion and logged as a correction when it differs from the agent's proposal.
- **Timeline**: see the tree as it was on a past date, rebuilt from the run log.

## Secondary information

Shown discreetly, at the bottom or in the margin of the page:

- **Last refresh**: date and time of the last run (`Finished at` in the run log), with the status of each source at that run. If the last run is older than expected (for example more than one working day for the daily run), show it as a warning.
- **Tree changelog**: the latest changes to the tree, newest first. For each: date, what changed, and who made it (applied by the agent, or decided by the squad), with a link to the run log entry. Built from the `Changes` of the run log and from the corrections database.
- **Plugin version**: the version that produced the last run, with a link to the plugin's `CHANGELOG.md` on GitHub.

## Data it reads

The view loads the tree and its counts only. An opportunity's verbatims load when it is opened, so the page stays fast with thousands of pieces of evidence.

Everything comes from the Notion databases described in `templates/notion-data-model.md`: outcomes, opportunities, evidence, solutions, assumptions, run log and corrections. The page writes only decisions on pending proposals.

## Constraints

- The page opens in Claude (web or app) and reads Notion with the viewer's own access; the viewer approves that access the first time.
- People outside the user's Claude organization see an empty page.

## Technical choices

### UI library: Astryx

The view is built with [Astryx](https://github.com/meta/astryx), Meta's open-source design system (MIT, React 19). It gives the view consistent, accessible components with dark mode, instead of hand-made UI.

| Need in the view | Astryx component |
| --- | --- |
| The tree as a navigable, keyboard-accessible list | `TreeList` |
| Evidence of an opportunity, opened on click | `Drawer` |
| "New today", statuses (candidate, active, parked) | `Badge`, `Token` |
| Approve or reject a pending proposal | `Button`, `Toast` |
| Switching between tree, pending decisions and changelog | `TabList` |
| Last refresh and source status | `Timestamp`, `StatusDot`, `Tooltip` |
| Tree changelog and run details | `Table`, `MetadataList` |
| Loading and empty states | `Skeleton`, `EmptyState` |

Astryx has no graph component. The visual map of the tree (outcome at the top, branches below) is drawn in SVG inside an Astryx layout; `TreeList` remains the accessible alternative to the map.

### Version pinning

Astryx is in beta and ships several releases a week. The view pins one exact version, at least two weeks old when it is adopted (currently `0.7.2`), and upgrades deliberately, never automatically.

### Packaging: one self-contained file

Pages published in Claude can load scripts only from a few public CDNs (Astryx's own CDN guide relies on esm.sh, which is not one of them), and stylesheets only from Google Fonts. The view is therefore built into a single self-contained HTML file: React, Astryx and its CSS are bundled and inlined at build time, and only the Figtree font is loaded from Google Fonts.

The repository keeps the view's source, the build script and the built file. Users of the plugin never build anything: the onboarding publishes the built file.
