---
name: daily-run
description: The daily run of live-product-discovery. Reads new calls and tickets since the last run, attaches evidence to the tree, writes a log entry and returns a short recap. Meant to be triggered by a scheduled task.
---

# Daily run

You run unattended. Nobody will answer questions during the run: make reasonable decisions, log them, and finish. Follow `ost-rules`.

## Steps

1. **Load context**, reading Notion as described in "Reading the databases" in `templates/notion-data-model.md`: the sources configuration, the active outcome and north star, the current tree (including parked opportunities), the date of the last run, and the rules learned from past corrections.
2. **Collect**: fetch calls and tickets created since the last run from each configured source, and skip any item whose source ID is already in the evidence database. If a source fails, note it and continue with the others. If the volume is unusually large (for example after a long interruption), process it following `backfill`.
3. **Extract**: from each item, extract the customer needs and pain points, with exact verbatims.
4. **Attach**: check each piece of evidence is within the squad's scope (mark it `out of scope` otherwise), then attach it to the most specific matching opportunity, with a one-sentence rationale. Parked and addressed opportunities can receive evidence too: new evidence on an addressed opportunity makes it active again, and the recap says so. When the opportunity has a shipped solution, say in the rationale that the evidence follows the release. If nothing fits, mark it `unattached`.
5. **Update**: refresh evidence counts, accounts and last-evidence dates, computed as described in "Reading the databases" in `templates/notion-data-model.md`, never read from the rollups. Flag opportunities whose evidence grew notably.
6. **Propose**: if several unattached pieces point to the same new need, propose a new opportunity. Never create it yourself.
7. **Log**: write one run log entry with what was ingested, what was attached (before and after), proposals awaiting a decision, and anomalies. Also record the finish time, the status of each source (OK, partial or failed) and the plugin version: they feed the "last refresh" and the tree changelog of the live view. Write the run log entry even when nothing changed, so the last refresh stays accurate.

In observation mode, do steps 1 to 4 and 6 to 7, but write attachments to the log as proposals instead of changing the tree.

## Recap

End with a short recap, readable in ten seconds. It becomes the notification. Format:

```
OST – <date>: <n> calls and <n> tickets analysed
• <n> pieces of evidence attached (<n> to existing opportunities, <n> pending)
• Trending: "<opportunity>" (+<n> evidence, now #<rank>)
• To decide: new opportunity "<name>" (<n> evidence, <n> accounts)
• To sort: <n> unattached verbatims
• Out of scope: <n> verbatims about other squads' areas
• Sources: <status of each source>
```

On a day with nothing new: "Nothing new, tree unchanged."

On the first run after a change of course, open the recap with one line: "New outcome since <date>: <outcome>."
