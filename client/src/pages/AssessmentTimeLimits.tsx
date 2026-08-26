import { useAuth } from "@/_core/hooks/useAuth";
import LearnerLoading from "@/components/LearnerLoading";
import TrainingShell from "@/components/TrainingShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { trpc } from "@/lib/trpc";
import { cropAdvisorCourse } from "@shared/curriculum";
import { formatTimedQuizMinutes, getTimedQuizLimitSeconds, maximumAdministratorTimedQuizSeconds, minimumAdministratorTimedQuizSeconds } from "@shared/timedAssessments";
import { ArrowLeft, CheckCircle2, Clock3, RefreshCw, Settings2, ShieldCheck, UserRoundCheck } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useLocation } from "wouter";

export default function AssessmentTimeLimits() {
  const { isAuthenticated, user } = useAuth();
  const [, setLocation] = useLocation();
  const utils = trpc.useUtils();
  const settingsQuery = trpc.assessmentTiming.list.useQuery(undefined, { enabled: isAuthenticated && user?.role === "admin" });
  const [draftMinutes, setDraftMinutes] = useState<Record<string, string>>({});
  const save = trpc.assessmentTiming.set.useMutation({
    onSuccess: async () => {
      await utils.assessmentTiming.list.invalidate();
      toast.success("Module time limit saved");
    },
    onError: error => toast.error("Unable to save time limit", { description: error.message }),
  });

  if (!isAuthenticated) return <TrainingShell><AccessGate icon={<UserRoundCheck className="mx-auto h-10 w-10 text-[#668d6b]" />} title="Administrator access" text="Sign in with an administrator account to manage formal assessment time limits." /></TrainingShell>;
  if (user?.role !== "admin") return <TrainingShell><AccessGate icon={<ShieldCheck className="mx-auto h-10 w-10 text-[#a0724f]" />} title="Administrator access required" text="Only course administrators can change module assessment time limits." action={() => setLocation("/competencies")} /></TrainingShell>;
  if (settingsQuery.isLoading) return <TrainingShell wide><LearnerLoading message="Loading module time limits" /></TrainingShell>;
  if (settingsQuery.isError) return <TrainingShell><AccessGate icon={<RefreshCw className="mx-auto h-10 w-10 text-[#a0724f]" />} title="Time limits unavailable" text="The protected module settings could not be loaded." action={() => settingsQuery.refetch()} actionLabel="Retry" /></TrainingShell>;

  const configuredByAssessment = new Map((settingsQuery.data ?? []).map(setting => [setting.assessmentId, setting]));
  const minimumMinutes = minimumAdministratorTimedQuizSeconds / 60;
  const maximumMinutes = maximumAdministratorTimedQuizSeconds / 60;
  const moduleAssessments = cropAdvisorCourse.modules.map(module => ({ module, assessment: module.assessment }));
  const saveLimit = (assessmentId: string, rawValue: string) => {
    const minutes = Number(rawValue);
    if (!Number.isInteger(minutes) || minutes < minimumMinutes || minutes > maximumMinutes) {
      toast.error("Enter a whole-minute time limit", { description: `Choose between ${minimumMinutes} and ${maximumMinutes} minutes.` });
      return;
    }
    save.mutate({ assessmentId, timeLimitSeconds: minutes * 60 });
  };

  return <TrainingShell wide><main className="mx-auto max-w-[1220px] px-5 py-8 sm:px-8 lg:py-10"><button type="button" onClick={() => setLocation("/supervisor/competency-reviews")} className="inline-flex items-center gap-1 text-xs font-bold text-[#69806d] hover:text-[#1f4a37]"><ArrowLeft className="h-3.5 w-3.5" />Supervisor workspace</button><header className="mt-5 rounded-[28px] bg-[#213f35] px-7 py-8 text-[#f6faf5]"><div className="flex flex-wrap items-start justify-between gap-4"><div><p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#bed6c1]">Administrator settings</p><h1 className="mt-2 font-serif text-3xl font-semibold sm:text-4xl">Set module quiz time limits.</h1><p className="mt-3 max-w-3xl text-sm leading-6 text-[#d5e7d7]">Apply a custom limit to a single module’s formal check, or restore its question-scaled standard. Changes apply to future quiz sessions only.</p></div><Settings2 className="h-7 w-7 text-[#bed6c1]" /></div><div className="mt-6 flex gap-2 rounded-xl border border-[#486653] bg-[#294b3e] p-4"><ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-[#c5dec3]" /><p className="text-xs leading-5 text-[#d7e7d4]">Time limits affect delivery only. The 80% pass mark, sequential gates, certification, owner alerts, and competency scoring remain unchanged. Current active learner sessions keep the limit recorded when they began.</p></div></header><section className="mt-7 overflow-hidden rounded-[24px] border border-[#dfe8dd] bg-[#fcfdf9]"><div className="grid grid-cols-[minmax(0,1fr)_110px_176px] gap-3 border-b border-[#dfe8dd] bg-[#f2f7f0] px-5 py-4 text-[10px] font-bold uppercase tracking-[0.16em] text-[#668164] sm:px-6"><span>Module assessment</span><span>Current</span><span>Custom limit</span></div>{moduleAssessments.map(({ module, assessment }) => { const configured = configuredByAssessment.get(assessment.id); const standardSeconds = getTimedQuizLimitSeconds(assessment); const currentSeconds = configured?.timeLimitSeconds ?? standardSeconds; const value = draftMinutes[assessment.id] ?? String(Math.round(currentSeconds / 60)); const isPending = save.isPending && save.variables?.assessmentId === assessment.id; return <article key={assessment.id} className="grid grid-cols-1 gap-4 border-b border-[#e4ece2] px-5 py-5 last:border-0 sm:grid-cols-[minmax(0,1fr)_110px_176px] sm:items-center sm:px-6"><div><p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#688168]">{module.eyebrow}</p><h2 className="mt-1 text-sm font-bold text-[#31513a]">{assessment.title}</h2><p className="mt-1 text-xs leading-5 text-[#617461]">Standard: {formatTimedQuizMinutes(standardSeconds)} · {assessment.questions.length} questions</p></div><div><p className="inline-flex items-center gap-1.5 text-sm font-bold text-[#31513a]"><Clock3 className="h-3.5 w-3.5 text-[#56865b]" />{formatTimedQuizMinutes(currentSeconds)}</p><p className="mt-1 text-[10px] font-bold uppercase tracking-[0.12em] text-[#819080]">{configured ? "Custom" : "Standard"}</p></div><div className="flex flex-wrap items-center gap-2"><label className="sr-only" htmlFor={`limit-${assessment.id}`}>Custom time limit for {assessment.title} in minutes</label><Input id={`limit-${assessment.id}`} type="number" inputMode="numeric" min={minimumMinutes} max={maximumMinutes} step="1" value={value} onChange={event => setDraftMinutes(current => ({ ...current, [assessment.id]: event.target.value }))} className="h-9 w-16 bg-white text-sm" /><span className="text-xs font-medium text-[#617461]">min</span><Button size="sm" disabled={isPending} onClick={() => saveLimit(assessment.id, value)} className="h-9 rounded-full bg-[#315f47] px-3 text-[11px] font-bold hover:bg-[#214d36]">{isPending ? "Saving" : "Save"}</Button>{configured && <Button size="sm" variant="outline" disabled={isPending} onClick={() => save.mutate({ assessmentId: assessment.id, timeLimitSeconds: null })} className="h-9 rounded-full border-[#c7d7c4] bg-white px-3 text-[11px] font-bold text-[#426045] hover:bg-[#edf3ea]">Use standard</Button>}</div></article>; })}</section><p className="mt-5 flex items-center gap-2 text-xs leading-5 text-[#6b7d6c]"><CheckCircle2 className="h-4 w-4 shrink-0 text-[#5f9464]" />A saved custom limit is stored in minutes, validated between {minimumMinutes} and {maximumMinutes} minutes, and used only when the learner starts a new session.</p></main></TrainingShell>;
}

function AccessGate({ icon, title, text, action, actionLabel = "Return to competencies" }: { icon?: React.ReactNode; title: string; text: string; action?: () => void; actionLabel?: string }) {
  return <main className="mx-auto max-w-xl px-5 py-24 text-center">{icon}<h1 className="mt-5 font-serif text-3xl font-semibold text-[#2f4836]">{title}</h1><p className="mt-3 text-sm leading-6 text-[#617461]">{text}</p>{action && <Button onClick={action} className="mt-6 rounded-full bg-[#315f47]">{actionLabel}</Button>}</main>;
}
