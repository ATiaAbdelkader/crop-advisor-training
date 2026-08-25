import { beforeEach, describe, expect, it, vi } from "vitest";
import type { TrpcContext } from "./_core/context";

const notificationMocks = vi.hoisted(() => ({
  list: vi.fn(),
  markRead: vi.fn(),
}));

vi.mock("./db", async importOriginal => {
  const actual = await importOriginal<typeof import("./db")>();
  return {
    ...actual,
    listCropDiagnosisAnnotationNotificationStates: notificationMocks.list,
    markCropDiagnosisAnnotationFeedbackRead: notificationMocks.markRead,
  };
});

import { appRouter } from "./routers";

function createLearnerCaller(id = 73) {
  const ctx: TrpcContext = {
    user: {
      id,
      openId: `learner-${id}`,
      email: "learner@example.com",
      name: "Learner",
      loginMethod: "manus",
      role: "user",
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    },
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
  return appRouter.createCaller(ctx);
}

describe("annotation feedback notification ownership", () => {
  beforeEach(() => {
    notificationMocks.list.mockReset();
    notificationMocks.markRead.mockReset();
    notificationMocks.list.mockResolvedValue([]);
    notificationMocks.markRead.mockResolvedValue(1);
  });

  it("uses the authenticated learner identity when listing private notification state", async () => {
    await createLearnerCaller(73).annotationNotifications.list();
    expect(notificationMocks.list).toHaveBeenCalledWith(73);
  });

  it("marks only the authenticated learner's requested unread feedback records as read", async () => {
    const result = await createLearnerCaller(73).annotationNotifications.markRead({ ids: [11, 19] });
    expect(notificationMocks.markRead).toHaveBeenCalledWith(73, [11, 19]);
    expect(result).toEqual({ updated: 1 });
  });
});
