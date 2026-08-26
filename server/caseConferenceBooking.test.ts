import { beforeEach, describe, expect, it, vi } from "vitest";
import type { TrpcContext } from "./_core/context";
import { caseConferenceBookingRules } from "../shared/caseConferenceBooking";
import { caseConferencePreparationRequirements } from "../shared/caseConferencePreparation";
import { projectCaseConferenceSlotForLearner } from "./db";

const mocks = vi.hoisted(() => ({ list: vi.fn(), listAdmin: vi.fn(), reserve: vi.fn(), cancelReservation: vi.fn(), create: vi.fn(), cancelSlot: vi.fn(), assertFacilitator: vi.fn(), savePreparation: vi.fn(), storagePut: vi.fn() }));

vi.mock("./db", async importOriginal => {
  const actual = await importOriginal<typeof import("./db")>();
  return { ...actual, listCaseConferenceSlotsForLearner: mocks.list, listCaseConferenceSlotsForAdmin: mocks.listAdmin, reserveCaseConferenceSlot: mocks.reserve, cancelCaseConferenceReservation: mocks.cancelReservation, createCaseConferenceSlot: mocks.create, cancelCaseConferenceSlot: mocks.cancelSlot, assertCaseConferenceSlotFacilitator: mocks.assertFacilitator, saveCaseConferencePreparation: mocks.savePreparation };
});

vi.mock("./storage", () => ({ storagePut: mocks.storagePut }));

import { appRouter } from "./routers";

function caller(role: "user" | "admin" = "user", userId = role === "admin" ? 9 : 73) {
  const ctx: TrpcContext = { user: { id: userId, openId: `${role}-${userId}`, email: `${role}${userId}@example.com`, name: role === "admin" ? "Facilitator" : "Learner", loginMethod: "manus", role, createdAt: new Date(), updatedAt: new Date(), lastSignedIn: new Date() }, req: { protocol: "https", headers: {} } as TrpcContext["req"], res: {} as TrpcContext["res"] };
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
    mocks.assertFacilitator.mockResolvedValue({ id: 41 });
    mocks.savePreparation.mockResolvedValue(undefined);
    mocks.storagePut.mockResolvedValue({ key: "case-conference-materials/9/41/field-guide.pdf", url: "/manus-storage/case-conference-materials/9/41/field-guide.pdf" });
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
    expect(caseConferencePreparationRequirements.boundary).toContain("80% pass rule");
    expect(caseConferencePreparationRequirements.maximumMaterials).toBe(3);
  });

  it("keeps notes and material metadata out of an unreserved or cancelled learner slot view", () => {
    const slot = { id: 41, title: "Evidence discussion", startsAt: new Date("2030-01-10T09:00:00Z"), endsAt: new Date("2030-01-10T10:00:00Z"), capacity: 6, reservedCount: 1, status: "open" as const, preparationNotes: "Bring scoped observations, not a treatment decision.", preparationMaterialsJson: JSON.stringify([{ name: "field-guide.pdf", key: "case-conference-materials/9/41/field-guide.pdf", url: "/manus-storage/case-conference-materials/9/41/field-guide.pdf", contentType: "application/pdf", sizeBytes: 1250 }]) };
    expect(projectCaseConferenceSlotForLearner(slot, false)).not.toHaveProperty("preparation");
    expect(projectCaseConferenceSlotForLearner(slot, true)).toMatchObject({ preparation: { notes: slot.preparationNotes, materials: [{ name: "field-guide.pdf" }] } });
  });

  it("limits preparation changes to administrators and validates their uploaded slot-owned material references", async () => {
    const material = { name: "field-guide.pdf", key: "case-conference-materials/9/41/field-guide.pdf", url: "/manus-storage/case-conference-materials/9/41/field-guide.pdf", contentType: "application/pdf" as const, sizeBytes: 1250 };
    await expect(caller().caseConferences.savePreparation({ slotId: 41, notes: "Optional preparation", materials: [material] })).rejects.toMatchObject({ code: "FORBIDDEN" });
    await caller("admin").caseConferences.savePreparation({ slotId: 41, notes: " Optional preparation ", materials: [material] });
    expect(mocks.savePreparation).toHaveBeenCalledWith(expect.objectContaining({ facilitatorUserId: 9, slotId: 41, notes: "Optional preparation", materials: [material] }));
    await expect(caller("admin").caseConferences.savePreparation({ slotId: 41, notes: null, materials: [{ ...material, key: "case-conference-materials/22/41/field-guide.pdf", url: "/manus-storage/case-conference-materials/22/41/field-guide.pdf" }] })).rejects.toMatchObject({ code: "BAD_REQUEST" });
  });

  it("rejects unsupported upload types and requires the slot facilitator before storing a valid material", async () => {
    await expect(caller("admin").caseConferences.uploadPreparationMaterial({ slotId: 41, name: "photo.png", contentType: "image/png" as never, dataUrl: "data:image/png;base64,AA==" })).rejects.toMatchObject({ code: "BAD_REQUEST" });
    mocks.assertFacilitator.mockRejectedValueOnce(new Error("Only the facilitator who created this slot can add preparation materials."));
    await expect(caller("admin", 22).caseConferences.uploadPreparationMaterial({ slotId: 41, name: "field-guide.pdf", contentType: "application/pdf", dataUrl: "data:application/pdf;base64,JVBERi0x" })).rejects.toThrow("Only the facilitator who created this slot");
    await caller("admin").caseConferences.uploadPreparationMaterial({ slotId: 41, name: "Field guide.pdf", contentType: "application/pdf", dataUrl: "data:application/pdf;base64,JVBERi0x" });
    expect(mocks.storagePut).toHaveBeenCalledWith("case-conference-materials/9/41/Field-guide.pdf", expect.any(Buffer), "application/pdf");
  });
});
