---
allowed_tools: [Read, Glob, Grep, Skill]
---
Test mode: do not call any connector and do not write to Notion or to any file. Apply the rules of the live-product-discovery plugin (skill `live-product-discovery:ost-rules`) to the fictional data below, and answer in the chat.

Today is 2026-11-01. Own company: Northwind. `account_level: entity`. Every source weighs 1 and every kind weighs 1. No shipped solution. Duplicate window: 3 days.

Contoso is one company: Finance and Treasury are two of its teams. Fabrikam and Woodgrove are groups whose national subsidiaries buy separately.

Accounts query, one line per record of the data source (record · group · revenue):
- Contoso Finance · Contoso · 20,000
- Contoso Treasury · Contoso · 10,000
- Fabrikam Germany · Fabrikam · 40,000
- Fabrikam France · Fabrikam · 60,000
- Fabrikam Spain · Fabrikam · 50,000
- Woodgrove UK · Woodgrove · 25,000
- Woodgrove US · Woodgrove · 35,000
- Litware · Litware · 15,000
- Tailspin · Tailspin · 0

Adatum is not in the data source. The insight platform that holds the Woodgrove insight shows, on its own Woodgrove record, a revenue of 0 and the status "former customer".

Parent opportunity P, "Updating my monthly report takes me too long", has no evidence of its own. It has two sub-opportunities.

P1, "I re-enter the same figures every month":
- call · 2026-10-05 · Fabrikam · need
- call · 2026-10-10 · Contoso, Finance team · need
- call · 2026-10-22 · Contoso, Treasury team · need
- team channel message · 2026-10-25 · Fabrikam Germany ; Fabrikam France · need
- call · 2026-10-29 · Tailspin · need

P2, "I cannot tell which figures changed since last month":
- insight · 2026-10-15 · Woodgrove · bug
- call · 2026-10-18 · Litware · need
- call · 2026-10-19 · Adatum · need

For P1, P2 and P, give the evidence count, the accounts, the prospects and the revenue. Then say which of P1 and P2 ranks first, and why.
