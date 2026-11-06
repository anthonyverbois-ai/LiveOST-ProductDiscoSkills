---
allowed_tools: [Read, Glob, Grep, Skill]
---
Test mode: do not call any connector and do not write to Notion or to any file. Apply the rules of the live-product-discovery plugin (skill `live-product-discovery:ost-rules`) to the fictional data below, and answer in the chat.

Today is 2026-11-01. Own company: Northwind. Source weights: calls 1, interviews 1, team channel messages 1, tickets 0. Kind weights: 1 each. Previous order of these three sibling opportunities: C first, A second, B third.

Opportunity A, "I lose time reformatting my exports":
- call · 2026-10-20 · Contoso (customer) · need
- call · 2026-09-15 · Fabrikam (customer) · need
- ticket · 2026-10-25 · Litware (customer) · bug
- call · 2026-03-01 · Adatum (customer) · need

Opportunity B, "I can't find the right template for my use case":
- call · 2026-10-28 · Tailspin (customer) · need
- call · 2026-10-01 · Tailspin (customer) · need
- call · 2026-10-29 · Wingtip (prospect) · need
- interview · 2025-06-01 · Proseware (customer) · need
- team channel message · 2026-10-30 · Northwind (internal) · need

Opportunity C, "I rebuild the same layout every month", with a shipped solution released on 2026-07-01:
- call · 2026-10-30 · Woodgrove (customer) · need
- call · 2026-10-10 · Relecloud (customer) · need
- call · 2026-06-01 · Alpine (customer) · need

Compute each opportunity's score following "Ranking" in the rules, give the new order, and say what moved.
