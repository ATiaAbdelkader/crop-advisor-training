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
};

export const fieldRecordTemplates: Readonly<Record<string, FieldRecordTemplate>> = {
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
