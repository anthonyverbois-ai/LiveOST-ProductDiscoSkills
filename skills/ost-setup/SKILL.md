---
name: ost-setup
description: Onboarding for live-product-discovery. Sets the outcome, connects the sources, builds and calibrates a first tree on a one-month trial batch, then extends it to the full history after the user's go, and schedules the daily and weekly runs.
disable-model-invocation: true
argument-hint: "[optional: squad name]"
---

# Onboarding

Run this as a conversation with the user, one step at a time. Confirm each step before moving to the next. Follow `ost-rules` throughout. Speak the user's language.

The onboarding works in two batches. A **trial batch** on the last month checks that everything works and calibrates the agent with the user's corrections. The **full history** is then processed with the rules learned during calibration, so the large volume is handled well from the first pass.

## Keep the user oriented

The user must always know what is done, what is happening and what comes next.

- **At the start**, show the whole path: the 9 steps, one line each, and a rough duration for the onboarding. Say that processing starts only after their explicit go, at step 4 for the trial batch and at step 8 for the full history.
- **At the start of each step**, open with its title and position ("Step 4 of 9 – Trial batch: go"), then one sentence on what the step does and what you need from the user.
- **At the end of each step**, give a one-line recap of what was done (for example "Step 3 of 9 done – 7 databases created in the chosen page"), then a progress line:
  `Done: 1 Frame, 2 Sources, 3 Tree workspace · Next: 4 Trial batch: go · Then: 5 Trial batch, 6 First tree, 7 Calibration, 8 Full history, 9 Activation`
- **During long steps** (the full history above all), report progress at regular intervals: items processed out of the total, sources finished, time remaining.
- **When something changes the path** (a step skipped, an existing tree imported, the full history declined), say so and update the progress line.
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
6. Ask for any extra material: interview notes, research reports, an existing tree.
7. Save the result as the sources configuration (see `templates/sources.example.yaml`).

## Step 3 – Tree workspace

The tree lives in seven Notion databases described in `templates/notion-data-model.md`: outcomes, opportunities, evidence, solutions, assumptions, run log, corrections.

1. **Ask where**: an existing page (by name or link), or a new dedicated page (for example "OST – <squad name>") in the teamspace the user chooses. Search Notion to confirm the page they mean; if several match, show them and let the user pick.
2. **Check access**: make sure the Notion connector can write at that location. If it cannot, explain how to give it access (share the page with the connection) and wait, rather than failing later.
3. **Flag visibility**: the databases will hold customer verbatims. Tell the user who can see that location (a whole teamspace, or a page restricted to the squad) and let them choose another place if needed.
4. **Detect an existing tree**: if databases from this plugin already exist at that location (for example after a previous onboarding), offer to reuse them instead of creating duplicates. If the user has a tree elsewhere (another page, a document, a whiteboard), offer to import it instead of starting empty.
5. **Confirm, then create**: recap the location, the seven databases and who will have access, and create them only after the user confirms.

## Step 4 – Trial batch: go

Count what the last month holds **without reading the content**: list items through each connector or folder using metadata only. Then ask for the go in one short message, for example:

> Before I start, here is what I will process for the last month: 34 calls (call recorder), 120 tickets (support tool), 18 documentation pages. Go?

Add a line only when something looks wrong: a source returning nothing, partial access (for example only the user's own calls are visible), or extra material that cannot be read. Give more detail (sample items, filters, what is left out, duration) only if the user asks.

Never start processing without the user's explicit go. If the user wants to change something, go back to the relevant source, then ask again.

## Step 5 – Trial batch

Read the last month and the extra material, and extract candidate evidence, following `ost-rules`. If a source fails midway, finish the others and report what is missing.

## Step 6 – First tree

1. Group the evidence into a first set of opportunities under the outcome. Every opportunity must show its evidence count and accounts.
2. Check each opportunity against shipped features, following the "Shipped features" rules in `ost-rules`: search the product documentation and release notes for a feature that already addresses it. When one does, record it as a `shipped` solution and split the evidence into before and after the release.
3. Present the tree to the user as a short outline before writing it. Flag the opportunities with a shipped solution: those with no evidence after the release are proposed as `addressed`; those with evidence after the release show that the need persists despite the feature.

## Step 7 – Calibration

This is the most important step. Walk the user through the tree, one branch at a time:
- for each opportunity: keep, rename, merge, split or reject;
- for a sample of evidence: right opportunity or not.

Record every correction in the corrections database with: what the agent proposed, what the user decided, and why if they say. These corrections become the agent's first rules and its first evaluation set. Write the calibrated tree to the workspace.

## Step 8 – Full history

This is the normal next step: propose it by default.

1. Count what the full history holds, from the earliest item available in each source, using metadata only.
2. Ask for the go in one short message, for example:

   > The tree looks right? The full history adds 410 calls and 2,300 tickets, back to March 2023. It will take about an hour. Go?

   The user can also choose a later start date instead of all time.
3. On go, process the full history with the rules learned in step 7. Report progress at regular intervals. Check the new evidence against shipped features, as in step 6.
4. Merge the result into the calibrated tree, then show a short review of what changed: new opportunities proposed, opportunities whose evidence grew notably, opportunities now covered by a shipped feature. Record the user's corrections as in step 7.

The user may decline, for example when the product changed so much that older feedback no longer applies. Say that the full history can still be processed later by running this onboarding's step 8 again, then continue to activation.

## Step 9 – Activation

1. Create two scheduled tasks: a daily run (`daily-run`) on working days and a weekly synthesis (`weekly-synthesis`). Ask the user for the times.
2. Start in **observation mode** for two weeks: the daily run writes its proposals to the log but does not change the tree. Tell the user how to switch to normal mode.
3. End with a summary: outcome, period covered, number of opportunities and evidence, sources connected, schedule, and what the first daily recap will look like. Tell the user that if the squad changes course later, they can run `/live-product-discovery:ost-change-outcome`.
