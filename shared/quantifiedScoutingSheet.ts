export const quantifiedScoutingSheet = {
  id: "quantified-scouting-sheet",
  title: "Quantified Scouting Sheet",
  purpose: "Record a repeatable field sample, compare affected and unaffected observations, retain pest and beneficial evidence separately, and document a proportionate decision with a recheck or referral condition.",
  linkedModuleIds: [
    "field-diagnosis-in-vegetable-crops",
    "disease-identification-and-management",
    "insect-pests-and-mites-identification-and-management",
    "integrated-pest-management",
    "weed-management",
  ],
  useSteps: [
    "Write the field question, sampling route, unit, and number of units before beginning the observation.",
    "Compare affected and apparently unaffected zones; retain patterns, symptoms, signs, pest stage, weed evidence, field conditions, and uncertainty.",
    "Keep pest, beneficial-organism, trap, and injury observations separate. Calculate incidence only from the sampled units recorded.",
    "State a proportionate decision, recheck using the same sampling frame, and refer when the cause, threshold, legal fit, or high-consequence action is uncertain.",
  ],
  setupFields: ["Date / time", "Farm, field, block, or zone", "Crop, variety, and growth stage", "Scout or team", "Scouting question", "Sample route, unit, and number examined"],
  columns: ["Zone / sample unit", "Plant part and field pattern", "Pest, symptom, sign, or weed evidence", "Sampled / affected count", "Incidence / severity class", "Beneficials / traps / host weeds", "Contributing conditions and uncertainty", "Decision, recheck, or referral"],
  reviewPrompts: ["What does the sample support, what remains uncertain, and what evidence would change the current explanation?", "What action, prevention, or monitoring step is proportionate to the evidence? What must be verified before higher-risk escalation?", "When and how will the same route/unit be rechecked? What result or risk requires specialist, extension, laboratory, crop-protection, or other authorised support?"],
  boundary: "This sheet supports comparable field evidence. It does not confirm diagnosis, create a universal treatment threshold, prescribe an intervention, or replace current local requirements, product labels, or specialist advice.",
} as const;
