# Visual tree (live view, v0.2): specification

The visual tree is a page that shows the tree as it is now. It is what the plugin delivers: the onboarding publishes it and every run refreshes it. Notion stays the source of truth. A PM who follows several squads gets one page per squad; a summary page across squads may come later.

## Where it stands

The page is delivered in two steps.

- **Now: a copy, refreshed at each run and on demand.** The page is built once, in this repository (`view/dist/live-view.html`). `ost-view` writes the squad's tree to a data file and publishes the page with that file next to it, then publishes again to the same address at the end of every run, or when the user asks. A change made in Notion shows after the next refresh. Decisions are taken in Notion: the page links to the row to decide.
- **Later: a page that reads Notion when it opens**, with the viewer's own access, and writes the squad's decisions back. It then never needs to be published again.

The sections below describe the page in full. What the copy does not do yet is marked "later".

## Main content

- **The whole tree**: north star (if any), active outcome, opportunities, sub-opportunities, solutions, assumptions.
  - Opportunities are numbered by priority among their siblings: 1, 2, 3 for branches, 1.1, 1.2 for the sub-opportunities of branch 1. Never show the global rank on the tree: it reads like an outline number.
  - Each opportunity shows its customer accounts first and in bold: they make the rank. Its evidence count, its prospects and the revenue of its accounts follow, lighter: they size the need without moving the rank (revenue only breaks ties). No count is larger than the title. The date of its last evidence and its signals come next. The legend above the tree says the same in one line ("Ranked by customer accounts ..."), so a reader does not take the largest number for the reason of a rank. "New today" and "+N today" are the only tags on a card. A branch with sub-opportunities says how its evidence splits ("6 of its own, 14 in 3 sub-opportunities"): its count covers both, so the counts of the sub-opportunities shown do not add up to it.
- **Header**: the page title only (tree and squad). The outcome and the north star appear once, at the top of the tree. With several outcomes, the tree shows one section per outcome; with none yet, it starts with its opportunities.
  - Solutions are a foldable level under each opportunity, folded by default. A solution linked to the backlog shows its backlog status.
  - Proposed creations sit below the tree, unnumbered, under "Waiting for a decision"; candidates (below the evidence threshold) under "Too early to rank", except a candidate that belongs under a branch of the tree: it is shown there, unnumbered, after the ranked sub-opportunities. Parked opportunities sit below too, under "Set aside for now", with one sentence saying what that means.
- **Filter by feature**: when the tree covers several features of the squad, a filter shows one feature at a time. Opportunities keep their priority number when filtered.
- **Links to Notion**: the outcome, every opportunity and every solution open their Notion page in a new tab.
- **What changed today**: a badge on everything that moved since the previous run, and the latest daily recap in a side panel.
- **What the tree holds, then what the last run did**: the first block of the page opens with the number of items in the squad's scope since the tree started (the sum over the sources of evidence; a signal source counts over a window and keeps its own figure), with the volume of each source. Only what feeds the tree is shown: the total read, out-of-scope items included, is on hover. The recap of the last run comes under it, so that the last ingestion is not taken for the whole tree.
- **Evidence**: clicking the counts of an opportunity shows its verbatims, each with a link to the original call or ticket. A parent shows the verbatims of its sub-opportunities with its own. The copy holds the most recent verbatims; the others are in Notion.
- **Changes made by the agent**: what the agent changed on its own since the last run carries a discreet marker, with its reason on hover; it can be undone with `ost-undo`.
- **Proposed creations, decided on the card** (later; in the copy, the card links to the row to decide in Notion): a proposed creation under "Waiting for a decision" shows where the agent would place it and why it did not add it on its own. Four actions on the card: accept, merge with an existing opportunity, set aside, reject. Each action only sets the Changes row (`accepted`, `edited` with the target, `rejected`): the card then reads "decided, applied at the next run", and the next run carries it out, logs the correction when the decision differs from the proposal, and gives the opportunity its number. Until the run, the decision can be taken back from the page (the row returns to `proposed`). The same decision shows in Pending decisions.
- **Pending decisions**: approve or reject structural proposals from the page (later; in the copy, each proposal links to its row in Notion). They are the rows of the Changes database with the status `proposed`; the decision updates the row and is logged as a correction when it differs from the agent's proposal. The next run carries the decision out: until then the row shows "accepted, applied at the next run".
- **Timeline** (later): see the tree as it was on a past date, rebuilt from the Changes database.

