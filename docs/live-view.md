# Live view (v0.2) – specification

The live view is a page that shows the tree as it is now. Notion stays the source of truth: the page reads it each time it opens, so it never needs to be republished. The onboarding publishes it for each user, connected to their own Notion databases. A PM who follows several squads gets one view per squad; a summary page across squads may come later.

## Main content

- **The whole tree**: north star (if any), active outcome, opportunities, sub-opportunities, solutions, assumptions.
  - Opportunities are numbered by priority among their siblings: 1, 2, 3 for branches, 1.1, 1.2 for the sub-opportunities of branch 1. Never show the global rank on the tree: it reads like an outline number.
  - Each opportunity shows its evidence and accounts counts in bold, never larger than its title, then the date of its last evidence. "New today" and "+N today" are the only tags on a card.
- **Header**: the page title only (tree and squad). The outcome and the north star appear once, at the top of the tree.
  - Solutions are a foldable level under each opportunity, folded by default, with a control to show or hide them all.
  - Candidates sit below the tree, unnumbered, under "Waiting for a decision". Parked opportunities sit below too, under "Set aside for now", with one sentence saying what that means.
- **Filter by feature**: when the tree covers several features of the squad, a filter shows one feature at a time. Opportunities keep their priority number when filtered.
- **Links to Notion**: the outcome, every opportunity and every solution open their Notion page in a new tab.
- **What changed today**: a badge on everything that moved since the previous run, and the latest daily recap in a side panel.
- **Evidence**: clicking the counts of an opportunity shows its verbatims, each with a link to the original call or ticket.
- **Pending decisions**: approve or reject structural proposals from the page. The decision is written to Notion and logged as a correction when it differs from the agent's proposal.
- **Timeline**: see the tree as it was on a past date, rebuilt from the run log.

## Secondary information

Shown discreetly, at the bottom or in the margin of the page:

- **Last refresh**: date and time of the last run (`Finished at` in the run log), shown in the title of the daily recap so the reader knows which day "today" is. The status of each source at that run sits at the bottom. If the last run is older than expected (for example more than one working day for the daily run), show it as a warning.
- **Tree changelog**: the latest changes to the tree, newest first. For each: date, what changed, and who made it (applied by the agent, or decided by the squad), with a link to the run log entry. Built from the `Changes` of the run log and from the corrections database.
- **Plugin version**: the version that produced the last run, with a link to the plugin's `CHANGELOG.md` on GitHub.

## Data it reads

The view loads the tree and its counts only. An opportunity's verbatims load when it is opened, so the page stays fast with thousands of pieces of evidence.

Everything comes from the Notion databases described in `templates/notion-data-model.md`: outcomes, opportunities, evidence, solutions, assumptions, run log and corrections. The page writes only decisions on pending proposals.

The page reads Notion with the viewer's own connector, so it follows "Reading the databases" in the data model: one database per query, and counts computed from relations and evidence rows (or a grouped count when the plan allows it), never from rollups. It works on every Notion plan.

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
| Solutions folded under each opportunity | `Collapsible` |
| Link to the Notion page | `Icon` (`externalLink`) |
| "New today" and statuses, as plain text | `Text` |
| Approve or reject a pending proposal | `Button`, `Toast` |
| Switching between tree, pending decisions and changelog | `TabList` |
| Last refresh and source status | `Timestamp`, `StatusDot`, `Tooltip` |
| Tree changelog and run details | `Table`, `MetadataList` |
| Loading and empty states | `Skeleton`, `EmptyState` |

Astryx has no graph component. The visual map of the tree (outcome at the top, branches below) is drawn with plain layout and CSS around Astryx components; `TreeList` remains the accessible alternative to the map.

### Version pinning

Astryx is in beta and ships several releases a week. The view pins one exact version, at least two weeks old when it is adopted (currently `0.7.2`), and upgrades deliberately, never automatically.

### Packaging: one self-contained file

Pages published in Claude can load scripts only from a few public CDNs (Astryx's own CDN guide relies on esm.sh, which is not one of them), and stylesheets only from Google Fonts. The view is therefore built into a single self-contained HTML file: React, Astryx and its CSS are bundled and inlined at build time, and only the Figtree font is loaded from Google Fonts.

The repository keeps the view's source, the build script and the built file. Users of the plugin never build anything: the onboarding publishes the built file.

### Demo and test data

Until the view reads Notion, it runs on fictional data in `view/src/data.js`, mirroring the demo tree used to test the Notion data model. `view/src/data-large.js` is a larger tree (10 branches across 4 features) to check how the view holds up; build it with `LPD_DATA=large node build.mjs`.
