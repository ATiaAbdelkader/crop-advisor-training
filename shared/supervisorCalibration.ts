export const supervisorCalibrationGuide = {
  title: "Supervisor calibration guide",
  purpose: "Support consistent developmental scoring of learner evidence across Prepare, Perform, and Review and refer without changing formal course progression.",
  anchors: [
    { level: "Prepare", notYet: "The evidence does not yet frame a task, method, evidence need, or safety condition clearly enough to assess.", developing: "The learner identifies part of the task and evidence plan but leaves a material condition, method, or safety boundary unclear.", demonstrated: "The learner frames a context-fit task, suitable method, required evidence, and a relevant safety or authority condition." },
    { level: "Perform", notYet: "The submission does not show the stated field task or relies on unsupported assertion rather than traceable evidence.", developing: "The learner completes a relevant task but evidence, comparison, record detail, or decision sequence remains incomplete.", demonstrated: "The learner completes the field task or decision sequence with traceable evidence appropriate to the module criteria." },
    { level: "Review and refer", notYet: "No credible recheck, uncertainty statement, or escalation boundary is supplied.", developing: "A recheck or uncertainty statement appears, but the trigger or authority boundary is not sufficiently specific.", demonstrated: "The learner names a practical follow-up indicator, states uncertainty, and identifies when to revise, stop, or use authorised support." },
  ],
  process: [
    "Read the module competency, performance task, evidence standard, and three criteria before reading the learner narrative.",
    "Score each level independently from submitted evidence; do not infer unrecorded field work or use formal quiz results as a substitute for performance evidence.",
    "Write feedback naming one demonstrated strength, one material evidence gap, and one realistic next evidence or review action.",
    "Request revision when evidence can be strengthened; do not present the request as a formal assessment failure.",
  ],
  safeguards: [
    "Use the same module criteria and score anchors for comparable evidence. If two supervisors would reasonably differ, document the evidence basis and discuss the anchor before finalising.",
    "Separate a learner’s writing style, access to equipment, or confidence from the actual evidence shown. Score the stated competency, not personal characteristics.",
    "Do not turn a score into a diagnosis, product selection, rate, medical response, cleanup instruction, legal advice, or local regulatory claim. Preserve current label-led, authorised, laboratory, extension, or specialist referral boundaries.",
  ],
} as const;
