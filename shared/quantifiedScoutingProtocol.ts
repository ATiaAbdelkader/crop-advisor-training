export type QuantifiedScoutingStage = {
  id: string;
  title: string;
  shortTitle: string;
  moduleIds: readonly string[];
  purpose: string;
  risk: string;
  prepare: readonly string[];
  observe: readonly string[];
  quantify: readonly string[];
  record: readonly string[];
  decisionBoundary: string;
  review: string;
  refer: string;
  sourceBasis: string;
};

export const quantifiedScoutingStages: readonly QuantifiedScoutingStage[] = [
  {
    id: "define-the-scouting-question-and-sample",
    title: "Define the scouting question and sample route",
    shortTitle: "Plan the sample",
    moduleIds: ["field-diagnosis-in-vegetable-crops", "disease-identification-and-management", "insect-pests-and-mites-identification-and-management", "integrated-pest-management", "weed-management"],
    purpose: "Set a clear field question and a repeatable sample route before looking for a preferred answer or choosing an intervention.",
    risk: "A few convenient plants, a single field edge, or a remembered impression can hide the true distribution, confuse a local issue with a field-wide pattern, and distort the next decision.",
    prepare: ["State the question: for example, what pattern, plant part, pest stage, disease sign, weed type, crop-risk, or field condition needs to be verified.", "Divide the field into identifiable zones when crop age, irrigation, soil, history, topography, planting material, or visible condition differs.", "Choose a safe, repeatable route and sampling unit suitable for the question: plants, leaves, traps, row length, a mapped patch, or a defined quadrat where weed density is relevant."],
    observe: ["Compare affected and apparently unaffected plants or zones rather than observing only the most damaged area.", "Inspect plant part, roots where appropriate, symptoms, signs, injury pattern, life stage, weed morphology, crop stage, residue, water, sanitation, and weather context.", "Record what is present and what is absent; do not turn an early observation into a certain diagnosis."],
    quantify: ["Count the sampled units and the units meeting the clearly stated observation condition; calculate incidence as affected units divided by sampled units, expressed as a percentage when useful.", "Describe severity with a defined, consistently applied field scale or named damage class; do not treat severity as a universal threshold.", "For weeds, use a clearly defined sampling area such as the source-grounded 1 m × 1 m quadrat where appropriate, and record density, growth stage, flowering, tuber, or persistence evidence."],
    record: ["Date, field, crop, growth stage, scout, question, route, sampling unit, and number of units examined", "Affected and unaffected zone, plant part, symptom/sign/injury/weed description, crop and field condition", "Counts, incidence calculation, severity class, pest stage or density, trap observations, and mapped field pattern"],
    decisionBoundary: "The protocol supports comparison and evidence; it does not set a universal treatment threshold, confirm a diagnosis, identify a pest from a count alone, or authorise a pesticide action. Current local thresholds, labels, and specialist advice must be verified separately.",
    review: "Repeat the route and sampling unit after a material weather change, intervention, or defined follow-up date so the next record can be compared with the first rather than interpreted in isolation.",
    refer: "Seek qualified plant-health, extension, laboratory, crop-protection, or agronomy support when the cause is uncertain, symptoms spread or are severe, vector/food-safety risk is plausible, or a high-consequence action is being considered.",
    sourceBasis: "Modules 29–34: affected/unaffected comparison, symptoms and signs, roots, field pattern, incidence/severity, pest stage, traps, beneficials, 1 m × 1 m weed sampling, crop stage, and IPM review.",
  },
  {
    id: "separate-pattern-cause-and-contributing-conditions",
    title: "Separate field pattern, possible cause, and contributing conditions",
    shortTitle: "Interpret the pattern",
    moduleIds: ["field-diagnosis-in-vegetable-crops", "disease-identification-and-management", "integrated-pest-management", "weed-management"],
    purpose: "Use the sample record to distinguish an observed pattern from a cause hypothesis and identify field conditions that could be contributing without claiming certainty.",
    risk: "Yellowing, wilt, feeding, spots, weeds, or stunting can arise from multiple interacting causes. A familiar product, pest, or disease name can become a harmful shortcut when evidence is incomplete.",
    prepare: ["Lay out the field map, counts, images or notes, crop history, recent water and input records, weather context, and affected/unaffected comparisons.", "List plausible biotic and abiotic explanations that fit the evidence; include root-zone, water, nutrition, weather, handling, field-history, and crop-health possibilities where relevant.", "Identify the decision that would change if a hypothesis is supported or ruled out."],
    observe: ["Compare whether the pattern follows row, zone, water movement, soil variation, planting material, field edge, host weed, residue, vector activity, or management history.", "Check whether symptoms/signs/injury occur on the same plant parts, growth stages, or field zones and whether roots or soil conditions support the same explanation.", "Note contradictions and uncertainty explicitly rather than selecting the most familiar explanation."],
    quantify: ["Map incidence and severity by zone instead of reporting only a field average when the distribution is uneven.", "Compare repeated counts or observations from affected and unaffected units; record the number of units behind each conclusion.", "Where beneficial organisms or pest stages are relevant, record them separately so their presence is not lost within a total insect count."],
    record: ["Field pattern and map or zone notes", "Observed evidence, plausible explanations, contradictions, and unknowns", "Conducive or protective conditions: wetness, aeration, sanitation, residue, weeds, crop stage, water, weather, or prior action", "Next verification question and the condition that would trigger escalation"],
    decisionBoundary: "A pattern map is not a laboratory diagnosis, a disease confirmation, or a permission to apply a product. Preserve uncertainty and choose a verification step before escalating to higher-risk action.",
    review: "Update the hypothesis only after the next inspection, authorised test, specialist response, or changed field condition supplies new evidence.",
    refer: "Refer when causal uncertainty persists, a potentially serious disease/vector issue is suspected, roots or plant material require specialist inspection, or product selection would be based on inference rather than verified target evidence.",
    sourceBasis: "Modules 29, 30, 32, and 34: biotic–abiotic elimination, field patterns, signs and symptoms, root and water evidence, disease-conducive conditions, IPM, and weed persistence.",
  },
  {
    id: "protect-beneficials-and-measure-pest-pressure",
    title: "Measure pest pressure while protecting beneficial organisms",
    shortTitle: "Count pests and beneficials",
    moduleIds: ["insect-pests-and-mites-identification-and-management", "integrated-pest-management"],
    purpose: "Record pest life stage, injury, density, distribution, and beneficial-organism evidence separately so an IPM decision does not remove useful ecosystem information.",
    risk: "Counting any insect as a pest, ignoring life stage, or using a trap or product as a substitute for scouting can damage beneficials and obscure vector, outbreak, and treatment-fit risk.",
    prepare: ["State the crop, crop stage, suspected target, plant part, damaging stage, injury pattern, sampling route, and whether trap information will supplement—not replace—plant inspection.", "Inspect plants, field edge, host weeds, residues, traps, and affected/unaffected zones using the same sampling unit.", "Use current authoritative identification support when pest, mite, beneficial, or vector status is uncertain."],
    observe: ["Record chewing, mining, boring, sucking, mite, or vector-like injury separately from the organism observed.", "Record the observed pest or mite stage, density or count, plant part, field location, and injury pattern.", "Record beneficial organisms, target-aware trap catches, host weeds, residue, natural-enemy activity, and crop condition as separate evidence."],
    quantify: ["Keep pest, beneficial, trap, and injury observations in separate columns or counts; do not convert a trap catch into a whole-field density estimate.", "Calculate incidence from the defined sampled units and describe severity through a consistent field scale or damage class.", "Compare edge, hotspot, and representative-zone counts to avoid treating a local pressure pattern as an unverified field-wide condition."],
    record: ["Sampling units, plant parts, pest/mite stage, injury type, count or density, and incidence/severity", "Beneficial-organism and trap observations, host weeds, residues, and field zone", "Target identification confidence, vector concern, non-chemical option considered, and follow-up date"],
    decisionBoundary: "Counts do not automatically justify chemical control. Verify target, current threshold or decision rationale, product legality and label fit, beneficial risk, crop stage, weather, water, and alternatives before any intervention.",
    review: "Rescout with the same route after prevention, sanitation, exclusion, physical, biological, or other authorised action and compare pest, injury, and beneficial evidence together.",
    refer: "Seek qualified identification or crop-protection support when the organism, damaging stage, vector risk, natural enemy, threshold, or lawful intervention is uncertain.",
    sourceBasis: "Modules 31 and 32: damaging stages, injury patterns, vector risk, scouting, target-aware traps, host weeds and residue, natural enemies, biological options, and constrained escalation.",
  },
  {
    id: "turn-scouting-into-a-reviewable-ipm-decision",
    title: "Turn quantified scouting into a reviewable IPM decision",
    shortTitle: "Decide and review",
    moduleIds: ["integrated-pest-management", "weed-management", "disease-identification-and-management", "field-diagnosis-in-vegetable-crops"],
    purpose: "Turn a scouting record into a proportionate prevention, monitoring, physical, cultural, biological, or carefully constrained escalation decision with a clear recheck.",
    risk: "A record without a decision rationale or recheck allows pressure, weather, crop condition, beneficials, persistence, and unintended effects to be ignored after the first observation.",
    prepare: ["Review the scouting question, sample size, incidence, severity, pattern, crop stage, pests/disease/weeds, beneficials, conducive conditions, and uncertainty.", "List feasible prevention, sanitation, cultural, physical, mechanical, biological, exclusion, or targeted options before considering a higher-risk escalation.", "State what evidence, authorised threshold, current label, specialist finding, or changed condition would be needed to justify a different decision."],
    observe: ["Check whether the selected option addresses the observed persistence mechanism, spread pathway, crop stage, field pattern, or risk rather than only visible symptoms.", "Confirm whether people, beneficials, water, food safety, weather, equipment, labour, and record needs introduce a new constraint.", "Write the condition that would mean the decision should be reconsidered or escalated."],
    quantify: ["Use the original sampling unit, mapped zone, count, incidence, severity class, and beneficial observation as the baseline for a recheck.", "Do not invent a threshold from a single count; record the source of any threshold or decision rationale and its date.", "Compare follow-up evidence with the baseline and document whether pressure, injury, beneficials, or field conditions changed."],
    record: ["Evidence summary, uncertainty, and decision rationale", "Prevention/intervention selected, constraints, person responsible, and planned follow-up", "Recheck route, date, baseline measures, escalation trigger, and referral condition"],
    decisionBoundary: "The protocol does not prescribe a pesticide, rate, threshold, interval, or legal action. Any chemical decision remains conditional on verified current law, label, target, crop, safety, water, weather, resistance, and authorised guidance.",
    review: "Repeat the established sampling route, compare the baseline and follow-up evidence, record unintended effects, and revise prevention or escalation only from verified evidence.",
    refer: "Refer when evidence conflicts, pressure worsens, disease or vector risk is uncertain, a product decision is contemplated without verified fit, or the next action could materially affect people, water, beneficials, or food safety.",
    sourceBasis: "Modules 29, 30, 32, and 34: evidence-led diagnosis, prevention-monitoring-intervention-review, cultural/physical/biological controls, target-aware escalation, persistence mechanisms, and lawful safeguards.",
  },
] as const;

export const quantifiedScoutingByModuleId = Object.fromEntries(
  Array.from(new Set(quantifiedScoutingStages.flatMap(stage => stage.moduleIds))).map(moduleId => [
    moduleId,
    quantifiedScoutingStages.filter(stage => stage.moduleIds.includes(moduleId)),
  ])
) as Readonly<Record<string, readonly QuantifiedScoutingStage[]>>;

export function getQuantifiedScoutingStage(stageId: string | undefined) {
  return quantifiedScoutingStages.find(stage => stage.id === stageId) ?? quantifiedScoutingStages[0];
}
