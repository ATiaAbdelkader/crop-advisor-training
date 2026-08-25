# Learner Experience Enhancements

**Status:** Implemented learner-support layer.  
**Scope:** Applied practice, targeted assessment remediation, private field-record organisation and review sharing, local draft recovery, a competency portfolio, and Field Readiness Portfolio evidence.

## Design boundary

These features strengthen the learner’s ability to apply, revisit, organise, and explain field decisions. They do **not** replace lesson completion, alter the sequential learning gate, lower the 80% scored-assessment standard, or change final-certificate rules.

| Enhancement | Learner action | Evidence produced | Privacy and progression boundary |
|---|---|---|---|
| Applied scenarios | Complete a short water, 4R fertilisation, or IPM decision sequence | A scored practice attempt and decision feedback | Practice is recorded privately and is not a formal gate. |
| Targeted remediation | Review incorrect assessment feedback and revisit a linked lesson or scenario | A focused next-step path | Formal assessment scoring remains unchanged. |
| Record library | Filter, reopen, and compare two saved water, fertilisation, and IPM records | Field-record index with timestamps and side-by-side evidence | Only the record owner can open or compare saved records. |
| Review sharing | Create, copy, and revoke a link for one saved record | Optional reviewer feedback | The learner creates and revokes each opaque link; it exposes only the selected record. |
| Offline field mode | Continue a new field record while disconnected | Local device draft | The draft remains local until the learner reconnects and deliberately saves it. |
| Competency portfolio | Review progress, records, scenario practice, and a written reflection | Private personal evidence view | Portfolio items do not change certification eligibility. |
| Field Readiness Portfolio | Complete practicum visits, integrated capstones, local-intelligence checks, and practical self-review | Private visit and capstone evidence | Field-readiness targets are developmental; they do not alter formal certification eligibility. |

## Applied practice and remediation

Nine scenario routes are linked from **Water Management**, **Drip Irrigation**, **Fertilisation of Vegetables**, **Harvesting and Post-Harvest Handling**, **Field Diagnosis**, **Disease Identification and Management**, **Integrated Pest Management**, **Responsible Use of Pesticides**, and **Weed Management**. Each scenario requires the learner to use field evidence, select a defensible response, and inspect decision-level feedback. The core water, fertilisation, and IPM scenarios are supplemented by high-risk decisions covering uniform water delivery, market quality and food safety, qualified diagnosis, disease-cycle interruption, unsafe pesticide-stop decisions, and weed persistence.

High-risk crop-protection scenarios deliberately teach **verification and constrained escalation**, not product selection by brand or unverified rate. The pesticide scenario requires a stop decision when label, target, legal fit, people, water, equipment, weather, and record conditions do not agree. Disease and weed scenarios likewise retain lawful, label-directed action as a conditional final step after diagnosis, prevention, and field evidence.

When a learner does not meet a module assessment’s 80% pass mark, the assessment result now retains item-level feedback and presents a **Targeted refresh** panel. It directs the learner to the linked module and, where available, to a relevant applied scenario. This preserves the existing retry model while making the next action more specific.

## Record organisation, sharing, and offline recovery

The **Records** route lists private saved records, filters them by template, and opens each record in its owner-scoped workspace. Learners can select exactly two records to compare their setup context, most recent non-empty log evidence, and decision-review entries side by side. The comparison procedure verifies ownership for both record IDs before returning either record. A saved record can optionally receive review links. Links are token-based, can be labelled with an intended reviewer, can accept concise reviewer feedback, and can be revoked by the learner at any time. A revoked link cannot be reopened or used to submit feedback.

New record forms and offline edits to a reopened saved record create a debounced local-device draft. If connectivity drops, the form identifies offline mode and avoids a failed server save; it retains the draft until the learner reconnects. Returning to the same new or saved record restores a structurally valid local draft and offers an explicit discard action. Saving the record to the learner account clears that local draft.

## Competency portfolio

The **Portfolio** route combines passed-module count, field-record count, successful latest scenario outcomes, pathway progress, recent evidence, and a learner-owned reflection. The reflection asks the learner to connect an observation, decision, and revision condition, reinforcing the platform’s field-evidence standard. The portfolio is a private development view rather than a new credential or public profile.

## Field Readiness Portfolio

