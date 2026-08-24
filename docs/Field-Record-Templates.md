# Printable Field-Record Templates

**Status:** Implemented learner resource.  
**Access:** Linked from the learner module pages for Modules 23, 26, and 32, alongside their applied field briefs, and available as public print-ready routes.

## Purpose

The printable records convert three high-consequence crop-management decisions into a repeatable field documentation practice. They are intentionally blank working forms: they do not persist learner or farm information in the platform, and they do not replace local regulation, product labels, laboratory interpretation, or specialist advice.

| Resource | Linked module | Core decision evidence | Print route |
|---|---|---|---|
| **Water Management Field Record** | 23. Water management | Root-zone moisture, rain or irrigation event, drainage, crop response, water-source concern, and next review trigger. | `/records/water-management-record` |
| **Vegetable Fertilisation 4R Field Record** | 26. Fertilisation of vegetables | Limiting-factor evidence, input analysis, rate, timing, placement, soil condition, crop response, and a plan-revision trigger. | `/records/fertilisation-record` |
| **Integrated Pest Management Field Record** | 32. Integrated pest management | Scouting evidence, incidence and severity, beneficials, conducive conditions, prevention or non-product action, constrained escalation, and evaluation. | `/records/integrated-pest-management-record` |

## Common design standard

Each template has a field-and-crop header, five blank observation/action rows, two decision-review prompts, and a clear safety and stewardship note. The records are accessible as ordinary responsive pages, retain a return link to the linked module, and expose a visible **Print blank record** control. Print styles hide navigation and interface controls, set an A4 portrait page, and preserve the table, review prompts, and safety note as usable paper elements.

> **Decision boundary:** A record is evidence for a bounded next action, not a prescription. The field user must still check local requirements, labels, crop suitability, safety conditions, and the need for specialist support.

## Module-specific safeguards

| Template | Required safeguards in the learner resource |
|---|---|
| **Water** | The learner records conditions at the rooting depth, recognises drainage as part of water management, and flags water-quality concerns before water contacts a food crop. |
| **Fertilisation** | The 4R record requires soil or crop evidence, product analysis, actual quantity, placement, and a follow-up check; it does not encourage routine or unverified input use. |
| **IPM** | The record leads with diagnosis, monitoring, prevention, and protection of beneficial organisms. It constrains any crop-protection product action to lawful, label-directed, target-specific use with applicable interval and safety requirements. |

## Validation standard

Regression coverage verifies that the implementation exposes **exactly three** templates, maps each one to the intended module, provides the necessary setup, log, review, and safety fields, and retains water root-zone, fertilisation 4R, and IPM-beneficial-organism terminology. Route, print-layout, TypeScript, test, and production-build checks are recorded in the checkpoint validation step.
