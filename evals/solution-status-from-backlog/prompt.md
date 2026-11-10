---
allowed_tools: [Read, Glob, Grep, Skill]
---
Test mode: do not call any connector and do not write to Notion or to any file. Apply the rules of the live-product-discovery plugin (skill `live-product-discovery:ost-rules`) to the fictional data below, and answer in the chat.

Today is 2026-11-01. Autonomy: `earned`. The squad has made 2 decisions so far on changes of type `mark shipped`.

The backlog source has this map in the configuration:

```yaml
status_map:
  planned: ["To do", "Ready"]
  in delivery: ["In progress", "In review"]
  shipped: ["Done"]
```

Five solutions of the tree are linked to a backlog item. For each: its status in the tree before this run, then the status of its item in the tracker today.
- S1, "Bulk edit of report columns": no status · item "Ready"
- S2, "Saved layouts": planned · item "In review"
- S3, "Template gallery": testing, set by the squad last week · item "In progress"
- S4, "Scheduled exports": no status · item "Blocked"
- S5, "Export to PDF": in delivery · item "Done", completed on 2026-10-28

For each solution, give its Status and its Backlog status after this run. Then say what the recap mentions, and what the agent writes in the tracker.
