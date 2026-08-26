# Paired Field Inquiry Peer Review

**Status:** Implemented learner-development workflow.  
**Author:** Manus AI  
**Purpose:** Enable a learner to share one completed Field Inquiry decision with one trusted, signed-in peer for structured developmental feedback.

## Learner workflow

The owner saves one Field Inquiry decision for a module, covering the field decision question, observation and comparison plan, interpretation with uncertainty, bounded next action, and recheck or referral trigger. The owner may then create one revocable private pair link and share it only with the intended peer. The peer signs in, reviews the decision, and submits one response through three evidence-centred prompts.

| Stage | Owner control | Peer responsibility | Safeguard |
|---|---|---|---|
| **Save** | Save or revise the module decision privately. | No access yet. | Each decision is owner-scoped and limited to one current entry per learner and module. |
| **Pair** | Create one private, opaque link; optionally label the study pair. | Receive the link only from the owner. | Only one active link is allowed for a decision. |
| **Review** | May revoke an unreviewed link. | Sign in and submit one structured review. | The owner cannot review their own decision; a second peer cannot submit after completion. |
| **Revise** | Saving a changed decision automatically revokes any active link. | Must receive a new link to review the revised decision. | A peer cannot unknowingly comment on changed evidence. |
| **Reflect** | View feedback in the private owner workspace. | Feedback remains associated with the pair link. | Completed feedback is visible only in the owner’s private learning record. |

After feedback is complete, the owner can also save a private **learning taken / revised action / next evidence** reflection. This follow-through record is available only to the owner and is described in [`Peer-Feedback-Reflections.md`](./Peer-Feedback-Reflections.md).

## Structured prompts

The system uses three prompts to keep feedback constructive and evidence-led: **Evidence you can see**, **Question to test**, and **Next evidence to strengthen**. Prompts focus the peer on observations, alternative explanations, and safe evidence gathering rather than personal judgement.

> **Non-gating boundary:** Paired peer review is voluntary developmental dialogue. It does not change lesson completion, formal assessment scores, the 80% pass rule, sequential gates, competency scoring, certification, or owner alerts.

## Privacy and safety boundaries

Pair links are opaque, private, revocable, and available only to signed-in learners. The peer view does not expose the owner’s identity or the raw share token. Peer reviewers must not use the workflow to prescribe products, rates, thresholds, medical actions, disposal, legal reporting, or unverified local requirements. In high-consequence contexts, the workflow retains the programme’s current-label, authorised-channel, laboratory, extension, and specialist-referral boundaries.
