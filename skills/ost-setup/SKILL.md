---
name: ost-setup
description: Onboarding for live-product-discovery, one squad at a time. Sets the outcome, connects the sources, builds a first tree on a one-month trial batch, reviewed quickly with the user, then extends it to the full history after the user's go, and schedules the daily and weekly runs. Run it again to add another squad.
disable-model-invocation: true
argument-hint: "[optional: squad name]"
---

# Onboarding

Run this as a conversation with the user, one step at a time. Confirm each step before moving to the next. Follow `ost-rules` throughout. Speak the user's language.

Plugin files: the skills named in backticks (`ost-rules`, `build-tree`, `backfill`, …) belong to this plugin. Load them with the Skill tool as `live-product-discovery:<name>`, or read `${CLAUDE_PLUGIN_ROOT}/skills/<name>/SKILL.md`. Templates are in `${CLAUDE_PLUGIN_ROOT}/templates/`.

The onboarding works in two batches. A **trial batch** on the last month checks that everything works and gives a first tree fast. The **full history** is then processed with any rules learned from the user's corrections. Keep the user's effort low: the agent asks only about what it is unsure of, and earns the right to act on its own as the user's decisions show it gets things right (see "Changes and autonomy" in `ost-rules`).

## Keep the user oriented

The user must always know what is done, what is happening and what comes next.

- **At the start**, show the whole path: the 9 steps, one line each, and a rough duration for the onboarding. Say that processing starts only after their explicit go, at step 4 for the trial batch and at step 8 for the full history.
- **At the start of each step**, open with its title and position ("Step 4 of 9 – Trial batch: go"), then one sentence on what the step does and what you need from the user.
- **At the end of each step**, give a one-line recap of what was done (for example "Step 3 of 9 done – 8 databases created in the chosen page"), then a progress line:
  `Done: 1 Frame, 2 Sources, 3 Tree workspace · Next: 4 Trial batch: go · Then: 5 Trial batch, 6 First tree, 7 Quick review, 8 Full history, 9 Activation`
- **During long steps** (the full history above all), report progress at regular intervals: items processed out of the total, sources finished, time remaining.
- **When something changes the path** (a step skipped, an existing tree imported, the full history declined), say so and update the progress line.
- **When the user comes back after a pause**, or asks where they are, restate the progress line and what is waiting on them.

## Several squads

A PM can follow several squads. Each squad gets its own tree: its own configuration (outcome, scope, source filters), its own Notion page and databases, its own learned rules and its own live view. Corrections made for one squad never change another squad's tree.

- **Name the squad first.** Use the name given as argument, or ask for it. The name labels the configuration, the Notion page, the recap section and the live view.
- **Look for squads already set up** before step 1: search Notion for pages titled `LiveOST configuration`, one per squad. If there are some, list them and ask whether to add a new squad or redo one of them. Never overwrite another squad's configuration.
- **Reuse what is shared.** Connectors already connected for another squad do not need connecting again: test them, then set this squad's own filters. The schedule is shared too (step 9).

## Step 1 – Frame

If the squad has no name yet, ask for it (see "Several squads"). Ask for the company's own name and email domains (`own_company`): feedback a colleague logs under them is resolved to the customer it names, or marked internal. Then ask for the squad's precise scope. It decides which sources are filtered in, which evidence belongs to this tree and which documentation is checked for shipped features:
- **what the squad owns**: the product areas and features, named as they appear in the product and its documentation;
- **what is explicitly out of scope**: neighboring areas owned by other squads, where ambiguity usually sits;
- **the customer segments and personas** that matter;
- **how the scope shows up in the sources**: ticket tags or categories, call topics, documentation sections. Step 2 uses them to set the filters.

Then ask for:
- the outcome the squad is working toward. A squad that owns several product areas may set one outcome per area; a squad with no outcome yet can start without one;
- optionally, the north star the outcomes serve.

Check each outcome is a measurable result, not an output. "Reduce the time to build a client presentation" is an outcome; "Launch the AI editor" is an output. If it is an output, help the user reframe it, then confirm.

Without an outcome, say what changes: the tree is ranked on evidence alone and nothing is parked for lack of a link. The squad can add an outcome later with `ost-change-outcome`.

## Step 2 – Sources

