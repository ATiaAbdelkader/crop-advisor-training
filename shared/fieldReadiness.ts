export type FieldPracticumPayload = {
  visitDate: string;
  visitVerification: string;
  localityAndProductionContext: string;
  growerQuestion: string;
  growerInterviewNotes: string;
  observationAndEvidence: string;
  competingExplanations: string;
  provisionalDiagnosis: string;
  recommendationAndRationale: string;
  communicationPlan: string;
  economicsAndRiskCheck: string;
  followUpTrigger: string;
  followUpOutcome: string;
  referralOrEscalationBoundary: string;
  localSourcesChecked: string;
  rubric: Record<string, number>;
};

export const fieldPracticumFields: ReadonlyArray<{ key: Exclude<keyof FieldPracticumPayload, "rubric">; label: string; hint: string }> = [
  { key: "visitDate", label: "Visit date", hint: "Record the actual field-visit date." },
  { key: "visitVerification", label: "Visit verification or supervision status", hint: "Record whether this was a real, simulated, or supervised visit; include supervisor, grower, or host confirmation only where consent is given." },
  { key: "localityAndProductionContext", label: "Locality and production context", hint: "State wilaya or locality, crop, stage, production setting, soil or water context, and buyer or household purpose." },
  { key: "growerQuestion", label: "Grower question", hint: "Write the question or decision the grower needs help with in clear, neutral language." },
  { key: "growerInterviewNotes", label: "Grower interview notes", hint: "Record relevant history, priorities, labour or budget constraints, and what the grower has already tried; distinguish reported information from direct observation." },
  { key: "observationAndEvidence", label: "Observation and evidence", hint: "Separate what was observed from what was reported. Include field pattern, comparison plants or zones, roots or soil where relevant, weather, and records checked." },
  { key: "competingExplanations", label: "Competing explanations and uncertainty", hint: "Name at least two plausible explanations or state what cannot yet be concluded." },
  { key: "provisionalDiagnosis", label: "Provisional diagnosis or decision statement", hint: "State the leading interpretation as provisional, identify the evidence limit, and avoid treating it as a final diagnosis without verification." },
  { key: "recommendationAndRationale", label: "Recommendation and rationale", hint: "State the lowest-risk defensible next step and connect it to the evidence. Do not prescribe a product without lawful, label-directed verification." },
  { key: "communicationPlan", label: "Grower communication plan", hint: "Explain the action, cost or labour implication, safety condition, and how the grower can report back." },
  { key: "economicsAndRiskCheck", label: "Economics and risk check", hint: "Record a local cost, labour, market, loss, or affordability assumption and the risk if it proves wrong." },
  { key: "followUpTrigger", label: "Follow-up trigger", hint: "Name the observation, date, or threshold that will confirm, revise, or stop the recommendation." },
  { key: "followUpOutcome", label: "Follow-up outcome evidence", hint: "After review, record what changed, what did not, and whether the recommendation was confirmed, revised, stopped, or referred." },
  { key: "referralOrEscalationBoundary", label: "Referral or escalation boundary", hint: "State when to involve an extension specialist, laboratory, registered adviser, health professional, or competent authority." },
  { key: "localSourcesChecked", label: "Local sources checked", hint: "Record current extension, weather, buyer, market, label, or official regulatory sources checked and their dates." },
];

export const fieldReadinessRubric = [
  { id: "evidence", label: "Evidence quality", description: "Uses direct observations, grower reports, records, and healthy or unaffected comparisons without mixing them." },
  { id: "uncertainty", label: "Uncertainty and decision boundary", description: "States what is provisional, what requires verification, and when to refer or escalate." },
  { id: "recommendation", label: "Safe, practical recommendation", description: "Prioritises the limiting factor and a low-risk action before constrained escalation." },
  { id: "local", label: "Local intelligence and economics", description: "Uses dated local weather, market, buyer, cost, labour, label, or official-source evidence." },
  { id: "communication", label: "Communication and ethics", description: "Explains the action respectfully, protects confidentiality, names consent needs, and avoids overpromising." },
  { id: "review", label: "Digital record and follow-up", description: "Creates a traceable record, review trigger, outcome check, and revision path." },
] as const;

function createEmptyRubric() {
  return Object.fromEntries(fieldReadinessRubric.map(criterion => [criterion.id, 0])) as Record<string, number>;
}

export function createEmptyFieldPracticumPayload(): FieldPracticumPayload {
  return {
    visitDate: "",
    visitVerification: "",
    localityAndProductionContext: "",
    growerQuestion: "",
    growerInterviewNotes: "",
    observationAndEvidence: "",
    competingExplanations: "",
    provisionalDiagnosis: "",
    recommendationAndRationale: "",
    communicationPlan: "",
    economicsAndRiskCheck: "",
    followUpTrigger: "",
    followUpOutcome: "",
    referralOrEscalationBoundary: "",
    localSourcesChecked: "",
    rubric: createEmptyRubric(),
  };
}

