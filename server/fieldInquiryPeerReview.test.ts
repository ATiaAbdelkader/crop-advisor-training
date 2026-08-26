import { TRPCError } from "@trpc/server";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { TrpcContext } from "./_core/context";
import { fieldInquiryPeerReviewBoundary, fieldInquiryPeerReviewPrompts } from "../shared/fieldInquiryPeerReview";
import { fieldInquiryPeerReflectionBoundary, fieldInquiryPeerReflectionPrompts } from "../shared/fieldInquiryPeerReflections";

const mocks = vi.hoisted(() => ({ getMine: vi.fn(), saveDecision: vi.fn(), listShares: vi.fn(), createShare: vi.fn(), revokeShare: vi.fn(), getActiveShare: vi.fn(), submitFeedback: vi.fn(), getReflection: vi.fn(), saveReflection: vi.fn() }));

vi.mock("./db", async importOriginal => {
  const actual = await importOriginal<typeof import("./db")>();
  return {
    ...actual,
    getFieldInquiryDecisionForOwner: mocks.getMine,
    upsertFieldInquiryDecision: mocks.saveDecision,
    listFieldInquiryPeerSharesForOwner: mocks.listShares,
    createFieldInquiryPeerShare: mocks.createShare,
    revokeFieldInquiryPeerShare: mocks.revokeShare,
    getActiveFieldInquiryPeerShare: mocks.getActiveShare,
    submitFieldInquiryPeerReview: mocks.submitFeedback,
    getFieldInquiryPeerReflectionForOwner: mocks.getReflection,
    saveFieldInquiryPeerReflectionForOwner: mocks.saveReflection,
  };
});

import { appRouter } from "./routers";

const payload = {
  decisionQuestion: "Which field observation must be verified before the grower changes the current approach?",
  observationPlan: "Compare affected and unaffected areas, record crop stage and root-zone conditions, then map the visible pattern.",
  interpretation: "The available observations suggest uneven root-zone conditions, but the contributing cause remains unconfirmed.",
  boundedNextAction: "Collect the planned comparison evidence before changing practice and retain the decision rationale in the field record.",
  recheckOrReferral: "Recheck after the next observation round and use authorised laboratory, extension, or specialist support if uncertainty remains.",
};

const decision = { id: 31, userId: 73, moduleId: "advisory-practice", payload, createdAt: new Date(), updatedAt: new Date() };
const share = { id: 44, decisionId: 31, ownerUserId: 73, shareToken: "peer-token-1234567890", pairLabel: "Study pair", reviewerUserId: null, reviewerName: null, feedback: null, reviewedAt: null, createdAt: new Date(), revokedAt: null };
const reflectionPayload = { learningTaken: "The peer question highlighted that I need to state the observation comparison before treating the early interpretation as reliable.", revisedAction: "I will revise the inquiry plan to compare matched crop stages and record the pattern before proposing the next action.", nextEvidence: "I will map the affected and unaffected areas, record root-zone conditions, and consult an authorised source if uncertainty remains." };
const reflection = { id: 52, shareId: share.id, userId: 73, payload: reflectionPayload, createdAt: new Date(), updatedAt: new Date() };

