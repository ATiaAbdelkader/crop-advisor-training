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
  duration: "Approx. 16 hours",
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
    {
      id: "cost-planning-and-decisions",
      index: 5,
      title: "Cost planning and decisions",
      eyebrow: "Module 05",
      description:
        "Turn a vegetable-production objective into tasks, resource quantities, costs, expected returns, and a decision to proceed or revise the plan.",
      lessons: [
        {
          id: "set-objectives-map-activities",
          title: "Set objectives and map activities",
          duration: "24 min",
          kicker: "Plan before spending",
          summary:
            "Establish a clear production objective, estimate the scale of the crop, and map the activity sequence, resources, and timing needed to deliver it.",
          outcomes: [
            "Write a production objective that states crop, area, season, and intended production context.",
            "Estimate plant numbers from a crop-guide density and a measured field area.",
            "Map crop-cycle tasks, resources, and timing from land preparation through harvest and post-harvest handling.",
          ],
          sections: [
            {
              heading: "Start with a measurable production objective",
              body:
                "Cost planning begins with a specific objective rather than a general desire to grow vegetables. In the document scenario, the objective is to establish a tomato crop on 500 m² during the dry season. Measure field length and width, confirm the crop and season with the farmer, and check what varieties are available. A measurable objective gives every later quantity, task, and cost a clear basis.",
              callout:
                "A cost estimate is only as useful as the production objective and field area on which it is based.",
            },
            {
              heading: "Translate the crop guide into a field estimate",
              body:
                "Use crop-guide information to make a first estimate of the crop scale. The document illustrates a guide density of 26,600 tomato plants per 10,000 m². For a 500 m² field, the quick estimate is 1,330 plants: divide the guide density by 10,000 and multiply by the field area. Expected production is then estimated from the expected yield per plant and the planned plant population. When a farm-gate price is available, expected returns equal expected kilograms multiplied by the price per kilogram.",
            },
            {
              heading: "List the work before pricing it",
              body:
                "Create a crop-cycle task list from land preparation to harvest and post-harvest operations. The source document includes clearing, ploughing, bed preparation, basal fertilisation, nursery set-up, sowing and seedling care, transplanting, watering, fertiliser application, pest management, trellising, pruning, fruit thinning, harvesting, and other crop-specific activities. For each activity, identify the resources and inputs needed and when they are needed, such as labour and a plough in the first week, seed trays and media for seedling production, mulch for bed preparation, and water infrastructure during field layout.",
            },
          ],
        },
        {
          id: "compute-costs-test-returns",
          title: "Compute costs and test returns",
          duration: "30 min",
          kicker: "Quantity, cost, and decision",
          summary:
            "Calculate the physical quantities behind a vegetable plan, price the required inputs, estimate plausible returns, and revise a plan when the numbers do not justify the risk.",
          outcomes: [
            "Calculate bed, mulch, plant, seedling, seed-tray, fertiliser, and other input quantities from a field layout.",
            "Include a seedling-production allowance and use locally relevant input prices in the cost plan.",
            "Compare potential returns with production costs and revise the plan when costs are not justified by likely benefits.",
          ],
          sections: [
            {
              heading: "Calculate quantities from the field layout",
              body:
                "Work from dimensions rather than guesses. In the 20 m by 25 m tomato example, a 1 m bed plus a 0.5 m canal requires 1.5 m across the field, so 25 m ÷ 1.5 m gives 16 whole beds. Leave 0.5 m at each end for path and drainage, producing a 19 m bed length. Plastic mulch required is therefore 16 beds × 19 m = 304 m. With 0.5 m plant spacing and two rows per bed, each bed holds (19 ÷ 0.5) × 2 = 76 plants, for a minimum of 1,216 plants in the field.",
              callout:
                "Use whole, workable units. A fractional bed or a partially priced packet cannot be treated as a full production resource without a clear adjustment.",
            },
            {
              heading: "Build a realistic input cost plan",
              body:
                "Add a safety allowance where production losses are likely. The document uses a 30% seedling allowance: 1,216 plants plus 30% gives 1,581 seedlings or seeds to plan for. Divide seeds required by seeds per packet, round up to a whole packet, then multiply by the actual local packet price. The same process applies to seed trays: 1,581 seeds in 104-hole trays require 16 trays after rounding. Price fertilizers, liming where soil pH requires it, mulch, trellis materials, water and irrigation components, crop-protection inputs, labour, and any other resource identified in the activity plan.",
            },
            {
              heading: "Test the plan against plausible returns",
              body:
                "Estimate yield and return using a realistic crop population rather than assuming every plant will produce. In the tomato example, if 70% of 1,216 plants produce and yield averages 2 kg per producing plant, estimated yield is about 1,702 kg. Multiply this by a relevant farm-gate price to estimate return. Place all costs and returns in a spreadsheet or farm record. If projected costs are high compared with potential returns, review the plan, lower avoidable costs, adjust the production strategy, or defer the decision. Store the plan and actual costs so future decisions can improve on the estimate.",
            },
          ],
        },
      ],
      assessment: {
        id: "cost-planning-and-decisions-check",
        title: "Cost planning and decisions check",
        description:
          "Apply the document’s objective, activity, quantity, cost, and return calculations to a vegetable-production decision.",
        kind: "module",
        passMark: 80,
        questions: [
          {
            id: "cp-1",
            prompt:
              "Which production objective gives the strongest basis for a vegetable cost plan?",
            options: [
              { id: "a", label: "Grow some tomatoes whenever there is spare time." },
              { id: "b", label: "Establish a tomato crop on a measured 500 m² field during the dry season." },
              { id: "c", label: "Buy inputs first, then decide what crop will be grown." },
              { id: "d", label: "Use the same plant population for every field without measuring it." },
            ],
            correctOptionId: "b",
            feedback: {
              correct:
                "Correct. Crop, measured area, and timing give later resource and cost estimates a defined basis.",
              incorrect:
                "A usable production objective specifies the crop, a measurable production area, and the relevant season or production context.",
            },
          },
          {
            id: "cp-2",
            prompt:
              "A field is 25 m wide. Beds are 1 m wide and each canal is 0.5 m wide. How many whole beds fit across the field?",
            options: [
              { id: "a", label: "12 beds" },
              { id: "b", label: "16 beds" },
              { id: "c", label: "25 beds" },
              { id: "d", label: "50 beds" },
            ],
            correctOptionId: "b",
            feedback: {
              correct:
                "Correct. Each bed-and-canal unit is 1.5 m, so 25 ÷ 1.5 gives 16 whole workable beds.",
              incorrect:
                "Calculate the bed-and-canal unit first: 1 m + 0.5 m = 1.5 m; 25 ÷ 1.5 allows 16 whole beds.",
            },
          },
          {
            id: "cp-3",
            prompt:
              "A layout requires a minimum of 1,216 field plants. Why does the document plan 1,581 seedlings or seeds?",
            options: [
              { id: "a", label: "To allow a 30% safety margin for seedling production and transplanting losses." },
              { id: "b", label: "Because every bed must have three rows." },
              { id: "c", label: "Because seed costs should always be tripled." },
              { id: "d", label: "To avoid checking seed-tray capacity." },
            ],
            correctOptionId: "a",
            feedback: {
              correct:
                "Correct. The 30% allowance provides a practical safety net for losses before plants reach the field.",
              incorrect:
                "The planned number includes a 30% allowance so that seedling-production and transplanting losses do not reduce the required field population.",
            },
          },
          {
            id: "cp-4",
            prompt:
              "What should an advisor do when calculated production costs are too high compared with plausible returns?",
            options: [
              { id: "a", label: "Proceed without recording the figures because market prices may improve." },
              { id: "b", label: "Review the plan, identify ways to lower avoidable costs or adjust the strategy, and retain the cost-and-return record." },
              { id: "c", label: "Increase the expected yield estimate until the plan looks profitable." },
              { id: "d", label: "Ignore labour, equipment, and crop-protection costs." },
            ],
            correctOptionId: "b",
            feedback: {
              correct:
                "Correct. The document’s decision cycle requires reviewing and revising a plan when expected benefits do not justify its costs.",
              incorrect:
                "When the financial case is weak, review the costs and strategy rather than changing assumptions or omitting real resources.",
            },
          },
        ],
      },
    },
    {
      id: "crop-and-variety-selection",
      index: 6,
      title: "Crop and variety selection",
      eyebrow: "Module 06",
      description:
        "Select crops and varieties with farmers by balancing crop family, rotation, local adaptability, market preference, and practical production knowledge.",
      lessons: [
        {
          id: "use-crop-families-to-plan-rotation",
          title: "Use crop families to plan rotation",
          duration: "22 min",
          kicker: "Choose with the crop system in mind",
          summary:
            "Recognise major vegetable families and use the family relationship to plan field layout, crop rotation, and pest, disease, and nutrient-risk management.",
          outcomes: [
            "Identify major vegetable families and representative crops relevant to field planning.",
            "Explain why family groupings matter when designing a rotation.",
            "Use crop family knowledge to anticipate management and production risks before planting.",
          ],
          sections: [
            {
              heading: "Know why the crop choice matters",
              body:
                "Choosing what to plant affects field layout, day-to-day crop management, pest and disease strategy, and the rotation plan. Vegetable crops can offer several crop cycles per year because many have short production periods, but they can also respond quickly to environmental stress and pest or disease attack. Diversifying crops and varieties is therefore a production-risk decision as well as a market decision.",
              callout:
                "Crop and variety selection should fit both the market opportunity and the risk profile of the field and season.",
            },
            {
              heading: "Read the vegetable family",
              body:
                "Vegetable families group crops with related characteristics. The source document highlights Solanaceae, including eggplant, hot pepper, sweet pepper, and tomato; Brassicaceae, including cauliflower, broccoli, pechay, kale, and cabbage; Fabaceae, including cowpea, mungbean, snap bean, and yardlong bean; Cucurbitaceae, including squash, cucumber, bitter gourd, bottle gourd, ridge gourd, melon, and watermelon; Poaceae, including sweet corn and rice; and Malvaceae, represented by okra. It also lists Amaryllidaceae such as onion, garlic, leek, and chive; Asteraceae such as lettuce; Caricaceae such as papaya; Convolvulaceae such as sweet potato and kangkong; Amaranthaceae such as amaranth, beet, chard, and spinach; Apiaceae such as carrot, coriander, parsley, and celery; and Lamiaceae such as mint, basil, rosemary, and thyme.",
            },
            {
              heading: "Rotate to interrupt problems",
              body:
                "Family knowledge is important for crop rotation because repeated related crops can contribute to the build-up of pests and diseases and to nutrient depletion. A rotation plan should therefore record the current and previous crop families, not only individual crop names. Use this information with field history, nearby crop pressure, and the next intended crop to decide whether a different family offers a better risk-managed option.",
            },
          ],
        },
        {
          id: "match-variety-to-market-and-site",
          title: "Match variety to market and site",
          duration: "28 min",
          kicker: "Adaptability and acceptability",
          summary:
            "Develop crop-and-variety selection criteria that combine buyer preference, field conditions, season, elevation, farmer experience, and reliable local product information.",
          outcomes: [
            "Define buyer-facing variety characteristics such as size, shape, colour, flavour, firmness, and nutritional quality.",
            "Assess variety adaptability against local environmental conditions, elevation, and growing-season temperatures.",
            "Involve farmers and local information sources in a documented crop-and-variety decision.",
          ],
          sections: [
            {
              heading: "Start with market acceptability",
              body:
                "Varieties must have characteristics desired by buyers. These can include size, shape, colour, flavour, firmness, and nutritional quality. Visit vegetable markets and speak with vendors and collectors to understand which characteristics are accepted, which products are consistently available, and where a market opportunity may exist. A high-yielding variety that buyers do not accept may not deliver the expected return.",
              callout:
                "A variety decision should make the buyer’s preferred product characteristics explicit before seed is purchased.",
            },
            {
              heading: "Test adaptability against the local site and season",
              body:
                "A variety must perform under the range of environmental conditions expected in the assignment area and during the growing season. Review last year’s meteorological conditions and current forecasts or seasonal provisions. Elevation is also a useful planning clue: the document groups vegetables as low elevation below 300 metres above sea level, mid elevation from above 300 to 1,000 metres, and high elevation from above 1,000 to below 2,500 metres. Some crops, including tomato, cucumber, sweet pepper, lettuce, cabbage, cauliflower, and broccoli, are identified as variety dependent, so local seed-supplier information is essential.",
            },
            {
              heading: "Decide with the farmer and reliable information",
              body:
                "Discuss crop and variety options with the farmer when starting a demonstration or production cycle. Check what has worked for the key farmer and farmers nearby, what crops the farmer already knows, and what information they can access. Advisors should also make sure they can obtain reliable product and technical information from local vendors, agro-dealers, sales teams, or local seed suppliers. The final choice should document market preference, adaptability, crop-family implications, farmer capability, and the evidence used.",
            },
          ],
        },
      ],
      assessment: {
        id: "crop-and-variety-selection-check",
        title: "Crop and variety selection check",
        description:
          "Apply crop-family, rotation, adaptability, market-preference, and farmer-participation criteria to a defensible crop-and-variety decision.",
        kind: "module",
        passMark: 80,
        questions: [
          {
            id: "cv-1",
            prompt:
              "Why should an advisor identify the vegetable family of crops already grown in a field before recommending the next crop?",
            options: [
              { id: "a", label: "Related crops can contribute to pest, disease, and nutrient-risk build-up when repeatedly grown in the same sequence." },
              { id: "b", label: "All crop families require identical management." },
              { id: "c", label: "Family identity replaces the need to review field history." },
              { id: "d", label: "Crop rotation is unnecessary for vegetables with short cycles." },
            ],
            correctOptionId: "a",
            feedback: {
              correct:
                "Correct. Family-aware rotation helps interrupt related pest and disease pressure and avoids repeatedly placing similar nutrient demands on the field.",
              incorrect:
                "Crop family matters because repeated related crops can contribute to pest, disease, and nutrient-risk build-up in a rotation.",
            },
          },
          {
            id: "cv-2",
            prompt:
              "Which criterion is most directly linked to market acceptability when selecting a variety?",
            options: [
              { id: "a", label: "The buyer’s desired size, shape, colour, flavour, firmness, and nutritional quality." },
              { id: "b", label: "Only the number of crops grown in the prior year." },
              { id: "c", label: "Whether a variety has the longest maturity period." },
              { id: "d", label: "The colour of the seed packet." },
            ],
            correctOptionId: "a",
            feedback: {
              correct:
                "Correct. Market acceptability is about the product characteristics that vendors, collectors, and buyers prefer.",
              incorrect:
                "Use direct market information to identify the size, shape, colour, flavour, firmness, and nutritional characteristics buyers want.",
            },
          },
          {
            id: "cv-3",
            prompt:
              "What is the most appropriate way to assess whether a tomato variety is suitable for a specific assignment area?",
            options: [
              { id: "a", label: "Assume all tomato varieties are equally adapted at every elevation and season." },
              { id: "b", label: "Compare the variety’s traits with local elevation, expected temperatures, seasonal conditions, and reliable supplier information." },
              { id: "c", label: "Select the variety only because it has a familiar name." },
              { id: "d", label: "Ignore meteorological history if market demand is high." },
            ],
            correctOptionId: "b",
            feedback: {
              correct:
                "Correct. Adaptability requires a fit between the variety, site elevation, growing-season environment, and locally reliable information.",
              incorrect:
                "Assess variety adaptability against elevation, expected temperatures, seasonal conditions, and local technical or supplier evidence.",
            },
          },
          {
            id: "cv-4",
            prompt:
              "Which decision process best involves the farmer in crop and variety selection?",
            options: [
              { id: "a", label: "Choose the variety alone, then ask the farmer to purchase the inputs." },
              { id: "b", label: "Discuss what has worked locally, farmer experience and preferences, buyer needs, and verified product information before recording the choice." },
              { id: "c", label: "Use only an advisor’s prior preference, regardless of local context." },
              { id: "d", label: "Avoid talking with nearby farmers because their experience is not relevant." },
            ],
            correctOptionId: "b",
            feedback: {
              correct:
                "Correct. A defensible selection process combines farmer knowledge, nearby experience, buyer requirements, and reliable local information.",
              incorrect:
                "Involve the farmer and document the evidence: local experience, market requirements, site adaptability, and verified product information.",
            },
          },
        ],
      },
    },
    {
      id: "factors-affecting-crop-yield",
      index: 7,
      title: "Factors affecting crop yield",
      eyebrow: "Module 07",
      description:
        "Connect seed genetics, climate, soil, and topography to crop performance, yield risk, and practical adaptation decisions.",
      lessons: [
        {
          id: "match-seed-genetics-to-production-goal",
          title: "Match seed genetics to the production goal",
          duration: "22 min",
          kicker: "Yield potential begins with genetics",
          summary:
            "Distinguish open-pollinated and hybrid seed systems, then use genetic characteristics to select seed that suits the production objective and management context.",
          outcomes: [
            "Explain how genetic and environmental factors jointly affect crop yield.",
            "Distinguish open-pollinated from hybrid seed systems and their seed-saving implications.",
            "Relate seed traits such as yield potential, resistance, maturity, fruit quality, and shelf life to a production objective.",
          ],
          sections: [
            {
              heading: "Yield is shaped by genetics and environment",
              body:
                "Crop yield is affected by two broad groups of factors. Genetic factors are inherent in the plant’s makeup. Environmental factors include climatic or physical conditions, edaphic soil properties, and topographic conditions. Sound advisory work does not treat these as separate checklists: seed potential can only be realised when the crop is matched to the environment and managed appropriately.",
              callout:
                "A high-potential seed cannot compensate for a poor fit between crop, season, soil, and landscape position.",
            },
            {
              heading: "Recognise the seed system",
              body:
                "Open-pollinated varieties are naturally pollinated by agents such as insects or wind and originate from one parent; when genetic purity is maintained through proper selection, seed can be saved for a following season. Hybrid varieties result from controlled cross-pollination between male and female parents. The document advises that saving hybrid seed is not recommended because the next generation will not reliably reproduce the intended hybrid characteristics.",
            },
            {
              heading: "Select traits for the decision in front of you",
              body:
                "Hybrids may be bred for high yield per unit area or time, pest and disease tolerance or resistance, earlier maturity than open-pollinated varieties, stable and distinct fruit quality, and longer shelf life. These traits are useful only when they address the farmer’s production objective, the local market, the season, and the expected management capacity. Compare the seed characteristics with the crop-and-variety criteria already developed in the learning pathway rather than selecting on potential yield alone.",
            },
          ],
        },
        {
          id: "read-environmental-yield-factors",
          title: "Read environmental yield factors",
          duration: "27 min",
          kicker: "Climate, soil, and landscape",
          summary:
            "Identify the climatic, edaphic, and topographic elements that influence crop growth and use their interactions to plan adaptation in vegetable production.",
          outcomes: [
            "List key climatic, soil, and topographic factors affecting crop growth and development.",
            "Explain how environmental factors interact with genetic potential to influence yield.",
            "Use local environmental information to prepare practical adaptations to climate-related production risk.",
          ],
          sections: [
            {
              heading: "Monitor the climatic factors",
              body:
                "Climatic or physical factors include light or irradiance, temperature, water or moisture supply, air composition, relative humidity, and wind. These factors influence growth and development throughout the crop cycle. Record the expected season, recent weather pattern, and field-level exposure before deciding on crop timing, variety, irrigation, protection, or other management adjustments.",
            },
            {
              heading: "Assess the soil and landscape together",
              body:
                "Edaphic factors include the soil’s physical, chemical, and biological properties. Topographic factors include elevation or altitude and its relationship with temperature, the slope of the land, and location expressed through latitude and longitude. A crop can experience a different yield environment within a short distance when slope, elevation, drainage, soil depth, or exposure change. Link this observation to the soil-context and site-appraisal approaches developed earlier in the pathway.",
              callout:
                "Environmental interpretation should lead to a practical management decision, not a generic description of conditions.",
            },
            {
              heading: "Use relationships to adapt, not merely explain",
              body:
                "Food production is strongly affected by the three environmental groups and is vulnerable to climate-change phenomena. Understanding the elements and their relationships makes it possible to prepare adaptations in vegetable production. Use locally available product information, agro-dealers or vendors, and local technical support to check crops and varieties suited to the area and season. Then record the planned response to the relevant climate, soil, or topographic risk rather than assuming conditions will remain unchanged.",
            },
          ],
        },
      ],
      assessment: {
        id: "factors-affecting-crop-yield-check",
        title: "Factors affecting crop yield check",
        description:
          "Apply genetic, climatic, soil, and topographic concepts to realistic seed and yield-risk decisions.",
        kind: "module",
        passMark: 80,
        questions: [
          {
            id: "fy-1",
            prompt:
              "Which statement best distinguishes an open-pollinated variety from a hybrid variety for seed saving?",
            options: [
              { id: "a", label: "Open-pollinated seed can be saved when genetic purity is maintained; saving hybrid seed is not recommended." },
              { id: "b", label: "Hybrid seed always comes from one parent and can be saved indefinitely." },
              { id: "c", label: "Neither seed system has any genetic connection to yield." },
              { id: "d", label: "Open-pollinated varieties are only pollinated by breeders and workers." },
            ],
            correctOptionId: "a",
            feedback: {
              correct: "Correct. Properly maintained open-pollinated seed can retain genetic purity, while hybrid seed does not reliably reproduce the intended hybrid traits in the next generation.",
              incorrect: "Open-pollinated varieties can provide saved seed when selection maintains purity; hybrid seed is produced through controlled crossing and should not normally be saved for the next crop.",
            },
          },
          {
            id: "fy-2",
            prompt:
              "Which trait is a valid reason to consider a hybrid variety for a particular production objective?",
            options: [
              { id: "a", label: "It may be bred for early maturity, disease tolerance or resistance, stable fruit quality, or longer shelf life." },
              { id: "b", label: "It removes the need to consider local climate or soil conditions." },
              { id: "c", label: "It guarantees the same yield under every management system." },
              { id: "d", label: "It allows any saved seed to reproduce the hybrid exactly." },
            ],
            correctOptionId: "a",
            feedback: {
              correct: "Correct. Hybrid traits can support a defined objective, but the variety must still be matched to the local environment and management context.",
              incorrect: "Hybrids may offer useful traits such as earliness, resistance, fruit quality, and shelf life, but they do not remove environmental or management constraints.",
            },
          },
          {
            id: "fy-3",
            prompt:
              "Which group contains only climatic or physical factors identified in the source document?",
            options: [
              { id: "a", label: "Light, temperature, moisture supply, relative humidity, and wind." },
              { id: "b", label: "Soil biological properties, soil chemical properties, and slope." },
              { id: "c", label: "Elevation, latitude, and soil texture." },
              { id: "d", label: "Crop family, seed parentage, and shelf life." },
            ],
            correctOptionId: "a",
            feedback: {
              correct: "Correct. Light, temperature, water or moisture supply, air, relative humidity, and wind are climatic factors in the document’s framework.",
              incorrect: "Climatic factors include light, temperature, water or moisture supply, air composition, relative humidity, and wind.",
            },
          },
          {
            id: "fy-4",
            prompt:
              "Why should an advisor study the relationship among climate, soil, and topography before recommending a crop-management response?",
            options: [
              { id: "a", label: "Because understanding their interactions supports practical adaptation to yield risk and climate-change effects." },
              { id: "b", label: "Because environmental factors affect yield only after harvest." },
              { id: "c", label: "Because one environmental factor always explains all field variability." },
              { id: "d", label: "Because seed genetics have no relationship with environmental conditions." },
            ],
            correctOptionId: "a",
            feedback: {
              correct: "Correct. The purpose is to use environmental understanding for proactive, context-specific adaptation rather than simply describing conditions.",
              incorrect: "Environmental factors interact with each other and with genetics; understanding those relationships supports practical adaptation to crop-yield risk.",
            },
          },
        ],
      },
    },
    {
      id: "climatic-factors-affecting-crop-yield",
      index: 8,
      title: "Climatic factors and crop yield",
      eyebrow: "Module 08",
      description:
        "Use light, temperature, water, air, humidity, and wind evidence to choose crops, plan seasons, and reduce climate-related yield risk.",
      lessons: [
        {
          id: "plan-with-light-and-temperature",
          title: "Plan with light and temperature",
          duration: "28 min",
          kicker: "Seasonal energy and heat",
          summary:
            "Connect light and temperature requirements to photosynthesis, crop development, variety choice, and a locally relevant year-round crop calendar.",
          outcomes: [
            "Explain how light quantity, quality, and duration affect plant growth and flowering.",
            "Classify crops by light and photoperiod response when planning a crop calendar.",
            "Match crop and variety temperature requirements to local growing conditions.",
          ],
          sections: [
            {
              heading: "Balance growth processes before selecting a crop",
              body:
                "Plant growth depends on a workable balance among photosynthesis, respiration, and transpiration. Light provides the energy used in photosynthesis, while temperature influences all three processes and affects germination, flowering, fruiting, and the transition from vegetative to reproductive growth. A crop calendar should therefore start with the expected light and temperature pattern, not only a preferred market date.",
              callout:
                "A year-round crop calendar is a practical climate decision: it matches crop and variety requirements to the most likely local conditions.",
            },
            {
              heading: "Read light quantity, quality, and duration",
              body:
                "Light quantity is the intensity of sunlight and changes through the year. Shade plants need lower intensity, partial-shade plants need moderate intensity, sun plants need high intensity, and some crops tolerate a wide range. Light quality is the wavelength reaching the plant; red and blue light are especially important for plant growth. Light duration is the time a plant is exposed to light. Day-neutral crops such as tomato, pepper, cucurbits, cowpea, okra, French bean, and amaranth have no preferential photoperiod for flowering. Long-day crops such as potato, onion, lettuce, cabbage, cauliflower, radish, spinach, beet, turnip, and carrot need longer light periods, while short-day crops such as sweet potato, Indian spinach, hyacinth bean, cluster bean, and winged bean flower under shorter light periods.",
            },
            {
              heading: "Classify temperature fit before planting",
              body:
                "Temperature affects the speed of respiration: in general, respiration is slower at lower temperature and increases as temperature rises. The source distinguishes cool-season and warm-season vegetable requirements. For example, many cool-season crops such as broccoli, cabbage, radish, spinach, turnip, carrot, cauliflower, pea, and potato have optimum ranges around 15–18 °C, while warm-season crops include tomato and sweet pepper around 21–24 °C, cucurbits around 18–24 °C, and chili, eggplant, okra, sweet potato, and watermelon around 21–29 °C. Use locally available varieties bred for the expected light and temperature conditions rather than assuming all varieties share the same adaptation.",
            },
          ],
        },
        {
          id: "manage-water-air-humidity-and-wind",
          title: "Manage water, air, humidity, and wind",
          duration: "30 min",
          kicker: "Water relations and exposure",
          summary:
            "Recognise crop-stage water needs and manage the effects of air, relative humidity, and wind on transpiration, disease pressure, plant condition, and yield.",
          outcomes: [
            "Relate water supply to germination, vegetative growth, flowering, fruiting, and harvest quality.",
            "Explain how air composition and relative humidity affect photosynthesis, transpiration, nutrient uptake, and disease risk.",
            "Identify wind benefits, wind-stress damage, and field-management responses.",
          ],
          sections: [
            {
              heading: "Match water supply to the crop stage",
              body:
                "Water activates enzymes needed for germination; without it, germination will not proceed. During vegetative growth, water supports photosynthesis, and shortage limits food production and causes stunting. At flowering, shortage can cause flowers to abort. During fruiting, water carries calcium from soil to plant tissues; a limitation can contribute to fruit disease such as blossom-end rot. At harvest, water fills plant cells; limited supply can result in lighter produce and shortened shelf life. Water also maintains turgor: when water is inadequate, stomata close, leaves may curl downward, and the plant becomes flaccid rather than turgid.",
              callout:
                "Do not treat irrigation as a single seasonal quantity—plan it against the crop stage and the yield or quality risk at that stage.",
            },
            {
              heading: "Use air and humidity as crop-health signals",
              body:
                "Air is mostly nitrogen and oxygen, with a small proportion of carbon dioxide, water vapour, and other gases. In photosynthesis, light energy combines carbon dioxide and water to produce sugars and releases oxygen. Relative humidity is the amount of water in air expressed as a percentage. Drier air outside the leaf raises transpiration. Very low humidity can lead to wilting, stunting, small leaves, tip burn, and leaf curl. Very high humidity can reduce nutrient uptake and increase fungal disease risk. Monitor field conditions and disease signals rather than relying on a single humidity reading.",
            },
            {
              heading: "Reduce wind stress while preserving benefits",
              body:
                "Moderate wind can support pollination, replenish carbon dioxide around the crop, and increase photosynthesis. However, wind also increases transpiration; hot winds accelerate drying and may contribute to tip burn. Strong wind can damage seedlings and shoots, cause flower or fruit drop, uproot plants, and puncture tissues that become entry points for pathogens. Practical management includes reducing wind velocity with windbreaks, supporting crops with trellises and tying, trapping soil particles with mulch or cover crops, and aligning field layout with the wind direction where possible.",
            },
          ],
        },
      ],
      assessment: {
        id: "climatic-factors-affecting-crop-yield-check",
        title: "Climatic factors and crop yield check",
        description:
          "Apply light, temperature, water, humidity, and wind concepts to year-round crop planning and climate-risk management decisions.",
        kind: "module",
        passMark: 80,
        questions: [
          {
            id: "cf-1",
            prompt:
              "A grower is preparing a calendar for a crop that does not require a particular day length to flower. Which group contains day-neutral examples from the source document?",
            options: [
              { id: "a", label: "Tomato, pepper, cucurbits, cowpea, and okra." },
              { id: "b", label: "Onion, cabbage, cauliflower, and radish only." },
              { id: "c", label: "Sweet potato, hyacinth bean, and winged bean only." },
              { id: "d", label: "All vegetables require the same photoperiod." },
            ],
            correctOptionId: "a",
            feedback: {
              correct: "Correct. The document identifies tomato, pepper, cucurbits, cowpea, and okra among the day-neutral crops.",
              incorrect: "Day-neutral examples include tomato, pepper, cucurbits, cowpea, okra, French bean, and amaranth; long-day and short-day crops have different flowering responses.",
            },
          },
          {
            id: "cf-2",
            prompt:
              "What is the most likely crop-stage consequence of inadequate water at flowering?",
            options: [
              { id: "a", label: "Flowers are more likely to abort." },
              { id: "b", label: "Germination is activated more quickly." },
              { id: "c", label: "Fruit cells are filled more completely at harvest." },
              { id: "d", label: "The plant always develops deeper roots without yield effects." },
            ],
            correctOptionId: "a",
            feedback: {
              correct: "Correct. Water shortage during flowering can cause flowers to abort and reduce later fruit set.",
              incorrect: "The document links limited water at flowering with flower abortion; plan water supply by crop stage to protect yield formation.",
            },
          },
          {
            id: "cf-3",
            prompt:
              "Which combination best describes the risk of very high relative humidity in a vegetable crop?",
            options: [
              { id: "a", label: "Reduced nutrient uptake and increased fungal disease risk." },
              { id: "b", label: "Guaranteed resistance to leaf diseases and better nutrient uptake." },
              { id: "c", label: "No relationship with crop health or disease conditions." },
              { id: "d", label: "Only improved pollination with no other implications." },
            ],
            correctOptionId: "a",
            feedback: {
              correct: "Correct. Very high humidity can reduce nutrient uptake and favour fungal disease conditions.",
              incorrect: "High humidity requires crop-health attention because it can reduce nutrient uptake and increase fungal disease risk.",
            },
          },
          {
            id: "cf-4",
            prompt:
              "Which field action is an appropriate response to damaging wind exposure?",
            options: [
              { id: "a", label: "Use windbreaks, support crops with trellises and tying, and use mulch or cover crops to trap soil particles." },
              { id: "b", label: "Remove all supports so wind can bend the plants freely." },
              { id: "c", label: "Align every field layout directly against the prevailing wind where possible." },
              { id: "d", label: "Assume wind only affects pollination and cannot damage plants." },
            ],
            correctOptionId: "a",
            feedback: {
              correct: "Correct. Windbreaks, crop support, ground cover, and thoughtful field orientation can reduce wind stress while retaining the benefits of moderate air movement.",
              incorrect: "Strong wind can cause physical damage, flower or fruit loss, and excessive transpiration; reduce exposure with windbreaks, support, ground cover, and suitable orientation.",
            },
          },
        ],
      },
    },
    {
      id: "topographic-factors-affecting-crop-yield",
      index: 9,
      title: "Topographic factors and crop yield",
      eyebrow: "Module 09",
      description:
        "Read elevation, slope, landform, exposure, and farm-site features to reduce erosion and water risks and improve crop placement decisions.",
      lessons: [
        {
          id: "read-elevation-and-landform",
          title: "Read elevation and landform",
          duration: "24 min",
          kicker: "The shape and height of the land",
          summary:
            "Identify natural and man-made topographic features, distinguish lowland, mid-elevation, and highland production areas, and relate elevation to crop and variety fit.",
          outcomes: [
            "Define topography as the shape and slope of land and identify relevant natural and man-made features.",
            "Classify a production site by lowland, mid-elevation, or highland context.",
            "Use elevation and temperature relationships to select crops and varieties suited to the field.",
          ],
          sections: [
            {
              heading: "Describe the land before prescribing a crop",
              body:
                "Topography means the shape of the land and the extent to which it slopes. Some land has a gentle slope and some a steep slope; steep slopes tend to be more severely affected by soil erosion. Vegetable crops may be planted in mountains, hills, valleys, plains, or low-lying areas, and their performance is affected by water infiltration, runoff, erosion, elevation, slope, and exposure to sun. Start the field description by locating both natural features—mountains, hills, valleys, and plains—and man-made features such as roads, dams, and common irrigation facilities.",
              callout:
                "A topographic description becomes useful only when it changes the crop, layout, water, erosion, or site-management decision.",
            },
            {
              heading: "Use elevation to test crop and variety fit",
              body:
                "Elevation is commonly recorded as metres above sea level. Low elevation areas include valleys and plains; medium elevation areas include hills; and high elevation areas include mountains. The source highlights that roughly 70% of vegetables are lowland adapted and that highland cultivars of crops such as capsicum pepper may not perform well in lowland conditions, and vice versa. Locate the elevation of the place and each farm field using a mapping website or other reliable source, then compare it with planned crops and available varieties.",
            },
            {
              heading: "Link elevation with temperature and observation",
              body:
                "Elevation changes the temperature environment experienced by the crop. Rather than assuming that a crop name guarantees adaptation, use elevation together with local temperature, season, and variety information. Record multiple fields separately when they differ in elevation, landform, or exposure. This provides a transparent basis for choosing a suitable demo-farm crop, assessing why a variety may be underperforming, and returning to the crop-and-variety selection process when the site evidence does not fit the original plan.",
            },
          ],
        },
        {
          id: "map-slope-water-and-farm-risk",
          title: "Map slope, water, and farm risk",
          duration: "29 min",
          kicker: "Use the terrain as evidence",
          summary:
            "Use slope, water movement, exposure, and a field sketch to choose bed orientation, control erosion and runoff, and identify site-specific climate and access risks.",
          outcomes: [
            "Explain how slope influences infiltration, runoff, soil erosion, moisture distribution, and crop placement.",
            "Select practical erosion and runoff controls for hilly or sloping vegetable fields.",
            "Create a topographic farm sketch that combines elevation, slope, water, access, orientation, and local climate-risk information.",
          ],
          sections: [
            {
              heading: "Question easy assumptions about lower slopes",
              body:
                "It may appear easy to plant vegetables in the lower portion of a slope because water is available, but this requires careful observation. Topography affects infiltration, runoff, soil erosion, and moisture distribution. Compare different positions on a slope for water abundance, fertility, and likely yield rather than assuming one position is automatically better. Consider both immediate water availability and the risks of runoff, sediment movement, waterlogging, or loss of topsoil.",
              callout:
                "On a slope, ask where water comes from, where it goes, what it carries, and how those flows change the root-zone conditions for the crop.",
            },
            {
              heading: "Lay out beds to control runoff and erosion",
              body:
                "Hilly or sloping fields require an intentional bed layout. Use contouring and other runoff-control methods to slow water movement, reduce soil loss, and protect the field’s productive soil. The appropriate arrangement depends on the measured slope, the direction of water flow, access, water sources, and the crop’s sensitivity to drainage conditions. Treat bed orientation and water-control measures as part of the production plan, not as an afterthought once erosion is visible.",
            },
            {
              heading: "Make a map that supports decisions",
              body:
                "Use mapping and field observation to create a practical topographic sketch of the farm. Locate the site, map the farm area, record elevation, show roads, water sources, and houses, indicate slope, and mark east, west, north, and south. Add climate information such as temperature, sunlight hours, rainfall, droughts, floods, and the main strong-wind direction. Identify flood-prone areas on the sketch. The completed map helps farmers and advisors integrate topographic features with climatic and other yield factors when selecting a site, crop, layout, and risk-management plan.",
            },
          ],
        },
      ],
      assessment: {
        id: "topographic-factors-affecting-crop-yield-check",
        title: "Topographic factors and crop yield check",
        description:
          "Apply elevation, slope, landform, and mapping concepts to crop-placement and soil-and-water risk decisions.",
        kind: "module",
        passMark: 80,
        questions: [
          {
            id: "tf-1",
            prompt: "What does topography most directly describe in a farm-planning context?",
            options: [
              { id: "a", label: "The shape of the land, including its slope and related landscape features." },
              { id: "b", label: "Only the seed packet selected for the crop." },
              { id: "c", label: "Only the price received for harvested produce." },
              { id: "d", label: "The crop’s fertiliser analysis without considering the field." },
            ],
            correctOptionId: "a",
            feedback: {
              correct: "Correct. Topography is the shape of the land, including slope, elevation, landform, and the features that influence water and erosion processes.",
              incorrect: "Topography concerns the shape of the land and its slope, elevation, landforms, and related effects on water, erosion, and crop placement.",
            },
          },
          {
            id: "tf-2",
            prompt: "Why should an advisor verify a field’s elevation before recommending a crop variety?",
            options: [
              { id: "a", label: "Because lowland, mid-elevation, and highland environments differ, and a variety adapted to one may perform poorly in another." },
              { id: "b", label: "Because all vegetable varieties have identical elevation requirements." },
              { id: "c", label: "Because elevation changes seed cost but not crop performance." },
              { id: "d", label: "Because only roads and dams determine variety adaptation." },
            ],
            correctOptionId: "a",
            feedback: {
              correct: "Correct. Elevation is linked to the temperature environment and crop adaptation; verify the site before choosing a lowland, mid-elevation, or highland variety.",
              incorrect: "Elevation affects the crop environment. A variety that fits a highland field may not perform well in a lowland field, and vice versa.",
            },
          },
          {
            id: "tf-3",
            prompt: "What is a key purpose of contouring or similar layout control on a sloping vegetable field?",
            options: [
              { id: "a", label: "To slow runoff, reduce erosion, and protect productive soil." },
              { id: "b", label: "To make water move down the slope as quickly as possible." },
              { id: "c", label: "To remove the need to observe soil or water movement." },
              { id: "d", label: "To ensure all field positions receive identical moisture conditions." },
            ],
            correctOptionId: "a",
            feedback: {
              correct: "Correct. Contour-oriented management helps reduce the speed of runoff, limit soil loss, and protect the field’s productive root-zone conditions.",
              incorrect: "Runoff-control practices such as contouring are used to slow water movement, reduce erosion, and protect the productive soil resource.",
            },
          },
          {
            id: "tf-4",
            prompt: "Which information set should a practical topographic farm sketch include?",
            options: [
              { id: "a", label: "Farm area, elevation, slope, roads, water sources, houses, cardinal direction, flood-prone areas, and key climate information." },
              { id: "b", label: "Only the crop name and expected farm-gate price." },
              { id: "c", label: "Only a single elevation number, without field features or orientation." },
              { id: "d", label: "Only the date on which the map was drawn." },
            ],
            correctOptionId: "a",
            feedback: {
              correct: "Correct. A decision-ready farm sketch combines the terrain with access, water, orientation, flood exposure, and local climate information.",
              incorrect: "A useful topographic sketch includes elevation, slope, access and water features, orientation, and local climate risks so it can guide real field decisions.",
            },
          },
        ],
      },
    },
    {
      id: "edaphic-soil-factors-affecting-crop-yield",
      index: 10,
      title: "Edaphic soil factors and crop yield",
      eyebrow: "Module 10",
      description:
        "Assess physical, chemical, and biological soil properties with the farmer to interpret root-zone limits and choose evidence-led improvement actions.",
      lessons: [
        {
          id: "assess-physical-soil-properties",
          title: "Assess physical soil properties",
          duration: "30 min",
          kicker: "Structure, texture, and colour",
          summary:
            "Examine structure, texture, and colour in the field to interpret water, air, root growth, nutrient retention, and drainage conditions.",
          outcomes: [
            "Describe soil physical properties and relate structure, texture, and colour to crop performance.",
            "Conduct a field visual soil assessment when the soil is suitably moist.",
            "Use field observations to distinguish likely infiltration, drainage, erosion, and rooting constraints.",
          ],
          sections: [
            {
              heading: "Think in three soil-property lenses",
              body:
                "Edaphic means related to or caused by soil conditions without reference to climate. Soil quality has three connected dimensions: physical properties that can be seen, felt, or measured; chemical processes that affect nutrient availability and salinity; and biological activity that reflects the soil’s capacity to support life. The physical lens includes structure, texture, and colour, all of which influence infiltration, erosion, nutrient cycling, biological activity, roots, and water movement.",
              callout:
                "Whenever you see soil, assess physical, chemical, and biological properties together rather than turning one observation into a complete diagnosis.",
            },
            {
              heading: "Read structure, texture, and colour as field evidence",
              body:
                "Soil structure is the physical arrangement of particles, air, organic matter, solids, and water. Granular and aggregated structures generally have high permeability; blocky and columnar or prismatic structures have moderate permeability; platy and massive structures have lower permeability. Structure influences aeration, moisture, nutrient availability, biological activity, and root growth. Texture is the proportion of sand, silt, and clay. Sand has high aeration and drainage but lower water, nutrient, and organic-matter holding; clay has lower aeration and drainage but higher holding capacity and lower erosion susceptibility. Soil colour is influenced by organic matter, minerals, and drainage: black-brown often indicates good water relation and higher organic matter, yellow-red higher iron oxide and well-drained conditions, white-light grey leached nutrients, and bluish-grey poor drainage.",
            },
            {
              heading: "Conduct a careful field assessment with the farmer",
              body:
                "Assess physical soil when it is moist, not too dry and not too wet. For a visual soil assessment, make a 50 × 50 cm pit to inspect the profile, take a 25 × 25 cm cone from the top layer, place it on a flat surface, break it apart, and examine it. For texture, work a moist handful of soil, observe how it feels and sounds, push out a ribbon, and use a ribbon chart; laboratory particle-size analysis can confirm field impressions. Take photographs, write observations, and involve the farmer in identifying water movement, roots, texture, colour, and likely constraints.",
            },
          ],
        },
        {
          id: "interpret-chemical-and-biological-soil-health",
          title: "Interpret chemical and biological soil health",
          duration: "31 min",
          kicker: "Nutrients, pH, capacity, and life",
          summary:
            "Interpret nutrient availability, pH, cation exchange capacity, organic matter, and soil life before proposing a soil-management response.",
          outcomes: [
            "Explain how pH and cation exchange capacity influence nutrient availability and soil buffering.",
            "Connect organic matter and soil organisms with structure stability, nutrient cycling, and crop-supporting life.",
            "Produce a balanced soil assessment report with the farmer before recommending treatment.",
          ],
          sections: [
            {
              heading: "Use chemical evidence to explain nutrient availability",
              body:
                "Chemical soil properties include nutrients, pH, and cation exchange capacity (CEC). Soil nutrients are supplied through soil air, water, particles, and organic matter and include macro-nutrients such as phosphorus, potassium, calcium, magnesium, and sulfur as well as micro-nutrients. Soil pH measures acidity and alkalinity and influences nutrient uptake. The source identifies ranges from extremely acid below 4.5 through neutral 6.6–7.3 to very strongly alkaline above 9.1. Where an evidence-led treatment is appropriate, lime can be used to move extremely acidic soils toward slightly acidic conditions, while sulfur-based fertiliser can help adjust very strongly alkaline conditions toward mildly alkaline conditions.",
              callout:
                "A pH number is not a treatment instruction by itself: relate it to crop requirements, nutrient uptake, the full soil assessment, and farmer goals.",
            },
            {
              heading: "Use CEC and organic matter to understand holding capacity",
              body:
                "CEC measures a soil’s ability to hold positively charged ions or nutrients. It indicates nutrient-holding capacity, acts as a buffer against soil acidity, and is influenced by organic matter and structure stability. Instead of treating CEC as an isolated laboratory term, interpret it alongside texture, organic matter, pH, crop demand, and the practical options available to the farmer. Increasing or protecting organic matter can support structure stability and the soil’s capacity to retain and cycle nutrients.",
            },
            {
              heading: "Recognise the living soil",
              body:
                "Soil biological properties include organisms such as earthworms, nematodes, protozoa, fungi, bacteria, and arthropods; organic matter; nitrogen fixation; and carbon cycling. Soil organisms affect physical properties and processes, carbon and energy flows, and nutrient cycling. A good assessment records visible soil life and organic matter alongside the physical and chemical observations. Engage the farmer in the assessment, explain what each observation can and cannot show, and use the combined evidence to set a realistic next check or management action.",
            },
          ],
        },
      ],
      assessment: {
        id: "edaphic-soil-factors-affecting-crop-yield-check",
        title: "Edaphic soil factors and crop yield check",
        description:
          "Apply physical, chemical, and biological soil evidence to diagnose root-zone constraints and plan an appropriate next action.",
        kind: "module",
        passMark: 80,
        questions: [
          {
            id: "sf-1",
            prompt: "Which three dimensions should a crop advisor consider when assessing soil as an edaphic factor?",
            options: [
              { id: "a", label: "Physical, chemical, and biological properties." },
              { id: "b", label: "Only soil colour, seed price, and market demand." },
              { id: "c", label: "Only rainfall, temperature, and wind direction." },
              { id: "d", label: "Only crop variety, field road, and household size." },
            ],
            correctOptionId: "a",
            feedback: { correct: "Correct. A complete edaphic assessment connects physical, chemical, and biological soil properties.", incorrect: "Soil quality should be assessed through physical, chemical, and biological properties, not from a single indicator." },
          },
          {
            id: "sf-2",
            prompt: "When is the most appropriate time to conduct a visual field assessment of soil physical properties?",
            options: [
              { id: "a", label: "When the soil is moist, but neither too dry nor too wet." },
              { id: "b", label: "Only when the soil is completely waterlogged." },
              { id: "c", label: "Only when the soil is baked dry and cannot be broken." },
              { id: "d", label: "Only after fertiliser has been spread across the field." },
            ],
            correctOptionId: "a",
            feedback: { correct: "Correct. Suitable moisture allows meaningful observation of soil structure and handling characteristics.", incorrect: "The source recommends a visual physical assessment when soil is moist—not too dry and not too wet." },
          },
          {
            id: "sf-3",
            prompt: "What does cation exchange capacity (CEC) indicate?",
            options: [
              { id: "a", label: "The soil’s ability to hold positively charged nutrients and buffer acidity." },
              { id: "b", label: "The number of hours of sunlight received by the crop." },
              { id: "c", label: "The maximum wind speed a field can tolerate." },
              { id: "d", label: "The crop’s market price at harvest." },
            ],
            correctOptionId: "a",
            feedback: { correct: "Correct. CEC is a nutrient-holding and acidity-buffering capacity that should be interpreted alongside texture and organic matter.", incorrect: "CEC describes the soil’s capacity to hold positively charged nutrients and help buffer soil acidity." },
          },
          {
            id: "sf-4",
            prompt: "Which observation is most consistent with a bluish-grey soil colour in the source’s basic field guide?",
            options: [
              { id: "a", label: "Poor drainage conditions that warrant further root-zone and water-movement assessment." },
              { id: "b", label: "Guaranteed high nutrient availability without further checks." },
              { id: "c", label: "A field that needs no physical assessment." },
              { id: "d", label: "A direct proof that the crop variety is unsuitable." },
            ],
            correctOptionId: "a",
            feedback: { correct: "Correct. Bluish-grey colour is associated with poor drainage in the source’s basic guide and should trigger further field assessment.", incorrect: "Bluish-grey soil is associated with poor drainage; investigate water movement, roots, structure, and management context before acting." },
          },
        ],
      },
    },
    {
      id: "soil-degradation-and-management",
      index: 11,
      title: "Soil degradation and management",
      eyebrow: "Module 11",
      description:
        "Identify erosion, nutrient depletion, acidification, salinization, compaction, and pollution, then match risk-reduction strategies to protect soil as a productive resource.",
      lessons: [
        {
          id: "recognise-soil-degradation-risks",
          title: "Recognise soil degradation risks",
          duration: "29 min",
          kicker: "Read the signals of decline",
          summary:
            "Identify major forms of soil degradation, their likely causes, and the field evidence that should trigger a management discussion with the farmer.",
          outcomes: [
            "Identify erosion, nutrient depletion, acidification, salinization, compaction, and chemical pollution as soil-management issues.",
            "Explain the main causes and crop consequences of soil erosion, nutrient depletion, and acidification.",
            "Recognise why soil protection is a fertility, crop-yield, and food-quality decision.",
          ],
          sections: [
            {
              heading: "Set the objective before choosing a treatment",
              body:
                "Soil management aims to restore fertility, maintain fertility, and reduce soil degradation. The source identifies six recurring issues: erosion, nutrient depletion, acidification, salinization, compaction, and chemical pollution. Begin by identifying the degradation process and the local driver rather than assuming every poor crop response is a simple fertiliser shortage. Discuss the evidence with the farmer, including field history, cropping intensity, vegetation cover, water movement, and visible soil condition.",
              callout:
                "An effective recommendation names the degradation process, the likely driver, the evidence to verify, and a realistic risk-reduction action.",
            },
            {
              heading: "Connect erosion and nutrient depletion to field management",
              body:
                "Soil erosion is the removal of topsoil through water, wind, and tillage. Eroded soils commonly have low nutrient content, fewer soil organisms, poor water infiltration, poor physical structure, and low organic matter. Wind erosion is severe in dry lands and bare soil; water and tillage erosion are especially serious on hillslopes, mountains, bare soil, and intensively cultivated areas. Nutrient depletion can be driven by erosion, leaching, intensified cropping without nutrient replacement, and vegetation removal. It can reduce the nutritive quality of vegetables as well as crop growth and yield.",
            },
            {
              heading: "Understand acidification, salinity, and hidden pollution risks",
              body:
                "Soil acidification is the build-up of hydrogen ions that lowers pH. Heavy use of ammonium-based fertilisers, especially where nitrogen is leached, can contribute; rainfall, acid-sulphate soils, acid deposition, deforestation, and crop removal can also play a role. Salinization describes salt-affected soils that restrict plant growth. Soil pollution is the presence of higher-than-normal chemical concentrations and can be difficult to see without testing; sources include agrochemicals, waste, plastic mulch, machinery, manure, industries, mines, settlements, and water-treatment plants. Treat these as evidence-led management questions, not visual guesses alone.",
            },
          ],
        },
        {
          id: "build-a-soil-protection-plan",
          title: "Build a soil-protection plan",
          duration: "32 min",
          kicker: "Reduce risk and conserve soil",
          summary:
            "Select practical soil-conservation strategies for erosion, nutrient loss, acidity, salinity, compaction, and pollution with the farmer’s field layout and resources in mind.",
          outcomes: [
            "Match erosion and nutrient-depletion risks with appropriate cover, layout, organic-matter, and rotation practices.",
            "Select management options for acidic, saline, compacted, and chemically polluted soils.",
            "Present two or three practical soil-risk reduction strategies appropriate to a farmer’s needs.",
          ],
          sections: [
            {
              heading: "Protect the surface and slow water movement",
              body:
                "For erosion and nutrient depletion, the source recommends maintaining cover crops and intercrops, limiting tillage, using contour farming or terraces on slopes, developing good layouts and raised beds, mulching, diversifying crop rotations to increase residues, planting strip crops, using windbreaks, adding organic matter, green manuring, fallowing where appropriate, and adequate fertilisation. Select the combination that addresses the actual driver—bare soil, poor aggregation, compacted layers, poor layout, vegetation removal, or intense cropping—rather than applying every practice at once.",
              callout:
                "Keep soil covered, build organic matter, and design the crop layout around water movement; these are recurring foundations across multiple degradation risks.",
            },
            {
              heading: "Adapt management to acidity, salinity, and compaction",
              body:
                "Acid-soil management may include liming, regulating ammonium-based fertiliser use, increasing ground cover, recycling crop residues, and adding organic matter. For saline soils, use salt-tolerant varieties, sound irrigation practices, improved drainage, vegetation cover, integrated soil-fertility management with organic fertilisers, raised beds, and mulching. Compaction is a reduction in pore space when particles are pressed together; working wet soil, repeated tillage at the same depth, heavy machinery, trampling, poor layout, and low organic matter can contribute. Reduce traffic and tillage in wet soils, use raised beds and paths, mulch, add residues and manure, diversify crops, use conservation tillage and cover crops, and avoid unnecessary heavy machinery.",
            },
            {
              heading: "Prevent pollution through tested, integrated practice",
              body:
                "Because pollution can be a hidden danger, test soil when chemical contamination is plausible. Use integrated soil-fertility management and integrated pest management, apply properly decomposed manure, dispose of chemical containers and waste correctly, compost organic waste to minimise pathogens and support nutrient cycling, select crops based on soil analysis, and use plant barriers, cover crops, and organic mulch where appropriate. A good farmer-facing protection plan should name two or three feasible actions, state the reason for each, and describe what field evidence will show whether risk is falling.",
            },
          ],
        },
      ],
      assessment: {
        id: "soil-degradation-and-management-check",
        title: "Soil degradation and management check",
        description:
          "Apply evidence-led soil-conservation and remediation decisions to erosion, nutrient loss, acidity, salinity, compaction, and pollution risks.",
        kind: "module",
        passMark: 80,
        questions: [
          {
            id: "sd-1",
            prompt: "How does the source define soil erosion?",
            options: [
              { id: "a", label: "Removal of topsoil from the land surface through water, wind, and tillage." },
              { id: "b", label: "Any addition of organic matter to a field." },
              { id: "c", label: "The natural increase of pore space in a healthy soil." },
              { id: "d", label: "Only a decline in crop market price." },
            ],
            correctOptionId: "a",
            feedback: { correct: "Correct. Erosion removes topsoil through water, wind, and tillage and weakens several soil functions.", incorrect: "The source describes erosion as removal of topsoil by water, wind, and tillage." },
          },
          {
            id: "sd-2",
            prompt: "Which combination is most appropriate for reducing erosion on a sloping vegetable field?",
            options: [
              { id: "a", label: "Maintain cover, use contouring or terraces, mulch, improve layout, and reduce unnecessary tillage." },
              { id: "b", label: "Leave the soil bare and increase repeated tillage at the same depth." },
              { id: "c", label: "Remove crop residues and direct runoff down the steepest slope." },
              { id: "d", label: "Rely only on a single fertiliser application." },
            ],
            correctOptionId: "a",
            feedback: { correct: "Correct. Ground cover, contouring, mulch, sound layout, and reduced tillage help slow water and protect soil.", incorrect: "Erosion control combines cover, water-flow control, sound layout, organic matter, and reduced disturbance." },
          },
          {
            id: "sd-3",
            prompt: "Which management response is suitable for a saline vegetable-production field?",
            options: [
              { id: "a", label: "Improve drainage and irrigation practice, maintain cover, consider salt-tolerant varieties, and use raised beds or mulching where suitable." },
              { id: "b", label: "Apply heavy machinery on wet soil to increase pore pressure." },
              { id: "c", label: "Remove all vegetation and stop monitoring water management." },
              { id: "d", label: "Assume salinity can be diagnosed only from crop price." },
            ],
            correctOptionId: "a",
            feedback: { correct: "Correct. Saline-soil management uses variety fit, irrigation and drainage improvement, cover, integrated fertility management, raised beds, and mulch.", incorrect: "Use an integrated saline-soil plan focused on water management, drainage, cover, suitable varieties, and practical field protection." },
          },
          {
            id: "sd-4",
            prompt: "What is an appropriate first response where soil pollution is suspected?",
            options: [
              { id: "a", label: "Test the soil and review possible contamination sources before selecting integrated management and disposal actions." },
              { id: "b", label: "Assume the issue is visible and add more chemical inputs immediately." },
              { id: "c", label: "Ignore chemical containers and waste because soil pollution is harmless." },
              { id: "d", label: "Diagnose pollution only from plant height without testing or history." },
            ],
            correctOptionId: "a",
            feedback: { correct: "Correct. Pollution can be hidden; testing and source review should guide integrated soil and waste-management actions.", incorrect: "Suspected pollution requires testing, source review, and evidence-led integrated management rather than visual guesswork." },
          },
        ],
      },
    },
    {
      id: "nutrients-required-in-plant-nutrition",
      index: 12,
      title: "Nutrients required in plant nutrition",
      eyebrow: "Module 12",
      description:
        "Distinguish plant nutrition from fertilisation, classify essential nutrients, and use nutrient source, mobility, and function evidence to support balanced crop nutrition.",
      lessons: [
        {
          id: "map-essential-nutrients-and-sources",
          title: "Map essential nutrients and sources",
          duration: "28 min",
          kicker: "What plants need and where it comes from",
          summary:
            "Distinguish plant nutrition from fertilisation, identify essential elements, and classify macro- and micronutrients by plant need and source.",
          outcomes: [
            "Explain the difference between plant nutrition and plant fertilisation.",
            "Classify essential nutrients into structural elements, macronutrients, and micronutrients.",
            "Use soil-test evidence to identify nutrient availability, imbalance, and likely limiting factors before recommending inputs.",
          ],
          sections: [
            {
              heading: "Separate plant nutrition from fertilisation",
              body:
                "Plant nutrition concerns the nutrients or elements a plant needs and their functions. Plant fertilisation is the application or addition of these nutrients to soil for plants. Nutrients originate from the physical environment: air, soil, water, and light indirectly through photosynthesis. A nutrient is considered essential when its absence prevents the plant from completing its seed-to-seed life cycle. Do not begin with a product; begin with the crop need, nutrient source, soil condition, and evidence of whether a nutrient is truly limiting.",
              callout:
                "A fertiliser recommendation is only one possible response within a broader plant-nutrition decision based on nutrient need, source, availability, and crop stage.",
            },
            {
              heading: "Classify nutrients by plant requirement",
              body:
                "Structural elements from the air are carbon, hydrogen, and oxygen. Macronutrients are needed in relatively large amounts and include nitrogen, phosphorus, potassium, calcium, magnesium, and sulfur. Micronutrients are needed in smaller amounts and include iron, chlorine, manganese, boron, zinc, copper, molybdenum, sodium, nickel, silicon, and cobalt. The source notes that cobalt and silicon are not essential to all plants but are required by some. Classification helps organise understanding; it does not mean micronutrients are unimportant or that a larger application is always beneficial.",
            },
            {
              heading: "Use soil evidence before selecting a source",
              body:
                "A soil test from a representative field can identify available nutrients, reveal very low nutrients that create a limiting factor, and flag very high levels. Organic sources such as compost and farmyard manure may supply trace elements and also condition soil, but their composition can be uncertain, volumes may be high, release is slow, and poorly managed sources may carry pathogens or weed seeds. Inorganic sources such as urea, DAP, and MOP are concentrated, known-content, and fast acting, but can be costly, do not feed soil organisms directly, and carry leaching or volatilisation risks. Select a source and dose only after linking the test, crop need, field history, and management capacity.",
            },
          ],
        },
        {
          id: "translate-nutrient-roles-into-field-decisions",
          title: "Translate nutrient roles into field decisions",
          duration: "33 min",
          kicker: "Availability, mobility, and function",
          summary:
            "Use nutrient mobility, availability, and plant function to interpret symptoms carefully and plan balanced, accessible crop nutrition.",
          outcomes: [
            "Distinguish mobile from immobile nutrient behaviour and the leaf position where deficiency signs first appear.",
            "Relate major nutrient functions to plant growth, yield, quality, and resilience.",
            "Explain why nutrients must be soluble, balanced, and accessible to roots for optimum growth.",
          ],
          sections: [
            {
              heading: "Read mobility before interpreting a symptom",
              body:
                "Mobile nutrients move to new growth, so deficiency is often evident first in older leaves. The source lists nitrogen, sulfur, phosphorus, chlorine, potassium, nickel, and magnesium as mobile in plants. Immobile nutrients do not move to new growth, so deficiency signs first show in new leaves; examples include boron, calcium, copper, iron, manganese, zinc, molybdenum, and cobalt. Nutrients also differ in their movement through soil: some move with mass flow while relatively immobile forms rely more on diffusion and near-root placement. Use this information as one diagnostic clue, not as a substitute for field, soil, root, and management evidence.",
              callout:
                "Symptom position helps frame a question; it does not confirm a nutrient diagnosis without considering root access, moisture, pH, and other field conditions.",
            },
            {
              heading: "Connect nutrient function with crop performance",
              body:
                "Nitrogen supports photosynthesis, rapid growth, leaf size and quality, and crop maturity. Phosphorus supports strong roots, early seedling growth, fruit development and ripening, seed formation, and disease resistance. Potassium supports seed and fruit quality, turgor, reduced water loss and wilting, drought tolerance, and disease resistance. Calcium supports new growing points and root tips, fruit set, and uptake regulation; magnesium is a key chlorophyll element and enzyme component; sulfur is part of amino acids, enzymes, vitamins, nodulation, seed production, and chlorophyll formation. Micronutrients also have precise roles, such as iron in chlorophyll-related processes, boron in root and pollen-tube elongation, zinc in growth hormones and enzymes, manganese in metabolic activity, and copper in fruit quality and cell-wall strength.",
            },
            {
              heading: "Make nutrients available, balanced, and accessible",
              body:
                "For optimum growth, nutrients need to be available as solutes in soil water, present in adequate and balanced amounts, and accessible to the root system. Nutrients contribute to plant parts, photosynthesis, sugar transport, and water-balance regulation. Match crop demand with the nutrient uptake pattern across the crop cycle, but avoid assuming that every symptom requires a single nutrient input. Check root-zone moisture, pH, compaction, soil test results, recent fertiliser practice, and the crop’s current growth stage before deciding whether the next action is a source change, placement adjustment, balanced nutrition plan, or further evidence gathering.",
            },
          ],
        },
      ],
      assessment: {
        id: "nutrients-required-in-plant-nutrition-check",
        title: "Plant nutrition essentials check",
        description:
          "Apply essential-nutrient classification, source, mobility, and function concepts to balanced crop-nutrition decisions.",
        kind: "module",
        passMark: 80,
        questions: [
          {
            id: "pn-1",
            prompt: "Which statement correctly distinguishes plant nutrition from plant fertilisation?",
            options: [
              { id: "a", label: "Nutrition concerns nutrients plants need and their functions; fertilisation is the application or addition of nutrients to soil." },
              { id: "b", label: "Nutrition and fertilisation always mean exactly the same action." },
              { id: "c", label: "Fertilisation means identifying nutrients from air only." },
              { id: "d", label: "Nutrition applies only after the crop is harvested." },
            ],
            correctOptionId: "a",
            feedback: { correct: "Correct. Plant nutrition is broader than fertiliser use; it includes nutrient need, source, function, availability, and root access.", incorrect: "Plant nutrition addresses what nutrients plants need and how they function, while fertilisation is the addition of nutrients to soil." },
          },
          {
            id: "pn-2",
            prompt: "Which set contains the six macronutrients highlighted in the source objective?",
            options: [
              { id: "a", label: "Nitrogen, phosphorus, potassium, calcium, magnesium, and sulfur." },
              { id: "b", label: "Iron, boron, zinc, copper, manganese, and molybdenum." },
              { id: "c", label: "Carbon, hydrogen, oxygen, chlorine, nickel, and cobalt." },
              { id: "d", label: "Nitrogen, iron, zinc, boron, copper, and chlorine only." },
            ],
            correctOptionId: "a",
            feedback: { correct: "Correct. Nitrogen, phosphorus, potassium, calcium, magnesium, and sulfur are the six macronutrients in the module objective.", incorrect: "The six macronutrients are nitrogen, phosphorus, potassium, calcium, magnesium, and sulfur." },
          },
          {
            id: "pn-3",
            prompt: "Where is a deficiency of a mobile nutrient most likely to appear first?",
            options: [
              { id: "a", label: "Older leaves, because the nutrient can move to support new growth." },
              { id: "b", label: "Only in flowers, regardless of crop stage." },
              { id: "c", label: "Only in roots, with no leaf evidence." },
              { id: "d", label: "New leaves, because mobile nutrients cannot move." },
            ],
            correctOptionId: "a",
            feedback: { correct: "Correct. Mobile nutrients can move to newer growth, so deficiency signs commonly appear first in older leaves.", incorrect: "Mobile nutrient deficiencies commonly appear in older leaves; immobile nutrient deficiencies tend to appear in new growth." },
          },
          {
            id: "pn-4",
            prompt: "Which nutrient role best matches potassium in the source material?",
            options: [
              { id: "a", label: "Maintaining turgor, reducing water loss and wilting, supporting fruit and seed quality, and increasing disease resistance." },
              { id: "b", label: "Only producing new root tips and no role in water balance." },
              { id: "c", label: "Only helping pollen-tube elongation under stress." },
              { id: "d", label: "Only converting nitrate to ammonium in legume nodules." },
            ],
            correctOptionId: "a",
            feedback: { correct: "Correct. Potassium supports quality, water balance, drought tolerance, and disease resistance.", incorrect: "Potassium supports fruit and seed quality, turgor, reduced water loss, drought tolerance, and disease resistance." },
          },
        ],
      },
    },
    {
      id: "nutrient-management",
      index: 13,
      title: "Nutrient management",
      eyebrow: "Module 13",
      description:
        "Diagnose nutrient-risk patterns carefully and build integrated nutrient-management plans that restore, maintain, and protect soil nutrient availability.",
      lessons: [
        {
          id: "diagnose-nutrient-imbalance-methodically",
          title: "Diagnose nutrient imbalance methodically",
          duration: "32 min",
          kicker: "From symptom to evidence question",
          summary:
            "Use leaf age, symptom pattern, nutrient mobility, soil context, and crop history to frame a nutrient diagnosis before recommending treatment.",
          outcomes: [
            "Explain why soil nutrient management is needed for growth, limited soil supply, crop removal, and nutrient loss.",
            "Use older-versus-younger leaf patterns to narrow plausible nutrient deficiency causes.",
            "Distinguish deficiency clues from excess-nitrogen signals and identify evidence that should be checked next.",
          ],
          sections: [
            {
              heading: "Manage nutrients because the balance changes",
              body:
                "Nutrient management is needed because nutrients support plant growth, soil nutrient availability is limited, crops remove nutrients, and nutrients are depleted through processes such as leaching. Crop uptake differs by crop and yield level, while crop removal is the portion removed from the field in marketable product; unmarketable debris may remain and contribute through residue cycling. A useful starting principle is to account for what the crop needs and what the field loses or exports, rather than applying a standard dose without evidence.",
              callout:
                "Nutrient management is a cycle of knowing the soil, diagnosing the crop, supplying what is needed, and reducing avoidable losses.",
            },
            {
              heading: "Use leaf position to narrow the diagnosis",
              body:
                "Start by asking where symptoms first appear: older or younger leaves. Older-leaf yellowing at the margin can indicate potassium deficiency; purpling at the tip or veins can indicate phosphorus deficiency; and whole-leaf chlorosis in older leaves can indicate nitrogen deficiency. Interveinal chlorosis or yellow-and-green patches in older leaves can indicate magnesium deficiency. Younger-leaf abnormalities may point toward immobile elements: calcium deficiency can show as blossom-end rot, interveinal blotches, scorched leaf edges, or distorted tips; iron deficiency can appear as interveinal chlorosis or a bleached appearance in younger leaves. Use the symptom guide to list possibilities, then test them against root conditions, moisture, pH, soil analysis, and field history.",
            },
            {
              heading: "Keep diagnosis separate from a product decision",
              body:
                "A visual pattern is a clue, not a complete diagnosis. Excess nitrogen can also create crop-management problems, including delayed flowering and fruit development, displacement of other needed nutrients through antagonism, thick stems, and dark-green foliage. Confirm whether the pattern is tied to nutrient availability, uptake, soil moisture, root access, compaction, pH, salinity, disease, or management history. When working near a farmer’s field, compare several sources and observations, record the symptom distribution and crop stage, and explain what evidence would change the recommendation.",
            },
          ],
        },
        {
          id: "build-an-integrated-nutrient-management-plan",
          title: "Build an integrated nutrient-management plan",
          duration: "31 min",
          kicker: "Supply, retain, and recycle",
          summary:
            "Use soil testing, nutrient sources, loss pathways, soil health practices, and crop planning to build a practical integrated nutrient-management plan.",
          outcomes: [
            "Use soil nutrient and pH testing to establish nutrient status before fertilisation.",
            "Compare nutrient sources and identify pathways through which nutrients are supplied and lost.",
            "Select physical, chemical, and biological practices that reduce depletion and support nutrient availability.",
          ],
          sections: [
            {
              heading: "Know the soil before fertilising",
              body:
                "The first step is to know the soil. Check nutrient status through a soil NPK test and check soil pH because it influences nutrient availability. Integrated nutrient management connects physical conditions such as compaction, structure, and water availability; chemical conditions such as nutrient availability; and biological conditions such as organic matter and soil life. Practices including fallowing where appropriate, green manuring, cover cropping, crop rotation, amendments, and organic or inorganic fertilisation should be selected as a package that fits the field problem and crop objective.",
              callout:
                "Fertilisation begins with evidence about soil nutrient status, pH, physical condition, water, and biological activity—not with a product catalogue.",
            },
            {
              heading: "Map supply sources and loss pathways",
              body:
                "Plant nutrients can come from soil reserves, mineral fertilisers, organic sources through nutrient cycling, atmospheric nitrogen through biological fixation, aerial deposition from wind and rain, and irrigation, flood, groundwater, or runoff sediment. Nutrients can be lost through crop removal, leaching, volatilisation, denitrification, soil erosion, and fixation. Nutrient movement in soil can involve mass flow, root interception, diffusion, transpiration-related flow, and leaching. Use this map to ask where the nutrient supply is coming from, whether the crop can access it, and which loss pathway is most likely in the specific field.",
            },
            {
              heading: "Turn evidence into a practical management plan",
              body:
                "A technical-assistance plan should make a clear diagnosis, state the supporting evidence, identify the nutrient or soil process involved, and present actions that fit the farmer’s resources. These may include balancing organic and inorganic sources, protecting soil cover, reducing erosion and leaching, adding organic matter, improving crop rotation, using green manures or cover crops, adjusting fertiliser timing or placement, and reviewing crop removal. Monitor the crop after the intervention and revise the plan when field evidence does not support the expected response.",
            },
          ],
        },
      ],
      assessment: {
        id: "nutrient-management-check",
        title: "Nutrient management check",
        description:
          "Apply symptom-led diagnosis and integrated nutrient-management principles to crop and soil decisions.",
        kind: "module",
        passMark: 80,
        questions: [
          {
            id: "nm-1",
            prompt: "Which is one of the four reasons the source gives for managing soil nutrients?",
            options: [
              { id: "a", label: "Crops remove nutrients and soil nutrients can be depleted through leaching." },
              { id: "b", label: "Nutrients in soil are always unlimited." },
              { id: "c", label: "Crop growth never depends on nutrient availability." },
              { id: "d", label: "Leaching permanently increases plant-accessible nutrients." },
            ],
            correctOptionId: "a",
            feedback: { correct: "Correct. Crops remove nutrients, soil supply is limited, and losses such as leaching can reduce availability.", incorrect: "Nutrient management is needed because nutrient supply is limited, crops remove nutrients, and losses such as leaching occur." },
          },
          {
            id: "nm-2",
            prompt: "A crop shows yellowing at the margins of older leaves. Which nutrient deficiency clue does the source highlight?",
            options: [
              { id: "a", label: "Potassium deficiency." },
              { id: "b", label: "Iron deficiency only in young leaves." },
              { id: "c", label: "Calcium deficiency at new growing points." },
              { id: "d", label: "A certain diagnosis of any single disease." },
            ],
            correctOptionId: "a",
            feedback: { correct: "Correct. Marginal yellowing on older leaves is presented as a potassium-deficiency clue.", incorrect: "Older-leaf margin yellowing can indicate potassium deficiency, but should still be verified with broader field and soil evidence." },
          },
          {
            id: "nm-3",
            prompt: "Which symptom pattern is most consistent with calcium deficiency in the source’s general guide?",
            options: [
              { id: "a", label: "Blossom-end rot and distorted or scorched young leaf tips." },
              { id: "b", label: "Whole-leaf chlorosis on older leaves only." },
              { id: "c", label: "Purpling of older leaves at veins only." },
              { id: "d", label: "Dark-green foliage and delayed flowering from over-supplied nitrogen." },
            ],
            correctOptionId: "a",
            feedback: { correct: "Correct. Calcium is treated as immobile, and blossom-end rot plus abnormal young tissues are key clues in the guide.", incorrect: "Calcium deficiency is associated with younger-tissue problems such as blossom-end rot, distorted tips, interveinal blotches, and leaf-edge scorching." },
          },
          {
            id: "nm-4",
            prompt: "What is the most defensible first step before choosing a fertiliser programme?",
            options: [
              { id: "a", label: "Check soil nutrient status and pH, then relate results to crop need, soil condition, sources, and likely loss pathways." },
              { id: "b", label: "Apply the same product and rate to every field without soil evidence." },
              { id: "c", label: "Ignore organic matter and soil life because only mineral fertiliser matters." },
              { id: "d", label: "Diagnose nutrient status from crop price alone." },
            ],
            correctOptionId: "a",
            feedback: { correct: "Correct. Integrated nutrient management starts by knowing soil nutrient status and pH, then selecting sources and practices that fit the field.", incorrect: "Begin with soil nutrient and pH evidence, then integrate crop need, source, soil health, and nutrient-loss risks into the plan." },
          },
        ],
      },
    },
    {
      id: "acid-soil-causes-and-management",
      index: 14,
      title: "Acid soil causes and management",
      eyebrow: "Module 14",
      description:
        "Explain how soils become acidic, measure soil pH carefully, and build evidence-led acid-soil management plans that include liming and complementary practices.",
      lessons: [
        {
          id: "diagnose-acid-soil-and-ph-risk",
          title: "Diagnose acid soil and pH risk",
          duration: "31 min",
          kicker: "Read the causes and consequences",
          summary:
            "Understand soil acidification, identify the causes and characteristics of acid soil, and use pH evidence to frame crop and nutrient-management decisions.",
          outcomes: [
            "Explain soil acidification as a build-up of hydrogen ions that lowers soil pH.",
            "Identify acidification causes, acid-soil characteristics, and nitrogen-fertiliser effects on soil pH.",
            "Explain why soil pH affects nutrient uptake and crop-management decisions.",
          ],
          sections: [
            {
              heading: "Define soil acidification before prescribing treatment",
              body:
                "Soil acidification is the build-up of hydrogen ions that reduces soil pH. Ammonium-based fertilisers, including DAP, can contribute strongly to acidification, particularly when nitrogen is leached rather than taken up by plants. Aluminium also contributes to acidity, although the source focuses on hydrogen ions. Incorporating plant residues after cropping can help reduce acidification. Start by asking whether low pH is confirmed, what processes are driving it, and how the condition affects the crop and nutrient availability; do not assume every poor field response is caused by acidity.",
              callout:
                "Acid-soil management starts with a measured pH and a diagnosis of the processes driving acidification—not with an automatic lime rate.",
            },
            {
              heading: "Recognise the acid-soil context and its causes",
              body:
                "Acid soils are often highly weathered and leached, including ferralitic and latosol soils. The source identifies low pH, low CEC and low base saturation, manganese, iron, and aluminium toxicity, and phosphorus deficiency through fixation as important characteristics. In tropical acid soils, liming can carry a higher risk of poor structure and leaching, so management must fit soil type and condition. Causes include rainfall that leaches soluble nutrients such as calcium and magnesium and leaves aluminium in their place, drainage of acid-sulphate soils, deforestation and crop removal that deplete organic matter, acid deposition, and excessive ammonium-based fertiliser application.",
            },
            {
              heading: "Link nitrogen form and pH with crop nutrition",
              body:
                "The form of nitrogen and its fate after application influence changes in soil pH. Ammonium-based fertilisers have greater potential to acidify soil; examples in the source include MAP, DAP, and sulfate of ammonia. Nitrate-based fertilisers have lower acidifying potential; examples include sodium nitrate, calcium nitrate, calcium ammonium nitrate, and potassium nitrate. Soil pH influences nutrient uptake, so pH should be interpreted alongside soil type, soil quality, nutrient status, crop stage, root condition, and the crop’s likely pH range. Use pH to ask a better nutrient-availability question rather than treating it as an isolated number.",
            },
          ],
        },
        {
          id: "measure-and-manage-acid-soil",
          title: "Measure and manage acid soil",
          duration: "34 min",
          kicker: "Confirm, correct, and monitor",
          summary:
            "Measure soil pH appropriately, select acid-soil management practices, and use liming materials and calculations responsibly with expert support.",
          outcomes: [
            "Describe how to collect a soil sample and confirm pH accurately.",
            "Select complementary acid-soil management strategies in addition to liming.",
            "Explain effective neutralising value and avoid overliming when planning lime use.",
          ],
          sections: [
            {
              heading: "Measure pH with the right level of confidence",
              body:
                "Check soil pH because it relates to nutrient availability, and take measurements in moist soil while also considering soil type and quality. A simple field estimation can be useful for discussion: clear vegetation and debris, collect a sample to the crop’s root depth, remove root debris, make a soil paste with water, and observe the response to baking soda or vinegar. The source stresses that this is only a quick estimate and does not provide a pH value. Confirm management decisions with a soil pH meter or soil laboratory for an accurate value.",
              callout:
                "Use a quick field test to stimulate observation; use a pH meter or laboratory result to support a rate or high-consequence management decision.",
            },
            {
              heading: "Use liming as part of a broader acid-soil plan",
              body:
                "Acid-soil management may include liming, regulating ammonium-based fertiliser use, increasing ground cover through mulch or cover crops, recycling crop residues, adding organic matter, and using acid-tolerant varieties where available. Ground agricultural limestone is the most common liming material; limestone materials range from calcium carbonate to mixtures with calcium magnesium carbonate such as dolomitic limestone. Complementary management across land preparation, vegetative growth, and flowering helps reduce the processes that recreate acidity after an initial lime application.",
            },
            {
              heading: "Calculate carefully and avoid overliming",
              body:
                "Liming must account for soil texture, CEC, pH result, and the material’s effective neutralising value (ENV). Clay soils generally require more lime than sandy soils to change pH. The source gives a rule of thumb of one tonne per hectare of calcium carbonate during land preparation to raise pH by one unit, but recommends expert advice for the accurate amount. Higher ENV means less material is required: calcium carbonate is listed at 100%, dolomite at 95–108%, calcium hydroxide at 120–135%, and calcium oxide at 150–175%. For a one-tonne-per-hectare recommendation using 95% ENV dolomite, the source calculation yields 1.05 tonnes per hectare. Avoid overliming because it can create alkalinity and additional correction cost.",
            },
          ],
        },
      ],
      assessment: {
        id: "acid-soil-causes-and-management-check",
        title: "Acid soil causes and management check",
        description:
          "Apply acidification, pH measurement, liming, and complementary management concepts to practical soil decisions.",
        kind: "module",
        passMark: 80,
        questions: [
          {
            id: "as-1",
            prompt: "What does the source identify as soil acidification?",
            options: [
              { id: "a", label: "A build-up of hydrogen ions that reduces soil pH." },
              { id: "b", label: "A rise in soil pH caused only by calcium." },
              { id: "c", label: "Any increase in soil organic matter." },
              { id: "d", label: "A nutrient-deficiency symptom that always appears in old leaves." },
            ],
            correctOptionId: "a",
            feedback: { correct: "Correct. Soil acidification is described as the build-up of hydrogen ions that lowers soil pH.", incorrect: "The source defines acidification as hydrogen-ion build-up that reduces soil pH." },
          },
          {
            id: "as-2",
            prompt: "Which practice is most likely to contribute to soil acidification according to the source?",
            options: [
              { id: "a", label: "Excessive application of ammonium-based fertilisers, especially where nitrogen is leached." },
              { id: "b", label: "Returning crop residues to the soil." },
              { id: "c", label: "Maintaining ground cover with mulch or cover crops." },
              { id: "d", label: "Using soil-pH evidence before making a management decision." },
            ],
            correctOptionId: "a",
            feedback: { correct: "Correct. Excessive ammonium-based fertiliser use is identified as a major acidification driver.", incorrect: "The source identifies excessive ammonium-based fertiliser use, rainfall leaching, acid-sulphate drainage, organic-matter depletion, and acid deposition as acidification drivers." },
          },
          {
            id: "as-3",
            prompt: "What is the most defensible way to use a simple vinegar or baking-soda soil test?",
            options: [
              { id: "a", label: "Use it as a quick estimate, then confirm pH with a meter or laboratory before making an accurate management decision." },
              { id: "b", label: "Use it to calculate an exact lime rate without any confirmation." },
              { id: "c", label: "Use it only on completely dry soil and ignore crop root depth." },
              { id: "d", label: "Treat no reaction as proof that all soil nutrients are sufficient." },
            ],
            correctOptionId: "a",
            feedback: { correct: "Correct. The field test is only a quick estimation; a pH meter or laboratory should confirm the value for management.", incorrect: "The simple test can support observation but does not give an exact pH value or replace a meter or laboratory result." },
          },
          {
            id: "as-4",
            prompt: "A liming recommendation is 1 tonne per hectare of calcium carbonate equivalent. Using dolomite with an ENV of 95%, what actual amount does the source calculation give?",
            options: [
              { id: "a", label: "1.05 tonnes of dolomite per hectare." },
              { id: "b", label: "0.50 tonnes of dolomite per hectare." },
              { id: "c", label: "95 tonnes of dolomite per hectare." },
              { id: "d", label: "No calculation is needed because ENV never affects rate." },
            ],
            correctOptionId: "a",
            feedback: { correct: "Correct. The source example divides the recommendation by 95 and multiplies by 100, giving 1.05 tonnes per hectare.", incorrect: "Lower ENV means more material is needed. For a 1-tonne recommendation and 95% ENV dolomite, the source example gives 1.05 tonnes per hectare." },
          },
        ],
      },
    },
    {
      id: "how-to-promote-soil-health",
      index: 15,
      title: "How to promote soil health",
      eyebrow: "Module 15",
      description:
        "Treat soil as a living production system, assess physical, chemical, and biological conditions, and use practical management to build soil health and crop yield.",
      lessons: [
        {
          id: "test-the-living-soil-system",
          title: "Test the living soil system",
          duration: "30 min",
          kicker: "Assess physical, chemical, and biological health",
          summary:
            "Define soil health and combine physical, chemical, and biological tests to understand the field before choosing a soil-health strategy.",
          outcomes: [
            "Define soil health as an integrated physical, chemical, biological, and management-practice question.",
            "Describe practical physical, chemical, and biological soil-testing approaches.",
            "Use visual soil assessment and laboratory evidence to frame soil-health management decisions.",
          ],
          sections: [
            {
              heading: "Treat soil as a living production system",
              body:
                "Soil health should be considered slowly and gradually because degradation often goes unnoticed. The source emphasises that soil is the basis for plant production, encourages advisors to feed the soil instead of feeding crops alone, and recommends letting the soil do work rather than overworking it. Soil health integrates physical, chemical, and biological components with management practices. The first step is testing: use evidence to understand the system before selecting a practice, rather than treating a single symptom or laboratory number as the entire field story.",
              callout:
                "A healthy-soil recommendation connects how soil looks and functions with chemistry, biology, crop demands, and the practices that sustain the system.",
            },
            {
              heading: "Assess physical and chemical conditions",
              body:
                "Physical testing examines structure and texture because they affect water, air, and nutrient availability for crops. A field visual soil assessment can include making a 50-by-50 centimetre pit to inspect the profile, taking a 25-by-25 centimetre cone from the top layer, placing it on a flat surface, breaking it, and examining it. Chemical testing helps determine pH, CEC, organic-matter content, and nutrients that are available or deficient. Use soil chemical analysis or plant tissue analysis, supported by test kits or a laboratory, to make these measurements decision-ready.",
            },
            {
              heading: "Include biological evidence in the assessment",
              body:
                "Biological testing looks for beneficial microorganisms and, where relevant, can include nematode and soil-pathogen analysis. Biology, organic matter, and physical structure interact: a soil that supports organisms, roots, aggregates, water movement, and nutrient cycling is more resilient than one assessed only by a fertiliser value. Pair physical visual assessment with chemical results and biological observations, then explain to the farmer how these components connect with soil function, crop response, and the choice of management practices.",
            },
          ],
        },
        {
          id: "build-soil-health-with-living-practices",
          title: "Build soil health with living practices",
          duration: "35 min",
          kicker: "Cover, rotate, feed, and protect",
          summary:
            "Select complementary practices that protect soil, build organic matter, improve biology, and fit crop rotation, local soil conditions, and farmer resources.",
          outcomes: [
            "Select soil-health practices that reduce erosion, protect structure, and improve water and nutrient function.",
            "Explain the benefits of rotation, mulch, green manure, cover crops, mixed cropping, and organic matter.",
            "Adapt crop, seed, and field-practice choices to local soil conditions.",
          ],
          sections: [
            {
              heading: "Reduce disturbance and rotate crops deliberately",
              body:
                "The source recommends minimal soil disturbance or tillage because it can protect soil from water and wind erosion, reduce long-term input, fuel, time, and labour costs, improve water infiltration, conserve moisture, and improve soil organic matter. Crop rotation breaks insect-pest and disease cycles, reduces nutrient depletion, maintains fertility, and can reduce dependence on chemical fertilisers. In a rotation discussion, distinguish nitrogen-fixing legume crops from heavy feeders and light feeders, record current practice, and agree a rotation that fits the farm’s crops, season, market, and soil constraints.",
              callout:
                "A rotation plan is a deliberate sequence that manages nutrient demand, pests, diseases, residue, and soil cover over time.",
            },
            {
              heading: "Keep soil covered and feed soil biology",
              body:
                "Mulch, green manure, and cover crops can improve biological, chemical, and physical soil properties. Organic mulch can limit weeds, provide habitat for soil biota, support pathogen suppression, add organic matter, improve fertility, conserve moisture, improve aeration and infiltration, and protect against erosion. Green manures add biomass and organic matter; legume root nodules can support nutrient availability and contribute to aggregation and water-holding capacity. Cover crops enhance soil quality by adding organic matter, suppressing weeds, supporting soil biota, improving aeration and infiltration, protecting against erosion, and reducing compaction. Mixed cropping can optimise nutrient uptake, control erosion, reduce disease and insect spread, and improve yield per unit area.",
            },
            {
              heading: "Apply organic matter and protect the field system",
              body:
                "Organic matter includes living and decomposing plant and animal materials that ultimately contribute to humus. It helps bind soil aggregates, buffer pH change, promote nutrient availability, increase CEC, support beneficial microorganisms, and increase water-holding capacity. Sources include manure, bagasse, crop residues, coco coir, and tree residues. Incorporate crop residues rather than burning them to improve structure, fertility, and organic matter while reducing emissions. Complement this with erosion control, responsible pesticide use and IPM, the 4Rs of fertiliser use, and crops and quality seed adapted to local soil. For example, carrots need light, loose soils; heavy clay and stones can impair root formation and increase rot or forking risk.",
            },
          ],
        },
      ],
      assessment: {
        id: "how-to-promote-soil-health-check",
        title: "Soil health promotion check",
        description:
          "Apply integrated soil-health assessment and living-practice principles to practical crop and field decisions.",
        kind: "module",
        passMark: 80,
        questions: [
          {
            id: "sh-1",
            prompt: "Which three evidence areas does the source place at the centre of soil-health testing?",
            options: [
              { id: "a", label: "Physical, chemical, and biological assessment." },
              { id: "b", label: "Crop price, transport distance, and packaging only." },
              { id: "c", label: "Rainfall forecast, seed label, and market logo only." },
              { id: "d", label: "Fertiliser product, machinery brand, and field size only." },
            ],
            correctOptionId: "a",
            feedback: { correct: "Correct. Soil health integrates physical, chemical, and biological evidence with management practices.", incorrect: "The source groups soil-health testing into physical, chemical, and biological assessment, interpreted alongside management practice." },
          },
          {
            id: "sh-2",
            prompt: "What is a field visual-soil-assessment method described in the source?",
            options: [
              { id: "a", label: "Make a 50-by-50 centimetre pit, take a 25-by-25 centimetre top-layer cone, break it on a flat surface, and examine it." },
              { id: "b", label: "Apply lime first and inspect the profile only after harvest." },
              { id: "c", label: "Judge structure only from a satellite image without visiting the field." },
              { id: "d", label: "Measure crop price instead of looking at the soil profile." },
            ],
            correctOptionId: "a",
            feedback: { correct: "Correct. The source outlines a field visual soil assessment using a pit and a top-layer cone for examination.", incorrect: "The field method uses a 50-by-50 centimetre pit and a 25-by-25 centimetre top-layer cone that is broken and examined." },
          },
          {
            id: "sh-3",
            prompt: "Which is a soil-health benefit of crop rotation highlighted in the source?",
            options: [
              { id: "a", label: "Breaking pest and disease cycles, reducing nutrient depletion, and helping maintain fertility." },
              { id: "b", label: "Guaranteeing identical nutrient demand every season." },
              { id: "c", label: "Removing all crop residues from the field." },
              { id: "d", label: "Eliminating the need to assess local soil conditions." },
            ],
            correctOptionId: "a",
            feedback: { correct: "Correct. Rotation helps break pest and disease cycles, reduce nutrient depletion, and maintain soil fertility.", incorrect: "Crop rotation is used to manage pest and disease cycles, nutrient demand, and fertility—not to eliminate soil assessment." },
          },
          {
            id: "sh-4",
            prompt: "Which effect of organic matter is consistent with the source?",
            options: [
              { id: "a", label: "It helps bind aggregates, supports nutrient availability and beneficial microorganisms, and increases water-holding capacity." },
              { id: "b", label: "It always reduces CEC and removes soil life." },
              { id: "c", label: "It prevents any need for crop rotation or erosion control." },
              { id: "d", label: "It makes local soil adaptation irrelevant when choosing a crop." },
            ],
            correctOptionId: "a",
            feedback: { correct: "Correct. Organic matter supports aggregates, buffering, nutrient availability, CEC, beneficial biology, and water holding.", incorrect: "The source identifies multiple positive organic-matter functions, including aggregate stability, nutrient availability, CEC, beneficial microorganisms, and water holding." },
          },
        ],
      },
    },
  ],
  finalAssessment: {
    id: "crop-advisor-final",
    title: "Crop Advisor Foundations final assessment",
    description:
      "Integrate advisory practice, soil context, crop observation, vegetable-production planning, cost-based decision-making, crop-and-variety selection, crop-yield factors, climatic-risk management, topographic site interpretation, complete edaphic soil assessment, soil-protection planning, balanced plant-nutrition decisions, integrated nutrient management, acid-soil management, and soil-health promotion to qualify for certification.",
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
      {
        id: "final-6",
        prompt:
          "A vegetable plan has quantified crop tasks, inputs, and expected yield, but its likely return is lower than the estimated production cost. What is the most appropriate next decision?",
        options: [
          { id: "a", label: "Proceed because the calculations are complete." },
          { id: "b", label: "Increase the assumed farm-gate price without evidence." },
          { id: "c", label: "Review the plan, reduce avoidable costs or change the strategy, then reassess expected returns." },
          { id: "d", label: "Remove seedling, fertiliser, and labour costs from the record." },
        ],
        correctOptionId: "c",
        feedback: {
          correct:
            "Correct. Cost planning supports a decision cycle: revise a weak financial plan before committing resources and retain the record for review.",
          incorrect:
            "When estimated benefits do not justify costs, revise the plan or strategy and reassess rather than changing assumptions or omitting real expenses.",
        },
      },
      {
        id: "final-7",
        prompt:
          "A farmer wants a vegetable variety with strong local demand, but the proposed cultivar has uncertain performance in the area’s expected season and elevation. What is the most defensible advisory response?",
        options: [
          { id: "a", label: "Plant it immediately because market demand is the only selection criterion." },
          { id: "b", label: "Select a variety only from the crop family name without checking field or market evidence." },
          { id: "c", label: "Review buyer requirements, local seasonal and elevation conditions, reliable supplier information, and farmer experience before agreeing a suitable variety." },
          { id: "d", label: "Avoid involving the farmer because crop choice is a technical decision only." },
        ],
        correctOptionId: "c",
        feedback: {
          correct:
            "Correct. Variety selection requires a documented fit among market preference, environmental adaptability, reliable information, and farmer knowledge.",
          incorrect:
            "A defensible decision balances market acceptability with local adaptability, verified product information, and farmer participation.",
        },
      },
      {
        id: "final-8",
        prompt:
          "A farmer wants to maximise yield by switching to a high-potential hybrid, but the field has variable slope, moisture supply, and seasonal wind exposure. What is the most defensible advisory response?",
        options: [
          { id: "a", label: "Recommend the hybrid without reviewing the field because genetics determine yield alone." },
          { id: "b", label: "Assess the hybrid traits against the production objective and evaluate climatic, soil, and topographic risks before agreeing the variety and management plan." },
          { id: "c", label: "Assume that environmental conditions only affect open-pollinated varieties." },
          { id: "d", label: "Focus only on the slope and ignore moisture, wind, and seed characteristics." },
        ],
        correctOptionId: "b",
        feedback: {
          correct: "Correct. Yield potential depends on a fit among genetics, production objective, and interacting climate, soil, and topographic conditions.",
          incorrect: "A high-potential seed still needs a realistic match to environmental conditions and a management response to the field’s key risks.",
        },
      },
      {
        id: "final-9",
        prompt:
          "A vegetable field is entering flowering during a period of high humidity and strong hot winds. Which plan best protects yield potential?",
        options: [
          { id: "a", label: "Ignore the climate signals because flowering is determined only by seed genetics." },
          { id: "b", label: "Match irrigation to flowering needs, monitor humidity-related disease risk, and reduce damaging wind exposure with practical field protection." },
          { id: "c", label: "Stop all water applications so flowers adapt to the conditions." },
          { id: "d", label: "Remove crop supports and windbreaks to increase wind speed through the crop." },
        ],
        correctOptionId: "b",
        feedback: {
          correct: "Correct. Flowering is sensitive to water limitation, high humidity increases disease risk, and hot winds increase drying and physical stress; the response should address all three factors.",
          incorrect: "A defensible plan connects crop stage with water supply, humidity-related disease risk, and wind protection rather than relying on genetics alone.",
        },
      },
      {
        id: "final-10",
        prompt:
          "A farmer proposes a highland-adapted variety for a low-lying, sloping field where runoff is already carrying soil toward a flood-prone area. What is the most defensible advisor response?",
        options: [
          { id: "a", label: "Plant the variety immediately and address erosion only if the crop fails." },
          { id: "b", label: "Verify elevation and local variety fit, map slope and water flow, then redesign the crop and bed layout with runoff and erosion controls." },
          { id: "c", label: "Ignore slope and flood exposure because only seed genetics affect crop yield." },
          { id: "d", label: "Use the lowest part of the field without checking drainage, runoff, or waterlogging risk." },
        ],
        correctOptionId: "b",
        feedback: {
          correct: "Correct. A defensible site decision combines elevation and variety fit with a map of slope, water flow, erosion risk, drainage, and appropriate layout controls.",
          incorrect: "Topographic interpretation should guide both crop-and-variety fit and the field layout, especially where slope, runoff, erosion, or flood exposure affect yield risk.",
        },
      },
      {
        id: "final-11",
        prompt:
          "A field has bluish-grey soil in the rooting zone, weak root growth, and inconsistent nutrient response. What is the most defensible next advisor action?",
        options: [
          { id: "a", label: "Recommend more fertiliser immediately without inspecting physical or biological soil conditions." },
          { id: "b", label: "Assess the physical, chemical, and biological soil properties with the farmer, including drainage, structure, roots, pH, and soil life, before selecting a response." },
          { id: "c", label: "Assume colour alone proves the crop variety is wrong." },
          { id: "d", label: "Ignore the rooting zone and use only a crop price forecast." },
        ],
        correctOptionId: "b",
        feedback: {
          correct: "Correct. Bluish-grey soil can indicate poor drainage, but a defensible response integrates physical, chemical, and biological evidence before treatment.",
          incorrect: "Use the three soil-property lenses and involve the farmer in assessing drainage, roots, structure, chemistry, and soil life before deciding on a response.",
        },
      },
      {
        id: "final-12",
        prompt:
          "A farmer’s sloping vegetable field has bare soil, visible runoff, lower yield over time, and frequent traffic on wet beds. Which advisor plan best addresses the evidence?",
        options: [
          { id: "a", label: "Increase tillage on wet soil and remove residues so the field dries quickly." },
          { id: "b", label: "Use cover and mulch, improve slope-aware layout and runoff control, establish raised beds and paths, reduce wet-soil traffic, and add organic residues." },
          { id: "c", label: "Focus only on fertiliser price and ignore erosion and compaction signals." },
          { id: "d", label: "Leave the soil bare so the cause of degradation is easier to see." },
        ],
        correctOptionId: "b",
        feedback: {
          correct: "Correct. The plan addresses erosion, soil cover, water flow, compaction, and organic-matter decline with linked practical actions.",
          incorrect: "The evidence points to interacting erosion and compaction risks; use ground cover, sound layout, raised beds and paths, reduced wet-soil traffic, and organic residues.",
        },
      },
      {
        id: "final-13",
        prompt:
          "A vegetable crop has yellowing first in older leaves, poor growth, and a soil test indicating low available nitrogen. Which advisor response is most defensible?",
        options: [
          { id: "a", label: "Treat the older-leaf pattern as a clue for a mobile nutrient issue, confirm root access and moisture conditions, then plan an evidence-led balanced nitrogen response." },
          { id: "b", label: "Assume every new-leaf symptom is caused by nitrogen and ignore the soil test." },
          { id: "c", label: "Apply several inputs without checking crop stage, moisture, or nutrient balance." },
          { id: "d", label: "Ignore the soil test because nutrient availability never affects crop performance." },
        ],
        correctOptionId: "a",
        feedback: {
          correct: "Correct. Nitrogen is mobile, so older-leaf symptoms can guide the question, but root access, moisture, crop stage, soil evidence, and balance still matter before action.",
          incorrect: "Use symptom position with soil-test, root-zone, moisture, and crop-stage evidence. Mobile-nutrient signs in older leaves are a clue, not a stand-alone diagnosis.",
        },
      },
      {
        id: "final-14",
        prompt:
          "A tomato field has older-leaf margin yellowing, recent high crop removal, and a soil test showing low available potassium. Which next step is most defensible?",
        options: [
          { id: "a", label: "Treat the pattern as a potassium clue, verify root-zone and moisture conditions, and build an integrated plan that supplies potassium while reducing avoidable nutrient loss." },
          { id: "b", label: "Ignore the soil test because leaf symptoms always give a complete diagnosis." },
          { id: "c", label: "Apply nitrogen only, regardless of crop removal or potassium evidence." },
          { id: "d", label: "Assume low potassium can be corrected without considering source, timing, placement, or loss pathways." },
        ],
        correctOptionId: "a",
        feedback: {
          correct: "Correct. The symptom, crop removal, and soil test point toward potassium, but an evidence-led response still checks root access and reduces loss risks.",
          incorrect: "Integrate symptom position, soil analysis, crop removal, root-zone conditions, source choice, and nutrient-loss prevention in the management decision.",
        },
      },
      {
        id: "final-15",
        prompt:
          "A vegetable field has a confirmed low pH, high use of ammonium-based fertiliser, and declining nutrient response. Which advisor plan is most defensible?",
        options: [
          { id: "a", label: "Use the measured pH and soil context to obtain an appropriate liming recommendation, regulate acidifying fertiliser use, return residues, add organic matter, and protect soil cover while avoiding overliming." },
          { id: "b", label: "Apply the same lime rate to every field without considering pH, soil texture, or liming-material ENV." },
          { id: "c", label: "Increase ammonium fertiliser immediately and ignore residue, cover, and pH management." },
          { id: "d", label: "Use only a quick vinegar test as the basis for an exact high-rate liming decision." },
        ],
        correctOptionId: "a",
        feedback: {
          correct: "Correct. A defensible acid-soil response uses confirmed pH, soil context, a suitable liming calculation, reduced acidifying pressure, and complementary organic-matter and cover practices.",
          incorrect: "Acid-soil management requires confirmed pH, soil and lime-material context, careful rate selection, and practices that reduce recurring acidification rather than a one-step or universal rate.",
        },
      },
      {
        id: "final-16",
        prompt:
          "A vegetable farm has declining infiltration, bare soil between crops, low organic matter, repeated disease problems, and a plan to plant carrots in heavy stony clay. Which advisor response is most defensible?",
        options: [
          { id: "a", label: "Assess physical, chemical, and biological soil health, then build a rotation, cover or mulch, organic-matter, reduced-disturbance, erosion-control, and crop-soil-fit plan." },
          { id: "b", label: "Increase tillage and leave soil bare so the field dries faster, while planting carrots without checking soil fit." },
          { id: "c", label: "Use a single fertiliser input and ignore structure, biology, crop rotation, cover, and local soil condition." },
          { id: "d", label: "Burn residues and choose seed without considering soil health or root-forming conditions." },
        ],
        correctOptionId: "a",
        feedback: {
          correct: "Correct. The plan uses integrated soil-health evidence and combines cover, rotation, organic matter, disturbance reduction, erosion control, and crop-soil fit.",
          incorrect: "The evidence points to a soil-health plan that assesses all three soil components and builds functions through cover, rotation, organic matter, reduced disturbance, erosion control, and locally adapted crop choice.",
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
