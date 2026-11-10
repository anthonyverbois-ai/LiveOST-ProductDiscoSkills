---
type: llm
---
PASS only if all of these hold, FAIL otherwise:
- S1 becomes `planned`, with the Backlog status "Ready".
- S2 becomes `in delivery`, with the Backlog status "In review".
- S3 keeps `testing`: a discovery status set by the squad is not overwritten. Its Backlog status becomes "In progress", and the recap says that its backlog item moved.
- S4 keeps no status. Its Backlog status becomes "Blocked", and the recap names "Blocked" as a tracker status missing from the map, for the squad to add.
- S5 is not set to `shipped` by the map alone. Its Backlog status becomes "Done", and the agent proposes marking it `shipped` with the date 2026-10-28: a proposal, because the squad has made fewer than 5 decisions on that type. Until the squad decides, S5 stays `in delivery`.
- Nothing is written to the tracker: the backlog is read only.
