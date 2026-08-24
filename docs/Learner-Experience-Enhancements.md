# Learner Experience Enhancements

**Status:** Implemented learner-support layer.  
**Scope:** Applied practice, targeted assessment remediation, private field-record organisation and review sharing, local draft recovery, and a competency portfolio.

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

## Applied practice and remediation

Three scenario routes are linked from **Water Management**, **Fertilisation of Vegetables**, and **Integrated Pest Management**. Each scenario requires the learner to use field evidence, select a defensible response, and inspect decision-level feedback. The water scenario prioritises root-zone water-air balance and drainage; fertilisation prioritises the limiting factor and the 4Rs; IPM prioritises verified scouting, beneficial-organism protection, and constrained escalation.

When a learner does not meet a module assessment’s 80% pass mark, the assessment result now retains item-level feedback and presents a **Targeted refresh** panel. It directs the learner to the linked module and, where available, to a relevant applied scenario. This preserves the existing retry model while making the next action more specific.

## Record organisation, sharing, and offline recovery

The **Records** route lists private saved records, filters them by template, and opens each record in its owner-scoped workspace. Learners can select exactly two records to compare their setup context, most recent non-empty log evidence, and decision-review entries side by side. The comparison procedure verifies ownership for both record IDs before returning either record. A saved record can optionally receive review links. Links are token-based, can be labelled with an intended reviewer, can accept concise reviewer feedback, and can be revoked by the learner at any time. A revoked link cannot be reopened or used to submit feedback.

New record forms and offline edits to a reopened saved record create a debounced local-device draft. If connectivity drops, the form identifies offline mode and avoids a failed server save; it retains the draft until the learner reconnects. Returning to the same new or saved record restores a structurally valid local draft and offers an explicit discard action. Saving the record to the learner account clears that local draft.

## Competency portfolio

The **Portfolio** route combines passed-module count, field-record count, successful latest scenario outcomes, pathway progress, recent evidence, and a learner-owned reflection. The reflection asks the learner to connect an observation, decision, and revision condition, reinforcing the platform’s field-evidence standard. The portfolio is a private development view rather than a new credential or public profile.

## Validation standard

Regression coverage verifies the three defined scenarios, their module mappings, their evidence prompts, perfect and non-passing scoring behaviour, local-draft structural validation, printable-record behaviour, PDF generation, saved-list error states, and two-record comparison selection and setup-field summaries. Database procedures scope record, reflection, scenario, comparison, and review-share data to the authenticated owner, except for the deliberately learner-created active review token route.

Visual route validation confirmed the water-management learner page, applied scenario entry, empty record-library state, private portfolio, digital water-record workspace, and unavailable-review-link state. Desktop and 375 px mobile checks retained readable scenario context, record filters, and portfolio evidence cards. The portfolio renders formal module evidence separately from voluntary record, scenario, and reflection evidence.
