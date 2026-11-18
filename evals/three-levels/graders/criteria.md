---
type: llm
---
PASS only if all of these hold, FAIL otherwise:
- Scores before the new call: P = 7, Q = 4, P1 = 5, P2 = 2, P1a = 3, P1b = 1.
- P1 counts Fabrikam once, although it appears in P1 and in P1b (5 accounts, not 6). P counts Contoso, Relecloud and Woodgrove once each (7 accounts, not 8): its values come from the evidence of every opportunity under it, never from adding up its children's counts.
- Evidence counts: P = 10, P1 = 7, P1a = 3, P1b = 2, P2 = 2, Q = 4. Prospects: Wingtip counts as one prospect on P1b, P1 and P, and adds nothing to any score.
- Numbers in the tree: P = 1, Q = 2, P1 = 1.1, P2 = 1.2, P1a = 1.1.1, P1b = 1.1.2.
- After the new call: P1b, P1 and P are recomputed, and nothing else. New scores: P1b = 2, P1 = 6, P = 8. The order does not change.
