import { beforeEach, describe, expect, it, vi } from "vitest";
import type { TrpcContext } from "./_core/context";

const mocks = vi.hoisted(() => ({
  list: vi.fn(),
  merge: vi.fn(),
}));

vi.mock("./db", async importOriginal => {
  const actual = await importOriginal<typeof import("./db")>();
  return {
    ...actual,
    listLearnerExerciseProgress: mocks.list,
    mergeLearnerExerciseProgress: mocks.merge,
  };
});

import { appRouter } from "./routers";

function createCaller(userId = 73) {
  const ctx: TrpcContext = {
    user: { id: userId, openId: `learner-${userId}`, email: `learner-${userId}@example.com`, name: "Learner", loginMethod: "manus", role: "user", createdAt: new Date(), updatedAt: new Date(), lastSignedIn: new Date() },
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
  return appRouter.createCaller(ctx);
}

const progress = [{ exerciseRoute: "/crop-walk-lab", completedPrompts: 3, totalPrompts: 4 }];

describe("exerciseProgress", () => {
  beforeEach(() => {
    mocks.list.mockReset().mockResolvedValue([]);
    mocks.merge.mockReset().mockResolvedValue([{ userId: 73, exerciseRoute: "/crop-walk-lab", completedPrompts: 3, totalPrompts: 4, updatedAt: new Date() }]);
  });

  it("returns only progress associated with the authenticated learner", async () => {
    await expect(createCaller(73).exerciseProgress.mine()).resolves.toEqual([]);
    expect(mocks.list).toHaveBeenCalledWith(73);
  });

  it("merges voluntary completion only under the signed-in learner account", async () => {
    await expect(createCaller(73).exerciseProgress.sync({ progress })).resolves.toHaveLength(1);
    expect(mocks.merge).toHaveBeenCalledWith({ userId: 73, progress });
    await createCaller(74).exerciseProgress.sync({ progress });
    expect(mocks.merge).toHaveBeenLastCalledWith({ userId: 74, progress });
  });

  it("rejects unrecognised routes, duplicate exercises, and impossible completion counts", async () => {
    await expect(createCaller().exerciseProgress.sync({ progress: [{ exerciseRoute: "/unknown-exercise", completedPrompts: 1, totalPrompts: 1 }] })).rejects.toMatchObject({ code: "BAD_REQUEST" });
    await expect(createCaller().exerciseProgress.sync({ progress: [{ exerciseRoute: "/crop-walk-lab", completedPrompts: 2, totalPrompts: 1 }] })).rejects.toMatchObject({ code: "BAD_REQUEST" });
    await expect(createCaller().exerciseProgress.sync({ progress: [progress[0], progress[0]] })).rejects.toMatchObject({ code: "BAD_REQUEST" });
  });
});