export type CapstoneCase = {
  id: string;
  title: string;
  setting: string;
  decisionBrief: string;
  evidencePack: readonly string[];
  requiredDecisions: readonly string[];
  responsePrompts: readonly string[];
};

export const capstoneCases: Readonly<Record<string, CapstoneCase>> = {
  "water-market-resilience": {
    id: "water-market-resilience",
    title: "Capstone: Water, crop stage, and a changing market window",
    setting: "An irrigated vegetable block has uneven water delivery, a sensitive flowering stage, and a buyer whose collection window may move after weather disruption.",
    decisionBrief: "Prepare a local, evidence-led advisory plan that protects root-zone function, avoids an uneconomic response, and creates a review path with the grower.",
    evidencePack: ["Root-zone moisture, drainage, delivery-uniformity, and source observations", "Crop stage, forecast, and current local weather information", "Buyer requirement, expected harvest window, labour capacity, and cost assumption", "Local source dates and uncertainty limits"],
    requiredDecisions: ["Identify the limiting factor and an immediate low-risk action", "Explain the water, crop-stage, climate, and economic trade-off", "State what cannot be concluded and when to refer or escalate", "Set a grower communication and follow-up plan"],
    responsePrompts: ["What evidence makes this the priority problem?", "What will you recommend now, and what will you not recommend yet?", "What local cost, buyer, or weather assumption affects the decision?", "What observation will confirm, revise, or stop the plan?"],
  },
  "diagnosis-to-ipm": {
    id: "diagnosis-to-ipm",
    title: "Capstone: Patchy crop decline under disease and pest pressure",
    setting: "A vegetable field has patchy yellowing, leaf injury, wet low areas, crop residue, and a grower request for an immediate spray recommendation.",
    decisionBrief: "Create a qualified diagnosis-to-IPM plan that protects the crop and beneficial organisms without claiming certainty beyond the evidence.",
    evidencePack: ["Affected and healthy comparison plants, roots, symptoms, signs, and field pattern", "Incidence, severity, beneficial organisms, weeds or residue, and crop stage", "Water, soil, weather, and recent management history", "Current legal and label verification requirement if escalation is considered"],
    requiredDecisions: ["Frame competing biotic and abiotic explanations", "Select prevention, monitoring, cultural, physical, or biological actions before constrained escalation", "State the exact condition for lawful product consideration or referral", "Explain the advice in language a grower can act on and review"],
    responsePrompts: ["Which observations support and weaken your leading explanation?", "What can be changed today without over-claiming diagnosis?", "What must be verified before a product decision?", "How will you protect beneficials and review the outcome?"],
  },
  "safe-input-and-economics": {
    id: "safe-input-and-economics",
    title: "Capstone: A proposed input purchase under pressure",
    setting: "A grower faces poor crop response and a retailer promotes a high-cost input. Field evidence is incomplete, labour is limited, and harvest is approaching.",
    decisionBrief: "Assess the recommendation as an agronomic, safety, affordability, and communication problem—not only as an input choice.",
    evidencePack: ["Crop stage, root-zone evidence, soil or crop test availability, and prior input history", "Product label, crop-target fit, lawful status, safety and interval conditions where relevant", "Actual local price, quantity, labour, expected benefit, and downside risk", "Alternative lower-risk actions and evidence needed before spending"],
    requiredDecisions: ["Separate the field problem from the proposed product", "Build a simple cost, labour, benefit, and uncertainty comparison", "State product, PPE, water, label, and referral boundaries where applicable", "Agree a transparent recommendation and follow-up with the grower"],
    responsePrompts: ["What is the first evidence gap to close?", "Which assumption has the largest economic risk?", "What safety or legal condition makes the action unacceptable?", "How would you communicate a defer, test, or lower-cost decision respectfully?"],
  },
  "harvest-chain-and-buyer": {
    id: "harvest-chain-and-buyer",
    title: "Capstone: Protect quality from field to buyer",
    setting: "Mixed-maturity vegetables are harvested in rough containers at midday, shade is limited, water status is unclear, and a buyer has quality expectations.",
    decisionBrief: "Build a market-quality, food-safety, labour, and loss-control plan for the next harvest cycle.",
    evidencePack: ["Maturity criteria, harvest timing, tool and container condition", "Shade, cooling, cleaning, water, hygiene, and defect observations", "Buyer specification, price or rejection risk, labour, and transport context", "Applicable interval and traceability record check"],
    requiredDecisions: ["Prioritise the most preventable loss point", "Set a practical harvest-to-buyer handling sequence", "State food-safety and traceability conditions that cannot be skipped", "Measure quality outcome, labour, and buyer feedback at review"],
    responsePrompts: ["What hand-off creates the greatest current loss risk?", "Which adjustment is feasible with the team and materials available?", "What must be verified before product enters the market chain?", "What evidence would show improved quality or reduced rejection?"],
  },
  "climate-soil-and-weed-resilience": {
    id: "climate-soil-and-weed-resilience",
    title: "Capstone: Protect a crop through heat, runoff, and persistent weeds",
    setting: "A direct-seeded vegetable field faces variable heat, uneven runoff, early weed competition, flowering annual weeds, and persistent underground weed structures.",
    decisionBrief: "Develop a climate-resilient production response that links soil protection, water movement, weed persistence, labour, and safe escalation.",
    evidencePack: ["Field map, slope or runoff pattern, ground cover, soil condition, and crop stage", "Weather signal, water access, heat or drought exposure, and forecast source", "1 m² weed sample, density, morphology, flowering, and persistence evidence", "Labour, mulch, hand-removal, equipment, local cost, and any label safeguards"],
    requiredDecisions: ["Identify the linked water, soil, climate, and weed risks", "Prioritise timely cultural and physical actions that fit labour and crop stage", "Set a lawful escalation boundary and drift or equipment safeguards if relevant", "Create a local calendar, measurement, and follow-up plan"],
    responsePrompts: ["Which risk is most time-sensitive and why?", "How does the weed persistence mechanism change the sequence of action?", "What local weather, cost, or labour information must be updated?", "What result would show resilience has improved at the next review?"],
  },
};

