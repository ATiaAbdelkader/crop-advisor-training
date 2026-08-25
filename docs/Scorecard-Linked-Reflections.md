# Scorecard-Linked Learner Reflections

**Status:** Implemented private developmental learning layer.  
**Scope:** Learner reflection after a supervisor has saved a module competency scorecard and written feedback.

## Purpose and boundaries

Each scored or revision-requested competency submission can open a private reflection page. The page shows the learner’s own three-level scorecard and supervisor feedback, then asks three short questions: what the learner noticed, what the learner will preserve or revise, and what evidence they will collect, recheck, or seek next. This creates an explicit observation–action–evidence loop without treating reflection as a new assessment.

| Prompt | Learning function | Boundary |
|---|---|---|
| Feedback observation | Identifies a concrete strength or evidence gap in the scorecard. | Does not invite unsupported diagnosis or causal claims. |
| Revised action | Connects feedback to a low-risk, evidence-led field adjustment. | Does not authorise products, rates, treatments, or legal actions. |
| Next evidence | Names a record, comparison, recheck, or authorised referral trigger. | Keeps uncertainty and referral boundaries visible. |

The reflection is private to the learner and is stored under a stable scorecard-specific focus key. Learners can reopen every scored module from the **Competency Reflections** library, including older scorecards that are no longer shown in the most recent dashboard alerts. The owner-scoped save procedure verifies that the scorecard belongs to the signed-in learner and has both a scorecard and written feedback before storing a reflection. The administrator competency-review workspace renders the saved three responses for the selected scorecard under **Learner scorecard reflection**; an administrator-only context procedure supplies that view. Other learners cannot read, write, or retrieve another learner’s reflection.

> **Non-gating rule:** Scorecard reflections are developmental evidence only. They do not change formal assessment scores, sequential gates, certification, owner alerts, or authorised referral conditions.

## Validation standard

Regression coverage verifies the three required prompts, minimum response length, non-gating boundary, stable scorecard focus key, learner-owned retrieval and save calls, and administrator-only context access. The supervisor workspace only queries and renders that context under an authenticated administrator session. The Learning Experience evidence library routes to the scorecard-reflection library rather than presenting reflection counts as proof of independent field mastery.

The supervisor reflection panel deliberately distinguishes loading, query failure with retry, no saved reflection, and a saved three-response reflection. The protected-query regression suite confirms that a lookup error propagates to this retryable state rather than being represented as an empty learner reflection. Visual route checks use the genuine empty queues available in the current training workspace; no synthetic learner submission, scorecard, or reflection is inserted merely to populate the interface.

Visual validation confirmed the authenticated empty reflection-library state. The direct private-reflection route renders its protected loading guard before resolving a learner-owned scorecard query; scored-record content is exercised through the typed learner procedure and regression suite rather than seeded learner evidence.
