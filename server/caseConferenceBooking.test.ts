import { beforeEach, describe, expect, it, vi } from "vitest";
import type { TrpcContext } from "./_core/context";
import { caseConferenceBookingRules } from "../shared/caseConferenceBooking";

const mocks = vi.hoisted(() => ({ list: vi.fn(), listAdmin: vi.fn(), reserve: vi.fn(), cancelReservation: vi.fn(), create: vi.fn(), cancelSlot: vi.fn() }));

vi.mock("./db", async importOriginal => {
  const actual = await importOriginal<typeof import("./db")>();
  return { ...actual, listCaseConferenceSlotsForLearner: mocks.list, listCaseConferenceSlotsForAdmin: mocks.listAdmin, reserveCaseConferenceSlot: mocks.reserve, cancelCaseConferenceReservation: mocks.cancelReservation, createCaseConferenceSlot: mocks.create, cancelCaseConferenceSlot: mocks.cancelSlot };
});

import { appRouter } from "./routers";

function caller(role: "user" | "admin" = "user") {
  const ctx: TrpcContext = { user: { id: role === "admin" ? 9 : 73, openId: `${role}-user`, email: `${role}@example.com`, name: role === "admin" ? "Facilitator" : "Learner", loginMethod: "manus", role, createdAt: new Date(), updatedAt: new Date(), lastSignedIn: new Date() }, req: { protocol: "https", headers: {} } as TrpcContext["req"], res: {} as TrpcContext["res"] };
  return appRouter.createCaller(ctx);
}

describe("facilitator case-conference booking", () => {
  beforeEach(() => {
    Object.values(mocks).forEach(mock => mock.mockReset());
    mocks.list.mockResolvedValue([]);
    mocks.listAdmin.mockResolvedValue([]);
    mocks.reserve.mockResolvedValue(undefined);
    mocks.cancelReservation.mockResolvedValue(undefined);
    mocks.create.mockResolvedValue(41);
    mocks.cancelSlot.mockResolvedValue(undefined);
  });

  it("keeps learner availability and reservations owner-scoped", async () => {
    await caller().caseConferences.list();
    expect(mocks.list).toHaveBeenCalledWith(73);
    await caller().caseConferences.reserve({ slotId: 7 });
    expect(mocks.reserve).toHaveBeenCalledWith(73, 7);
    await caller().caseConferences.cancelReservation({ slotId: 7 });
    expect(mocks.cancelReservation).toHaveBeenCalledWith(73, 7);
  });

  it("restricts availability management and learner-reservation visibility to administrators", async () => {
    await expect(caller().caseConferences.adminList()).rejects.toMatchObject({ code: "FORBIDDEN" });
    await expect(caller().caseConferences.createSlot({ title: "Case conference", startsAt: new Date("2030-01-10T09:00:00Z"), endsAt: new Date("2030-01-10T10:00:00Z"), capacity: 6 })).rejects.toMatchObject({ code: "FORBIDDEN" });
    await caller("admin").caseConferences.createSlot({ title: "Case conference", startsAt: new Date("2030-01-10T09:00:00Z"), endsAt: new Date("2030-01-10T10:00:00Z"), capacity: 6 });
    expect(mocks.create).toHaveBeenCalledWith(expect.objectContaining({ facilitatorUserId: 9, capacity: 6 }));
    await caller("admin").caseConferences.cancelSlot({ slotId: 41 });
    expect(mocks.cancelSlot).toHaveBeenCalledWith(9, 41);
  });

  it("states that bookings are voluntary and do not alter formal progression", () => {
    expect(caseConferenceBookingRules.boundary).toContain("80% pass rule");
    expect(caseConferenceBookingRules.boundary).toContain("sequential gates");
    expect(caseConferenceBookingRules.privacy).toContain("private");
    expect(caseConferenceBookingRules.maximumCapacity).toBe(24);
  });
});
