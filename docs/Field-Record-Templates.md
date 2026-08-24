# Printable Field-Record Templates

**Status:** Implemented learner resource with private digital entry and PDF export.  
**Access:** Linked from the learner module pages for Modules 23, 26, and 32, alongside their applied field briefs. Blank print-ready routes remain public; digital entry requires sign-in.

## Purpose

The printable records convert three high-consequence crop-management decisions into a repeatable field documentation practice. They are intentionally blank working forms: they do not persist learner or farm information in the platform, and they do not replace local regulation, product labels, laboratory interpretation, or specialist advice.

| Resource | Linked module | Core decision evidence | Print route |
|---|---|---|---|
| **Water Management Field Record** | 23. Water management | Root-zone moisture, rain or irrigation event, drainage, crop response, water-source concern, and next review trigger. | `/records/water-management-record` |
| **Vegetable Fertilisation 4R Field Record** | 26. Fertilisation of vegetables | Limiting-factor evidence, input analysis, rate, timing, placement, soil condition, crop response, and a plan-revision trigger. | `/records/fertilisation-record` |
| **Integrated Pest Management Field Record** | 32. Integrated pest management | Scouting evidence, incidence and severity, beneficials, conducive conditions, prevention or non-product action, constrained escalation, and evaluation. | `/records/integrated-pest-management-record` |

## Common design standard

Each template has a field-and-crop header, five blank observation/action rows, two decision-review prompts, and a clear safety and stewardship note. The records are accessible as ordinary responsive pages, retain a return link to the linked module, and expose a visible **Print blank record** control. Print styles hide navigation and interface controls, set an A4 portrait page, and preserve the table, review prompts, and safety note as usable paper elements.

## Digital entry, privacy, and PDF export

The **Fill online** action opens an authenticated learner workspace at `/records/:templateId/entry`. It uses the same field labels, log columns, review prompts, and safeguards as the blank record. Learners can add up to twelve event rows, save a named record, reopen records associated with the same template, start a new record without overwriting a prior one, and delete a saved record only after an explicit confirmation.

Saved data are isolated by learner account. Record retrieval, update, listing, and deletion checks the authenticated owner before returning or changing a row. The platform stores only the structured form content and record title needed for the learner’s own documentation; it does not make farm records visible in the progress dashboard or to other learners.

The **Export PDF** control creates a downloadable A4 landscape PDF directly in the browser from the current form values. A learner may export a completed record before saving it, and exporting does not transmit the record to a separate PDF service. The blank paper template is retained for users who prefer offline completion.

> **Decision boundary:** A record is evidence for a bounded next action, not a prescription. The field user must still check local requirements, labels, crop suitability, safety conditions, and the need for specialist support.

## Module-specific safeguards

| Template | Required safeguards in the learner resource |
|---|---|
| **Water** | The learner records conditions at the rooting depth, recognises drainage as part of water management, and flags water-quality concerns before water contacts a food crop. |
| **Fertilisation** | The 4R record requires soil or crop evidence, product analysis, actual quantity, placement, and a follow-up check; it does not encourage routine or unverified input use. |
| **IPM** | The record leads with diagnosis, monitoring, prevention, and protection of beneficial organisms. It constrains any crop-protection product action to lawful, label-directed, target-specific use with applicable interval and safety requirements. |

## Validation standard

Regression coverage verifies that the implementation exposes **exactly three** templates, maps each one to the intended module, provides the necessary setup, log, review, and safety fields, retains water root-zone, fertilisation 4R, and IPM-beneficial-organism terminology, and creates template-aligned digital defaults with a bounded row capacity. Route, print-layout, TypeScript, test, production-build, and owner-isolated record-workflow checks are recorded in the checkpoint validation step.