## Secondary information

Shown discreetly, at the bottom or in the margin of the page:

- **Last refresh**: date and time of the last run (`Finished at` in the run log), shown in the badge at the top of the page, with its age in days, and in the title of the daily recap, so the reader knows how fresh the tree is. The date the copy was made is never shown as the date of the tree: a page published again without a run is not a refreshed tree. It sits in the badge's hover text and in the footer. If the last run is older than expected (for example more than one working day for the daily run), show it as a warning.
- **Source health**: one dot per source next to the recap title (green ok, yellow partial, red failed, gray not connected), followed by its number of items: for a source of evidence, the items in the squad's scope; for a signal source, what it counted over its window. The tool, the last successful read, the total read or the items mapped to an opportunity, and the detail are on hover. When a source is partial or failed, a banner under the recap says which one, since when, and what the tree may miss. Replaced and removed sources are not shown. Read from the Sources database.
- **Tree changelog**: the latest changes to the tree, newest first. For each: date, what changed, and who made it (applied by the agent, or decided by the squad), with a link to its run. Built from the Changes database.
- **Agent autonomy** (later): a small panel that shows what the agent does on its own and what it still proposes, one line per type of structural change, in three groups:
  - **Done by the agent on its own**: the changes it always makes (attach evidence, update counts and ranks, …) and the types it has earned.
  - **Still proposed**: for each type, its last 5 decisions as five dots, newest on the right (filled: accepted without edits; hollow: edited, rejected or undone; empty: no decision yet), and one plain sentence on what the threshold asks, for example "3 of the last 5 accepted as they were; it takes 4". A type sent back to proposals says since when, and that only decisions made after that date count.
  - **Always decided by the squad**: the outcome and north star, park, split, archive.
  When `autonomy_per_type` sets a type, the line says "set by the squad" instead of the dots. With `autonomy: proactive` or `propose-only`, one sentence states the setting instead. Never show the panel as a countdown, a progress bar or a percentage towards "full automation": some changes stay human by design, the dots can go back after an edit or an undo, and a squad that accepts proposals to unlock a type would distort the signal autonomy relies on. The panel informs; it is not a goal. Computed from the Changes database (the squad's decisions per type) and the configuration: no new data.
- **Plugin version**: the version that produced the last run, with a link to the plugin's `CHANGELOG.md` on GitHub.

## Data it reads

The copy reads one file, published next to the page: see "Data file" below. The rest of this section describes the page that reads Notion.

The view loads the tree and its counts only. An opportunity's verbatims load when it is opened, so the page stays fast with thousands of pieces of evidence.

Everything comes from the Notion databases described in `templates/notion-data-model.md`: outcomes, opportunities, evidence, solutions, assumptions, run log, corrections, sources and changes. The page writes only decisions on pending proposals: the Changes row and, when needed, a correction.

The page reads Notion with the viewer's own connector, so it follows "Reading the databases" in the data model: one database per query, and the counts stored on each opportunity, never rollups. It works on every Notion plan.

## Data file

`ost-view` writes one JSON file, `data.json`, published next to the page. Every value is copied from Notion; a value Notion does not hold is left out. Dates are `YYYY-MM-DD`; a date with a time is ISO 8601 with its time zone, and the page shows it in the viewer's own time.

| Key | Content |
| --- | --- |
| `meta.squad` | The squad's name |
| `meta.publishedAt` | When this copy was made (hover text of the badge and footer) |
| `meta.lastRefresh` | Finished at of the last finished run, written with its time zone (the badge at the top) |
| `meta.treeNotion` | Link to the tree's Notion page |
| `meta.outcome`, `meta.outcomeSince`, `meta.outcomeNotion`, `meta.northStar` | The active outcome, its start date, its Notion page, and the north star |
| `meta.focus` | For a squad with no outcome yet: what the tree is for |
| `meta.pluginVersion`, `meta.changelogUrl` | The version that produced the last run, and the link to the plugin's changelog |
| `meta.sources[]` | One entry per source: `name`, `tool`, `status` (`success` for ok, `warning` for partial, `error` for failed, `neutral` for not connected), `lastOk`, `detail`; for a source of evidence or a signal source, `items` and `inScope` (Total items and In scope); for a signal source, `window` too (the days its count covers) |
| `meta.recap` | The recap of the last run: `analysed` (what was read, in a few words) and `lines` (one string per line) |
| `opportunities[]` | `id` (any stable key), `notion`, `name`, `status`, `area`, `evidence`, `accounts`, `prospects`, `arr`, `lastEvidence`, `signals`; `rank` when ranked; `parent` on a sub-opportunity and `children` (a list of `id`) on its parent; for a proposed creation, `proposedParent`, `hesitation` (why the agent did not create it on its own) and `decideNotion` (its row in Changes); optional marks of the last run: `isNewToday`, `trend` (evidence gained), `movedFrom` (its previous number), `byAgent` (the reason of a change the agent made) |
| `evidence[]` | `opp` (the `id` of its opportunity), `verbatim`, `need`, `source`, `account`, `type` (the account type), `kind`, `date`, `confidence`, `link` |
| `solutions[]` | `opp`, `name`, `notion`, `status`, `backlogStatus`, `released`; `assumption` and `assumptionResult` for the riskiest assumption |
| `pending[]` | The proposals waiting for a decision: `id`, `kind`, `title`, `detail`, `notion` (the row in Changes), and `opp` when it concerns an opportunity of the file |
| `changelog[]` | The latest changes: `date`, `change`, `by` (`agent` or `squad`) |

The page shows one outcome for now. With several active outcomes, write them in `meta.outcome`, separated by " · ".

## Constraints

- The page opens in Claude (web or app). The copy is private until the user shares it. The page that reads Notion will use the viewer's own access, approved the first time.
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
| Last refresh and source health | `Timestamp`, `StatusDot`, `Banner` |
| Agent autonomy, one line per type | `MetadataList`, `StatusDot` |
| Tree changelog and run details | `Table`, `MetadataList` |
| Loading and empty states | `Skeleton`, `EmptyState` |

Astryx has no graph component. The visual map of the tree (outcome at the top, branches below) is drawn with plain layout and CSS around Astryx components; `TreeList` remains the accessible alternative to the map.

### Version pinning

Astryx is in beta and ships several releases a week. The view pins one exact version, at least two weeks old when it is adopted (currently `0.7.2`), and upgrades deliberately, never automatically.

### Packaging: one self-contained file

Pages published in Claude can load scripts only from a few public CDNs (Astryx's own CDN guide relies on esm.sh, which is not one of them), and stylesheets only from Google Fonts. The view is therefore built into a single self-contained HTML file: React, Astryx and its CSS are bundled and inlined at build time, and only the Figtree font is loaded from Google Fonts.

The repository keeps the view's source, the build script and the built file. Users of the plugin never build anything: `ost-view` publishes the built file. It holds no data and no title: the squad's `data.json` is published next to it, and the title is given at the publication.

### Demo and test data

Without a data file next to it, the page shows fictional data from `view/src/demo-data.js`, mirroring the demo tree used to test the Notion data model. `view/src/data-large.js` is a larger tree (10 branches across 4 features) to check how the view holds up; build it with `LPD_DATA=large node build.mjs`.
