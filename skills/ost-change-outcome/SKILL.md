---
name: ost-change-outcome
description: Re-anchors the tree when the squad changes course - an outcome added, replaced or retired, a first outcome for a squad that had none, or a new north star. Snapshots the current tree, pauses the runs, re-evaluates every opportunity against the new direction, parks what no longer fits and reviews it with the squad. Nothing is deleted.
disable-model-invocation: true
argument-hint: "[optional: squad name] [optional: the new outcome or north star]"
---

# Changing course

Run this as a conversation with the user when the squad changes its outcome or its north star. Follow `ost-rules` throughout. Speak the user's language. Keep the user oriented the same way as in `ost-setup`: show the 7 steps at the start, and open and close each step with its position and a progress line.

Plugin files: the skills named in backticks (`ost-rules`, `build-tree`, `backfill`, …) belong to this plugin. Load them with the Skill tool as `live-product-discovery:<name>`, or read `${CLAUDE_PLUGIN_ROOT}/skills/<name>/SKILL.md`. Templates are in `${CLAUDE_PLUGIN_ROOT}/templates/`. When the plugin is read from its repository instead of being installed, `${CLAUDE_PLUGIN_ROOT}` is not substituted: it means the repository root.

When several squads are set up, work on one squad only: the one named as argument, or ask which one. The other squads' trees do not change.

The agent never changes the outcome or the north star on its own. It runs this skill only when the user invokes it, or after the user confirms a drift signal raised by `weekly-synthesis`.

## Step 1 – Capture the new direction

1. Ask what changes: an outcome added, replaced or retired (a squad may have several, or none yet), the north star, or both. Ask why, and from which date it applies.
2. Check the new outcome is a measurable result, not an output (same check as in `ost-setup`). If only the north star changes, check with the user that the current outcome still serves it; if not, capture a new outcome too.
3. Restate the change in one sentence ("From <date>, the squad moves from <old> to <new> because <reason>") and get the user's confirmation.

## Step 2 – Snapshot the current tree

Record the current state before changing anything:
- mark the replaced or retired outcome `past`, with its end date and the reason for the change;
- create the new outcome as `active`, with its start date;
- save a snapshot entry in the run log: the old outcome and the list of opportunities with their evidence counts and ranks;
- set `paused: true` in the configuration: the daily and weekly runs skip the squad until step 7 clears it, so nothing writes to a half-reviewed tree.

Nothing is deleted. Evidence belongs to customers, not to an outcome: every piece of evidence stays in place.

## Step 3 – Re-evaluate every opportunity

Go through the opportunities under the changed outcome, the parked ones included (some may fit the new direction), and all of them when the squad had no outcome yet. Propose one decision for each, grouped so the user decides branch by branch rather than one by one; the opportunities of the other active outcomes do not change. Give each decision a one-sentence reason. Use the outcome test of `build-tree` (step 3) against the new outcome, or against the remaining active outcomes when one is retired:
- **keep**: still relevant to the new outcome, as is;
- **reframe**: relevant if reworded or moved to another branch;
- **park**: moves none of the active outcomes. Parked opportunities keep their evidence and keep receiving new evidence, but are not ranked. They can come back later.

Solutions under a parked opportunity move to `paused`; their assumptions keep their result.

## Step 4 – Look for what the old tree missed

Search the evidence already collected, including unattached evidence and evidence under parked opportunities, for needs that matter for the new outcome but had no opportunity. Turn them into new `candidate` opportunities following `build-tree`, each with its evidence.

## Step 5 – Check the sources

A new direction can mean a new segment or product area. Ask whether the squad's scope (owned areas, out-of-scope areas, segments) and the sources and filters in the configuration still fit. Update them with the user, and test any new source as in `ost-setup`, step 2. If a new source brings in past items to read, give the user the volume and ask for their go first, as in `ost-setup`, step 4, then process it following `backfill`.

## Step 6 – Review with the squad

Show the new tree and what the agent is unsure of, as in the quick review of `ost-setup`, step 7. Record every correction in the corrections database.

Then review the learned rules: keep rules about how customers express needs; flag rules that only made sense for the old outcome and ask the user whether to retire them (status `retired` in the Rules database). A rule whose test cases all sit under parked opportunities is flagged too.

## Step 7 – Restart

1. Write the reviewed tree. Rewrite the configuration block (`outcomes`, `north_star`, `paused: false`), then read it back: the Outcomes database is the source of truth for the active outcomes, and the configuration mirrors it.
2. End with a summary: old and new direction, number of opportunities kept, reframed, parked and added, source changes, and what the next daily recap will show.

The next daily recap opens with one line on the change of course.