The **Field Ready** route turns the portfolio into a structured practical-development pathway. Learners can create private practicum visit records that require visit verification or supervision status, a grower question and interview notes, locality and production context, direct observations, competing explanations, a provisional diagnosis, recommendation rationale, communication plan, economics and risk check, review trigger and outcome evidence, referral boundary, and dated local-source check. Five capstones ask learners to combine water, soil, crop stage, diagnosis, crop protection, economics, climate, harvest handling, communication, and review logic in one advisory response.

The route includes a learner-facing local-intelligence method: record the place, season, market condition, safety source, and review condition rather than applying a fixed national calendar or assumed local price. It also provides dedicated field-method resources for farm economics, adviser communication and confidentiality, and traceable digital evidence. Both practicum and capstone evidence now use the same six criterion-level rubric alongside a written reflection. The underlying design and current-source verification guardrails are documented in [`Field-Readiness-Design.md`](./Field-Readiness-Design.md). Practicum and capstone submissions are visible only to the authenticated learner. They support a self-review target of three substantive visits, two capstones, two digital records, four passed scenarios, and a professional reflection; this remains separate from the platform’s formal certificate.

## Validation standard

Regression coverage verifies scenario mappings and scoring, local-draft structural validation, printable-record behaviour, PDF generation, saved-list error states, two-record comparison selection and setup-field summaries, practicum completion, capstone completeness, and the non-gating field-readiness boundary. Database procedures scope record, reflection, scenario, comparison, practicum, capstone, and review-share data to the authenticated owner, except for the deliberately learner-created active review token route.

Visual route validation confirmed the water-management learner page, applied scenario entry, responsible-pesticide module scenario card, pesticide-stewardship scenario page, empty record-library state, private portfolio, digital water-record workspace, and unavailable-review-link state. Desktop and 375 px mobile checks retained readable scenario context, record filters, and portfolio evidence cards. The portfolio renders formal module evidence separately from voluntary record, scenario, and reflection evidence.

## Integrated learning experience and scorecard alerts

The **Learning Experience** route now combines a private priority list, an eight-domain competency transcript, competency-scorecard alerts, in-app spaced retrieval prompts, and an evidence-library index. The priority list considers a learner’s own supervisor revision request, scorecard gap, unsuccessful formal check, and unsuccessful scenario attempt. It links to the relevant module, private scorecard, or decision practice; it does not alter assessment scores, locking, certification, or owner alerts.

The transcript distinguishes passed formal module checks from supervisor-scored evidence and reports Demonstrated, Developing, and Not yet evidenced counts across the programme’s eight competency domains. Counts make coverage visible but do not claim independent field mastery. Competency scorecard alerts are scoped to the authenticated learner, support individual and bulk read state, and preserve scorecard chronology when read state changes.

Spaced prompts are shown **in-app only** after a successful module check. They invite a learner to retrieve and apply a method after time has elapsed; they are not scheduled background work, new mandatory tasks, or additional progression gates.

## Evidence photos, simulation expansion, and supervisor calibration

Competency submissions now support up to four optional learner-owned JPEG, PNG, or WEBP images, each capped at 1.5 MB. An uploaded image is stored under a learner- and module-specific storage key, and the submission procedure rejects any attachment outside that authenticated ownership path. The learner can remove an attachment before submitting; an administrator sees submitted images only inside the protected competency-scoring workspace. Written evidence, task context, and review/referral boundary remain mandatory because a photograph alone cannot confirm a diagnosis, cause, product choice, rate, or high-consequence action.

Five further simulations now add crop-pattern triage, source-to-field irrigation performance, nutrient evidence and loss risk, harvest traceability hand-off, and pest-beneficial evidence to the original nine cases. Each preserves uncertainty, current-source, authorised-referral, and non-prescriptive crop-protection limits.

The administrator-only **Supervisor Calibration Guide** provides scoring anchors for Prepare, Perform, and Review and refer at Not yet evidenced, Developing, and Demonstrated levels. It asks reviewers to use module criteria and submitted evidence rather than writing style or access to equipment, then name a strength, evidence gap, and realistic next action. It does not authorise supervisors to provide diagnosis, product, rate, medical, legal, emergency, or local regulatory advice outside current authorised sources and competence.
