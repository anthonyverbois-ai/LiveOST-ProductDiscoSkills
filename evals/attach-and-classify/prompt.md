---
allowed_tools: [Read, Glob, Grep, Skill]
---
Test mode: do not call any connector and do not write to Notion or to any file. Apply the rules of the live-product-discovery plugin (skill `live-product-discovery:ost-rules`) to the fictional data below, and answer in the chat.

Squad: Reports. Own company: Northwind. Every named account other than Northwind is a customer (from the accounts query), unless marked as a prospect.
Scope: owns the report builder and report templates. Out of scope: data connectors and billing, owned by other squads.

Tree:
1. "I lose time reformatting my exports": exports need manual fixing before they can be sent.
2. "I can't find the right template for my use case": templates do not match what people try to build.
3. "I rebuild the same layout every month": recurring reports are rebuilt from scratch.

New items, as the daily run would read them:
- T1 · ticket · 2026-10-30 · account: Contoso · "The PDF export ignores my page breaks again, I redo the layout by hand before every board meeting."
- T2 · ticket · 2026-10-30 · account: Fabrikam · "Clicking Export to PDF crashes the app since yesterday's update."
- T3 · ticket · 2026-10-31 · account: Contoso · "How do I save a report as a template so I can reuse it next month?"
- C1 · call · 2026-10-29 · account: Litware · "Our invoices have been wrong since you changed our plan."
- C2 · call · 2026-10-29 · account: Adatum · "I can't tell when the data behind this chart was last refreshed."
- M1 · team channel message · 2026-10-31 · account: Northwind · posted by a Northwind account manager: "Tailspin told me today they spend an hour every month rebuilding the same KPI report."
- M2 · team channel message · 2026-10-31 · account: Northwind · posted by a Northwind designer: "I personally think templates should be sorted by use case."

For each item, give: the need in one line, the kind, the account and its type, the decision (an opportunity number, unattached, new candidate or out of scope) and a one-sentence rationale. Then give the evidence and the customer accounts each opportunity gains.
