export type ModuleVisual = {
  src: string;
  alt: string;
  caption: string;
};

export const moduleVisuals: Readonly<Record<string, ModuleVisual>> = {
  "advisory-practice": {
    src: "/manus-storage/module-01-advisory-practice_1d4aaffc.jpg",
    alt: "Crop advisor and vegetable grower compare crop conditions across a field while recording observations on a clipboard.",
    caption: "Begin with field evidence: compare conditions, record the pattern, and identify the next decision.",
  },
  "soil-and-nutrition": {
    src: "/manus-storage/module-02-soil-and-nutrition-v2_a1efcf42.jpg",
    alt: "Crop advisor examines roots and soil horizons in an open soil pit beside vegetable beds.",
    caption: "Interpret nutrient questions in the context of rooting, water movement, and representative soil zones.",
  },
  "crop-observation": {
    src: "/manus-storage/module-03-crop-observation-v2_f76ad353.jpg",
    alt: "Crop scout walks through vegetable rows and records observations where crop vigour varies across the field.",
    caption: "Scout by crop stage and field pattern so observations become evidence for the next action.",
  },
  "vegetable-production-planning": {
    src: "/manus-storage/module-04-vegetable-production-planning-v2_18e6f6ef.jpg",
    alt: "Growers and a crop advisor review a farm plan beside vegetable beds, an access route, and an irrigation source.",
    caption: "Plan the whole production system: field conditions, water, people, access, markets, and risks belong in one picture.",
  },
  "cost-planning-and-decisions": {
    src: "/manus-storage/module-05-cost-planning-and-decisions-v2_7d89f1a8.jpg",
    alt: "Vegetable grower and advisor review crop inputs, calculation tools, and a handwritten cost plan at an outdoor farm table.",
    caption: "Translate crop choices into quantities, costs, labour needs, and decisions that fit the farm operation.",
  },
  "crop-and-variety-selection": {
    src: "/manus-storage/module-06-crop-and-variety-selection-v2_84d4ace1.jpg",
    alt: "Advisor and grower compare vegetable varieties growing in adjacent field trial rows.",
    caption: "Compare crop and variety fit against the growing environment, the farm system, and market requirements.",
  },
  "factors-affecting-crop-yield": {
    src: "/manus-storage/module-07-factors-affecting-crop-yield-v2_0e031112.jpg",
    alt: "Grower and crop advisor view healthy and weaker vegetable areas across soil, water, and weather conditions.",
    caption: "Yield reflects interacting crop, soil, water, weather, topography, and management factors—not one cause alone.",
  },
  "climatic-factors-affecting-crop-yield": {
    src: "/manus-storage/module-08-climatic-factors-and-crop-yield-v2_de388474.jpg",
    alt: "Grower and advisor inspect a vegetable crop near a rain gauge under a changing but calm sky.",
    caption: "Use weather observations and crop stage to anticipate climate-related risk before it becomes crop loss.",
  },
  "topographic-factors-affecting-crop-yield": {
    src: "/manus-storage/module-09-topographic-factors-and-crop-yield-v2_7c2edc65.jpg",
    alt: "Advisor and grower walk alongside contoured vegetable beds and a grassed drainage channel on a gentle slope.",
    caption: "Read slope, water movement, and access routes to protect soil and make field layout work with the landscape.",
  },
  "edaphic-soil-factors-affecting-crop-yield": {
    src: "/manus-storage/module-10-edaphic-soil-factors-v2_c1c787e4.jpg",
    alt: "Crop advisor holds a stable soil aggregate beside rooted vegetable beds while inspecting soil texture and organic matter.",
    caption: "Soil texture, structure, roots, organic matter, and water condition shape the crop’s productive environment.",
  },
};
