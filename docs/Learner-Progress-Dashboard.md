# Learner Progress Dashboard

The **Progress** route at `/progress` provides each authenticated learner with a private view of progress across the thirty-one upgraded document-derived modules, Modules 04–34. The route uses the existing authenticated training-overview contract; it does not expose another learner’s completion or score record.

| Dashboard element | Learner value | Data source |
|---|---|---|
| Module passes | Shows the number of module assessments passed at the established 80% standard. | Module assessment attempts and progression state. |
| Lesson completion | Shows completed lessons out of the 62 lesson requirements in Modules 04–34. | Persisted lesson-completion records. |
| Average latest score | Summarises the latest recorded score across module checks attempted by the learner. | Latest score by assessment identifier. |
| Module tracker | Lists every upgraded module with lesson completion, latest score, pass mark, state, and a context-aware next action. | Curriculum definitions plus the learner’s authenticated overview. |

## Progress states

The tracker marks a module as **Passed**, **Ready for check**, **In progress**, **Not started**, or **Locked**. A locked state remains an explanation of the sequential prerequisite rather than a hidden curriculum element. A dash in the latest-score column means that the learner has not yet submitted a scored attempt.

## Privacy and progression

The page is learner-specific. It is populated only when the authenticated learner’s overview query is enabled, and its metric cards are calculated from that learner’s persisted completions and assessment attempts. Existing lesson order, 80% module checks, final-assessment requirements, certificate rules, and owner-notification behaviour remain unchanged.
