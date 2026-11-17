---
allowed_tools: [Read, Glob, Grep, Skill]
---
Test mode: do not call any connector and do not write to Notion or to any file. Apply the rules of the live-product-discovery plugin (skill `live-product-discovery:ost-rules`) to the fictional data below, and answer in the chat.

Today is 2026-11-01. Own company: Northwind. Source weights: calls 1. Kind weights: 1 each. No accounts query. This is the first ranking: there is no previous order. Every piece of evidence below is a call of October 2026, of kind need. Each opportunity lists only the evidence attached to it directly.

Top-level opportunity P, "I spend too long preparing client reports":
- Contoso (customer)

  Sub-opportunity P1 of P, "I can't trust the figures I paste into my reports":
  - Fabrikam (customer)
  - Litware (customer)

    Sub-opportunity P1a of P1, "I don't know which figures are out of date":
    - Contoso (customer)
    - Adatum (customer)
    - Tailspin (customer)

    Sub-opportunity P1b of P1, "I re-check every figure by hand":
    - Fabrikam (customer)
    - Wingtip (prospect)

  Sub-opportunity P2 of P, "I rebuild my report layout every month":
  - Relecloud (customer)
  - Woodgrove (customer)

Top-level opportunity Q, "I can't share a report with my client safely":
- Alpine (customer)
- Proseware (customer)
- Relecloud (customer)
- Woodgrove (customer)

1. For each of the six opportunities, give its evidence count, its customer accounts, its prospects and its score.
2. Rank them and give each its number in the tree.
3. A new call from Alpine (customer) is attached to P1b. Which opportunities must be recomputed, and what are their new scores?
