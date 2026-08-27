import { beforeEach, describe, expect, it, vi } from "vitest";
import type { TrpcContext } from "./_core/context";

const mocks = vi.hoisted(() => ({
  listMine: vi.fn(),
  share: vi.fn(),
  revoke: vi.fn(),
  queue: vi.fn(),
}));

vi.mock("./db", async importOriginal => {
  const actual = await importOriginal<typeof import("./db")>();
  return {
    ...actual,
    listLearnerExerciseSummaryShares: mocks.listMine,
    shareLearnerExerciseSummary: mocks.share,
    revokeLearnerExerciseSummaryShare: mocks.revoke,
    listActiveLearnerExerciseSummarySharesForFacilitator: mocks.queue,
  };
});

import { appRouter } from "./routers";

function createCaller(userId = 73, role: "user" | "admin" = "user") {
  const ctx: TrpcContext = {
    user: { id: userId, openId: `learner-${userId}`, email: `learner-${userId}@example.com`, name: "Learner", loginMethod: "manus", role, createdAt: new Date(), updatedAt: new Date(), lastSignedIn: new Date() },
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
  return appRouter.createCaller(ctx);
}

const share = { id: 9, exerciseRoute: "/crop-walk-lab", sharedAt: new Date(), revokedAt: null, completedPrompts: 3, totalPrompts: 4 };

describe("exerciseSummaryShares", () => {
  beforeEach(() => {
    mocks.listMine.mockReset().mockResolvedValue([share]);
    mocks.share.mockReset().mockResolvedValue(share);
    mocks.revoke.mockReset().mockResolvedValue(true);
    mocks.queue.mockReset().mockResolvedValue([]);
  });

  it("lists and creates shares only for the authenticated learner", async () => {
    await expect(createCaller(73).exerciseSummaryShares.mine()).resolves.toEqual([share]);
    expect(mocks.listMine).toHaveBeenCalledWith(73);
    await expect(createCaller(74).exerciseSummaryShares.share({ exerciseRoute: "/crop-walk-lab" })).resolves.toEqual(share);
    expect(mocks.share).toHaveBeenCalledWith(74, "/crop-walk-lab");
  });

  it("permits an owner to revoke an active voluntary exercise share", async () => {
    await expect(createCaller(73).exerciseSummaryShares.revoke({ id: share.id })).resolves.toEqual({ revoked: true });
    expect(mocks.revoke).toHaveBeenCalledWith(73, share.id);
  });

  it("rejects unrecognised exercise routes and unstarted exercises", async () => {
    await expect(createCaller().exerciseSummaryShares.share({ exerciseRoute: "/not-an-exercise" })).rejects.toMatchObject({ code: "BAD_REQUEST" });
    mocks.share.mockResolvedValueOnce(null);
    await expect(createCaller().exerciseSummaryShares.share({ exerciseRoute: "/crop-walk-lab" })).rejects.toMatchObject({ code: "PRECONDITION_FAILED" });
  });

  it("restricts facilitator review to authorised administrators", async () => {
    await expect(createCaller(73, "user").exerciseSummaryShares.facilitatorQueue()).rejects.toMatchObject({ code: "FORBIDDEN" });
    await expect(createCaller(1, "admin").exerciseSummaryShares.facilitatorQueue()).resolves.toEqual([]);
    expect(mocks.queue).toHaveBeenCalledOnce();
  });
});
