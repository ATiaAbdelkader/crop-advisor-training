# Facilitator Case-Conference Booking

**Status:** Implemented as an in-platform booking board.  
**Author:** Manus AI  
**Purpose:** Let learners reserve an administrator-published place in a facilitator-led case conference without requiring external calendar access or background reminder jobs.

## Workflow

Administrators publish a future slot with a title, start and end time, and capacity between one and twenty-four learners. Signed-in learners see only open, future slots and a private indication of their own reservation. They can reserve one place per slot or cancel their reservation before the conference begins. A facilitator can cancel only a slot they created.

| Role | Can see | Can do |
|---|---|---|
| Learner | Open future slots, remaining capacity, and their own reservation status | Reserve or cancel their own future reservation |
| Administrator facilitator | Published slot details and active learner reservations for facilitation | Create slots and cancel slots they created |
| Other learners | No learner identity or reservation information | Cannot inspect another learner’s booking |

The learner list intentionally omits facilitator and peer identity. The administrator view is limited to authenticated administrator procedures, and slot cancellation is separately checked against the facilitator who created the slot.

## Capacity and cancellation safeguards

The system rejects expired, cancelled, duplicate, or full slots. It maintains a reserved-place count and a unique learner-plus-slot record so that the same learner cannot take multiple active places in one conference. Learner cancellation is restricted to the owning learner before the slot starts. Slot cancellation removes it from the learner availability list while preserving a private administration record.

> A conference reservation is voluntary learning support. It does **not** change formal assessment scores, the 80% pass rule, sequential gates, competency scoring, certification, or owner alerts.

## Scope boundary

This release does not connect to external calendars, send automatic reminders, generate meeting links, or create recurring jobs. This keeps the first booking board private and manageable without additional credentials or background scheduling. Any future calendar synchronisation or reminders should be assessed as a separate integration and scheduling release.

High-consequence agricultural discussion remains bounded by the current programme safeguards: facilitators and learners should use current labels, authorised channels, laboratory evidence, extension, or specialist referral where appropriate.
