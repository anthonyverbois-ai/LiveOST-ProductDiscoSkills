---
name: ost-change-sources
description: Adds, replaces or removes a source of a squad (for example a new call recorder, or one data warehouse replacing another) without touching the tree. Reconnects and tests the new tool, rewrites the saved queries, compares old and new figures before switching, avoids duplicate evidence and keeps a trace of the change.
disable-model-invocation: true
argument-hint: "[optional: squad name] [optional: the source to change]"
---

# Changing sources

Run this as a conversation with the user when a squad adds, replaces or removes a source. The tree, the outcome and the learned rules do not change. Follow `ost-rules` throughout. Speak the user's language. Keep the user oriented the same way as in `ost-setup`: show the 5 steps at the start, and open and close each step with its position and a progress line.

Plugin files: the skills named in backticks (`ost-rules`, `build-tree`, `backfill`, …) belong to this plugin. Load them with the Skill tool as `live-product-discovery:<name>`, or read `${CLAUDE_PLUGIN_ROOT}/skills/<name>/SKILL.md`. Templates are in `${CLAUDE_PLUGIN_ROOT}/templates/`. When the plugin is read from its repository instead of being installed, `${CLAUDE_PLUGIN_ROOT}` is not substituted: it means the repository root.

When several squads are set up, work on one squad only: the one named as argument, or ask which one. If the same tool feeds other squads, say so and offer to apply the change to them afterwards, one squad at a time.

## Step 1 – Take stock

Show the squad's sources from the Sources database: tool, status, last successful read. Ask what changes: a source added, replaced (old tool → new tool) or removed, and from which date.

## Step 2 – Connect and test the new tool

Skip this step when a source is only removed. A file of customer feedback has no connector: map its columns with the user as in onboarding step 2. A new version of a file already imported adds only its new rows.

1. Detect whether a connector for the new tool is already connected. If not, ask the user to connect it: the user authenticates, never the agent.
2. Run a test read and show a sample, as in onboarding step 2.
3. Set the filters from the squad's scope, as in onboarding step 2.

## Step 3 – Switch without breaking anything

For **quantitative data**:

1. Rewrite the three saved queries (accounts, usage, outcome) and the account key for the new tool, and test them with the user, as in onboarding step 2.
2. Compare the new results with the last figures from the old tool: total ARR, accounts matched, usage of the squad's features, the outcome's metric. If the old tool can still be read, run both once on the same period.
3. Show the differences. If they are large enough to change the ranking, say which opportunities would move and why, and switch only after the user's go.

For a source of **evidence** (calls, tickets, team channels):

1. Start reading the new tool where the old one stopped: from the old source's last successful read, or from the date the user gives.
2. If the new tool holds history the old one already covered (a migration), do not import it again. Propose a backfill (see `backfill`) only for periods no source covered.
3. Source IDs change with the tool. During the overlap, also check date, account and verbatim to avoid ingesting the same call, ticket or message twice.

## Step 4 – Keep a trace

1. Keep all evidence already collected. Tell the user that its links will stop working if the old tool is cancelled.
2. In the Sources database, mark the old row `replaced` (or `removed`), with the date and, for a replacement, the new tool in its detail. Add a row for the new tool with its test result.
3. Update the squad's configuration page (see `${CLAUDE_PLUGIN_ROOT}/templates/sources.example.yaml`), then read it back.
4. Write the change in the run log. The next daily recap opens with it.

## Step 5 – Confirm

End with a summary: what changed, from which date, the new tool's test result, the differences found on quantitative figures, and any history imported or left aside.
