---
name: build-tree
description: How live-product-discovery turns a set of evidence into opportunities - needs, grouping, hierarchy, link to the outcome, shipped features, sizing, first ranking. Used by ost-setup for the first tree, by ost-change-outcome for new candidates and by backfill for the consolidation.
user-invocable: false
---

# Building the tree

Use this whenever evidence must become opportunities: the onboarding's first tree, the candidates found during a change of course, and the consolidation at the end of a backfill. `ost-rules` says what a well-formed opportunity is; this skill says how to get there.

Plugin files: the skills named in backticks (`ost-rules`, `build-tree`, `backfill`, …) belong to this plugin. Load them with the Skill tool as `live-product-discovery:<name>`, or read `${CLAUDE_PLUGIN_ROOT}/skills/<name>/SKILL.md`. Templates are in `${CLAUDE_PLUGIN_ROOT}/templates/`.

Work from evidence already extracted and checked for scope. Do not re-read the sources here. Read Notion as described in "Reading the databases" in `${CLAUDE_PLUGIN_ROOT}/templates/notion-data-model.md`.

## 1. Write the need behind each piece of evidence

For each piece of evidence, write the need behind it in one short sentence, in the customer's words: what they are trying to do, and what gets in the way. This is a working label. The verbatim stays untouched.

When a customer asks for a precise feature, look for the need behind the request. "I want a PDF button" becomes "I need to send the report to people who don't use the tool".

## 2. Group, from the specific up

1. Put together the needs that describe the same situation and the same obstacle, even when worded differently. Test: the same solution would remove both. When in doubt, keep them apart: merging later is easier than splitting.
2. Name each group as an opportunity, following `ost-rules`: the customer's point of view, their words, never a solution.
3. Then look for broader needs. When three or more groups are cases of the same broader need, create that need as the parent and make the groups its sub-opportunities. A parent is a need a customer would recognize, never the name of a product area.
4. Stop at three levels under the outcome.
5. If the tree already exists, compare each group with it first. A group that duplicates an opportunity is folded into it. A group that is a more specific case of an opportunity becomes its sub-opportunity.

## 3. Test the link to the outcome

For each top-level opportunity and each active outcome, answer in one sentence: if this need were fully met, would this outcome move? Link the opportunity to the outcome it moves most. With no outcome yet, skip this step: every opportunity in scope stays in the tree.

- **Clear link**: it stays in the tree.
- **No link** to any active outcome, though within the squad's scope: propose it as `parked`, with the sentence. It keeps its evidence and comes back if the outcome changes.
- **Unsure**: keep it, and flag it for the user to decide.

Sub-opportunities follow their parent. Check them only when they drift from the parent's topic.

## 4. Check what already shipped and what is planned

Check each opportunity against shipped features, following the "Shipped features" rules in `ost-rules`: the documentation, the release notes and the delivered items of the squad's backlog. When a feature already addresses it, record it as a `shipped` solution and split the evidence into before and after the release.

Then look for planned and in-progress backlog items that address it, following the "Backlog" rules in `ost-rules`, and propose them as solutions with their backlog link.

## 5. Size

For each opportunity, compute: the evidence count (duplicates excluded), the distinct customer accounts and prospects, the date of the latest evidence, the evidence after any shipped feature, and the split by kind (needs, bugs, questions). Compute them as described in "Reading the databases", and write them on the opportunity.

When quantitative data is available, run the saved queries (see `ost-rules`) and add how many accounts or users face the situation, how often, and the total ARR of the accounts concerned. Quantitative data sizes an opportunity; it never creates one.

## 6. Rank

Rank the opportunities with the criteria of `weekly-synthesis`: volume and recency of evidence, distinct accounts, weighted by quantitative data. Evidence from before a shipped feature weighs less. The tree then has an order from the first day; the weekly synthesis keeps it up to date.

Below 2 pieces of evidence from 2 different accounts, an opportunity stays `candidate` and is not ranked.

## 7. Write, then show

Then present the result as a short outline: each opportunity with its number in the tree, its evidence count and accounts, its link to the outcome and two representative verbatims. Show apart: the opportunities proposed as `parked` or `addressed`, the candidates, and the evidence that fits nothing.

Write the opportunities to Notion following "Changes and autonomy" in `ost-rules`: those that meet the conditions are created directly, the others as `candidate`. In the onboarding and after a change of course, write the whole tree, then show it: the quick review replaces approval, and what the squad keeps counts as accepted creations.
