export type PesticideIncidentDrillStage = {
  id: string;
  title: string;
  shortTitle: string;
  moduleIds: readonly string[];
  purpose: string;
  risk: string;
  doNow: readonly string[];
  protect: readonly string[];
  record: readonly string[];
  boundary: string;
  followUp: string;
  sourceBasis: string;
};

export const pesticideIncidentDrillStages: readonly PesticideIncidentDrillStage[] = [
  {
    id: "recognise-and-stop",
    title: "Recognise the incident and stop unsafe work",
    shortTitle: "Recognise and stop",
    moduleIds: ["responsible-use-of-pesticides", "integrated-pest-management"],
    purpose: "Use observable evidence to stop an unsafe pesticide activity, release, equipment failure, exposure concern, or near miss before it becomes a larger incident.",
    risk: "Continuing to spray, mix, repair, transport, or approach a problem without verified protection can increase exposure, drift, contamination, crop damage, and confusion about what occurred.",
    doNow: ["Stop the task and do not restart it merely to finish the job or use up a prepared product.", "Keep people away from the affected area and avoid taking actions that could increase personal exposure or spread material.", "Identify the product container or current label only if it can be done without entering an unsafe situation; preserve product identification for authorised responders."],
    protect: ["Treat people, water, edible crops, non-target organisms, equipment, and sensitive areas as connected risks.", "Do not use an unlabeled, uncertain, expired, leaking, or incompatible product as a shortcut to resolve the situation.", "Do not replace the incident response with an unverified pesticide, household remedy, or improvised cleanup instruction."],
    record: ["Date, time, location or field zone, crop, task, and person who identified the concern", "Visible condition: leak, equipment fault, weather, water proximity, product identification status, or exposure concern", "What was stopped, who was kept clear, and which current label or official instruction was available"],
    boundary: "This drill teaches recognition and escalation, not medical treatment, spill-cleanup technique, product disposal, or legal reporting requirements. Use the current product label, safety information, and authorised local emergency, medical, environmental, or employer channels for those directions.",
    followUp: "Do not resume the task until the product, target, label, people, water, equipment, weather, and required corrective action can be verified together.",
    sourceBasis: "Modules 32 and 33: prevention-led IPM, label literacy, legal crop-target fit, hazard communication, PPE, weather, water-source protection, equipment inspection, and lawful stewardship.",
  },
  {
    id: "protect-people-water-and-area",
    title: "Protect people, water, and the affected area",
    shortTitle: "Protect people and water",
    moduleIds: ["responsible-use-of-pesticides", "water-management"],
    purpose: "Prioritise exposure prevention and prevent a local concern from spreading toward people, water sources, produce, field drains, or non-target areas.",
    risk: "A pesticide incident can become more serious when access, water pathways, weather, equipment condition, or nearby crop and people are ignored.",
    doNow: ["Prevent additional work, entry, or movement through the affected area unless an authorised current instruction says otherwise.", "Identify nearby water sources, drains, conveyance routes, sensitive crops, livestock areas, people, and likely weather or wind pathways without entering an unsafe area.", "Use the current label and authorised site procedures to identify the required protective, access-control, and escalation actions."],
    protect: ["Keep water-source protection and food-safety concerns visible; do not assume a release is harmless because the amount or product is uncertain.", "Avoid moving contaminated tools, containers, clothing, water, soil, or crop material between zones without authorised direction.", "Avoid directing unprotected bystanders to investigate, collect evidence, or continue field operations nearby."],
    record: ["Known or possible pathways to water, drainage, crop, people, or sensitive areas", "Weather and wind observation, field slope or water movement, and equipment condition", "Access-control action, persons notified, and current official or site instruction consulted"],
    boundary: "The pack does not prescribe containment materials, cleanup steps, disposal, decontamination, or regulatory thresholds. Those actions must follow the current product label, safety information, employer procedure, and authorised local direction.",
    followUp: "Reassess the area only through the authorised response process and record the basis for reopening, cleaning, inspection, or referral decisions.",
    sourceBasis: "Modules 23 and 33: safe water sources, water-source protection, label requirements, weather awareness, equipment condition, PPE, and responsible pesticide use.",
  },
  {
    id: "label-led-escalation",
    title: "Use label-led escalation and current authorised channels",
    shortTitle: "Label-led escalation",
    moduleIds: ["responsible-use-of-pesticides"],
    purpose: "Move from uncertainty to the current official response path by identifying the product, consulting its current label and safety information, and contacting the appropriate authorised channel.",
    risk: "A product name remembered from memory, an outdated instruction, or a generic emergency script can lead to harmful decisions when the actual formulation, hazard, exposure, or legal requirement differs.",
    doNow: ["Locate the current product label and safety information without entering an unsafe situation or delaying urgent authorised emergency or medical support.", "Provide responders with accurate product identification, task, location, time, known exposure concern, water or crop proximity, and actions already taken.", "Follow the current label and authorised medical, emergency, environmental, employer, supplier, or extension channel appropriate to the actual incident."],
    protect: ["Do not diagnose symptoms, recommend medication, induce any response, or give first-aid details from memory within this training resource.", "Do not rely on course content as current legal approval, product registration, re-entry, interval, or emergency-response information.", "Do not resume application because a target appears urgent; verified safety and lawful fit remain prerequisites."],
    record: ["Product trade name, active ingredient or formulation details only as shown on the available label", "Label or safety-information version/date if visible and contact or channel used", "Facts reported, advice received, time of referral, and any explicit authorised next action"],
    boundary: "If there is an exposure concern or immediate danger, use the current product label and local authorised emergency or medical channels without delay. This resource deliberately does not replace their instructions.",
    followUp: "Verify that product, target, law, label, people, water, equipment, weather, and record requirements all agree before any later work is considered.",
    sourceBasis: "Module 33: label literacy, legal product fit, hazard communication, PPE, hygiene, weather-aware timing, water-source protection, calibration, and record-led stewardship.",
  },
  {
    id: "document-review-and-prevent-recurrence",
    title: "Document, review, and prevent recurrence",
    shortTitle: "Document and review",
    moduleIds: ["responsible-use-of-pesticides", "integrated-pest-management", "field-diagnosis-in-vegetable-crops"],
    purpose: "Create a factual incident record, review contributing conditions, and strengthen prevention, monitoring, equipment, and decision boundaries before the next field operation.",
    risk: "When an incident is not recorded and reviewed, the same fault, product confusion, weather decision, water pathway, equipment problem, or pressure to act can repeat.",
    doNow: ["Record facts rather than assumptions: what was observed, what was stopped, the product identification status, people and water pathways, equipment condition, and current instruction received.", "Separate known evidence from uncertainty and identify any point where the work should have stopped earlier.", "Review IPM alternatives, diagnosis, equipment maintenance, storage, label access, training, and communication before planning a future action."],
    protect: ["Do not change records to make a decision appear compliant after the event.", "Do not convert a near miss into a routine spray decision without resolving the underlying product, people, water, equipment, weather, or record gap.", "Protect confidentiality and share incident information only through the appropriate authorised farm, employer, emergency, environmental, medical, supplier, or regulatory channel."],
    record: ["Chronology, field zone, task, product identification, people present, weather, water or sensitive-area pathway, and equipment condition", "Observed exposure or release concern, notifications, label/safety information consulted, and authorised directions", "Root cause or uncertainty, corrective action, responsible person, verification date, and training or maintenance follow-up"],
    boundary: "This review supports prevention and traceability. It is not a substitute for an official investigation, laboratory result, medical record, environmental assessment, legal report, or employer procedure.",
    followUp: "Use the completed record to update equipment checks, label access, field planning, IPM alternatives, training, and escalation readiness; then verify the corrective action before the next use.",
    sourceBasis: "Modules 29, 32, and 33: evidence-led diagnosis, prevention-monitoring-intervention-review, product stewardship, equipment maintenance, safety, records, and resistance-aware IPM.",
  },
] as const;

export const pesticideIncidentDrillByModuleId = Object.fromEntries(
  Array.from(new Set(pesticideIncidentDrillStages.flatMap(stage => stage.moduleIds))).map(moduleId => [
    moduleId,
    pesticideIncidentDrillStages.filter(stage => stage.moduleIds.includes(moduleId)),
  ])
) as Readonly<Record<string, readonly PesticideIncidentDrillStage[]>>;

export function getPesticideIncidentDrillStage(stageId: string | undefined) {
  return pesticideIncidentDrillStages.find(stage => stage.id === stageId) ?? pesticideIncidentDrillStages[0];
}
