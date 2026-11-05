---
name: ost-change-outcome
description: Re-anchors the tree when the squad changes course - a new outcome, or a new north star the outcome serves. Archives the current tree, re-evaluates every opportunity against the new direction, parks what no longer fits and recalibrates with the squad. Nothing is deleted.
disable-model-invocation: true
argument-hint: "[optional: squad name] [optional: the new outcome or north star]"
---

# Changing course

Run this as a conversation with the user when the squad changes its outcome or its north star. Follow `ost-rules` throughout. Speak the user's language. Keep the user oriented the same way as in `ost-setup`: show the 7 steps at the start, and open and close each step with its position and a progress line.

When several squads are set up, work on one squad only: the one named as argument, or ask which one. The other squads' trees do not change.

The agent never changes the outcome or the north star on its own. It runs this skill only when the user invokes it, or after the user confirms a drift signal raised by `weekly-synthesis`.

## Step 1 – Capture the new direction

1. Ask what changes: the outcome, the north star, or both. Ask why, and from which date it applies.
2. Check the new outcome is a measurable result, not an output (same check as in `ost-setup`). If only the north star changes, check with the user that the current outcome still serves it; if not, capture a new outcome too.
3. Restate the change in one sentence ("From <date>, the squad moves from <old> to <new> because <reason>") and get the user's confirmation.

## Step 2 – Snapshot the current tree

Record the current state before changing anything:
- mark the old outcome `past`, with its end date and the reason for the change;
- create the new outcome as `active`, with its start date;
- save a snapshot entry in the run log: the old outcome and the list of opportunities with their evidence counts and ranks.

Nothing is deleted. Evidence belongs to customers, not to an outcome: every piece of evidence stays in place.

## Step 3 – Re-evaluate every opportunity

Go through the opportunities under the old outcome and propose one decision for each, with a one-sentence reason. Use the outcome test of `build-tree` (step 3) against the new outcome:
- **keep**: still relevant to the new outcome, as is;
- **reframe**: relevant if reworded or moved to another branch;
- **park**: out of scope for the new outcome. Parked opportunities keep their evidence and keep receiving new evidence, but are not ranked. They can come back later.

Solutions and assumptions under a parked opportunity move to `paused`.

## Step 4 – Look for what the old tree missed

Search the evidence already collected, including unattached evidence and evidence under parked opportunities, for needs that matter for the new outcome but had no opportunity. Turn them into new `candidate` opportunities following `build-tree`, each with its evidence.

## Step 5 – Check the sources

A new direction can mean a new segment or product area. Ask whether the squad's scope (owned areas, out-of-scope areas, segments) and the sources and filters in the configuration still fit. Update them with the user, and test any new source as in `ost-setup`, step 2. If a new source brings in past items to read, give the user the volume and ask for their go first, as in `ost-setup`, step 4, then process it following `backfill`.

## Step 6 – Recalibrate with the squad

Walk the user through the proposed tree, one branch at a time, as in `ost-setup`, step 7. Record every correction in the corrections database.

Then review the learned rules: keep rules about how customers express needs; flag rules that only made sense for the old outcome and ask the user whether to retire them. Mark evaluation items tied to parked opportunities as out of scope for the new outcome.

## Step 7 – Restart

1. Write the recalibrated tree.
2. Run the next week in observation mode, unless the user declines.
3. End with a summary: old and new direction, number of opportunities kept, reframed, parked and added, source changes, and what the next daily recap will show.

The next daily recap opens with one line on the change of course.