export const fieldReadinessStandards = [
  "Observe and record before recommending; distinguish observation, report, inference, and uncertainty.",
  "Address the limiting factor before routine input use, and consider linked soil, water, crop, climate, and economic conditions.",
  "Use current local weather, extension, buyer, market, label, and official sources as dated evidence rather than fixed assumptions.",
  "Communicate a practical action, cost or labour implication, safety condition, follow-up trigger, and referral boundary.",
  "Treat pesticide, seed, food-safety, and market requirements as current-source verification tasks; never infer legal approval from course content.",
] as const;

export const fieldReadinessRequirements = {
  minimumPracticumVisits: 3,
  minimumIntegratedCapstones: 2,
  minimumFieldRecords: 2,
  minimumPassedScenarios: 4,
  requiredReflectionFoci: ["field-judgement"] as const,
  note: "These criteria support a Field Readiness self-review. They do not modify the programme's existing formal assessment, certification, or owner-alert requirements.",
} as const;

export type CapstoneSubmissionPayload = {
  responses: string[];
  selfReview: string;
  rubric: Record<string, number>;
};

export function createEmptyCapstoneSubmissionPayload(capstone: CapstoneCase): CapstoneSubmissionPayload {
  return { responses: capstone.responsePrompts.map(() => ""), selfReview: "", rubric: createEmptyRubric() };
}

export function isCompleteCapstoneSubmission(payload: CapstoneSubmissionPayload, capstone: CapstoneCase) {
  return payload.responses.length === capstone.responsePrompts.length
    && payload.responses.every(response => response.trim().length >= 40)
    && payload.selfReview.trim().length >= 40
    && fieldReadinessRubric.every(criterion => payload.rubric[criterion.id] >= 1 && payload.rubric[criterion.id] <= 4);
}

export function isCompleteFieldPracticum(payload: FieldPracticumPayload) {
  return fieldPracticumFields.every(field => field.key === "visitDate"
    ? /^\d{4}-\d{2}-\d{2}$/.test(payload.visitDate)
    : payload[field.key].trim().length >= 12)
    && fieldReadinessRubric.every(criterion => payload.rubric[criterion.id] >= 1 && payload.rubric[criterion.id] <= 4);
}

export const localIntelligenceSteps = [
  { title: "Place", prompt: "Record wilaya or locality, production system, crop stage, soil, slope, and water-source context." },
  { title: "Season", prompt: "Check a dated forecast or local weather source, critical crop stage, and the next climate risk." },
  { title: "Market", prompt: "Record buyer or household purpose, current price or cost assumption, quality requirement, labour, and loss risk." },
  { title: "Safety", prompt: "Verify current label, interval, hygiene, seed, water, food-safety, and official-source requirements where relevant." },
  { title: "Review", prompt: "State what will be measured, when it will be revisited, and when specialist or authority support is needed." },
] as const;

export const fieldReadinessResources = [
  { id: "economics", title: "Farm economics and recommendation value", standard: "Compare a local cost, labour, expected benefit, and downside risk before recommending expenditure.", practice: "Write one price, yield, labour, or buyer assumption and the condition that would make you revise it." },
  { id: "communication", title: "Adviser communication, ethics, and confidentiality", standard: "Ask before recording identifiable farm information; explain uncertainty, consent, safety, and choices without blame or overpromising.", practice: "Summarise the grower question, what you observed, what remains uncertain, and the agreed next check." },
  { id: "digital", title: "Digital field methods and traceable evidence", standard: "Use dated zone notes, measurements, maps or sketches, record references, and authorised images to make decisions reviewable.", practice: "Create a field record that links the location or zone, observation, action, and follow-up result." },
] as const;
