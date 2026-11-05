---
name: ost-setup
description: Onboarding for live-product-discovery, one squad at a time. Sets the outcome, connects the sources, builds and calibrates a first tree on a one-month trial batch, then extends it to the full history after the user's go, and schedules the daily and weekly runs. Run it again to add another squad.
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

## Several squads

A PM can follow several squads. Each squad gets its own tree: its own configuration (outcome, scope, source filters), its own Notion page and databases, its own learned rules and its own live view. Corrections made for one squad never change another squad's tree.

- **Name the squad first.** Use the name given as argument, or ask for it. The name labels the configuration, the Notion page, the recap section and the live view.
- **Look for squads already set up** before step 1. If there are some, list them and ask whether to add a new squad or redo one of them. Never overwrite another squad's configuration.
- **Reuse what is shared.** Connectors already connected for another squad do not need connecting again: test them, then set this squad's own filters. The schedule is shared too (step 9).

## Step 1 – Frame

If the squad has no name yet, ask for it (see "Several squads"). Then ask for the squad's precise scope. It decides which sources are filtered in, which evidence belongs to this tree and which documentation is checked for shipped features:
- **what the squad owns**: the product areas and features, named as they appear in the product and its documentation;
- **what is explicitly out of scope**: neighboring areas owned by other squads, where ambiguity usually sits;
- **the customer segments and personas** that matter;
- **how the scope shows up in the sources**: ticket tags or categories, call topics, documentation sections. Step 2 uses them to set the filters.

Then ask for:
- the outcome the squad is working toward;
- optionally, the north star that outcome serves.

Check the outcome is a measurable result, not an output. "Reduce the time to build a client presentation" is an outcome; "Launch the AI editor" is an output. If it is an output, help the user reframe it, then confirm.

## Step 2 – Sources

1. Ask where each kind of input lives: customer calls, support tickets, product analytics, product or support documentation, release notes or a product changelog (they tell which features shipped, and when), and the squad's backlog in its issue tracker (what the squad delivered and what it plans; read only).
2. Check which matching connectors are already available in this session.
3. For each declared tool without a connector, ask the user to connect it. The user authenticates; never ask for, read or store credentials. Where the app can show a connection card, show it.
4. Test each source with one read-only call (for example: fetch the most recent call). Report what you found. Do not continue with a source that fails its test.
5. If no connector exists for a tool, offer the fallback: the user drops exports (transcripts, CSV) in a dedicated folder that the runs will read.
6. Apply the scope from step 1: set each source's filters from the tags, categories and topics the user gave, and the backlog's filter from the squad's project, board or labels, and map the scope to the documentation sections it covers. Show the resulting filters and the list of documentation sections, and let the user confirm or correct them.
7. Ask for any extra material: interview notes, research reports, an existing tree.
8. Save the scope and the sources in the configuration (see `templates/sources.example.yaml`).

## Step 3 – Tree workspace

The tree lives in seven Notion databases described in `templates/notion-data-model.md`: outcomes, opportunities, evidence, solutions, assumptions, run log, corrections.

1. **Ask where**: an existing page (by name or link), or a new dedicated page (for example "OST – <squad name>") in the teamspace the user chooses. Each squad has its own page and databases: never reuse another squad's databases. Search Notion to confirm the page they mean; if several match, show them and let the user pick.
2. **Check access**: make sure the Notion connector can write at that location. If it cannot, explain how to give it access (share the page with the connection) and wait, rather than failing later. The plugin works on every Notion plan (see "Reading the databases" in `templates/notion-data-model.md`): do not ask the user about their plan.
3. **Flag visibility**: the databases will hold customer verbatims. Tell the user who can see that location (a whole teamspace, or a page restricted to the squad) and let them choose another place if needed.
4. **Detect an existing tree**: if databases from this plugin already exist at that location (for example after a previous onboarding), offer to reuse them instead of creating duplicates. If the user has a tree elsewhere (another page, a document, a whiteboard), offer to import it instead of starting empty.
5. **Confirm, then create**: recap the location, the seven databases and who will have access, and create them only after the user confirms. Follow the creation order in `templates/notion-data-model.md`: a relation needs its target database to exist, and a rollup needs its relation.
6. **Set up the views**: on the tree's page, a tree view of the opportunities (a table sorted by rank, showing name, status, rank, evidence count, accounts, last evidence and solutions, with Parent hidden), and a board of the solutions grouped by status.
7. **Ask for the one manual step**: the nested display of sub-opportunities cannot be turned on through the connector. Ask the user to open the tree view's menu, turn on Sub-items and choose the Parent property, then check with them that sub-opportunities now appear under their parent.

