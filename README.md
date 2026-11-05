# live-product-discovery

**An Opportunity Solution Tree that keeps itself up to date.**

`live-product-discovery` is an open-source Claude plugin for product managers who practice continuous discovery. Every day, an agent reads your squad's new customer calls and support tickets, attaches each piece of customer evidence to the right opportunity in your tree, and tells you exactly what changed. Your team stays in charge of the decisions; the agent does the linking.

> Status: **v0.1 in progress.** The structure is in place; the skills are being written and tested on real squads.

## Why

Opportunity Solution Trees (the continuous discovery framework popularized by Teresa Torres) are powerful, but they go stale fast: nobody has time to re-read every call and ticket and connect the dots. Existing OST skills generate a tree once from notes you paste in. This plugin maintains it over time:

| | One-shot OST generators | live-product-discovery |
| --- | --- | --- |
| How it runs | Once, on demand | Every day, on a schedule |
| Inputs | Notes pasted by hand | Calls, tickets and product data through your connectors |
| Evidence | Not traced | Every opportunity linked to its verbatims |
| Learning | None | Your team's corrections become rules |

## How it works

1. **Onboarding** (`/live-product-discovery:ost-setup`): set your outcome, connect your sources, review a pre-flight recap of what will be processed (volumes, samples, alerts), ingest the last 60 to 90 days once you give the go, and calibrate the first tree with your team.
2. **Daily run**: new calls and tickets are read, evidence is attached, and you get a short recap plus a detailed log entry. Every change can be undone.
3. **Weekly synthesis**: opportunities are re-ranked, structural changes are proposed, and the agent learns from the corrections you made during the week. It also flags when the evidence starts drifting away from your outcome.
4. **Change of course** (`/live-product-discovery:ost-change-outcome`): when the squad adopts a new outcome or north star, the tree is re-anchored. Opportunities are kept, reframed or parked, nothing is deleted, and the squad recalibrates the result.

Design principles:

- **The agent feeds the tree, the squad decides.** Evidence is attached automatically; structural changes (new, merged or re-prioritized opportunities) need a human.
- **No evidence without a source.** Every piece of evidence carries a verbatim, a source, an account, a date and a link.
- **Tool-agnostic.** You declare your own sources (Gong, Modjo, Zendesk, Intercom, Amplitude, …) in a config file.
- **Notion is the source of truth** for the tree's data.

## Roadmap

- **v0.1 – The living tree**: onboarding, daily run, recap and log, weekly synthesis.
- **v0.2 – The live view**: an always-up-to-date visual of the tree, with what changed today, one-click approvals, the last refresh date and the tree's changelog. See [docs/live-view.md](docs/live-view.md).
- **v0.3 – Solution discovery**: prototypes for solutions under test, compared side by side, and draft outreach to the customers who raised the pain.

## Install

In Claude Code:

```
/plugin marketplace add anthonyverbois-ai/live-product-discovery
/plugin install live-product-discovery@live-product-discovery
```

Then run `/live-product-discovery:ost-setup` and follow the conversation.

## Repository layout

```
.claude-plugin/        plugin manifest and marketplace entry
skills/
  ost-setup/           onboarding: outcome, sources, backfill, calibration
  ost-change-outcome/  re-anchoring the tree when the squad changes course
  ost-rules/           the OST rules every other skill follows
  daily-run/           daily ingestion, attachment, recap and log
  weekly-synthesis/    ranking, structural proposals, learning loop
templates/             Notion data model and sources config example
docs/                  specifications of upcoming versions (live view)
```

## Contributing

Contributions are welcome, from code to ideas. Read [CONTRIBUTING.md](CONTRIBUTING.md) first. The one non-negotiable rule: **never commit real customer data** (names, verbatims, accounts, metrics).

## License

[MIT](LICENSE)
