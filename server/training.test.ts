import { describe, expect, it } from "vitest";
import { cropAdvisorCourse } from "../shared/curriculum";
import { documentModuleFieldBriefs } from "../shared/moduleFieldBriefs";
import { documentAssessmentAlignment } from "../shared/assessmentAlignment";
import { moduleVisuals } from "../shared/moduleVisuals";
import { fieldInquirySourceBasis, getFieldInquiryStudio } from "../shared/fieldInquiryStudio";
import { fieldRecordByModuleId, fieldRecordTemplates } from "../shared/fieldRecordTemplates";
import { createEmptyFieldRecordPayload, MAX_FIELD_RECORD_ENTRIES, MAX_FIELD_RECORD_TITLE_LENGTH } from "../shared/digitalFieldRecords";
import { createFieldRecordPdf } from "../client/src/lib/fieldRecordPdf";
import { getSavedRecordListState } from "../client/src/lib/fieldRecordViewState";
import { fieldRecordDraftStorageKey, parseFieldRecordDraft } from "../client/src/lib/fieldRecordDrafts";
import { comparisonSetupFields, toggleComparisonSelection } from "../client/src/lib/fieldRecordComparison";
import { appliedScenarioByModuleId, appliedScenarios, scoreAppliedScenario } from "../shared/appliedScenarios";
import { fieldMeasurementCards, fieldMeasurementCardsByModuleId, getFieldMeasurementCard } from "../shared/fieldMeasurementCards";
import { getNurseryToStandQualityRoutine, nurseryToStandQualityByModuleId, nurseryToStandQualityRoutines } from "../shared/nurseryToStandQuality";
import { getPesticideIncidentDrillStage, pesticideIncidentDrillByModuleId, pesticideIncidentDrillStages } from "../shared/pesticideIncidentDrill";
import { getQuantifiedScoutingStage, quantifiedScoutingByModuleId, quantifiedScoutingStages } from "../shared/quantifiedScoutingProtocol";
import { quantifiedScoutingSheet } from "../shared/quantifiedScoutingSheet";
import { annotationDashboardNotificationRequirements, annotationLabelOptions, annotationSupervisorReviewCriteria, annotationSupervisorReviewRequirements, cropDiagnosisAnnotationByModuleId, cropDiagnosisAnnotationCases, isUnreadAnnotationFeedbackForLearner, sortAnnotationReviewNotifications } from "../shared/cropDiagnosisAnnotation";
import { competencyDomains, competencyPerformanceLevels, moduleCompetencies, moduleCompetencyByModuleId } from "../shared/competencyFramework";
import { competencyScoreOptions, competencyScoringRequirements, createEmptyCompetencyScorecard } from "../shared/competencyScoring";
import { supervisorCalibrationGuide } from "../shared/supervisorCalibration";
import {
  capstoneCases,
  createEmptyCapstoneSubmissionPayload,
  createEmptyFieldPracticumPayload,
  fieldReadinessResources,
  fieldReadinessRubric,
  localIntelligenceSteps,
  fieldPracticumFields,
  fieldReadinessRequirements,
  isCompleteCapstoneSubmission,
  isCompleteFieldPracticum,
} from "../shared/fieldReadiness";
import {
  buildTrainingOverview,
  isAssessmentAccessible,
  isLessonAccessible,
  scoreAssessment,
  shouldIssueCertificate,
  shouldNotifyOwnerOfCertification,
} from "../shared/trainingLogic";

