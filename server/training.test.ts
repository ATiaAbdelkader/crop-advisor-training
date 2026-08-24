import { describe, expect, it } from "vitest";
import { cropAdvisorCourse } from "../shared/curriculum";
import {
  buildTrainingOverview,
  isAssessmentAccessible,
  isLessonAccessible,
  scoreAssessment,
  shouldIssueCertificate,
  shouldNotifyOwnerOfCertification,
} from "../shared/trainingLogic";

describe("crop-advisor progression", () => {
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
