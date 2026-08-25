import TrainingShell from "@/components/TrainingShell";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/_core/hooks/useAuth";
import { startLogin } from "@/const";
import { trpc } from "@/lib/trpc";
import { annotationLabelOptions, cropDiagnosisAnnotationCases, type AnnotationLabel } from "@shared/cropDiagnosisAnnotation";
import { ArrowLeft, CheckCircle2, CircleHelp, Eye, ImageOff, MapPin, MessageSquareText, RotateCcw, Search, ShieldAlert, Tags, UserRoundCheck, X } from "lucide-react";
import { useMemo, useState, type MouseEvent } from "react";
import { toast } from "sonner";
import { useLocation } from "wouter";

type Pin = { id: number; x: number; y: number; label: AnnotationLabel };
type PinsByCase = Record<string, Pin[]>;
type Answers = Record<string, string>;

function reviewStatusLabel(status: "submitted" | "reviewed" | "revision_requested") {
  return status === "reviewed" ? "Supervisor feedback received" : status === "revision_requested" ? "Revision requested" : "Awaiting supervisor feedback";
}

export default function CropDiagnosisAnnotation() {
  const [, setLocation] = useLocation();
  const [caseIndex, setCaseIndex] = useState(0);
  const [activeLabel, setActiveLabel] = useState<AnnotationLabel>("field-pattern");
  const [pinsByCase, setPinsByCase] = useState<PinsByCase>({});
  const [answers, setAnswers] = useState<Answers>({});
  const [imageFailed, setImageFailed] = useState<Record<string, boolean>>({});
  const [submitted, setSubmitted] = useState(false);
  const [reviewRationale, setReviewRationale] = useState("");
  const { isAuthenticated, user } = useAuth();
  const utils = trpc.useUtils();
  const myReviewsQuery = trpc.annotationReviews.mine.useQuery(undefined, { enabled: isAuthenticated });
  const submitForSupervisorReview = trpc.annotationReviews.submit.useMutation({
    onSuccess: async () => {
      await utils.annotationReviews.mine.invalidate();
      setReviewRationale("");
      toast.success("Supervisor review requested", { description: "Your evidence pins, chosen next steps, and rationale are now available to course supervisors." });
    },
    onError: error => toast.error("Unable to request supervisor review", { description: error.message }),
  });
  const currentCase = cropDiagnosisAnnotationCases[caseIndex];
  const currentPins = pinsByCase[currentCase.id] ?? [];

  const annotationComplete = useMemo(
    () => cropDiagnosisAnnotationCases.every(caseItem =>
      caseItem.requiredLabels.every(label => (pinsByCase[caseItem.id] ?? []).some(pin => pin.label === label))
    ),
    [pinsByCase]
  );
  const allQuestionsAnswered = cropDiagnosisAnnotationCases.every(caseItem => Boolean(answers[caseItem.id]));
  const correctCount = cropDiagnosisAnnotationCases.filter(caseItem => answers[caseItem.id] === caseItem.correctOptionId).length;

  function addPin(event: MouseEvent<HTMLDivElement>) {
    if (imageFailed[currentCase.id]) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const x = Math.max(2, Math.min(98, ((event.clientX - rect.left) / rect.width) * 100));
    const y = Math.max(2, Math.min(98, ((event.clientY - rect.top) / rect.height) * 100));
    setPinsByCase(previous => ({
      ...previous,
      [currentCase.id]: [
        ...(previous[currentCase.id] ?? []),
        { id: Date.now() + currentPins.length, x, y, label: activeLabel },
      ],
    }));
    setSubmitted(false);
  }

  function removePin(id: number) {
    setPinsByCase(previous => ({
      ...previous,
      [currentCase.id]: (previous[currentCase.id] ?? []).filter(pin => pin.id !== id),
    }));
    setSubmitted(false);
  }

  function restart() {
    setCaseIndex(0);
    setPinsByCase({});
    setAnswers({});
    setReviewRationale("");
    setSubmitted(false);
  }

  function requestSupervisorReview() {
    if (!isAuthenticated) return startLogin();
    submitForSupervisorReview.mutate({
      rationale: reviewRationale,
      cases: cropDiagnosisAnnotationCases.map(caseItem => ({
        caseId: caseItem.id,
        answer: answers[caseItem.id] ?? "",
        pins: (pinsByCase[caseItem.id] ?? []).map(pin => ({ x: pin.x, y: pin.y, label: pin.label })),
      })),
    });
  }

  return (
    <TrainingShell wide>
      <main className="mx-auto max-w-7xl px-5 py-7 sm:px-8 lg:py-10">
        <button type="button" onClick={() => setLocation("/field-readiness")} className="inline-flex items-center gap-1 text-xs font-bold text-[#69806d] hover:text-[#1f4a37]">
          <ArrowLeft className="h-3.5 w-3.5" />Field Readiness Portfolio
        </button>
        <header className="mt-5 rounded-[28px] border border-[#d3e2da] bg-[#263f36] px-6 py-8 text-[#f5faf5] sm:px-9">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#b9d3c1]">Crop-diagnosis photo annotation</p>
          <h1 className="mt-3 max-w-4xl font-serif text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">See the clue. Mark the uncertainty. Choose the safe next step.</h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-[#d7e8dc]">These are simulated visual-evidence cases, not diagnostic photographs. Place labelled pins on visible clues, then practise the evidence and next-step judgement that should accompany a real field observation.</p>
          {user?.role === "admin" && <Button variant="outline" onClick={() => setLocation("/supervisor/annotation-reviews")} className="mt-5 rounded-full border-white/30 bg-white/10 text-xs font-bold text-white hover:bg-white/20 hover:text-white"><UserRoundCheck className="mr-1.5 h-3.5 w-3.5" />Open supervisor review queue</Button>}
        </header>

        {!submitted ? (
          <div className="mt-6 grid gap-6 lg:grid-cols-[.72fr_1.28fr]">
            <aside className="rounded-[24px] border border-[#d8e6d9] bg-[#fbfdf9] p-5">
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#68806b]">Visual cases</p>
              <div className="mt-4 space-y-2">
                {cropDiagnosisAnnotationCases.map((caseItem, index) => {
                  const casePins = pinsByCase[caseItem.id] ?? [];
                  const complete = caseItem.requiredLabels.every(label => casePins.some(pin => pin.label === label));
                  return (
                    <button key={caseItem.id} type="button" onClick={() => setCaseIndex(index)} className={`w-full rounded-xl border p-4 text-left transition-colors ${index === caseIndex ? "border-[#588b70] bg-[#edf7ee]" : "border-[#e0e9df] bg-white hover:bg-[#f5faf4]"}`}>
                      <div className="flex items-center justify-between gap-3"><p className="text-sm font-bold text-[#2f4b35]">{caseItem.title}</p>{complete ? <CheckCircle2 className="h-4 w-4 text-[#37774c]" /> : <Eye className="h-4 w-4 text-[#87a18b]" />}</div>
                      <p className="mt-1 text-xs leading-5 text-[#66806b]">{caseItem.focus}</p>
                    </button>
                  );
                })}
              </div>
              <div className="mt-6 rounded-xl border border-[#efe1c7] bg-[#fffaf0] p-4">
                <ShieldAlert className="h-4 w-4 text-[#a77a38]" />
                <p className="mt-2 text-xs font-bold text-[#7d6339]">Evidence boundary</p>
                <p className="mt-1 text-xs leading-5 text-[#806c4d]">A pin shows what you noticed, not a confirmed cause. Describe what is visible and retain the evidence needed to test competing explanations.</p>
              </div>
            </aside>

            <section className="rounded-[24px] border border-[#d8e6d9] bg-white p-5 sm:p-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div><p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#63826b]">{currentCase.title}</p><h2 className="mt-2 font-serif text-2xl font-semibold text-[#2f4b35]">{currentCase.focus}</h2></div>
                <div className="rounded-full bg-[#eff7ed] px-3 py-1.5 text-xs font-bold text-[#46734f]">{currentPins.length} pin{currentPins.length === 1 ? "" : "s"} placed</div>
              </div>
              <p className="mt-3 rounded-xl bg-[#fff9ed] p-3 text-xs leading-5 text-[#806642]"><CircleHelp className="mr-1 inline h-3.5 w-3.5" />{currentCase.visualWarning}</p>
              <p className="mt-3 text-xs leading-5 text-[#58705d]"><strong>To complete this case:</strong> mark {currentCase.requiredLabels.map(label => annotationLabelOptions.find(option => option.id === label)?.label).join(", ")}, then answer the evidence question.</p>

              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <label className="text-xs font-bold text-[#46634d]">Annotation label
                  <select value={activeLabel} onChange={event => setActiveLabel(event.target.value as AnnotationLabel)} className="mt-2 block w-full rounded-xl border border-[#bfd4c0] bg-white px-3 py-2 text-sm font-medium text-[#334e39] focus:outline-none focus:ring-2 focus:ring-[#579067]">
                    {annotationLabelOptions.map(option => <option key={option.id} value={option.id}>{option.label}</option>)}
                  </select>
                </label>
                <div className="rounded-xl bg-[#eef7f0] p-3 text-xs leading-5 text-[#52725a]"><Tags className="mr-1 inline h-3.5 w-3.5" />Click the photograph to place a pin. Use the annotation list below to remove a misplaced pin.</div>
              </div>

              <div onClick={addPin} className="relative mt-5 aspect-[4/3] cursor-crosshair overflow-hidden rounded-2xl border border-[#c7dacf] bg-[#eff5ef]">
                {!imageFailed[currentCase.id] ? (
                  <img src={currentCase.imageSrc} alt={currentCase.alt} onError={() => setImageFailed(previous => ({ ...previous, [currentCase.id]: true }))} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full flex-col items-center justify-center p-6 text-center"><ImageOff className="h-8 w-8 text-[#6f8a75]" /><p className="mt-3 text-sm font-bold text-[#45614c]">Visual case unavailable</p><p className="mt-2 max-w-sm text-xs leading-5 text-[#617765]">Use the evidence prompt and return after the image connection is restored.</p></div>
                )}
                {currentPins.map((pin, index) => (
                  <button key={pin.id} type="button" onClick={event => { event.stopPropagation(); removePin(pin.id); }} title="Remove annotation" className="absolute flex h-6 w-6 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-white bg-[#246b59] text-[10px] font-bold text-white shadow-md" style={{ left: `${pin.x}%`, top: `${pin.y}%` }}>{index + 1}</button>
                ))}
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {currentPins.length ? currentPins.map((pin, index) => (
                  <button key={pin.id} type="button" onClick={() => removePin(pin.id)} className="inline-flex items-center gap-1 rounded-full border border-[#c8dbcb] bg-[#f6faf5] px-3 py-1.5 text-[11px] font-bold text-[#46694d] hover:bg-[#edf6ed]"><MapPin className="h-3 w-3" />{index + 1}. {annotationLabelOptions.find(option => option.id === pin.label)?.label}<X className="ml-1 h-3 w-3" /></button>
                )) : <p className="text-xs text-[#718473]">Place a pin for each visible evidence category you can support.</p>}
              </div>

              <div className="mt-6 rounded-2xl border border-[#dce9dd] bg-[#f9fcf8] p-5">
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#66806b]">Evidence question</p>
                <p className="mt-2 text-sm font-bold leading-6 text-[#315039]">{currentCase.prompt}</p>
                <div className="mt-4 space-y-2">
                  {currentCase.options.map(option => (
                    <label key={option.id} className={`flex cursor-pointer gap-3 rounded-xl border p-3 text-sm leading-5 transition-colors ${answers[currentCase.id] === option.id ? "border-[#57906a] bg-[#eff8ef]" : "border-[#dce8dc] bg-white hover:bg-[#f4faf4]"}`}>
                      <input type="radio" name={currentCase.id} value={option.id} checked={answers[currentCase.id] === option.id} onChange={() => { setAnswers(previous => ({ ...previous, [currentCase.id]: option.id })); setSubmitted(false); }} className="mt-1 accent-[#397d50]" />
                      <span>{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
                <Button variant="outline" onClick={() => { setPinsByCase(previous => ({ ...previous, [currentCase.id]: [] })); setSubmitted(false); }} className="rounded-full text-xs font-bold"><RotateCcw className="mr-2 h-3.5 w-3.5" />Clear this case</Button>
                {caseIndex < cropDiagnosisAnnotationCases.length - 1 ? <Button onClick={() => setCaseIndex(index => index + 1)} className="rounded-full bg-[#356c48] text-xs font-bold hover:bg-[#27583a]">Next visual case</Button> : <Button disabled={!annotationComplete || !allQuestionsAnswered} onClick={() => setSubmitted(true)} className="rounded-full bg-[#356c48] text-xs font-bold hover:bg-[#27583a]">Review evidence practice</Button>}
              </div>
            </section>
          </div>
        ) : (
          <section className="mx-auto mt-8 max-w-4xl rounded-[28px] border border-[#d2e4d3] bg-[#fbfdf9] p-6 sm:p-9">
            <div className="flex items-start gap-4"><div className="rounded-2xl bg-[#e7f4e8] p-3"><CheckCircle2 className="h-7 w-7 text-[#397a4d]" /></div><div><p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#5c8063]">Evidence practice reviewed</p><h2 className="mt-2 font-serif text-3xl font-semibold text-[#2d4b35]">{correctCount} of {cropDiagnosisAnnotationCases.length} evidence decisions selected safely</h2><p className="mt-3 text-sm leading-6 text-[#59715e]">All required annotation categories were placed. This checks evidence selection and safe next-step reasoning; it does not certify visual diagnosis.</p></div></div>
            <div className="mt-7 space-y-4">
              {cropDiagnosisAnnotationCases.map(caseItem => (
                <article key={caseItem.id} className="rounded-2xl border border-[#dce8dc] bg-white p-5"><div className="flex gap-3"><Search className="mt-0.5 h-4 w-4 shrink-0 text-[#4f8660]" /><div><p className="font-serif text-lg font-semibold text-[#34543c]">{caseItem.title}</p><p className="mt-2 text-sm leading-6 text-[#58705d]">{answers[caseItem.id] === caseItem.correctOptionId ? "Your selected next step protects evidence quality. " : "Review the safer evidence-led response. "}{caseItem.feedback}</p><p className="mt-3 rounded-xl bg-[#f1f8f0] p-3 text-xs leading-5 text-[#4c6d53]"><strong>Safe next step:</strong> {caseItem.safeNextStep}</p></div></div></article>
              ))}
            </div>
            <section className="mt-7 rounded-2xl border border-[#d7e6d8] bg-[#f2f8f1] p-5"><div className="flex items-start gap-3"><MessageSquareText className="mt-0.5 h-5 w-5 shrink-0 text-[#467b54]" /><div><p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#5d7f63]">Optional supervisor review</p><h3 className="mt-2 font-serif text-xl font-semibold text-[#31503a]">Request feedback on your reasoning</h3><p className="mt-2 text-xs leading-5 text-[#5c725f]">A supervisor will see this completed exercise, your evidence pins, selected next steps, and your rationale. Review feedback is private and does not affect course progression, assessment scores, certification, or owner alerts.</p></div></div><label className="mt-5 block text-xs font-bold text-[#45624b]">Evidence-to-judgment rationale <span className="font-normal text-[#718471]">(minimum 80 characters)</span><Textarea value={reviewRationale} onChange={event => setReviewRationale(event.target.value)} maxLength={4000} rows={5} className="mt-2 bg-white text-sm" placeholder="Describe the evidence you would verify in the field, the uncertainty you retained, and the recheck or referral condition that protects the next decision." /></label><div className="mt-3 flex flex-wrap items-center justify-between gap-3"><p className="text-[11px] text-[#6c816e]">{reviewRationale.trim().length}/80 minimum characters</p><Button disabled={isAuthenticated ? reviewRationale.trim().length < 80 || submitForSupervisorReview.isPending : false} onClick={requestSupervisorReview} className="rounded-full bg-[#356c48] text-xs font-bold hover:bg-[#27583a]"><UserRoundCheck className="mr-1.5 h-3.5 w-3.5" />{!isAuthenticated ? "Sign in to request review" : submitForSupervisorReview.isPending ? "Sending request" : "Request supervisor review"}</Button></div></section>
            {isAuthenticated && <section className="mt-5 rounded-2xl border border-[#e0e9de] bg-white p-5"><p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#66806b]">My review requests</p>{myReviewsQuery.isLoading ? <p className="mt-3 text-xs text-[#728274]">Loading your private review status…</p> : myReviewsQuery.isError ? <Button variant="ghost" onClick={() => myReviewsQuery.refetch()} className="mt-3 h-auto p-0 text-xs font-bold text-[#9a593d] hover:bg-transparent">Retry loading review status</Button> : myReviewsQuery.data?.length ? <div className="mt-3 space-y-3">{myReviewsQuery.data.map(review => <article key={review.id} className="rounded-xl border border-[#e1e9df] bg-[#fbfdf9] p-4"><div className="flex flex-wrap items-center justify-between gap-2"><p className="text-xs font-bold text-[#3e5d45]">{reviewStatusLabel(review.status)}</p><p className="text-[10px] text-[#768477]">Requested {new Date(review.submittedAt).toLocaleDateString()}</p></div>{review.feedback ? <div className="mt-3 border-t border-[#e3ebe0] pt-3"><p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#68826b]">{review.supervisorName || "Course supervisor"}</p><p className="mt-1 text-xs leading-5 text-[#536653]">{review.feedback}</p></div> : <p className="mt-2 text-xs leading-5 text-[#647765]">Your request is visible only to authorised course supervisors until feedback is added.</p>}</article>)}</div> : <p className="mt-3 text-xs leading-5 text-[#718071]">No supervisor review requests yet.</p>}</section>}
            <div className="mt-7 flex flex-wrap gap-3"><Button onClick={restart} className="rounded-full bg-[#356c48] text-xs font-bold hover:bg-[#27583a]"><RotateCcw className="mr-2 h-3.5 w-3.5" />Practise again</Button><Button variant="outline" onClick={() => setLocation("/scouting-protocol")} className="rounded-full text-xs font-bold">Open scouting protocol</Button></div>
          </section>
        )}
      </main>
    </TrainingShell>
  );
}
