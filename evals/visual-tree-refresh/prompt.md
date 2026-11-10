---
allowed_tools: [Read, Glob, Grep, Skill]
---
Test mode: do not call any connector, do not write to Notion or to any file, and do not publish anything. Apply the `live-product-discovery:ost-view` skill of the live-product-discovery plugin to the fictional situation below, and answer in the chat.

Squad A has its tree in Notion and no outcome yet. Its configuration holds:

```yaml
focus: "The biggest customer signals on our scope"
view:
  url: "https://pages.example/squad-a-tree"
  evidence_recent: 3
```

A daily run has just finished and its run log entry is closed.

Opportunities read from Notion (name · status · parent · rank · evidence count · accounts):
- A, "I lose time reformatting my exports" · active · no parent · 1 · 6 · 4
- B, "Charts break when I paste them elsewhere" · active · parent A · 1 · 2 · 2
- C, "I cannot tell when my data was last refreshed" · candidate · no parent · no rank · 1 · 1
- D, "I need to share reports outside my company" · proposed · no parent · no rank · 0 · 0
- E, "The old export wizard is confusing" · archived

Evidence read from Notion, newest first (date · opportunity · account · note):
1. 2026-11-05 · A · Contoso
2. 2026-11-05 · B · Fabrikam
3. 2026-11-04 · A · Contoso · linked as a duplicate of a call of 2026-11-03
4. 2026-11-03 · A · Contoso
5. 2026-11-02 · A · Litware
6. 2026-11-05 · no opportunity · Tailspin · out of scope

Say:
1. which opportunities go into the data file, and under which heading each one appears on the page;
2. which pieces of evidence are copied into the data file;
3. which counts the card of A shows;
4. where the page is published, and what happens to the page file itself;
5. what you do and what you say if this session cannot publish pages;
6. what the top of the tree shows, since the squad has no outcome.
