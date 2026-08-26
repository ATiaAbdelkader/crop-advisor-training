export const learningEnhancementBoundary = "These learning tools are voluntary practice and access supports. They do not change formal assessment scores, the 80% pass rule, sequential gates, competency scoring, certification, or owner alerts. High-consequence decisions remain subject to current labels, authorised channels, laboratory, extension, or specialist referral." as const;

export const adaptivePracticeCycle = [
  { key: "recall", label: "1. Recall", detail: "State the field question, observation method, and safety boundary from memory before reopening the learning material." },
  { key: "compare", label: "2. Compare", detail: "Compare your first reasoning with the evidence standard, feedback, or scenario rationale; identify one missing observation or uncertainty." },
  { key: "rehearse", label: "3. Rehearse", detail: "Use a field card, record, or scenario to practise a revised evidence-to-decision sequence and set a review trigger." },
] as const;

export const offlineFieldCardPack = [
  { title: "Observe and compare", detail: "Set the question, compare affected and unaffected areas, map the pattern, and record uncertainty.", href: "/course/crop-observation" },
  { title: "Soil and root-zone check", detail: "Use a representative zone, inspect roots and moisture, record conditions, and refer uncertain interpretations.", href: "/measurements?card=soil-sampling" },
  { title: "Water-path check", detail: "Trace source, filter, pressure, delivery, wetting pattern, and the next maintenance review.", href: "/measurements?card=drip-uniformity" },
  { title: "Nutrient decision evidence", detail: "Confirm sample context, crop stage, soil-water conditions, and current authorised information before an input discussion.", href: "/measurements?card=nutrient-plan" },
  { title: "Nursery readiness", detail: "Check roots, plant form, uniformity, tray or bed condition, and a hold or field-readiness decision.", href: "/nursery-quality" },
  { title: "Scout, record, recheck", detail: "Use a repeatable sample route, retain beneficial evidence, map pattern, and set a recheck or referral trigger.", href: "/scouting-sheet" },
] as const;

export const multilingualFieldCues = {
  english: { label: "English", direction: "ltr", phrases: ["Observe", "Compare", "Record", "Decide", "Review or refer"] },
  french: { label: "Français", direction: "ltr", phrases: ["Observer", "Comparer", "Enregistrer", "Décider", "Réexaminer ou orienter"] },
  arabic: { label: "العربية", direction: "rtl", phrases: ["راقب", "قارن", "سجّل", "قرّر", "راجع أو أحِل"] },
} as const;

export const visualCaptionTranslations: Readonly<Record<string, { french: string; arabic: string }>> = {
  "soil-degradation-and-management": { french: "Lire ensemble la couverture du sol, la pente, les écoulements et l’état du champ avant de choisir une réponse adaptée au site.", arabic: "اقرأ غطاء التربة والانحدار ومسارات الجريان وحالة الحقل معاً قبل اختيار استجابة مناسبة للموقع." },
  "nutrients-required-in-plant-nutrition": { french: "Relier la croissance de la plante entière aux racines, à l’eau, au stade de culture et aux conditions du champ plutôt qu’à un seul symptôme.", arabic: "اربط نمو النبات كاملاً بالجذور والماء ومرحلة المحصول وظروف الحقل بدلاً من الاعتماد على عرض واحد." },
  "nutrient-management": { french: "Utiliser des preuves représentatives, le contexte de l’exploitation et un plan révisable pour discuter des décisions de nutrition.", arabic: "استخدم أدلة ممثلة وسياق المزرعة وخطة قابلة للمراجعة عند مناقشة قرارات التغذية." },
  "acid-soil-causes-and-management": { french: "Commencer par un échantillonnage représentatif et le contexte du champ; un résultat de sol informe une décision mais ne la prescrit pas seul.", arabic: "ابدأ بعينة ممثلة وسياق الحقل؛ نتيجة التربة تساعد في القرار لكنها لا تفرض قراراً بمفردها." },
  "how-to-promote-soil-health": { french: "Observer ensemble la structure du sol, les racines, la couverture et l’historique de gestion pour évaluer les pratiques de santé du sol.", arabic: "راقب بنية التربة والجذور والغطاء وسجل الإدارة معاً عند تقييم ممارسات صحة التربة." },
  "collect-soil-samples-for-soil-testing": { french: "Une analyse de sol utile commence par un échantillon propre et représentatif correspondant à la zone et à la question de gestion.", arabic: "يبدأ اختبار التربة المفيد بعينة نظيفة وممثلة تناسب منطقة الحقل وسؤال الإدارة." },
  "nursery-for-vegetable-production": { french: "Examiner les racines, la forme, l’uniformité et les conditions de pépinière avant de décider si un lot est prêt pour le champ.", arabic: "افحص الجذور وشكل النبات والتجانس وظروف المشتل قبل تحديد جاهزية الدفعة للحقل." },
  "open-field-seedling-production": { french: "Réunir l’espacement, l’état des planches, le drainage, la lumière et l’observation régulière dans la production de plants en plein champ.", arabic: "اجمع بين التباعد وحالة الأحواض والصرف والضوء والملاحظة المنتظمة في إنتاج الشتلات بالحقل المفتوح." },
  "protective-and-cellular-seedling-production": { french: "Une pépinière protégée est un système lié: espace propre, lumière, drainage, circulation d’air et barrières d’exclusion.", arabic: "المشتل المحمي نظام مترابط: مساحة نظيفة وضوء وصرف وتهوية وحواجز استبعاد." },
  "seedling-production-planning": { french: "Planifier les lots, le calendrier du champ, les vérifications de préparation et les enregistrements pour soutenir une implantation fiable.", arabic: "خطط للدفعات وتوقيت الحقل وفحوصات الجاهزية والسجلات لدعم تأسيس موثوق للمحصول." },
};

export const capstoneCaseConferenceGuide = [
  { title: "Show the field evidence", prompt: "Present the mapped pattern, comparison observation, records, and the evidence that remains missing." },
  { title: "Explain the decision and uncertainty", prompt: "State the safest current decision, what it does not claim, and the condition that would revise it." },
  { title: "Connect people and enterprise", prompt: "Explain how the decision affects labour, timing, quality, cost exposure, grower communication, or traceability." },
  { title: "Agree a recheck or referral", prompt: "Name the next record, follow-up date or trigger, and the authorised source or specialist needed when uncertainty remains." },
] as const;

export const supervisorCalibrationCases = [
  { title: "Comparable evidence check", detail: "Before scoring, compare two evidence records against the same module criterion; document why the anchor applies rather than inferring field work that was not recorded." },
  { title: "Access-aware review", detail: "Separate field evidence from writing polish, confidence, language, or equipment access. Identify a realistic next evidence action instead of lowering or raising a score for presentation style." },
  { title: "Safe boundary check", detail: "Confirm that feedback preserves uncertainty and referral boundaries; do not turn developmental scoring into a product, rate, diagnosis, medical, cleanup, disposal, legal, or local-regulatory instruction." },
] as const;
