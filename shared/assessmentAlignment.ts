export type AssessmentAlignment = {
  sourceTheme: string;
  moduleAssessmentAnchor: string;
  finalCompetencyAnchor: string;
};

export const documentAssessmentAlignment: Record<string, AssessmentAlignment> = {
  "advisory-practice": { sourceTheme: "Evidence-led advisory process, uncertainty, and risk-aware follow-up", moduleAssessmentAnchor: "follow-up plan", finalCompetencyAnchor: "disciplined advisory process" },
  "soil-and-nutrition": { sourceTheme: "Root-zone context and representative soil-sampling decisions", moduleAssessmentAnchor: "soil conditions", finalCompetencyAnchor: "distinct management zones" },
  "crop-observation": { sourceTheme: "Growth-stage scouting and evidence-limited field diagnosis", moduleAssessmentAnchor: "field diagnosis", finalCompetencyAnchor: "plausible diagnosis" },
  "vegetable-production-planning": { sourceTheme: "Rich-picture planning and site appraisal", moduleAssessmentAnchor: "rich picture", finalCompetencyAnchor: "planning approach" },
  "cost-planning-and-decisions": { sourceTheme: "Cost planning and return-based revision", moduleAssessmentAnchor: "cost plan", finalCompetencyAnchor: "production cost" },
  "crop-and-variety-selection": { sourceTheme: "Market fit and local variety adaptation", moduleAssessmentAnchor: "market acceptability", finalCompetencyAnchor: "expected season and elevation" },
  "factors-affecting-crop-yield": { sourceTheme: "Genetic potential and environmental yield fit", moduleAssessmentAnchor: "climate, soil, and topography", finalCompetencyAnchor: "slope, moisture supply, and seasonal wind" },
  "climatic-factors-affecting-crop-yield": { sourceTheme: "Flowering-stage climate-risk management", moduleAssessmentAnchor: "at flowering", finalCompetencyAnchor: "entering flowering" },
  "topographic-factors-affecting-crop-yield": { sourceTheme: "Elevation, slope, and runoff interpretation", moduleAssessmentAnchor: "elevation", finalCompetencyAnchor: "low-lying, sloping field" },
  "edaphic-soil-factors-affecting-crop-yield": { sourceTheme: "Integrated edaphic root-zone assessment", moduleAssessmentAnchor: "cation exchange capacity", finalCompetencyAnchor: "rooting zone" },
  "soil-degradation-and-management": { sourceTheme: "Soil degradation and linked protection", moduleAssessmentAnchor: "soil erosion", finalCompetencyAnchor: "visible runoff" },
  "nutrients-required-in-plant-nutrition": { sourceTheme: "Mobile-nutrient evidence and plant nutrition", moduleAssessmentAnchor: "mobile nutrient", finalCompetencyAnchor: "older leaves" },
  "nutrient-management": { sourceTheme: "Potassium-risk diagnosis and nutrient planning", moduleAssessmentAnchor: "margins of older leaves", finalCompetencyAnchor: "low available potassium" },
  "acid-soil-causes-and-management": { sourceTheme: "Confirmed acidity and measured lime response", moduleAssessmentAnchor: "soil acidification", finalCompetencyAnchor: "confirmed low ph" },
  "how-to-promote-soil-health": { sourceTheme: "Living-soil health and organic-matter practice", moduleAssessmentAnchor: "soil-health", finalCompetencyAnchor: "organic matter" },
  "collect-soil-samples-for-soil-testing": { sourceTheme: "Representative zones and soil-sample integrity", moduleAssessmentAnchor: "homogeneous vegetable sampling area", finalCompetencyAnchor: "soil test" },
  "nursery-for-vegetable-production": { sourceTheme: "Root quality and protected nursery improvement", moduleAssessmentAnchor: "good seedling root system", finalCompetencyAnchor: "weak roots" },
  "open-field-seedling-production": { sourceTheme: "Bare-root nursery site, sowing, and establishment", moduleAssessmentAnchor: "thin row sowing", finalCompetencyAnchor: "open-field tomato nursery" },
  "protective-and-cellular-seedling-production": { sourceTheme: "Cellular media, handling, and hardening", moduleAssessmentAnchor: "cellular growing medium", finalCompetencyAnchor: "cellular cucurbit nursery" },
  "seedling-production-planning": { sourceTheme: "Seed traceability, replacement planning, and media fit", moduleAssessmentAnchor: "seed lot", finalCompetencyAnchor: "coated seed" },
  "field-preparation-mulching-and-trellising": { sourceTheme: "Beds, drainage, mulch, and crop-timed trellising", moduleAssessmentAnchor: "raised beds and drainage canals", finalCompetencyAnchor: "poor rainy-season drainage" },
  "transplanting": { sourceTheme: "Hardening and careful transplant establishment", moduleAssessmentAnchor: "hardening seedlings", finalCompetencyAnchor: "unhardened tray seedlings" },
  "water-management": { sourceTheme: "Root-zone water-air balance and safe sources", moduleAssessmentAnchor: "sandy soil", finalCompetencyAnchor: "sandy vegetable field" },
  "irrigation-systems": { sourceTheme: "System selection from crop and farm evidence", moduleAssessmentAnchor: "irrigation system", finalCompetencyAnchor: "furrow irrigation" },
  "drip-irrigation-system": { sourceTheme: "Drip-system design and uniformity maintenance", moduleAssessmentAnchor: "drip-system", finalCompetencyAnchor: "drip system" },
  "vegetable-fertilisation": { sourceTheme: "Limiting-factor fertilisation and 4R planning", moduleAssessmentAnchor: "low potassium", finalCompetencyAnchor: "low soil potassium" },
  "field-care-and-maintenance": { sourceTheme: "Trellising, pruning, pollination, and fruit support", moduleAssessmentAnchor: "trellis", finalCompetencyAnchor: "cucurbit field" },
  "harvesting-and-post-harvest-handling": { sourceTheme: "Maturity, gentle handling, and safe loss control", moduleAssessmentAnchor: "harvest", finalCompetencyAnchor: "harvest team" },
  "field-diagnosis-in-vegetable-crops": { sourceTheme: "Evidence-led diagnosis under uncertainty", moduleAssessmentAnchor: "plant-health problems", finalCompetencyAnchor: "yellowing and stunting" },
  "disease-identification-and-management": { sourceTheme: "Disease diagnosis and spread-pathway prevention", moduleAssessmentAnchor: "abiotic factors", finalCompetencyAnchor: "wilt and leaf spots" },
  "insect-pests-and-mites-identification-and-management": { sourceTheme: "Pest-stage, vector, and beneficial-insect management", moduleAssessmentAnchor: "whiteflies", finalCompetencyAnchor: "whiteflies" },
  "integrated-pest-management": { sourceTheme: "Prevention, monitoring, targeted IPM, and review", moduleAssessmentAnchor: "ipm", finalCompetencyAnchor: "integrated pest-management" },
  "responsible-use-of-pesticides": { sourceTheme: "Label-led, safe, and lawful pesticide stewardship", moduleAssessmentAnchor: "label-review", finalCompetencyAnchor: "unlabeled leftover" },
  "weed-management": { sourceTheme: "Weed morphology, persistence, and integrated control", moduleAssessmentAnchor: "grass-like weed", finalCompetencyAnchor: "grass-like plants" },
};
