---
name: ost-setup
description: Onboarding for live-product-discovery. Sets the outcome, connects the sources, creates the tree, shows a pre-flight recap of what will be processed, runs the first backfill after the user's go, calibrates it with the user and schedules the daily and weekly runs.
disable-model-invocation: true
argument-hint: "[optional: squad name]"
---

# Onboarding

Run this as a conversation with the user, one step at a time. Confirm each step before moving to the next. Follow `ost-rules` throughout. Speak the user's language.

## Keep the user oriented

The user must always know what is done, what is happening and what comes next.

- **At the start**, show the whole path: the 8 steps, one line each, and a rough duration for the onboarding. Say that nothing heavy happens before step 5, and that step 5 starts only after their explicit go.
- **At the start of each step**, open with its title and position ("Step 4 of 8 – Scope and pre-flight check"), then one sentence on what the step does and what you need from the user.
- **At the end of each step**, give a one-line recap of what was done (for example "Step 3 of 8 done – 7 databases created in the chosen page"), then a progress line:
  `Done: 1 Frame, 2 Sources, 3 Tree workspace · Next: 4 Scope and pre-flight check · Then: 5 Backfill, 6 First tree, 7 Calibration, 8 Activation`
- **During long steps** (the backfill above all), report progress at regular intervals: items processed out of the total, sources finished, time remaining.
- **When something changes the path** (a step skipped, an existing tree imported, a return to the pre-flight recap after a sample), say so and update the progress line.
- **When the user comes back after a pause**, or asks where they are, restate the progress line and what is waiting on them.

## Step 1 – Frame

Ask for:
- the squad's scope and the product area it owns;
- the customer segments that matter;
- the outcome the squad is working toward;
- optionally, the north star that outcome serves.

Check the outcome is a measurable result, not an output. "Reduce the time to build a client presentation" is an outcome; "Launch the AI editor" is an output. If it is an output, help the user reframe it, then confirm.

## Step 2 – Sources

1. Ask where each kind of input lives: customer calls, support tickets, product analytics, product or support documentation, and release notes or a product changelog (they tell which features shipped, and when).
2. Check which matching connectors are already available in this session.
3. For each declared tool without a connector, ask the user to connect it. The user authenticates; never ask for, read or store credentials. Where the app can show a connection card, show it.
4. Test each source with one read-only call (for example: fetch the most recent call). Report what you found. Do not continue with a source that fails its test.
5. If no connector exists for a tool, offer the fallback: the user drops exports (transcripts, CSV) in a dedicated folder that the runs will read.
6. Save the result as the sources configuration (see `templates/sources.example.yaml`).

## Step 3 – Tree workspace

Create the Notion databases described in `templates/notion-data-model.md` (outcomes, opportunities, evidence, solutions, assumptions, run log, corrections) in the location the user chooses. If the user already has a tree, offer to import it instead of starting empty.

## Step 4 – Scope and pre-flight check

The backfill is the heaviest step of the onboarding: it takes time, uses a lot of tokens and produces the first tree everything else builds on. Before starting it, show the user exactly what will be processed and wait for an explicit go.

1. Ask how far back to go: 60 days (default), 90 days for low-volume squads, a custom start date, or **all time** (since the earliest item available in each source). All time gives the fullest picture but the largest volume, and older evidence may concern needs already addressed since: step 6 checks this against shipped features.
2. Ask for any extra material: interview notes, research reports, an existing tree.
3. Count what is in scope **without reading the content**: list items through each connector or folder using metadata only (title, date, size).
4. Present the pre-flight recap:
   - **per source**: the connector or folder used, the period covered (for all time, the date of the earliest item found), the number of items found and the filters applied;
   - **documentation**: the number of documentation pages and release notes found, and the period the release notes cover;
   - **samples**: two or three items per source (title and date), so the user can check they are the right calls, tickets or documents;
   - **alerts**: a source returning nothing, an unusual volume (very low or very high for the period), partial access (for example only the user's own calls are visible), extra material that cannot be read;
   - **left out**: declared tools without a working source, items outside the period, items excluded by the filters, and why;
   - **estimate**: a rough duration for the backfill, based on the number of items.
5. Offer three choices:
   - **Go**: run the full backfill.
   - **Adjust**: change a source, a filter or the period, then show the recap again.
   - **Sample first**: run the backfill on the most recent two weeks only, show the first tree and a sample of attachments, then come back to this recap to go full or adjust. Recommend this on a first onboarding, and always with all time.

Never start the backfill without the user's explicit go.

## Step 5 – Backfill

Read everything in the confirmed scope and extract candidate evidence, following `ost-rules`. Report progress at regular intervals on long backfills. If a source fails midway, finish the others and report what is missing.

## Step 6 – First tree

1. Group the evidence into a first set of opportunities under the outcome. Every opportunity must show its evidence count and accounts.
2. Check each opportunity against shipped features, following the "Shipped features" rules in `ost-rules`: search the product documentation and release notes for a feature that already addresses it. When one does, record it as a `shipped` solution and split the evidence into before and after the release.
3. Present the tree to the user as a short outline before writing it. Flag the opportunities with a shipped solution: those with no evidence after the release are proposed as `addressed`; those with evidence after the release show that the need persists despite the feature.

## Step 7 – Calibration

This is the most important step. Walk the user through the tree, one branch at a time:
- for each opportunity: keep, rename, merge, split or reject;
- for a sample of evidence: right opportunity or not.

Record every correction in the corrections database with: what the agent proposed, what the user decided, and why if they say. These corrections become the agent's first rules and its first evaluation set.

## Step 8 – Activation

1. Write the calibrated tree to the workspace.
2. Create two scheduled tasks: a daily run (`daily-run`) on working days and a weekly synthesis (`weekly-synthesis`). Ask the user for the times.
3. Start in **observation mode** for two weeks: the daily run writes its proposals to the log but does not change the tree. Tell the user how to switch to normal mode.
4. End with a summary: outcome, number of opportunities and evidence, sources connected, schedule, and what the first daily recap will look like. Tell the user that if the squad changes course later, they can run `/live-product-discovery:ost-change-outcome`.
