# Notion data model

Each squad's tree lives in one Notion page, created during onboarding: a configuration page and ten related databases. Everything a run needs is there, never in local files: a scheduled run may not see the user's computer.

## Configuration page

Each squad has one configuration page, a child of the tree's page, titled `LiveOST configuration – <squad>`.

- It holds the squad's configuration, laid out as in `sources.example.yaml`, in one YAML code block, and nothing else.
- Every run reads it first. A skill that changes the configuration (onboarding, change of course, change of sources) rewrites the whole block, then reads it back to check it.
- A Notion search on `LiveOST configuration` lists every squad set up.
- Never write credentials there: connectors handle authentication.

## Creation order

A relation needs its target database to exist. Create, in this order:

1. Outcomes.
2. Opportunities, with its relation to Outcomes; then add Parent as a two-way relation to itself (paired with Sub-opportunities).
3. Evidence, with its two-way relation to Opportunities.
4. Solutions, with its two-way relation to Opportunities.
5. Assumptions, with its two-way relation to Solutions.
6. Run log; then add the two-way relation from Evidence to Run log.
7. Corrections.
8. Sources.
9. Rules, with its two-way relation to Corrections (paired with Rule).
10. Changes, with its relations to Opportunities and Evidence, and its two-way relation to Run log (paired with Changes).

