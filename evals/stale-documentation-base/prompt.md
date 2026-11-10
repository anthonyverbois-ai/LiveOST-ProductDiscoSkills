---
allowed_tools: [Read, Glob, Grep, Skill]
---
Test mode: do not call any connector and do not write to Notion or to any file. Apply the rules of the live-product-discovery plugin (skill `live-product-discovery:ost-rules`) to the fictional situation below, and answer in the chat.

Squad: Reports. Own company: Northwind. Today is 2026-11-10, and the weekly synthesis runs.

Documentation in the configuration: `via: knowledge-base`, a folder the squad maintains with its own refresh command, `max_age_days: 35`. The release notes are in the same base.
- A note in the configuration page says "base refreshed on 2026-10-20".
- The index file of the base says "Built on 2026-09-12".
- The latest release listed in the base is version 4.2, released on 2026-09-08. The squad releases every two weeks.
- The base has no page about scheduling reports.

Tree:
1. "I can't have a report sent every month without doing it by hand": 7 pieces of evidence, 6 customer accounts, no solution linked, latest evidence on 2026-09-01.

Say: which date you use for the base and how old it is, how you record the source, what you conclude about opportunity 1 and shipped features, and what you do about the base itself.
