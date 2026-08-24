# Full Curriculum Upgrade Audit

**Scope:** Modules 04–34, derived from all thirty-one user-supplied agricultural training documents.  
**Audit date:** 24 August 2026  
**Baseline checkpoint:** `e3f05b13`

## Scope confirmation

The audit covers three economic and planning documents, ten environment and soil documents, twelve vegetable-production documents, and six crop-protection documents. Together, they map one-to-one to Modules 04–34. The source-document mapping is retained in the Training Design Package conversion record and reference list. [1]

| Source group | Documents | Platform modules | Primary capability cluster |
|---|---:|---:|---|
| ECN | 3 | 04–06 | Planning, cost decisions, crop and variety selection |
| ENV | 10 | 07–16 | Yield factors, climate, topography, soil, nutrients, soil health, and sampling |
| PRD | 12 | 17–28 | Nursery, field establishment, water, irrigation, fertilisation, crop care, harvest, and post-harvest practice |
| PRT | 6 | 29–34 | Field diagnosis, disease, pests and mites, IPM, responsible pesticide use, and weed management |

## Baseline structural findings

The static curriculum audit confirms that all thirty-one document-derived modules already meet the original course structure: two lessons, six substantive teaching sections, six stated outcomes, at least one field-practice callout, four scored module items, and an 80% pass mark. The final assessment contains thirty-five applied items and retains its 80% certificate standard. This means the upgrade should strengthen application and source traceability without weakening the existing sequence, gate, or scoring contract.

| Criterion | Baseline finding | Upgrade implication |
|---|---|---|
| Lesson sequence | 2 lessons per module | Preserve the concise, sequential lesson pathway. |
| Teaching depth | 6 sections and 6 outcomes per module | Add a practical synthesis layer rather than duplicate prose. |
| Assessment | 4 scored items at 80% per module | Retain gates and feedback; link practice evidence to assessment reasoning. |
| Field relevance | At least 1 callout per module | Standardise a source-grounded field application task for every module. |
| Source traceability | Conversion record and references are present in LMS documentation | Make source-derived competencies explicit within each module’s learner content. |
| Progression | Ordered module gates and final assessment are tested | Preserve all existing prerequisite behaviour. |

## Assessment-alignment validation

Every document-derived module retains a four-item, single-best-answer module check with 80% passing threshold and item-level feedback. The upgrade now adds a structured source-theme alignment map in `shared/assessmentAlignment.ts`. For each module, that map identifies a source-grounded theme plus an exact assessment-prompt anchor and final-competency anchor. Regression coverage verifies that both anchors occur in the authored module check and its corresponding final item. The final item is indexed one position after the module number because the original three foundation modules occupy final items 01–03. This keeps the practice brief, module assessment, and certification standard connected without changing the established gate contract.

## Upgrade standard

Every document-derived module will receive one **Applied field brief** that turns the document’s most consequential field decision into observable learner work. Each brief will include a context, a task, evidence to record, and a quality standard. The brief will not invent farm results or replace professional judgement; it will guide learners to collect evidence, explain a defensible decision, and identify follow-up conditions.

| Upgrade element | Purpose | Required content standard |
|---|---|---|
| **Context** | Situate learning in the type of agricultural decision the source document addresses. | Use crop, field, nursery, water, soil, pest, disease, or market conditions grounded in that module’s source themes. |
| **Task** | Convert information into an observable action or decision. | Use a verb such as map, compare, sample, calculate, inspect, diagnose, plan, verify, or review. |
| **Evidence to record** | Prevent unsupported recommendations. | Specify field observations, measurements, records, maps, labels, costs, crop-stage information, or comparison evidence. |
| **Quality standard** | Show learners what a defensible outcome requires. | State constraints, uncertainty, safety, source fit, and follow-up conditions where relevant. |

## Acceptance criteria

The content upgrade is complete only when all Modules 04–34 expose a module-specific applied field brief; every brief has the four required parts; learner rendering remains accessible and responsive; existing lessons, assessments, 80% gates, final-assessment availability, certificate rules, and owner-notification rules still pass regression coverage; and the LMS design package documents the upgraded standard.

## References

[1] [Training Design Package: Document conversion record and source references](Training-Design-Package.md)
