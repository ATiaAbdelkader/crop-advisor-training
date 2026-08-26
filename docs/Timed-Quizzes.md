# Timed Quizzes

**Status:** Implemented formal-assessment timing layer.  
**Scope:** All module checks and the final assessment in Crop Advisor Foundations.

## Learner experience

Every formal assessment now displays its available time before the learner begins. The duration is calculated at **90 seconds per question**, with a minimum of **five minutes**. The learner chooses **Begin timed check** before the clock starts. While the session is active, the page provides an accessible live countdown and a distinct final-minute warning. At expiry, completed responses are submitted automatically; unanswered items remain unanswered and receive the usual scoring feedback.

| Event | System behaviour | Progression effect |
|---|---|---|
| Learner begins quiz | Server creates or resumes one owner-scoped active session | No score is recorded yet. |
| Learner submits before expiry | Server consumes the valid session, then scores the responses | Existing 80% pass rule applies. |
| Time expires | Browser submits completed responses; server rejects late or duplicate scoring | Learner may begin a new attempt. |
| Learner refreshes or revisits | The server returns the same active, unexpired session | Refreshing cannot extend the deadline. |

> **Assessment boundary:** Timing changes the delivery of a formal knowledge check, not its standard. It does not change the 80% pass mark, sequential gates, certification eligibility, owner alerts, competency scoring, or high-consequence crop-safety boundaries.

## Protection and validation

Timed session records are owner-scoped and include start, expiry, and submission timestamps. The submission procedure atomically consumes only an unexpired session belonging to the signed-in learner and matching assessment. Expired, reused, or mismatched session identifiers are rejected before an assessment attempt is recorded. Regression coverage checks scaled duration, normal access gates, successful session consumption, and expired-session rejection.