describe("crop-advisor progression", () => {
  it("expands advisory practice with a grower-centred consultation and referral sequence without changing its formal threshold", () => {
    const advisoryPractice = cropAdvisorCourse.modules.find(module => module.id === "advisory-practice")!;
    const lessonIds = advisoryPractice.lessons.map(lesson => lesson.id);
    const allSections = advisoryPractice.lessons.flatMap(lesson => lesson.sections);
    const fieldBrief = documentModuleFieldBriefs[advisoryPractice.id];

    expect(lessonIds).toEqual(["observe-frame-decide", "stewardship-records", "consult-handover-and-refer"]);
    expect(allSections.some(section => section.heading.includes("Sort the evidence"))).toBe(true);
    expect(allSections.some(section => section.heading.includes("Refer with a useful factual brief"))).toBe(true);
    expect(fieldBrief.evidence).toContain("Grower objective");
    expect(fieldBrief.standard).toContain("pause, review, specialist support");
    expect(advisoryPractice.assessment.passMark).toBe(80);
    expect(advisoryPractice.assessment.questions).toHaveLength(4);
  });

  it("expands soil and nutrition with a matched-zone root-zone evidence sequence without prescribing inputs", () => {
    const soilAndNutrition = cropAdvisorCourse.modules.find(module => module.id === "soil-and-nutrition")!;
    const lessonIds = soilAndNutrition.lessons.map(lesson => lesson.id);
    const allSections = soilAndNutrition.lessons.flatMap(lesson => lesson.sections);
    const fieldBrief = documentModuleFieldBriefs[soilAndNutrition.id];

    expect(lessonIds).toEqual(["soil-profile-context", "sampling-to-recommendation", "root-zone-evidence-sequence"]);
    expect(allSections.some(section => section.heading.includes("Frame the root-zone question"))).toBe(true);
    expect(allSections.some(section => section.heading.includes("Compare matched field positions"))).toBe(true);
    expect(allSections.some(section => section.heading.includes("Set the next evidence and review boundary"))).toBe(true);
    expect(fieldBrief.evidence).toContain("root distribution");
    expect(fieldBrief.standard).toContain("root-zone evidence");
    expect(soilAndNutrition.assessment.passMark).toBe(80);
    expect(soilAndNutrition.assessment.questions).toHaveLength(4);
  });

  it("adds a source-grounded Field Inquiry Studio to every module without changing formal progression", () => {
    expect(fieldInquirySourceBasis).toContain("FAO Farmer Field School");
    cropAdvisorCourse.modules.forEach(module => {
      const studio = getFieldInquiryStudio(module.id);
      const brief = documentModuleFieldBriefs[module.id];
      expect(studio).toBeDefined();
      expect(studio?.fieldSignal).toBe(brief.context);
      expect(studio?.stages.map(stage => stage.id)).toEqual(["frame", "observe", "interpret", "decide", "recheck"]);
      expect(studio?.stages.every(stage => stage.learnerPrompt.length > 60)).toBe(true);
      expect(studio?.rehearsalQuestions).toHaveLength(3);
      expect(studio?.nonGatingBoundary).toContain("80% formal assessment rule");
      expect(studio?.safetyBoundary.length).toBeGreaterThan(60);
    });
  });

  it("applies the complete field-brief and semantic assessment standard to the first three foundation modules", () => {
    const foundationModules = cropAdvisorCourse.modules.filter(module => module.index <= 3);
    const finalItems = new Map(
      cropAdvisorCourse.finalAssessment.questions.map(question => [question.id, question])
    );

    expect(foundationModules).toHaveLength(3);
    foundationModules.forEach(module => {
      const brief = documentModuleFieldBriefs[module.id];
      const alignment = documentAssessmentAlignment[module.id];
      const finalCompetency = finalItems.get(`final-${module.index + 1}`);

      expect(brief).toBeDefined();
      expect(brief.context.length).toBeGreaterThan(40);
      expect(brief.task.length).toBeGreaterThan(40);
      expect(brief.evidence.length).toBeGreaterThan(40);
      expect(brief.standard.length).toBeGreaterThan(40);
      expect(module.assessment.questions).toHaveLength(4);
      expect(module.assessment.passMark).toBe(80);
      expect(alignment).toBeDefined();
      expect(
        module.assessment.questions.some(question =>
          question.prompt.toLowerCase().includes(alignment.moduleAssessmentAnchor)
        )
      ).toBe(true);
      expect(finalCompetency?.prompt.toLowerCase()).toContain(alignment.finalCompetencyAnchor);
    });
  });

  it("maps every course module to an observable competency with evidence, criteria, remediation, and a safe field boundary", () => {
    expect(moduleCompetencies).toHaveLength(cropAdvisorCourse.modules.length);
    expect(competencyPerformanceLevels.map(level => level.id)).toEqual(["prepare", "perform", "review-refer"]);
    cropAdvisorCourse.modules.forEach(module => {
      const competency = moduleCompetencyByModuleId[module.id];
      expect(competency).toBeDefined();
      expect(competencyDomains.some(domain => domain.id === competency.domainId)).toBe(true);
      expect(competency.competencyStatement.length).toBeGreaterThan(60);
      expect(competency.performanceTask.length).toBeGreaterThan(40);
      expect(competency.evidence.length).toBeGreaterThan(40);
      expect(competency.criteria).toHaveLength(3);
      expect(competency.criteria.every(criterion => criterion.length > 15)).toBe(true);
      expect(competency.remediationFocus.length).toBeGreaterThan(35);
      expect(competency.safetyBoundary.length).toBeGreaterThan(60);
    });
  });

  it("defines supervisor scorecards for each competency level without changing formal progression rules", () => {
    const scorecard = createEmptyCompetencyScorecard();
    expect(Object.keys(scorecard)).toEqual(competencyPerformanceLevels.map(level => level.id));
    expect(Object.values(scorecard)).toEqual(["not_yet", "not_yet", "not_yet"]);
    expect(competencyScoreOptions.map(option => option.id)).toEqual(["not_yet", "developing", "demonstrated"]);
    expect(competencyScoringRequirements.minimumEvidenceSummaryLength).toBeGreaterThanOrEqual(80);
    expect(competencyScoringRequirements.minimumSupervisorFeedbackLength).toBeGreaterThanOrEqual(40);
    expect(competencyScoringRequirements.nonGatingBoundary).toContain("does not change module assessment scores");
    expect(competencyScoringRequirements.maximumEvidencePhotos).toBe(4);
    expect(competencyScoringRequirements.acceptedEvidencePhotoTypes).toContain("image/jpeg");
  });

  it("extends decision practice and supports consistent supervisor calibration without relaxing evidence boundaries", () => {
    expect(Object.keys(appliedScenarios)).toHaveLength(16);
    const extendedModules = ["crop-observation", "irrigation-systems", "nutrient-management", "harvesting-and-post-harvest-handling", "insect-pests-and-mites-identification-and-management", "soil-degradation-and-management", "nursery-for-vegetable-production"];
    expect(Object.values(appliedScenarios).filter(scenario => extendedModules.includes(scenario.moduleId))).toHaveLength(8);
    expect(supervisorCalibrationGuide.anchors.map(anchor => anchor.level)).toEqual(["Prepare", "Perform", "Review and refer"]);
    expect(supervisorCalibrationGuide.safeguards.join(" ")).toContain("authorised");
  });

  it("provides a distinct accessible instructional visual for every course module", () => {
    const visualSources = cropAdvisorCourse.modules.map(module => moduleVisuals[module.id]?.src);

    expect(Object.keys(moduleVisuals)).toHaveLength(34);
    expect(cropAdvisorCourse.modules).toHaveLength(34);
    expect(new Set(visualSources).size).toBe(34);
    cropAdvisorCourse.modules.forEach(module => {
      const visual = moduleVisuals[module.id];
      expect(visual).toBeDefined();
      expect(visual.src).toMatch(/^\/manus-storage\/module-\d{2}-.+\.jpg$/);
      expect(visual.alt.length).toBeGreaterThan(40);
      expect(visual.caption.length).toBeGreaterThan(40);
    });
  });

  it("provides exactly three printable, decision-focused field records for water, fertilisation, and IPM", () => {
    const expectedModuleIds = ["water-management", "vegetable-fertilisation", "integrated-pest-management"];
    const expectedRecordIds = ["water-management-record", "fertilisation-record", "integrated-pest-management-record"];

    expect(Object.keys(fieldRecordTemplates)).toEqual(expectedRecordIds);
    expect(Object.keys(fieldRecordByModuleId)).toEqual(expectedModuleIds);
    expectedModuleIds.forEach(moduleId => {
      const record = fieldRecordByModuleId[moduleId];
      expect(record).toBeDefined();
      expect(cropAdvisorCourse.modules.some(module => module.id === record.moduleId)).toBe(true);
      expect(record.setupFields.length).toBeGreaterThanOrEqual(5);
      expect(record.recordColumns.length).toBe(6);
      expect(record.reviewPrompts).toHaveLength(2);
      expect(record.safetyNote.length).toBeGreaterThan(100);
    });

    expect(fieldRecordTemplates["water-management-record"].recordColumns.join(" ")).toContain("Root-zone moisture");
    expect(fieldRecordTemplates["fertilisation-record"].recordColumns.join(" ")).toContain("Right rate");
    expect(fieldRecordTemplates["integrated-pest-management-record"].recordColumns.join(" ")).toContain("Beneficials");
  });

  it("creates template-aligned private digital record defaults with bounded entry capacity", () => {
    expect(MAX_FIELD_RECORD_ENTRIES).toBe(12);
    expect(MAX_FIELD_RECORD_TITLE_LENGTH).toBe(160);

    Object.values(fieldRecordTemplates).forEach(template => {
      const payload = createEmptyFieldRecordPayload(template);
      expect(Object.keys(payload.setup)).toEqual(template.setupFields);
      expect(payload.entries).toHaveLength(3);
      payload.entries.forEach(entry => expect(Object.keys(entry)).toEqual(template.recordColumns));
      expect(payload.review).toEqual(template.reviewPrompts.map(() => ""));
    });
  });

  it("builds a downloadable PDF document from a completed digital water record", async () => {
    const template = fieldRecordTemplates["water-management-record"];
    const payload = createEmptyFieldRecordPayload(template);
    payload.setup["Farm or grower"] = "Learner demonstration field";
    payload.entries[0]["Date / time"] = "2026-08-24 07:00";
    payload.entries[0]["Rainfall or irrigation event"] = "Checked after irrigation";
    const pdf = await createFieldRecordPdf({ template, title: "Water review", payload, exportedAt: new Date("2026-08-24T07:00:00Z") });
    const header = new TextDecoder().decode(new Uint8Array(pdf.output("arraybuffer") as ArrayBuffer).slice(0, 4));

    expect(header).toBe("%PDF");
  });

  it("keeps failed saved-record loading distinct from an empty record list", () => {
    expect(getSavedRecordListState({ isLoading: true, isError: false, recordCount: 0 })).toBe("loading");
    expect(getSavedRecordListState({ isLoading: false, isError: true, recordCount: 0 })).toBe("error");
    expect(getSavedRecordListState({ isLoading: false, isError: false, recordCount: 0 })).toBe("empty");
    expect(getSavedRecordListState({ isLoading: false, isError: false, recordCount: 1 })).toBe("ready");
  });

  it("provides sixteen source-aligned scenario practices for core and high-risk advisory decisions without changing formal assessment rules", () => {
    expect(Object.keys(appliedScenarios)).toEqual([
      "water-root-zone-decision",
      "fertilisation-limiting-factor-decision",
      "ipm-scout-to-action-decision",
      "drip-uniformity-and-water-quality-decision",
      "harvest-quality-and-food-safety-decision",
      "qualified-field-diagnosis-decision",
      "disease-cycle-and-escalation-decision",
      "pesticide-stewardship-stop-decision",
      "weed-persistence-and-control-decision",
      "diagnosis-pattern-triage",
      "irrigation-source-performance-decision",
      "nutrient-evidence-and-loss-risk",
      "harvest-traceability-handoff",
      "pest-beneficial-evidence-decision",
      "soil-protection-runoff-decision",
      "nursery-batch-readiness-decision",
    ]);
    expect(Object.keys(appliedScenarioByModuleId)).toEqual(expect.arrayContaining([
      "water-management",
      "vegetable-fertilisation",
      "integrated-pest-management",
      "drip-irrigation-system",
      "harvesting-and-post-harvest-handling",
      "field-diagnosis-in-vegetable-crops",
      "disease-identification-and-management",
      "responsible-use-of-pesticides",
      "soil-degradation-and-management",
      "nursery-for-vegetable-production",
      "weed-management",
      "crop-observation",
      "irrigation-systems",
      "nutrient-management",
      "insect-pests-and-mites-identification-and-management",
    ]));
    Object.values(appliedScenarios).forEach(scenario => {
      expect(cropAdvisorCourse.modules.some(module => module.id === scenario.moduleId)).toBe(true);
      expect(scenario.questions).toHaveLength(3);
      expect(scenario.evidenceChecklist.length).toBeGreaterThanOrEqual(4);
      const perfectAnswers = Object.fromEntries(scenario.questions.map(question => [question.id, question.correctOptionId]));
      expect(scoreAppliedScenario(scenario, perfectAnswers)).toMatchObject({ score: 100, passed: true, correctCount: 3 });
      expect(scoreAppliedScenario(scenario, {}).passed).toBe(false);
    });
    expect(appliedScenarios["pesticide-stewardship-stop-decision"].questions[0].options.find(option => option.id === "b")?.label).toContain("Stop");
    expect(appliedScenarios["harvest-quality-and-food-safety-decision"].evidenceChecklist.join(" ")).toContain("interval");
    expect(appliedScenarios["disease-cycle-and-escalation-decision"].questions[2].feedback).toContain("Legal fit");
    expect(appliedScenarios["weed-persistence-and-control-decision"].evidenceChecklist.join(" ")).toContain("drift");
  });

  it("provides six source-grounded measurement and decision routines with evidence, review, and referral boundaries", () => {
    expect(fieldMeasurementCards.map(card => card.id)).toEqual([
      "representative-soil-sample-chain",
      "root-zone-moisture-and-air-check",
      "water-quality-screen",
      "drip-uniformity-check",
      "nutrient-plan-evidence-check",
      "sprayer-pre-use-and-calibration-check",
    ]);
    fieldMeasurementCards.forEach(card => {
      expect(card.prepare.length).toBeGreaterThanOrEqual(3);
      expect(card.routine.length).toBeGreaterThanOrEqual(3);
      expect(card.record.length).toBeGreaterThanOrEqual(4);
      expect(card.decide.length).toBeGreaterThanOrEqual(3);
      expect(card.review.length).toBeGreaterThan(80);
      expect(card.refer.length).toBeGreaterThan(80);
      card.moduleIds.forEach(moduleId => expect(cropAdvisorCourse.modules.some(module => module.id === moduleId)).toBe(true));
    });
    expect(fieldMeasurementCardsByModuleId["water-management"].map(card => card.id)).toEqual(["root-zone-moisture-and-air-check", "water-quality-screen"]);
    expect(fieldMeasurementCardsByModuleId["responsible-use-of-pesticides"][0].shortTitle).toBe("Sprayer safety check");
    expect(getFieldMeasurementCard("missing-card").id).toBe("representative-soil-sample-chain");
    expect(getFieldMeasurementCard("sprayer-pre-use-and-calibration-check").decide.join(" ")).toContain("Stop work");
  });

  it("provides four source-grounded nursery-to-stand quality routines with accept-or-hold and follow-up boundaries", () => {
    expect(nurseryToStandQualityRoutines.map(routine => routine.id)).toEqual([
      "seed-and-batch-traceability",
      "daily-nursery-hygiene-and-environment",
      "hardening-and-transplant-acceptance",
      "transplant-and-early-stand-recovery",
    ]);
    nurseryToStandQualityRoutines.forEach(routine => {
      expect(routine.prepare.length).toBeGreaterThanOrEqual(3);
      expect(routine.inspect.length).toBeGreaterThanOrEqual(3);
      expect(routine.acceptOrHold.length).toBeGreaterThanOrEqual(3);
      expect(routine.record.length).toBeGreaterThanOrEqual(4);
      expect(routine.followUp.length).toBeGreaterThan(80);
      expect(routine.refer.length).toBeGreaterThan(80);
      routine.moduleIds.forEach(moduleId => expect(cropAdvisorCourse.modules.some(module => module.id === moduleId)).toBe(true));
    });
    expect(nurseryToStandQualityByModuleId["nursery-for-vegetable-production"].map(routine => routine.id)).toEqual([
      "seed-and-batch-traceability",
      "daily-nursery-hygiene-and-environment",
    ]);
    expect(nurseryToStandQualityByModuleId.transplanting).toHaveLength(2);
    expect(getNurseryToStandQualityRoutine("missing-routine").id).toBe("seed-and-batch-traceability");
    expect(getNurseryToStandQualityRoutine("hardening-and-transplant-acceptance").acceptOrHold.join(" ")).toContain("Hold");
  });

  it("provides four label-led pesticide incident stages with explicit non-improvisation and referral boundaries", () => {
    expect(pesticideIncidentDrillStages.map(stage => stage.id)).toEqual([
      "recognise-and-stop",
      "protect-people-water-and-area",
      "label-led-escalation",
      "document-review-and-prevent-recurrence",
    ]);
    pesticideIncidentDrillStages.forEach(stage => {
      expect(stage.doNow.length).toBeGreaterThanOrEqual(3);
      expect(stage.protect.length).toBeGreaterThanOrEqual(3);
      expect(stage.record.length).toBeGreaterThanOrEqual(3);
      expect(stage.boundary.length).toBeGreaterThan(180);
      expect(stage.followUp.length).toBeGreaterThan(100);
      expect(stage.moduleIds.every(moduleId => cropAdvisorCourse.modules.some(module => module.id === moduleId))).toBe(true);
    });
    expect(pesticideIncidentDrillByModuleId["responsible-use-of-pesticides"]).toHaveLength(4);
    expect(pesticideIncidentDrillByModuleId["integrated-pest-management"].map(stage => stage.id)).toEqual([
      "recognise-and-stop",
      "document-review-and-prevent-recurrence",
    ]);
    expect(pesticideIncidentDrillByModuleId["water-management"][0].id).toBe("protect-people-water-and-area");
    expect(getPesticideIncidentDrillStage("missing-stage").id).toBe("recognise-and-stop");
    expect(getPesticideIncidentDrillStage("label-led-escalation").boundary).toContain("current product label");
  });

  it("provides four quantified scouting stages with comparable evidence, beneficial safeguards, review, and referral boundaries", () => {
    expect(quantifiedScoutingStages.map(stage => stage.id)).toEqual([
      "define-the-scouting-question-and-sample",
      "separate-pattern-cause-and-contributing-conditions",
      "protect-beneficials-and-measure-pest-pressure",
      "turn-scouting-into-a-reviewable-ipm-decision",
    ]);
    quantifiedScoutingStages.forEach(stage => {
      expect(stage.prepare.length).toBeGreaterThanOrEqual(3);
      expect(stage.observe.length).toBeGreaterThanOrEqual(3);
      expect(stage.quantify.length).toBeGreaterThanOrEqual(3);
      expect(stage.record.length).toBeGreaterThanOrEqual(3);
      expect(stage.decisionBoundary.length).toBeGreaterThan(180);
      expect(stage.review.length).toBeGreaterThan(100);
      expect(stage.refer.length).toBeGreaterThan(120);
      expect(stage.moduleIds.every(moduleId => cropAdvisorCourse.modules.some(module => module.id === moduleId))).toBe(true);
    });
    expect(quantifiedScoutingByModuleId["integrated-pest-management"]).toHaveLength(4);
    expect(quantifiedScoutingByModuleId["insect-pests-and-mites-identification-and-management"].map(stage => stage.id)).toEqual([
      "define-the-scouting-question-and-sample",
      "protect-beneficials-and-measure-pest-pressure",
    ]);
    expect(quantifiedScoutingByModuleId["weed-management"].map(stage => stage.id)).toContain("turn-scouting-into-a-reviewable-ipm-decision");
    expect(getQuantifiedScoutingStage("missing-stage").id).toBe("define-the-scouting-question-and-sample");
    expect(getQuantifiedScoutingStage("protect-beneficials-and-measure-pest-pressure").decisionBoundary).toContain("chemical control");
  });

  it("provides a printable quantified scouting sheet with complete sampling, observation, decision, review, and referral fields", () => {
    expect(quantifiedScoutingSheet.id).toBe("quantified-scouting-sheet");
    expect(quantifiedScoutingSheet.setupFields).toHaveLength(6);
    expect(quantifiedScoutingSheet.columns).toHaveLength(8);
    expect(quantifiedScoutingSheet.reviewPrompts).toHaveLength(3);
    expect(quantifiedScoutingSheet.useSteps).toHaveLength(4);
    expect(quantifiedScoutingSheet.linkedModuleIds).toEqual([
      "field-diagnosis-in-vegetable-crops",
      "disease-identification-and-management",
      "insect-pests-and-mites-identification-and-management",
      "integrated-pest-management",
      "weed-management",
    ]);
    expect(quantifiedScoutingSheet.linkedModuleIds.every(moduleId => cropAdvisorCourse.modules.some(module => module.id === moduleId))).toBe(true);
    expect(quantifiedScoutingSheet.columns.join(" ")).toContain("Incidence / severity");
    expect(quantifiedScoutingSheet.columns.join(" ")).toContain("Beneficials / traps");
    expect(quantifiedScoutingSheet.boundary).toContain("universal treatment threshold");
  });

  it("provides three simulated crop-diagnosis photo annotation cases that test evidence, uncertainty, and safe next steps rather than image-only diagnosis", () => {
    expect(cropDiagnosisAnnotationCases.map(caseItem => caseItem.id)).toEqual([
      "pattern-and-water-context",
      "leaf-symptoms-and-uncertainty",
      "injury-pests-and-beneficials",
    ]);
    expect(annotationLabelOptions.map(option => option.id)).toEqual([
      "field-pattern",
      "affected-unaffected",
      "symptom-sign",
      "pest-beneficial",
      "contributing-condition",
      "uncertainty",
    ]);
    cropDiagnosisAnnotationCases.forEach(caseItem => {
      expect(caseItem.imageSrc).toMatch(/^\/manus-storage\/diagnosis-case-.+\.jpg$/);
      expect(caseItem.alt.length).toBeGreaterThan(70);
      expect(caseItem.requiredLabels).toContain("uncertainty");
      expect(caseItem.options).toHaveLength(3);
      expect(caseItem.options.some(option => option.id === caseItem.correctOptionId)).toBe(true);
      expect(caseItem.visualWarning.toLowerCase()).toContain("not");
      expect(caseItem.safeNextStep.length).toBeGreaterThan(150);
      expect(caseItem.moduleIds.every(moduleId => cropAdvisorCourse.modules.some(module => module.id === moduleId))).toBe(true);
    });
    expect(cropDiagnosisAnnotationByModuleId["field-diagnosis-in-vegetable-crops"]).toBeDefined();
    expect(cropDiagnosisAnnotationByModuleId["disease-identification-and-management"].id).toBe("leaf-symptoms-and-uncertainty");
    expect(cropDiagnosisAnnotationByModuleId["integrated-pest-management"]).toBeDefined();
    expect(cropDiagnosisAnnotationCases[2].safeNextStep).toContain("beneficial");
  });

  it("defines secure, admin-only supervisor-review standards for completed annotation reasoning without changing formal learner gates", () => {
    expect(annotationSupervisorReviewRequirements.supervisorRole).toBe("admin");
    expect(annotationSupervisorReviewRequirements.minimumRationaleLength).toBe(80);
    expect(annotationSupervisorReviewRequirements.minimumFeedbackLength).toBe(20);
    expect(annotationSupervisorReviewRequirements.statuses).toEqual(["submitted", "reviewed", "revision_requested"]);
    expect(annotationSupervisorReviewRequirements.formalGateBoundary).toContain("does not alter lesson progression");
    expect(annotationSupervisorReviewCriteria).toHaveLength(3);
    expect(annotationSupervisorReviewCriteria.join(" ")).toContain("visible evidence from a confirmed cause");
    expect(annotationSupervisorReviewCriteria.join(" ")).toContain("unsupported treatment");
  });

  it("defines private learner dashboard notification states for supervisor feedback and revision requests", () => {
    expect(annotationDashboardNotificationRequirements.visibleStatuses).toEqual(["submitted", "reviewed", "revision_requested"]);
    expect(annotationDashboardNotificationRequirements.notifyStatuses).toEqual(["reviewed", "revision_requested"]);
    expect(annotationDashboardNotificationRequirements.readState).toBe("feedbackReadAt");
    expect(annotationDashboardNotificationRequirements.ordering).toBe("reviewedAt-or-submittedAt");
    expect(annotationDashboardNotificationRequirements.ownershipBoundary).toContain("authenticated account");
    expect(annotationDashboardNotificationRequirements.formalGateBoundary).toContain("do not alter lesson progression");
    const newerSupervisorFeedback = { submittedAt: new Date("2026-08-25T10:00:00Z"), reviewedAt: new Date("2026-08-25T12:00:00Z"), feedbackReadAt: null };
    const olderSupervisorFeedbackReadLater = { submittedAt: new Date("2026-08-25T08:00:00Z"), reviewedAt: new Date("2026-08-25T09:00:00Z"), feedbackReadAt: new Date("2026-08-25T15:00:00Z") };
    expect(sortAnnotationReviewNotifications([olderSupervisorFeedbackReadLater, newerSupervisorFeedback])).toEqual([newerSupervisorFeedback, olderSupervisorFeedbackReadLater]);
    const newerSupervisorFeedbackReadLater = { ...newerSupervisorFeedback, feedbackReadAt: new Date("2026-08-25T16:00:00Z") };
    expect(sortAnnotationReviewNotifications([olderSupervisorFeedbackReadLater, newerSupervisorFeedbackReadLater])).toEqual([newerSupervisorFeedbackReadLater, olderSupervisorFeedbackReadLater]);
  });

  it("limits learner read actions to requested, learner-owned feedback that remains unread", () => {
    const candidates = [
      { id: 11, userId: 73, feedback: "Review the comparison evidence.", feedbackReadAt: null },
      { id: 19, userId: 73, feedback: "Already seen feedback.", feedbackReadAt: new Date("2026-08-25T16:00:00Z") },
      { id: 23, userId: 73, feedback: null, feedbackReadAt: null },
      { id: 29, userId: 88, feedback: "Another learner's feedback.", feedbackReadAt: null },
      { id: 31, userId: 73, feedback: "Unread but not requested.", feedbackReadAt: null },
    ];

    expect(candidates.filter(candidate => isUnreadAnnotationFeedbackForLearner(candidate, 73, [11, 19, 23, 29]))).toEqual([candidates[0]]);
  });

  it("recovers only a structurally valid local field-record draft for the intended template", () => {
    const template = fieldRecordTemplates["water-management-record"];
    const payload = createEmptyFieldRecordPayload(template);
    const rawDraft = JSON.stringify({ title: "Field draft", payload });

    expect(fieldRecordDraftStorageKey(template.id)).toBe("crop-advisor-field-record-draft:water-management-record");
    expect(fieldRecordDraftStorageKey(`${template.id}:42`)).toBe("crop-advisor-field-record-draft:water-management-record:42");
    expect(parseFieldRecordDraft(rawDraft)).toMatchObject({ title: "Field draft", payload });
    expect(parseFieldRecordDraft("not json")).toBeNull();
    expect(parseFieldRecordDraft(JSON.stringify({ title: "Incomplete" }))).toBeNull();
  });

  it("supports private two-record comparison selection and a union of their setup evidence fields", () => {
    const waterPayload = createEmptyFieldRecordPayload(fieldRecordTemplates["water-management-record"]);
    const fertilisationPayload = createEmptyFieldRecordPayload(fieldRecordTemplates["fertilisation-record"]);

    expect(toggleComparisonSelection([], 11)).toEqual([11]);
    expect(toggleComparisonSelection([11], 22)).toEqual([11, 22]);
    expect(toggleComparisonSelection([11, 22], 33)).toEqual([11, 22]);
    expect(toggleComparisonSelection([11, 22], 11)).toEqual([22]);
    expect(comparisonSetupFields([{ payload: waterPayload }, { payload: fertilisationPayload }])).toContain("Farm or grower");
    expect(comparisonSetupFields([{ payload: waterPayload }, { payload: fertilisationPayload }])).toContain("Soil-test or limiting-factor evidence");
  });

  it("defines complete, non-gating field-readiness practicum and capstone evidence for integrated advisory work", () => {
    const practicum = createEmptyFieldPracticumPayload();
    fieldPracticumFields.forEach(field => { practicum[field.key] = `Substantive evidence for ${field.label} with a local source and review condition.`; });
    practicum.visitDate = "2026-08-24";
    practicum.rubric = Object.fromEntries(fieldReadinessRubric.map(criterion => [criterion.id, 3]));

    expect(fieldPracticumFields).toHaveLength(15);
    expect(fieldPracticumFields.map(field => field.key)).toEqual(expect.arrayContaining(["visitVerification", "growerInterviewNotes", "provisionalDiagnosis", "followUpOutcome"]));
    expect(isCompleteFieldPracticum(practicum)).toBe(true);
    expect(Object.keys(capstoneCases)).toEqual([
      "water-market-resilience",
      "diagnosis-to-ipm",
      "safe-input-and-economics",
      "harvest-chain-and-buyer",
      "climate-soil-and-weed-resilience",
    ]);
    Object.values(capstoneCases).forEach(capstone => {
      const submission = createEmptyCapstoneSubmissionPayload(capstone);
      submission.responses = capstone.responsePrompts.map(prompt => `A substantive response to ${prompt} that identifies evidence, uncertainty, a safe action, and a review trigger.`);
      submission.selfReview = "This response distinguishes observation from inference and identifies evidence or supervision needed before revising the recommendation.";
      submission.rubric = Object.fromEntries(fieldReadinessRubric.map(criterion => [criterion.id, 3]));
      expect(capstone.evidencePack.length).toBeGreaterThanOrEqual(4);
      expect(capstone.requiredDecisions.length).toBeGreaterThanOrEqual(4);
      expect(isCompleteCapstoneSubmission(submission, capstone)).toBe(true);
    });
    expect(fieldReadinessRequirements.note).toContain("do not modify");
    expect(fieldReadinessRequirements.minimumPracticumVisits).toBe(3);
    expect(fieldReadinessRequirements.minimumIntegratedCapstones).toBe(2);
    expect(fieldReadinessRubric).toHaveLength(6);
    expect(localIntelligenceSteps).toHaveLength(5);
    expect(fieldReadinessResources.map(resource => resource.id)).toEqual(["economics", "communication", "digital"]);
  });

  it("provides a complete source-grounded applied field brief for every document-derived module", () => {
    const documentModules = cropAdvisorCourse.modules.filter(module => module.index >= 4);

    expect(Object.keys(documentModuleFieldBriefs)).toHaveLength(cropAdvisorCourse.modules.length);
    documentModules.forEach(module => {
      const brief = documentModuleFieldBriefs[module.id];
      expect(brief).toBeDefined();
      expect(brief.title.length).toBeGreaterThan(12);
      expect(brief.context.length).toBeGreaterThan(40);
      expect(brief.task.length).toBeGreaterThan(40);
      expect(brief.evidence.length).toBeGreaterThan(40);
      expect(brief.standard.length).toBeGreaterThan(40);
    });
  });

  it("keeps every document-derived module check aligned to an applied final competency", () => {
    const documentModules = cropAdvisorCourse.modules.filter(module => module.index >= 4);
    const finalItems = new Map(
      cropAdvisorCourse.finalAssessment.questions.map(question => [question.id, question])
    );

    expect(Object.keys(documentAssessmentAlignment)).toHaveLength(cropAdvisorCourse.modules.length);
    documentModules.forEach(module => {
      const alignment = documentAssessmentAlignment[module.id];
      expect(alignment).toBeDefined();
      expect(alignment.sourceTheme.length).toBeGreaterThan(20);
      expect(module.assessment.passMark).toBe(80);
      expect(module.assessment.questions).toHaveLength(4);
      module.assessment.questions.forEach(question => {
        expect(question.prompt.length).toBeGreaterThan(25);
        expect(question.options).toHaveLength(4);
        expect(question.correctOptionId).toBeTruthy();
        expect(question.feedback.correct.length).toBeGreaterThan(70);
        expect(question.feedback.incorrect.length).toBeGreaterThan(70);
      });

      const finalCompetency = finalItems.get(`final-${module.index + 1}`);
      expect(finalCompetency).toBeDefined();
      expect(finalCompetency?.prompt.length).toBeGreaterThan(100);
      expect(finalCompetency?.options).toHaveLength(4);
      expect(finalCompetency?.feedback.correct.length).toBeGreaterThan(70);
      expect(finalCompetency?.feedback.incorrect.length).toBeGreaterThan(70);
      expect(
        module.assessment.questions.some(question =>
          question.prompt.toLowerCase().includes(alignment.moduleAssessmentAnchor)
        )
      ).toBe(true);
      expect(finalCompetency?.prompt.toLowerCase()).toContain(alignment.finalCompetencyAnchor);
    });
  });

  it("keeps the next module locked until the prior module assessment is passed", () => {
    const firstModule = cropAdvisorCourse.modules[0];
    const secondModule = cropAdvisorCourse.modules[1];
    const completed = firstModule.lessons.map(lesson => lesson.id);

    expect(isAssessmentAccessible(firstModule.assessment.id, completed, [])).toBe(true);
    expect(isLessonAccessible(secondModule.lessons[0].id, completed, [])).toBe(false);
    expect(
      isLessonAccessible(secondModule.lessons[0].id, completed, [
        {
          assessmentId: firstModule.assessment.id,
          score: 100,
          passed: true,
          submittedAt: new Date(),
        },
      ])
    ).toBe(true);
  });

  it("exposes completion states and latest scores for all 31 upgraded document-derived modules", () => {
    const firstDocumentModule = cropAdvisorCourse.modules.find(module => module.index === 4)!;
    const overview = buildTrainingOverview({
      enrolled: true,
      completedLessonIds: firstDocumentModule.lessons.map(lesson => lesson.id),
      attempts: [{
        assessmentId: firstDocumentModule.assessment.id,
        score: 100,
        passed: true,
        submittedAt: new Date(),
      }],
      certificate: null,
    });
    const documentStates = overview.moduleStates.filter(module => module.id !== "advisory-practice" && module.id !== "soil-and-nutrition" && module.id !== "crop-observation");

    expect(documentStates).toHaveLength(31);
    expect(overview.latestScores[firstDocumentModule.assessment.id]).toBe(100);
    expect(documentStates.find(module => module.id === firstDocumentModule.id)).toMatchObject({
      completedLessons: 2,
      lessonCount: 2,
      assessmentPassed: true,
    });
  });

  it("unlocks the final only after every module assessment has been passed", () => {
    const allLessons = cropAdvisorCourse.modules.flatMap(module =>
      module.lessons.map(lesson => lesson.id)
    );
    const passedAllModules = cropAdvisorCourse.modules.map(module => ({
      assessmentId: module.assessment.id,
      score: 100,
      passed: true,
      submittedAt: new Date(),
    }));

    expect(
      isAssessmentAccessible(
        cropAdvisorCourse.finalAssessment.id,
        allLessons,
        passedAllModules
      )
    ).toBe(true);
  });

  it("adds the document-derived planning module before the final certification assessment", () => {
    const planningModule = cropAdvisorCourse.modules.find(
      module => module.id === "vegetable-production-planning"
    );
    const previousModule = cropAdvisorCourse.modules[2];

    expect(planningModule?.lessons).toHaveLength(2);
    expect(planningModule?.assessment.questions).toHaveLength(4);
    expect(
      isLessonAccessible(planningModule!.lessons[0].id, [], [
        {
          assessmentId: previousModule.assessment.id,
          score: 100,
          passed: true,
          submittedAt: new Date(),
        },
      ])
    ).toBe(true);
  });

  it("adds the document-derived cost-planning module after the planning module", () => {
    const costModule = cropAdvisorCourse.modules.find(
      module => module.id === "cost-planning-and-decisions"
    );
    const previousModule = cropAdvisorCourse.modules[3];

    expect(costModule?.lessons).toHaveLength(2);
    expect(costModule?.assessment.questions).toHaveLength(4);
    expect(
      isLessonAccessible(costModule!.lessons[0].id, [], [
        {
          assessmentId: previousModule.assessment.id,
          score: 100,
          passed: true,
          submittedAt: new Date(),
        },
      ])
    ).toBe(true);
  });

  it("adds the crop-and-variety module after the cost-planning module", () => {
    const selectionModule = cropAdvisorCourse.modules.find(
      module => module.id === "crop-and-variety-selection"
    );
    const previousModule = cropAdvisorCourse.modules[4];

    expect(selectionModule?.lessons).toHaveLength(2);
    expect(selectionModule?.assessment.questions).toHaveLength(4);
    expect(
      isLessonAccessible(selectionModule!.lessons[0].id, [], [
        {
          assessmentId: previousModule.assessment.id,
          score: 100,
          passed: true,
          submittedAt: new Date(),
        },
      ])
    ).toBe(true);
  });

  it("adds the crop-yield factors module after crop-and-variety selection", () => {
    const yieldModule = cropAdvisorCourse.modules.find(
      module => module.id === "factors-affecting-crop-yield"
    );
    const previousModule = cropAdvisorCourse.modules[5];

    expect(yieldModule?.lessons).toHaveLength(2);
    expect(yieldModule?.assessment.questions).toHaveLength(4);
    expect(
      isLessonAccessible(yieldModule!.lessons[0].id, [], [
        {
          assessmentId: previousModule.assessment.id,
          score: 100,
          passed: true,
          submittedAt: new Date(),
        },
      ])
    ).toBe(true);
  });

  it("adds the climatic-factors module after the crop-yield factors module", () => {
    const climateModule = cropAdvisorCourse.modules.find(
      module => module.id === "climatic-factors-affecting-crop-yield"
    );
    const previousModule = cropAdvisorCourse.modules[6];

    expect(climateModule?.lessons).toHaveLength(2);
    expect(climateModule?.assessment.questions).toHaveLength(4);
    expect(
      isLessonAccessible(climateModule!.lessons[0].id, [], [
        {
          assessmentId: previousModule.assessment.id,
          score: 100,
          passed: true,
          submittedAt: new Date(),
        },
      ])
    ).toBe(true);
  });

  it("adds the topographic-factors module after the climatic-factors module", () => {
    const topographicModule = cropAdvisorCourse.modules.find(
      module => module.id === "topographic-factors-affecting-crop-yield"
    );
    const previousModule = cropAdvisorCourse.modules[7];

    expect(topographicModule?.lessons).toHaveLength(2);
    expect(topographicModule?.assessment.questions).toHaveLength(4);
    expect(
      isLessonAccessible(topographicModule!.lessons[0].id, [], [
        {
          assessmentId: previousModule.assessment.id,
          score: 100,
          passed: true,
          submittedAt: new Date(),
        },
      ])
    ).toBe(true);
  });

  it("adds the edaphic soil-factors module after the topographic-factors module", () => {
    const soilModule = cropAdvisorCourse.modules.find(
      module => module.id === "edaphic-soil-factors-affecting-crop-yield"
    );
    const previousModule = cropAdvisorCourse.modules[8];

    expect(soilModule?.lessons).toHaveLength(2);
    expect(soilModule?.assessment.questions).toHaveLength(4);
    expect(
      isLessonAccessible(soilModule!.lessons[0].id, [], [
        {
          assessmentId: previousModule.assessment.id,
          score: 100,
          passed: true,
          submittedAt: new Date(),
        },
      ])
    ).toBe(true);
  });

  it("adds the soil-degradation module after the edaphic soil-factors module", () => {
    const degradationModule = cropAdvisorCourse.modules.find(
      module => module.id === "soil-degradation-and-management"
    );
    const previousModule = cropAdvisorCourse.modules[9];

    expect(degradationModule?.lessons).toHaveLength(2);
    expect(degradationModule?.assessment.questions).toHaveLength(4);
    expect(
      isLessonAccessible(degradationModule!.lessons[0].id, [], [
        {
          assessmentId: previousModule.assessment.id,
          score: 100,
          passed: true,
          submittedAt: new Date(),
        },
      ])
    ).toBe(true);
  });

  it("adds the plant-nutrition module after the soil-degradation module", () => {
    const nutritionModule = cropAdvisorCourse.modules.find(
      module => module.id === "nutrients-required-in-plant-nutrition"
    );
    const previousModule = cropAdvisorCourse.modules[10];

    expect(nutritionModule?.lessons).toHaveLength(2);
    expect(nutritionModule?.assessment.questions).toHaveLength(4);
    expect(
      isLessonAccessible(nutritionModule!.lessons[0].id, [], [
        {
          assessmentId: previousModule.assessment.id,
          score: 100,
          passed: true,
          submittedAt: new Date(),
        },
      ])
    ).toBe(true);
  });

  it("adds the nutrient-management module after the plant-nutrition module", () => {
    const managementModule = cropAdvisorCourse.modules.find(
      module => module.id === "nutrient-management"
    );
    const previousModule = cropAdvisorCourse.modules[11];

    expect(managementModule?.lessons).toHaveLength(2);
    expect(managementModule?.assessment.questions).toHaveLength(4);
    expect(
      isLessonAccessible(managementModule!.lessons[0].id, [], [
        {
          assessmentId: previousModule.assessment.id,
          score: 100,
          passed: true,
          submittedAt: new Date(),
        },
      ])
    ).toBe(true);
  });

  it("adds the acid-soil module after the nutrient-management module", () => {
    const acidSoilModule = cropAdvisorCourse.modules.find(
      module => module.id === "acid-soil-causes-and-management"
    );
    const previousModule = cropAdvisorCourse.modules[12];

    expect(acidSoilModule?.lessons).toHaveLength(2);
    expect(acidSoilModule?.assessment.questions).toHaveLength(4);
    expect(
      isLessonAccessible(acidSoilModule!.lessons[0].id, [], [
        {
          assessmentId: previousModule.assessment.id,
          score: 100,
          passed: true,
          submittedAt: new Date(),
        },
      ])
    ).toBe(true);
  });

  it("adds the soil-health module after the acid-soil module", () => {
    const soilHealthModule = cropAdvisorCourse.modules.find(
      module => module.id === "how-to-promote-soil-health"
    );
    const previousModule = cropAdvisorCourse.modules[13];

    expect(soilHealthModule?.lessons).toHaveLength(2);
    expect(soilHealthModule?.assessment.questions).toHaveLength(4);
    expect(
      isLessonAccessible(soilHealthModule!.lessons[0].id, [], [
        {
          assessmentId: previousModule.assessment.id,
          score: 100,
          passed: true,
          submittedAt: new Date(),
        },
      ])
    ).toBe(true);
  });

  it("adds the soil-sample collection module after the soil-health module", () => {
    const soilSampleModule = cropAdvisorCourse.modules.find(
      module => module.id === "collect-soil-samples-for-soil-testing"
    );
    const previousModule = cropAdvisorCourse.modules[14];

    expect(soilSampleModule?.lessons).toHaveLength(2);
    expect(soilSampleModule?.assessment.questions).toHaveLength(4);
    expect(
      isLessonAccessible(soilSampleModule!.lessons[0].id, [], [
        {
          assessmentId: previousModule.assessment.id,
          score: 100,
          passed: true,
          submittedAt: new Date(),
        },
      ])
    ).toBe(true);
  });

  it("adds the vegetable-nursery module after soil-sample collection", () => {
    const nurseryModule = cropAdvisorCourse.modules.find(
      module => module.id === "nursery-for-vegetable-production"
    );
    const previousModule = cropAdvisorCourse.modules[15];

    expect(nurseryModule?.lessons).toHaveLength(2);
    expect(nurseryModule?.assessment.questions).toHaveLength(4);
    expect(
      isLessonAccessible(nurseryModule!.lessons[0].id, [], [
        {
          assessmentId: previousModule.assessment.id,
          score: 100,
          passed: true,
          submittedAt: new Date(),
        },
      ])
    ).toBe(true);
  });

  it("adds the open-field seedling-production module after the vegetable nursery", () => {
    const openFieldModule = cropAdvisorCourse.modules.find(
      module => module.id === "open-field-seedling-production"
    );
    const previousModule = cropAdvisorCourse.modules[16];

    expect(openFieldModule?.lessons).toHaveLength(2);
    expect(openFieldModule?.assessment.questions).toHaveLength(4);
    expect(
      isLessonAccessible(openFieldModule!.lessons[0].id, [], [
        {
          assessmentId: previousModule.assessment.id,
          score: 100,
          passed: true,
          submittedAt: new Date(),
        },
      ])
    ).toBe(true);
  });

  it("adds the protected cellular seedling-production module after open-field seedlings", () => {
    const cellularModule = cropAdvisorCourse.modules.find(
      module => module.id === "protective-and-cellular-seedling-production"
    );
    const previousModule = cropAdvisorCourse.modules[17];

    expect(cellularModule?.lessons).toHaveLength(2);
    expect(cellularModule?.assessment.questions).toHaveLength(4);
    expect(
      isLessonAccessible(cellularModule!.lessons[0].id, [], [
        {
          assessmentId: previousModule.assessment.id,
          score: 100,
          passed: true,
          submittedAt: new Date(),
        },
      ])
    ).toBe(true);
  });

  it("adds the seedling-production planning module after protected cellular seedlings", () => {
    const planningModule = cropAdvisorCourse.modules.find(
      module => module.id === "seedling-production-planning"
    );
    const previousModule = cropAdvisorCourse.modules[18];

    expect(planningModule?.lessons).toHaveLength(2);
    expect(planningModule?.assessment.questions).toHaveLength(4);
    expect(
      isLessonAccessible(planningModule!.lessons[0].id, [], [
        {
          assessmentId: previousModule.assessment.id,
          score: 100,
          passed: true,
          submittedAt: new Date(),
        },
      ])
    ).toBe(true);
  });

  it("adds field preparation, mulching, and trellising after seedling planning", () => {
    const fieldModule = cropAdvisorCourse.modules.find(
      module => module.id === "field-preparation-mulching-and-trellising"
    );
    const previousModule = cropAdvisorCourse.modules[19];

    expect(fieldModule?.lessons).toHaveLength(2);
    expect(fieldModule?.assessment.questions).toHaveLength(4);
    expect(
      isLessonAccessible(fieldModule!.lessons[0].id, [], [
        {
          assessmentId: previousModule.assessment.id,
          score: 100,
          passed: true,
          submittedAt: new Date(),
        },
      ])
    ).toBe(true);
  });

  it("adds transplanting after field preparation, mulching, and trellising", () => {
    const transplantingModule = cropAdvisorCourse.modules.find(
      module => module.id === "transplanting"
    );
    const previousModule = cropAdvisorCourse.modules[20];

    expect(transplantingModule?.lessons).toHaveLength(2);
    expect(transplantingModule?.assessment.questions).toHaveLength(4);
    expect(
      isLessonAccessible(transplantingModule!.lessons[0].id, [], [
        {
          assessmentId: previousModule.assessment.id,
          score: 100,
          passed: true,
          submittedAt: new Date(),
        },
      ])
    ).toBe(true);
  });

  it("adds water management after transplanting", () => {
    const waterModule = cropAdvisorCourse.modules.find(
      module => module.id === "water-management"
    );
    const previousModule = cropAdvisorCourse.modules[21];

    expect(waterModule?.lessons).toHaveLength(2);
    expect(waterModule?.assessment.questions).toHaveLength(4);
    expect(
      isLessonAccessible(waterModule!.lessons[0].id, [], [
        {
          assessmentId: previousModule.assessment.id,
          score: 100,
          passed: true,
          submittedAt: new Date(),
        },
      ])
    ).toBe(true);
  });

  it("adds irrigation systems after water management", () => {
    const irrigationModule = cropAdvisorCourse.modules.find(
      module => module.id === "irrigation-systems"
    );
    const previousModule = cropAdvisorCourse.modules[22];

    expect(irrigationModule?.lessons).toHaveLength(2);
    expect(irrigationModule?.assessment.questions).toHaveLength(4);
    expect(
      isLessonAccessible(irrigationModule!.lessons[0].id, [], [
        {
          assessmentId: previousModule.assessment.id,
          score: 100,
          passed: true,
          submittedAt: new Date(),
        },
      ])
    ).toBe(true);
  });

  it("adds drip irrigation after irrigation systems", () => {
    const dripModule = cropAdvisorCourse.modules.find(
      module => module.id === "drip-irrigation-system"
    );
    const previousModule = cropAdvisorCourse.modules[23];

    expect(dripModule?.lessons).toHaveLength(2);
    expect(dripModule?.assessment.questions).toHaveLength(4);
    expect(
      isLessonAccessible(dripModule!.lessons[0].id, [], [
        {
          assessmentId: previousModule.assessment.id,
          score: 100,
          passed: true,
          submittedAt: new Date(),
        },
      ])
    ).toBe(true);
  });

  it("adds vegetable fertilisation after drip irrigation", () => {
    const fertilisationModule = cropAdvisorCourse.modules.find(
      module => module.id === "vegetable-fertilisation"
    );
    const previousModule = cropAdvisorCourse.modules[24];

    expect(fertilisationModule?.lessons).toHaveLength(2);
    expect(fertilisationModule?.assessment.questions).toHaveLength(4);
    expect(
      isLessonAccessible(fertilisationModule!.lessons[0].id, [], [
        {
          assessmentId: previousModule.assessment.id,
          score: 100,
          passed: true,
          submittedAt: new Date(),
        },
      ])
    ).toBe(true);
  });

  it("adds field care after vegetable fertilisation", () => {
    const fieldCareModule = cropAdvisorCourse.modules.find(
      module => module.id === "field-care-and-maintenance"
    );
    const previousModule = cropAdvisorCourse.modules[25];

    expect(fieldCareModule?.lessons).toHaveLength(2);
    expect(fieldCareModule?.assessment.questions).toHaveLength(4);
    expect(
      isLessonAccessible(fieldCareModule!.lessons[0].id, [], [
        {
          assessmentId: previousModule.assessment.id,
          score: 100,
          passed: true,
          submittedAt: new Date(),
        },
      ])
    ).toBe(true);
  });

  it("adds harvesting and post-harvest handling after field care", () => {
    const harvestModule = cropAdvisorCourse.modules.find(
      module => module.id === "harvesting-and-post-harvest-handling"
    );
    const previousModule = cropAdvisorCourse.modules[26];

    expect(harvestModule?.lessons).toHaveLength(2);
    expect(harvestModule?.assessment.questions).toHaveLength(4);
    expect(
      isLessonAccessible(harvestModule!.lessons[0].id, [], [
        {
          assessmentId: previousModule.assessment.id,
          score: 100,
          passed: true,
          submittedAt: new Date(),
        },
      ])
    ).toBe(true);
  });

  it("adds field diagnosis after harvesting and post-harvest handling", () => {
    const diagnosisModule = cropAdvisorCourse.modules.find(
      module => module.id === "field-diagnosis-in-vegetable-crops"
    );
    const previousModule = cropAdvisorCourse.modules[27];

    expect(diagnosisModule?.lessons).toHaveLength(2);
    expect(diagnosisModule?.assessment.questions).toHaveLength(4);
    expect(
      isLessonAccessible(diagnosisModule!.lessons[0].id, [], [
        {
          assessmentId: previousModule.assessment.id,
          score: 100,
          passed: true,
          submittedAt: new Date(),
        },
      ])
    ).toBe(true);
  });

  it("adds disease identification and management after field diagnosis", () => {
    const diseaseModule = cropAdvisorCourse.modules.find(
      module => module.id === "disease-identification-and-management"
    );
    const previousModule = cropAdvisorCourse.modules[28];

    expect(diseaseModule?.lessons).toHaveLength(2);
    expect(diseaseModule?.assessment.questions).toHaveLength(4);
    expect(
      isLessonAccessible(diseaseModule!.lessons[0].id, [], [
        {
          assessmentId: previousModule.assessment.id,
          score: 100,
          passed: true,
          submittedAt: new Date(),
        },
      ])
    ).toBe(true);
  });

  it("adds insect-pest and mite identification and management after disease management", () => {
    const insectPestModule = cropAdvisorCourse.modules.find(
      module => module.id === "insect-pests-and-mites-identification-and-management"
    );
    const previousModule = cropAdvisorCourse.modules[29];

    expect(insectPestModule?.lessons).toHaveLength(2);
    expect(insectPestModule?.assessment.questions).toHaveLength(4);
    expect(
      isLessonAccessible(insectPestModule!.lessons[0].id, [], [
        {
          assessmentId: previousModule.assessment.id,
          score: 100,
          passed: true,
          submittedAt: new Date(),
        },
      ])
    ).toBe(true);
  });

  it("adds integrated pest management after insect-pest and mite management", () => {
    const ipmModule = cropAdvisorCourse.modules.find(
      module => module.id === "integrated-pest-management"
    );
    const previousModule = cropAdvisorCourse.modules[30];

    expect(ipmModule?.lessons).toHaveLength(2);
    expect(ipmModule?.assessment.questions).toHaveLength(4);
    expect(
      isLessonAccessible(ipmModule!.lessons[0].id, [], [
        {
          assessmentId: previousModule.assessment.id,
          score: 100,
          passed: true,
          submittedAt: new Date(),
        },
      ])
    ).toBe(true);
  });

  it("adds responsible pesticide use after integrated pest management", () => {
    const pesticideModule = cropAdvisorCourse.modules.find(
      module => module.id === "responsible-use-of-pesticides"
    );
    const previousModule = cropAdvisorCourse.modules[31];

    expect(pesticideModule?.lessons).toHaveLength(2);
    expect(pesticideModule?.assessment.questions).toHaveLength(4);
    expect(
      isLessonAccessible(pesticideModule!.lessons[0].id, [], [
        {
          assessmentId: previousModule.assessment.id,
          score: 100,
          passed: true,
          submittedAt: new Date(),
        },
      ])
    ).toBe(true);
  });

  it("adds weed management after responsible pesticide use", () => {
    const weedModule = cropAdvisorCourse.modules.find(
      module => module.id === "weed-management"
    );
    const previousModule = cropAdvisorCourse.modules[32];

    expect(weedModule?.lessons).toHaveLength(2);
    expect(weedModule?.assessment.questions).toHaveLength(4);
    expect(
      isLessonAccessible(weedModule!.lessons[0].id, [], [
        {
          assessmentId: previousModule.assessment.id,
          score: 100,
          passed: true,
          submittedAt: new Date(),
        },
      ])
    ).toBe(true);
  });

  it("scores answers and returns focused feedback", () => {
    const assessment = cropAdvisorCourse.modules[0].assessment;
    const perfectAnswers = Object.fromEntries(
      assessment.questions.map(question => [question.id, question.correctOptionId])
    );
    const result = scoreAssessment(assessment, perfectAnswers);

    expect(result.score).toBe(100);
    expect(result.passed).toBe(true);
    expect(result.results.every(item => item.correct)).toBe(true);
  });

  it("surfaces enrollment as the first required activity before learning begins", () => {
    const overview = buildTrainingOverview({
      enrolled: false,
      completedLessonIds: [],
      attempts: [],
      certificate: null,
    });

    expect(overview.nextAction.type).toBe("enroll");
    expect(overview.progressPercent).toBe(0);
  });

  it("only authorizes certificate issuance for a passed final assessment", () => {
    expect(shouldIssueCertificate(cropAdvisorCourse.finalAssessment.id, true)).toBe(true);
    expect(shouldIssueCertificate(cropAdvisorCourse.finalAssessment.id, false)).toBe(false);
    expect(shouldIssueCertificate(cropAdvisorCourse.modules[0].assessment.id, true)).toBe(false);
  });

  it("only authorizes the owner alert when certification has just been issued", () => {
    expect(
      shouldNotifyOwnerOfCertification(
        cropAdvisorCourse.finalAssessment.id,
        true,
        true
      )
    ).toBe(true);
    expect(
      shouldNotifyOwnerOfCertification(
        cropAdvisorCourse.finalAssessment.id,
        true,
        false
      )
    ).toBe(false);
  });
});
