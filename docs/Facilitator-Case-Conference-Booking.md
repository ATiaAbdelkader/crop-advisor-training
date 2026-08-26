# Facilitator Case-Conference Booking

**Status:** Implemented as an in-platform booking board.  
**Author:** Manus AI  
**Purpose:** Let learners reserve an administrator-published place in a facilitator-led case conference without requiring external calendar access or background reminder jobs.

## Workflow

Administrators publish a future slot with a title, start and end time, and capacity between one and twenty-four learners. Signed-in learners see only open, future slots and a private indication of their own reservation. They can reserve one place per slot or cancel their reservation before the conference begins. A facilitator can cancel only a slot they created.

| Role | Can see | Can do |
|---|---|---|
| Learner | Open future slots, remaining capacity, their own reservation status, and optional preparation content after an active reservation | Reserve or cancel their own future reservation |
| Administrator facilitator | Published slot details, active learner reservations, and preparation content | Create slots, cancel slots they created, and manage preparation content only for slots they created |
| Other learners | No learner identity or reservation information | Cannot inspect another learner’s booking |

The learner list intentionally omits facilitator and peer identity. It also omits preparation notes, material names, and material links until the querying learner has an active reservation for that slot. Cancelling a reservation removes this preparation access. The administrator view is limited to authenticated administrator procedures, and slot cancellation and preparation editing are separately checked against the facilitator who created the slot.

## Optional preparation content

The facilitator who created an open slot may add, edit, or remove an optional preparation note of up to **2,500 characters**, together with up to **three** preparation documents. The system accepts only PDF (`application/pdf`), plain-text (`text/plain`), and DOCX (`application/vnd.openxmlformats-officedocument.wordprocessingml.document`) files, each no larger than **3 MB**.

Files are uploaded to managed storage. The database retains only the document name, storage key, storage URL, content type, and byte size; it never stores the file bytes. The server validates the declared MIME type, data URL, decoded size, safe file name, and facilitator-and-slot storage-key prefix before saving metadata. Material references are disclosed only as part of an authorised learner reservation view or the authenticated administrator view.

> Preparation content is voluntary conference support. It is **not** required course evidence and does **not** alter formal assessment scores, the 80% pass rule, sequential gates, competency scoring, certification, or owner alerts.

## Capacity and cancellation safeguards

The system rejects expired, cancelled, duplicate, or full slots. It maintains a reserved-place count and a unique learner-plus-slot record so that the same learner cannot take multiple active places in one conference. Learner cancellation is restricted to the owning learner before the slot starts. Slot cancellation removes it from the learner availability list while preserving a private administration record.

> A conference reservation is voluntary learning support. It does **not** change formal assessment scores, the 80% pass rule, sequential gates, competency scoring, certification, or owner alerts.

## Scope boundary

This release does not connect to external calendars, send automatic reminders, generate meeting links, create recurring jobs, or automatically notify learners when preparation content changes. This keeps the booking board private and manageable without additional credentials or background scheduling. Any future calendar synchronisation or reminders should be assessed as a separate integration and scheduling release.

High-consequence agricultural discussion remains bounded by the current programme safeguards: facilitators and learners should use current labels, authorised channels, laboratory evidence, extension, or specialist referral where appropriate.
