---
allowed_tools: [Read, Glob, Grep, Skill]
---
Test mode: do not call any connector and do not write to Notion or to any file. Apply the rules of the live-product-discovery plugin (skill `live-product-discovery:ost-rules`) to the fictional situation below, and answer in the chat.

Squad: Reports. Own company: Northwind. The onboarding is at step 2 (sources). Trial period: the last 60 days.

Team channels in the configuration: one channel, `#customer-feedback`.

What the test of this source showed:
- The chat connector lists the 50 most recently active conversations of the channel, and cannot page further.
- Of these 50 conversations, 38 started in the trial period. The oldest of the 38 started 45 days ago.
- The same connector has a search tool. It has no channel filter: it searches every channel and every private chat the user is in.

After the trial batch, opportunity 1 ("I lose time reformatting my exports") holds 6 pieces of evidence from this channel, from 5 customer accounts.

Say: how you record this source, what you tell the user before the trial batch, whether you use the search tool to reach the older conversations, and what you report for opportunity 1.
