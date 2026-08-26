import type { Assessment } from "./curriculum";

export const secondsPerTimedQuizQuestion = 90;
export const minimumTimedQuizSeconds = 300;

export function getTimedQuizLimitSeconds(assessment: Pick<Assessment, "questions">) {
  return Math.max(minimumTimedQuizSeconds, assessment.questions.length * secondsPerTimedQuizQuestion);
}

export function formatTimedQuizDuration(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

export function formatTimedQuizMinutes(totalSeconds: number) {
  const minutes = Math.ceil(totalSeconds / 60);
  return `${minutes} minute${minutes === 1 ? "" : "s"}`;
}

export const timedQuizBoundary = "The timer starts only when the learner chooses Begin timed check. Expiry is verified by the server, an expired attempt is not scored, and learners may begin a new attempt. The existing 80% pass mark, sequential gates, certificate rule, and owner-alert rule remain unchanged." as const;
