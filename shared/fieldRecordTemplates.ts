export type FieldRecordTemplate = {
  id: string;
  moduleId: string;
  title: string;
  shortTitle: string;
  purpose: string;
  useSteps: readonly string[];
  setupFields: readonly string[];
  recordColumns: readonly string[];
  reviewPrompts: readonly string[];
  safetyNote: string;
  mapSketchPrompt?: string;
};

export const fieldRecordTemplates: Readonly<Record<string, FieldRecordTemplate>> = {
  "input-source-quote-comparison": {
    id: "input-source-quote-comparison",
    moduleId: "cost-planning-and-decisions",
    title: "Input and Source Quote-Comparison Worksheet",
    shortTitle: "Quote comparison",
    purpose: "Compare like-for-like source quotes or service estimates against a stated production plan, retain the assumptions and terms, and identify the evidence needed before a cost is used in a decision.",
    useSteps: [
      "State the production objective, requested item or service scope, required specification, quantity, and unit before recording a quote.",
      "Record the source reference, quote date, stated charges, availability, delivery or collection terms, validity, and any quality or comparison gap; do not infer missing terms.",
      "Use the decision review to identify whether the quotes are comparable, what information could change the plan, and whether to revise, pause, or seek qualified support.",
    ],
    setupFields: ["Farm or grower", "Production objective or activity", "Item or service scope and specification", "Required quantity and unit", "Quote request and comparison date"],
    recordColumns: ["Item or service and specification", "Source or quote reference", "Quantity and unit", "Quoted price and stated charges", "Availability, delivery, and validity", "Terms, quality check, and evidence gap"],
    reviewPrompts: ["Are these quotes genuinely comparable in scope, unit, quantity, condition, timing, and stated charges?", "Which uncertain cost or return assumption could change the plan, and what is the next verification, revision, pause, or qualified-support step?"],
    safetyNote: "This worksheet records comparison evidence; it does not endorse a supplier, product, service, specification, price, quantity, input, rate, timing, or purchase decision. Confirm current product, technical, market, financial, legal, and safety requirements through authorised local sources or qualified support before a consequential commitment.",
  },
  "root-zone-comparison-record": {
    id: "root-zone-comparison-record",
    moduleId: "soil-and-nutrition",
    title: "Root-Zone Comparison Field Record",
    shortTitle: "Root-zone comparison",
    purpose: "Compare two meaningful crop areas from the surface through the root zone, preserve the evidence context, and identify the next check before a nutrient, irrigation, or soil-management decision is made.",
    useSteps: [
      "State the field question and select an affected or uncertain area plus a similar-stage reference or typical comparison area.",
      "Record the same visible surface, profile, root, moisture, crop, and management-context evidence for both areas; separate observations from explanations.",
      "Use the decision review to identify the evidence gap, repeat observation, authorised interpretation, or qualified referral needed next.",
    ],
    setupFields: ["Farm or grower", "Field or management zone", "Crop and growth stage", "Field question or decision", "Reference and comparison area identifiers"],
    recordColumns: ["Date / observer", "Area and location", "Surface and crop pattern", "Profile, root, and pore observation", "Moisture / recent water or management context", "Comparison, uncertainty, and next evidence"],
    reviewPrompts: ["Which observations agree with the working explanation, and which observation challenges it?", "What is the lowest-risk next evidence step, and what would require a pause, recheck, or qualified referral?"],
    safetyNote: "This record supports observation and comparison only. It does not confirm a diagnosis or prescribe irrigation, drainage, fertiliser, amendment, product, dose, rate, timing, or field operation. Use current local laboratory interpretation, authorised guidance, and qualified support when a consequential decision is needed.",
    mapSketchPrompt: "Sketch the crop-walk route, reference and comparison areas, drainage or field-direction cues, and the marked observation positions. Add a simple key; record observations rather than a diagnosis.",
  },
  "water-management-record": {
    id: "water-management-record",
    moduleId: "water-management",
    title: "Water Management Field Record",
    shortTitle: "Water record",
    purpose: "Record root-zone water conditions, irrigation decisions, drainage observations, and the follow-up evidence needed to protect crop roots.",
    useSteps: [
      "Complete the field and crop details before the irrigation or rain event is assessed.",
      "Record what was observed at the rooting depth, not only the surface condition.",
      "Use the review row to decide whether the next irrigation, drainage, or water-source action should change.",
    ],
    setupFields: ["Farm or grower", "Field or management zone", "Crop and growth stage", "Soil texture or rooting constraint", "Irrigation system and water source"],
    recordColumns: ["Date / time", "Rainfall or irrigation event", "Root-zone moisture before / after", "Crop or drainage observation", "Action, duration, or volume", "Next review trigger"],
    reviewPrompts: ["What evidence shows the root zone has both usable water and air?", "What condition would require a change to timing, duration, drainage, or source?"],
    safetyNote: "Do not record an unsafe source as acceptable. Note water-quality concerns and follow local requirements before water contacts a food crop.",
  },
  "fertilisation-record": {
    id: "fertilisation-record",
    moduleId: "vegetable-fertilisation",
    title: "Vegetable Fertilisation 4R Field Record",
    shortTitle: "Fertilisation record",
    purpose: "Document the evidence behind source, rate, timing, and placement so fertilisation responds to the field’s limiting factor rather than a routine schedule.",
    useSteps: [
      "State the crop, stage, and soil or crop evidence before selecting an input.",
      "Record the product analysis and the actual field quantity in units that can be checked later.",
      "Review crop response and losses before repeating or changing the plan.",
    ],
    setupFields: ["Farm or grower", "Field or management zone", "Crop and growth stage", "Soil-test or limiting-factor evidence", "Area and target yield context"],
    recordColumns: ["Date", "Source and label analysis", "Right rate / actual amount", "Right time and crop stage", "Right placement / soil condition", "Review observation and next action"],
    reviewPrompts: ["Which limiting factor is this action intended to correct?", "What crop, soil, loss, or safety evidence would require this 4R plan to be revised?"],
    safetyNote: "Follow the product label and local requirements. Keep fertiliser away from direct root contact where the crop or product guidance requires separation.",
  },
  "integrated-pest-management-record": {
    id: "integrated-pest-management-record",
    moduleId: "integrated-pest-management",
    title: "Integrated Pest Management Field Record",
    shortTitle: "IPM record",
    purpose: "Turn scouting evidence into a prevention, monitoring, intervention, and review cycle that protects the crop and beneficial organisms.",
    useSteps: [
      "Identify the crop stage, field zone, pest or injury evidence, and beneficial organisms before choosing an intervention.",
      "Record the non-product actions and the decision rationale, not just a control method.",
      "Use the follow-up date and threshold or decision trigger to determine whether the plan worked.",
    ],
    setupFields: ["Farm or grower", "Field or management zone", "Crop and growth stage", "Scouting date and observer", "Previous action or crop-history concern"],
    recordColumns: ["Pest, injury, or disease clue", "Location, incidence, and severity", "Beneficials / conducive conditions", "Prevention or non-product action", "Constrained escalation details", "Review date, trigger, and result"],
    reviewPrompts: ["What evidence confirms the target and the need for intervention?", "How will this action protect beneficial organisms and prevent the same pressure from recurring?"],
    safetyNote: "A crop-protection product is not a substitute for diagnosis, prevention, or monitoring. Any product action must be lawful, label-directed, target-specific, and recorded with its applicable interval and safety requirements.",
  },
};

export const fieldRecordByModuleId: Readonly<Record<string, FieldRecordTemplate>> = Object.values(fieldRecordTemplates).reduce(
  (records, template) => ({ ...records, [template.moduleId]: template }),
  {} as Record<string, FieldRecordTemplate>
);