## Step 4 – Trial batch: go

Count what the last month holds **without reading the content**: list items through each connector or folder using metadata only. Then ask for the go in one short message, for example:

> Before I start, here is what I will process for the last month: 34 calls (call recorder), 120 tickets (support tool), 18 documentation pages. Go?

Add a line only when something looks wrong: a source returning nothing, partial access (for example only the user's own calls are visible), or extra material that cannot be read. Give more detail (sample items, filters, what is left out, duration) only if the user asks.

Never start processing without the user's explicit go. If the user wants to change something, go back to the relevant source, then ask again.

## Step 5 – Trial batch

Read the last month and the extra material, and extract candidate evidence, following `backfill` and `ost-rules`. If a source fails midway, finish the others and report what is missing.

## Step 6 – First tree

1. Build the first set of opportunities under the outcome, following `build-tree`: the needs behind the evidence, grouping from the specific up, the link to the outcome, the check against shipped features, sizing and a first ranking.
2. Present the tree to the user as the short outline described in `build-tree`. Flag the opportunities with a shipped solution: those with no evidence after the release are proposed as `addressed`; those with evidence after the release show that the need persists despite the feature. Flag the opportunities proposed as `parked` because they do not move the outcome.

## Step 7 – Calibration

This is the most important step. Walk the user through the tree, one branch at a time:
- for each opportunity: keep, rename, merge, split or reject;
- for a sample of evidence: right opportunity or not.

Record every correction in the corrections database with: what the agent proposed, what the user decided, and why if they say. These corrections become the agent's first rules and its first evaluation set. Write the calibrated tree to the workspace.

## Step 8 – Full history

This is the normal next step: propose it by default.

1. Count what the full history holds, from the earliest item available in each source, using metadata only.
2. Ask for the go in one short message, for example:

   > The tree looks right? The full history adds 410 calls and 2,300 tickets, back to March 2023. It will take a few hours, in batches I can resume if interrupted. Go?

   The user can also choose a later start date instead of all time.
3. On go, process the full history with the rules learned in step 7, following `backfill`: batches, checkpoints, deduplication by source ID, then a consolidation pass and a check against shipped features.
4. Merge the result into the calibrated tree, then run the review by sample described in `backfill`: low-confidence attachments, a random sample, the consolidated candidates and the opportunities that grew most. Record the user's corrections as in step 7.

The user may decline, for example when the product changed so much that older feedback no longer applies. Say that the full history can still be processed later by running this onboarding's step 8 again, then continue to activation.

## Step 9 – Activation

1. Create two scheduled tasks: a daily run (`daily-run`) on working days and a weekly synthesis (`weekly-synthesis`). Ask the user for the times. If they already exist for another squad, add this squad to them instead of creating new ones: one daily run and one weekly synthesis cover all the squads, so the user gets one notification a day.
2. Start this squad in **observation mode** for two weeks (other squads keep their own mode): the daily run writes its proposals to the log but does not change the tree. Tell the user how to switch to normal mode.
3. End with a summary: outcome, period covered, number of opportunities and evidence, sources connected, schedule, and what the first daily recap will look like. Tell the user that if the squad changes course later, they can run `/live-product-discovery:ost-change-outcome <squad name>`, and that running this onboarding again adds another squad.