The nested display of sub-opportunities (Notion's Sub-items, based on Parent) is turned on by the user in the view's menu: the connector cannot do it.

## Reading the databases

The plugin must work on every Notion plan, free included. Read the databases this way:

- **One database per query.** Never join several databases in one query: the Notion connector allows it only on Business and Enterprise plans.
- **Row reads first.** Read rows with filters and sorts, up to 100 rows per call. This works on every plan. Read more than 100 rows in pages, and never load the whole evidence base at once.
- **Counts are stored, never rolled up.** The connector returns a reference instead of a rollup's value, on every plan. So the plugin writes Evidence count, Accounts and Last evidence on each opportunity itself, and everyone (runs, live view, people in Notion) reads them as plain properties:
  - Evidence count: the evidence attached to the opportunity, duplicates excluded.
  - Accounts: the distinct customer and unknown accounts among that evidence. Prospects: the distinct prospect accounts.
  - Last evidence: the latest Date among that evidence.
  - Kinds: the number of needs, bugs and questions among that evidence.
  - Ledger: per account and static weight, the latest date (see "Ranking" in `ost-rules`).
- **Recompute only what changed.** When a run attaches, moves or removes evidence, it recomputes the counts of the opportunities touched, reading only their evidence. Evidence edited by hand in Notion counts too: each run reads the evidence edited since the previous run (by last edited time) and recomputes the opportunities concerned. Never recompute every opportunity's counts in a daily or weekly run. Scores are refreshed from the Ledger property alone: daily for the opportunities touched, weekly for every ranked opportunity.
- **Grouped counts when allowed.** After a backfill, a query that groups and counts within one database (for example the Evidence database grouped by opportunity) recomputes all counts in one call. Use it when the connector accepts it: it is unlimited on Business and Enterprise, and draws on a shared workspace quota on other plans. If it is refused, recompute opportunity by opportunity.
- **Skip what was already ingested** by filtering the Evidence database on Source ID.

## Outcomes
| Property | Type | Notes |
| --- | --- | --- |
| Outcome | Title | Measurable result the squad works toward |
| North star | Text | Optional long-term direction the outcome serves |
| Status | Select | active, past. Several may be active at once, one per area of the squad; none while the squad has no outcome yet |
| Start | Date | |
| End | Date | Set when the squad changes course |
| Reason for change | Text | Why the squad moved on |

## Opportunities
| Property | Type | Notes |
| --- | --- | --- |
| Name | Title | Customer-phrased need or pain |
| Parent | Relation (Opportunities), two-way | Empty for top-level opportunities; hidden in the tree view once Sub-items are on |
| Sub-opportunities | Relation (Opportunities) | The other side of Parent |
| Outcomes | Relation (Outcomes) | Every outcome this opportunity has served; the active one is the outcome it serves now |
| Status | Select | proposed, candidate, active, parked, addressed, merged, archived |
| Product area | Select | One of the areas the squad owns (scope of the configuration); set by `build-tree` |
| Evidence | Relation (Evidence) | The other side of Evidence › Opportunity |
| Solutions | Relation (Solutions) | The other side of Solutions › Opportunity |
| Evidence count | Number | Written by the plugin: evidence attached, duplicates excluded |
| Accounts | Number | Written by the plugin: distinct customer and unknown accounts among that evidence; used in the ranking |
| Prospects | Number | Written by the plugin: distinct prospect accounts among that evidence, shown apart |
| Last evidence | Date | Written by the plugin: date of the latest evidence |
| Freshness asked on | Date | Set by the weekly synthesis when it asks whether a dormant opportunity is still current; cleared when evidence arrives |
| Kinds | Text | Written by the plugin: the split of its evidence by kind, for example "12 needs, 7 bugs, 2 questions" |
| Summary | Text | Written by the plugin at creation, merge and reframe: a one-line definition and two representative verbatims. It is the compact tree summary every run and the extractor read, so the evidence base is never re-read to describe the tree |
| Signals | Text | Written by the plugin: volume from signal sources over the last 90 days, for example "86 tickets (category Export)" |
| Ledger | Text | Written by the plugin at every attachment, move, merge or undo, and rebuilt when a shipped solution is linked: one line per customer or unknown account and per distinct static weight, with the latest date carrying it, for example `Contoso · calls · need · 2026-10-20`. Age and release weights are applied at score time, so the score is computed from it without reading the evidence (see "Ranking" in `ost-rules`) |
| Score | Number | Written by the plugin from the Ledger (see "Ranking" in `ost-rules`): by the daily run for the opportunities it touched, by the weekly synthesis for all |
| Rank | Number | Order among its siblings, from the score; written when the tree is built (`build-tree`), then by the weekly synthesis only |

## Evidence
| Property | Type | Notes |
| --- | --- | --- |
| Need | Title | The need behind it, in one short line in the customer's words (see `build-tree`, step 1) |
| Verbatim | Text | Exact customer words, never cut mid-thought |
| Source type | Select | call, ticket, message, insight, survey, import, interview, other |
| Kind | Select | need, bug, question (see "Kinds of evidence" in `ost-rules`) |
| Source ID | Text | ID of the call, ticket, message or document in its source tool, or the file and row of an import; used to never ingest it twice |
| Source link | URL | Link to the original; for a team chat message, the permalink of the exact message or reply; empty for a file import |
| Account | Text | |
| Account type | Select | customer, prospect, internal, unknown; customers and unknown accounts count in Accounts |
| Contact | Text | Name and email of the customer contact, when the source gives it; used to reach customers for solution discovery |
| Date | Date | |
| Opportunity | Relation (Opportunities) | Empty when unattached |
| Agent choice | Relation (Opportunities) | The opportunity the agent attached it to; empty when the agent left it unattached or out of scope. The agent updates it when it moves the evidence itself (merge, move, undo) |
| Agent status | Select | attached, unattached, out of scope: the status the agent gave it. When Opportunity differs from Agent choice, or Status from Agent status, a person moved the evidence |
| Duplicate of | Relation (Evidence) | The piece it repeats, from another source: shown with it, never counted again |
| Status | Select | attached, unattached, out of scope |
| Rationale | Text | One sentence: why this opportunity |
| Confidence | Select | high, medium, low; low-confidence attachments are reviewed first |
| Run | Relation (Run log) | Run that created it |

## Solutions
| Property | Type | Notes |
| --- | --- | --- |
| Name | Title | |
| Opportunity | Relation (Opportunities), two-way | |
| Status | Select | idea, to test, testing, validated, shipped, paused, dropped |
| Assumptions | Relation (Assumptions) | The other side of Assumptions › Solution |
| Documentation link | URL | For shipped solutions: the documentation page or release note |
| Released on | Date | For shipped solutions; empty when the date is unknown |
| Riskiest assumption | Relation (Assumptions) | |
| Backlog link | URL | The backlog item that delivers this solution, if any |
| Backlog status | Text | Copied from the backlog at each run (for example: to do, in progress, done) |

## Assumptions
| Property | Type | Notes |
| --- | --- | --- |
| Statement | Title | |
| Type | Select | desirability, usability, feasibility, viability |
| Solution | Relation (Solutions) | |
| Test | Text | How it will be tested |
| Result | Select | untested, supported, refuted, unclear |

## Run log
| Property | Type | Notes |
| --- | --- | --- |
| Run | Title | Date and type (daily, weekly, onboarding, change of course) |
| Started at | Date (with time) | Written when the run starts, with Status `running` |
| Finished at | Date (with time) | Shown as "last refresh" in the live view |
| Duration | Number | Minutes from start to finish |
| Recap | Text | The recap of the run, as sent (the live view shows the latest) |
| Sources status | Text | Per source: OK, partial or failed at this run |
| Plugin version | Text | Version of the plugin that ran |
| Ingested | Number | Items read |
| Attached | Number | Evidence attached |
| Pending | Number | Unattached evidence and proposals |
| Changes | Relation (Changes) | The changes made or proposed during the run; the other side of Changes › Run |
| Anomalies | Text | Failed sources, unreadable items |
| Status | Select | running, finished, interrupted |
| Checkpoint | Text | For a backfill: the last item processed per source, so the next run resumes there |

## Sources
One row per source, kept up to date by every run, so anyone can see at a glance that the tree is fed.

| Property | Type | Notes |
| --- | --- | --- |
| Source | Title | The kind of input: calls, tickets, team channels, interviews, insights, signals, file imports, quantitative, documentation, release notes, backlog |
| Tool | Text | The tool behind it, as declared in the configuration |
| Status | Select | ok (green), partial (yellow), failed (red), not connected (gray), replaced or removed (default, kept for history) |
| Last successful read | Date (with time) | |
| Last check | Date (with time) | The last time a run tried to read it |
| Items read | Number | At the last check |
| Detail | Text | One sentence: what went wrong and what the tree may miss, or what was read |

## Corrections
| Property | Type | Notes |
| --- | --- | --- |
| Item | Title | What was corrected |
| Agent proposal | Text | |
| Human decision | Text | |
| Reason | Text | If given |
| Rule | Relation (Rules) | The rule drafted from it, if any; the other side of Rules › Learned from |

## Rules
What the agent learned from the squad's corrections. Runs apply only the `active` rules.

| Property | Type | Notes |
| --- | --- | --- |
| Rule | Title | One sentence, for example "Remarks about exports belong under X, not Y" |
| Kind | Select | attachment, scope, structure, ranking |
| Status | Select | proposed, active, retired |
| Since | Date | When it became active |
| Learned from | Relation (Corrections), two-way | The corrections it comes from; they are its test cases |
| Replay | Text | Result of the replay on past attachments: errors fixed, new errors |
| Outcome | Relation (Outcomes) | Set when the rule only makes sense for one outcome |

## Changes
Every structural change to the tree, made by the agent or proposed to the squad. It feeds the recap, the pending decisions and the tree changelog of the live view, and it is what `ost-undo` reads. A re-rank is one row per synthesis, with the order before and after.

| Property | Type | Notes |
| --- | --- | --- |
| Change | Title | One line, for example "Merged 'A' into 'B'" |
| Type | Select | create, merge, rename, reframe, move, re-rank, add solution, link shipped feature, link backlog item, mark shipped, mark addressed, reactivate, activate, park, split, archive |
| Status | Select | proposed, applied by the agent, accepted, edited, rejected, undone |
| Opportunities | Relation (Opportunities) | The opportunities it touches |
| Evidence moved | Relation (Evidence) | The evidence it moved, so it can be moved back |
| Before | Text | Enough to restore the previous state: names, parent, status, rank |
| After | Text | The new state |
| Reason | Text | One sentence, citing the evidence |
| Run | Relation (Run log), two-way | The run that made or proposed it |
| Decided on | Date | When the squad accepted, edited, rejected or undid it |
| Applied on | Date | When a run carried out an accepted or edited decision; empty until then |
