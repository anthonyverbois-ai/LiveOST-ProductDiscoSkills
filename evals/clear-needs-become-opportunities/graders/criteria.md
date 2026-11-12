---
type: llm
---
PASS only if all of these hold, FAIL otherwise:
- N1 and U1 end up on one new opportunity about not knowing which filters were applied to a shared report. Its name is written from the customer's point of view and does not name a feature to build.
- The agent creates that opportunity on its own: no proposal waits for the squad's decision first. The answer may add that the creation is listed in the recap and can be undone.
- That opportunity holds 2 pieces from 2 customer accounts (Contoso and Fabrikam), so its status is `active`. An answer that creates it as a `candidate` and activates it in the same run is accepted.
- N2 stays unattached: it is too vague to name a need. No opportunity is created from it.
- N3 creates no opportunity: it is a colleague's own opinion, with the account type internal, counted as no account.
- N4 does not recreate the opportunity the squad rejected. It stays unattached, and the answer says the squad already rejected that need.
- The squad is asked to do nothing about the unattached pieces: they are not presented as something to sort, and the agent reads them again at the next runs.
