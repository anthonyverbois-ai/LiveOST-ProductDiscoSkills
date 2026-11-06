---
type: llm
---
PASS only if all of these hold, FAIL otherwise:
- C1 is the original; N1 and M1 are linked to C1 as duplicates (same account Contoso, same need, within 3 days) and not counted again.
- N1 is recognised as a summary written by a colleague, not the customer's words, with a confidence of medium or low.
- C2 is not a duplicate (it is 15 days before C1) and counts as its own evidence.
- C3 is not a duplicate (another account) and counts.
- Opportunity 1 gains 3 pieces of evidence (C1, C2, C3) and 2 customer accounts (Contoso, Fabrikam). Northwind is never counted as an account.
