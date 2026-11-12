---
type: llm
---
PASS only if all of these hold, FAIL otherwise (name the first item that fails):
- T1 is attached to opportunity 1, kind need or bug, account Contoso (customer).
- T2 is kind bug, account Fabrikam (customer), attached to opportunity 1 or made a new candidate, with a rationale either way.
- T3 is kind question, account Contoso, attached to opportunity 3 or 2 with a rationale.
- C1 is out of scope (billing belongs to another squad) and attached to nothing.
- C2 is a new candidate: a clear need that no opportunity holds. It is not forced into an existing opportunity, not left unattached, and not marked out of scope (data freshness could concern data connectors, but "when in doubt, treat it as in scope").
- M1 has the account Tailspin (not Northwind), type customer, is attached to opportunity 3, and the rationale says the feedback was relayed by a colleague.
- M2 has the account type internal and is not counted as a customer account anywhere.
- Quoted verbatims are the exact words of the items, not paraphrases.