function createCaller(userId = 73, name = "Learner") {
  const ctx: TrpcContext = {
    user: { id: userId, openId: `learner-${userId}`, email: `learner-${userId}@example.com`, name, loginMethod: "manus", role: "user", createdAt: new Date(), updatedAt: new Date(), lastSignedIn: new Date() },
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
  return appRouter.createCaller(ctx);
}

describe("Field Inquiry paired peer review", () => {
  beforeEach(() => {
    Object.values(mocks).forEach(mock => mock.mockReset());
    mocks.getMine.mockResolvedValue(decision);
    mocks.listShares.mockResolvedValue([]);
    mocks.saveDecision.mockResolvedValue(decision);
    mocks.createShare.mockResolvedValue(share);
    mocks.revokeShare.mockResolvedValue(true);
    mocks.getActiveShare.mockResolvedValue({ decision, share });
    mocks.submitFeedback.mockResolvedValue(true);
    mocks.getReflection.mockResolvedValue(null);
    mocks.saveReflection.mockResolvedValue(reflection);
  });

  it("uses three evidence-centred prompts and explicitly preserves formal progression", () => {
    expect(fieldInquiryPeerReviewPrompts.map(prompt => prompt.key)).toEqual(["evidenceSeen", "questionToTest", "nextEvidenceSuggestion"]);
    expect(fieldInquiryPeerReviewBoundary).toContain("80% pass rule");
    expect(fieldInquiryPeerReviewBoundary).toContain("sequential gates");
    expect(fieldInquiryPeerReviewBoundary).toContain("must not prescribe products");
    expect(fieldInquiryPeerReflectionPrompts.map(prompt => prompt.key)).toEqual(["learningTaken", "revisedAction", "nextEvidence"]);
    expect(fieldInquiryPeerReflectionBoundary).toContain("80% pass rule");
  });

  it("saves a decision only to the authenticated learner and returns owner-scoped peer state", async () => {
    await expect(createCaller().fieldInquiryPeerReview.saveDecision({ moduleId: decision.moduleId, payload })).resolves.toMatchObject({ id: decision.id, userId: 73 });
    expect(mocks.saveDecision).toHaveBeenCalledWith({ userId: 73, moduleId: decision.moduleId, payload });
    mocks.listShares.mockResolvedValue([share]);
    await expect(createCaller().fieldInquiryPeerReview.mine({ moduleId: decision.moduleId })).resolves.toMatchObject({ decision, shares: [share] });
    expect(mocks.getMine).toHaveBeenCalledWith(73, decision.moduleId);
    expect(mocks.listShares).toHaveBeenCalledWith(73, decision.id);
  });

  it("creates and revokes a pair only through the decision owner", async () => {
    await createCaller().fieldInquiryPeerReview.createPair({ decisionId: decision.id, pairLabel: "Study pair" });
    expect(mocks.createShare).toHaveBeenCalledWith({ ownerUserId: 73, decisionId: decision.id, pairLabel: "Study pair" });
    await createCaller().fieldInquiryPeerReview.revokePair({ id: share.id });
    expect(mocks.revokeShare).toHaveBeenCalledWith(73, share.id);
  });

  it("blocks the owner from reviewing their own shared decision", async () => {
    await expect(createCaller(73).fieldInquiryPeerReview.peerView({ shareToken: share.shareToken })).rejects.toMatchObject({ code: "FORBIDDEN" } satisfies Partial<TRPCError>);
  });

  it("returns only the shared decision and accepts one structured review from a different signed-in learner", async () => {
    const view = await createCaller(74, "Peer Learner").fieldInquiryPeerReview.peerView({ shareToken: share.shareToken });
    expect(view).toMatchObject({ module: { id: decision.moduleId }, decision: { id: decision.id }, share: { id: share.id } });
    expect(view.decision).not.toHaveProperty("userId");
    expect(view.share).not.toHaveProperty("shareToken");
    const feedback = { evidenceSeen: "The affected and unaffected comparison is clear and makes the observation plan stronger.", questionToTest: "Could the root-zone observation also be compared at the same crop stage before interpreting the pattern?", nextEvidenceSuggestion: "Record the next mapped observation and seek an authorised laboratory or extension check if the uncertainty remains." };
    await createCaller(74, "Peer Learner").fieldInquiryPeerReview.submitPeerFeedback({ shareToken: share.shareToken, feedback });
    expect(mocks.submitFeedback).toHaveBeenCalledWith({ shareToken: share.shareToken, reviewerUserId: 74, reviewerName: "Peer Learner", feedback });
  });

  it("rejects a completed, revoked, or otherwise unavailable peer review submission", async () => {
    mocks.submitFeedback.mockResolvedValue(false);
    await expect(createCaller(74).fieldInquiryPeerReview.submitPeerFeedback({ shareToken: share.shareToken, feedback: { evidenceSeen: "The observation plan identifies a meaningful comparison between areas before the decision is made.", questionToTest: "What evidence would most directly challenge the first interpretation before the next action is selected?", nextEvidenceSuggestion: "Record the next comparison and use an authorised source if the evidence remains uncertain." } })).rejects.toMatchObject({ code: "PRECONDITION_FAILED" });
  });

  it("returns and saves private reflections only through the completed-review owner path", async () => {
    await expect(createCaller().fieldInquiryPeerReview.reflection({ shareId: share.id })).resolves.toEqual({ reflection: null });
    expect(mocks.getReflection).toHaveBeenCalledWith({ ownerUserId: 73, shareId: share.id });
    await expect(createCaller().fieldInquiryPeerReview.saveReflection({ shareId: share.id, payload: reflectionPayload })).resolves.toMatchObject({ id: reflection.id, userId: 73 });
    expect(mocks.saveReflection).toHaveBeenCalledWith({ ownerUserId: 73, shareId: share.id, payload: reflectionPayload });
  });

  it("denies a reflection save when ownership or completed peer feedback cannot be verified", async () => {
    mocks.saveReflection.mockResolvedValue(null);
    await expect(createCaller(74).fieldInquiryPeerReview.saveReflection({ shareId: share.id, payload: reflectionPayload })).rejects.toMatchObject({ code: "PRECONDITION_FAILED" });
    expect(mocks.saveReflection).toHaveBeenCalledWith(expect.objectContaining({ ownerUserId: 74, shareId: share.id }));
  });
});
