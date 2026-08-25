# Before-and-After Competency Evidence Comparison

**Status:** Implemented private revision-support layer.  
**Scope:** Learner-owned competency submissions for which a supervisor has requested revision.

## Purpose and workflow

When a supervisor requests revision, the original competency evidence remains unchanged. The learner opens a private comparison view that brings together the original evidence, scorecard feedback, any saved scorecard reflection, and an empty revised-evidence column. From that view, the learner can start one linked revision submission. Once submitted, the comparison presents the two evidence records side by side, including learner-owned photo attachments.

When the linked revised submission enters the administrator review queue, the supervisor workspace presents the original and revised evidence, original feedback, and saved reflection context together. This preserves the developmental context that led to the revision request while the supervisor reviews the new evidence.

| Comparison element | Before | After | Safety and assessment boundary |
|---|---|---|---|
| Evidence summary | Original learner description | Revised learner description | Shows evidence development; it is not a diagnosis or treatment recommendation. |
| Task context | Original crop, field, and decision context | Revised context, if evidence changed | Preserves uncertainty and local constraints. |
| Review/referral boundary | Original recheck or referral plan | Revised recheck or referral plan | Does not replace current authorised referral, label, or safety requirements. |
| Photo evidence | Original learner-owned attachment set | Revised learner-owned attachment set | Photos support, but never replace, field evidence and authorised interpretation. |

## Privacy and linkage rules

The new revision submission stores a nullable link to the original competency assessment. The server verifies that the signed-in learner owns the original record, that it belongs to the same module, that its status is `revision_requested`, and that it does not already have a linked revision. Learner comparison retrieval is owner-scoped; the supervisor comparison procedure is administrator-only. The original evidence is not overwritten.

> **Non-gating rule:** The comparison and revised evidence support developmental practice. They do not replace formal assessment, authorise a diagnosis or intervention, or change sequential gates, certification, or authorised referral boundaries.

## Validation standard

Regression coverage verifies the three compared evidence areas, non-gating boundary, learner-owned revision-link creation, owner-scoped learner comparison retrieval, and administrator-only supervisor retrieval. The live visual check deliberately uses the authentic empty state when no revision-request evidence exists; no fabricated learner or supervisor records are inserted to populate the interface.