1. Ask where each kind of input lives: customer calls, support tickets, team chat channels where colleagues share customer feedback (Slack, Teams: ask for the exact channels), insight platforms that already gather customer feedback (a product feedback tool, a research repository: ask which conversations they already cover), product analytics and account data (usage, ARR per account: often one data warehouse or analytics agent), product or support documentation, release notes or a product changelog (they tell which features shipped, and when), and the squad's backlog in its issue tracker (what the squad delivered and what it plans; read only).
2. Check which matching connectors are already available in this session.
3. For each declared tool without a connector, ask the user to connect it. The user authenticates; never ask for, read or store credentials. Where the app can show a connection card, show it.
4. Test each source with one read-only call (for example: fetch the most recent call). Report what you found. Do not continue with a source that fails its test.
5. If no connector exists for a tool, offer the fallback: the user drops exports (transcripts, CSV) in a dedicated folder that the runs will read.
6. Apply the scope from step 1: set each source's filters from the tags, categories and topics the user gave (team channels usually cover the whole product: they get no filter at the source, and the scope check filters each message), and the backlog's filter from the squad's project, board or labels, and map the scope to the documentation sections it covers. Show the resulting filters and the list of documentation sections, and let the user confirm or correct them. Then ask, for each source, whether it counts in the ranking (`rank_weight`: 1 by default, 0 to keep it visible but out of the ranking). A source whose items carry no customer words (only a category and tags) is set up as a signal source (see `ost-rules`).
7. Set up the quantitative source (a data warehouse, an analytics tool or an analytics agent), read only:
   - Explore what it holds: the tables or metrics available. Ask the user where things are rather than guessing.
   - With the user, write and test three queries: **accounts** (ARR, segment and plan per account), **usage** (usage of the squad's features per account, over time) and **outcome** (the outcome's metric over time). Show a sample of each result and let the user confirm it.
   - Agree on the **account key**: how an account named in a call or a ticket is found in the data (CRM account ID, company domain, exact name). Test it on a few recent accounts and report the ones that do not match.
   - If a query cannot be written (the data does not exist), say so and continue without it: the plugin works without quantitative data.
8. Ask for any extra material: interview notes, research reports, an existing tree, and files of customer feedback (CSV or Excel exports, survey answers, NPS comments). For each feedback file:
   - Show its columns and a few rows. Agree with the user which column holds the verbatim, the date, the account, the customer contact, an ID, a link, and what kind of feedback it is. Keep the contact columns the user wants to keep.
   - Count the useful rows, and apart the empty rows, exact duplicates and answers with no content.
   - Record the mapping in the configuration (`imports`) and the file as a one-off source in the Sources database, following "File imports" in `ost-rules`.
9. Gather the scope, the sources, the account key and the queries into the squad's configuration, laid out as in `${CLAUDE_PLUGIN_ROOT}/templates/sources.example.yaml`. It is written to Notion at step 3, in the configuration page.

## Step 3 – Tree workspace

The tree lives in a configuration page and ten Notion databases described in `${CLAUDE_PLUGIN_ROOT}/templates/notion-data-model.md`: outcomes, opportunities, evidence, solutions, assumptions, run log, corrections, sources, rules and changes.

1. **Ask where**: an existing page (by name or link), or a new dedicated page (for example "OST – <squad name>") in the teamspace the user chooses. Each squad has its own page and databases: never reuse another squad's databases. Search Notion to confirm the page they mean; if several match, show them and let the user pick.
2. **Check access**: make sure the Notion connector can write at that location. If it cannot, explain how to give it access (share the page with the connection) and wait, rather than failing later. The plugin works on every Notion plan (see "Reading the databases" in `${CLAUDE_PLUGIN_ROOT}/templates/notion-data-model.md`): do not ask the user about their plan.
3. **Flag visibility**: the databases will hold customer verbatims. Tell the user who can see that location (a whole teamspace, or a page restricted to the squad) and let them choose another place if needed.
4. **Detect an existing tree**: if databases from this plugin already exist at that location (for example after a previous onboarding), offer to reuse them instead of creating duplicates. If the user has a tree elsewhere (another page, a document, a whiteboard), offer to import it instead of starting empty.
5. **Confirm, then create**: recap the location, the configuration page, the ten databases and who will have access, and create them only after the user confirms. Write the configuration gathered at step 2 to the configuration page, then read it back. Follow the creation order in `${CLAUDE_PLUGIN_ROOT}/templates/notion-data-model.md`: a relation needs its target database to exist.
6. **Set up the views**: at the top of the tree's page, a table of the Sources database (source, tool, status, last successful read, detail), filled with the results of the step 2 tests; then, a tree view of the opportunities (a table sorted by rank, showing name, status, rank, evidence count, accounts, last evidence and solutions, with Parent hidden), and a board of the solutions grouped by status.
7. **Ask for the one manual step**: the nested display of sub-opportunities cannot be turned on through the connector. Ask the user to open the tree view's menu, turn on Sub-items and choose the Parent property, then check with them that sub-opportunities now appear under their parent.

## Step 4 – Trial batch: go

Count what the last month holds **without reading the content**: list items through each connector or folder using metadata only. Then ask for the go in one short message, for example:

> Before I start, here is what I will process for the last month: 34 calls (call recorder), 120 tickets (support tool), 18 documentation pages. Go?

