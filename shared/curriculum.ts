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
    {
      id: "collect-soil-samples-for-soil-testing",
      index: 16,
      title: "Collect soil samples for soil testing",
      eyebrow: "Module 16",
      description:
        "Plan, collect, prepare, and label representative soil samples so laboratory results support defensible fertiliser and crop-management decisions.",
      lessons: [
        {
          id: "plan-a-representative-soil-sample",
          title: "Plan a representative soil sample",
          duration: "28 min",
          kicker: "Test the decision area, not a convenient handful",
          summary:
            "Use soil testing to frame fertiliser decisions, select an appropriate sampling time, map management zones, assemble clean materials, and prevent field bias before sampling begins.",
          outcomes: [
            "Explain how soil tests support efficient fertiliser decisions and production-cost control.",
            "Choose a sampling time and frequency that fit the cropping cycle and soil condition.",
            "Map homogeneous sampling areas and identify locations that would bias a representative sample.",
          ],
          sections: [
            {
              heading: "Test soil before deciding what to supply",
              body:
                "A soil test can quantify key nutrients such as nitrogen, phosphorus, and potassium, together with pH, cation-exchange capacity, organic-matter content, and other relevant soil-health information. This evidence helps an advisor and grower make an informed fertilisation decision, apply fertiliser more efficiently, avoid over-fertilisation, and manage production cost. The laboratory result is not a crop prescription by itself: it becomes useful when the sample represents the field area and management decision under discussion.",
              callout:
                "A precise laboratory result cannot correct a sample that did not represent the field or the decision area.",
            },
            {
              heading: "Choose the right sampling window",
              body:
                "Collect samples before the cropping cycle so the result can inform fertilisation management. Do not sample when soil is excessively wet or excessively dry because difficult conditions can affect the practical quality and consistency of collection. The source recommends testing every two to three years to observe change over time; intensively managed production may need annual testing. Keep timing consistent enough that a later result can be compared meaningfully with earlier records, while adapting the schedule to the crop plan and the intensity of management.",
            },
            {
              heading: "Map zones and prepare the sampling kit",
              body:
                "Start with a map of the farm. Where a farm is heterogeneous—for example, where slope, crop history, crop type, or farming system differs—subdivide it into homogeneous sampling areas. Each distinct area needs its own sample if it could receive a different management decision. Assemble a clean auger, bucket, spade or shovel, permanent marker, and sample bags before entering the field. Avoid places that are not typical of the zone, including sites near fertiliser or liming applications, roads, fence rows, compost piles, or other localised disturbances.",
            },
          ],
        },
        {
          id: "collect-prepare-and-label-the-composite",
          title: "Collect, prepare, and label the composite",
          duration: "32 min",
          kicker: "Protect sample integrity from field to laboratory",
          summary:
            "Collect enough evenly distributed subsamples at the appropriate depth, combine and dry them cleanly, then label the composite with the field history a laboratory report needs for interpretation.",
          outcomes: [
            "Collect and combine a representative set of subsamples at an appropriate soil depth.",
            "Prepare a composite sample without contaminating, overheating, or losing its field identity.",
            "Record the crop, fertiliser, lime, slope, and erosion context required for interpretation.",
          ],
          sections: [
            {
              heading: "Take enough, well-distributed subsamples",
              body:
                "In each homogeneous sampling area, collect soil from at least ten locations; the source notes that a larger area may need around forty spots per hectare. More appropriately distributed spots improve representation. Take positions across the area, including edge and centre locations that are typical of the zone, while continuing to avoid atypical sites. Sampling depth must match the management question. The source identifies a primary-tillage depth of about 15 to 30 centimetres as common for vegetable root depth and a deeper 30 to 60 centimetre sample where a deeper investigation is required. Record depth so results are not compared as if they came from the same soil layer.",
              callout:
                "Composite samples represent a defined zone and depth; do not combine soil from different zones or layers merely to reduce laboratory cost.",
            },
            {
              heading: "Make a clean, stable composite",
              body:
                "Mix soil from the selected spots thoroughly in a clean bucket to form one composite sample for the homogeneous area. Remove stones and visible plant or organic debris. If the sample is slightly wet, spread it on clean paper and air-dry it away from direct sunlight. Once dry, pulverise it using clean wooden material; do not use metal or stones. Place one kilogram of the prepared soil in a clean plastic bag. These controls prevent avoidable contamination, preserve a manageable sample, and make the laboratory submission traceable to a defined field area.",
            },
            {
              heading: "Label the bag with the decision context",
              body:
                "Label the sample immediately with the farm owner’s name, collection date, location, crops grown in the area during the previous three to five years, and the crop planned for the next season. Add the type and amount of fertiliser used in previous years, the date of the last lime application, and the slope and erosion rate. These details connect laboratory values with crop history and management conditions, allowing the advisor to interpret the result as field evidence rather than an anonymous number.",
            },
          ],
        },
      ],
      assessment: {
        id: "collect-soil-samples-for-soil-testing-check",
        title: "Soil-sample collection check",
        description:
          "Apply representative sampling, sample preparation, and field-context recording principles to soil-testing decisions.",
        kind: "module",
        passMark: 80,
        questions: [
          {
            id: "ss-1",
            prompt: "Why should a soil sample be collected before the cropping cycle?",
            options: [
              { id: "a", label: "So the result can inform fertilisation management before the crop is established." },
              { id: "b", label: "Because soil testing is useful only after harvest." },
              { id: "c", label: "To avoid recording any crop or fertiliser history." },
              { id: "d", label: "Because soil moisture and sample representativeness never matter." },
            ],
            correctOptionId: "a",
            feedback: { correct: "Correct. Testing before the crop cycle gives the advisor and grower time to use the result in fertilisation management.", incorrect: "The source recommends testing before the cropping cycle so the result can guide fertilisation management." },
          },
          {
            id: "ss-2",
            prompt: "A farm contains an eroded hillside coconut area, a plain coconut area, a corn-legume area, and a lowland-rice area. What is the strongest sampling plan?",
            options: [
              { id: "a", label: "Combine all soil into one bag because the farm has one owner." },
              { id: "b", label: "Create separate samples for the homogeneous sampling areas because their conditions and decisions may differ." },
              { id: "c", label: "Sample only beside the road because it is easiest to reach." },
              { id: "d", label: "Take one subsample from the middle of the largest area and ignore the others." },
            ],
            correctOptionId: "b",
            feedback: { correct: "Correct. Heterogeneous land should be divided into homogeneous sampling areas, each with its own representative sample.", incorrect: "Slope, crop, and farming-system differences can create different sampling areas; keep them separate where management decisions may differ." },
          },
          {
            id: "ss-3",
            prompt: "Which collection method best represents a homogeneous vegetable sampling area?",
            options: [
              { id: "a", label: "Collect at least ten well-distributed subsamples, commonly at the 15-to-30-centimetre primary-tillage depth, then mix them into one composite." },
              { id: "b", label: "Take one shallow handful from a fertiliser band and send it directly to the laboratory." },
              { id: "c", label: "Collect from a compost pile and a fence row because they contain the most nutrients." },
              { id: "d", label: "Mix 15-to-30-centimetre and 30-to-60-centimetre soil into one bag without recording depth." },
            ],
            correctOptionId: "a",
            feedback: { correct: "Correct. A composite should be built from multiple representative locations within one zone and one appropriate depth.", incorrect: "Use multiple distributed subsamples from one representative zone and depth; avoid localised nutrient sources and do not mix different soil layers." },
          },
          {
            id: "ss-4",
            prompt: "A composite sample is slightly wet. Which handling and labelling practice follows the source guidance?",
            options: [
              { id: "a", label: "Air-dry it on clean paper away from sunlight, pulverise with clean wood, bag one kilogram, and label crop and management history." },
              { id: "b", label: "Dry it in direct sunlight, crush it with stones, and submit it without a location." },
              { id: "c", label: "Leave stones and plant debris in the bucket and use a metal tool to mix it." },
              { id: "d", label: "Discard the collection date and last lime application because laboratories do not need context." },
            ],
            correctOptionId: "a",
            feedback: { correct: "Correct. The source specifies clean paper, air drying away from sunlight, clean wooden pulverising, a one-kilogram bag, and a complete label.", incorrect: "Protect the sample from contamination and loss of context: air-dry away from sunlight, use clean wooden material, bag one kilogram, and record the field history." },
          },
        ],
      },
    },
    {
      id: "nursery-for-vegetable-production",
      index: 17,
      title: "Nursery for vegetable production",
      eyebrow: "Module 17",
      description:
        "Recognise high-quality vegetable seedlings and design a protected, practical nursery that supports healthy roots, uniform growth, and successful field establishment.",
      lessons: [
        {
          id: "recognise-a-high-quality-seedling",
          title: "Recognise a high-quality seedling",
          duration: "27 min",
          kicker: "Root quality drives field establishment",
          summary:
            "Use rooting, plant form, uniformity, and transplant response to distinguish a seedling that is ready for the field from one carrying nursery stress.",
          outcomes: [
            "Describe the root-system benefits associated with high-quality vegetable seedlings.",
            "Recognise traditional-nursery signals that increase seedling stress and transplant shock.",
            "Explain why early seedling quality influences establishment, flowering, and fruiting after transplanting.",
          ],
          sections: [
            {
              heading: "Start with the root system",
              body:
                "A good rooting system supports healthy seedlings, efficient seed use, uniform and vigorous plants, and lower seedling losses. The source connects healthy roots with reduced transplant shock and better field establishment. In practice, a nursery decision should ask whether roots can establish quickly after transplanting, rather than judging a tray only by leaf colour or height. Seedling quality is an early production decision because weak roots can carry stress into the field before a crop-management response is possible.",
              callout:
                "Assess the seedling as a root-and-shoot system: a green canopy does not compensate for a weak root system.",
            },
            {
              heading: "Recognise stress in a traditional seedling nursery",
              body:
                "The source describes traditional seedlings as having underdeveloped or weak roots, longer stems that indicate greater stress, and a high susceptibility to transplanting shock. These features make the crop less predictable at field establishment. Compare seedlings within a batch as well as against an expected standard: variation in vigour, stem form, and rooting can signal that spacing, light, moisture, drainage, soil condition, or pest protection needs improvement before transplanting begins.",
            },
            {
              heading: "Connect nursery quality with the crop calendar",
              body:
                "High-quality seedlings can establish rapidly in the field, which the source associates with earlier flowering and fruiting than seedlings from a ground nursery. This benefit comes through faster establishment, not through skipping crop, field, or weather assessment. Use the nursery review to decide whether a batch is ready, needs more protection or recovery time, or should be rejected. A uniform, vigorous batch also makes subsequent irrigation, nutrition, scouting, and crop-stage decisions easier to time consistently.",
            },
          ],
        },
        {
          id: "build-and-protect-an-improved-nursery",
          title: "Build and protect an improved nursery",
          duration: "33 min",
          kicker: "Improve the environment before the crop is transplanted",
          summary:
            "Apply practical nursery improvements for spacing, soil condition, water movement, light, rain, and insect exclusion so seedlings enter the field healthy and protected.",
          outcomes: [
            "Select practical nursery improvements for spacing, sowing, soil condition, raised beds, drainage, and light exposure.",
            "Explain how a nursery house and intact insect net reduce seedling contamination and pest-disease risk.",
            "Design a simple protected nursery that balances sun, rain, airflow, drainage, and exclusion of insect entry points.",
          ],
          sections: [
            {
              heading: "Improve the nursery bed and growing space",
              body:
                "The source identifies wider spacing, planting in rows or line sowing, soil preparation, soil sterilisation, raised beds, drainage, rain cover where appropriate, insect netting, and a nursery area with good light exposure as practical improvements. These measures work together. Wider, orderly spacing supports more even growth and inspection; prepared and sterilised soil reduces avoidable risk; raised beds and drainage protect the root zone; and good light exposure supports strong seedlings. Select a package that fits the nursery site rather than relying on one improvement alone.",
              callout:
                "A protected nursery still needs good light and drainage. Protection should control stress, not create a dark or waterlogged growing environment.",
            },
            {
              heading: "Use the nursery house as a health barrier",
              body:
                "A nursery house is important because it helps produce healthy, disease-free seedlings. The source identifies protection from soil contamination, rain, and excessively intense sunlight, as well as protection from insect pests and diseases using nets around the nursery. Inspect the enclosure for openings: an insect net only functions as an exclusion barrier when insects cannot enter through gaps. Treat the structure, net, entrance practice, and clean growing environment as linked controls rather than as separate features.",
            },
            {
              heading: "Design a simple, practical protected nursery",
              body:
                "The source describes a strong, simple, practical, and effective nursery as protected from strong sun heat and strong rain, positioned openly without shade, and raised above the ground. It also notes that insect nets protect against sucking insects, while virus effects may take three to six weeks to become visible and seedlings can be infected before transplanting. Do not treat a symptom-free tray as proof that exclusion failed nowhere. Maintain intact netting and a clean, protected environment from the earliest seedling stage, then continue inspection before field planting.",
            },
          ],
        },
      ],
      assessment: {
        id: "nursery-for-vegetable-production-check",
        title: "Vegetable-nursery quality check",
        description:
          "Apply root-quality, nursery-improvement, and seedling-protection principles to a practical vegetable-transplant decision.",
        kind: "module",
        passMark: 80,
        questions: [
          {
            id: "nv-1",
            prompt: "Which outcome is most closely associated with a good seedling root system in the source?",
            options: [
              { id: "a", label: "Better field establishment, reduced transplant shock, and fewer seedling losses." },
              { id: "b", label: "A guarantee that seedlings need no water after transplanting." },
              { id: "c", label: "Longer stems and greater susceptibility to transplant shock." },
              { id: "d", label: "A reason to avoid all nursery inspection." },
            ],
            correctOptionId: "a",
            feedback: { correct: "Correct. The source links healthy roots with reduced stress, less loss, and stronger establishment in the field.", incorrect: "A good root system supports healthy, uniform seedlings, reduces transplant shock and losses, and improves field establishment." },
          },
          {
            id: "nv-2",
            prompt: "Which combination best signals a stressed traditional seedling nursery according to the source?",
            options: [
              { id: "a", label: "Underdeveloped roots, elongated stems, and high vulnerability to transplant shock." },
              { id: "b", label: "Healthy roots, uniform vigour, and rapid establishment." },
              { id: "c", label: "Raised beds, good drainage, and an intact insect net." },
              { id: "d", label: "An open, well-lit site with protection from strong rain." },
            ],
            correctOptionId: "a",
            feedback: { correct: "Correct. The source describes weak roots, longer stressed stems, and transplant-shock susceptibility in traditional seedlings.", incorrect: "The source contrasts traditional seedlings with weak roots, longer stressed stems, and high transplant-shock risk against high-quality seedlings." },
          },
          {
            id: "nv-3",
            prompt: "Which nursery-improvement package best follows the source guidance?",
            options: [
              { id: "a", label: "Use wider spacing and line sowing with prepared or sterilised soil, raised beds, drainage, appropriate rain cover, good light, and insect netting." },
              { id: "b", label: "Crowd seedlings in an unprepared flat area so they compete for light." },
              { id: "c", label: "Place the nursery in permanent deep shade and remove drainage to hold water." },
              { id: "d", label: "Use a single fertiliser input instead of managing spacing, soil, water, and pest entry." },
            ],
            correctOptionId: "a",
            feedback: { correct: "Correct. The improved nursery combines practical controls for growing space, soil condition, drainage, protection, and light.", incorrect: "The source presents nursery improvement as a combined package: spacing, orderly sowing, soil preparation, raised drainage, appropriate cover, good light, and insect exclusion." },
          },
          {
            id: "nv-4",
            prompt: "Why must insect netting around a nursery have no openings, even when seedlings do not yet show virus symptoms?",
            options: [
              { id: "a", label: "Nets exclude sucking insects, and virus effects may take three to six weeks to appear after seedlings have already been infected." },
              { id: "b", label: "Openings improve disease protection by increasing insect access." },
              { id: "c", label: "Virus symptoms always appear immediately, so net integrity does not matter before transplanting." },
              { id: "d", label: "Netting replaces the need for light, drainage, and nursery hygiene." },
            ],
            correctOptionId: "a",
            feedback: { correct: "Correct. The source links intact netting with protection from sucking insects and cautions that virus effects can be delayed.", incorrect: "Intact netting prevents insect entry; delayed virus symptoms mean seedlings can be infected before visible signs appear or before transplanting." },
          },
        ],
      },
    },
    {
      id: "open-field-seedling-production",
      index: 18,
      title: "Open-field seedling production",
      eyebrow: "Module 18",
      description:
        "Produce, protect, harden, and transplant bare-root seedlings through careful site selection, thin sowing, climate-responsive protection, and daily nursery management.",
      lessons: [
        {
          id: "prepare-and-sow-a-bare-root-nursery",
          title: "Prepare and sow a bare-root nursery",
          duration: "34 min",
          kicker: "Build the conditions for strong transplants",
          summary:
            "Select and prepare an open-field nursery site, manage the seedbed and weeds, then use thin, precise row sowing to produce vigorous bare-root seedlings.",
          outcomes: [
            "Compare dense traditional sowing with thin row sowing for seed use, aeration, vigour, and disease-transfer risk.",
            "Select and prepare a nursery site for light, drainage, soil condition, weed control, and raised-bed management.",
            "Apply precise thin-sowing principles for row spacing, depth, coverage, watering, and realistic seedling-loss allowance.",
          ],
          sections: [
            {
              heading: "Replace dense sowing with orderly rows",
              body:
                "The source identifies densely sown traditional onion beds as a risk because they use a high seed volume, force seedlings to compete for nutrients, light, and space, produce weak plants, reduce aeration, and allow disease to move quickly from one seedling to another. Row sowing reverses these pressures: it uses less seed, reduces competition, improves aeration, supports strong healthy vigorous seedlings, and lowers disease-transfer incidence. Use the nursery layout to create space for individual seedling development and for practical inspection, weeding, watering, and removal of problem plants.",
              callout:
                "Thin, orderly sowing is a seedling-health practice, not simply a way to make a nursery look tidy.",
            },
            {
              heading: "Select and prepare the nursery site before sowing",
              body:
                "Choose a site free from adjacent trees that would shade the bed and free from weeds. The source recommends the highest suitable position on the farm to reduce flooding damage, sandy loam as an optimum soil type, and raised beds as the preferred structure; wet areas may need high beds with deep furrows for drainage. An ideal soil has good aeration, holds useful water while draining excess water, and is fertile. Prepare the soil well before the intended sowing date, incorporate well-decomposed organic material and the locally appropriate nutrient inputs, shape the raised beds, then level, rake, and water about two weeks before sowing.",
            },
            {
              heading: "Use a stale seedbed and precise thin sowing",
              body:
                "Before sowing, irrigate the prepared seedbed to encourage weed germination for about a week, then cultivate again to remove those weeds before the crop seeds are placed. Clean the bed before weeds flower or set seed. For solanaceous and brassica crops, the source gives an example of one-half gram of seed per running metre and row spacing of about eight to fifteen centimetres. Mark rows with a wooden stick, cover seeds gently by replacing soil, and water lightly after sowing. As a rough depth rule, do not sow seed deeper than twice its diameter. Plan for mortality in the bare-root system rather than crowding beds to compensate; the source notes an indicative mortality level of around 30 percent.",
            },
          ],
        },
        {
          id: "protect-harden-and-transplant-bare-root-seedlings",
          title: "Protect, harden, and transplant bare-root seedlings",
          duration: "38 min",
          kicker: "Carry nursery quality into the field",
          summary:
            "Adapt nursery protection to weather, prevent pest and disease losses, harden seedlings before field conditions, and transplant bare-root plants with minimum root injury and shock.",
          outcomes: [
            "Select moisture, shade, rain, heat, and insect protection that fit dry, wet, or cool nursery conditions.",
            "Harden seedlings and schedule transplanting to minimise environmental and root-system shock.",
            "Use daily monitoring, cultural controls, and locally compliant interventions to manage nursery pests and disease risks.",
          ],
          sections: [
            {
              heading: "Match seedling protection to the weather",
              body:
                "In a dry climate, keep beds moist but not waterlogged, check soil moisture, irrigate only when needed, and protect beds from strong sun with shade netting. A temporary jute-bag or similar cover can protect the top layer from drying, but remove it as soon as germination begins; continuing to cover emerged seedlings can reduce light and cause stretching. Check germination twice daily and protect seedlings from sucking insects that can transmit viral diseases. In wet conditions, protect beds from strong rain with suitable cover, but remove plastic after rain when sun breaks through to prevent overheating. In cool semi-tropical winter conditions, transparent plastic can trap heat and accelerate seedling development. Mulch or netting can help retain moisture for germination, but all covers must be managed in response to heat, light, and emergence.",
              callout:
                "A cover is a temporary climate control: remove or adjust it when it begins to create heat, darkness, or excess moisture rather than protection.",
            },
            {
              heading: "Harden before transplanting and handle roots carefully",
              body:
                "For solanaceous and brassica seedlings, the source recommends gradual exposure to direct sunlight for five to seven days before transplanting and a gradual reduction in irrigation. Hardening prepares seedlings for field conditions and helps reduce transplant shock. Transplant late in the afternoon or on a cloudy day. Water the seedling beds beforehand and water the destination field so soil can contact roots well. Lift seedlings carefully with a tool that digs beneath the root system, separate plants gently, transport them in a container, and water them if they dry. Set bare-root seedlings slightly deeper than their nursery position, water again if needed, and do not transplant broken or very weak plants. During the usual seven- to fourteen-day root-establishment period, irrigate as required, inspect the field, and replace plants that die or are destroyed by insects.",
            },
            {
              heading: "Monitor daily and manage pests and disease early",
              body:
                "Daily ground-nursery monitoring supports rapid action: remove weeds before they compete for space, light, and nutrients; inspect for leaf miners, caterpillars, sucking insects, beetle feeding, and nursery disease. The source uses cultural controls such as raised beds, appropriate spacing, avoiding excessive irrigation, watering early enough for the bed to dry before night, and rain protection to reduce damping-off risk. It also presents physical controls, intact netting, yellow or blue sticky traps, affected-leaf removal, caterpillar collection, and biopesticides such as neem extract as options. Where a crop-protection product is considered, use only a locally registered product, follow its label, and integrate it with cultural and physical controls rather than waiting for a serious outbreak.",
            },
          ],
        },
      ],
      assessment: {
        id: "open-field-seedling-production-check",
        title: "Open-field seedling-production check",
        description:
          "Apply bare-root nursery, climate protection, hardening, transplanting, and daily pest-management principles to seedling-production decisions.",
        kind: "module",
        passMark: 80,
        questions: [
          {
            id: "of-1",
            prompt: "What is the strongest reason to use thin row sowing rather than a densely sown traditional bare-root bed?",
            options: [
              { id: "a", label: "It reduces seed use and competition, improves aeration, supports vigorous seedlings, and reduces disease transfer." },
              { id: "b", label: "It guarantees that no seedling mortality will occur." },
              { id: "c", label: "It removes the need for site selection and drainage." },
              { id: "d", label: "It makes seedlings compete more strongly for light and nutrients." },
            ],
            correctOptionId: "a",
            feedback: { correct: "Correct. The source links row sowing with less seed use, less competition, better aeration, stronger seedlings, and less disease transfer.", incorrect: "Thin row sowing improves the growing environment by reducing competition and disease-transfer pressure while supporting aeration and vigour." },
          },
          {
            id: "of-2",
            prompt: "Which site-and-bed preparation best follows the source guidance for an open-field bare-root nursery?",
            options: [
              { id: "a", label: "Use a weed-free, well-lit high site with suitable well-aerated soil, raised beds and drainage; prepare, level, and water the bed ahead of sowing." },
              { id: "b", label: "Place the nursery under trees in the farm’s lowest flooded area so the bed stays moist." },
              { id: "c", label: "Sow into a weedy, unprepared bed and rely on crowding to suppress weeds." },
              { id: "d", label: "Use a flat compacted bed with no furrows because drainage reduces seedling growth." },
            ],
            correctOptionId: "a",
            feedback: { correct: "Correct. The source favours a weed-free, unshaded high site, suitable aerated soil, raised beds, drainage, and well-timed preparation.", incorrect: "Strong seedlings begin with site, soil, drainage, and weed management. Avoid shaded, weedy, low-lying, or poorly drained nursery positions." },
          },
          {
            id: "of-3",
            prompt: "Seedlings have just started emerging beneath a temporary mulch or jute cover in strong dry weather. What should the nursery manager do?",
            options: [
              { id: "a", label: "Remove the cover immediately to prevent light shortage and stretching, then continue to manage moisture and protection as needed." },
              { id: "b", label: "Leave the cover in place until transplanting so seedlings receive no direct light." },
              { id: "c", label: "Flood the bed every evening regardless of soil moisture." },
              { id: "d", label: "Stop checking germination because emergence proves all seedlings are healthy." },
            ],
            correctOptionId: "a",
            feedback: { correct: "Correct. The source says to remove mulch when seeds sprout to avoid etiolation from inadequate sun exposure.", incorrect: "Temporary covers protect germination, but they should be removed at emergence to prevent low-light stretching; manage water according to actual soil moisture." },
          },
          {
            id: "of-4",
            prompt: "Which transplanting sequence best reduces shock for bare-root seedlings?",
            options: [
              { id: "a", label: "Harden seedlings, transplant late in the afternoon or on a cloudy day, water nursery and field, lift roots carefully, set slightly deeper, and maintain establishment irrigation and checks." },
              { id: "b", label: "Transplant weak or broken seedlings at midday into dry soil and withhold water to harden them quickly." },
              { id: "c", label: "Pull seedlings sharply from dry beds, expose roots to sun, and avoid replacing plants that die." },
              { id: "d", label: "Wait for damping-off symptoms before managing moisture, spacing, drainage, weeds, or rain protection." },
            ],
            correctOptionId: "a",
            feedback: { correct: "Correct. The source links hardening, low-stress timing, pre-watering, careful root handling, appropriate depth, irrigation, and follow-up checks with lower transplant shock.", incorrect: "Bare-root seedlings need gradual hardening, careful lifting, good root-soil contact, low-stress timing, establishment irrigation, and a field check for losses." },
          },
        ],
      },
    },
    {
      id: "protective-and-cellular-seedling-production",
      index: 19,
      title: "Protective and cellular seedling production",
      eyebrow: "Module 19",
      description:
        "Use cellular containers, clean growing media, protected germination, responsive seedling care, hardening, and quality checks to produce uniform, field-ready vegetable transplants.",
      lessons: [
        {
          id: "prepare-cellular-media-and-sow-for-uniformity",
          title: "Prepare cellular media and sow for uniformity",
          duration: "36 min",
          kicker: "Build a clean root environment in every cell",
          summary:
            "Choose an appropriate container and cell size, prepare and sterilise a balanced seedling medium, then sow, orient, cover, and water seeds for uniform emergence.",
          outcomes: [
            "Compare leaf pots, recycled containers, and seedling trays against scale, cost, reuse, media demand, and local availability.",
            "Select tray-cell size and growing-media qualities that fit crop seed size, canopy development, and transplant timing.",
            "Prepare, sterilise, fill, sow, and water a cellular tray without damaging germination or root-zone structure.",
          ],
          sections: [
            {
              heading: "Choose the container and cell for the crop and schedule",
              body:
                "Container or cellular production can use leaf pots, plastic cups or polythene pots, and commercial seedling trays. Leaf pots can be locally available, low cost, organic, and suitable for a small area, but they are labour-intensive, can harbour insect eggs, and are generally single-use. Recycled cups and pots can be reused but create disposal and availability constraints and may require more media. Seedling trays are easy to handle and transport, reusable when durable, capable of producing high volumes, and use less media, although they can cost more and may not be available locally. Select the smallest practical cell when transplanting will occur on schedule; the source notes that smaller cells suit solanaceous and brassica crops, while larger cells suit cucurbits and provide more tolerance when transplanting is slightly delayed.",
              callout:
                "Cell size is a production-and-timing decision: the economical smallest cell becomes a quality risk when a transplant date is likely to slip.",
            },
            {
              heading: "Balance the seedling medium and remove avoidable risks",
              body:
                "A good seedling medium combines nutrient content, porosity, and water-holding capacity. The source illustrates a mixture built from clean-area soil, well-decomposed manure, and sand or carbonised rice husk, with proportions adjusted to locally available materials. Vermicompost, well-decomposed farmyard manure, garden soil, cocopeat, sand, carbonised rice husk, and vermiculite can contribute different functions. Sieve material to obtain fine particles, mix thoroughly, and dampen it to the point at which it is neither too wet nor too dry. Sterilise the prepared, moist medium by heating and stirring evenly for the required time while preventing it from drying; steam helps control pathogens, insects, and weed seeds. Solarisation in a black or clear plastic bag in full sun is an alternative described by the source.",
            },
            {
              heading: "Fill, sow, and water without disturbing the seed",
              body:
                "Fill trays and tap them gently so the substrate settles, but do not compress it. Make a planting hole and sow seed at about twice its diameter; deeper sowing can impair germination. Use one seed per cell. For very small seeds, lightly settle the substrate, place seed on the surface, and cover with a fine layer. When placing pre-germinated cucurbit seed, orient the emerging radicle downward. Use a sprinkler or fine-droplet sprayer so water does not wash seed out of its position. These small controls make emergence more uniform and preserve the root volume that will be carried into the field.",
            },
          ],
        },
        {
          id: "manage-protected-germination-and-transplant-readiness",
          title: "Manage protected germination and transplant readiness",
          duration: "39 min",
          kicker: "Protect, feed, harden, and verify the transplant",
          summary:
            "Control protection, pre-germination, moisture, nutrition, hardening, and quality checks so cellular seedlings leave the nursery vigorous and adapted to field conditions.",
          outcomes: [
            "Manage tray covers, pre-germination, and germination conditions without overheating, drying, or delaying emergence.",
            "Use responsive watering, nutrition, and protective practices to reduce seedling stress and pest-disease risk.",
            "Harden and assess seedlings using root, leaf, stem, height, vigour, and uniformity evidence before transplanting.",
          ],
          sections: [
            {
              heading: "Control germination rather than simply covering the tray",
              body:
                "Move newly sown trays into a protected nursery, use netting to reduce sucking-insect access and viral-disease risk, and use rice straw, paper, or sack material to limit drying and regulate temperature in cold conditions. Check daily and remove the cover once germination starts. Most seed can be sown directly, but the source identifies pre-germination as useful especially in winter or cold weather because it can speed and synchronise germination. Never soak coated seed, because soaking can remove its fungicide treatment. For seeds that need pre-germination, use a clean damp cloth and container, check regularly, and transfer seed to the tray when the radicle is just emerging; an overlong radicle can be damaged during sowing. A germination chamber offers controlled temperature and humidity, but trays still need checking several times a day, must not dry out or become too wet, and should not remain inside too long.",
              callout:
                "The right pre-germinated seed has a radicle just emerging—not a long root that must be bent, broken, or delayed before sowing.",
            },
            {
              heading: "Give water, nutrients, and protection responsively",
              body:
                "Maintain constant root-block moisture and never allow a seedling to wilt completely. Use gentle mist, water early enough for foliage to dry, check the root block before choosing a light or heavier watering, and inspect cells that dry more quickly. Overwatering can promote damping-off, especially in warm weather. The source distinguishes short-stay crops such as cucurbits, which may not need supplementary fertiliser if the medium is nutrient-rich, from seedlings that remain in trays longer, such as brassicas and solanaceous crops, which may require feeding. It describes a starter solution after emergence and root-zone or bottom-of-tray application to avoid leaf burn; translate this into a locally appropriate, labelled programme based on crop duration, media quality, and observed vigour. Fine-mesh shade net can reduce light and insect pressure, while polythene can protect from heavy rain. Calcium, phosphorus, and potassium are discussed in the source as supporting stronger tissue and disease resistance, but nutrient additions should always follow evidence and local product guidance.",
            },
            {
              heading: "Harden, then assess the field-ready seedling",
              body:
                "Hardening makes a protected seedling strong enough for field conditions. The source describes gradual shade removal or movement into full sun, midday protection during the first days, and reduced water. It gives an indicative hardening period of three to five days for cucurbits and brassicas and five to seven days for solanaceous crops, followed by late-afternoon transplanting. Without hardening, seedlings may wilt and die in hot, dry conditions. At the transplanting stage, expect uniform growth and assess vigour, root colour, height, leaf colour, and stem thickness. Healthy roots are white rather than brown, leaves should be green rather than yellowish, stems should be sturdy, and the source cites a typical height of three to four inches. Use these signals together; a seedling is field-ready when it is both uniform and well hardened, not simply because it has reached a calendar date.",
            },
          ],
        },
      ],
      assessment: {
        id: "protective-and-cellular-seedling-production-check",
        title: "Protected cellular seedling-production check",
        description:
          "Apply container choice, clean-media preparation, protected germination, responsive care, hardening, and seedling-quality principles to a transplant-production decision.",
        kind: "module",
        passMark: 80,
        questions: [
          {
            id: "pc-1",
            prompt: "A grower may need to delay transplanting a cucurbit crop slightly. Which tray choice best follows the source guidance?",
            options: [
              { id: "a", label: "Use a larger cell that accommodates cucurbit growth and reduces quality loss if transplanting is slightly delayed." },
              { id: "b", label: "Use the smallest possible cell because it always protects quality regardless of delay." },
              { id: "c", label: "Use a leaf pot only because it can never harbour pest eggs." },
              { id: "d", label: "Choose no container because all cellular systems require more media than bare soil." },
            ],
            correctOptionId: "a",
            feedback: { correct: "Correct. The source links larger cells with cucurbits and with lower quality risk when transplant timing slips slightly.", incorrect: "Cell size should reflect crop growth and schedule. The source identifies larger cells for cucurbits and notes their extra tolerance to a slight transplant delay." },
          },
          {
            id: "pc-2",
            prompt: "Which preparation sequence best protects the quality of a cellular growing medium?",
            options: [
              { id: "a", label: "Mix nutrient, porous, and water-holding materials; sieve and moisten to a balanced condition; then sterilise without allowing the medium to dry." },
              { id: "b", label: "Heat completely dry medium until it changes colour, then compact it tightly into cells." },
              { id: "c", label: "Use unsieved materials with weed seeds and add water only after seedlings emerge." },
              { id: "d", label: "Compress the tray strongly so roots cannot move during germination." },
            ],
            correctOptionId: "a",
            feedback: { correct: "Correct. The source calls for balanced media, fine particles, correct moisture, and sterilisation that avoids heating the medium dry.", incorrect: "A high-quality medium combines nutrient content, porosity, water holding, fine texture, balanced moisture, and careful sterilisation; do not dry-heat or compact it." },
          },
          {
            id: "pc-3",
            prompt: "What is the most appropriate handling of pre-germinated bitter-gourd seed for cellular sowing?",
            options: [
              { id: "a", label: "Transfer it when the radicle is just emerging and place the radicle facing downward; do not wait until it becomes long." },
              { id: "b", label: "Soak coated seed until its treatment washes off, then sow it with the radicle facing upward." },
              { id: "c", label: "Keep seed in a germination chamber until roots become very long, then bend them into the cell." },
              { id: "d", label: "Sow several pre-germinated seeds in one cell at an arbitrary deep depth." },
            ],
            correctOptionId: "a",
            feedback: { correct: "Correct. The source identifies just-emerging radicles as ideal for sowing and shows cucurbit radicles oriented downward.", incorrect: "Use seed when the radicle is only emerging and orient a pre-germinated cucurbit radicle downward; long roots are more easily damaged during sowing." },
          },
          {
            id: "pc-4",
            prompt: "Which combination best indicates a cellular seedling is ready for field transplanting?",
            options: [
              { id: "a", label: "Uniform vigorous growth, white roots, green leaves, a sturdy stem, appropriate height, and completion of gradual hardening." },
              { id: "b", label: "Brown roots, yellow leaves, a thin stem, and no exposure to field-like conditions." },
              { id: "c", label: "Maximum height alone, regardless of root colour, vigour, or hardening." },
              { id: "d", label: "A calendar date alone, even if seedlings are wilted or uneven." },
            ],
            correctOptionId: "a",
            feedback: { correct: "Correct. The source combines quality cues—roots, foliage, stem, height, vigour, and uniformity—with hardening before field conditions.", incorrect: "Assess several indicators together and verify hardening. A field-ready seedling is uniform and vigorous, with healthy white roots, green leaves, a sturdy stem, appropriate height, and field adaptation." },
          },
        ],
      },
    },
    {
      id: "seedling-production-planning",
      index: 20,
      title: "Seedling production planning",
      eyebrow: "Module 20",
      description:
        "Plan seedling production from seed quality and crop layout through media, nursery method, and nutrient choices so the right number of healthy transplants is ready at the right time.",
      lessons: [
        {
          id: "select-quality-seed-and-compute-seedling-needs",
          title: "Select quality seed and compute seedling needs",
          duration: "35 min",
          kicker: "Turn crop layout into a traceable seed order",
          summary:
            "Read seed quality and packaging information, distinguish hybrid from open-pollinated seed, protect storage and seed-treatment integrity, and calculate the seedling quantity required for a planned area.",
          outcomes: [
            "Use label, source, origin, production date, storage condition, and germination information to assess seed quality before purchase or sowing.",
            "Compare hybrid and open-pollinated seed characteristics against the production objective and management context.",
            "Calculate target plant population and seed quantity from area, layout, crop-guide information, seed count, and a realistic replacement allowance.",
          ],
          sections: [
            {
              heading: "Read seed quality before the nursery starts",
              body:
                "Good-quality seed supports high yield and produce quality only when crop management is also sound. The source directs learners to examine label instructions, seed packaging, storage condition, seed source and origin, and production date. Common packaging information includes purity, disease-protection information, germination percentage, company name, batch number, production and best-before dates, coating-film information, crop, variety, and seed type. Record the details that affect the production decision rather than treating seed as an interchangeable input. Storage and packaging determine viability; the source advises cool, dry, aerated storage and warns that moist conditions can cause seed to germinate in storage.",
              callout:
                "Seed quality is verified from traceable information and storage history—not inferred from a packet’s appearance alone.",
            },
            {
              heading: "Match seed type and treatment to the plan",
              body:
                "The source describes hybrid seed as produced through a plant-breeding programme and associates it with improved pest and disease resistance or abiotic-stress tolerance, earlier maturity, higher yield, and more uniform fruit. Open-pollinated seed is described as arising through natural selection and, in the source comparison, as generally less resistant, later maturing, lower yielding, and less uniform. Use this as a planning comparison, then connect the seed choice to target market, crop calendar, risk, budget, and the grower’s system. Film coating can protect stored seed and early seedlings, but coated seed should not be soaked before sowing because its protective film can be lost. Read the packet label and avoid duplicating pesticide treatments where the seed treatment already addresses the relevant risk.",
            },
            {
              heading: "Compute seed needs from the actual layout",
              body:
                "Start with the intended crop area, planting geometry, and a crop guide when one is available. Convert area and spacing to the planned number of plants, then add a realistic allowance for replacement seedlings; the source exercise uses a 30 percent allowance. Finally, convert the required seedling count into grams or packets using the stated seeds-per-gram information. When a crop guide is unavailable, calculate the area occupied per plant from row width and in-row spacing, including practical layout features such as paths, canals, or crawling areas. This prevents seed orders that ignore the real field layout or leave no capacity for replanting after establishment losses.",
            },
          ],
        },
        {
          id: "plan-media-method-and-nutrition-for-the-nursery",
          title: "Plan media, method, and nutrition for the nursery",
          duration: "31 min",
          kicker: "Design the production system before sowing",
          summary:
            "Select media, seedling-production method, nutrient source, and nursery protection as a connected system for healthy, disease-free seedlings.",
          outcomes: [
            "Specify growing-medium properties and locally available materials that support healthy seedling roots.",
            "Select a tray, leaf-pot, or improved-ground-nursery approach that fits the scale and production plan.",
            "Compare nutrient-source choices and use a protected nursery design to reduce avoidable seedling stress and contamination.",
          ],
          sections: [
            {
              heading: "Choose media for root function, not convenience alone",
              body:
                "The source defines a good medium by high porosity, useful water-holding capacity, freedom from soil-borne disease, good nutrient content, and freedom from salinity and acidity. It lists decomposed manure, decomposed or carbonised rice hull, peat moss, garden soil, commercial media, coco coir dust, guano, and vermicast as possible materials. Select a medium by the functions it must perform: retain sufficient water, allow air into the root zone, supply or hold nutrients, and avoid pathogens or chemical stresses. A nutrient-rich medium such as one incorporating vermicompost can reduce the need for later fertiliser use, but it does not eliminate the need to monitor seedling condition.",
            },
            {
              heading: "Select the method that matches the nursery plan",
              body:
                "The source identifies seed trays, leaf pots, and an improved ground nursery as seedling-production methods. Compare them against planned scale, availability of materials, labour, handling and transport requirements, root protection, and the planned transplant date. The choice should also align with the crop’s seed size, growing period, expected field conditions, and the amount of media and protection the nursery can reliably provide. Use the method as part of a wider production plan that links seed quality, target plant number, growing medium, crop calendar, and field establishment rather than as an isolated equipment decision.",
            },
            {
              heading: "Build nutrient and protection choices into the nursery plan",
              body:
                "The source groups seedling nutrient sources into organic and inorganic options, listing examples such as fish amino acid, vermi tea, activated microbial solution, balanced mineral fertiliser, calcium nitrate, calcium ammonium nitrate, and urea. The appropriate source must fit the medium, crop stage, observed vigour, and local product guidance; do not turn the category list into a universal application recipe. A nursery house helps maintain healthy, disease-free seedlings by protecting them from soil contamination, rain, intense sunlight, insect pests, and diseases. Combine media, method, nutrient strategy, and nursery protection early in planning so later care is a managed programme rather than a response to preventable stress.",
            },
          ],
        },
      ],
      assessment: {
        id: "seedling-production-planning-check",
        title: "Seedling-production planning check",
        description:
          "Apply seed-quality, seedling-quantity, media, method, nutrient, and nursery-protection principles to plan a dependable seedling-production cycle.",
        kind: "module",
        passMark: 80,
        questions: [
          {
            id: "sp-1",
            prompt: "Which information set gives the strongest basis for checking the quality and traceability of a seed lot before planning nursery production?",
            options: [
              { id: "a", label: "Label instructions, source and origin, storage condition, purity and germination information, batch, production and best-before dates, and crop-variety details." },
              { id: "b", label: "Packet colour and the assumption that all seed of one crop is identical." },
              { id: "c", label: "Seedling height after transplanting only." },
              { id: "d", label: "A decision to ignore coating, germination, source, and storage information." },
            ],
            correctOptionId: "a",
            feedback: { correct: "Correct. The source identifies traceable label, package, source, origin, production, germination, and storage information as the basis for a quality seed decision.", incorrect: "Use the seed label and package to check source, origin, batch, dates, purity, germination, treatment, crop, variety, type, and storage context before nursery planning." },
          },
          {
            id: "sp-2",
            prompt: "How should a grower handle film-coated seed before sowing?",
            options: [
              { id: "a", label: "Read the packet label and sow without soaking so the protective coating is not removed; avoid duplicating a treatment already present on the seed." },
              { id: "b", label: "Soak it until the coating washes off so germination becomes faster." },
              { id: "c", label: "Ignore coating information and automatically add the same pesticide treatment." },
              { id: "d", label: "Store it in a moist sealed environment until it begins germinating." },
            ],
            correctOptionId: "a",
            feedback: { correct: "Correct. The source warns that soaking can make a protective film ineffective and directs growers to read the seed packet before adding treatment.", incorrect: "Film-coated seed should not be soaked. Preserve the treatment, read the label, and avoid duplicating pesticide application already addressed by the seed coating." },
          },
          {
            id: "sp-3",
            prompt: "A calculated field layout requires 665 tomato plants. Using the source exercise’s 30% allowance for replanting, what seedling quantity should be planned?",
            options: [
              { id: "a", label: "About 865 seedlings." },
              { id: "b", label: "Exactly 665 seedlings, with no allowance." },
              { id: "c", label: "About 220 seedlings." },
              { id: "d", label: "About 1,330 seedlings." },
            ],
            correctOptionId: "a",
            feedback: { correct: "Correct. 665 plants plus a 30% allowance is approximately 865 seedlings, as shown in the source example.", incorrect: "Plan for replanting. The source exercise adds 30% to 665 target plants, giving approximately 865 seedlings before converting that quantity to seed weight or packet needs." },
          },
          {
            id: "sp-4",
            prompt: "Which nursery plan best connects media, method, nutrients, and protection?",
            options: [
              { id: "a", label: "Use a porous, water-holding, nutrient-supplying, disease-free, non-saline medium; choose trays, leaf pots, or an improved ground nursery for the plan; match nutrients to crop condition and product guidance; and use a nursery house for contamination, weather, and pest protection." },
              { id: "b", label: "Use any compact, saline medium, choose a method without considering scale, and treat nutrient and protection decisions as unrelated." },
              { id: "c", label: "Rely on fertiliser alone, regardless of medium quality, nursery method, or protection from rain and insects." },
              { id: "d", label: "Remove nursery protection so rain, intense sun, contamination, and insects can harden seedlings immediately." },
            ],
            correctOptionId: "a",
            feedback: { correct: "Correct. The source presents medium function, production method, nutrient-source choice, and nursery protection as linked planning decisions.", incorrect: "A dependable nursery begins with media quality and a suitable method, then integrates nutrients with crop condition and protects seedlings from contamination, damaging weather, pests, and disease." },
          },
        ],
      },
    },
    {
      id: "field-preparation-mulching-and-trellising",
      index: 21,
      title: "Field preparation, mulching, and trellising",
      eyebrow: "Module 21",
      description:
        "Prepare a productive, well-drained field and use mulch and trellises as connected systems for soil protection, water management, crop health, and accessible field work.",
      lessons: [
        {
          id: "prepare-the-field-and-raised-beds",
          title: "Prepare the field and raised beds",
          duration: "38 min",
          kicker: "Build the crop environment before planting",
          summary:
            "Assess the site, clear and prepare the soil, set a workable layout, and form raised beds and drainage that match crop, soil, season, water flow, and field operations.",
          outcomes: [
            "Use field history, soil, water, light, slope, access, crop-fit, and farm-resource evidence to assess a potential planting area.",
            "Explain how clearing, soil preparation, layout, testing, amendments, beds, and drainage work together before planting.",
            "Design raised beds and drainage around season, soil, waterlogging risk, crop operations, and root-zone protection.",
          ],
          sections: [
            {
              heading: "Visit and assess the field before committing the crop",
              body:
                "The source begins with field selection: inspect soil quality, water availability, light direction and duration, field history, and topography, including contours on sloping land. It gives a practical light reference of at least six hours per day. During a field visit, discuss previous crops, pest and disease problems, fertilisation history, flooding, local crop patterns, and market prices with the farmer and surrounding growers. Check road proximity, signage, security, soil pH, texture, profile and colour, year-round water access, slope, sun direction, winds, crop and variety fit, labour, and input accessibility. This turns land preparation into a site-specific decision rather than a routine sequence applied to every plot.",
              callout:
                "A productive bed starts with a field decision: document the water, soil, light, history, slope, market, and resource conditions that will determine whether the crop can be managed well.",
            },
            {
              heading: "Clear, cultivate, and lay out the work system",
              body:
                "Clear old crops, weeds, stones, and rocks before construction begins. The source recommends composting weeds and crop debris except infected or infested plants, and clearing weeds before they flower or set seed. Soil preparation disrupts weeds, breaks blocky structure, supports bed preparation and mulching, helps control insects and breeding sites, improves aeration and root growth, supports water holding, and improves nutrient uptake. Plough and harrow as appropriate, then use stakes, a measuring tape, and string to lay out the field while accounting for slope, sun, and wind. Check soil quality, including pH and nitrogen where possible, review field and crop history, obtain appropriate amendment advice when needed, and plan drainage around rainy-season water flow. A visible layout makes weeding, fertilising, spraying, irrigation, and movement easier to manage.",
            },
            {
              heading: "Form beds and drainage for the season and soil",
              body:
                "The source warns that earthing up without raised beds can be labour-intensive, damage surface roots, complicate irrigation through runoff, and contribute to stem rot where stems are covered. Raised-bed preparation creates favourable structure, reduces waterlogging, supports furrow irrigation and rainy-season drainage, avoids compaction in the growing area, and organises field work. Use a roughly one-metre bed width with drainage canals, incorporate nutrients based on soil pH and nutrient evidence, then level and form the beds. Adjust height to soil and season: the source gives approximately ten to twenty centimetres in dry periods and thirty to fifty centimetres in rainy periods, with bed preparation completed about two weeks before planting. Build drainage canals before heavy rain; waterlogging reduces soil aeration, damages roots, and can lead to wilting.",
            },
          ],
        },
        {
          id: "use-mulch-and-trellises-as-crop-management-systems",
          title: "Use mulch and trellises as crop-management systems",
          duration: "37 min",
          kicker: "Protect the soil and support the crop",
          summary:
            "Select, install, and manage plastic or organic mulch and crop-appropriate trellises to improve moisture, weed, disease, erosion, fruit quality, crop access, and field operations.",
          outcomes: [
            "Compare plastic and plant-based mulches for their soil, water, crop-health, labour, cost, and disposal implications.",
            "Install mulch so it protects the bed without creating heat, humidity, root, or environmental problems.",
            "Select and time trellising for crop family, growth habit, field work, wind protection, light exposure, and harvest access.",
          ],
          sections: [
            {
              heading: "Use mulch for more than weed suppression",
              body:
                "Mulching is a layer placed on the bed primarily to conserve soil moisture and suppress weeds. The source describes mulch, drip irrigation, green manuring, and rotation as complementary field improvements. Plastic mulch can suppress weeds, reduce nutrient leaching, conserve moisture, improve aeration and infiltration, reduce waterlogging and erosion, and keep fruit off soil. Plant-based mulch—such as grasses, rice straw, maize stalks, banana leaves, water hyacinth, and crop residues—can also reduce weeds and fruit-soil contact, conserve moisture, protect against rain damage, improve aeration and infiltration, contribute organic nutrients through decomposition, and cool soil in hot weather. Select the material around the whole field system, including water, disease pressure, labour, access, budget, and disposal.",
              callout:
                "Mulch is an active soil-management layer. Its value depends on bed preparation, water control, material condition, installation quality, and follow-up—not its presence alone.",
            },
            {
              heading: "Install and manage mulch without creating new risks",
              body:
                "Plastic mulch carries a higher initial cost and must be installed tightly over a well-pulverised, level bed. Loose installation or air pockets beneath the plastic can create damaging heat during crop establishment, while extra humidity and heat can worsen existing fungal or bacterial problems. The source advises avoiding both loose plastic and excessive tension, preparing the soil so mulch sits snugly, checking plastic quality and thickness, and not using plastic beyond its suitable crop-cycle life. Handle used plastic responsibly: collect it for an available recycling route and do not burn it or leave it in the field. For straw mulch, level and water the bed first, apply a layer about eight to ten centimetres thick before sowing or transplanting, make planting holes, and keep mulch away from the plant base. Organic mulch can be labour-intensive, may encourage rats or chickens, can create rot under excessive humidity, and may be scarce at larger commercial scale.",
            },
            {
              heading: "Trellis early and build it for crop work",
              body:
                "A trellis is a light wood or metal framework that supports shrub and climbing vegetables. It improves plant performance by supporting crops against strong winds, increasing light exposure and photosynthesis, maximising space, improving air circulation, simplifying pest and disease monitoring, keeping fruit off the ground, and easing harvest and maintenance such as pruning. For cucurbits and legumes, the source recommends preparing a vertical trellis before transplanting so vines have a ready crawling area and are not stressed by late training; do not sow if the needed trellising materials are not ready. For solanaceous crops, install support soon after transplanting—within roughly seven to fourteen days in the source guidance—to support growth and avoid later disturbance to flowers. Use strong, practical materials at adequate spacing and height, place posts before or soon after transplanting, tie them together securely, and fit netting or a suitable string, bamboo, or wire alternative. Clean, roll, and store reusable netting after harvest.",
            },
          ],
        },
      ],
      assessment: {
        id: "field-preparation-mulching-and-trellising-check",
        title: "Field-preparation, mulching, and trellising check",
        description:
          "Apply site appraisal, clearing, soil and bed preparation, drainage, mulch installation, and crop-specific trellising principles to a practical vegetable-field plan.",
        kind: "module",
        passMark: 80,
        questions: [
          {
            id: "fm-1",
            prompt: "Which field-assessment approach best follows the source guidance before starting vegetable bed preparation?",
            options: [
              { id: "a", label: "Review soil, water, light, history, flooding, slope, sun, wind, crop fit, labour, input access, local crops, and market context with the farmer." },
              { id: "b", label: "Select the field only because it is the closest plot, without checking soil, water, light, history, or field risk." },
              { id: "c", label: "Begin planting first and investigate drainage or pest history only after a crop failure." },
              { id: "d", label: "Use current crop price alone to replace all field and farm evidence." },
            ],
            correctOptionId: "a",
            feedback: { correct: "Correct. The source frames field preparation around a broad site visit that combines production, environmental, operational, and market evidence.", incorrect: "Start by documenting soil, water, light, history, flooding, topography, crop fit, access, labour, inputs, and local market context with the farmer." },
          },
          {
            id: "fm-2",
            prompt: "Why are raised beds and drainage canals particularly important for a vegetable field entering the rainy season?",
            options: [
              { id: "a", label: "They reduce waterlogging, protect root-zone aeration, support drainage and furrow irrigation, and make field work more systematic." },
              { id: "b", label: "They intentionally keep roots saturated so wilting cannot occur." },
              { id: "c", label: "They remove the need to assess slope or water flow." },
              { id: "d", label: "They make soil testing and nutrient planning unnecessary." },
            ],
            correctOptionId: "a",
            feedback: { correct: "Correct. The source links raised beds and drainage with less waterlogging, better root-zone conditions, drainage, and more manageable field operations.", incorrect: "Raised beds and canals must be designed around season, soil, slope, and water movement to limit waterlogging and maintain aerated rooting conditions." },
          },
          {
            id: "fm-3",
            prompt: "Which mulch-management plan best avoids the key risks identified in the source?",
            options: [
              { id: "a", label: "Prepare a level bed, install plastic snugly without looseness or excessive tension, manage humidity and disease risk, and collect used plastic for recycling rather than burning or leaving it in the field." },
              { id: "b", label: "Leave loose plastic over cloddy soil so air pockets heat the bed, then burn it after harvest." },
              { id: "c", label: "Pile organic mulch directly against every plant base and ignore wet-season rot risk." },
              { id: "d", label: "Use mulch without considering bed level, soil moisture, material quality, environmental disposal, or crop health." },
            ],
            correctOptionId: "a",
            feedback: { correct: "Correct. The plan addresses installation quality, heat and humidity risks, soil preparation, and responsible post-use handling.", incorrect: "Mulch requires a prepared level bed, suitable tension, humidity and disease awareness, and responsible disposal; do not create air pockets, burn plastic, or ignore wet mulch against stems." },
          },
          {
            id: "fm-4",
            prompt: "When should trellising be prepared for cucurbit crops, and why?",
            options: [
              { id: "a", label: "Before transplanting, so plants have a ready vertical crawling area and vines are not stressed by late training after they begin growing on the ground." },
              { id: "b", label: "Only after harvest, because trellises do not affect crop growth or field work." },
              { id: "c", label: "After vines have crawled on the ground for several weeks, so training creates the greatest disturbance." },
              { id: "d", label: "Never; cucurbits cannot benefit from vertical support." },
            ],
            correctOptionId: "a",
            feedback: { correct: "Correct. The source advises preparing cucurbit and legume trellises before transplanting to avoid delayed training stress and provide a ready climbing structure.", incorrect: "For cucurbits and legumes, have materials and a vertical support ready before transplanting. Late installation can disturb vines that have already begun crawling on the ground." },
          },
        ],
      },
    },
    {
      id: "transplanting",
      index: 22,
      title: "Transplanting",
      eyebrow: "Module 22",
      description:
        "Prepare seedlings and field conditions, select the right transplanting stage and time, establish plants without root or heat stress, and recover missing stands quickly.",
      lessons: [
        {
          id: "prepare-seedlings-and-field-for-transplanting",
          title: "Prepare seedlings and field for transplanting",
          duration: "33 min",
          kicker: "Make the transition planned rather than stressful",
          summary:
            "Coordinate mulch, trellis, nutrient placement, moisture, hardening, plant stage, and field readiness so transplanting begins with the highest possible establishment potential.",
          outcomes: [
            "Confirm that mulch, trellising, planting holes, nutrient placement, and seedling moisture are ready before transplanting begins.",
            "Use gradual hardening and plant-stage cues to reduce transplant shock and avoid over-mature transplants.",
            "Schedule transplanting around heat exposure, seedling condition, field readiness, and crop-specific development.",
          ],
          sections: [
            {
              heading: "Complete the field-readiness checks before moving seedlings",
              body:
                "Transplanting is the transfer of seedlings from a seedbed, tray, or leaf cell to their permanent field position. The source directs the grower to verify that plastic or organic mulch is properly placed, that trellises are installed before transplanting where needed, and that planting holes are ready. If basal fertiliser was not incorporated before mulch installation, prepare holes and apply the appropriate nutrient inputs three to five days before transplanting rather than placing roots directly against fertiliser. Water seedlings in the morning of transplanting and water the field bed to reduce stress. In hot weather, recheck tray moisture one to two hours before planting and water if the root block has dried so it remains intact when removed from the tray.",
              callout:
                "The field, planting hole, mulch, nutrient placement, support system, and seedling root block must all be ready at the same time; otherwise transplanting transfers avoidable stress into the crop.",
            },
            {
              heading: "Harden seedlings before they face field conditions",
              body:
                "Hardening reduces transplant shock, supports faster field establishment, and promotes vigorous growth. The source recommends gradually removing shade or moving seedlings into full sun, beginning with short exposure and increasing it over following days, while protecting seedlings at midday during the first days and gradually reducing both amount and frequency of watering. It gives an indicative start of three to five days before transplanting for cucurbits and brassicas and five to seven days for solanaceous crops. Hardening is deliberate adaptation, not neglect: it prepares seedlings raised under protected conditions for heat, wind, light, and water conditions in the field.",
            },
            {
              heading: "Use development stage and field readiness to decide timing",
              body:
                "The source identifies a practical stage of two true leaves for cucurbits and four true leaves for solanaceous crops, distinguishing these from cotyledons or seed leaves. It also gives crop and season examples for time from sowing, including a longer window for onions and a warning that over-mature onion seedlings can reduce bulb size or delay bulbing. Use true-leaf stage, root quality, crop type, and field readiness together rather than waiting for one calendar number. Do not delay until seedlings are overgrown: the source associates overgrown transplants with lower yield, greater disease susceptibility, and a shorter productive life. Plan sowing from the date the field can genuinely receive the crop.",
            },
          ],
        },
        {
          id: "establish-transplants-and-protect-the-stand",
          title: "Establish transplants and protect the stand",
          duration: "34 min",
          kicker: "Protect roots, cotyledons, and early recovery",
          summary:
            "Use careful tray handling, correct depth and timing, water and heat protection, nutrient safeguards, monitoring, and timely replacement to secure a uniform field stand.",
          outcomes: [
            "Remove tray-grown seedlings without breaking the root block, stem, cotyledons, or field planting sequence.",
            "Plant at the correct level and time of day, then protect and water seedlings to reduce heat and transplant shock.",
            "Monitor, replant, and address common transplanting problems without causing fertiliser or pest damage.",
          ],
          sections: [
            {
              heading: "Move each seedling from tray to bed with the root block intact",
              body:
                "The source sequence begins by watering both seedlings and bed in the morning. Gently remove a seedling by pushing upward from the bottom of the tray while supporting the stem, then set it at the same soil level as its root block—neither too deep nor too shallow. Do not cover the cotyledons because they provide stored food for the young plant. Water after transplanting, inspect the field daily, and quickly replace seedlings that wilt or die so missing stands do not remain unmanaged. This sequence protects the root block, prevents avoidable stem injury, preserves early seedling reserves, and keeps the planting population close to the plan.",
              callout:
                "Correct depth is a root-and-shoot decision: protect the root block with soil contact while keeping cotyledons above the soil surface.",
            },
            {
              heading: "Choose low-stress planting conditions and moderate heat",
              body:
                "Transplant in the afternoon or during lower sun exposure. The source cautions against morning transplanting when severe sun is expected, especially for seedlings that are not well hardened or have been raised in an open field, because high temperatures increase shock, poor recovery, and missing stands. After planting, use soil, rice straw, or a palm leaf around the plant where appropriate to reduce heat stress radiating from the bed or reflected by plastic mulch. These actions complement hardening; they do not replace the need for a properly prepared, watered seedling and field.",
            },
            {
              heading: "Prevent nutrient burn and act on common early problems",
              body:
                "Do not allow roots to touch inorganic fertiliser. When nutrients have not been incorporated before mulch installation, recover them with soil before placing the transplant. The source notes that a root-zone nutrient drench may be used where a basal fertiliser was not placed or shock is more likely, but it warns that fertiliser solution should not touch leaves because it can cause burning or necrosis; rinse affected leaves with water if splashing occurs and follow locally appropriate, labelled nutrient guidance. Common problems include planting too shallowly, using seedlings that are too old, and early pest damage such as crickets. Daily inspection, correct planting depth, rapid replacement, and physical protection options such as a cut drinking-straw collar can support stand recovery without delaying action until losses become severe.",
            },
          ],
        },
      ],
      assessment: {
        id: "transplanting-check",
        title: "Transplanting check",
        description:
          "Apply field-readiness, hardening, stage, handling, placement, heat-management, and stand-recovery principles to a practical transplanting decision.",
        kind: "module",
        passMark: 80,
        questions: [
          {
            id: "tp-1",
            prompt: "Which preparation sequence best follows the source before tray-grown seedlings are moved to the field?",
            options: [
              { id: "a", label: "Verify mulch and trellis readiness, prepare planting holes and nutrient placement in advance, water seedlings and bed, and recheck tray moisture in hot conditions." },
              { id: "b", label: "Move dry seedlings first, then decide later whether mulch, support, holes, water, or nutrient placement are needed." },
              { id: "c", label: "Place roots directly on fertiliser granules so early growth is accelerated." },
              { id: "d", label: "Leave a dry root block so it breaks apart easily when pulled from the tray." },
            ],
            correctOptionId: "a",
            feedback: { correct: "Correct. The source connects prepared mulch, trellising, holes, appropriate nutrient placement, and morning moisture checks with lower transplant stress.", incorrect: "Prepare the field systems first and protect the root block: verify mulch and support, prepare holes and nutrient placement in advance, water the bed and seedlings, and recheck moisture before planting in heat." },
          },
          {
            id: "tp-2",
            prompt: "What is the purpose of hardening seedlings before transplanting?",
            options: [
              { id: "a", label: "To adapt seedlings gradually to field conditions, reduce transplant shock, support fast establishment, and promote vigorous growth." },
              { id: "b", label: "To keep seedlings permanently in shade and increase watering until transplanting day." },
              { id: "c", label: "To make seedlings older than their appropriate stage before the field is ready." },
              { id: "d", label: "To remove cotyledons before planting." },
            ],
            correctOptionId: "a",
            feedback: { correct: "Correct. Gradual sun exposure and water reduction prepare seedlings for field conditions and reduce shock.", incorrect: "Hardening gradually increases field-like exposure while reducing protection and watering so the seedling can establish more successfully after transplanting." },
          },
          {
            id: "tp-3",
            prompt: "Which transplant placement and handling approach is correct for a tray-grown vegetable seedling?",
            options: [
              { id: "a", label: "Push it gently from the tray bottom while supporting the stem, plant at the same level, keep cotyledons uncovered, and water after planting." },
              { id: "b", label: "Pull it by the leaves, bury the cotyledons, and leave the root block dry after transplanting." },
              { id: "c", label: "Plant it deeply on top of untreated inorganic fertiliser so roots contact the material directly." },
              { id: "d", label: "Break the root block apart before placing it in a shallow hole." },
            ],
            correctOptionId: "a",
            feedback: { correct: "Correct. The source specifies bottom-up tray removal, stem support, same-level planting, exposed cotyledons, and watering after transplanting.", incorrect: "Protect the root block and seedling reserves: remove gently from below, support the stem, plant at the original level, keep cotyledons above soil, and water after planting." },
          },
          {
            id: "tp-4",
            prompt: "A field is hot and reflective plastic mulch increases heat around recently planted seedlings. What is the strongest immediate transplant-management response?",
            options: [
              { id: "a", label: "Transplant in the afternoon or lower sun, use suitable local cover around plants to reduce reflected heat, inspect daily, and replace seedlings that fail." },
              { id: "b", label: "Transplant at the hottest morning period and wait until the end of the season to check missing stands." },
              { id: "c", label: "Apply fertiliser spray to leaves without checking for burn risk." },
              { id: "d", label: "Bury cotyledons deeply under mulch and leave roots in contact with fertiliser." },
            ],
            correctOptionId: "a",
            feedback: { correct: "Correct. The source recommends lower-sun transplanting, heat moderation around the plant, daily checks, and rapid replacement of losses.", incorrect: "Avoid severe sun at transplanting, reduce heat stress from the bed or mulch where needed, monitor the stand daily, and replace losses quickly." },
          },
        ],
      },
    },
    {
      id: "water-management",
      index: 23,
      title: "Water management",
      eyebrow: "Module 23",
      description:
        "Manage the water-air balance in the root zone by reading soil moisture, crop and climate demand, irrigation-system performance, seasonal risk, drainage, and water quality.",
      lessons: [
        {
          id: "read-water-air-balance-and-crop-demand",
          title: "Read water-air balance and crop demand",
          duration: "38 min",
          kicker: "Irrigate the root zone, not a schedule alone",
          summary:
            "Assess the water and air available to roots, recognise over- and under-watering stress, read soil moisture by feel and appearance, and adjust water decisions for soil, crop, growth stage, and weather.",
          outcomes: [
            "Explain why a stable water-air balance supports healthy root function, nutrient uptake, and crop growth.",
            "Recognise field signs of overwatering and underwatering before stress escalates into yield loss.",
            "Use soil texture, structure, moisture feel, crop stage, and climatic demand to guide irrigation frequency and quantity.",
          ],
          sections: [
            {
              heading: "Manage water and air together in the root zone",
              body:
                "The source defines water management as managing the ratio of water and air in each soil type to suit the cultivated crop. Root or absorbent hairs need a consistently moist environment, but fluctuations in water-air ratio create stress. Healthy roots are white or nearly white, fresh looking, and earthy smelling; unhealthy roots may become orange, brownish, or blackish. Roots need contact with soil particles, air, and water. They use oxygen to produce energy for nutrient uptake, while dissolved nutrients move to roots in water. Water also supports photosynthesis, mineral transport, turgidity, and temperature regulation. The advisor’s task is therefore to preserve a functioning root zone rather than simply maximise the amount of water applied.",
              callout:
                "A water decision is also an air decision: observe roots, soil condition, and crop response before increasing irrigation.",
            },
            {
              heading: "Recognise both oversupply and undersupply stress",
              body:
                "Overwatering and fluctuating supply can contribute to cracking in crops such as tomato and bitter gourd, a more favourable environment for fungal and bacterial diseases, dark root or lower-stem colour, wet black patches, lower-leaf drop, yellowing, wilting, and nutrient leaching. Underwatering can cause leaf wilting and death, distorted young leaves, burned mature-leaf tips, blossom-end rot in tomato and pepper, deformed cucumber and bean fruit, flower abortion, stunting, greater pest vulnerability, and reduced yield. Diagnose the pattern rather than reacting to one symptom alone: wilting can occur under both root-zone saturation and water shortage, so root condition, soil feel, drainage, recent weather, and irrigation history matter.",
            },
            {
              heading: "Measure moisture against soil, crop, stage, and climate",
              body:
                "The source presents an auger or sampling pipe and a feel-or-appearance method for assessing soil moisture. A ball is formed by squeezing soil firmly in the hand; a ribbon is formed by pressing soil between thumb and forefinger. Sandy soils are porous, allow quick water flow, and hold less water; loams retain moisture while remaining relatively porous; clay soils hold more water but absorb and release it slowly. Apply less water but more frequently in sandy soil to reduce leaching and waste. Soil structure also matters: granular and aggregated structures allow faster downward movement than platey or massive structures. Adjust water for critical crop stages such as flowering, fruit set, and fruit development, and for evaporative demand, which rises in sunny, hot, dry, and windy conditions and falls in cooler, cloudier, humid, and less windy conditions.",
            },
          ],
        },
        {
          id: "design-efficient-seasonal-water-management",
          title: "Design efficient seasonal water management",
          duration: "36 min",
          kicker: "Conserve, apply, drain, and verify water",
          summary:
            "Choose practical irrigation and water-saving practices, manage dry- and wet-season risks, and verify that the water source itself supports safe vegetable production.",
          outcomes: [
            "Compare irrigation-system performance and apply water deeply enough to meet the root-zone need without repeated partial saturation.",
            "Integrate mulch, catchment, contouring, low-input irrigation, raised beds, and open drainage into seasonal water planning.",
            "Screen irrigation water for unsafe wastewater use, salinity, pH, chlorine, and harmful contaminants before using it on vegetables.",
          ],
          sections: [
            {
              heading: "Choose a practical system and wet the intended root zone",
              body:
                "Watering-system choice depends on efficiency and practicality in the local area. The source gives indicative efficiency ranges for common approaches and presents drip irrigation as highly efficient. Its rule of thumb is that irrigation run longer at lower pressure can penetrate more deeply and saturate the soil better. It contrasts one fully saturating irrigation per day with two irrigations that leave soil unsaturated. Apply this principle with the soil-moisture evidence from the field: the aim is to meet the crop’s root-zone demand while avoiding leaching, runoff, saturation, and unnecessary pumping or labour. Mulch, planting system, protected production, drought-tolerant varieties, and grafted seedlings can further influence the water-management plan.",
              callout:
                "Irrigation frequency alone is not a performance measure. Check whether water reaches the relevant root zone and whether the soil retains the needed balance of water and air.",
            },
            {
              heading: "Conserve water in dry periods and drain it in wet periods",
              body:
                "For dry-season conservation, the source recommends mulch and cover crops to conserve soil moisture; small pits, micro-catchments, ponds, dams, and rainwater catchment to retain water; contour farming to slow downslope flow; and low-input systems such as drip irrigation. It frames these through the three Rs: recharge, retention, and reuse. Reuse requires safeguards: water from handwashing and drainage systems should be stored and treated before disposal or reuse, while untreated wastewater must not be used for irrigation or fertigation. In wet seasons, use raised beds, drainage canals, and clear open channels with barriers removed so groundwater and surface water do not rise into the root zone. These measures protect root aeration and reduce the waterlogging stress that drives root damage and wilt.",
            },
            {
              heading: "Verify water quality before irrigation",
              body:
                "Water quantity does not compensate for poor water quality. The source identifies water pH, salinity, chlorine, and harmful substances as practical checks. It states an ideal pH range for vegetable growth of 6.0 to 7.5, warns that high salt levels can salinise soil, gives an electrical-conductivity reference below 0.8 dS/m, and notes that high chlorine can damage roots and reduce yield. Water containing harmful substances such as heavy metals or pesticides should not be used for vegetable production. Treat these values as screening indicators within local testing and advisory systems; combine them with source protection, safe storage, and the explicit prohibition on using untreated wastewater for irrigation or fertigation.",
            },
          ],
        },
      ],
      assessment: {
        id: "water-management-check",
        title: "Water-management check",
        description:
          "Apply root-zone water-air balance, soil-moisture assessment, crop demand, irrigation, seasonal water management, drainage, and water-quality principles to a field decision.",
        kind: "module",
        passMark: 80,
        questions: [
          {
            id: "wm-1",
            prompt: "Why must water management protect both soil water and soil air around crop roots?",
            options: [
              { id: "a", label: "Roots need contact with soil particles, water, and air; oxygen supports energy for nutrient uptake while water carries dissolved nutrients to roots." },
              { id: "b", label: "Roots function best when all pore space is permanently filled with water." },
              { id: "c", label: "Only leaf colour matters; root condition and soil air do not affect water decisions." },
              { id: "d", label: "Water management only concerns field appearance, not crop growth or nutrient movement." },
            ],
            correctOptionId: "a",
            feedback: { correct: "Correct. The source links root health with soil-particle contact, water, air, oxygen-driven energy, and dissolved nutrient uptake.", incorrect: "Water and air must be balanced. Roots require oxygen for energy and water for nutrient transport, so saturated or dry soil can both disrupt growth." },
          },
          {
            id: "wm-2",
            prompt: "What irrigation pattern best follows the source guidance for a sandy soil?",
            options: [
              { id: "a", label: "Apply smaller quantities more frequently than on loam or clay, while checking root-zone moisture to avoid leaching and waste." },
              { id: "b", label: "Apply the largest possible volume infrequently because sandy soil stores water for a long time." },
              { id: "c", label: "Irrigate exactly like clay without checking texture, drainage, or moisture feel." },
              { id: "d", label: "Avoid irrigation because sandy soil always contains enough air." },
            ],
            correctOptionId: "a",
            feedback: { correct: "Correct. Sandy soil is porous and drains quickly, so the source recommends less water per event but more frequent application to reduce leaching and waste.", incorrect: "Sandy soils hold less water and transmit it quickly. Use smaller, more frequent applications and verify the root-zone result rather than copying a clay-soil schedule." },
          },
          {
            id: "wm-3",
            prompt: "Which seasonal water-management plan is most defensible?",
            options: [
              { id: "a", label: "Use mulch, cover crops, catchment, contouring, and low-input irrigation for dry periods; use raised beds, clear drainage canals, and open channels for excess water in wet periods." },
              { id: "b", label: "Use the same water plan in dry and wet periods, regardless of rainfall, drainage, or root-zone saturation." },
              { id: "c", label: "Block drainage canals in the rainy season so water remains close to crop roots." },
              { id: "d", label: "Use untreated wastewater whenever dry-season irrigation water is scarce." },
            ],
            correctOptionId: "a",
            feedback: { correct: "Correct. The source combines water conservation and capture for dry periods with raised beds and maintained drainage for wet periods, while prohibiting untreated wastewater use.", incorrect: "Seasonal planning changes with the water risk: conserve and retain water during dry periods, but protect roots from excess water through raised beds and open drainage in wet periods." },
          },
          {
            id: "wm-4",
            prompt: "Which water-source decision best follows the source water-quality guidance?",
            options: [
              { id: "a", label: "Use screened water with suitable pH and low salinity, chlorine, and harmful contaminants; do not use untreated wastewater for irrigation or fertigation." },
              { id: "b", label: "Use any wastewater directly because the crop will filter harmful substances before harvest." },
              { id: "c", label: "Ignore water salinity and contaminants if the irrigation system is efficient." },
              { id: "d", label: "Add more irrigation water to dilute any water-quality problem without testing or source control." },
            ],
            correctOptionId: "a",
            feedback: { correct: "Correct. Water must be screened for pH, salinity, chlorine, and harmful contaminants, and untreated wastewater is not acceptable for irrigation or fertigation.", incorrect: "Efficient application cannot make unsafe water safe. Screen water quality and keep untreated wastewater out of vegetable irrigation and fertigation." },
          },
        ],
      },
    },
    {
      id: "irrigation-systems",
      index: 24,
      title: "Irrigation systems",
      eyebrow: "Module 24",
      description:
        "Compare irrigation systems by crop stress, field performance, efficiency, practical constraints, and farmer capacity to recommend a system that fits the crop and site.",
      lessons: [
        {
          id: "compare-irrigation-systems-and-crop-stress",
          title: "Compare irrigation systems and crop stress",
          duration: "37 min",
          kicker: "Match water delivery to crop response",
          summary:
            "Recognise critical crop stages and water-stress effects, select an appropriate time to water, and compare hand, sprinkler, surface, and drip irrigation by delivery pattern, strengths, limitations, and efficiency.",
          outcomes: [
            "Identify crop stages and stress effects that require careful irrigation planning.",
            "Schedule watering to reduce avoidable leaf wetness, heat stress, and poor crop response.",
            "Compare hand, overhead, surface, and drip systems using distribution, disease, labour, cost, field condition, and efficiency evidence.",
          ],
          sections: [
            {
              heading: "Protect crops at their water-sensitive stages",
              body:
                "The source highlights vegetative, flowering, and fruiting stages as critical periods for water stress, with vegetative attention especially important during the first two weeks after transplanting. It shows how drought and flooding can produce different but serious outcomes: brassicas may bolt or rot; legumes may lose flowers and pods or become disease-prone; root vegetables may have restricted enlargement, cracking, or disease; and solanaceous and cucurbit crops may show flower or fruit drop, blossom-end rot, cracking, disease development, and stunting. The field advisor should protect crop moisture across stages where possible, then focus observations and system performance checks where the crop is most exposed to yield and quality loss.",
              callout:
                "Choose irrigation around the crop’s most sensitive stages and the source of water stress—not around the convenience of the system alone.",
            },
            {
              heading: "Water at a time that supports uptake without needless wetness",
              body:
                "The source identifies early morning, approximately 5 to 9 am, as the ideal watering period because temperatures are lower and plants are cool. It cautions against watering while the plant is still cooling down and there is no sun to dry water droplets. In very hot conditions, it allows consideration of watering around mid-afternoon if plants are under water stress, while advising growers to avoid wetting foliage where possible. Timing therefore depends on temperature, crop stress, system type, and the risk of prolonged leaf wetness. Use this timing guidance with root-zone moisture checks rather than applying water mechanically at the same hour in every season.",
            },
            {
              heading: "Compare system performance, not labels",
              body:
                "Hand watering delivers water directly and can be adjusted for microclimates while bringing the grower close to plants for pest and disease observation. Its limitations include high labour, unequal distribution, shallow penetration, potential seedling damage at high pressure, foliar disease, and possible need for nearby water storage. Sprinklers can provide good soil moisture and a cooling microclimate, suit large or high-density areas and nurseries, and help leach excess salts, but they have high initial cost, can promote foliar disease and weeds, waste water on bare spots, require even spacing and maintenance, and are unsuitable for plastic-mulched gardens. Surface or furrow irrigation is common and simple with low capital cost but can cause waterlogging without drainage, uneven distribution, water waste, wet paths, and canal weeds. Drip or trickle irrigation offers uniform, efficient application, lower disease pressure, potential water and fertiliser efficiency, and lower labour than hand watering, but requires investment, design, maintenance, skilled operation, and clean water to prevent clogging. The source presents indicative efficiency bands of 40–60% for surface, 60–75% for sprinkler, and about 90% for drip systems.",
            },
          ],
        },
        {
          id: "select-and-improve-a-system-with-field-evidence",
          title: "Select and improve a system with field evidence",
          duration: "35 min",
          kicker: "Ask the questions that make recommendations work",
          summary:
            "Use soil, terrain, water, crop, field size, technology, labour, cost, experience, and existing system performance to select or improve an irrigation method with the farmer.",
          outcomes: [
            "Gather the site, crop, water, and farmer evidence needed before recommending an irrigation system.",
            "Connect system selection to soil texture, slope, water quantity and quality, crop rooting, field size, mulch, and technology fit.",
            "Recommend realistic improvements that account for labour, financial capacity, maintenance, and farmer knowledge.",
          ],
          sections: [
            {
              heading: "Start with a structured field and farmer inquiry",
              body:
                "The source directs advisors to observe which systems farmers already use, whether production is irrigated or rainfed, how frequently irrigation occurs, what farmers consider when irrigating, and what they consider when choosing a system. Build the inquiry around natural conditions—soil type, slope and topography, water availability and source, and water quality—then add crop type, field size, available technology, previous irrigation experience, required labour, and costs and benefits. Ask how many people work on the farm, what system they know, how long an irrigation task takes, and whether the current arrangement is limiting crop management. This produces a recommendation that respects both agronomy and the operating reality of the farm.",
              callout:
                "A system recommendation is credible only when it answers the farmer’s water, land, labour, skill, and cost constraints together.",
            },
            {
              heading: "Fit delivery method to soil, terrain, crop, and field design",
              body:
                "Soil texture, structure, and porosity influence whether water moves quickly, slowly, deeply, or laterally, so they should shape the preferred method and run time. Slope and topography raise practical questions about whether a field is flat or sloping, whether furrow or hand watering can be controlled, and how erosion or uneven distribution will be avoided. Water availability is seasonal and must be compared with crop demand, irrigation depth, and planned area. Crop roots also matter: a shallow-rooted leafy crop and a deeper-rooted tomato or cucurbit may not need the same delivery pattern. The source specifically notes that furrow or drip systems are recommended when plastic mulch is used, particularly in dry, hot periods. Treat field size as a scaling question rather than assuming one method suits 500 square metres, 1,000 square metres, and a hectare equally.",
            },
            {
              heading: "Protect drip performance and match the recommendation to capacity",
              body:
                "Drip irrigation needs good-quality, clean water and a suitable design because clogged emitters can create uneven distribution. The source also highlights chloride as a water-quality concern for drip systems and presents concentration categories for interpreting potential crop injury; use local water testing and crop-specific tolerance guidance rather than assuming a source is safe. When recommending a system, be practical about financial capacity, seasonal water supply, labour, time, technology, maintenance knowledge, and the farmer’s existing experience. A lower-cost method may be appropriate where it can be managed well, while a more efficient system may fail if it cannot be maintained or supplied with clean water. Use the last demonstration or field visit as evidence: describe the system, identify its limitation, and specify an improvement the farmer can realistically operate.",
            },
          ],
        },
      ],
      assessment: {
        id: "irrigation-systems-check",
        title: "Irrigation-systems check",
        description:
          "Apply crop-stress, timing, system-performance, field, water, crop, labour, and cost evidence to choose and improve a vegetable irrigation system.",
        kind: "module",
        passMark: 80,
        questions: [
          {
            id: "is-1",
            prompt: "Why should irrigation performance be checked particularly carefully during flowering and fruiting?",
            options: [
              { id: "a", label: "Water stress at these stages can contribute to flower or fruit drop, poor set or development, quality defects, disease, and stunting in many vegetable crops." },
              { id: "b", label: "Crop water needs end once flowers are visible." },
              { id: "c", label: "Flooding and drought have no effect on yield or quality after vegetative growth." },
              { id: "d", label: "Only irrigation-system cost matters during reproductive crop stages." },
            ],
            correctOptionId: "a",
            feedback: { correct: "Correct. The source identifies flowering and fruiting as critical water-stress stages and links drought or flood stress with flower and fruit loss, defects, disease, and reduced growth.", incorrect: "Monitor water delivery closely during flowering and fruiting because both drought and flooding can cause flower or fruit loss, quality problems, disease, and lower growth." },
          },
          {
            id: "is-2",
            prompt: "What is the most generally suitable timing practice in the source for watering vegetable crops?",
            options: [
              { id: "a", label: "Water early morning when temperature is lower and plants are cool, then adapt in hot stress conditions while avoiding unnecessary foliage wetness." },
              { id: "b", label: "Always water at night while leaves remain wet because drying is unnecessary." },
              { id: "c", label: "Always water only at the hottest hour, regardless of crop stress or system type." },
              { id: "d", label: "Ignore temperature, leaf wetness, crop stress, and season when scheduling water." },
            ],
            correctOptionId: "a",
            feedback: { correct: "Correct. The source recommends early-morning watering, cautions against prolonged wet droplets, and allows limited hot-season adjustment when plants face water stress.", incorrect: "Use early morning as the normal starting point, then adapt to heat and stress while avoiding unnecessary leaf wetness and checking root-zone moisture." },
          },
          {
            id: "is-3",
            prompt: "Which system comparison is accurate according to the source?",
            options: [
              { id: "a", label: "Drip is highly efficient and can reduce disease pressure but needs investment, suitable design, maintenance, and clean water; surface irrigation is low-capital but can waste water and waterlog without drainage." },
              { id: "b", label: "Surface irrigation is always the most efficient method and never needs drainage." },
              { id: "c", label: "Sprinklers cannot be used in nurseries and never affect foliar disease or weeds." },
              { id: "d", label: "Hand watering always delivers equal deep water with no labour requirement or foliar-disease risk." },
            ],
            correctOptionId: "a",
            feedback: { correct: "Correct. The source contrasts drip efficiency and maintenance requirements with surface irrigation’s simplicity, low capital needs, drainage risks, and greater water waste.", incorrect: "Compare delivery, distribution, disease, weeds, drainage, cost, labour, maintenance, and water quality. No irrigation system is automatically suitable in every field." },
          },
          {
            id: "is-4",
            prompt: "Which evidence set should an advisor collect before recommending an irrigation system?",
            options: [
              { id: "a", label: "Soil, slope, water quantity and quality, crop and rooting pattern, field size, mulch or planting design, technology, farmer experience, labour, financial capacity, and current system performance." },
              { id: "b", label: "Only the brand name of the nearest irrigation kit." },
              { id: "c", label: "Only crop price, while ignoring land, water, labour, system maintenance, and farmer capacity." },
              { id: "d", label: "Only system efficiency figures, without discussing whether clean water, training, or maintenance are available." },
            ],
            correctOptionId: "a",
            feedback: { correct: "Correct. The source requires natural conditions, crop and field size, technology, prior experience, labour, and cost-benefit evidence before selecting a system.", incorrect: "A practical recommendation combines site conditions, crop and design needs, water supply and quality, farmer experience, labour, maintenance capacity, technology, and cost-benefit evidence." },
          },
        ],
      },
    },
    {
      id: "drip-irrigation-system",
      index: 25,
      title: "Drip irrigation system",
      eyebrow: "Module 25",
      description:
        "Plan, install, control, inspect, and maintain a drip system that delivers uniform water to the root zone without clogging, leakage, or avoidable pressure loss.",
      lessons: [
        {
          id: "plan-a-drip-system-around-field-demand",
          title: "Plan a drip system around field demand",
          duration: "39 min",
          kicker: "Design for uniformity before buying components",
          summary:
            "Evaluate drip irrigation’s fit, benefits, constraints, capacity, field layout, delivery method, equipment, and component functions before installation begins.",
          outcomes: [
            "Explain how drip applies water and the conditions that make its root-zone delivery reliable.",
            "Plan a system from crop, soil, slope, bed, water demand, pump capacity, water quality, and layout evidence.",
            "Identify the essential components and their role in safe, uniform, controllable drip operation.",
          ],
          sections: [
            {
              heading: "Use drip for controlled root-zone delivery—not as an automatic solution",
              body:
                "The source defines drip irrigation as slow, direct application of small quantities of water to soil through micro-emitters. It describes more than 90 percent water efficiency, controllable release through valves, reduced runoff and evaporation, lower nutrient leaching, labour savings, water-air balance around the crop, and avoidance of foliar disease. These benefits depend on design and operation. The same source notes high initial cost, high maintenance needs, higher skills and technology requirements, the need for clean water, uneven distribution when emitters clog, and the need for a suitable design. Drip becomes efficient only when water quality, pressure, layout, emitter condition, and maintenance remain under control.",
              callout:
                "Drip efficiency is earned through uniform delivery. A clogged, leaking, or poorly designed system can transfer water stress into hidden parts of the field.",
            },
            {
              heading: "Plan capacity, zones, and delivery before installing",
              body:
                "Start with a rough field sketch, the crop and its stage-specific water needs, soil type, slope, planned beds, and irrigation layout. Each drip tube should serve an area with similar water needs, and mainline length must match available pressure. If pump delivery is uncertain, the source recommends timing the water volume released in one minute, multiplying by sixty for hourly capacity, and designing around 80 percent of that maximum capacity. Select emitters, tape, line, or micro-sprinkler heads by crop, soil, pressure, row design, durability, and management capacity. Estimate every emitter’s flow rate and total demand so the pump and zone design can supply it without starving distant lines.",
            },
            {
              heading: "Specify the system parts and their functions",
              body:
                "The source lists pressure gauge and regulator, pump or gravity tank, drip lines or tapes, flush ends or end caps, bypass valve, fittings, pipes, filter, and tees as core equipment. A valve starts or stops flow; backflow control protects a shared household water source; a regulator reduces excessive pressure and holds it constant; and adaptors connect differing pipe and fitting sizes. Filtration is the system’s protective core because suspended solids can shorten line life, block lines, create uneven growth, reduce yield, and stress plants. The source matches sand or gravel filters to dirty surface water, disc filters to medium-quality water such as wells or ponds, and screen filters to higher-quality water such as wells or springs. A pressure gauge monitors performance, an air valve reduces pressure fluctuations, and an injector introduces approved nutrients or maintenance products.",
            },
          ],
        },
        {
          id: "install-monitor-and-maintain-uniform-drip-delivery",
          title: "Install, monitor, and maintain uniform drip delivery",
          duration: "36 min",
          kicker: "Prevent clogging before it becomes crop stress",
          summary:
            "Install a drip system in a logical sequence, verify wetting and pressure, then prevent blockage and leaks through filtration, flushing, inspection, and safe maintenance procedures.",
          outcomes: [
            "Install, test, flush, and close a drip system while protecting filters, lines, emitters, and uniform flow.",
            "Differentiate drip tape and drip line and use emitters, end caps, gauges, air valves, and injectors correctly.",
            "Use prevention-focused maintenance to detect clogs, pressure loss, leaks, and uneven wetting before crop performance declines.",
          ],
          sections: [
            {
              heading: "Install, test, and observe the system as a whole",
              body:
                "For a small gravity system, the source sequence is to prepare raised beds; create a suitable tank head structure; fit an outlet and water filter; connect the mainline; lay drip lines; trial run with the open line end to inspect emitters and flush dirt; then lock the ends. After installation, open line ends periodically to flush debris, check distribution uniformity, repair leaks, and inspect soil moisture at points across the lines. Monitor irrigation time, moisture, bed wetting, and depth of penetration, then use field evidence to adjust frequency and flow. Close tape by folding and locking the end; use an end cap to close a drip tape or tube system. Drip tape is thin-walled and lies flat when unpressurised, while drip line is thicker, more durable, and longer lived. Emitters determine how quickly water enters soil, so their condition directly affects crop uniformity.",
              callout:
                "Do not judge a drip system by a wet inlet. Verify moisture and emitter flow at the far ends of lines and across contrasting parts of the field.",
            },
            {
              heading: "Prevent the causes of blockage and leakage",
              body:
                "The source identifies silt or clay, calcium or magnesium precipitates, and algae or bacteria as main causes of blocked emitters. It identifies animals, farm equipment, and workers as common causes of leaking drip lines. Flushing removes accumulated debris and pollutants; the source suggests monthly flushing or more often when water quality is poor. Filters remove suspended solids and need regular cleaning. Check dripper flow at least weekly, verify that water reaches the ends of all drip lines, inspect for physical damage, and repair leaks before unequal irrigation becomes uneven crop growth.",
            },
            {
              heading: "Control pressure and use maintenance treatments safely",
              body:
                "System pressure should be checked at the end of a drip line with a hand pressure gauge; the source gives a working range of 8 to 15 PSI, but the installed design and manufacturer requirements remain the operating reference. Air valves reduce pressure fluctuation, while regulators help maintain constant pressure. The source also describes acid treatment to reduce low-solubility salt clogging and chlorination to control microorganisms. These are specialist maintenance actions: follow local regulations, product labels, safety procedures, water-source requirements, and equipment supplier instructions rather than treating source quantities as universal recipes. Keep a maintenance record of filter cleaning, flushing, pressure, line-end flow, repairs, and soil wetting.",
            },
          ],
        },
      ],
      assessment: {
        id: "drip-irrigation-system-check",
        title: "Drip-irrigation-system check",
        description:
          "Apply drip-system design, component, installation, distribution, pressure, filtration, flushing, and maintenance principles to a practical irrigation decision.",
        kind: "module",
        passMark: 80,
        questions: [
          {
            id: "di-1",
            prompt: "What makes drip irrigation a managed system rather than an automatic water-saving solution?",
            options: [
              { id: "a", label: "Its efficiency depends on appropriate design, clean and filtered water, pressure control, functioning emitters, uniform distribution, and regular maintenance." },
              { id: "b", label: "Once installed, a drip line cannot clog, leak, or deliver uneven water." },
              { id: "c", label: "Drip is suitable only when every field has unlimited investment and skilled labour." },
              { id: "d", label: "Drip efficiency is determined only by the colour of the tape." },
            ],
            correctOptionId: "a",
            feedback: { correct: "Correct. The source pairs drip’s efficiency and root-zone benefits with design, water-quality, clogging, maintenance, skill, and cost requirements.", incorrect: "Drip systems need ongoing control. Design, filtration, clean water, pressure, emitter condition, leak repair, and maintenance determine whether water is delivered uniformly." },
          },
          {
            id: "di-2",
            prompt: "Why should a drip-system plan group an area with similar water needs and be designed below maximum pump capacity?",
            options: [
              { id: "a", label: "To match zones to crop demand and preserve sufficient pressure and flow for emitters across the operating area." },
              { id: "b", label: "To force all crops and soil types to receive exactly the same water regardless of need." },
              { id: "c", label: "To avoid measuring pump delivery, emitter flow, crop stage, soil, slope, or layout." },
              { id: "d", label: "To make distant drip lines receive less water than near lines." },
            ],
            correctOptionId: "a",
            feedback: { correct: "Correct. The source links zoning and planning below pump maximum with reliable flow and pressure for areas that share water demand.", incorrect: "Plan zones around similar crop water needs and verify pump capacity and emitter demand so pressure and flow remain adequate throughout each operating area." },
          },
          {
            id: "di-3",
            prompt: "Which filter selection most closely follows the source guidance?",
            options: [
              { id: "a", label: "Use sand or gravel filtration for dirty surface water, disc filtration for medium-quality well or pond water, and screen filtration for higher-quality water." },
              { id: "b", label: "Use no filtration because debris cannot block drip emitters." },
              { id: "c", label: "Use the same unmaintained filter for every water source regardless of solids or water quality." },
              { id: "d", label: "Remove filtration to increase the quantity of particles reaching the emitters." },
            ],
            correctOptionId: "a",
            feedback: { correct: "Correct. The source matches filter types with water quality because filtration protects line life, emitter flow, plant uniformity, and yield.", incorrect: "Choose filtration from water quality and clean filters regularly. Without it, solids can block lines and create uneven water, plant stress, and yield loss." },
          },
          {
            id: "di-4",
            prompt: "Which maintenance routine best protects drip uniformity?",
            options: [
              { id: "a", label: "Flush line ends on a planned schedule, clean filters, monitor pressure and flow at line ends, inspect soil wetting and emitters, and repair leaks or physical damage promptly." },
              { id: "b", label: "Wait until a crop section dies before checking filters, pressure, line ends, or leaks." },
              { id: "c", label: "Treat chemical maintenance rates as universal without following local safety, label, or equipment instructions." },
              { id: "d", label: "Check only the inlet and assume distant emitters receive the same water." },
            ],
            correctOptionId: "a",
            feedback: { correct: "Correct. The source emphasises prevention through flushing, filtration, pressure and flow checks, wetting observation, and fast repair before nonuniformity affects the crop.", incorrect: "Use prevention-first maintenance: flush and filter, check pressure and far-line flow, observe soil wetting, inspect emitters and damage, and repair leaks before crop stress develops." },
          },
        ],
      },
    },
    {
      id: "vegetable-fertilisation",
      index: 26,
      title: "Fertilisation of vegetables",
      eyebrow: "Module 26",
      description:
        "Build a soil- and crop-grounded fertilisation plan using nutrient uptake, the 4Rs, suitable nutrient sources, effective placement, and economically responsible decisions.",
      lessons: [
        {
          id: "build-a-4r-plan-from-soil-and-crop-demand",
          title: "Build a 4R plan from soil and crop demand",
          duration: "39 min",
          kicker: "Start with the limiting nutrient and the living soil",
          summary:
            "Interpret physical, biological, and chemical soil conditions; relate nutrient supply to crop uptake and removal; and use the 4Rs to make nutrient decisions more efficient.",
          outcomes: [
            "Explain how soil condition, nutrient availability, losses, fixation, and antagonism affect fertiliser response.",
            "Use soil testing, crop uptake, crop removal, residues, and crop stage to establish nutrient demand.",
            "Apply the right source, rate, time, and place as an integrated plan rather than a fixed fertiliser recipe.",
          ],
          sections: [
            {
              heading: "Treat soil condition as the starting point for fertilisation",
              body:
                "The source presents soil as the main factor in production and groups its relevant properties into physical conditions such as compaction, structure, and water availability; biological conditions such as organic matter and soil life; and chemical conditions such as nutrient availability, salinity, and acidity. Fertiliser response can be limited by low soil nutrient supply, Liebig’s law of the minimum, nutrient antagonism, nutrient fixation, and losses through volatilisation, leaching, and runoff. Liebig’s law means the limiting factor constrains potential yield: adding more of another nutrient does not remove that limit. Antagonism is competition in nutrient uptake; the source illustrates that high nitrogen can inhibit copper, potassium, and boron uptake. Diagnose the soil constraint before increasing a fertiliser input.",
              callout:
                "A fertiliser plan cannot compensate indefinitely for compacted, poorly aerated, saline, acidic, or biologically inactive soil. Correct the yield-limiting factor first.",
            },
            {
              heading: "Calculate demand from soil supply, crop removal, and growth stage",
              body:
                "Plants require macronutrients and micronutrients, while structural elements are also acquired from air. The source frames crop nutrient uptake against crop removal and crop residue: the marketable product removes nutrients from the field, while debris and unmarketable plant parts may remain. Apply at least enough to replace what the crop removes only after accounting for the nutrient already available from soil, residues, and other sources. Soil NPK testing checks nutrient status, and pH testing helps interpret nutrient availability. The tomato example reinforces that total uptake is not enough—advisors should examine the uptake pattern across the crop cycle and identify which element is needed most at each stage. The source uses the nitrogen-to-potassium balance as an example, with relatively higher nitrogen emphasis in vegetative growth and relatively lower N/K ratio in generative growth. Use crop guides and local validation instead of transferring one crop’s figures to every crop or field.",
            },
            {
              heading: "Use the four rights to turn evidence into a fertilisation plan",
              body:
                "The source’s 4Rs are right source, right rate, right time, and right place. A right source supplies the nutrient form the crop and soil need; a right rate reflects crop demand, removal, soil supply, and realistic efficiency; a right time makes nutrients available when the crop needs them; and a right place positions nutrients where roots can take them up. Fertiliser rates in crop guides are nutrient requirements rather than universal product weights, so advisors must read fertiliser labels and convert nutrient content carefully. The source’s examples and schedules must be adapted to plant population, crop stage, soil test results, weather, root condition, irrigation, and local technical advice. This converts fertilisation from a purchase decision into a monitored nutrient-management decision.",
            },
          ],
        },
        {
          id: "select-sources-and-place-nutrients-effectively",
          title: "Select sources and place nutrients effectively",
          duration: "37 min",
          kicker: "Deliver nutrients where and when roots can use them",
          summary:
            "Compare organic and inorganic sources, interpret fertiliser labels, select a safe application method, and combine sources into a financially responsible field plan.",
          outcomes: [
            "Compare organic and inorganic nutrient sources by nutrient certainty, release, soil-conditioning value, risk, and operational fit.",
            "Interpret inorganic fertiliser labels and distinguish nutrient analysis from fertiliser product weight.",
            "Match broadcasting, band, basal, side-dress, foliar, fertigation, drenching, and trenching methods to field conditions and the 4Rs.",
          ],
          sections: [
            {
              heading: "Choose sources for both nutrient supply and soil function",
              body:
                "The source distinguishes organic or indigenous nutrient supplies, including compost and farmyard manure, from inorganic fertilisers. Organic sources can supply trace elements and act as both fertiliser and soil conditioner, but may have limited availability, uncertain composition, possible contaminants, pathogen or weed-seed risks, high volume requirements, and slow release. Inorganic materials such as urea, DAP, and MOP are concentrated, have known nutrient content, and act quickly, but can be costly, do not directly provide food for soil organisms and earthworms, and carry higher leaching and volatilisation risk. Use the source mix that matches verified soil supply, crop demand, financial capacity, organic-material quality, timing, and a plan to improve soil function rather than treating organic and inorganic options as interchangeable.",
              callout:
                "The source of a nutrient changes the timing, placement, risk, and soil effects of the recommendation. Compare its full operating consequences—not only its price per bag.",
            },
            {
              heading: "Read fertiliser labels as nutrient analysis, not product names",
              body:
                "Inorganic fertilisers differ in analysis and nutrient concentration, so equal product weights do not provide equal nutrients. The source uses labels such as 13-13-21 plus trace elements to reinforce that the figures refer to nitrogen, phosphorus expressed as P2O5, potassium expressed as K2O, and included trace elements. A recommendation must distinguish the nutrient requirement from the weight of a specific fertiliser product and consider the product’s nutrient balance, crop stage, and soil test evidence. Avoid correcting a perceived deficiency by repeatedly adding one nutrient without checking antagonism, existing supply, placement, moisture, pH, root health, or possible losses.",
            },
            {
              heading: "Match application method to timing, root access, and field conditions",
              body:
                "The source identifies broadcast, band, basal, side-dress, foliar, fertigation, drenching, and trenching as application approaches. Basal and band placement can position nutrients during establishment, while localised side-dressing responds after planting or transplanting. Foliar and fertigation methods require close attention to product suitability, concentration, timing, water quality, and crop safety; drenching must meet the 4Rs; and trenching can place organic material in the planting area. Mulch, plant stage, root depth, irrigation system, soil moisture, and access all affect the suitable method. Match crop demand with nutrients available in soil, organic fertiliser, and inorganic fertiliser, then improve efficiency through correct placement, solved soil constraints, good root growth, and the four rights. Record the plan and revise it from field response and financial return.",
            },
          ],
        },
      ],
      assessment: {
        id: "vegetable-fertilisation-check",
        title: "Vegetable-fertilisation check",
        description:
          "Apply soil diagnosis, crop uptake, nutrient sources, label interpretation, application methods, and the 4Rs to an efficient vegetable-fertilisation decision.",
        kind: "module",
        passMark: 80,
        questions: [
          {
            id: "fv-1",
            prompt: "A tomato field has low potassium, but the grower wants to add only more nitrogen. What does the source’s limiting-factor principle suggest?",
            options: [
              { id: "a", label: "Address the potassium limitation first because adding more nitrogen will not remove the yield constraint created by low potassium." },
              { id: "b", label: "Add nitrogen indefinitely because one nutrient always corrects every other nutrient shortage." },
              { id: "c", label: "Ignore soil testing because nutrient availability cannot affect yield." },
              { id: "d", label: "Apply the same fertiliser rate without considering soil, crop, stage, or limiting factors." },
            ],
            correctOptionId: "a",
            feedback: { correct: "Correct. Liebig’s limiting-factor principle means the constraining nutrient must be addressed before additional non-limiting inputs can raise yield.", incorrect: "Identify the limiting factor first. More of a different nutrient does not remove a yield constraint caused by inadequate potassium or another limiting condition." },
          },
          {
            id: "fv-2",
            prompt: "Which evidence best establishes a crop’s fertiliser demand?",
            options: [
              { id: "a", label: "Soil nutrient and pH tests, crop uptake and removal, residues, crop stage, plant population, root and soil condition, and local crop guidance." },
              { id: "b", label: "Only the brand name of a fertiliser previously used by a neighbour." },
              { id: "c", label: "Only the total product weight applied last season, without knowing nutrient analysis or crop removal." },
              { id: "d", label: "Only leaf colour, while ignoring soil supply, pH, root condition, and crop stage." },
            ],
            correctOptionId: "a",
            feedback: { correct: "Correct. The source connects soil testing, pH, crop uptake, removal, residues, stage, and crop demand to effective nutrient planning.", incorrect: "Build demand from soil supply and availability, crop uptake and removal, residues, crop stage, plant population, root-zone conditions, and appropriate local crop guidance." },
          },
          {
            id: "fv-3",
            prompt: "How should an advisor interpret an inorganic fertiliser label such as 13-13-21 plus trace elements?",
            options: [
              { id: "a", label: "As an analysis of nitrogen, phosphorus expressed as P2O5, potassium expressed as K2O, plus trace elements—not as a guarantee that every bag weight supplies the same nutrient amount as another product." },
              { id: "b", label: "As a statement that the product contains identical amounts of every possible plant nutrient." },
              { id: "c", label: "As proof that the product will solve soil compaction, salinity, acidity, and poor drainage without other management." },
              { id: "d", label: "As a reason to ignore product nutrient concentration, crop stage, and soil test results." },
            ],
            correctOptionId: "a",
            feedback: { correct: "Correct. Product labels describe nutrient analysis. Convert a crop nutrient need into the relevant product amount while checking balance, stage, and soil evidence.", incorrect: "Read fertiliser analysis precisely. Nutrient content differs among products, so equal bag weights are not equal nutrient supplies." },
          },
          {
            id: "fv-4",
            prompt: "Which fertilisation plan best applies the 4Rs?",
            options: [
              { id: "a", label: "Choose verified organic and/or inorganic sources, calculate the rate from soil supply and crop demand, time delivery around crop uptake, and place nutrients where active roots can access them using a crop-safe method." },
              { id: "b", label: "Apply a single product at the same rate, time, and location to every crop regardless of soil, stage, roots, or irrigation." },
              { id: "c", label: "Broadcast all materials during heavy runoff risk because placement and timing do not matter." },
              { id: "d", label: "Use only price to choose a source and never inspect composition, quality, losses, or soil effects." },
            ],
            correctOptionId: "a",
            feedback: { correct: "Correct. The right source, rate, time, and place connect soil and crop evidence with nutrient efficiency and crop-safe application.", incorrect: "The 4Rs require the correct source, rate, time, and place. Match each to soil supply, crop demand, root access, field conditions, and a safe application method." },
          },
        ],
      },
    },
    {
      id: "field-care-and-maintenance",
      index: 27,
      title: "Field care and maintenance of vegetable crops",
      eyebrow: "Module 27",
      description:
        "Maintain crop structure, canopy health, fruit set, and market quality through timely support, pruning, training, pollination management, and fruit protection.",
      lessons: [
        {
          id: "maintain-crop-structure-and-canopy-health",
          title: "Maintain crop structure and canopy health",
          duration: "38 min",
          kicker: "Support, shape, and sanitise the crop before stress escalates",
          summary:
            "Use crop-timed trellising, pruning, and vine or branch training to protect plants from wind and ground contact while improving light, airflow, access, and disease management.",
          outcomes: [
            "Select a timely, strong, crop-appropriate support system that fits growth habit and field conditions.",
            "Prune for plant size, health, branching, fruit quality, light, air, and manageable crop operations.",
            "Train vines and tie branches to protect crop structure, field access, and plant health without creating new disease risks.",
          ],
          sections: [
            {
              heading: "Install crop support before it becomes a rescue operation",
              body:
                "The source defines a trellis as a light wooden or metal framework that supports shrub and climbing vegetables. It notes that trellising has already been addressed in the field-preparation module, then adds timing guidance for maintenance. Cucurbits and legumes are best supplied with a trellis before transplanting so they have a ready vertical crawling area and do not experience stress from late vine training after crawling on the ground. Solanaceous crops can be trellised soon after transplanting, with the source recommending rapid installation within 7 to 14 days to support growth, protect against wind, and avoid disturbing flowers later. Strong materials, suitable pole distance and height, secure posts, and practical net, string, bamboo, or wire systems are essential. Close pole spacing may improve support in windy or monsoon conditions. A good trellis supports field work, improves light and air movement, keeps fruit off soil, aids monitoring, and simplifies harvest and pruning.",
              callout:
                "Support systems are preventive crop care. Put them in place around crop growth habit and weather risk before vines, branches, flowers, or fruit become vulnerable.",
            },
            {
              heading: "Prune to balance growth, health, and access",
              body:
                "The source describes pruning as trimming or cutting dead plant parts or new shoots to encourage lateral branching. Its purposes include controlling plant size, avoiding disease spread, encouraging productive branching, improving fruit size and quality, simplifying crop management, and improving light and air circulation within plants. Examples include top pruning to stimulate branching, removing diseased plant parts, and removing leaves or branches below early flower or fruit clusters in eggplant. These examples illustrate a principle rather than a universal pattern: prune for a documented crop purpose, plant stage, and field condition. Avoid unnecessary removal that reduces crop capacity or exposes plants to avoidable stress.",
            },
            {
              heading: "Keep pruning and training clean, timely, and safe",
              body:
                "The source instructs growers to use clean, sharp scissors, carry a collecting pail, and dispose of pruned material away from the field—especially diseased material. Avoid pruning in wet conditions because cuts can become conducive entry points for fungal and bacterial infection. Begin vine training or branch tying promptly, within two weeks after transplanting where needed, and continue as crop growth requires. Bamboo clips can hold vines in the right crawling area during strong wind. Proper training directs branches, keeps them off the ground, secures plants, and clears alleys or canals. Use tools and materials that hold the plant without constricting, breaking, or damaging tender tissue, and revisit supports as plant weight increases.",
            },
          ],
        },
        {
          id: "protect-pollination-fruit-set-and-market-quality",
          title: "Protect pollination, fruit set, and market quality",
          duration: "35 min",
          kicker: "Secure fruit set before protecting fruit finish",
          summary:
            "Assess pollination risks, use manual pollination only when appropriate, maintain conditions that support fruit set, and use fruit support to protect clean, saleable produce.",
          outcomes: [
            "Distinguish natural and artificial pollination and identify when crop families require different management.",
            "Diagnose common causes of poor pollination, fruit abortion, and deformation before intervening.",
            "Use careful manual pollination and fruit support practices to improve fruit set, cleanliness, and market quality.",
          ],
          sections: [
            {
              heading: "Match pollination management to crop biology and field conditions",
              body:
                "Pollination is transfer of pollen from the anther of a male flower to the stigma of a female flower. The source contrasts natural pollination by insects or wind with artificial pollination by human intervention. Most solanaceous crops are primarily self-pollinated and do not normally require manual pollination; when fruit abortion occurs, the source directs attention to heat stress, drought, irrigation, and soil moisture during flowering and fruiting. Cucurbits are more dependent on cross-pollination and may need manual support when male flowers are scarce, fruit set is low, or fruits become deformed. Do not treat every poor fruit as a pollination problem—first observe crop family, flower production, water status, temperature, plant density, and pest or disease condition.",
              callout:
                "Before hand pollination, diagnose the cause of poor set. Water stress, heat, crop density, poor pollinator activity, and nutrition can each reduce fruit quality or set.",
            },
            {
              heading: "Use manual pollination carefully when it is justified",
              body:
                "For artificial pollination, the source describes an early-morning procedure: collect an open male flower, remove petals to expose mature anthers and pollen, identify a yellowish closed female flower, and brush pollen onto the receptive stigma. This procedure is relevant to crop and field situations where manual pollination is justified, particularly cross-pollinated cucurbits. Work gently and use clean hands or tools to avoid damaging flowers or transferring disease. Record the crop, date, flower condition, weather, and field location so fruit-set results can be compared with the suspected pollination limitation rather than relying on memory.",
            },
            {
              heading: "Protect fruit quality from set through harvest",
              body:
                "The source links insufficient pollination with deformed fruit. It identifies low insect activity, temperature extremes, insufficient male flowers, crop density that prevents pollinator movement, and excessive nitrogen as potential causes of pollination failure or deformation. Excess nitrogen can maintain vegetative growth and interfere with potassium uptake needed in flowering and fruiting. Fruit support then protects developing fruit from soil contact. The source encourages practical, creative support materials that keep fruit clean and blemish-free because clean, high-quality fruits command better market value. Combine fruit support with trellising, canopy care, soil-moisture management, and timely harvest so quality gains are preserved beyond pollination.",
            },
          ],
        },
      ],
      assessment: {
        id: "field-care-and-maintenance-check",
        title: "Field-care and maintenance check",
        description:
          "Apply crop-support, pruning, training, pollination, fruit-set, and fruit-protection principles to a practical vegetable field-care decision.",
        kind: "module",
        passMark: 80,
        questions: [
          {
            id: "fc-1",
            prompt: "Why does the source recommend preparing a trellis before transplanting for cucurbits and legumes?",
            options: [
              { id: "a", label: "It gives vines a ready crawling area and avoids the stress and disruption that can occur when support is installed after vines have spread on the ground." },
              { id: "b", label: "Trellises are only decorative and do not affect crop support, access, fruit contact, or field work." },
              { id: "c", label: "It allows growers to delay all crop observations until harvest." },
              { id: "d", label: "It removes the need to consider wind, plant growth habit, pole strength, or material condition." },
            ],
            correctOptionId: "a",
            feedback: { correct: "Correct. Early support provides a vertical growth area and avoids late-training stress, while supporting field access and crop protection.", incorrect: "Install support around crop growth habit before vines crawl on the ground. Late installation can stress plants and complicate training, flowers, and field operations." },
          },
          {
            id: "fc-2",
            prompt: "Which pruning practice best follows the source hygiene guidance?",
            options: [
              { id: "a", label: "Use clean, sharp tools; collect and remove pruned material from the field; avoid wet-condition pruning; and keep diseased material away from crop areas." },
              { id: "b", label: "Prune with blunt dirty tools during wet weather and leave diseased cuttings under plants." },
              { id: "c", label: "Remove plant parts at random without considering disease, crop purpose, growth stage, or canopy condition." },
              { id: "d", label: "Delay all training until heavy vines block alleys and irrigation canals." },
            ],
            correctOptionId: "a",
            feedback: { correct: "Correct. Clean sharp tools, field sanitation, and dry-condition timing reduce disease risk while preserving pruning’s crop-management benefits.", incorrect: "Pruning creates potential infection sites. Keep tools clean and sharp, collect and remove diseased material, and avoid wet conditions that favour fungal and bacterial infection." },
          },
          {
            id: "fc-3",
            prompt: "A cucurbit block has low fruit set and many deformed fruits. Which sequence is most defensible before relying on manual pollination?",
            options: [
              { id: "a", label: "Check flower availability, pollinator activity, temperature, irrigation and soil moisture, crop density, and nutrition; then use careful early-morning hand pollination if a pollination limitation remains likely." },
              { id: "b", label: "Assume every deformed fruit is caused only by insects and increase nitrogen immediately." },
              { id: "c", label: "Ignore water stress, heat, male-flower supply, crop density, and nutrient balance because they cannot affect fruit set." },
              { id: "d", label: "Hand-pollinate all crops at any time of day without checking crop family or flower condition." },
            ],
            correctOptionId: "a",
            feedback: { correct: "Correct. The source lists multiple pollination and fruit-set constraints; diagnose them first, then use careful crop-appropriate manual pollination if justified.", incorrect: "Poor set and deformed fruit can arise from several interacting causes. Assess crop biology, flowers, pollinators, temperature, water, density, and nutrition before intervening." },
          },
          {
            id: "fc-4",
            prompt: "What is the principal field-care value of fruit support?",
            options: [
              { id: "a", label: "It keeps fruit off the ground so it remains cleaner and less blemished, supporting higher market quality alongside crop support and canopy care." },
              { id: "b", label: "It replaces the need for pollination, irrigation, plant support, or crop monitoring." },
              { id: "c", label: "It intentionally increases fruit contact with wet soil." },
              { id: "d", label: "It is only useful after fruit has already become damaged." },
            ],
            correctOptionId: "a",
            feedback: { correct: "Correct. Fruit support prevents ground contact and helps deliver clean, blemish-free, marketable produce.", incorrect: "Use fruit support to protect developing fruit from soil contact and preserve clean, high-quality produce; it complements rather than replaces broader crop care." },
          },
        ],
      },
    },
    {
      id: "harvesting-and-post-harvest-handling",
      index: 28,
      title: "Harvesting and post-harvest handling",
      eyebrow: "Module 28",
      description:
        "Protect vegetable value from harvest through handling by choosing the right maturity, time, method, cooling and sorting sequence, and food-safety safeguards.",
      lessons: [
        {
          id: "harvest-at-market-ready-maturity-without-damage",
          title: "Harvest at market-ready maturity without damage",
          duration: "38 min",
          kicker: "Harvest quality is decided before the produce reaches a container",
          summary:
            "Choose the right age, time, and method for harvest, then protect produce from physical injury, heat, soil contact, and contamination in the field.",
          outcomes: [
            "Distinguish physiological maturity, commercial maturity, and market acceptability when setting a harvest decision.",
            "Choose a crop- and weather-appropriate harvest time that manages field heat, water status, and spoilage risk.",
            "Use tools, containers, and careful handling practices that prevent injury, contamination, and quality loss.",
          ],
          sections: [
            {
              heading: "Set harvest age from maturity and market purpose",
              body:
                "The source frames harvesting around four linked decisions: right age, right time, right way of harvesting, and right post-harvest handling. Harvest maturity is critical because too-young and too-old produce does not keep long. Physiological maturity means the plant has completed natural growth and development and may continue to develop after harvest; commercial maturity reflects the stage a buyer wants for a specific purpose. Market acceptability can differ by locality, crop use, colour, size, and consumer preference. Use maturity or harvest indices—such as crop stage, days after planting, marketable size, colour, fullness, gloss, leaf condition, or crop-specific indicators—to define a repeatable standard, then verify it with the target market, variety, purpose, and delivery plan.",
              callout:
                "Maturity is not one fixed date. Align crop development with the market specification, intended use, shelf-life requirement, and transport path before harvesting starts.",
            },
            {
              heading: "Choose harvest time around heat, moisture, and crop type",
              body:
                "The source recommends harvesting during cooler parts of the day to reduce heat loading, while noting that plants can be brittle in early morning and must be handled carefully. It advises against harvesting during or immediately after rain to reduce spoilage risk. It presents early morning as useful for fruit vegetables to minimise field heat and late afternoon as useful for leafy vegetables because daytime photosynthesis can increase sugars and slow yellowing. Harvest planning also connects with field water status for many fruit-bearing crops, crop-specific guidance, weather, labour, transport, and the next cooling or market step.",
            },
            {
              heading: "Harvest and collect without creating hidden losses",
              body:
                "Use sharp, clean tools and small collection containers where appropriate. Avoid pulling fruit when cutting is required, avoid damage at the peduncle, and use scissors or knives where they protect the crop and worker. Protect harvested produce with liners where they prevent abrasion from rough surfaces, and use clean food-grade containers such as plastic crates. Avoid dropping or throwing produce into containers, dragging containers, exposing produce to sunlight, or leaving it in contact with soil. Do not sit or stand on harvested vegetables. These details matter because physical injuries become entry points for spoilage and shorten shelf life.",
            },
          ],
        },
        {
          id: "run-a-safe-post-harvest-loss-control-chain",
          title: "Run a safe post-harvest loss-control chain",
          duration: "37 min",
          kicker: "Move from field heat to market quality with control points",
          summary:
            "Use cleaning, curing, cooling, sorting, grading, storage, handling, and food-safety safeguards to reduce loss and preserve saleable produce.",
          outcomes: [
            "Sequence post-harvest handling from collection through cleaning, curing or cooling, sorting, grading, and market preparation.",
            "Choose handling and cooling practices that fit commodity sensitivity and prevent cross-contamination or deterioration.",
            "Apply food-safety safeguards around manure, water, pesticide intervals, soil contact, equipment, and approved treatments.",
          ],
          sections: [
            {
              heading: "Build a handling chain that removes field hazards early",
              body:
                "The source defines post-harvest as beginning where production ends and identifies its purpose as reducing losses, maintaining saleable quality, extending shelf life, and protecting farm income. Use containers to collect harvest for cleaning and sorting. Cleaning can remove adhering soil and debris, remove damaged leaves, trim crop-specific stems, or use a clean soft cloth on suitable commodities. Curing is relevant for products such as onion, garlic, and potatoes; it uses warm, well-ventilated conditions so outer layers dry and harden. Sorting separates damaged or poor-quality produce from sound produce to avoid cross-contamination and early deterioration. Grading then classifies sound produce into defined quality, size, maturity, or market classes. Sorting removes risk; grading matches saleable produce to a market standard.",
              callout:
                "Post-harvest loss control begins at collection. Every delay in shade, cleaning, sorting, or safe separation can turn a small field injury into a larger quality or contamination problem.",
            },
            {
              heading: "Remove field heat without damaging water-sensitive crops",
              body:
                "Post-harvest cooling can remove field heat and preserve quality, but the source treats it as crop-dependent. Hydro-cooling is a rapid method for commodities that tolerate wet conditions; some crops are sensitive to post-harvest water and can rot if soaked, so they require another cooling approach. The source presents improvised options such as charcoal coolers and zero-energy cooling chambers. Select cooling from commodity sensitivity, field temperature, expected holding time, available water quality, sanitation, packaging, and local infrastructure. Once cooling is used, protect the temperature benefit through shade, clean handling, suitable packaging, timely transport, and avoidance of repeated heat exposure.",
            },
            {
              heading: "Keep food safety inside the post-harvest plan",
              body:
                "The source directs growers not to apply raw dairy or chicken manure in produce areas, to clean equipment used for manure before another area, not to use livestock-affected farm-pond water, to observe pesticide pre-harvest intervals, and not to lay harvested produce directly on soil—especially where manure is scattered or animals graze. It also presents food-grade and plant-extract treatment examples. Treat these as context-specific options, not universal recipes: use only approved treatments under local food-safety rules, verified commodity suitability, safe water, sanitation, and buyer requirements. Protect clean tools, containers, water, surfaces, separation of damaged produce, and traceable harvest practices before adding any treatment.",
            },
          ],
        },
      ],
      assessment: {
        id: "harvesting-and-post-harvest-handling-check",
        title: "Harvesting and post-harvest handling check",
        description:
          "Apply maturity, timing, field handling, cooling, sorting, food-safety, and post-harvest loss-control principles to a vegetable market decision.",
        kind: "module",
        passMark: 80,
        questions: [
          {
            id: "ph-1",
            prompt: "What is the most defensible basis for setting a vegetable harvest standard?",
            options: [
              { id: "a", label: "Use maturity indices together with crop purpose, variety, market preference, intended use, shelf-life needs, and delivery plan." },
              { id: "b", label: "Harvest every crop on the same calendar day regardless of maturity, buyer preference, or intended market." },
              { id: "c", label: "Harvest only when every crop reaches the same colour because commercial maturity never varies by market." },
              { id: "d", label: "Ignore crop development and harvest only when field labour happens to be available." },
            ],
            correctOptionId: "a",
            feedback: { correct: "Correct. The source distinguishes physiological maturity from commercial maturity and market acceptability, so the harvest standard must connect crop development with intended market and use.", incorrect: "Harvest maturity must be linked to crop development and market purpose. Use reliable maturity indices together with buyer, variety, use, shelf-life, and transport requirements." },
          },
          {
            id: "ph-2",
            prompt: "Which field-harvest practice best protects vegetable quality?",
            options: [
              { id: "a", label: "Use sharp clean tools and clean food-grade containers; minimise pulling, abrasion, drops, sunlight exposure, and soil contact; and handle produce gently." },
              { id: "b", label: "Throw harvested produce into rough containers and leave it in direct sun to speed field work." },
              { id: "c", label: "Drag containers through soil and stand on produce so fewer crates are needed." },
              { id: "d", label: "Use dirty blunt tools because harvest injuries do not affect spoilage or shelf life." },
            ],
            correctOptionId: "a",
            feedback: { correct: "Correct. Clean cutting, gentle collection, suitable containers, shade, and avoidance of soil contact protect produce from injuries and contamination that cause later losses.", incorrect: "Quality loss often begins as harvest damage. Use clean sharp tools, gentle handling, protective containers, shade, and separation from soil and contamination." },
          },
          {
            id: "ph-3",
            prompt: "How do sorting and grading differ in a loss-control chain?",
            options: [
              { id: "a", label: "Sorting removes damaged or poor produce to reduce contamination and deterioration; grading classifies sound produce into defined quality, size, maturity, or market categories." },
              { id: "b", label: "Sorting and grading both mean leaving damaged and sound produce mixed together." },
              { id: "c", label: "Grading is only done before harvest, while sorting is never used after harvest." },
              { id: "d", label: "Sorting is a cooling method and grading is a pesticide treatment." },
            ],
            correctOptionId: "a",
            feedback: { correct: "Correct. Sorting removes deterioration risks; grading matches sound produce to an agreed quality or market standard.", incorrect: "Separate poor or damaged produce early through sorting, then grade sound produce by the relevant market quality, size, maturity, or class criteria." },
          },
          {
            id: "ph-4",
            prompt: "Which practice best follows the source food-safety guidance after harvest?",
            options: [
              { id: "a", label: "Use clean equipment and safe water, observe pesticide pre-harvest intervals, keep produce off soil and animal-contaminated areas, and use only approved commodity-suitable treatments." },
              { id: "b", label: "Place harvested produce directly on livestock-affected soil and use any nearby pond water without checking contamination risk." },
              { id: "c", label: "Ignore pesticide pre-harvest intervals because washing always removes every residue risk." },
              { id: "d", label: "Move equipment from raw-manure areas into harvest areas without cleaning it." },
            ],
            correctOptionId: "a",
            feedback: { correct: "Correct. Food safety is built from clean tools and water, controlled manure and soil contact, pesticide-interval compliance, and approved crop-suitable practices.", incorrect: "Protect food safety through clean equipment, safe water, pre-harvest interval compliance, separation from manure and animal contamination, and verified commodity-suitable handling or treatment practices." },
          },
        ],
      },
    },
    {
      id: "field-diagnosis-in-vegetable-crops",
      index: 29,
      title: "Field diagnosis in vegetable crops",
      eyebrow: "Module 29",
      description:
        "Diagnose vegetable health problems through structured observation, a biotic–abiotic process of elimination, evidence-led questioning, and responsible IPM-aligned recommendations.",
      lessons: [
        {
          id: "diagnose-by-observation-and-elimination",
          title: "Diagnose by observation and elimination",
          duration: "40 min",
          kicker: "Observe the plant, plot, pattern, and production history before naming a cause",
          summary:
            "Use a disciplined field-visit sequence to distinguish symptoms from signs, connect patterns with possible causes, and eliminate hypotheses without guessing.",
          outcomes: [
            "Inspect affected plants, roots, groups of plants, and field patterns systematically during a diagnosis visit.",
            "Differentiate biotic from abiotic cause categories and link symptoms to multiple plausible causes.",
            "Gather farmer, crop-history, soil, climate, input, and pattern evidence before narrowing a diagnosis.",
          ],
          sections: [
            {
              heading: "Start with a process of elimination, not a product decision",
              body:
                "The source defines field diagnosis as diagnosing a plant-health problem through a process of elimination. It separates possible causes into biotic categories—such as insect pests, mites, viruses, bacteria, fungi, water moulds, nematodes, and phytoplasma—and abiotic categories such as water, temperature, nutrients, and chemical injury. A similar symptom can arise from more than one cause, and more than one problem can occur in the same plant. Therefore, symptoms such as wilt, leaf or fruit spots, yellowing, mosaic, distortion, little leaf, galls, drying, necrosis, or blight are starting points for investigation, not proof of a single causal agent.",
              callout:
                "Do not turn a visible symptom into a diagnosis. Use it to build a shortlist of causes that must be tested against field evidence.",
            },
            {
              heading: "Follow the four-part field-visit sequence",
              body:
                "The source’s field-visit sequence begins by getting close: identify affected plant parts, changes in shape, colour, and growth, and visible signs such as insects, fungi, or other pests. Next, examine the whole plant and roots, locating symptoms within the plant, identifying affected growth stages, and assessing severity. Then examine a group of plants: determine incidence, distribution, and whether the pattern is random, at plot edges, in patches, or aligned with machinery or a field operation. Finally, speak to farmers and local extension workers to determine when the problem appeared, whether it is new, how soil type and climate patterns may matter, which varieties were used, and what chemical or other inputs were recently applied.",
            },
            {
              heading: "Use plant patterns to refine the diagnostic question",
              body:
                "The source advises linking symptoms with possible causes and refining the diagnosis by asking more questions and scouting the field. Compare localised versus symmetrical symptoms, isolated versus widespread incidence, plant age, variety, crop management, field history, and root condition. Where appropriate, examine internal symptoms by cutting the specimen. A pattern of symptoms can be influenced by nutrient status, water moulds, fungi, bacteria, nematodes, insects, mites, viruses, phytoplasma, or physical and herbicide injury. Use photos, crop guides, technical guides, and experienced support to test hypotheses. If information is lacking, visit the field where possible rather than making a remote guess.",
            },
          ],
        },
        {
          id: "turn-evidence-into-responsible-recommendations",
          title: "Turn evidence into responsible recommendations",
          duration: "36 min",
          kicker: "Recommend from evidence, severity, and prevention—not certainty theatre",
          summary:
            "Translate a carefully qualified diagnosis into an IPM-aligned recommendation, a prevention plan, and a clear feedback loop with the farmer and specialist support where needed.",
          outcomes: [
            "State a diagnosis with appropriate confidence, uncertainty, supporting evidence, and next verification steps.",
            "Use severity, the source’s Big 5 review, and IPM principles to select proportionate recommendations.",
            "Build prevention, resistance-management, beneficial-insect protection, and farmer feedback into the recommendation.",
          ],
          sections: [
            {
              heading: "Collect enough evidence to make a qualified recommendation",
              body:
                "The source’s diagnosis summary calls for careful specimen examination, additional information gathering, inspection of internal symptoms where appropriate, comparison of symmetrical and localised patterns, field visits when information is lacking, use of photos, guides, and experience, consideration of multiple problems in one plant, and detailed cause descriptions. It explicitly says not to guess and to seek support from others. A professional recommendation should therefore record observed symptoms and signs, field pattern, crop stage, likely cause categories, evidence for and against the leading hypotheses, severity, any missing information, and the next verification action. This makes the recommendation auditable and reduces the risk of treating the wrong problem.",
              callout:
                "A useful diagnosis may conclude that more evidence is needed. Naming uncertainty and the next observation is safer and more professional than a confident unsupported guess.",
            },
            {
              heading: "Apply IPM and severity to choose proportionate actions",
              body:
                "The source’s recommendation summary directs advisors to consider the Big 5, assess severity, use personal judgement wisely, and ensure IPM principles are applied. Recommendations should therefore start with the verified cause category and the severity, distribution, crop stage, and economic or quality risk. Link immediate actions with cultural, sanitation, water, nutrition, crop-management, and monitoring options before considering any crop-protection intervention. When a crop-protection product is legally and technically appropriate, follow local labels and registration requirements, use the correct resistance-management approach, and do not promote restricted materials or products that harm beneficial insects. The source specifically encourages alternation of mode-of-action groups and avoidance of red-listed pesticides and harmful effects on beneficial insects.",
            },
            {
              heading: "Close the loop through prevention and farmer feedback",
              body:
                "The source asks advisors to provide prevention advice for the next season, seek specialist support rather than guess, and obtain farmer feedback for sharing with others. Convert the diagnosis into a prevention plan that may include crop rotation or hygiene where relevant, variety choice, water or drainage changes, soil or nutrient correction, safer input records, pest and disease monitoring, protected beneficial organisms, and early reporting triggers. Record what was recommended, why, when it was applied, and what happened afterward. Feedback from the farmer helps distinguish an effective intervention from a coincidental improvement and builds a stronger local diagnostic record for future advisory work.",
            },
          ],
        },
      ],
      assessment: {
        id: "field-diagnosis-in-vegetable-crops-check",
        title: "Vegetable field-diagnosis check",
        description:
          "Apply systematic observation, symptom-and-cause elimination, evidence gathering, severity assessment, IPM, and prevention principles to a vegetable field-diagnosis decision.",
        kind: "module",
        passMark: 80,
        questions: [
          {
            id: "fd-1",
            prompt: "What is the source’s central principle for diagnosing plant-health problems?",
            options: [
              { id: "a", label: "Use a process of elimination that compares biotic and abiotic causes against symptoms, signs, field patterns, history, and further evidence." },
              { id: "b", label: "Treat the first visible symptom as proof of one pest or disease without examining the crop or field." },
              { id: "c", label: "Assume every yellow leaf is caused by the same nutrient shortage in every crop and season." },
              { id: "d", label: "Select a pesticide before gathering any plant, field, farmer, or crop-history evidence." },
            ],
            correctOptionId: "a",
            feedback: { correct: "Correct. The source frames diagnosis as a process of elimination between biotic and abiotic causes using plant, field, and production-history evidence.", incorrect: "Symptoms are not proof. Build and test a cause shortlist using observations, signs, roots, patterns, crop history, farmer information, and further inspection." },
          },
          {
            id: "fd-2",
            prompt: "Which sequence best follows the source’s field-visit steps?",
            options: [
              { id: "a", label: "Inspect affected parts closely; examine the whole plant and roots; assess incidence and distribution across plants; then interview farmers and extension workers about timing, variety, inputs, soil, and climate." },
              { id: "b", label: "Ask for a product preference first, then inspect only one leaf and leave without checking roots, patterns, or field history." },
              { id: "c", label: "Ignore distribution and farmer history because symptoms always have one identical cause." },
              { id: "d", label: "Inspect only the most damaged plant after choosing a treatment for the entire field." },
            ],
            correctOptionId: "a",
            feedback: { correct: "Correct. The sequence moves from close inspection through whole-plant and root assessment to population pattern and field-history evidence.", incorrect: "A sound visit gathers evidence at several scales: affected parts, whole plant and roots, groups and distribution, then crop and management history from people who know the field." },
          },
          {
            id: "fd-3",
            prompt: "A field shows yellowing in scattered patches, but the farmer recently changed water management and applied a new chemical input. What is the most defensible next step?",
            options: [
              { id: "a", label: "Inspect symptom distribution, plant and root condition, timing, crop stage, water pattern, input history, and possible signs; compare both biotic and abiotic hypotheses before recommending action." },
              { id: "b", label: "Assume a virus immediately because yellowing always proves viral infection." },
              { id: "c", label: "Apply a crop-protection product without checking soil, water, chemical injury, nutrient status, roots, or field pattern." },
              { id: "d", label: "Ignore the new management history because plant symptoms are unrelated to field operations." },
            ],
            correctOptionId: "a",
            feedback: { correct: "Correct. Yellowing has multiple possible causes; the new water and chemical history is diagnostic evidence that must be assessed alongside biotic possibilities.", incorrect: "Do not diagnose from colour alone. Examine patterns, roots, timing, water, input history, signs, and crop context to eliminate both biotic and abiotic hypotheses." },
          },
          {
            id: "fd-4",
            prompt: "Which recommendation best follows the source’s responsible advisory approach?",
            options: [
              { id: "a", label: "State evidence and uncertainty, assess severity, apply IPM, include prevention and monitoring, alternate appropriate mode-of-action groups when legally relevant, protect beneficial insects, seek support when needed, and obtain farmer feedback." },
              { id: "b", label: "Make a certain diagnosis without evidence, skip prevention, and recommend any available product regardless of restrictions or beneficial insects." },
              { id: "c", label: "Treat every crop problem with the same intervention and never record outcome or farmer feedback." },
              { id: "d", label: "Ignore severity, crop stage, distribution, legal labels, and the possibility that more evidence is needed." },
            ],
            correctOptionId: "a",
            feedback: { correct: "Correct. The source requires evidence-led recommendations, severity judgement, IPM, prevention, mode-of-action awareness, beneficial-insect protection, support-seeking, and feedback.", incorrect: "Responsible recommendations are proportionate and transparent. Ground them in evidence and severity, follow IPM and local legal requirements, prevent recurrence, protect beneficials, and seek support or feedback when needed." },
          },
        ],
      },
    },
    {
      id: "disease-identification-and-management",
      index: 30,
      title: "Disease identification and management",
      eyebrow: "Module 30",
      description:
        "Identify plant disease with symptoms, signs, patterns, and cause categories, then build preventive, IPM-aligned management around host, pathogen, and environment evidence.",
      lessons: [
        {
          id: "identify-disease-with-symptoms-signs-and-patterns",
          title: "Identify disease with symptoms, signs, and patterns",
          duration: "40 min",
          kicker: "Separate disease evidence from look-alike crop stress before acting",
          summary:
            "Scout systematically, distinguish symptoms from signs, compare plant-part patterns, and rule out abiotic and insect stresses before classifying a disease cause.",
          outcomes: [
            "Identify affected plants and record symptoms, signs, patterns, crop part, and level of incidence.",
            "Distinguish biotic disease categories from non-disease abiotic and insect stress.",
            "Use leaf, fruit, stem, root, and whole-plant evidence to form and verify a qualified disease hypothesis.",
          ],
          sections: [
            {
              heading: "Scout before you classify",
              body:
                "The source begins disease identification with field scouting and sample collection. Its first steps are to identify affected plants, check symptoms and signs, check the pattern of infection, consult local experts or agricultural advisors when unsure, and seek laboratory testing when available. Disease may arise from fungi, water moulds or oomycetes, bacteria, viruses, nematodes, and related living agents, but temperature, soil and canopy moisture, light, nutrient availability, chemical toxicity, soil pH, and host susceptibility can also cause or contribute to symptoms. Not all plant problems are caused by pathogens, and environmental or insect stress can closely resemble disease.",
              callout:
                "A disease label is a hypothesis until symptoms, signs, pattern, crop history, and alternative causes have been checked together.",
            },
            {
              heading: "Read symptoms across plant parts and the whole field",
              body:
                "The source lists deformed leaves, shoot or leaf blight, fruit spot, fruit rot, canker, leaf spots, wilt, vascular wilt, root rot, yellowing, mosaic, and stunting as diagnostic starting points. It uses plant part as an entry point: leaf yellowing, mosaic, or spots can indicate different categories; fruit spots, rot, or deformation need different checks; stem collar rot, blight, or spots narrow the question; roots may show rot or galls; and whole plants may show wilt with or without yellowing, bacterial ooze, stunting, or pale colour. Compare the observed symptom with signs of a biotic agent and known crop, field, and input history. A single symptom can have more than one cause.",
            },
            {
              heading: "Use infection pattern and severity to refine the decision",
              body:
                "Check infection pattern, amount of infected plants, and neighbouring fields. The source uses incidence below 30% as low, 30% to 50% as moderate, and above 50% as high as a practical severity frame. Record whether symptoms are localised or widespread and associated with moisture, field edges, water movement, crop density, machinery, or recent inputs. Review crop history, weather, irrigation, nutrition, and previous disease occurrence. Pattern helps distinguish broad abiotic influences from spreading pathogens, but it does not replace confirmation from signs, expert support, or testing where the decision has high consequences.",
            },
          ],
        },
        {
          id: "manage-disease-through-prevention-and-ipm",
          title: "Manage disease through prevention and IPM",
          duration: "38 min",
          kicker: "Break the disease cycle before relying on a treatment response",
          summary:
            "Match management to fungal, bacterial, viral, and nematode risks through resistant material, sanitation, clean inputs, water and canopy management, rotation, vector control, and lawful crop-protection decisions.",
          outcomes: [
            "Build preventive management from pathogen, host, environment, and disease-history evidence.",
            "Differentiate disease-management priorities for fungi and water moulds, bacteria, viruses, and nematodes.",
            "Use IPM and local legal requirements when considering crop-protection products or vector management.",
          ],
          sections: [
            {
              heading: "Use prevention to interrupt disease development",
              body:
                "The source’s general fungal-disease management begins with resistant or tolerant varieties where available, pathogen-free seed, removal of infected plants and debris, crop rotation, destruction of alternate hosts, clean tools, good drainage and land preparation, suitable plant spacing, and avoidance of excessive moisture or prolonged leaf wetness. Water mould and moisture-associated problems require special attention to drainage, irrigation practice, crop overlap, humidity, and leaf wetness. Use disease history, susceptible crop family, weather, soil, canopy condition, and planting material quality to select the preventive combination rather than applying a generic response.",
              callout:
                "The strongest disease recommendation usually changes the conditions that allow disease to establish, survive, and spread—not only the symptoms that are visible today.",
            },
            {
              heading: "Adapt management to the disease cause category",
              body:
                "The source describes bacteria as organisms that can survive in crop residues, seed, tubers, volunteer plants, soil, and water, and spread mechanically, through water, insects, or infected planting material. Its bacterial-disease principles include resistant varieties, pathogen-free seeds or seedlings, removal of infected plants or branches, decontamination of tools and hands, adjusted watering to prevent spread, balanced fertilisation, and rotation with non-host crops. Viral diseases require prevention because infected plants are not cured by a later treatment; use monitoring, removal of infected plants and host weeds where appropriate, clean planting material, and management of relevant vectors through IPM. Root-knot nematode risks call for resistant varieties or rootstocks where available, rotation, soil-structure improvement, and locally validated soil-health measures.",
            },
            {
              heading: "Keep crop-protection decisions lawful, precise, and integrated",
              body:
                "The source distinguishes preventive, contact, local-systemic, systemic, and curative crop-protection concepts, but a product category is not a diagnosis or a substitute for prevention. When crop-protection action is legally registered and technically justified, follow the local label, crop registration, pre-harvest interval, personal-protection, water-protection, resistance-management, and beneficial-insect requirements. Select the action from verified cause, crop, growth stage, severity, disease forecast, and preventive measures already in place. Avoid working on wet or diseased crops in ways that spread infection, and clean tools, hands, containers, and equipment between affected and clean areas.",
            },
          ],
        },
      ],
      assessment: {
        id: "disease-identification-and-management-check",
        title: "Disease-identification and management check",
        description:
          "Apply scouting, symptoms, signs, infection pattern, cause categories, prevention, IPM, and responsible management to a vegetable disease decision.",
        kind: "module",
        passMark: 80,
        questions: [
          {
            id: "dm-1",
            prompt: "What is the most defensible first sequence when a vegetable field shows disease-like symptoms?",
            options: [
              { id: "a", label: "Identify affected plants; check symptoms and signs; assess infection pattern and incidence; review crop, weather, water, nutrition, and input history; seek expert or laboratory support when uncertainty remains." },
              { id: "b", label: "Assume every symptom is a fungal disease and select a product before inspecting the field." },
              { id: "c", label: "Ignore abiotic and insect stress because disease symptoms can only have one possible cause." },
              { id: "d", label: "Assess only one leaf and never check roots, neighbouring fields, crop history, or planting material." },
            ],
            correctOptionId: "a",
            feedback: { correct: "Correct. The source requires systematic scouting, symptoms and signs, infection pattern, field history, and expert or laboratory support when needed.", incorrect: "Start with evidence. Scout affected plants and field patterns, check symptoms and signs, review abiotic factors and history, and seek expert or laboratory confirmation when the diagnosis remains uncertain." },
          },
          {
            id: "dm-2",
            prompt: "Why must an advisor check abiotic factors when investigating a suspected disease?",
            options: [
              { id: "a", label: "Because moisture, temperature, nutrients, chemical toxicity, pH, and other non-living stresses can resemble or contribute to disease symptoms." },
              { id: "b", label: "Because environmental conditions do not affect plant health or pathogen development." },
              { id: "c", label: "Because every root rot, wilt, spot, or yellow leaf is always caused by the same pathogen." },
              { id: "d", label: "Because disease management never needs crop, water, soil, canopy, or input information." },
            ],
            correctOptionId: "a",
            feedback: { correct: "Correct. The source explicitly notes that not all plant problems are caused by pathogens and that abiotic factors can cause or contribute to similar symptoms.", incorrect: "Check non-living stresses as well as pathogens. Water, temperature, nutrients, chemical injury, pH, and canopy conditions can mimic, predispose crops to, or worsen disease symptoms." },
          },
          {
            id: "dm-3",
            prompt: "Which integrated action set best prevents spread of a bacterial disease problem?",
            options: [
              { id: "a", label: "Use clean planting material and resistant varieties where available, remove infected plants or branches, decontaminate tools and hands, adjust water management to reduce spread, rotate with non-hosts, and maintain balanced crop conditions." },
              { id: "b", label: "Move from infected plants to healthy plants with uncleaned tools and increase water flow through affected areas." },
              { id: "c", label: "Rely only on a product decision and keep infected residues, contaminated planting material, and uncleaned equipment in use." },
              { id: "d", label: "Ignore crop rotation, planting-material health, water movement, sanitation, and field history because bacteria cannot spread through them." },
            ],
            correctOptionId: "a",
            feedback: { correct: "Correct. The source connects clean planting material, resistance, removal, tool hygiene, water management, balanced fertility, and non-host rotation in bacterial-disease management.", incorrect: "Bacterial-disease prevention is integrated: protect planting material, remove inoculum, decontaminate tools and hands, manage water spread, rotate crops, and maintain crop resilience." },
          },
          {
            id: "dm-4",
            prompt: "What is the correct role of a crop-protection product in the source’s disease-management framework?",
            options: [
              { id: "a", label: "It is one legally registered, label-directed component of an IPM plan selected from verified diagnosis, crop, stage, severity, forecast, and preventive measures—not a substitute for diagnosis or prevention." },
              { id: "b", label: "It is the first and only step, regardless of cause, crop registration, severity, label, beneficial insects, or disease history." },
              { id: "c", label: "It can cure viral infection in established plants without removing sources or managing vectors." },
              { id: "d", label: "It removes the need for sanitation, resistant material, drainage, crop rotation, monitoring, or record keeping." },
            ],
            correctOptionId: "a",
            feedback: { correct: "Correct. A justified crop-protection action must be legally registered and label-directed, and it works alongside diagnosis, prevention, IPM, resistance management, and monitoring.", incorrect: "Do not use a product as a substitute for diagnosis. Integrate any legal label-directed crop-protection action with prevention, sanitation, crop history, water management, resistant material, and monitoring." },
          },
        ],
      },
    },
  ],
  finalAssessment: {
    id: "crop-advisor-final",
    title: "Crop Advisor Foundations final assessment",
    description:
      "Integrate advisory practice, soil context, crop observation, vegetable-production planning, cost-based decisions, crop-and-variety selection, crop-yield factors, climatic-risk management, topographic site interpretation, complete edaphic soil assessment, soil-protection planning, balanced plant-nutrition decisions, integrated nutrient management, acid-soil management, soil-health promotion, representative soil-sample collection, protected vegetable-nursery management, open-field bare-root seedling production, protected cellular seedling production, seedling-production planning, field preparation, mulching, trellising, transplanting, water management, irrigation-system selection, drip-system planning and maintenance, efficient vegetable fertilisation, field-care and maintenance decisions, harvest and post-harvest loss control, evidence-led field diagnosis, and integrated disease management to qualify for certification.",
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
      {
        id: "final-17",
        prompt:
          "An advisor needs a soil test for a vegetable farm with a fertilised headland, a compost pile, a sloping field section, and a flatter section with different crop history. Which plan is most defensible?",
        options: [
          { id: "a", label: "Map and separate the distinct homogeneous areas, avoid atypical locations, collect multiple subsamples at a recorded root-zone depth, prepare clean composites, and label their crop and management histories." },
          { id: "b", label: "Take a single sample from the fertilised headland and apply the result to the whole farm." },
          { id: "c", label: "Mix soil from all depths, the compost pile, and every field section into one unlabelled bag." },
          { id: "d", label: "Test only after harvest, without recording previous crops, fertiliser, lime, slope, or erosion information." },
        ],
        correctOptionId: "a",
        feedback: {
          correct: "Correct. The plan protects representativeness by separating decision areas, avoiding localised bias, standardising depth, using composites, and preserving the management context for interpretation.",
          incorrect: "A usable soil test begins with a mapped decision area, representative distributed subsamples at a recorded depth, clean preparation, and a label that preserves crop and management history.",
        },
      },
      {
        id: "final-18",
        prompt:
          "A vegetable-transplant batch has weak roots, elongated stems, uneven vigour, and a nursery enclosure with gaps in its insect net. Which advisor plan is most defensible?",
        options: [
          { id: "a", label: "Improve spacing and line sowing, prepare and protect the growing medium, use raised drainage and appropriate rain-sun protection, repair the net barrier, and reassess root quality before transplanting." },
          { id: "b", label: "Transplant immediately because canopy colour is the only seedling-quality measure." },
          { id: "c", label: "Leave gaps in the net, crowd seedlings further, and rely on visible virus symptoms to identify all problems." },
          { id: "d", label: "Move the nursery into permanent dense shade and remove drainage so stress cannot occur." },
        ],
        correctOptionId: "a",
        feedback: {
          correct: "Correct. The plan addresses root quality, orderly nursery conditions, moisture management, protective structure, insect exclusion, and a readiness check before field establishment.",
          incorrect: "Weak roots, elongation, uneven vigour, and gaps in exclusion require a linked nursery-improvement plan before transplanting—not a rushed field move or a single input.",
        },
      },
      {
        id: "final-19",
        prompt:
          "An open-field tomato nursery is densely sown in a low, weedy bed. Emerging seedlings remain under an opaque cover, and the grower plans to pull them into a dry field at midday. Which advisor response is most defensible?",
        options: [
          { id: "a", label: "Rebuild the plan around a weed-free, well-drained raised bed and thin rows; remove opaque cover at emergence; harden seedlings; pre-water nursery and field; then transplant carefully in lower-stress conditions." },
          { id: "b", label: "Leave the nursery crowded and covered, then pull all seedlings at midday because fast transplanting prevents shock." },
          { id: "c", label: "Increase evening irrigation in the poorly drained bed and transplant broken seedlings to avoid wasting seed." },
          { id: "d", label: "Ignore shading, drainage, root handling, and timing because bare-root seedlings establish without management." },
        ],
        correctOptionId: "a",
        feedback: {
          correct: "Correct. The plan corrects dense sowing, site and drainage risks, low-light stretching, inadequate hardening, dry root-zone contact, and high-stress transplant timing.",
          incorrect: "Open-field seedling quality depends on a connected approach to site and bed design, thin sowing, cover management, hardening, careful roots, water, and transplant timing.",
        },
      },
      {
        id: "final-20",
        prompt:
          "A cellular cucurbit nursery uses dry, unsterilised compacted media, long pre-germinated roots are bent upward in each cell, and seedlings are moved directly from shade to a hot field. Which advisor plan is most defensible?",
        options: [
          { id: "a", label: "Prepare a moist, balanced and sterilised medium, fill cells without compaction, sow just-emerging radicles downward, manage protected germination, then harden seedlings before checking quality and transplanting." },
          { id: "b", label: "Keep the medium dry during heating, pack it tightly, delay sowing until roots are long, and avoid hardening so leaves stay soft." },
          { id: "c", label: "Add several seeds to each cell at arbitrary depth and use transplant date alone to decide readiness." },
          { id: "d", label: "Treat brown roots and yellow leaves as normal if seedlings are tall enough to move immediately." },
        ],
        correctOptionId: "a",
        feedback: {
          correct: "Correct. The plan links media quality, careful cellular sowing, appropriate pre-germination, protected emergence, hardening, and multi-signal readiness assessment.",
          incorrect: "Cellular seedling quality depends on a balanced moist sterilised medium, uncompressed cells, correctly handled emerging radicles, protected germination, hardening, and root-shoot quality checks.",
        },
      },
      {
        id: "final-21",
        prompt:
          "A grower orders seed without checking lot information, soaks coated seed, counts only the target plants without a replacement allowance, and fills a nursery with saline compacted medium. Which advisor response is most defensible?",
        options: [
          { id: "a", label: "Verify label, source, storage, germination, and treatment information; preserve coated-seed treatment; compute layout-based seedling needs with an allowance; and select porous, water-holding, disease-free, non-saline media with an appropriate protected nursery method." },
          { id: "b", label: "Use packet appearance, soak every seed, order exactly one seedling per intended plant, and rely on fertiliser to correct unsuitable medium." },
          { id: "c", label: "Ignore crop layout, expected losses, media quality, seed treatment, and nursery protection until field problems occur." },
          { id: "d", label: "Choose all inputs only by lowest price, regardless of crop target, seed traceability, planting geometry, and root conditions." },
        ],
        correctOptionId: "a",
        feedback: {
          correct: "Correct. The response links traceable seed quality, correct treatment handling, realistic field-layout calculation, media function, method choice, and protection before production begins.",
          incorrect: "Defensible seedling planning integrates seed verification, coated-seed handling, field-layout and replacement calculations, appropriate media, a suitable method, and protected nursery conditions.",
        },
      },
      {
        id: "final-22",
        prompt:
          "A vegetable field has a weedy, uneven surface, poor rainy-season drainage, loose plastic mulch with heat pockets, and cucurbit seed ready before trellis materials arrive. Which advisor plan is most defensible?",
        options: [
          { id: "a", label: "Complete the site and soil review, clear weeds before seed set, level and form raised beds with drainage, install mulch snugly on prepared soil, and make the trellis ready before transplanting cucurbits." },
          { id: "b", label: "Plant immediately, leave the field uneven, retain loose mulch, and wait until vines crawl on the soil before seeking trellis materials." },
          { id: "c", label: "Remove drainage canals, burn used plastic in the field, and use crop price alone to decide bed layout." },
          { id: "d", label: "Rely on fertiliser to correct waterlogging, mulch installation, field layout, and unsupported vines after planting." },
        ],
        correctOptionId: "a",
        feedback: {
          correct: "Correct. The plan connects field appraisal, clearing, bed and drainage design, sound mulch installation, and timely crop-specific trellising before preventable stresses are transferred to the crop.",
          incorrect: "A defensible field plan addresses site and soil evidence, clearing, raised beds and drainage, mulch-installation quality, and trellis timing together—before crop establishment." },
      },
      {
        id: "final-23",
        prompt:
          "A grower plans to transplant dry, unhardened tray seedlings at midday into a field whose mulch, holes, and trellises are incomplete. The grower also plans to bury cotyledons and set roots directly on fertiliser. Which advisor response is most defensible?",
        options: [
          { id: "a", label: "Finish field preparation; water seedlings and bed; harden seedlings; transplant in lower sun; remove tray plants from below with stem support; plant at the same level with cotyledons exposed; and keep roots separated from fertiliser." },
          { id: "b", label: "Proceed at midday because transplant shock has no relationship to hardening, heat, water, root handling, or field readiness." },
          { id: "c", label: "Bury cotyledons, break root blocks, and place fertiliser directly against roots to increase early uptake." },
          { id: "d", label: "Delay all monitoring until late season, even if plants wilt and missing stands develop immediately." },
        ],
        correctOptionId: "a",
        feedback: {
          correct: "Correct. The plan links field readiness, moisture, hardening, low-stress timing, careful removal, correct depth, cotyledon protection, and safe nutrient placement.",
          incorrect: "Successful transplanting is a system: prepare field and seedling, harden and water, choose lower heat, protect the root block and cotyledons, prevent fertiliser burn, and monitor the early stand.",
        },
      },
      {
        id: "final-24",
        prompt:
          "A sandy vegetable field receives long, heavy irrigation events, then dries out before flowering. In the rainy period, drainage canals are blocked, and the grower proposes untreated wastewater as a backup source. Which advisor response is most defensible?",
        options: [
          { id: "a", label: "Use smaller, more frequent applications guided by root-zone moisture; protect the root-zone water-air balance; conserve water with mulch and catchment; open drainage canals in wet periods; and exclude untreated wastewater from irrigation." },
          { id: "b", label: "Continue heavy infrequent irrigation on sand, leave drainage blocked, and use untreated wastewater whenever irrigation is scarce." },
          { id: "c", label: "Ignore soil texture, critical flowering demand, waterlogging, and water quality because all crops use water in the same way." },
          { id: "d", label: "Apply more water in every season without checking moisture, root health, climate, soil type, or drainage." },
        ],
        correctOptionId: "a",
        feedback: {
          correct: "Correct. The plan integrates sandy-soil scheduling, root-zone balance, dry-season conservation, wet-season drainage, and water-quality safeguards.",
          incorrect: "A defensible water plan adapts to soil, crop stage, moisture, climate, and season while protecting roots from saturation, reducing leaching, maintaining drainage, and excluding untreated wastewater.",
        },
      },
      {
        id: "final-25",
        prompt:
          "A farmer grows vegetables under plastic mulch on a hot, dry site. The water source has debris, labour is limited, and the grower is considering low-capital furrow irrigation because it is familiar. Which advisor recommendation is most defensible?",
        options: [
          { id: "a", label: "Compare practical furrow and drip options against soil, slope, water supply and quality, crop, field size, labour, cost, and maintenance; where drip is selected, protect it with clean water, correct design, and maintenance because plastic mulch and dry heat favour targeted delivery." },
          { id: "b", label: "Choose furrow automatically because familiarity removes all drainage, water-use, and crop-management risks." },
          { id: "c", label: "Install drip without checking debris, filtration, design, maintenance knowledge, labour, or whether the farmer can operate it." },
          { id: "d", label: "Use one irrigation system for every field without considering crop stage, water stress, topography, mulch, or farmer capacity." },
        ],
        correctOptionId: "a",
        feedback: {
          correct: "Correct. The recommendation compares systems with field and farmer evidence, recognises plastic-mulch conditions, and addresses the clean-water and maintenance requirements that make drip performance reliable.",
          incorrect: "System choice must combine agronomy and feasibility: assess land, water quality and supply, crop, mulch, system efficiency, labour, cost, skill, design, and maintenance before recommending an improvement.",
        },
      },
      {
        id: "final-26",
        prompt:
          "A new drip system wets plants close to the tank but lines at the far end remain dry. The water source is silty, filters are rarely cleaned, line ends are never flushed, and pressure is never measured. Which advisor response is most defensible?",
        options: [
          { id: "a", label: "Check pump and zone design, water quality and filtration, pressure and far-end flow, flush line ends, inspect emitters and soil wetting, repair leaks, and keep a maintenance record before changing the irrigation schedule." },
          { id: "b", label: "Increase the run time without inspecting filtration, pressure, clogs, far-end flow, leaks, or uneven wetting." },
          { id: "c", label: "Remove filters and leave the line ends closed permanently so debris remains in the system." },
          { id: "d", label: "Treat all maintenance chemicals as universal recipes without checking safety requirements, labels, water source, or equipment guidance." },
        ],
        correctOptionId: "a",
        feedback: {
          correct: "Correct. The plan investigates the full cause of nonuniform delivery and uses prevention-focused filtration, flushing, pressure, flow, wetting, leak, and record checks.",
          incorrect: "Correcting drip nonuniformity requires diagnostic checks from water source and pump capacity through filtration, pressure, far-end flow, emitters, leaks, and actual soil wetting—not simply longer run time.",
        },
      },
      {
        id: "final-27",
        prompt:
          "A grower has low soil potassium, applies large nitrogen doses throughout the crop cycle, and broadcasts the same fertiliser product at the same rate in every field. How should the advisor revise the plan?",
        options: [
          { id: "a", label: "Use soil NPK and pH evidence, crop uptake and removal, crop stage, root-zone conditions, and label analysis to correct the limiting factor and apply the right source, rate, time, and place with suitable placement." },
          { id: "b", label: "Increase nitrogen further because it will automatically resolve potassium limitation, soil constraints, and application inefficiency." },
          { id: "c", label: "Ignore the soil test and keep one universal schedule because crop stage and nutrient antagonism do not affect uptake." },
          { id: "d", label: "Choose fertiliser only by bag price and apply it without checking source quality, nutrient content, crop demand, root access, or loss pathways." },
        ],
        correctOptionId: "a",
        feedback: {
          correct: "Correct. The revision identifies the limiting condition and integrates soil, crop, source, rate, timing, placement, and root-zone evidence through the 4Rs.",
          incorrect: "A defensible fertilisation plan begins with soil and crop evidence, corrects the limiting factor, interprets nutrient analysis, and applies the right source, rate, time, and place rather than repeating a universal product schedule.",
        },
      },
      {
        id: "final-28",
        prompt:
          "A cucurbit field has vines crawling on wet soil, crowded canopy, low fruit set, deformed fruit, and damaged fruit touching the ground. Which integrated field-care response is most defensible?",
        options: [
          { id: "a", label: "Install or strengthen timely support, train vines with suitable materials, prune hygienically for airflow and access, assess flowers, pollinators, water, heat, density, and nutrient balance before manual pollination, and use fruit support to protect market quality." },
          { id: "b", label: "Delay trellising and training until vines block field access, then prune wet plants with dirty tools and leave cuttings below the crop." },
          { id: "c", label: "Apply more nitrogen immediately and assume it will correct every pollination, canopy, fruit-quality, and support problem." },
          { id: "d", label: "Hand-pollinate every flower without checking crop conditions, then leave fruit in contact with soil because support does not affect quality." },
        ],
        correctOptionId: "a",
        feedback: {
          correct: "Correct. The response connects crop support, hygienic canopy care, diagnostic pollination management, fruit support, and underlying water and nutrient conditions.",
          incorrect: "High-quality field care is integrated: support and train the crop early, prune hygienically, diagnose fruit-set constraints before manual pollination, protect fruit from soil contact, and manage water and nutrition alongside crop structure.",
        },
      },
      {
        id: "final-29",
        prompt:
          "A harvest team picks vegetables at an inconsistent maturity, drops produce into rough containers, leaves crates in direct sun and soil contact, mixes damaged produce with sound produce, and uses livestock-affected pond water for cleaning. Which corrective plan is most defensible?",
        options: [
          { id: "a", label: "Set crop- and market-specific maturity standards; harvest at an appropriate cool period; use clean sharp tools and food-grade containers; move produce to shade; sort out damage; select commodity-suitable cooling; and protect food safety through safe water, clean equipment, pre-harvest interval compliance, and separation from soil and animal contamination." },
          { id: "b", label: "Increase harvest speed while keeping the same maturity, rough handling, sun exposure, damaged-produce mixing, and unsafe water source." },
          { id: "c", label: "Rely on a later treatment to correct every field injury, contamination risk, maturity inconsistency, and heat-loading problem." },
          { id: "d", label: "Leave produce on soil until all picking is finished, then grade damaged and sound produce together for a uniform market class." },
        ],
        correctOptionId: "a",
        feedback: {
          correct: "Correct. The plan connects market-ready maturity, gentle harvest, shade, sorting, crop-suitable cooling, and food-safety controls across the complete post-harvest chain.",
          incorrect: "Post-harvest loss prevention is cumulative. Control maturity, timing, harvest injury, field heat, containers, sorting, cooling, water and equipment hygiene, pesticide intervals, and contamination risks from the start.",
        },
      },
      {
        id: "final-30",
        prompt:
          "A grower reports yellowing and stunting in patches after changing irrigation and applying a new chemical input. Which advisory response is most defensible?",
        options: [
          { id: "a", label: "Inspect affected parts, whole plants and roots, group patterns, severity, crop stage, water and chemical history, soil and climate context, and possible signs; compare biotic and abiotic causes, state uncertainty, apply IPM, seek support if needed, and set prevention and monitoring actions." },
          { id: "b", label: "Diagnose a virus from yellowing alone and recommend a product without checking roots, patterns, irrigation, chemical history, or legal requirements." },
          { id: "c", label: "Ignore the new irrigation and chemical history because field operations cannot influence plant symptoms." },
          { id: "d", label: "Apply the same intervention to every plant problem without considering severity, distribution, beneficial insects, mode of action, prevention, or feedback." },
        ],
        correctOptionId: "a",
        feedback: {
          correct: "Correct. The response uses the source’s field-diagnosis process of elimination, gathers evidence at plant and field scales, compares cause categories, and links a qualified diagnosis to IPM and prevention.",
          incorrect: "Yellowing and stunting have multiple possible causes. Gather plant, root, field-pattern, history, water, input, soil, climate, and symptom-sign evidence before making an IPM-aligned, legally compliant, and preventively useful recommendation.",
        },
      },
      {
        id: "final-31",
        prompt:
          "A crop has spreading wilt and leaf spots during persistent wet conditions. The grower wants to select a product immediately. Which response best reflects an evidence-led disease-management plan?",
        options: [
          { id: "a", label: "Scout symptoms, signs, roots, incidence, patterns, crop and water history, and abiotic look-alikes; identify the likely cause category with support or testing when needed; then combine sanitation, drainage and canopy management, clean material, rotation or resistance where suitable, IPM, and only legally registered label-directed crop protection if justified." },
          { id: "b", label: "Assume every wet-weather wilt and spot is identical, ignore diagnosis and prevention, and apply any available product without checking crop registration or label requirements." },
          { id: "c", label: "Keep infected debris, work in wet crops with uncleaned tools, and rely on a later treatment to reverse every spread pathway." },
          { id: "d", label: "Treat viral, bacterial, fungal, water-mould, nematode, and abiotic problems exactly the same because cause category does not affect prevention or management." },
        ],
        correctOptionId: "a",
        feedback: {
          correct: "Correct. The response verifies the cause category, manages wet-condition disease drivers and spread pathways, uses prevention and IPM, and treats legal label-directed crop protection as one justified component rather than the whole plan.",
          incorrect: "Disease management starts with a qualified diagnosis. Use symptoms, signs, pattern, field context, and support or testing to identify likely causes, then integrate prevention, sanitation, water and canopy management, resistant material, rotation, IPM, and lawful label-directed action where justified.",
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
