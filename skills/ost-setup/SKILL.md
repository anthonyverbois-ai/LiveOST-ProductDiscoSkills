---
name: ost-setup
description: Onboarding for live-product-discovery. Sets the outcome, connects the sources, creates the tree, runs the first backfill, calibrates it with the user and schedules the daily and weekly runs.
disable-model-invocation: true
argument-hint: "[optional: squad name]"
---

# Onboarding

Run this as a conversation with the user, one step at a time. Confirm each step before moving to the next. Follow `ost-rules` throughout. Speak the user's language.

## Step 1 – Frame

Ask for:
- the squad's scope and the product area it owns;
- the customer segments that matter;
- the outcome the squad is working toward.

Check the outcome is a measurable result, not an output. "Reduce the time to build a client presentation" is an outcome; "Launch the AI editor" is an output. If it is an output, help the user reframe it, then confirm.

## Step 2 – Sources

1. Ask where each kind of input lives: customer calls, support tickets, product analytics, product or support documentation.
2. Check which matching connectors are already available in this session.
3. For each declared tool without a connector, ask the user to connect it. The user authenticates; never ask for, read or store credentials. Where the app can show a connection card, show it.
4. Test each source with one read-only call (for example: fetch the most recent call). Report what you found. Do not continue with a source that fails its test.
5. If no connector exists for a tool, offer the fallback: the user drops exports (transcripts, CSV) in a dedicated folder that the runs will read.
6. Save the result as the sources configuration (see `templates/sources.example.yaml`).

## Step 3 – Tree workspace

Create the Notion databases described in `templates/notion-data-model.md` (opportunities, evidence, solutions, assumptions, run log, corrections) in the location the user chooses. If the user already has a tree, offer to import it instead of starting empty.

## Step 4 – Backfill

1. Ask how far back to go (default: 60 days; 90 for low-volume squads).
2. Ask for any extra material: interview notes, research reports, an existing tree.
3. Read everything and extract candidate evidence, following `ost-rules`.

## Step 5 – First tree

Group the evidence into a first set of opportunities under the outcome. Every opportunity must show its evidence count and accounts. Present the tree to the user as a short outline before writing it.

## Step 6 – Calibration

This is the most important step. Walk the user through the tree, one branch at a time:
- for each opportunity: keep, rename, merge, split or reject;
- for a sample of evidence: right opportunity or not.

Record every correction in the corrections database with: what the agent proposed, what the user decided, and why if they say. These corrections become the agent's first rules and its first evaluation set.

## Step 7 – Activation

1. Write the calibrated tree to the workspace.
2. Create two scheduled tasks: a daily run (`daily-run`) on working days and a weekly synthesis (`weekly-synthesis`). Ask the user for the times.
3. Start in **observation mode** for two weeks: the daily run writes its proposals to the log but does not change the tree. Tell the user how to switch to normal mode.
4. End with a summary: outcome, number of opportunities and evidence, sources connected, schedule, and what the first daily recap will look like.
