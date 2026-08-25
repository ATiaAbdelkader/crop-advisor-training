# Dashboard Supervisor Feedback Notifications

**Author:** Manus AI  
**Implementation status:** Available on the authenticated learner dashboard.

## Purpose

The learner dashboard now provides a private visual summary of the most recent crop-diagnosis annotation review and an in-app notification list when supervisor feedback becomes available or a supervisor requests a revision. These indicators reduce the chance that developmental feedback is missed while preserving the programme’s formal assessment and progression rules.

| Dashboard element | Learner-facing meaning | Interaction |
|---|---|---|
| **Supervisor review status card** | Shows **awaiting supervisor feedback**, **feedback received**, or **revision requested** with a colour-coded dot and concise next step. | Opens the annotation review workspace. |
| **New feedback count** | Displays the count of reviewed or revision-requested records whose feedback has not been read. | Updates after an individual item or all feedback is marked read. |
| **In-app feedback list** | Shows up to three most recent feedback items, reviewer identity, date, status, and a compact feedback preview. | Opens the full private feedback workspace and marks the selected item read. |
| **Mark all read** | Lets the learner control the read state of all currently unread feedback items. | Does not change feedback, review status, or any formal learning record. |

## Privacy and read-state model

The dashboard calls authenticated learner procedures only. Notification records are filtered by the current learner’s account ID, and a read-state update is scoped to the same owner ID. A learner cannot retrieve, mark read, or infer the review feedback of another learner. When a supervisor saves new feedback or updates an existing request, the system clears the prior `feedbackReadAt` value so the learner receives a fresh unread indicator. Review status is ordered by supervisor-feedback time, or submission time while awaiting review; marking an item read therefore cannot replace the latest supervisor update in the dashboard summary.

> **Non-gating boundary:** These notifications are developmental communication. They do not alter lesson completion, formal module scores, sequential gates, certificate issuance, or owner alerts.

## Status meanings

| Status | Dashboard colour cue | Notification behaviour |
|---|---|---|
| **Submitted** | Amber status dot | Visible as review progress, but no feedback alert is created. |
| **Reviewed** | Green status dot | Feedback appears in the notification list and increments the unread count until read. |
| **Revision requested** | Amber/orange alert cue | Feedback appears in the notification list and directs the learner to review requested changes before making a new optional submission. |

## Validation record

The implementation adds a nullable `feedbackReadAt` timestamp through a non-destructive migration. Server procedures return only learner-owned notification states and mark only unread feedback for the same authenticated learner. The dashboard presents a loading state and an explicit retry control if notification retrieval fails, without interrupting course progress. Regression coverage confirms the visible status vocabulary, feedback-trigger statuses, stable supervisor-update ordering, private read-state field, ownership boundary, and non-gating statement. Visual validation confirms the empty/private dashboard status and review indicators render within the established learner dashboard layout.
