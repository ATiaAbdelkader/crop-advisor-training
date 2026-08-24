export type ScenarioQuestion = {
  id: string;
  prompt: string;
  options: readonly { id: string; label: string }[];
  correctOptionId: string;
  feedback: string;
};

export type AppliedScenario = {
  id: string;
  moduleId: string;
  title: string;
  context: string;
  decisionPrompt: string;
  evidenceChecklist: readonly string[];
  reflectionPrompt: string;
  questions: readonly ScenarioQuestion[];
};

export const appliedScenarios: Readonly<Record<string, AppliedScenario>> = {
  "water-root-zone-decision": {
    id: "water-root-zone-decision",
    moduleId: "water-management",
    title: "Scenario: Protect the root zone after uneven irrigation",
    context: "A tomato block on a fine-textured section has received two long irrigations after a hot week. The surface is dry by noon, but a root-zone check at 15 cm finds wet, sticky soil, weak aeration, and yellowing lower leaves in the low area. A short rain event is forecast tomorrow.",
    decisionPrompt: "Choose the evidence-led next step; the goal is to protect both usable water and air around roots.",
    evidenceChecklist: ["Root-zone moisture and structure at the active rooting depth", "Distribution of symptoms and drainage pattern", "Forecast rain and the irrigation-system setting", "Water-source condition if water will contact a food crop"],
    reflectionPrompt: "What observation would make you adjust the next irrigation timing or drainage action?",
    questions: [
      { id: "water-q1", prompt: "Which field observation should carry the most weight before applying more water?", options: [{ id: "a", label: "The dry surface at midday" }, { id: "b", label: "The wet, poorly aerated rooting zone and low-area pattern" }, { id: "c", label: "The calendar date of the last irrigation" }, { id: "d", label: "The total irrigated area" }], correctOptionId: "b", feedback: "Root-zone moisture and aeration, together with the spatial pattern, are stronger decision evidence than surface appearance alone." },
      { id: "water-q2", prompt: "What is the most defensible immediate action?", options: [{ id: "a", label: "Increase duration because the surface dries by noon" }, { id: "b", label: "Continue the schedule unchanged until leaves recover" }, { id: "c", label: "Pause or reduce irrigation in the affected zone, inspect drainage, and reassess after the forecast rain" }, { id: "d", label: "Apply fertiliser to correct the yellowing first" }], correctOptionId: "c", feedback: "The evidence indicates possible excess water and poor air supply. Drainage and a weather-aware reassessment protect roots before another application." },
      { id: "water-q3", prompt: "Which record best supports the next review?", options: [{ id: "a", label: "Only the total minutes irrigated" }, { id: "b", label: "Root-zone condition before and after, rainfall, drainage observation, action, and review trigger" }, { id: "c", label: "A general note that the field looked wet" }, { id: "d", label: "The crop name only" }], correctOptionId: "b", feedback: "A complete record links field evidence to the action and specifies the condition that would change the next decision." },
    ],
  },
  "fertilisation-limiting-factor-decision": {
    id: "fertilisation-limiting-factor-decision",
    moduleId: "vegetable-fertilisation",
    title: "Scenario: Revise a fertilisation plan after uneven crop response",
    context: "A pepper crop has weak growth in one compacted, lower-drainage zone. The grower proposes repeating a high-nitrogen application across the whole field. A soil test and field notes show low aeration in the affected zone, acceptable nutrient supply in the better area, and recent heavy rainfall.",
    decisionPrompt: "Use the 4R approach to address the field’s limiting factor rather than applying a routine input.",
    evidenceChecklist: ["Soil condition, drainage, and root access", "Soil-test or crop evidence by management zone", "Crop stage and expected nutrient demand", "Product analysis, label, rate, timing, and placement constraints"],
    reflectionPrompt: "Which limiting factor would you address first, and what evidence would justify revising the rate or placement?",
    questions: [
      { id: "fert-q1", prompt: "What is the most important conclusion from the contrasting zones?", options: [{ id: "a", label: "All plants need more nitrogen immediately" }, { id: "b", label: "The compacted, poorly drained zone may limit root function before nutrient rate is increased" }, { id: "c", label: "Soil tests are unnecessary when leaves are pale" }, { id: "d", label: "The better zone proves the whole field needs identical management" }], correctOptionId: "b", feedback: "The difference between zones points to a physical root-zone constraint. A nutrient rate cannot reliably overcome poor aeration and root access." },
      { id: "fert-q2", prompt: "Which 4R response is most defensible?", options: [{ id: "a", label: "Use the same high rate everywhere because it is fast" }, { id: "b", label: "Choose a source without checking the analysis or label" }, { id: "c", label: "Correct the limiting root-zone condition, then match a verified source, rate, time, and placement to the zone and crop stage" }, { id: "d", label: "Place fertiliser directly against roots to ensure uptake" }], correctOptionId: "c", feedback: "The 4Rs require the input decision to fit evidence about soil, crop demand, source analysis, timing, and safe placement." },
      { id: "fert-q3", prompt: "What should the follow-up record include?", options: [{ id: "a", label: "Only the product brand" }, { id: "b", label: "The limiting-factor evidence, source analysis, actual amount, placement, soil condition, crop response, and revision trigger" }, { id: "c", label: "A note that fertiliser was applied" }, { id: "d", label: "Only a yield estimate" }], correctOptionId: "b", feedback: "A usable fertilisation record makes the 4R decision and its field response traceable for later revision." },
    ],
  },
  "ipm-scout-to-action-decision": {
    id: "ipm-scout-to-action-decision",
    moduleId: "integrated-pest-management",
    title: "Scenario: Decide an IPM response before escalation",
    context: "A cucumber field shows patchy leaf feeding and a small number of insects in one edge row. The affected zone also has volunteer weeds and crop residue. Scouting identifies natural enemies on several plants, and the grower asks for an immediate broad-spectrum spray before confirming the target or incidence.",
    decisionPrompt: "Select an observation-to-decision response that protects the crop and beneficial organisms.",
    evidenceChecklist: ["Verified pest or injury evidence and affected plant part", "Incidence, severity, field pattern, and crop stage", "Beneficial organisms and pest-conducive conditions", "Prevention, cultural, physical, biological, and only then lawful product options"],
    reflectionPrompt: "What evidence would show that escalation is justified, and how would you protect beneficial organisms?",
    questions: [
      { id: "ipm-q1", prompt: "What should happen before selecting a crop-protection product?", options: [{ id: "a", label: "Confirm the target, map incidence and severity, inspect beneficials, and identify conducive conditions" }, { id: "b", label: "Choose the strongest available product" }, { id: "c", label: "Spray every plant so the pattern does not matter" }, { id: "d", label: "Ignore edge-row evidence because it is not central" }], correctOptionId: "a", feedback: "IPM starts with verified observation and analysis. Pattern, severity, beneficials, and conditions determine whether intervention is justified." },
      { id: "ipm-q2", prompt: "Which first response best fits the evidence?", options: [{ id: "a", label: "A broad-spectrum product without further checks" }, { id: "b", label: "Remove volunteer weeds and residue, continue targeted scouting, and use an appropriate non-product or biological measure if evidence supports it" }, { id: "c", label: "Stop all observation until visible injury increases" }, { id: "d", label: "Treat beneficial organisms as pests" }], correctOptionId: "b", feedback: "Sanitation and targeted monitoring address likely pest-conducive conditions while preserving beneficial organisms and decision options." },
      { id: "ipm-q3", prompt: "If a product is later justified, which condition remains essential?", options: [{ id: "a", label: "Use any product that is available" }, { id: "b", label: "Use a lawful, crop- and target-specific, label-directed option with applicable safety and interval requirements" }, { id: "c", label: "Apply before identifying the target" }, { id: "d", label: "Skip the follow-up check" }], correctOptionId: "b", feedback: "Chemical action is a constrained last resort within IPM. Legal fit, target specificity, label direction, safety, and review remain essential." },
    ],
  },
};

export const appliedScenarioByModuleId: Readonly<Record<string, AppliedScenario>> = Object.values(appliedScenarios).reduce(
  (scenarios, scenario) => ({ ...scenarios, [scenario.moduleId]: scenario }),
  {} as Record<string, AppliedScenario>
);

export function scoreAppliedScenario(scenario: AppliedScenario, answers: Record<string, string>) {
  const results = scenario.questions.map(question => ({
    questionId: question.id,
    correct: answers[question.id] === question.correctOptionId,
    feedback: question.feedback,
  }));
  const correctCount = results.filter(result => result.correct).length;
  const score = Math.round((correctCount / scenario.questions.length) * 100);
  return { score, correctCount, totalQuestions: scenario.questions.length, passed: score >= 67, results };
}
