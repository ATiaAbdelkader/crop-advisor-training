import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({ auth: vi.fn(), queue: vi.fn(), reflection: vi.fn(), comparison: vi.fn() }));

vi.mock("@/_core/hooks/useAuth", () => ({ useAuth: mocks.auth }));
vi.mock("@/components/TrainingShell", () => ({ default: ({ children }: { children: React.ReactNode }) => createElement("div", null, children) }));
vi.mock("@/components/LearnerLoading", () => ({ default: () => createElement("div", null, "Loading") }));
vi.mock("@/components/ui/button", () => ({ Button: ({ children }: { children: React.ReactNode }) => createElement("button", null, children) }));
vi.mock("@/components/ui/textarea", () => ({ Textarea: () => createElement("textarea") }));
vi.mock("@/lib/trpc", () => ({ trpc: { useUtils: () => ({ competencyAssessments: { queue: { invalidate: vi.fn() } } }), competencyAssessments: { queue: { useQuery: mocks.queue }, supervisorReflection: { useQuery: mocks.reflection }, supervisorComparison: { useQuery: mocks.comparison }, score: { useMutation: () => ({ mutate: vi.fn(), isPending: false }) } } } }));
vi.mock("wouter", () => ({ useLocation: () => ["", vi.fn()] }));

import SupervisorCompetencyReviews from "../client/src/pages/SupervisorCompetencyReviews";

const assessmentFixture = {
  id: 15,
  moduleId: "water-management",
  learnerName: "Learner One",
  learnerEmail: "learner@example.com",
  status: "scored" as const,
  submittedAt: new Date("2026-08-24T10:00:00Z"),
  payload: { evidenceSummary: "Observed root-zone moisture across two zones and compared affected and unaffected plants.", taskContext: "Vegetable field with uneven water performance.", reviewOrReferral: "I will recheck the same zones and seek authorised support if the pattern remains unclear.", attachments: [] },
  scorecard: { prepare: "demonstrated" as const, perform: "developing" as const, "review-refer": "demonstrated" as const },
  feedback: "Strong preparation and review boundary. Add a second measured comparison before finalising the next water decision.",
};

describe("supervisor competency reflection workspace", () => {
  beforeEach(() => {
    mocks.auth.mockReturnValue({ isAuthenticated: true, user: { role: "admin" } });
    mocks.queue.mockReturnValue({ data: [assessmentFixture], isLoading: false, isError: false, refetch: vi.fn() });
    mocks.reflection.mockReturnValue({ data: { feedbackObservation: "I noticed that the practical comparison evidence was incomplete.", revisedAction: "I will preserve the planned zone comparison and revise the record to include both sites.", nextEvidence: "I will collect a second moisture observation before the next review." }, isLoading: false, isError: false, refetch: vi.fn() });
    mocks.comparison.mockReturnValue({ data: null, isLoading: false, isError: false, refetch: vi.fn() });
  });

  it("renders saved learner reflection context for an authorised supervisor fixture", () => {
    const html = renderToStaticMarkup(createElement(SupervisorCompetencyReviews));
    expect(html).toContain("Learner scorecard reflection");
    expect(html).toContain("practical comparison evidence was incomplete");
    expect(html).toContain("second moisture observation");
  });

  it("renders retryable protected-query error UI rather than the empty reflection state", () => {
    mocks.reflection.mockReturnValue({ data: undefined, isLoading: false, isError: true, refetch: vi.fn() });
    const html = renderToStaticMarkup(createElement(SupervisorCompetencyReviews));
    expect(html).toContain("Learner reflection context is unavailable");
    expect(html).toContain("Retry reflection");
    expect(html).not.toContain("No learner reflection has been saved");
  });

  it("renders the denial state for a non-admin fixture without opening the private queue", () => {
    mocks.auth.mockReturnValue({ isAuthenticated: true, user: { role: "user" } });
    const html = renderToStaticMarkup(createElement(SupervisorCompetencyReviews));
    expect(html).toContain("Supervisor access required");
    expect(html).not.toContain("Learner scorecard reflection");
  });

  it("renders linked original and revised evidence only for an authorised supervisor fixture", () => {
    const revised = { ...assessmentFixture, id: 16, revisionOfAssessmentId: 15, payload: { ...assessmentFixture.payload, evidenceSummary: "Rechecked both zones, added matched observations, and recorded the updated evidence." } };
    mocks.queue.mockReturnValue({ data: [revised], isLoading: false, isError: false, refetch: vi.fn() });
    mocks.comparison.mockReturnValue({ data: { original: assessmentFixture, revised, reflection: { feedbackObservation: "I noticed that the practical comparison evidence was incomplete.", revisedAction: "I will preserve the planned zone comparison and revise the record to include both sites.", nextEvidence: "I will collect a second moisture observation before the next review." } }, isLoading: false, isError: false, refetch: vi.fn() });
    const html = renderToStaticMarkup(createElement(SupervisorCompetencyReviews));
    expect(html).toContain("Original and revised evidence");
    expect(html).toContain("Observed root-zone moisture across two zones");
    expect(html).toContain("Rechecked both zones, added matched observations");
    expect(html).toContain("Original supervisor feedback");
  });
});
