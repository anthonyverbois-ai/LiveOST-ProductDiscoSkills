# Rules for working in this repository

This is the public repository of LiveOST, the `live-product-discovery` Claude plugin. Anyone, including Claude sessions opened from a company account, may contribute here. These rules apply to every session.

## Never commit real data

- No customer or company names, account names, people's names or email addresses.
- No verbatims, call transcripts, ticket contents or meeting notes from real customers.
- No real metrics, ARR, usage figures or screenshots of a real product.
- Examples must be clearly fictional and generic ("a B2B SaaS team", "Account A").

If a change was inspired by real usage, describe the generic need, never the underlying data. When in doubt, leave it out and ask the maintainer in the pull request.

## How changes land

- All changes go through a pull request to `main`; never push to `main` directly.
- Keep each pull request focused on one change and fill in the checklist in the template.
- Update `CHANGELOG.md` under "Unreleased" for any user-visible change.

## Writing skills

- Skills live in `skills/<skill-name>/SKILL.md`. Keep `skills/ost-rules/SKILL.md` as the single place where OST rules are defined; other skills refer to it instead of restating rules.
- Skills must stay tool-agnostic: read sources through whatever connectors the user declared in their config, never hard-code one vendor.
- Point to plugin files with `${CLAUDE_PLUGIN_ROOT}` (for example `${CLAUDE_PLUGIN_ROOT}/templates/notion-data-model.md`), never with a path relative to the working folder: once installed, the plugin does not live in the user's folder. Name other skills by their skill name (`live-product-discovery:<name>`).
- Write skills in plain English, short sentences, imperative voice.
