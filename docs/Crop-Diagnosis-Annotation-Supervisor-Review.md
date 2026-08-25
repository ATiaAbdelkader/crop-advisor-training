# Crop-Diagnosis Annotation Supervisor Review

**Author:** Manus AI  
**Implementation status:** Learner request flow and administrator-only queue are available.

## Purpose

The supervisor-review workflow extends the Crop-Diagnosis Photo Annotation Exercise with developmental feedback on the learner’s completed evidence reasoning. A signed-in learner can submit the full set of pins, selected evidence-led next steps, and a written rationale of at least eighty characters. The rationale asks the learner to explain which field evidence still requires checking, the uncertainty retained, and the recheck or referral condition that protects the next decision.

> **Boundary:** This workflow is feedback only. It does not alter lesson progression, formal module-assessment scores, certificate issuance, or owner-alert rules.

## Access and privacy model

| Actor | Permitted actions | Data boundary |
|---|---|---|
| **Learner** | Submit a completed annotation and rationale; see the private status and feedback on their own requests. | Can read only records whose owner ID matches their authenticated account. |
| **Course supervisor** | Open the administrator-only queue; review evidence pins, selected answers, rationale, and save written feedback or a revision request. | Access requires the application’s existing `admin` role. Supervisor identity and feedback are retained with the review record. |
| **Other learners and public visitors** | No access. | Annotation submissions have no public URL and are not exposed through record-sharing links. |

The system stores a snapshot of the completed exercise rather than a mutable live workspace. Each submission preserves the coordinates and labels of pins, selected answer for every case, and learner rationale. A supervisor can mark feedback as **reviewed** or **revision requested**. Learners retain all prior requests and can submit a new completed exercise after acting on feedback.

## Supervisor feedback standard

Supervisors should comment on the quality of evidence reasoning rather than certify a photograph as a diagnosis. The review workspace repeats three criteria:

1. Pins should distinguish patterns, symptoms or signs, pest or beneficial evidence, contributing conditions, and uncertainty where required.
2. The learner should separate what the image shows from a confirmed cause and state a suitable field recheck or referral boundary.
3. The selected next step should protect evidence quality and avoid unsupported treatment, product, rate, threshold, or legal claims.

The supervisor workspace recreates the pinned visual cases at the saved coordinates so the feedback can relate to what the learner actually marked. It includes the selected answer, labels, rationale, feedback text, and learner-visible review status.

## Validation record

The application verifies a completed submission server-side: every published case must be present, every case-specific required label must be represented by a pin, answers must match the defined options, and the rationale must meet the configured minimum length. Administrator-only procedures serve the review queue and accept feedback of at least twenty characters. Regression coverage confirms the role requirement, status vocabulary, feedback criteria, rationale and feedback bounds, and the formal non-gating boundary.
