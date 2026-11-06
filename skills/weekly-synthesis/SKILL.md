---
name: weekly-synthesis
description: The weekly synthesis of live-product-discovery. Re-ranks opportunities, applies or proposes structural changes, and learns from the corrections made during the week. Meant to be triggered by a scheduled task.
---

# Weekly synthesis

You run unattended. Follow `ost-rules`. The output feeds a 30-minute review with the squad.

Plugin files: the skills named in backticks (`ost-rules`, `build-tree`, `backfill`, …) belong to this plugin. Load them with the Skill tool as `live-product-discovery:<name>`, or read `${CLAUDE_PLUGIN_ROOT}/skills/<name>/SKILL.md`. Templates are in `${CLAUDE_PLUGIN_ROOT}/templates/`.

When several squads are set up, run the synthesis for each squad in turn, from its own tree and its own corrections: a rule learned for one squad never applies to another. Send the summaries together, one section per squad.

Record the health of the sources this synthesis reads (documentation, release notes, backlog, quantitative data) in the Sources database, as `daily-run` does.

Work from this week's evidence and the counts stored on each opportunity; never re-read the whole evidence base. Read Notion as described in "Reading the databases" in `${CLAUDE_PLUGIN_ROOT}/templates/notion-data-model.md`.

## 1. Rank

Rank opportunities by volume and recency of evidence and number of distinct accounts, weighted by the quantitative data available (accounts affected, frequency, revenue at stake). Show what moved since last week and why.

## 2. Act or propose

Read the release notes published since the last synthesis and check them against active opportunities, following the "Shipped features" rules in `ost-rules`.

Read the backlog items created or changed since the last synthesis, following the "Backlog" rules in `ost-rules`: link items to opportunities or propose the links, and ask about the two gaps (backlog items with no opportunity, top opportunities with no solution in the backlog).

Check freshness, following the "Shipped features" and "Freshness" rules in `ost-rules`: opportunities past the waiting period after a release, the adoption of recently shipped features when usage data exists, and dormant opportunities to ask about.

Check the opportunities that grew most this week for catch-alls: read about ten of their recent pieces of evidence and the needs behind them. If they fall into two or more distinct needs (one solution would not remove them all), propose a split, with the groups and their evidence. Splitting stays human.

Apply the structural changes that meet the conditions in "Changes and autonomy" (`ost-rules`) and list them with their reasons. Propose the rest for the squad to decide on: new opportunities, merges, splits, reframes, archives, opportunities newly covered by a shipped feature, and opportunities to mark `addressed`. Each change and each proposal cites its evidence and is written to the Changes database. List the assumptions worth testing next for solutions in progress. Name the opportunities where bugs make up most of the evidence, following "Kinds of evidence" in `ost-rules`.

## 3. Learn

1. Read the corrections logged this week: evidence moved by a human, proposals rejected, changes undone. Evidence edited this week whose Opportunity or Status no longer matches its Agent choice was moved by a person: log it as a correction first.
2. Group them by pattern and draft a rule for each recurring pattern (for example: "Remarks about exports belong under opportunity X, not Y"). Write it to the Rules database as `proposed`, linked to its corrections.
3. Replay each draft rule on past attachments. Keep it only if it fixes past errors without creating new ones.
4. Small rules that pass the replay become `active`; deeper changes stay `proposed` and are listed for the user to approve. Write the replay result on each rule.

## 4. Watch for drift

Flag a possible drift when the evidence no longer matches the active outcomes, for example:
- a growing share of new evidence fits no active opportunity, or lands on parked ones;
- a parked opportunity gathers more new evidence than most active ones;
- a growing share of evidence is marked out of scope, which may mean the squad's scope has changed.

With no outcome yet, skip this check. Report the signal with its evidence and suggest discussing it with the squad. Never change the outcome or the north star: if the user confirms a change of course, they run `ost-change-outcome`.

## 5. Measure

When the outcome query is set up, report the outcome's metric and its trend, and note which shipped solutions may have moved it.

Report the trend of:
- the share of evidence correctly attached, measured on the test cases built from the squad's corrections;
- the share of proposals accepted without edits, and the share of the agent's own changes undone;
- the number of changes undone this week.
- the types of change the agent now makes on its own, and those that went back to proposals.

## Output

A one-page summary: top opportunities and movements, decisions needed, drift signals if any, rules learned, metrics.
