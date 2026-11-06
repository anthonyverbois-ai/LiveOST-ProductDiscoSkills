---
allowed_tools: [Read, Glob, Grep, Skill]
---
Test mode: do not call any connector and do not write to Notion or to any file. Apply the rules of the live-product-discovery plugin (skill `live-product-discovery:ost-rules`) to the fictional data below, and answer in the chat.

Squad: Reports. Own company: Northwind. Every named account other than Northwind is a customer. Duplicate window: 3 days.

Tree:
1. "I lose time reformatting my exports": exports need manual fixing before they can be sent.

New items:
- C1 · call · 2026-10-20 · account: Contoso · "Every week I spend an hour fixing fonts and column widths after I export the report."
- N1 · insight from the product feedback tool · 2026-10-21 · company: Northwind · written by a Northwind account manager: "Contoso: customer spends about 1h/week fixing export formatting."
- M1 · team channel message · 2026-10-22 · account: Northwind · "Contoso complained again about export formatting, an hour every week."
- C2 · call · 2026-10-05 · account: Contoso · "The exported report never keeps our fonts, we fix it by hand."
- C3 · call · 2026-10-21 · account: Fabrikam · "After export, the column widths are all wrong and I fix them manually."

Attach these items to the tree. Say which pieces are duplicates of which, then give opportunity 1's evidence count and customer accounts.
