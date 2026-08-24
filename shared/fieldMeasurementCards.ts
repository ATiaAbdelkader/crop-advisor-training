export type FieldMeasurementCard = {
  id: string;
  title: string;
  shortTitle: string;
  moduleIds: readonly string[];
  risk: string;
  purpose: string;
  prepare: readonly string[];
  routine: readonly string[];
  record: readonly string[];
  decide: readonly string[];
  review: string;
  refer: string;
  sourceBasis: string;
};

export const fieldMeasurementCards: readonly FieldMeasurementCard[] = [
  {
    id: "representative-soil-sample-chain",
    title: "Representative soil-sample chain",
    shortTitle: "Soil sample chain",
    moduleIds: ["collect-soil-samples-for-soil-testing", "soil-and-nutrition"],
    risk: "A laboratory result can mislead if the sample does not represent the field area and decision.",
    purpose: "Create a traceable composite sample that a laboratory or adviser can interpret with confidence.",
    prepare: ["Define the decision the sample will support and the crop or management context.", "Separate visibly different zones, histories, slopes, drainage conditions, or management areas before sampling.", "Use clean tools, containers, labels, and a simple field sketch; avoid atypical spots unless they are being investigated separately."],
    routine: ["Walk the defined zone and collect distributed subsamples at a recorded, decision-appropriate depth.", "Keep each zone separate, combine only comparable subsamples, and prepare the composite without contamination.", "Label the sample with zone, depth, date, crop or planned crop, and relevant management history."],
    record: ["Zone or map reference", "Sampling depth and date", "Crop, crop stage, and prior management", "Visible roots, moisture, texture, compaction, or unusual conditions", "Laboratory request and chain-of-custody note"],
    decide: ["Use the result only for the mapped decision zone.", "Treat an unexpected result as a question to check against field evidence, not an automatic treatment instruction.", "Keep separate zones separate rather than averaging incompatible conditions."],
    review: "Revisit the field context when results return; confirm that the sample, crop stage, root-zone condition, and planned decision still match.",
    refer: "Resample or seek laboratory or extension support when zones were mixed, labels or history are incomplete, contamination is possible, or a high-consequence rate or amendment decision is being considered.",
    sourceBasis: "Modules 02 and 16: soil context, representative zones, composite sampling, labelling, and decision traceability.",
  },
  {
    id: "root-zone-moisture-and-air-check",
    title: "Root-zone moisture and air check",
    shortTitle: "Root-zone check",
    moduleIds: ["water-management"],
    risk: "Surface dryness or a calendar schedule can hide either water shortage or saturation and poor root aeration.",
    purpose: "Assess the working root zone before changing irrigation, conservation, or drainage practices.",
    prepare: ["Record crop, stage, recent irrigation duration, rainfall, soil texture or zone, and the question being tested.", "Choose affected and unaffected areas where possible and inspect at the relevant rooting depth rather than only the surface.", "Check the field when the observation can inform the next irrigation or drainage decision."],
    routine: ["Observe plant response and field pattern before disturbing soil.", "Check soil moisture and structure at rooting depth; note wetness, friability, smell, compaction, and signs of restricted air.", "Compare the root zone with recent water inputs, drainage condition, crop stage, and weather rather than assuming one cause."],
    record: ["Zone, crop stage, texture, and rooting depth checked", "Irrigation and rainfall history", "Root-zone moisture and air observations", "Drainage, runoff, pooling, or stress pattern", "Source-quality concern if relevant"],
    decide: ["Adjust only when root-zone evidence supports the change.", "Pair dry-period conservation with wet-period drainage and avoid treating frequency alone as performance.", "Keep a low-risk review step before changing a system, duration, or schedule broadly."],
    review: "Inspect the same zones after the next relevant irrigation or weather event and compare root-zone response, not only canopy appearance.",
    refer: "Seek water-quality, drainage, soil, or irrigation-design support when symptoms persist, the source may be unsafe, salinity or contamination is suspected, or root-zone evidence conflicts.",
    sourceBasis: "Module 23: root-zone water-air balance, crop demand, seasonal conservation, drainage, and source safeguards.",
  },
  {
    id: "water-quality-screen",
    title: "Water-quality screening before field use",
    shortTitle: "Water-quality screen",
    moduleIds: ["water-management", "irrigation-systems", "drip-irrigation-system"],
    risk: "Water that is unsuitable, contaminated, or operationally unreliable can harm crops, people, equipment, and produce quality.",
    purpose: "Screen source suitability and identify when formal testing, treatment, or specialist advice is needed before use.",
    prepare: ["Identify the source, intended use, storage or conveyance condition, and any recent change in appearance, supply, or nearby risk.", "Collect local history from the grower and check whether the use involves edible crops, mixing, washing, or an irrigation system.", "Prepare a dated record rather than relying on a verbal impression of water quality."],
    routine: ["Observe source protection, visible sediment, odour, colour, storage hygiene, and potential contamination pathways.", "Check the practical implications for filtration, system clogging, crop contact, worker exposure, and food-safety handling.", "Compare observations with the intended use; do not treat a visual check as a laboratory result."],
    record: ["Source and intended use", "Date, weather, and recent supply condition", "Visible quality and contamination-risk observations", "Filtration or treatment condition", "Testing, official-source, or specialist advice requested"],
    decide: ["Use a documented low-risk step while evidence is adequate.", "Protect people, produce, and equipment when source concerns are present.", "Do not assume that a clear-looking source is suitable for every use."],
    review: "Repeat the screen after changes in source, rainfall, storage, treatment, or crop use, and retain any test or official advice with the record.",
    refer: "Use laboratory, water-authority, food-safety, or extension support when contamination, salinity, unusual source change, or use on produce creates a high-consequence question.",
    sourceBasis: "Modules 23–25: source-quality safeguards, filtration, operational fit, sediment, clogging, and water-path evidence.",
  },
  {
    id: "drip-uniformity-check",
    title: "Drip delivery and uniformity check",
    shortTitle: "Drip uniformity",
    moduleIds: ["drip-irrigation-system"],
    risk: "Changing run time before checking the water path can worsen saturation near the source while leaving far rows dry.",
    purpose: "Trace uneven crop response through source, filtration, pressure, laterals, emitters, wetting pattern, and maintenance evidence.",
    prepare: ["Record zone, crop stage, source condition, recent schedule, and the near-source versus far-end symptom pattern.", "Check safety and system condition before opening, flushing, or handling components.", "Have the maintenance and cleaning record available if it exists."],
    routine: ["Compare near-source and far-end flow, pressure or operating condition, emitter output, and soil wetting pattern.", "Inspect filters, leaks, damaged lines, blocked emitters, lateral ends, and recent flushing or cleaning.", "Trace the full water path before changing duration, pressure, schedule, or components."],
    record: ["Zone map and affected rows", "Filter and source condition", "Near and far-end observations", "Leaks, clogs, flushing, and maintenance history", "Wetting pattern and crop response"],
    decide: ["Correct a verified maintenance or distribution problem before expanding irrigation time.", "Use a narrow, observable correction and check the response across the zone.", "Keep system design, pump capacity, slope, and water quality in the decision."],
    review: "Repeat the same near-to-far comparison after corrective work and document whether distribution and root-zone response became more uniform.",
    refer: "Seek irrigation-design, pump, pressure, filtration, or water-quality support when the cause cannot be safely verified, equipment is damaged, or uniformity remains poor.",
    sourceBasis: "Module 25: design, zones, filtration, pressure, far-end flow, wetting, clogs, leaks, flushing, and prevention-based maintenance.",
  },
  {
    id: "nutrient-plan-evidence-check",
    title: "Nutrient-plan evidence and 4R check",
    shortTitle: "Nutrient-plan check",
    moduleIds: ["nutrient-management", "vegetable-fertilisation"],
    risk: "A routine fertiliser application can miss the limiting factor and worsen loss, crop injury, cost, or uneven growth.",
    purpose: "Check whether the soil, crop, source, placement, timing, and review evidence support a field-specific 4R decision.",
    prepare: ["Bring the relevant soil or pH evidence, crop and growth-stage record, prior application history, source analysis or label, and field map.", "Separate observed symptoms from confirmed nutrient need and inspect roots, moisture, compaction, drainage, and other competing limits.", "Define the field zone and production objective before considering source, rate, timing, or placement."],
    routine: ["Identify the likely limiting factor and evidence still missing.", "Compare crop demand, soil supply, residues or organic sources, prior removals, and source analysis.", "Check the 4Rs: right source, rate, timing, and place—without treating any one as independent of root condition or field context."],
    record: ["Zone, crop, stage, and production objective", "Soil and pH evidence plus field constraints", "Source analysis, prior applications, and placement condition", "Competing explanations and safety constraints", "Review measure and date"],
    decide: ["Use a documented, field-specific plan that addresses the limiting factor.", "Avoid universal rates or a recommendation based on a visual symptom alone.", "State what evidence will confirm, revise, or stop the plan."],
    review: "Review crop response, root-zone condition, and field evidence after the planned action; keep a record of what changed and what did not.",
    refer: "Use laboratory, extension, or qualified agronomy support for uncertain diagnoses, high-consequence rates, unusual soil results, or suspected interactions beyond available evidence.",
    sourceBasis: "Modules 12–16 and 26: nutrient functions, symptom limits, soil and pH context, source analysis, uptake, removal, and 4R placement.",
  },
  {
    id: "sprayer-pre-use-and-calibration-check",
    title: "Sprayer pre-use and calibration check",
    shortTitle: "Sprayer safety check",
    moduleIds: ["responsible-use-of-pesticides"],
    risk: "Incorrect product fit, unsafe conditions, faulty equipment, or poor calibration can cause ineffective control, residues, drift, exposure, contamination, resistance, and wasted cost.",
    purpose: "Decide whether spray work must stop, be corrected, or be referred before any product is measured or applied.",
    prepare: ["Verify the current authorised label, crop and target fit, hazard information, interval and re-entry information, expiry, and required protective measures.", "Check people, water, sensitive areas, weather, crop stage, target life stage, and non-chemical options within IPM.", "Inspect sprayer condition, nozzle, pressure, leaks, clean water, measuring tools, and operator readiness."],
    routine: ["Inspect equipment and identify faults before filling or mixing.", "Check weather, wind direction, rainfall risk, humidity, temperature, and drift-sensitive areas.", "Use a traceable pre-use and calibration check based on walking speed, pressure, nozzle, lance height, crop stage, and the current label; do not copy a rate from course content."],
    record: ["Current label and target/crop fit", "Operator, PPE, equipment and nozzle condition", "Weather and water-source observations", "Calibration or maintenance check", "Stop-work issue, correction, and review note"],
    decide: ["Stop work when legal fit, label information, PPE, weather, water protection, equipment condition, or calibration cannot be verified.", "Prefer prevention, monitoring, and lower-risk IPM options where they remain appropriate.", "Proceed only under current label direction and competent local requirements."],
    review: "Record the condition of equipment and the outcome of any maintenance or calibration check before the next use; evaluate IPM results rather than automatically repeating an action.",
    refer: "Use the current label, extension, registered adviser, competent authority, emergency service, or health professional when exposure, spill, illness, legal uncertainty, equipment failure, or an incident occurs.",
    sourceBasis: "Module 33 and IPM source notes: label literacy, PPE, weather, water protection, nozzle, pressure, calibration, storage, first aid, resistance, and review.",
  },
] as const;

export const fieldMeasurementCardsByModuleId = Object.fromEntries(
  Array.from(new Set(fieldMeasurementCards.flatMap(card => card.moduleIds))).map(moduleId => [
    moduleId,
    fieldMeasurementCards.filter(card => card.moduleIds.includes(moduleId)),
  ])
) as Readonly<Record<string, readonly FieldMeasurementCard[]>>;

export function getFieldMeasurementCard(cardId: string | undefined) {
  return fieldMeasurementCards.find(card => card.id === cardId) ?? fieldMeasurementCards[0];
}
