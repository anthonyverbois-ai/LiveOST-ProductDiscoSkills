---
name: ost-undo
description: Reverses a change the agent made to the tree on its own (a creation, a merge, a rename, a move, a feature or backlog link, a status), moves the evidence back and records the undo as a correction the agent learns from.
disable-model-invocation: true
argument-hint: "[optional: squad name] [optional: the change to undo, or \"last\"]"
---

# Undoing a change

Run this as a conversation with the user. Follow `ost-rules`. Speak the user's language.

Plugin files: the skills named in backticks (`ost-rules`, `build-tree`, `backfill`, …) belong to this plugin. Load them with the Skill tool as `live-product-discovery:<name>`, or read `${CLAUDE_PLUGIN_ROOT}/skills/<name>/SKILL.md`. Templates are in `${CLAUDE_PLUGIN_ROOT}/templates/`.

When several squads are set up, work on one squad only: the one named as argument, or ask which one.

## 1. Find the change

- Read the squad's Changes database. With "last" or no argument, show the latest changes with the status `applied by the agent`, newest first (date, one line, reason), and let the user pick one or several.
- With a description ("the merge about exports yesterday"), find the matching rows and confirm the right one with the user.
- Changes `applied by the agent` or `accepted` can be undone. A change still `proposed` was never applied: reject it instead (status `rejected`, and a correction).

## 2. Check what else it affects

Later changes may build on this one: evidence attached since to a merged opportunity, a sub-opportunity added under a moved one, a rename followed by a merge. Read the changes made after it on the same opportunities and the evidence attached to them since. Tell the user what the undo will also affect, and get their go.

## 3. Restore

Restore the Before state of the change, by type:
- **create**: ask the user whether to keep the opportunity as a `candidate` or to archive it. Its evidence goes back to `unattached` when it is archived.
- **merge**: the merged opportunity is `active` again, with its name and parent; the evidence it brought (Evidence moved) goes back to it. Evidence attached since the merge stays where it is, unless the user moves it.
- **rename**: the previous name. **move**: the previous parent.
- **link shipped feature, link backlog item, mark shipped**: remove the link or the status, and restore the solution's previous status.
- **mark addressed**: the opportunity is `active` again.

A re-rank is not undone: the ranking follows a written formula and the next run would redo it. To change the order, change a weight in the configuration, or correct the evidence behind it.

Then recompute the stored counts of the opportunities touched, as described in "Reading the databases" in `${CLAUDE_PLUGIN_ROOT}/templates/notion-data-model.md`.

## 4. Record

- Set the change's status to `undone`, with today's date in Decided on.
- Add a correction: what the agent did, what the user decided, and why if they say. The weekly synthesis learns from it, and repeated undos of one type of change stop the agent from making it on its own (see "Changes and autonomy" in `ost-rules`).
- Never redo what was undone without the squad's decision.

## 5. Confirm

End with one line per change undone: what was restored, what else moved, and the new counts of the opportunities touched.
