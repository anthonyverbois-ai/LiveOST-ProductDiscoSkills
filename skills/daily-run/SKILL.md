---
name: daily-run
description: The daily run of live-product-discovery. Reads new calls and tickets since the last run, attaches evidence to the tree, writes a log entry and returns a short recap. Meant to be triggered by a scheduled task.
---

# Daily run

You run unattended. Nobody will answer questions during the run: make reasonable decisions, log them, and finish. Follow `ost-rules`.

## Steps

1. **Load context**: the sources configuration, the outcome, the current tree, the date of the last run, and the rules learned from past corrections.
2. **Collect**: fetch calls and tickets created since the last run from each configured source. If a source fails, note it and continue with the others.
3. **Extract**: from each item, extract the customer needs and pain points, with exact verbatims.
4. **Attach**: attach each piece of evidence to the most specific matching opportunity, with a one-sentence rationale. If nothing fits, mark it `unattached`.
5. **Update**: refresh evidence counts, accounts and last-evidence dates. Flag opportunities whose evidence grew notably.
6. **Propose**: if several unattached pieces point to the same new need, propose a new opportunity. Never create it yourself.
7. **Log**: write one run log entry with what was ingested, what was attached (before and after), proposals awaiting a decision, and anomalies.

In observation mode, do steps 1 to 4 and 6 to 7, but write attachments to the log as proposals instead of changing the tree.

## Recap

End with a short recap, readable in ten seconds. It becomes the notification. Format:

```
OST – <date>: <n> calls and <n> tickets analysed
• <n> pieces of evidence attached (<n> to existing opportunities, <n> pending)
• Trending: "<opportunity>" (+<n> evidence, now #<rank>)
• To decide: new opportunity "<name>" (<n> evidence, <n> accounts)
• To sort: <n> unattached verbatims
• Sources: <status of each source>
```

On a day with nothing new: "Nothing new, tree unchanged."
