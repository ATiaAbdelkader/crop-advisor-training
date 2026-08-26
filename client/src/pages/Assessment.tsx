import { useAuth } from "@/_core/hooks/useAuth";
import LearnerLoading from "@/components/LearnerLoading";
import TrainingShell from "@/components/TrainingShell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { trpc } from "@/lib/trpc";
import { startLogin } from "@/const";
import { getAssessmentById, getModuleForAssessment } from "@shared/curriculum";
import { appliedScenarioByModuleId } from "@shared/appliedScenarios";
import { moduleCompetencyByModuleId } from "@shared/competencyFramework";
import { Award, CheckCircle2, ChevronLeft, ChevronRight, CircleAlert, Clock3, LockKeyhole, RotateCcw, Target } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { useLocation, useParams } from "wouter";
import { formatTimedQuizDuration, formatTimedQuizMinutes, getTimedQuizLimitSeconds, timedQuizBoundary } from "@shared/timedAssessments";

type TimedQuizSession = {
  id: number;
  startedAt: Date | string;
  expiresAt: Date | string;
  timeLimitSeconds: number;
};

export default function Assessment() {
  const { assessmentId } = useParams<{ assessmentId: string }>();
  const assessment = getAssessmentById(assessmentId);
  const { isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const utils = trpc.useUtils();
  const overviewQuery = trpc.training.overview.useQuery(undefined, { enabled: isAuthenticated });
  const overview = overviewQuery.data;
  const timingQuery = trpc.training.assessmentTimeLimit.useQuery({ assessmentId: assessmentId ?? "unknown-assessment" }, { enabled: isAuthenticated && Boolean(assessmentId) && Boolean(overview?.availableAssessmentIds.includes(assessmentId ?? "")) });
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [timedSession, setTimedSession] = useState<TimedQuizSession | null>(null);
  const [remainingSeconds, setRemainingSeconds] = useState<number | null>(null);
  const [timedOut, setTimedOut] = useState(false);
  const expirySubmissionId = useRef<number | null>(null);
  const [result, setResult] = useState<{
    score: number;
    passed: boolean;
    correctCount: number;
    totalQuestions: number;
    results: { questionId: string; correct: boolean; feedback: string }[];
    overview: { nextAction: { href: string; title: string } };
    certificate: { credentialId: string } | null;
    ownerNotified: boolean;
  } | null>(null);
  const submit = trpc.training.submitAssessment.useMutation({
    onSuccess: async response => {
      setResult(response);
      await utils.training.overview.invalidate();
      if (response.passed) {
        toast.success(response.certificate ? "Certification earned" : "Assessment passed", { description: response.certificate ? "Your credential is now available to download." : "The next requirement is now unlocked." });
      } else {
        toast.message("Assessment complete", { description: "Review the feedback, then retake when ready." });
      }
    },
    onError: error => {
      if (error.data?.code === "PRECONDITION_FAILED") {
        setTimedSession(null);
        setRemainingSeconds(null);
        setTimedOut(false);
        expirySubmissionId.current = null;
        toast.message("Timed attempt ended", { description: "The server did not accept this session. Begin a new timed attempt when you are ready." });
        return;
      }
      toast.error("Unable to submit assessment", { description: error.message });
    },
  });
  const startTimedAssessment = trpc.training.startTimedAssessment.useMutation({
    onSuccess: session => {
      setTimedSession(session);
      setRemainingSeconds(Math.max(0, Math.ceil((new Date(session.expiresAt).getTime() - Date.now()) / 1000)));
      setTimedOut(false);
      expirySubmissionId.current = null;
    },
    onError: error => toast.error("Unable to begin timed check", { description: error.message }),
  });

  useEffect(() => {
    if (!timedSession || result) return;
    const updateRemainingTime = () => {
      const seconds = Math.max(0, Math.ceil((new Date(timedSession.expiresAt).getTime() - Date.now()) / 1000));
      setRemainingSeconds(seconds);
      if (seconds === 0) setTimedOut(true);
    };
    updateRemainingTime();
    const interval = window.setInterval(updateRemainingTime, 1000);
    return () => window.clearInterval(interval);
  }, [timedSession, result]);

  useEffect(() => {
    if (!timedOut || !timedSession || result || submit.isPending || expirySubmissionId.current === timedSession.id) return;
    expirySubmissionId.current = timedSession.id;
    toast.message("Time is up", { description: "Your completed responses are being submitted for scoring." });
    if (!assessment) return;
    submit.mutate({ assessmentId: assessment.id, timedSessionId: timedSession.id, answers });
  }, [timedOut, timedSession, result, submit.isPending, assessment, answers]);

  if (!assessment) {
    return <TrainingShell><main className="mx-auto max-w-xl px-5 py-24 text-center"><p className="font-serif text-3xl font-semibold">Assessment not found</p><Button onClick={() => setLocation("/dashboard")} className="mt-6 rounded-full bg-[#315f47]">Return to dashboard</Button></main></TrainingShell>;
  }

  if (isAuthenticated && overviewQuery.isLoading) {
    return <TrainingShell><LearnerLoading message="Checking assessment eligibility" /></TrainingShell>;
  }

  const accessible = overview?.availableAssessmentIds.includes(assessment.id) ?? false;
  const canSubmit = assessment.questions.every(question => answers[question.id]);
  const sourceModule = getModuleForAssessment(assessment.id);
  const remediationScenario = sourceModule ? appliedScenarioByModuleId[sourceModule.id] : undefined;
  const moduleCompetency = sourceModule ? moduleCompetencyByModuleId[sourceModule.id] : undefined;
  const returnPath = assessment.kind === "final" ? "/dashboard" : `/course/${sourceModule?.id ?? "advisory-practice"}`;
  const timeLimitSeconds = timingQuery.data?.timeLimitSeconds ?? getTimedQuizLimitSeconds(assessment);

  const handleSubmit = (fromExpiry = false) => {
    if (!isAuthenticated) return startLogin();
    if (!timedSession) {
      toast.message("Begin the timed quiz first", { description: "The time limit starts only after you choose to begin." });
      return;
    }
    if (!fromExpiry && !canSubmit) {
      toast.message("Complete every question", { description: "Choose one response for each item before submitting." });
      return;
    }
    submit.mutate({ assessmentId: assessment.id, timedSessionId: timedSession.id, answers });
  };

  return (
    <TrainingShell>
      <main className="mx-auto max-w-[970px] px-5 py-8 sm:px-8 lg:py-12">
        <button type="button" onClick={() => setLocation(returnPath)} className="mb-6 inline-flex items-center gap-1 text-xs font-bold text-[#69806d] transition-colors hover:text-[#1f4a37]"><ChevronLeft className="h-3.5 w-3.5" />Return to learning</button>
        <div className="overflow-hidden rounded-[26px] border border-[#dce5d7] bg-[#fcfcf8] shadow-[0_16px_38px_rgba(39,67,47,.07)]">
          <div className="border-b border-[#e1e8dd] bg-[#eef4e9] px-6 py-7 sm:px-10 sm:py-9">
            <div className="flex flex-wrap items-center justify-between gap-3"><Badge className="border-0 bg-[#dcebd7] px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-[#356146] hover:bg-[#dcebd7]">{assessment.kind === "final" ? "Final assessment" : "Module assessment"}</Badge><div className="flex flex-wrap items-center gap-3"><span className="inline-flex items-center gap-2 text-xs font-bold text-[#527055]"><Target className="h-3.5 w-3.5" />Pass mark {assessment.passMark}%</span><span className="inline-flex items-center gap-2 text-xs font-bold text-[#527055]"><Clock3 className="h-3.5 w-3.5" />{timingQuery.isLoading ? "Checking time" : formatTimedQuizMinutes(timeLimitSeconds)}</span></div></div>
            <h1 className="mt-5 font-serif text-3xl font-semibold tracking-[-0.045em] text-[#273c2e] sm:text-[38px]">{assessment.title}</h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-[#5d715f]">{assessment.description} Each response is scored on submission, with applied feedback for any answer that needs review.</p>
            {moduleCompetency && <div className="mt-5 max-w-3xl rounded-xl border border-[#cfe0cd] bg-white/60 p-4"><p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#55745c]">Competency this check supports</p><p className="mt-2 text-sm font-semibold leading-6 text-[#36513c]">{moduleCompetency.competencyStatement}</p><p className="mt-2 text-xs leading-5 text-[#5c705e]">The 80% check confirms the formal knowledge requirement. Build field-readiness evidence through this module’s performance task, criteria, and review pathway.</p></div>}
          </div>

          {!isAuthenticated || (!overviewQuery.isLoading && !accessible && !result) ? (
            <div className="px-6 py-12 text-center sm:px-10"><span className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-[#f2eee3] text-[#a17a39]"><LockKeyhole className="h-5 w-5" /></span><h2 className="mt-5 font-serif text-2xl font-semibold text-[#304434]">This assessment is gated</h2><p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[#6b796b]">{isAuthenticated ? "Complete the required lesson sequence before opening this scored assessment." : "Sign in to record learning progress and unlock the required sequence."}</p><Button onClick={() => isAuthenticated ? setLocation(returnPath) : startLogin()} className="mt-6 rounded-full bg-[#315f47] px-5 text-xs font-bold shadow-none hover:bg-[#214d36]">{isAuthenticated ? "Return to learning" : "Sign in to continue"}</Button></div>
          ) : result ? (
            <div className="px-6 py-8 sm:px-10 sm:py-10">
              <div className={cn("rounded-2xl p-6 sm:p-7", result.passed ? "bg-[#ebf4e7]" : "bg-[#fbf1e8]")}>
                <div className="flex flex-wrap items-start justify-between gap-5"><div><div className={cn("grid h-10 w-10 place-items-center rounded-full", result.passed ? "bg-[#68a16c] text-white" : "bg-[#d68a4f] text-white")}>{result.passed ? <CheckCircle2 className="h-5 w-5" /> : <CircleAlert className="h-5 w-5" />}</div><p className="mt-4 text-[10px] font-bold uppercase tracking-[0.18em] text-[#728671]">{result.passed ? "Requirement met" : "Review and retry"}</p><h2 className="mt-2 font-serif text-3xl font-semibold tracking-[-0.04em] text-[#2d4934]">{result.passed ? "You passed." : "Not yet passed."}</h2><p className="mt-2 text-sm text-[#58705a]">You answered {result.correctCount} of {result.totalQuestions} items correctly.</p></div><div className="rounded-2xl bg-white/60 px-6 py-4 text-center"><p className="font-serif text-4xl font-semibold tracking-[-0.05em] text-[#315a3d]">{result.score}%</p><p className="mt-1 text-[10px] font-bold uppercase tracking-[0.15em] text-[#708370]">Score</p></div></div>
                {result.certificate && <div className="mt-6 flex items-start gap-3 rounded-xl border border-[#c5dec0] bg-white/65 p-4"><Award className="mt-0.5 h-4 w-4 shrink-0 text-[#4d8a56]" /><p className="text-xs leading-5 text-[#426046]">Your Crop Advisor Foundations Certificate has been issued. {result.ownerNotified ? "The platform owner has also been notified." : "It is ready to view in your credential area."}</p></div>}
              </div>
              <div className="mt-8 space-y-4"><p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#819080]">Response feedback</p>{assessment.questions.map((question, index) => { const item = result.results.find(entry => entry.questionId === question.id); return <div key={question.id} className={cn("rounded-2xl border p-5", item?.correct ? "border-[#d8e7d5] bg-[#fbfdf9]" : "border-[#eadccf] bg-[#fffcf8]")}><div className="flex gap-3"><span className={cn("grid h-6 w-6 shrink-0 place-items-center rounded-full text-[10px] font-extrabold", item?.correct ? "bg-[#dff0da] text-[#357243]" : "bg-[#f5e2d2] text-[#a66230]")}>{item?.correct ? <CheckCircle2 className="h-3.5 w-3.5" /> : String(index + 1)}</span><div><p className="text-sm font-bold leading-6 text-[#344838]">{question.prompt}</p><p className="mt-2 text-xs leading-5 text-[#617162]">{item?.feedback}</p></div></div></div>; })}</div>
              {!result.passed && sourceModule && <section className="mt-8 rounded-2xl border border-[#d9e6d5] bg-[#f7fbf4] p-5 sm:p-6"><p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#658164]">Targeted competency refresh</p><h3 className="mt-2 font-serif text-2xl font-semibold text-[#2d4934]">Rebuild the evidence before your next attempt.</h3><p className="mt-2 text-sm leading-6 text-[#58705a]">Return to <span className="font-bold">{sourceModule.lessons[0]?.title}</span> and use the response feedback above to identify the observation, constraint, or decision rule that needs attention.</p>{moduleCompetency && <div className="mt-4 rounded-xl border border-[#dbe7d6] bg-white/70 p-4"><p className="text-xs font-bold text-[#426448]">Practice focus: {moduleCompetency.remediationFocus}</p><p className="mt-2 text-xs leading-5 text-[#617562]">Field evidence: {moduleCompetency.evidence}</p></div>}<div className="mt-5 flex flex-wrap gap-3"><Button variant="outline" onClick={() => setLocation(`/course/${sourceModule.id}`)} className="rounded-full border-[#bdd0b9] bg-white text-xs font-bold text-[#315f47] hover:bg-[#edf5e9]"><ChevronLeft className="mr-1.5 h-3.5 w-3.5" />Review linked lesson</Button>{remediationScenario && <Button onClick={() => setLocation(`/scenario/${remediationScenario.id}`)} className="rounded-full bg-[#315f47] text-xs font-bold hover:bg-[#214d36]"><Target className="mr-1.5 h-3.5 w-3.5" />Practise the decision</Button>}<Button variant="outline" onClick={() => setLocation("/competencies")} className="rounded-full border-[#bdd0b9] bg-white text-xs font-bold text-[#315f47] hover:bg-[#edf5e9]">Open competency standard</Button></div></section>}
              <div className="mt-8 flex flex-wrap justify-between gap-3"><Button variant="outline" onClick={() => { setResult(null); setAnswers({}); setTimedSession(null); setRemainingSeconds(null); setTimedOut(false); expirySubmissionId.current = null; }} className="rounded-full border-[#c9d7c5] bg-transparent text-xs font-bold text-[#426045] hover:bg-[#edf3ea]"><RotateCcw className="mr-1.5 h-3.5 w-3.5" />Retake assessment</Button><Button onClick={() => setLocation(result.passed ? result.overview.nextAction.href : returnPath)} className="rounded-full bg-[#315f47] px-5 text-xs font-bold shadow-none hover:bg-[#214d36]">{result.passed ? result.overview.nextAction.title : "Review learning"}<ChevronRight className="ml-1 h-3.5 w-3.5" /></Button></div>
            </div>
          ) : (
            <div className="px-6 py-8 sm:px-10 sm:py-10">
              {!timedSession ? <section className="mx-auto max-w-2xl rounded-2xl border border-[#d6e3d1] bg-[#f5faf2] p-6 sm:p-7"><span className="grid h-11 w-11 place-items-center rounded-full bg-[#dcebd7] text-[#356146]"><Clock3 className="h-5 w-5" /></span><p className="mt-5 text-[10px] font-bold uppercase tracking-[0.17em] text-[#5e7c60]">Timed formal check</p><h2 className="mt-2 font-serif text-2xl font-semibold text-[#2d4934]">{timingQuery.isLoading ? "Checking your time limit." : `You will have ${formatTimedQuizMinutes(timeLimitSeconds)}.`}</h2><p className="mt-3 text-sm leading-6 text-[#58705a]">The clock starts only after you choose Begin timed check. Keep this page open; the server verifies expiry. If time ends, completed responses are submitted automatically and you can begin a new attempt afterward.</p><div className="mt-5 rounded-xl border border-[#eadbc9] bg-[#fffaf4] p-4"><p className="text-xs leading-5 text-[#735745]">{timedQuizBoundary}</p></div><Button onClick={() => startTimedAssessment.mutate({ assessmentId: assessment.id })} disabled={startTimedAssessment.isPending || timingQuery.isLoading} className="mt-6 rounded-full bg-[#315f47] px-5 text-xs font-bold shadow-none hover:bg-[#214d36]">{startTimedAssessment.isPending ? "Starting timed check" : timingQuery.isLoading ? "Checking time limit" : "Begin timed check"}<ChevronRight className="ml-1 h-3.5 w-3.5" /></Button></section> : <><div className={cn("mb-8 flex flex-wrap items-center justify-between gap-3 rounded-2xl border p-4", timedOut || (remainingSeconds !== null && remainingSeconds <= 60) ? "border-[#edc7a7] bg-[#fff8f0]" : "border-[#cfe1cb] bg-[#f4faf1]")}><div className="flex items-center gap-2"><Clock3 className={cn("h-4 w-4", timedOut || (remainingSeconds !== null && remainingSeconds <= 60) ? "text-[#a96537]" : "text-[#4e8355]")} /><p className="text-xs font-bold text-[#456148]">{timedOut ? "Time is up — submitting completed responses" : "Time remaining"}</p></div><p aria-live="polite" className={cn("font-mono text-lg font-bold tracking-wide", timedOut || (remainingSeconds !== null && remainingSeconds <= 60) ? "text-[#9a5d35]" : "text-[#315f47]")}>{remainingSeconds === null ? "…" : formatTimedQuizDuration(remainingSeconds)}</p></div><div className="space-y-8">{assessment.questions.map((question, index) => <section key={question.id}><div className="flex gap-3"><span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-[#e7eee3] text-[10px] font-extrabold text-[#416847]">{String(index + 1).padStart(2, "0")}</span><h2 className="pt-0.5 text-[15px] font-bold leading-6 text-[#334838]">{question.prompt}</h2></div><div className="mt-4 grid gap-2 pl-9">{question.options.map(option => { const selected = answers[question.id] === option.id; return <button type="button" disabled={timedOut || submit.isPending} key={option.id} onClick={() => setAnswers(current => ({ ...current, [question.id]: option.id }))} className={cn("flex items-center gap-3 rounded-xl border px-4 py-3 text-left text-sm transition-colors disabled:cursor-not-allowed disabled:opacity-60", selected ? "border-[#78a679] bg-[#eef6ea] text-[#2f5a39]" : "border-[#e2e7df] bg-white text-[#556856] hover:border-[#c4d3c1] hover:bg-[#fafcf8]")}><span className={cn("grid h-5 w-5 shrink-0 place-items-center rounded-full border text-[9px] font-bold", selected ? "border-[#5e9762] bg-[#5e9762] text-white" : "border-[#cbd6c7] text-[#7b8a79]")}>{selected ? <CheckCircle2 className="h-3.5 w-3.5" /> : option.id.toUpperCase()}</span>{option.label}</button>; })}</div></section>)}</div><div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-[#e7ece4] pt-6"><p className="text-xs leading-5 text-[#748273]">{Object.keys(answers).length} of {assessment.questions.length} questions answered</p><Button onClick={() => handleSubmit()} disabled={submit.isPending || timedOut} className="rounded-full bg-[#315f47] px-5 text-xs font-bold shadow-none hover:bg-[#214d36]">{submit.isPending ? "Scoring assessment" : "Submit for scoring"}<ChevronRight className="ml-1 h-3.5 w-3.5" /></Button></div></>}
            </div>
          )}
        </div>
      </main>
    </TrainingShell>
  );
}
