export type NurseryToStandQualityRoutine = {
  id: string;
  title: string;
  shortTitle: string;
  moduleIds: readonly string[];
  risk: string;
  purpose: string;
  prepare: readonly string[];
  inspect: readonly string[];
  acceptOrHold: readonly string[];
  record: readonly string[];
  followUp: string;
  refer: string;
  sourceBasis: string;
};

export const nurseryToStandQualityRoutines: readonly NurseryToStandQualityRoutine[] = [
  {
    id: "seed-and-batch-traceability",
    title: "Seed and nursery-batch traceability",
    shortTitle: "Seed and batch plan",
    moduleIds: ["nursery-for-vegetable-production", "seedling-production-planning"],
    risk: "Seed, media, and plant-number decisions cannot be checked or corrected when they are disconnected from field layout, storage history, and a labelled nursery batch.",
    purpose: "Plan a traceable seedling batch that can supply the intended field area with appropriate replacement capacity.",
    prepare: ["Confirm crop, variety, field layout, intended spacing, planting window, and a realistic replacement allowance.", "Verify seed label, lot or traceability information, storage condition, treatment information, and any handling requirements.", "Choose a nursery method, container or bed approach, medium, protection, and water plan that fit the crop and local production constraint."],
    inspect: ["Compare seed and batch information with the field geometry and required transplant numbers.", "Inspect media or bed readiness, drainage, sanitation, weed risk, and the practical availability of protection, water, and labour.", "Check that each batch can remain identifiable from sowing through hardening and field establishment."],
    acceptOrHold: ["Proceed when seed, batch, medium, field demand, and nursery method are traceable and compatible.", "Hold the plan when crop layout, seed origin, media condition, or replacement capacity is unknown or conflicts with the establishment plan.", "Separate different lots, methods, or risk conditions rather than averaging their records."],
    record: ["Crop, variety, seed or lot information, and storage or treatment note", "Field geometry, intended spacing, batch number, and replacement allowance", "Nursery method, medium or bed, source of water, and protection plan", "Sowing date, responsible person, and expected hardening or planting window"],
    followUp: "Reconcile germination, uniformity, and usable seedling numbers against the original field plan before transplanting arrangements are fixed.",
    refer: "Use seed supplier, extension, laboratory, or qualified nursery support when seed identity, treatment, storage condition, germination concern, or media suitability cannot be safely verified.",
    sourceBasis: "Modules 17 and 20: seedling quality, nursery planning, seed traceability, storage, field geometry, replacement capacity, media fit, and production constraints.",
  },
  {
    id: "daily-nursery-hygiene-and-environment",
    title: "Daily nursery hygiene and environment check",
    shortTitle: "Daily nursery check",
    moduleIds: ["nursery-for-vegetable-production", "open-field-seedling-production", "protective-and-cellular-seedling-production"],
    risk: "Crowding, drainage failure, poor hygiene, unsuitable protection, uneven water, pests, or stressed media can create seedlings that look available but are not field-ready.",
    purpose: "Use a daily evidence routine to protect root health, uniformity, hygiene, and climate-responsive nursery management.",
    prepare: ["Identify the batch, crop stage, nursery method, expected weather, and the prior day’s water, protection, and pest observations.", "Use clean handling practices and inspect the nursery before moving tools, water, plants, or media between different batches.", "Choose a consistent route through beds, trays, or protected units so observations can be compared over time."],
    inspect: ["Check site or structure drainage, weed pressure, cleanliness, ventilation or cover condition, and evidence of damaging weather exposure.", "Observe spacing, light response, tray or bed uniformity, media moisture, root-zone condition, seedling posture, and visible pest or disease risk.", "Compare affected and unaffected areas and check whether water, protection, crowding, or handling is linked to the pattern."],
    acceptOrHold: ["Continue routine care when plants, media, hygiene, and environment are consistent with the crop stage and batch plan.", "Hold movement, mixing, or transplant scheduling when seedling health, root condition, pest risk, sanitation, or hardening evidence is uncertain.", "Correct a verified nursery condition before treating a symptom as a fertiliser or pesticide problem."],
    record: ["Batch, crop stage, date, weather, and protection condition", "Media or bed moisture, drainage, spacing, uniformity, and root observations", "Pest, disease, weed, or sanitation concern and affected area", "Action taken, person responsible, and next check"],
    followUp: "Repeat the same route after a weather event, cover adjustment, watering change, or corrective action and compare uniformity rather than relying on a single observation.",
    refer: "Seek qualified nursery, plant-health, water-quality, or extension support when spread, root decline, persistent unevenness, contamination, or an uncertain crop-health problem cannot be safely contained.",
    sourceBasis: "Modules 17–19: drained sites, thin sowing or spacing, climate-responsive covers, clean medium, protected germination, responsive care, pest risk, root-shoot quality, and daily nursery management.",
  },
  {
    id: "hardening-and-transplant-acceptance",
    title: "Hardening and transplant-acceptance decision",
    shortTitle: "Field-ready seedling check",
    moduleIds: ["open-field-seedling-production", "protective-and-cellular-seedling-production", "transplanting"],
    risk: "A calendar date does not prove that a seedling can withstand field heat, handling, root disturbance, or the planned planting condition.",
    purpose: "Decide whether a seedling batch is ready, needs further hardening or correction, or must be held from field transfer.",
    prepare: ["Confirm field readiness, planting window, expected heat or weather, tray or bed moisture, and the crop’s planned transplant stage.", "Bring the batch record and compare the intended planting field with the hardening and nursery conditions already experienced.", "Inspect a representative sample while keeping any visibly different or affected group separate."],
    inspect: ["Check root condition, root-block integrity or bare-root handling risk, true-leaf and shoot condition, uniformity, media moisture, and evidence of stress or pest risk.", "Verify hardening steps, recent protection changes, water management, and exposure to field-like conditions.", "Compare the batch with the readiness of mulch, holes, support system, field moisture, and planting timing."],
    acceptOrHold: ["Accept only healthy, uniform, hardened seedlings whose roots, moisture condition, and stage match a ready field.", "Hold and continue hardening, correct moisture or handling, or separate affected seedlings when roots, uniformity, hardening, pest risk, or field readiness is insufficient.", "Do not use a planting date alone to override evidence of field or seedling stress."],
    record: ["Batch and field destination", "Hardening steps and recent weather exposure", "Root, shoot, true-leaf, media, and uniformity observations", "Field readiness and planting-window condition", "Acceptance, hold, or separation decision with reason"],
    followUp: "Check the accepted batch after transfer for early stress and compare the outcome with the recorded hardening, root condition, and planting window.",
    refer: "Seek extension or qualified nursery support when the source of poor root quality, persistent stress, suspected disease, or uneven hardening cannot be determined without higher-risk action.",
    sourceBasis: "Modules 18, 19, and 22: hardening, cellular and bare-root handling, root-shoot quality, media moisture, crop stage, field heat, and ready-field coordination.",
  },
  {
    id: "transplant-and-early-stand-recovery",
    title: "Transplant execution and early stand recovery",
    shortTitle: "Transplant and stand check",
    moduleIds: ["field-preparation-mulching-and-trellising", "transplanting"],
    risk: "Incomplete holes, mulch, drainage, support, moisture, nutrient separation, or follow-up can transfer nursery stress into a weak and uneven field stand.",
    purpose: "Establish plants carefully, record the site and plant condition, and investigate early gaps or losses before they expand.",
    prepare: ["Confirm field layout, bed and drainage condition, mulch, holes, support installation where required, field moisture, and safe nutrient placement.", "Coordinate seedling water status, transport, timing, weather window, and handling so root blocks or bare roots are protected.", "Plan a first stand-count and recovery check before planting begins."],
    inspect: ["Observe each planting area for hole readiness, depth, root contact, root disturbance, moisture, heat or wind stress, and visible variation in field condition.", "Check whether seedling quality, soil condition, mulch, drainage, water, or placement is linked to a pattern of early stress.", "Count established and missing plants by an identifiable zone rather than relying on a general impression."],
    acceptOrHold: ["Continue when seedling and field readiness remain aligned and the planting operation protects roots and avoids known stress.", "Pause or change the operation when field moisture, heat, holes, mulch, support, nutrient separation, or seedling condition would create avoidable loss.", "Treat early gaps as evidence to investigate before replacing plants or repeating inputs across the field."],
    record: ["Field zone, planting date and weather window", "Seedling batch, root condition, and transplant method", "Hole, mulch, support, moisture, drainage, and nutrient-placement observations", "Initial stand count, missing plants, symptoms, and zone pattern", "Corrective action and scheduled recheck"],
    followUp: "Repeat stand counts and inspect missing or weak zones early enough to distinguish seedling, handling, water, drainage, placement, weather, or crop-health explanations.",
    refer: "Seek agronomy, plant-health, irrigation, or extension support when losses persist, the pattern is unexplained, root or field conditions are unsafe, or a high-consequence corrective action is being considered.",
    sourceBasis: "Modules 21 and 22: ready beds, drainage, mulch, trellis timing, seedling water, planting holes, nutrient separation, careful placement, weather timing, and early stand recovery.",
  },
] as const;

export const nurseryToStandQualityByModuleId = Object.fromEntries(
  Array.from(new Set(nurseryToStandQualityRoutines.flatMap(routine => routine.moduleIds))).map(moduleId => [
    moduleId,
    nurseryToStandQualityRoutines.filter(routine => routine.moduleIds.includes(moduleId)),
  ])
) as Readonly<Record<string, readonly NurseryToStandQualityRoutine[]>>;

export function getNurseryToStandQualityRoutine(routineId: string | undefined) {
  return nurseryToStandQualityRoutines.find(routine => routine.id === routineId) ?? nurseryToStandQualityRoutines[0];
}
