# Notion data model

The tree lives in seven related Notion databases, created during onboarding.

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
| Parent | Relation (Opportunities) | Empty for top-level opportunities |
| Outcomes | Relation (Outcomes) | Every outcome this opportunity has served |
| Status | Select | candidate, active, parked, merged, archived |
| Product area | Select | From the product documentation |
| Evidence | Relation (Evidence) | |
| Evidence count | Rollup | |
| Accounts | Rollup | Distinct accounts |
| Last evidence | Rollup | Most recent evidence date |
| Rank | Number | Set by the weekly synthesis |

## Evidence
| Property | Type | Notes |
| --- | --- | --- |
| Verbatim | Title | Exact customer words |
| Source type | Select | call, ticket, interview, other |
| Source link | URL | Link to the original |
| Account | Text | |
| Date | Date | |
| Opportunity | Relation (Opportunities) | Empty when unattached |
| Status | Select | attached, unattached, proposed |
| Rationale | Text | One sentence: why this opportunity |
| Run | Relation (Run log) | Run that created it |

## Solutions
| Property | Type | Notes |
| --- | --- | --- |
| Name | Title | |
| Opportunity | Relation (Opportunities) | |
| Status | Select | idea, to test, testing, validated, paused, dropped |
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
| Run | Title | Date and type (daily, weekly) |
| Ingested | Number | Items read |
| Attached | Number | Evidence attached |
| Pending | Number | Unattached evidence and proposals |
| Changes | Text | Before and after of each change |
| Anomalies | Text | Failed sources, unreadable items |

## Corrections
| Property | Type | Notes |
| --- | --- | --- |
| Item | Title | What was corrected |
| Agent proposal | Text | |
| Human decision | Text | |
| Reason | Text | If given |
| Rule drafted | Text | Filled by the weekly synthesis |