Count the useful rows of each feedback file the same way, from the date column for the last month. Add a line only when something looks wrong: a source returning nothing, partial access (for example only the user's own calls are visible), or extra material that cannot be read. For a large volume, add the expected duration (about 100 items per batch). Give more detail (sample items, filters, what is left out, duration) only if the user asks.

Never start processing without the user's explicit go. If the user wants to change something, go back to the relevant source, then ask again.

## Step 5 – Trial batch

Read the last month and the extra material, and extract candidate evidence. For a feedback file, take its last month by the date column; without a date column, take a sample of about 200 rows and say so. Then process, following `backfill` and `ost-rules`. If a source fails midway, finish the others and report what is missing.

## Step 6 – First tree

1. Build the first set of opportunities under the outcome, following `build-tree`: the needs behind the evidence, grouping from the specific up, the link to the outcome, the check against shipped features, sizing and a first ranking.
2. Present the tree to the user as the short outline described in `build-tree`. Flag the opportunities with a shipped solution: those with no evidence after the release are proposed as `addressed`; those with evidence after the release show that the need persists despite the feature. Flag the opportunities proposed as `parked` because they move none of the active outcomes.

## Step 7 – Quick review

The tree is already written. Do not walk the user through every branch. Show:
- a short summary: the opportunities in order, with their evidence and accounts;
- only what the agent is unsure of: opportunities whose link to the outcome is uncertain, proposed parks, low-confidence attachments, evidence that fits nothing.
- when a signal source is set up, the proposed mapping of its categories to opportunities, for the user to confirm.

The user corrects what they want, now or later from Notion or the live view; nothing else is required. Record every correction in the corrections database with: what the agent did, what the user decided, and why if they say. Corrections become rules and test cases.

## Step 8 – Full history

This is the normal next step: propose it by default.

1. Count what the full history holds, from the earliest item available in each source, using metadata only.
2. Ask for the go in one short message, for example:

   > The tree looks right? The full history adds 410 calls and 2,300 tickets, back to March 2023. It will take a few hours, in batches I can resume if interrupted. Go?

   The user can also choose a later start date instead of all time.
3. On go, process the full history with any rules learned from the user's corrections, following `backfill`: batches, checkpoints, deduplication by source ID, then a consolidation pass and a check against shipped features.
4. Merge the result into the tree, then show the user what changed and only what the agent is unsure of (low-confidence attachments, consolidated candidates it did not create on its own). Record the user's corrections as in step 7.

The user may decline, for example when the product changed so much that older feedback no longer applies. Say that the full history can still be processed later by running this onboarding's step 8 again, then continue to activation.

## Step 9 – Activation

1. Create two scheduled tasks: a daily run (`daily-run`) on working days and a weekly synthesis (`weekly-synthesis`). Ask the user for the times. If they already exist for another squad, add this squad to them instead of creating new ones: one daily run and one weekly synthesis cover all the squads, so the user gets one notification a day.
   - **Where they run.** Prefer a cloud scheduled task (`/schedule` in Claude Code): it runs when the computer is off and has the user's connectors, but it starts from a fresh copy of the repositories attached to it and sees no local file. Attach this plugin's repository to it. Use a desktop scheduled task (Claude Desktop) only when a source is a local export folder: it sees local folders, but runs only while the app is open and the computer awake. Never use a loop tied to the current session: it stops when the session closes.
   - **What the task says.** Its prompt names the skill and the squads, for example: "Run the `daily-run` skill of the live-product-discovery plugin for these squads: <link to each configuration page>. If the plugin is not installed here, read `skills/daily-run/SKILL.md` from the attached repository: the plugin root is the repository root." Adding a squad means adding its link to both tasks.
   - **How to create them.** Use the scheduling command of the environment when there is one. Otherwise give the user the exact prompt, schedule and repository to enter, and check with them that both tasks exist.
   - **Local material.** Files imported during the onboarding are already processed. A cloud run cannot read an export folder: say so, and offer a desktop scheduled task, or new files imported by hand with `ost-change-sources`.
2. Explain how the agent works from now on: it proposes each type of structural change until the squad's decisions show it gets that type right, then acts on its own when it is sure, and lists what it did in the recap, where `/live-product-discovery:ost-undo` reverses any of it. Say which types the quick review has already earned. Offer `autonomy: proactive` to a squad that wants the agent to act from the first day, and `autonomy: propose-only` to one that prefers to decide everything.
3. Confirm the freshness settings: 8 weeks without evidence after a release before proposing `addressed`, 24 weeks without evidence before asking whether an opportunity is still current. The user can change them.
4. End with a summary: outcome, period covered, number of opportunities and evidence, sources connected, schedule, and what the first daily recap will look like. Tell the user that if the squad changes course later, they can run `/live-product-discovery:ost-change-outcome <squad name>`, that `/live-product-discovery:ost-change-sources <squad name>` adds, replaces or removes a source, that `/live-product-discovery:ost-undo` reverses a change made by the agent, and that running this onboarding again adds another squad.
