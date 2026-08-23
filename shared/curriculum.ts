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
  duration: "Approx. 9 hours",
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
  ],
  finalAssessment: {
    id: "crop-advisor-final",
    title: "Crop Advisor Foundations final assessment",
    description:
      "Integrate advisory practice, soil context, crop observation, vegetable-production planning, cost-based decision-making, crop-and-variety selection, crop-yield factors, and climatic-risk management to qualify for certification.",
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
