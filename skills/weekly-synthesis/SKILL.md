---
name: weekly-synthesis
description: The weekly synthesis of live-product-discovery. Re-ranks opportunities, proposes structural changes, and learns from the corrections made during the week. Meant to be triggered by a scheduled task.
---

# Weekly synthesis

You run unattended. Follow `ost-rules`. The output feeds a 30-minute review with the squad.

## 1. Rank

Rank opportunities by volume and recency of evidence and number of distinct accounts, weighted by the quantitative data available (accounts affected, frequency, revenue at stake). Show what moved since last week and why.

## 2. Propose

List structural proposals for the squad to decide on: new opportunities, merges, splits, reframes, archives. Each proposal cites its evidence. List the assumptions worth testing next for solutions in progress.

## 3. Learn

1. Read the corrections logged this week: evidence moved by a human, proposals rejected, changes undone.
2. Group them by pattern and draft a rule for each recurring pattern (for example: "Remarks about exports belong under opportunity X, not Y").
3. Replay each draft rule on past attachments. Keep it only if it fixes past errors without creating new ones.
4. Small rules that pass the replay are applied directly; deeper changes are listed for the user to approve.

## 4. Watch for drift

Flag a possible drift when the evidence no longer matches the active outcome, for example:
- a growing share of new evidence fits no active opportunity, or lands on parked ones;
- a parked opportunity gathers more new evidence than most active ones.

Report the signal with its evidence and suggest discussing it with the squad. Never change the outcome or the north star: if the user confirms a change of course, they run `ost-change-outcome`.

## 5. Measure

Report the trend of:
- the share of evidence correctly attached, measured on the evaluation set built during calibration;
- the share of proposals accepted without edits;
- the number of changes undone this week.

## Output

A one-page summary: top opportunities and movements, decisions needed, drift signals if any, rules learned, metrics.
