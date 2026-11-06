---
name: backfill
description: How live-product-discovery processes a large volume of past calls, tickets and documents (the onboarding's trial batch and full history, or a new source's history) in batches, with resume, deduplication, consolidation and sampled review. Used by ost-setup and ost-change-outcome.
user-invocable: false
---

# Backfill

Use this whenever more items must be processed than fit comfortably in one pass: the onboarding's trial batch (step 5) and full history (step 8), or the history of a source added during a change of course. Follow `ost-rules` throughout. A full history can hold thousands of items: never try to read them all at once.

## Before starting

1. Load the scope, the sources configuration, the current tree and the learned rules.
2. List the items in scope from metadata only (ID, date, title), oldest first.
3. For team channels, an item is a message with its whole thread. Drop every item whose source ID is already in the evidence database: it was ingested before. This makes a restart safe. Read Notion as described in "Reading the databases" in `templates/notion-data-model.md`.
4. If the run log holds an unfinished backfill of the same scope, resume from its checkpoint instead of starting over, and tell the user.

## Batches

Process the items in batches of about 100, oldest first. A row of a feedback file is an item; read the file in slices, never whole, and process undated rows after the dated ones. For each batch:

1. **Context, kept compact**: the scope, the learned rules, and a summary of the tree (each opportunity's name, a one-line definition and two or three representative verbatims). Never load the whole evidence base.
2. **Extract** the needs and pain points with exact verbatims, and record each item's source ID.
3. **Classify** each piece of evidence: out of scope, attached to an existing opportunity, or a new candidate. Give each attachment a confidence (high, medium, low) with its one-sentence rationale.
4. **Hold new candidates apart**: add them to the candidate list with their evidence, without creating opportunities in the tree yet.
5. **Write** the batch to the evidence database in grouped writes (many rows per call), never one call per row.
6. **Checkpoint**: update the run log entry with the last item processed per source and the running counts.
7. **Report progress** at regular intervals: items processed out of the total, sources finished, time remaining.

If the session is about to end before the backfill is done, stop after a completed batch, write the checkpoint, and tell the user how the next run will resume.

## Consolidation

When all batches are done:

1. Turn the candidate list into opportunities following `build-tree`, comparing it with the existing tree: candidates that describe the same need are merged, and a candidate that duplicates an opportunity is folded into it.
2. Check the opportunities that grew against shipped features too, following the "Shipped features" rules in `ost-rules`.
3. Only then propose the new opportunities, each with its evidence count, accounts and link to the outcome.

## Review by sample

The user cannot review thousands of attachments. Show them:
- the attachments with low confidence;
- a random sample of the others (about 30), to measure quality;
- the consolidated candidates and the opportunities whose evidence grew most.

Record every correction in the corrections database. If the random sample shows many errors, say so, propose rules from the corrections, and offer to reprocess the affected batches.

## Cost and speed

- Prefer a fast, low-cost model for extraction and classification where the environment allows it, and a stronger one for consolidation and synthesis.
- Writes to the tree's workspace are rate-limited: group them, and expect a full history of several thousand items to take hours rather than minutes. Give the user that estimate before the go.
