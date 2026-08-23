export type Question = {
  id: string;
  prompt: string;
  options: readonly { id: string; label: string }[];
  correctOptionId: string;
  feedback: {
    correct: string;
    incorrect: string;
  };
};

export type Lesson = {
  id: string;
  title: string;
  duration: string;
  kicker: string;
  summary: string;
  outcomes: readonly string[];
  sections: readonly {
    heading: string;
    body: string;
    callout?: string;
  }[];
};

export type Assessment = {
  id: string;
  title: string;
  description: string;
  kind: "module" | "final";
  passMark: number;
  questions: readonly Question[];
};

export type CourseModule = {
  id: string;
  index: number;
  title: string;
  eyebrow: string;
  description: string;
  lessons: readonly Lesson[];
  assessment: Assessment;
};

export type CourseDefinition = {
  id: string;
  title: string;
  subtitle: string;
  duration: string;
  credentialName: string;
  passMark: number;
  modules: readonly CourseModule[];
  finalAssessment: Assessment;
};

export const cropAdvisorCourse: CourseDefinition = {
  id: "crop-advisor-foundations",
  title: "Crop Advisor Foundations",
  subtitle: "A field-centred pathway from observation to defensible recommendations.",
  duration: "Approx. 5 hours",
  credentialName: "Crop Advisor Foundations Certificate",
  passMark: 80,
  modules: [
    {
      id: "advisory-practice",
      index: 1,
      title: "Advisory practice",
      eyebrow: "Module 01",
      description:
        "Build a repeatable advisory process that protects the grower, the crop, and the quality of each recommendation.",
      lessons: [
        {
          id: "observe-frame-decide",
          title: "Observe, frame, decide",
          duration: "18 min",
          kicker: "The advisory sequence",
          summary:
            "Translate a field observation into a recommendation that is specific, evidence-led, and suited to the grower’s operating context.",
          outcomes: [
            "Separate an observation from an interpretation and a recommendation.",
            "Use a field question to define the evidence required before acting.",
            "Record the conditions that can change the suitability of an intervention.",
          ],
          sections: [
            {
              heading: "Start with a field question",
              body:
                "A useful crop-advisor visit begins with a decision that must be made, not with a product or a diagnosis already assumed. State the crop, growth stage, field location, symptom or opportunity, and the management decision at stake. This creates a boundary around the evidence you need and prevents a single visible symptom from becoming the entire diagnosis.",
              callout:
                "Field discipline: record what is seen, where it occurs, and how it varies before explaining why it happened.",
            },
            {
              heading: "Build evidence across the field",
              body:
                "Compare affected and unaffected areas. Review crop distribution, recent weather, irrigation or drainage patterns, planting date, cultivar, prior crop, fertility history, and any recent applications. A recommendation is stronger when it explains the field pattern rather than only the most striking plant.",
            },
            {
              heading: "Make the decision auditable",
              body:
                "Document the recommendation, its purpose, the evidence supporting it, operational constraints, and what should be monitored afterward. The record supports continuity between visits and gives the grower a clear basis for action. Where uncertainty remains, identify the next observation or test that would reduce it.",
            },
          ],
        },
        {
          id: "stewardship-records",
          title: "Stewardship, records, and risk",
          duration: "16 min",
          kicker: "Professional responsibility",
          summary:
            "Use transparent records and risk-aware communication to keep advice technically sound and professionally defensible.",
          outcomes: [
            "Identify records that make a recommendation traceable.",
            "Communicate uncertainty without making advice vague.",
            "Recognise when a recommendation should be escalated or deferred.",
          ],
          sections: [
            {
              heading: "Keep the advisory record complete",
              body:
                "A useful record includes the date, field identity, crop and growth stage, observations, samples or diagnostics used, recommendation, timing, applicable restrictions, and planned follow-up. Avoid replacing field evidence with memory after the visit. Notes that distinguish facts from assumptions are especially valuable when several people manage the account.",
            },
            {
              heading: "Treat risk as part of the recommendation",
              body:
                "Every action has a practical context: weather windows, soil condition, crop stress, equipment capability, neighbouring sensitive areas, label or regulatory requirements, and worker safety. Explain which condition would cause the advice to change. This is more useful than presenting a recommendation as universally applicable.",
              callout:
                "Professional judgement includes knowing when more evidence, local expertise, or a specialist referral is needed before action.",
            },
            {
              heading: "Close the loop",
              body:
                "Set a follow-up observation that tests whether the intervention worked. Capture the outcome, including unexpected effects. Over time, these records build local knowledge about field zones, timing, and management responses without confusing correlation for certainty.",
            },
          ],
        },
      ],
      assessment: {
        id: "advisory-practice-check",
        title: "Advisory practice check",
        description:
          "Demonstrate a disciplined sequence from field observation to a defensible next action.",
        kind: "module",
        passMark: 80,
        questions: [
          {
            id: "ap-1",
            prompt:
              "A grower reports uneven yellowing across a maize field. What is the strongest first action?",
            options: [
              { id: "a", label: "Recommend a corrective nutrient application immediately." },
              { id: "b", label: "Compare affected and unaffected zones and document the field pattern." },
              { id: "c", label: "Assume the cultivar is unsuitable for the field." },
              { id: "d", label: "Wait until harvest to decide whether the issue matters." },
            ],
            correctOptionId: "b",
            feedback: {
              correct:
                "Correct. Comparing zones helps distinguish a field pattern from a single symptom and directs the next diagnostic step.",
              incorrect:
                "Begin by observing and documenting the pattern across affected and unaffected areas; an intervention should follow evidence.",
            },
          },
          {
            id: "ap-2",
            prompt:
              "Which record makes a recommendation most traceable for a later follow-up visit?",
            options: [
              { id: "a", label: "Only the product name and application rate." },
              { id: "b", label: "A brief note that the crop looked stressed." },
              { id: "c", label: "Field observations, evidence used, recommendation, constraints, and follow-up plan." },
              { id: "d", label: "The grower’s expected yield target only." },
            ],
            correctOptionId: "c",
            feedback: {
              correct:
                "Correct. Traceability depends on connecting the evidence, decision, constraints, and intended review.",
              incorrect:
                "A professional record connects the observations and evidence to the recommendation, constraints, and planned follow-up.",
            },
          },
          {
            id: "ap-3",
            prompt:
              "When should an advisor defer a recommendation or seek additional expertise?",
            options: [
              { id: "a", label: "Whenever a grower asks for a written record." },
              { id: "b", label: "When the evidence is insufficient for the risk or the issue exceeds the advisor’s competence." },
              { id: "c", label: "Only after an intervention fails." },
              { id: "d", label: "Never; decisive answers are always more useful." },
            ],
            correctOptionId: "b",
            feedback: {
              correct:
                "Correct. Escalation is a professional control when evidence or competence is not sufficient for the decision’s consequence.",
              incorrect:
                "Advice should be deferred or escalated when the evidence is inadequate for the risk or specialised competence is required.",
            },
          },
        ],
      },
    },
    {
      id: "soil-and-nutrition",
      index: 2,
      title: "Soil and nutrition",
      eyebrow: "Module 02",
      description:
        "Read soil context, design representative sampling, and turn laboratory results into cautious nutrient-management decisions.",
      lessons: [
        {
          id: "soil-profile-context",
          title: "Read the soil profile in context",
          duration: "22 min",
          kicker: "Soil as a system",
          summary:
            "Interpret rooting environment, structure, water movement, and field variability before attaching a nutrient explanation to crop symptoms.",
          outcomes: [
            "Describe how rooting depth and soil structure influence crop performance.",
            "Identify observations that indicate water or compaction constraints.",
            "Relate soil variability to a practical scouting or sampling plan.",
          ],
          sections: [
            {
              heading: "Look below the canopy",
              body:
                "Above-ground symptoms may be shaped by root restriction, waterlogging, drought, compaction, shallow topsoil, or abrupt texture changes. A spade or soil probe can reveal rooting depth, aggregate condition, pore continuity, moisture distribution, and the transition between horizons. Observe several representative positions rather than relying on one excavation.",
              callout:
                "A laboratory result is easier to interpret when it is paired with a field description of rooting and water conditions.",
            },
            {
              heading: "Separate zones before sampling",
              body:
                "Ridges, depressions, soil types, management history, yield maps, and visible crop patterns can define zones with different likely responses. Do not combine materially different zones into one composite sample if the decision will be made by zone. Mark their position so later observations can be compared with the same places.",
            },
            {
              heading: "Interpret limits before nutrients",
              body:
                "Nutrient availability and crop uptake depend on water, aeration, rooting, temperature, pH, and biological activity. A nutrient-focused intervention may not correct a yield limitation caused primarily by poor root access or water management. Identify the dominant limitation before selecting a response.",
            },
          ],
        },
        {
          id: "sampling-to-recommendation",
          title: "From sampling to recommendation",
          duration: "20 min",
          kicker: "Evidence that represents the field",
          summary:
            "Plan representative samples, preserve the context of laboratory data, and communicate nutrient recommendations with their assumptions.",
          outcomes: [
            "Choose sampling depth and timing that match the management question.",
            "Avoid common sources of sampling bias.",
            "State the assumptions and follow-up checks behind a nutrient recommendation.",
          ],
          sections: [
            {
              heading: "Design the sample for the decision",
              body:
                "Set the sampling depth, positions, number of cores, and timing to match the nutrient or soil condition being assessed and the local interpretation system. Avoid atypical locations such as headlands, manure piles, gateways, fertiliser bands, or recently disturbed ground unless those zones are specifically being investigated.",
            },
            {
              heading: "Protect sample integrity",
              body:
                "Use clean tools and containers, label samples immediately, and keep field identity, depth, and zone information attached to the sample. The laboratory can only analyse what it receives; poor field representation cannot be repaired by a precise analytical result.",
              callout:
                "Sampling error is often a bigger practical risk than small differences between two legitimate laboratory numbers.",
            },
            {
              heading: "Explain the recommendation’s basis",
              body:
                "When translating a report into advice, state the crop need, expected yield context, nutrient source assumptions, placement and timing considerations, and constraints such as moisture or soil pH. Specify what will be monitored after application, especially where response is uncertain or field variability is high.",
            },
          ],
        },
      ],
      assessment: {
        id: "soil-and-nutrition-check",
        title: "Soil and nutrition check",
        description:
          "Apply soil-profile observations and representative sampling principles to a crop-advisory decision.",
        kind: "module",
        passMark: 80,
        questions: [
          {
            id: "sn-1",
            prompt:
              "Why should an advisor inspect roots and soil conditions before concluding that a pale crop is nutrient deficient?",
            options: [
              { id: "a", label: "Because root restriction or water conditions can limit uptake even when nutrients are present." },
              { id: "b", label: "Because laboratory reports are never useful." },
              { id: "c", label: "Because crop colour is unrelated to plant condition." },
              { id: "d", label: "Because nutrient recommendations are only made at harvest." },
            ],
            correctOptionId: "a",
            feedback: {
              correct:
                "Correct. Crop uptake depends on the rooting environment and water or aeration conditions as well as nutrient supply.",
              incorrect:
                "Inspect the rooting environment first; root restriction and water conditions can limit uptake despite adequate nutrient supply.",
            },
          },
          {
            id: "sn-2",
            prompt:
              "A field has a low-lying, poorly drained area and a well-drained ridge. What is the best sampling approach if management decisions may differ?",
            options: [
              { id: "a", label: "Mix all cores into one composite sample to save cost." },
              { id: "b", label: "Sample the ridge only because it is easier to access." },
              { id: "c", label: "Create separate representative samples for the distinct management zones." },
              { id: "d", label: "Take one core at the field entrance." },
            ],
            correctOptionId: "c",
            feedback: {
              correct:
                "Correct. Distinct zones should remain separate when decisions may differ by zone.",
              incorrect:
                "Keep materially different management zones separate so the sample represents the decision area.",
            },
          },
          {
            id: "sn-3",
            prompt:
              "Which location is usually inappropriate for a representative composite soil sample unless it is the target of the investigation?",
            options: [
              { id: "a", label: "A typical crop row within the sampled zone." },
              { id: "b", label: "A fertiliser band or manure accumulation area." },
              { id: "c", label: "Several evenly distributed points across a uniform zone." },
              { id: "d", label: "A labelled position selected for future comparison." },
            ],
            correctOptionId: "b",
            feedback: {
              correct:
                "Correct. Localised nutrient sources can bias a composite sample away from the management zone’s typical condition.",
              incorrect:
                "Avoid localised nutrient sources such as fertiliser bands or manure accumulation areas unless that is the specific investigation.",
            },
          },
        ],
      },
    },
    {
      id: "crop-observation",
      index: 3,
      title: "Crop observation",
      eyebrow: "Module 03",
      description:
        "Scout by growth stage, interpret variability, and move from visible symptom to a testable field diagnosis.",
      lessons: [
        {
          id: "scouting-by-stage",
          title: "Scout by growth stage",
          duration: "19 min",
          kicker: "Timely field intelligence",
          summary:
            "Build scouting visits around crop growth stage, risk windows, and field history so observations lead to timely, relevant action.",
          outcomes: [
            "Prioritise observations by crop stage and field risk.",
            "Use a consistent walk pattern that captures variability.",
            "Record enough context for another advisor to understand the observation.",
          ],
          sections: [
            {
              heading: "Let crop stage set the agenda",
              body:
                "The same organism, symptom, or management issue can carry different consequences at different growth stages. Plan visits around critical windows for stand establishment, nutrient demand, canopy development, reproduction, and harvest readiness. Add field-specific risks such as recent weather events, historic problem areas, and prior crop pressure.",
            },
            {
              heading: "Walk for contrast, not convenience",
              body:
                "Start at the field edge for orientation, then move into the field using a route that crosses changes in soil, topography, crop vigour, and management history. Compare symptomatic plants with apparently healthy plants at a similar stage. Photographs, counts, and simple maps are strongest when they preserve location and scale.",
              callout:
                "A scouting observation gains value when it links crop stage, distribution, incidence, severity, and a plausible driver.",
            },
            {
              heading: "Separate incidence from severity",
              body:
                "Incidence describes how widely an issue occurs; severity describes how strongly affected individual plants or plant parts are. Both matter. A severe issue in a few plants and a mild issue across most of the field may call for different responses, monitoring, or urgency.",
            },
          ],
        },
        {
          id: "diagnose-variability",
          title: "Diagnose field variability",
          duration: "21 min",
          kicker: "Evidence-led diagnosis",
          summary:
            "Use patterns, plant examination, and management history to test competing explanations for variable crop performance.",
          outcomes: [
            "Generate more than one plausible explanation for a field pattern.",
            "Select observations that differentiate competing explanations.",
            "Communicate a diagnosis with confidence proportional to the evidence.",
          ],
          sections: [
            {
              heading: "Use the pattern as a clue",
              body:
                "Field patterns can suggest where to look next: straight lines may point to equipment or application patterns; patches may align with soil, drainage, or pest distribution; field edges may indicate traffic, compaction, or off-target exposure. A pattern is a clue, not proof. Test it against plant condition, soil context, and management records.",
            },
            {
              heading: "Test competing explanations",
              body:
                "Name at least two plausible causes, then choose observations that could distinguish them. For example, compare roots, soil moisture, nearby healthy plants, recent applications, and distribution relative to field features. This reduces the risk of recommending a response that only fits the first explanation considered.",
            },
            {
              heading: "State certainty honestly",
              body:
                "Classify conclusions as observed, likely, or unconfirmed. Where evidence is incomplete, identify the sample, observation, or monitoring point needed to refine the diagnosis. Growers can act more confidently when they understand both the recommended step and the evidence limits behind it.",
              callout:
                "Good diagnosis is not a quick label; it is a transparent argument that links evidence to the next decision.",
            },
          ],
        },
      ],
      assessment: {
        id: "crop-observation-check",
        title: "Crop observation check",
        description:
          "Demonstrate growth-stage-aware scouting and a disciplined approach to diagnosing field variability.",
        kind: "module",
        passMark: 80,
        questions: [
          {
            id: "co-1",
            prompt:
              "What is the principal reason to plan crop scouting around growth stages?",
            options: [
              { id: "a", label: "Crop stage helps identify the risks and decisions that are timely and relevant." },
              { id: "b", label: "It removes the need to consider weather or field history." },
              { id: "c", label: "It guarantees every field will need the same intervention." },
              { id: "d", label: "It allows advisors to inspect only field edges." },
            ],
            correctOptionId: "a",
            feedback: {
              correct:
                "Correct. Growth stage provides a decision-focused agenda for scouting while field history and weather remain essential context.",
              incorrect:
                "Growth stage helps prioritise the risks and management decisions that are timely for the crop.",
            },
          },
          {
            id: "co-2",
            prompt:
              "A symptom appears in a straight band parallel to the tramlines. What should the advisor do next?",
            options: [
              { id: "a", label: "Conclude immediately that a pathogen is responsible." },
              { id: "b", label: "Compare the pattern with equipment, application, and traffic records while checking plants and soil." },
              { id: "c", label: "Ignore the pattern because all variability is random." },
              { id: "d", label: "Sample only one severely affected plant." },
            ],
            correctOptionId: "b",
            feedback: {
              correct:
                "Correct. The pattern is a useful clue that should be tested against application, equipment, and field evidence.",
              incorrect:
                "A straight band is a clue. Test it against equipment, application, traffic, plant, and soil evidence before diagnosing.",
            },
          },
          {
            id: "co-3",
            prompt:
              "Which statement best communicates an evidence-limited field diagnosis?",
            options: [
              { id: "a", label: "This is certainly one cause, so no further checks are needed." },
              { id: "b", label: "The field has variability, but the cause does not matter." },
              { id: "c", label: "The observed pattern is consistent with this cause; confirm with these additional checks before a high-risk intervention." },
              { id: "d", label: "A confident recommendation should never mention uncertainty." },
            ],
            correctOptionId: "c",
            feedback: {
              correct:
                "Correct. The statement connects the evidence, a plausible explanation, and a proportionate next verification step.",
              incorrect:
                "A professional diagnosis distinguishes what is observed, what is likely, and what needs verification before a high-risk response.",
            },
          },
        ],
      },
    },
    {
      id: "vegetable-production-planning",
      index: 4,
      title: "Vegetable production planning",
      eyebrow: "Module 04",
      description:
        "Build a rich picture of the farm context, then turn climatic, soil, market, biological, and knowledge factors into a practical vegetable field plan.",
      lessons: [
        {
          id: "build-the-rich-picture",
          title: "Build the rich picture",
          duration: "24 min",
          kicker: "Planning the whole system",
          summary:
            "Use a rich picture to make visible the main elements and relationships that shape a vegetable-production decision before choosing a crop, variety, or field layout.",
          outcomes: [
            "Identify the climatic, edaphic, topographic, economic, biological, and knowledge factors that shape vegetable production.",
            "Use planning questions to reveal constraints beyond location, soil quality, and water availability.",
            "Create a field-context picture that connects farm conditions with practical decisions.",
          ],
          sections: [
            {
              heading: "See the system before the plot",
              body:
                "A rich picture is a drawing of a situation that brings together the elements and relationships to consider before an intervention. In vegetable production, this prevents planning from narrowing too early to a suitable soil or a nearby water source. The picture can include the field, access route, water point, family labour, buyers, neighbouring crops, seasonal hazards, available equipment, and the farmer’s existing knowledge.",
              callout:
                "Planning is strongest when the field is understood as a production-and-market system, not as soil alone.",
            },
            {
              heading: "Ask about the growing environment",
              body:
                "Climatic conditions influence crop choice and timing. Short and long days can affect flowering in fruit vegetables; the hottest and coldest months can influence pests, diseases, flowering, fruiting, and variety adaptability. Ask whether water is reliable year-round or only in the rainy season, and identify the months in which flooding or typhoon risk is most likely. These questions help make timing and risk controls explicit.",
            },
            {
              heading: "Use the six planning lenses",
              body:
                "Work through six connected lenses. Edaphic factors include soil condition, colour, structure, texture, porosity, pH, nutrient content, organic matter, soil life, and access to testing. Topographic factors include location, access, transport route, slope, drainage, and elevation. Economic factors include market, seasonal price and quantity changes, agro-input availability, finance, information, land, labour, equipment, and locally available materials. Biological factors include field history, problem history, recent outbreaks, nearby crops, biodiversity, and ecosystem observations. Finally, assess the farmer’s skills, prior training, farming experience, learning preferences, and access to phones or smartphones.",
            },
          ],
        },
        {
          id: "turn-site-appraisal-into-plan",
          title: "Turn a site appraisal into a field plan",
          duration: "26 min",
          kicker: "From observation to action",
          summary:
            "Translate field history, soil and water checks, crop selection, and household or market purpose into an agreed vegetable-production plan and practical checklist.",
          outcomes: [
            "Conduct a field appraisal that covers location, history, soil, water, slope, sun, wind, and biological pressures.",
            "Select crop and variety using field evidence, season, farmer preference, and market or household purpose.",
            "Co-design a field layout, irrigation approach, crop-protection practices, and activity record with the farmer.",
          ],
          sections: [
            {
              heading: "Appraise the site in sequence",
              body:
                "Begin with field location and access: is the site close to a road, path, or home, and how will inputs and harvested produce move? Review the field’s crop and fertiliser history, recurrent problems, neighbouring practices, and crops grown around it. Then examine soil pH, texture, profile and hardpan, colour and humus; map the water source, seasonal availability, water quality, and irrigation equipment; and note slope, sun exposure, wind, farm animals, or stray animals.",
              callout:
                "A plan should be made with the farmer, using a map or crop planner that makes the site conditions and intended layout visible.",
            },
            {
              heading: "Choose the crop, variety, and plot design together",
              body:
                "Crop and variety selection should respond to field observations, season, the farmer’s preference, and relevant market or partner information. Once a choice is made, agree land preparation, ploughing or harrowing needs, basal amendments, raised-bed number, size, height, and orientation. Decide whether to use seedlings or direct sowing, which mulch is suitable, whether a trellis or net trellis is required, and how irrigation will be delivered. A gentle slope can support irrigation and drainage, but the plan must still control erosion and avoid concentrating water in vulnerable areas.",
            },
            {
              heading: "Adapt the checklist to the production purpose",
              body:
                "A small commercial field checklist should include market potential, buyer access, crop quality requirements, input and finance access, harvest and post-harvest planning, and safe disposal of non-biodegradable materials. A home-garden checklist can centre household vegetable preferences, a compact layout, water intervals checked against soil moisture, nursery quality, healthy and uniform seedlings, organic mulch, trellis timing, crop protection, and the farmer’s activity record. In both settings, record decisions so the plan can be checked and improved over time.",
            },
          ],
        },
      ],
      assessment: {
        id: "vegetable-production-planning-check",
        title: "Vegetable production planning check",
        description:
          "Apply the document’s rich-picture framework and site-appraisal checklist to an actionable vegetable-production plan.",
        kind: "module",
        passMark: 80,
        questions: [
          {
            id: "vp-1",
            prompt:
              "What is the main purpose of a rich picture in vegetable-production planning?",
            options: [
              { id: "a", label: "To draw an attractive image of the finished vegetable plot." },
              { id: "b", label: "To show the important field, household, market, and environmental elements and how they influence each other." },
              { id: "c", label: "To replace all field observations with a single soil test." },
              { id: "d", label: "To select a variety before checking the farm context." },
            ],
            correctOptionId: "b",
            feedback: {
              correct:
                "Correct. A rich picture makes the relevant system elements and relationships visible before an intervention is planned.",
              incorrect:
                "A rich picture is a planning view of the situation: it links field, environmental, economic, biological, and knowledge factors to decisions.",
            },
          },
          {
            id: "vp-2",
            prompt:
              "A farmer has fertile soil and a reliable water source. Which additional question is essential before selecting the vegetable calendar?",
            options: [
              { id: "a", label: "Which month is flooding or typhoon risk most likely to occur?" },
              { id: "b", label: "Which colour should be used for the signboard?" },
              { id: "c", label: "Can the field be considered risk-free because water is available?" },
              { id: "d", label: "Should climate be ignored if the soil is rich in organic matter?" },
            ],
            correctOptionId: "a",
            feedback: {
              correct:
                "Correct. Seasonal flood and typhoon risk can change crop timing, field protection, and the practicality of an otherwise suitable site.",
              incorrect:
                "Planning must test seasonal hazards such as flooding and typhoon exposure as well as soil and water resources.",
            },
          },
          {
            id: "vp-3",
            prompt:
              "Which set of observations best represents an edaphic or soil appraisal before vegetable production?",
            options: [
              { id: "a", label: "Soil pH, texture, structure, porosity, organic matter, and soil life." },
              { id: "b", label: "Only the distance from the farm to the market." },
              { id: "c", label: "The farmer’s phone model and nearby buyers." },
              { id: "d", label: "Only the crop price in the last month." },
            ],
            correctOptionId: "a",
            feedback: {
              correct:
                "Correct. An edaphic appraisal examines the physical, chemical, and biological condition of the soil that will support the crop.",
              incorrect:
                "The soil appraisal should include pH, texture, structure, porosity, organic matter, nutrient condition, and biological activity.",
            },
          },
          {
            id: "vp-4",
            prompt:
              "Which action most clearly turns a site appraisal into a usable vegetable-production plan?",
            options: [
              { id: "a", label: "Choose the most popular vegetable without discussing the field with the farmer." },
              { id: "b", label: "Use site, season, water, soil, purpose, and farmer preference to agree crop choice, bed layout, irrigation, and follow-up records." },
              { id: "c", label: "Delay all layout decisions until after harvest." },
              { id: "d", label: "Use the same plot design for every household and commercial field." },
            ],
            correctOptionId: "b",
            feedback: {
              correct:
                "Correct. A practical plan is co-designed from observed conditions and covers crop choice, layout, irrigation, management, and recordkeeping.",
              incorrect:
                "Translate the appraisal into an agreed plan with crop selection, layout, irrigation, management choices, and a record for checking progress.",
            },
          },
        ],
      },
    },
  ],
  finalAssessment: {
    id: "crop-advisor-final",
    title: "Crop Advisor Foundations final assessment",
    description:
      "Integrate advisory practice, soil context, crop observation, and vegetable-production planning to qualify for certification.",
    kind: "final",
    passMark: 80,
    questions: [
      {
        id: "final-1",
        prompt:
          "A cereal crop is pale in a poorly drained depression, while adjacent ground is green. Before proposing a nutrient response, what combined evidence is most useful?",
        options: [
          { id: "a", label: "A single photograph of the pale area." },
          { id: "b", label: "Root and soil condition, moisture status, comparison plants, and the field’s management history." },
          { id: "c", label: "Only the most recent fertiliser invoice." },
          { id: "d", label: "A yield target from a different field." },
        ],
        correctOptionId: "b",
        feedback: {
          correct:
            "Correct. The comparison integrates plant, soil, water, and management evidence before selecting an intervention.",
          incorrect:
            "The most defensible next step compares roots, soil and moisture conditions, crop condition, and management history.",
        },
      },
      {
        id: "final-2",
        prompt:
          "Which sequence most closely reflects a disciplined advisory process?",
        options: [
          { id: "a", label: "Choose a product, then search for a matching symptom." },
          { id: "b", label: "Observe the pattern, frame the decision, collect relevant evidence, recommend with constraints, and follow up." },
          { id: "c", label: "Wait for a complaint, then provide an unrecorded verbal opinion." },
          { id: "d", label: "Use the same recommendation on every field to simplify records." },
        ],
        correctOptionId: "b",
        feedback: {
          correct:
            "Correct. The sequence turns field evidence into an auditable recommendation and a planned check on the outcome.",
          incorrect:
            "Start with observation and the field decision, then collect evidence, state constraints, and follow up.",
        },
      },
      {
        id: "final-3",
        prompt:
          "Why is it important to separate distinct management zones when taking soil samples?",
        options: [
          { id: "a", label: "It ensures every sample has the same laboratory value." },
          { id: "b", label: "It allows each sample to represent the area for which a potentially different decision may be made." },
          { id: "c", label: "It removes the need to record sample depth." },
          { id: "d", label: "It guarantees a nutrient application will be required." },
        ],
        correctOptionId: "b",
        feedback: {
          correct:
            "Correct. Sampling should represent the decision area, especially when soil or management conditions differ across the field.",
          incorrect:
            "Separate zones so each sample represents the area to which a specific management decision may apply.",
        },
      },
      {
        id: "final-4",
        prompt:
          "An advisor has a plausible diagnosis but lacks evidence needed for a high-consequence intervention. What is the appropriate response?",
        options: [
          { id: "a", label: "Proceed immediately to demonstrate confidence." },
          { id: "b", label: "State the conclusion as confirmed even though it is not." },
          { id: "c", label: "Explain the uncertainty, collect the decisive evidence or seek specialist input, and set a follow-up point." },
          { id: "d", label: "Delete the field notes so the uncertainty cannot be questioned." },
        ],
        correctOptionId: "c",
        feedback: {
          correct:
            "Correct. Proportionate uncertainty management protects both the grower and the quality of the advisory decision.",
          incorrect:
            "For a high-consequence intervention, communicate uncertainty and obtain the evidence or expertise needed before acting.",
        },
      },
      {
        id: "final-5",
        prompt:
          "Before establishing a small commercial vegetable demonstration field, which planning approach is most defensible?",
        options: [
          { id: "a", label: "Start with the crop that is currently fashionable, then inspect the site later." },
          { id: "b", label: "Map the field system, check climate, soil, water, access, market, biological pressure, and farmer capability, then agree the layout and crop plan." },
          { id: "c", label: "Use a permanent layout without considering slope, sun, wind, or drainage." },
          { id: "d", label: "Base every production decision only on the soil colour." },
        ],
        correctOptionId: "b",
        feedback: {
          correct:
            "Correct. A defensible vegetable plan connects the rich-picture context with an agreed, site-specific crop and layout decision.",
          incorrect:
            "Begin with a rich picture and site appraisal that connects crop choice and layout to climate, soil, water, access, market, biology, and farmer capability.",
        },
      },
    ],
  },
};

export function getLessonById(lessonId: string): Lesson | undefined {
  return cropAdvisorCourse.modules
    .flatMap(module => module.lessons)
    .find(lesson => lesson.id === lessonId);
}

export function getModuleForLesson(lessonId: string): CourseModule | undefined {
  return cropAdvisorCourse.modules.find(module =>
    module.lessons.some(lesson => lesson.id === lessonId)
  );
}

export function getAssessmentById(assessmentId: string): Assessment | undefined {
  if (cropAdvisorCourse.finalAssessment.id === assessmentId) {
    return cropAdvisorCourse.finalAssessment;
  }
  return cropAdvisorCourse.modules
    .map(module => module.assessment)
    .find(assessment => assessment.id === assessmentId);
}

export function getModuleForAssessment(assessmentId: string): CourseModule | undefined {
  return cropAdvisorCourse.modules.find(
    module => module.assessment.id === assessmentId
  );
}
