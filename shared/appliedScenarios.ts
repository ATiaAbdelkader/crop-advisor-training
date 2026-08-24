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
  "drip-uniformity-and-water-quality-decision": {
    id: "drip-uniformity-and-water-quality-decision",
    moduleId: "drip-irrigation-system",
    title: "Scenario: Restore uniform drip delivery before changing the schedule",
    context: "Near-tank plants are saturated while far-row plants are dry. The source water contains visible sediment, the filter-cleaning record is missing, and one lateral has a leak. The grower proposes extending every irrigation run immediately.",
    decisionPrompt: "Trace the full water path before changing duration, pressure, or replacing parts.",
    evidenceChecklist: ["Source-water condition and filtration state", "Pressure, zones, and far-end flow", "Emitter output and soil wetting pattern", "Leaks, clogs, flushing history, and maintenance record"],
    reflectionPrompt: "Which observation would show that uniformity has improved without overwatering the near-tank zone?",
    questions: [
      { id: "drip-q1", prompt: "What evidence best explains why a longer run across the whole block may worsen the problem?", options: [{ id: "a", label: "Near and far rows always need identical water" }, { id: "b", label: "The contrasting wetting pattern may result from filtration, pressure, clogging, or leaks along the water path" }, { id: "c", label: "Sediment affects only crop colour" }, { id: "d", label: "Run time is the only part of a drip system that matters" }], correctOptionId: "b", feedback: "Uneven wetting requires a water-path diagnosis. Increasing run time can saturate already wet areas while leaving delivery faults unresolved." },
      { id: "drip-q2", prompt: "Which immediate response is most defensible?", options: [{ id: "a", label: "Extend the run for every zone before inspecting equipment" }, { id: "b", label: "Inspect and maintain filtration, check pressure and far-end flow, locate leaks or clogs, then flush and reassess wetting" }, { id: "c", label: "Replace all emitters without checking the source or filter" }, { id: "d", label: "Ignore far-row plants until the next irrigation cycle" }], correctOptionId: "b", feedback: "The evidence calls for systematic inspection from source through filter, pressure, laterals, emitters, and field wetting before a schedule adjustment." },
      { id: "drip-q3", prompt: "What record best supports the next maintenance decision?", options: [{ id: "a", label: "Only the total irrigation time" }, { id: "b", label: "Filter state, pressure, far-end flow, leak or clog findings, flushing action, wetting check, and next inspection date" }, { id: "c", label: "A note that the system was repaired" }, { id: "d", label: "The crop variety only" }], correctOptionId: "b", feedback: "A traceable maintenance record connects a delivery observation to corrective action and confirms whether field uniformity changed." },
    ],
  },
  "harvest-quality-and-food-safety-decision": {
    id: "harvest-quality-and-food-safety-decision",
    moduleId: "harvesting-and-post-harvest-handling",
    title: "Scenario: Protect market quality and food safety at harvest",
    context: "A team is harvesting mixed-maturity vegetables into rough containers at midday. Filled containers are waiting in direct sun, washing water has not been checked, and a recent crop-protection application has no verified interval record.",
    decisionPrompt: "Protect quality and food safety at every hand-off rather than relying on downstream sorting.",
    evidenceChecklist: ["Crop-specific maturity and market criteria", "Harvest time, handling tools, and container condition", "Shade, cleaning, cooling, sorting, and defect control", "Water safety, hygiene, and any applicable pre-harvest interval record"],
    reflectionPrompt: "Which hand-off is most likely to cause preventable loss, and what observation will verify the correction?",
    questions: [
      { id: "harvest-q1", prompt: "What should determine whether a crop is harvested now?", options: [{ id: "a", label: "Container availability alone" }, { id: "b", label: "Crop-specific maturity and market-readiness evidence, with a suitable harvest-time plan" }, { id: "c", label: "Whether the team has spare labour" }, { id: "d", label: "The expectation that grading will remove poor produce" }], correctOptionId: "b", feedback: "Harvest timing begins with crop maturity and market readiness. Later sorting cannot restore quality lost by premature, overmature, or heat-damaged harvest." },
      { id: "harvest-q2", prompt: "Which first handling adjustment best protects produce quality?", options: [{ id: "a", label: "Leave full containers in sun until washing begins" }, { id: "b", label: "Use clean, low-injury containers and move harvested produce promptly into shade with a crop-suitable handling sequence" }, { id: "c", label: "Wash all produce in unverified water to cool it quickly" }, { id: "d", label: "Mix damaged and sound produce to save time" }], correctOptionId: "b", feedback: "Gentle containers and prompt shade reduce mechanical and heat injury. Water and cleaning must be suitable for the crop and food-safety context." },
      { id: "harvest-q3", prompt: "What must be resolved before the crop enters the market chain?", options: [{ id: "a", label: "The team’s preferred sorting order" }, { id: "b", label: "Verified applicable interval, hygiene and water controls, alongside the maturity and defect record" }, { id: "c", label: "Only the expected sale price" }, { id: "d", label: "A plan to remove all labels from containers" }], correctOptionId: "b", feedback: "Food-safety controls and applicable crop-protection intervals are decision conditions, not optional paperwork after harvest." },
    ],
  },
  "qualified-field-diagnosis-decision": {
    id: "qualified-field-diagnosis-decision",
    moduleId: "field-diagnosis-in-vegetable-crops",
    title: "Scenario: Make a qualified diagnosis before recommending intervention",
    context: "A vegetable crop has patchy yellowing and stunting after both a new irrigation pattern and a recent input change. Symptoms appear in a low area, but some affected plants also have weak roots. The grower requests a certain diagnosis and immediate product recommendation.",
    decisionPrompt: "Separate observation from assumption, compare plausible causes, and set a safe verification step.",
    evidenceChecklist: ["Affected and healthy comparison plants", "Symptoms, signs, roots, incidence, severity, and field pattern", "Irrigation, weather, soil, and recent input history", "Uncertainty, safe next observation, and escalation trigger"],
    reflectionPrompt: "What finding would shift your leading explanation, and when would you escalate for specialist support?",
    questions: [
      { id: "diagnosis-q1", prompt: "What is the strongest first diagnostic approach?", options: [{ id: "a", label: "Name a single disease from yellow leaves alone" }, { id: "b", label: "Compare affected and healthy areas, inspect roots and plant parts, map the pattern, and review water and input history" }, { id: "c", label: "Apply a broad product before taking notes" }, { id: "d", label: "Ignore the low-area pattern because symptoms are visible elsewhere" }], correctOptionId: "b", feedback: "A qualified diagnosis uses multiple observations and competing explanations. Yellowing and stunting alone do not prove one cause." },
      { id: "diagnosis-q2", prompt: "Which recommendation best handles the evidence currently available?", options: [{ id: "a", label: "Guarantee a disease diagnosis and recommend an input" }, { id: "b", label: "State the uncertainty, correct or test the most plausible field constraint safely, and set a specific follow-up observation" }, { id: "c", label: "Treat all plants the same without comparing zones" }, { id: "d", label: "Wait without recording any further evidence" }], correctOptionId: "b", feedback: "The advisor should name the evidence limit, take a low-risk verification step, and specify what would trigger revision or escalation." },
      { id: "diagnosis-q3", prompt: "Which record makes later diagnosis more defensible?", options: [{ id: "a", label: "A single label such as 'disease'" }, { id: "b", label: "Mapped pattern, healthy comparison, root and plant observations, recent practices, action, uncertainty, and follow-up trigger" }, { id: "c", label: "Only a photograph without field history" }, { id: "d", label: "Only the crop name" }], correctOptionId: "b", feedback: "A transparent field record preserves the observations, alternative explanations, and review condition behind an advisory recommendation." },
    ],
  },
  "disease-cycle-and-escalation-decision": {
    id: "disease-cycle-and-escalation-decision",
    moduleId: "disease-identification-and-management",
    title: "Scenario: Break a disease-conducive cycle before product escalation",
    context: "Wet weather coincides with spreading wilt and leaf spots. The field has overhead wetting, crop debris, and a recent planting from an uncertain material source. The grower wants an immediate product choice before signs, roots, field pattern, and look-alikes are examined.",
    decisionPrompt: "Verify the likely cause and interrupt spread pathways before any lawful, label-directed product decision.",
    evidenceChecklist: ["Symptoms, signs, affected plant part, roots, and field pattern", "Wetness, water movement, crop history, planting material, and sanitation", "Biotic and abiotic look-alikes, incidence, severity, and spread pathway", "Prevention, drainage, sanitation, resistant material, vector management, and constrained escalation"],
    reflectionPrompt: "Which spread pathway can be interrupted immediately, and which evidence would justify escalation?",
    questions: [
      { id: "disease-q1", prompt: "What should happen before selecting a disease-management product?", options: [{ id: "a", label: "Verify symptoms and signs, inspect roots and pattern, assess wetness and history, and rule out relevant look-alikes" }, { id: "b", label: "Assume all wilt after rain has the same cause" }, { id: "c", label: "Choose a product based on leaf colour only" }, { id: "d", label: "Ignore the source of planting material" }], correctOptionId: "a", feedback: "Disease management begins with qualified diagnosis. Plant part, signs, roots, pattern, wetness, and history help distinguish disease from abiotic constraints." },
      { id: "disease-q2", prompt: "Which first response best interrupts a likely disease-conducive cycle?", options: [{ id: "a", label: "Maintain wet foliage and leave debris in place" }, { id: "b", label: "Improve sanitation and water management, reduce spread conditions, and continue targeted monitoring" }, { id: "c", label: "Delay all field observations until the crop fails" }, { id: "d", label: "Mix uncertain inputs without checking compatibility" }], correctOptionId: "b", feedback: "Prevention-led IPM addresses sanitation, water movement, material risk, and spread pathways while further evidence is collected." },
      { id: "disease-q3", prompt: "If escalation becomes justified, what remains essential?", options: [{ id: "a", label: "Use any available product immediately" }, { id: "b", label: "Use a lawful, crop- and target-appropriate, label-directed option with safety, interval, and review requirements" }, { id: "c", label: "Stop monitoring once a product is selected" }, { id: "d", label: "Treat diagnosis as unnecessary" }], correctOptionId: "b", feedback: "A product does not replace diagnosis or prevention. Legal fit, target specificity, label direction, safety, intervals, and outcome review remain required." },
    ],
  },
  "pesticide-stewardship-stop-decision": {
    id: "pesticide-stewardship-stop-decision",
    moduleId: "responsible-use-of-pesticides",
    title: "Scenario: Stop an unsafe spray decision",
    context: "A grower plans to use an unlabeled leftover product in heat and wind with a leaking, uncalibrated sprayer near a water source. The target has not been verified, personal protective equipment is incomplete, and no application or interval record is available.",
    decisionPrompt: "Stop the unsafe action and use the label, legal fit, people, water, equipment, weather, and record requirements as a complete decision check.",
    evidenceChecklist: ["Verified target and non-product alternatives", "Original label, registration, crop-target fit, active ingredient, and applicable interval", "PPE, hygiene, measuring, mixing, and water-source protection", "Sprayer condition, nozzle choice, calibration, weather, coverage, and application record"],
    reflectionPrompt: "Which condition would allow the decision to move from 'stop' to a lawful, carefully controlled action?",
    questions: [
      { id: "pesticide-q1", prompt: "What is the correct immediate decision?", options: [{ id: "a", label: "Proceed quickly before wind increases" }, { id: "b", label: "Stop: the target, label and legal fit, weather, PPE, water protection, and equipment conditions do not yet support application" }, { id: "c", label: "Use the leftover product at a lower rate" }, { id: "d", label: "Spray only near the water source" }], correctOptionId: "b", feedback: "An unlabeled product, unverified target, unsafe weather, incomplete PPE, water risk, and faulty equipment are separate reasons not to proceed." },
      { id: "pesticide-q2", prompt: "Which check must be completed before a product is even considered?", options: [{ id: "a", label: "Confirm the target and lawful crop-target product fit from the original label and applicable requirements" }, { id: "b", label: "Choose the strongest smell or colour" }, { id: "c", label: "Assume leftovers remain suitable" }, { id: "d", label: "Ignore interval information if harvest is near" }], correctOptionId: "a", feedback: "Responsible use starts with verified need and lawful, label-directed fit. An unlabeled or unsuitable leftover product is not a defensible option." },
      { id: "pesticide-q3", prompt: "What equipment and conditions must be addressed before a lawful application?", options: [{ id: "a", label: "Only the tank volume" }, { id: "b", label: "Leak repair, suitable nozzle and calibration, weather fit, PPE and hygiene, water protection, and a complete application record" }, { id: "c", label: "Faster walking speed" }, { id: "d", label: "A higher pressure without calibration" }], correctOptionId: "b", feedback: "Safe, effective stewardship connects maintained calibrated equipment with weather, people, water, label direction, and traceable records." },
    ],
  },
  "weed-persistence-and-control-decision": {
    id: "weed-persistence-and-control-decision",
    moduleId: "weed-management",
    title: "Scenario: Break a weed competition and persistence cycle",
    context: "A direct-seeded tomato field has early weed patches, flowering purslane, triangular-stem weeds, and persistent nutsedge. The grower wants one late, blanket response without mapping density, crop stage, weed type, weather, or the persistence mechanism.",
    decisionPrompt: "Control the critical interference risk and persistence mechanism rather than only visible top growth.",
    evidenceChecklist: ["1 m² sample, field map, density, crop stage, and interference risk", "Weed morphology, flowering, seed, tuber, rhizome, or other persistence evidence", "Alternative-host, residue, mulch, tillage, hand-removal, and sanitation options", "Any justified product’s lawful label, weather, drift, nozzle, pressure, and equipment safeguards"],
    reflectionPrompt: "Which persistence mechanism should guide the first control sequence, and what would show the strategy is working?",
    questions: [
      { id: "weed-q1", prompt: "What should guide the first weed-management decision?", options: [{ id: "a", label: "A blanket action without identifying weeds" }, { id: "b", label: "A mapped sample of density and crop stage, with morphology and seed or underground persistence evidence" }, { id: "c", label: "The assumption that all weeds persist in the same way" }, { id: "d", label: "Only the crop variety" }], correctOptionId: "b", feedback: "Density, crop-stage interference, weed identity, and persistence mechanism determine the timing and combination of controls." },
      { id: "weed-q2", prompt: "Which response best fits flowering weeds and persistent nutsedge risk?", options: [{ id: "a", label: "Delay action until every weed is mature" }, { id: "b", label: "Use timely, targeted physical and cultural actions that prevent seed set and address underground persistence, then review the field pattern" }, { id: "c", label: "Remove visible leaves only and ignore tubers" }, { id: "d", label: "Treat all control methods as identical" }], correctOptionId: "b", feedback: "Weed control should prevent seed production and address persistence mechanisms such as tubers, while fitting crop stage and field conditions." },
      { id: "weed-q3", prompt: "If a herbicide decision is justified, what condition remains essential?", options: [{ id: "a", label: "Use it without checking weather or equipment" }, { id: "b", label: "Use only a lawful, label-directed option with crop and target fit, drift and weather safeguards, suitable nozzle and pressure, and maintained equipment" }, { id: "c", label: "Apply over flowering weeds because speed is all that matters" }, { id: "d", label: "Skip the follow-up weed sample" }], correctOptionId: "b", feedback: "Any herbicide action is constrained by label, target and crop fit, weather, drift, nozzle, pressure, equipment, and outcome review." },
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
