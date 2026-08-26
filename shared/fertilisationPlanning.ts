export const fertilisationPlanningRequirements = {
  supportedNutrients: ["N", "P2O5", "K2O"] as const,
  calendarStages: ["Pre-plant / soil preparation", "Planting or transplanting", "Early crop growth", "Flowering or fruiting phase", "Harvest-period review", "Other locally verified timing"] as const,
  maximumCalendarRows: 6,
  boundary: "This planning lab converts learner-entered, locally verified nutrient targets and product-label analyses into a calculation draft. It does not supply universal crop rates, product recommendations, application concentrations, or a final fertiliser prescription. Verify soil-test interpretation, crop guide, label, field conditions, water, placement, and local technical advice before action.",
  nonGatingBoundary: "The Fertilisation Planning Lab is voluntary practice. It does not change formal assessment scores, the 80% pass rule, sequential gates, competency scoring, certification, or owner alerts.",
} as const;

export type FertilisationNutrient = (typeof fertilisationPlanningRequirements.supportedNutrients)[number];

export type NutrientRequirement = {
  cropRequirementKgHa: number | null;
  verifiedSoilOrOtherSupplyKgHa: number | null;
  productAnalysisPercent: number | null;
};

export type NutrientCalculation = {
  nutrient: FertilisationNutrient;
  requirementKgHa: number | null;
  verifiedSupplyKgHa: number | null;
  netNeedKgHa: number | null;
  netNeedForFieldKg: number | null;
  productWeightForFieldKg: number | null;
};

export function calculateNutrientPlan(areaHa: number | null, requirements: Readonly<Record<FertilisationNutrient, NutrientRequirement>>): readonly NutrientCalculation[] {
  return fertilisationPlanningRequirements.supportedNutrients.map(nutrient => {
    const input = requirements[nutrient];
    const requirementKgHa = input.cropRequirementKgHa !== null && input.cropRequirementKgHa >= 0 ? input.cropRequirementKgHa : null;
    const verifiedSupplyKgHa = input.verifiedSoilOrOtherSupplyKgHa !== null && input.verifiedSoilOrOtherSupplyKgHa >= 0 ? input.verifiedSoilOrOtherSupplyKgHa : null;
    const netNeedKgHa = requirementKgHa !== null && verifiedSupplyKgHa !== null ? Math.max(0, requirementKgHa - verifiedSupplyKgHa) : null;
    const netNeedForFieldKg = netNeedKgHa !== null && areaHa !== null && areaHa > 0 ? netNeedKgHa * areaHa : null;
    const productWeightForFieldKg = netNeedForFieldKg !== null && input.productAnalysisPercent !== null && input.productAnalysisPercent > 0 && input.productAnalysisPercent <= 100 ? netNeedForFieldKg / (input.productAnalysisPercent / 100) : null;
    return { nutrient, requirementKgHa, verifiedSupplyKgHa, netNeedKgHa, netNeedForFieldKg, productWeightForFieldKg };
  });
}

export function formatPlanningNumber(value: number | null, digits = 1) {
  return value === null || !Number.isFinite(value) ? "—" : new Intl.NumberFormat(undefined, { maximumFractionDigits: digits, minimumFractionDigits: 0 }).format(value);
}
