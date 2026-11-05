# Notion data model

The tree lives in seven related Notion databases, created during onboarding.

## Creation order

A relation needs its target database to exist, and a rollup needs its relation. Create, in this order:

1. Outcomes.
2. Opportunities, with its relation to Outcomes; then add Parent as a two-way relation to itself (paired with Sub-opportunities).
3. Evidence, with its two-way relation to Opportunities; then add the Opportunities rollups (Evidence count, Accounts, Last evidence).
4. Solutions, with its two-way relation to Opportunities.
5. Assumptions, with its two-way relation to Solutions.
6. Run log; then add the two-way relation from Evidence to Run log.
7. Corrections.

The nested display of sub-opportunities (Notion's Sub-items, based on Parent) is turned on by the user in the view's menu: the connector cannot do it.

## Outcomes
| Property | Type | Notes |
| --- | --- | --- |
| Outcome | Title | Measurable result the squad works toward |
| North star | Text | Optional long-term direction the outcome serves |
| Status | Select | active, past (only one active at a time) |
| Start | Date | |
| End | Date | Set when the squad changes course |
| Reason for change | Text | Why the squad moved on |

## Opportunities
| Property | Type | Notes |
| --- | --- | --- |
| Name | Title | Customer-phrased need or pain |
| Parent | Relation (Opportunities), two-way | Empty for top-level opportunities; hidden in the tree view once Sub-items are on |
| Sub-opportunities | Relation (Opportunities) | The other side of Parent |
| Outcomes | Relation (Outcomes) | Every outcome this opportunity has served |
| Status | Select | candidate, active, parked, addressed, merged, archived |
| Product area | Select | From the product documentation |
| Evidence | Relation (Evidence) | The other side of Evidence › Opportunity |
| Solutions | Relation (Solutions) | The other side of Solutions › Opportunity |
| Evidence count | Rollup | Count of Evidence |
| Accounts | Rollup | Count of unique values of Evidence › Account: a number, used in the ranking |
| Last evidence | Rollup | Most recent evidence date |
| Rank | Number | Set by the weekly synthesis |

## Evidence
| Property | Type | Notes |
| --- | --- | --- |
| Verbatim | Title | Exact customer words |
| Source type | Select | call, ticket, interview, other |
| Source ID | Text | ID of the call, ticket or document in its source tool; used to never ingest it twice |
| Source link | URL | Link to the original |
| Account | Text | |
| Date | Date | |
| Opportunity | Relation (Opportunities) | Empty when unattached |
| Status | Select | attached, unattached, proposed, out of scope |
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
| Finished at | Date (with time) | Shown as "last refresh" in the live view |
| Sources status | Text | Per source: OK, partial or failed at this run |
| Plugin version | Text | Version of the plugin that ran |
| Ingested | Number | Items read |
| Attached | Number | Evidence attached |
| Pending | Number | Unattached evidence and proposals |
| Changes | Text | Before and after of each change, and who made it (agent or squad); feeds the tree changelog |
| Anomalies | Text | Failed sources, unreadable items |

## Corrections
| Property | Type | Notes |
| --- | --- | --- |
| Item | Title | What was corrected |
| Agent proposal | Text | |
| Human decision | Text | |
| Reason | Text | If given |
| Rule drafted | Text | Filled by the weekly synthesis |
