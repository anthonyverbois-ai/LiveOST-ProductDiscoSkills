# Contributing to live-product-discovery

Thanks for helping make continuous discovery easier for every product team. You don't need to code to contribute: most of this plugin is plain-text instructions for Claude.

## Ways to contribute

- **Report a bug**: something the agent did wrong or a step that failed. Open an issue with the "Bug" template.
- **Suggest an idea**: a new source, a better recap, a missing step. Open an issue with the "Idea" template.
- **Propose a change**: improve a skill, add support for a new tool, fix the docs. Open a pull request.

## The one non-negotiable rule

**Never commit real data.** No customer or company names, no verbatims or transcripts, no real metrics, no screenshots of a real product. Describe the generic need instead. Pull requests containing real data will be closed.

## Proposing a change

1. Fork this repository to your GitHub account.
2. Make your change on a branch in your fork. With Claude Code, you can simply ask: "propose an improvement to the onboarding in anthonyverbois-ai/live-product-discovery".
3. Test it on your own data, in your own environment.
4. Open a pull request to `main` and fill in the checklist.
5. The maintainer reviews it, may ask questions, then merges or explains why not.

## Style

- Skills: short sentences, imperative voice, plain English.
- OST rules live only in `skills/ost-rules/SKILL.md`; other skills refer to it.
- Keep skills tool-agnostic: no hard-coded vendor.
- Add a line to `CHANGELOG.md` under "Unreleased" for any user-visible change.
