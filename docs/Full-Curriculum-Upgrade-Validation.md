# Full Curriculum Upgrade Validation

**Date:** 24 August 2026

The full curriculum upgrade adds a source-grounded applied field brief to every document-derived module from Module 04 through Module 34. Each brief supplies a field context, a decision task, evidence to record, and a quality standard while leaving the existing two lessons, four-question scored check, 80% threshold, sequential gates, final assessment, certificate, and owner-notification rules intact.

## Automated validation

| Validation area | Result |
|---|---|
| TypeScript validation | Passed. |
| Regression suite | Passed: 39 tests across authentication and training progression. |
| Field-brief completeness | Passed: the regression suite confirms exactly one populated brief for each of the 31 document-derived modules. |
| Production build | Passed. The existing large-bundle advisory warning remains non-blocking. |

## Learner-route validation

Representative module routes were rendered for planning, soil sampling, irrigation, and weed management. They retained the established learner interface, required-lesson gates, module-standard presentation, and no unauthorised route access. The weed-management assessment route retained its scored-assessment gate.

Because applied field briefs appear after authenticated lesson content is available, the sampled locked routes correctly withheld both the lesson body and the new practice material until the appropriate prerequisite has been met. This preserves sequential learning rather than exposing practice content ahead of the source-grounded lesson sequence.
