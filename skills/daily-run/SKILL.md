---
name: daily-run
description: The daily run of live-product-discovery. Reads new calls and tickets since the last run, attaches evidence to the tree, writes a log entry and returns a short recap. Meant to be triggered by a scheduled task.
---

# Daily run

You run unattended. Nobody will answer questions during the run: make reasonable decisions, log them, and finish. Follow `ost-rules`.

Plugin files: the skills named in backticks (`ost-rules`, `build-tree`, `backfill`, …) belong to this plugin. Load them with the Skill tool as `live-product-discovery:<name>`, or read `${CLAUDE_PLUGIN_ROOT}/skills/<name>/SKILL.md`. Templates are in `${CLAUDE_PLUGIN_ROOT}/templates/`.

When several squads are set up, run the steps below for each squad in turn, each with its own configuration, tree, learned rules and autonomy setting. A failure on one squad does not stop the others. End with a single recap covering all the squads.

## Steps

1. **Load context**, reading Notion as described in "Reading the databases" in `${CLAUDE_PLUGIN_ROOT}/templates/notion-data-model.md`: the squad's configuration page, the active outcome and north star, the current tree (including parked opportunities), the date of the last run, and the `active` rules of the Rules database.
2. **Collect**: fetch calls and tickets created since the last run from each configured source, and skip any item whose source ID is already in the evidence database. From team channels, fetch the new messages and also the new replies in older threads: a thread can continue days after its first message. Read each thread whole, following the team channel rules in `ost-rules`. If a source fails, note it and continue with the others. If a source is an export folder this run cannot see (a cloud run sees no local file), mark it `partial` with "export folder not visible from a cloud run" and continue. If the volume is unusually large (for example after a long interruption), process it following `backfill`.
   Record each source's health in the Sources database: status, last check, items read, and the last successful read when the read worked. Mark a source `failed` when it cannot be read, with the error in one sentence. Mark it `partial` when only part of it could be read, or when a source that usually returns items has returned none for 3 working days ("no new items since <date>"): a silent connector can look healthy. Say in the detail what the tree may miss.
3. **Extract**: from each item, extract the customer needs and pain points, with exact verbatims, and give each piece its kind: need, bug or question (see "Kinds of evidence" in `ost-rules`).
4. **Attach**: check each piece of evidence is within the squad's scope (mark it `out of scope` otherwise), then attach it to the most specific matching opportunity, with a one-sentence rationale. Parked and addressed opportunities can receive evidence too: new evidence that the need persists makes an addressed opportunity active again, and the recap says so. Evidence that criticizes a shipped feature itself is a new need: propose it as a new opportunity instead, following "Shipped features" in `ost-rules`. When the opportunity has a shipped solution, say in the rationale that the evidence follows the release. If nothing fits, mark it `unattached`. Record where you put it in Agent choice.
5. **Update**: recompute the stored counts (evidence count, accounts, last evidence) of the opportunities touched by this run, and of those whose evidence was edited by hand since the last run, as described in "Reading the databases" in `${CLAUDE_PLUGIN_ROOT}/templates/notion-data-model.md`. Flag opportunities whose evidence grew notably. Refresh the backlog status of the solutions linked to the backlog; when a linked item is delivered, propose marking the solution `shipped`, with its date.
6. **Act or propose**: if several unattached pieces point to the same new need, create the opportunity when the conditions in "Changes and autonomy" (`ost-rules`) hold; otherwise propose it. The same applies to every other structural change.
7. **Log**: write one run log entry with what was ingested, what was attached and the anomalies. Write each change made on its own and each proposal to the Changes database, linked to that entry. Also record the finish time, the status of each source (OK, partial or failed) and the plugin version: they feed the "last refresh" and the tree changelog of the live view. Write the run log entry even when nothing changed, so the last refresh stays accurate.

With `autonomy: propose-only`, every change beyond attaching evidence and updating counts is a proposal.

## Recap

End with a short recap, readable in ten seconds. It becomes the notification. Format:

```
OST – <date>: <n> calls and <n> tickets analysed
• <n> pieces of evidence attached (<n> to existing opportunities, <n> pending)
• Trending: "<opportunity>" (+<n> evidence, now #<rank>)
• Done by the agent: <n> changes (for example: created "<name>", merged "<a>" into "<b>"), each with its reason in the Changes database; undo one with /live-product-discovery:ost-undo
• To decide: new opportunity "<name>" (<n> evidence, <n> accounts)
• To sort: <n> unattached verbatims
• Out of scope: <n> verbatims about other squads' areas (<n> for <other squad set up here>)
• Sources: <status of each source>; when a source has failed for 3 working days in a row, add: "to replace or reconnect it, run /live-product-discovery:ost-change-sources"
```

On a day with nothing new: "Nothing new, tree unchanged."

With several squads, send one recap: a first line with the date, then one section per squad with the lines above, the squad's name as its title. A squad with nothing new takes one line: "<squad>: nothing new, tree unchanged." List the sources once, at the end.

Out-of-scope evidence that falls within another squad set up here is not moved by this run: that squad's own pass reads the same sources with its own filters and attaches it. The recap only counts it.

On the first run after a change of course, open the recap with one line: "New outcome since <date>: <outcome>."
