import { describe, expect, it } from "vitest";
import { calculateNutrientPlan, fertilisationPlanningRequirements, type NutrientRequirement } from "../shared/fertilisationPlanning";

const blank = (): NutrientRequirement => ({ cropRequirementKgHa: null, verifiedSoilOrOtherSupplyKgHa: null, productAnalysisPercent: null });

describe("fertilisation planning lab calculations", () => {
  it("converts learner-verified nutrient requirements and label analysis without supplying a rate", () => {
    const plan = calculateNutrientPlan(0.5, {
      N: { cropRequirementKgHa: 100, verifiedSoilOrOtherSupplyKgHa: 30, productAnalysisPercent: 20 },
      P2O5: blank(),
      K2O: blank(),
    });
    expect(plan.find(item => item.nutrient === "N")).toMatchObject({ netNeedKgHa: 70, netNeedForFieldKg: 35, productWeightForFieldKg: 175 });
  });

  it("does not create a negative nutrient gap when verified supply exceeds the entered requirement", () => {
    const plan = calculateNutrientPlan(1, {
      N: { cropRequirementKgHa: 40, verifiedSoilOrOtherSupplyKgHa: 55, productAnalysisPercent: 25 },
      P2O5: blank(),
      K2O: blank(),
    });
    expect(plan.find(item => item.nutrient === "N")).toMatchObject({ netNeedKgHa: 0, netNeedForFieldKg: 0, productWeightForFieldKg: 0 });
  });

  it("withholds a product conversion when area, verified evidence, or label analysis is incomplete", () => {
    const plan = calculateNutrientPlan(null, {
      N: { cropRequirementKgHa: 60, verifiedSoilOrOtherSupplyKgHa: 20, productAnalysisPercent: 0 },
      P2O5: blank(),
      K2O: blank(),
    });
    expect(plan.find(item => item.nutrient === "N")).toMatchObject({ netNeedKgHa: 40, netNeedForFieldKg: null, productWeightForFieldKg: null });
  });

  it("retains explicit local-verification and non-gating boundaries", () => {
    expect(fertilisationPlanningRequirements.boundary).toContain("does not supply universal crop rates");
    expect(fertilisationPlanningRequirements.boundary).toContain("local technical advice");
    expect(fertilisationPlanningRequirements.nonGatingBoundary).toContain("80% pass rule");
  });
});
