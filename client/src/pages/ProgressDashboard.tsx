import { useAuth } from "@/_core/hooks/useAuth";
import LearnerLoading from "@/components/LearnerLoading";
import TrainingShell from "@/components/TrainingShell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { trpc } from "@/lib/trpc";
import { startLogin } from "@/const";
import { cropAdvisorCourse } from "@shared/curriculum";
import { AlertTriangle, BarChart3, CheckCircle2, ChevronRight, ClipboardCheck, Clock3, LockKeyhole, RefreshCw, Target } from "lucide-react";
import { useMemo } from "react";
import { fieldExerciseCatalog, parseExerciseProgress } from "@shared/exerciseProgress";
import { useLocation } from "wouter";

function getLearningTrack(index: number) {
  if (index <= 6) return { title: "Plan the farm system", range: "Modules 04–06" };
  if (index <= 16) return { title: "Read soil, climate, and yield risk", range: "Modules 07–16" };
  if (index <= 28) return { title: "Establish and manage vegetable crops", range: "Modules 17–28" };
  return { title: "Protect crop health and stewardship", range: "Modules 29–34" };
}

export default function ProgressDashboard() {
  const { isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const overviewQuery = trpc.training.overview.useQuery(undefined, { enabled: isAuthenticated });
  const overview = overviewQuery.data;
  const exerciseProgress = useMemo(() => typeof window === "undefined" ? {} : parseExerciseProgress(localStorage.getItem("crop-advisor-exercise-progress")), []);
  const completedExercises = fieldExerciseCatalog.filter(item => { const record = exerciseProgress[item.route]; return record && record.total > 0 && record.completed === record.total; }).length;

  const documentModules = useMemo(
    () => cropAdvisorCourse.modules.filter(module => module.index >= 4),
    []
  );
  const documentStates = useMemo(
    () => documentModules.map(module => ({
      module,
      state: overview?.moduleStates.find(item => item.id === module.id),
      score: overview?.latestScores[module.assessment.id],
    })),
    [documentModules, overview]
  );
  const passedCount = documentStates.filter(item => item.state?.assessmentPassed).length;
  const completedLessons = documentStates.reduce((total, item) => total + (item.state?.completedLessons ?? 0), 0);
  const totalLessons = documentStates.reduce((total, item) => total + (item.state?.lessonCount ?? 2), 0);
  const scoredModules = documentStates.filter(item => typeof item.score === "number");
  const averageScore = scoredModules.length
    ? Math.round(scoredModules.reduce((total, item) => total + (item.score ?? 0), 0) / scoredModules.length)
    : null;
  const progressPercent = Math.round((passedCount / documentModules.length) * 100);

  if (isAuthenticated && overviewQuery.isLoading) {
    return <TrainingShell wide><LearnerLoading message="Opening your module-progress dashboard" /></TrainingShell>;
  }

  if (isAuthenticated && overviewQuery.isError) {
    return (
      <TrainingShell wide>
        <main className="mx-auto max-w-3xl px-5 py-16 sm:px-8">
          <div className="rounded-[28px] border border-[#eadfcb] bg-[#fffaf0] p-8 text-center shadow-[0_12px_32px_rgba(99,72,35,.06)] sm:p-12">
            <span className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-[#f6e8ce] text-[#9a682f]"><AlertTriangle className="h-6 w-6" /></span>
            <p className="mt-5 text-[11px] font-bold uppercase tracking-[0.18em] text-[#927141]">Progress record unavailable</p>
            <h1 className="mt-3 font-serif text-3xl font-semibold tracking-[-0.04em] text-[#4e3a22]">We could not load your learner record</h1>
            <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-[#806746]">Your course data has not been changed. Please retry the request; if the issue continues, return to your learning dashboard and try again shortly.</p>
            <div className="mt-7 flex flex-wrap justify-center gap-3"><Button onClick={() => void overviewQuery.refetch()} className="rounded-full bg-[#8e6330] px-5 text-xs font-bold shadow-none hover:bg-[#724d25]"><RefreshCw className="mr-1.5 h-3.5 w-3.5" />Retry loading</Button><Button variant="outline" onClick={() => setLocation("/dashboard")} className="rounded-full border-[#ddcba9] px-5 text-xs font-bold text-[#765127] hover:bg-[#fff4e2]">Return to dashboard</Button></div>
          </div>
        </main>
      </TrainingShell>
    );
  }

  if (!isAuthenticated) {
    return (
      <TrainingShell wide>
        <main className="mx-auto max-w-3xl px-5 py-16 sm:px-8">
          <div className="rounded-[28px] border border-[#dfe6d9] bg-[#fcfcf8] p-8 text-center shadow-[0_12px_32px_rgba(39,67,47,.06)] sm:p-12">
            <span className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-[#e7f0e4] text-[#356c48]"><BarChart3 className="h-6 w-6" /></span>
            <p className="mt-5 text-[11px] font-bold uppercase tracking-[0.18em] text-[#738473]">Personal learning record</p>
            <h1 className="mt-3 font-serif text-3xl font-semibold tracking-[-0.04em] text-[#263a2d]">Track your field-learning progress</h1>
            <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-[#687767]">Sign in to view your own lesson completion and assessment scores across the 31 upgraded document-derived modules.</p>
            <Button onClick={startLogin} className="mt-7 rounded-full bg-[#285a43] px-5 text-xs font-bold shadow-none hover:bg-[#1e4936]">Sign in to view progress<ChevronRight className="ml-1 h-3.5 w-3.5" /></Button>
          </div>
        </main>
      </TrainingShell>
    );
  }

  return (
    <TrainingShell wide>
      <main className="mx-auto max-w-[1520px] px-5 py-7 sm:px-8 lg:py-9">
        <section className="relative overflow-hidden rounded-[28px] bg-[#173c30] px-6 py-8 text-[#f8f7ef] shadow-[0_18px_45px_rgba(25,56,45,.16)] sm:px-9 sm:py-10">
          <div className="relative z-10 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2"><Badge className="border-0 bg-[#cfdfc7] px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-[#234c37] hover:bg-[#cfdfc7]">Learner progress</Badge><span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#d6e4d0]"><Clock3 className="h-3.5 w-3.5" />Modules 04–34</span></div>
            <h1 className="mt-5 font-serif text-3xl font-semibold tracking-[-0.045em] sm:text-[42px]">Your field-learning record</h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-[#dbe8d5]">Review your own lesson completion, latest assessment score, and progression state across every source-grounded module. Scores remain visible only in your authenticated learner record.</p>
          </div>
          <div className="absolute -bottom-24 -right-12 h-64 w-64 rounded-full border border-white/10 bg-white/[.03]" />
          <div className="absolute -right-6 bottom-0 h-32 w-[46%] opacity-20" style={{ backgroundImage: "repeating-linear-gradient(-24deg, transparent 0 15px, rgba(217,235,202,.58) 16px 18px, transparent 19px 33px)" }} />
        </section>

        <section className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard label="Modules passed" value={`${passedCount} / ${documentModules.length}`} detail="Scored checks passed at 80% or above" icon={<CheckCircle2 className="h-4 w-4" />} tone="green" />
          <MetricCard label="Lesson completion" value={`${completedLessons} / ${totalLessons}`} detail="Completed lesson requirements" icon={<ClipboardCheck className="h-4 w-4" />} tone="sage" />
          <MetricCard label="Average latest score" value={averageScore === null ? "—" : `${averageScore}%`} detail={averageScore === null ? "Complete a module check to begin" : `${scoredModules.length} module checks recorded`} icon={<Target className="h-4 w-4" />} tone="gold" />
          <MetricCard label="Document-module progress" value={`${progressPercent}%`} detail="Based on passed module checks" icon={<BarChart3 className="h-4 w-4" />} tone="green" />
          <MetricCard label="Field exercises" value={`${completedExercises} / ${fieldExerciseCatalog.length}`} detail="Voluntary progress saved in this browser" icon={<ClipboardCheck className="h-4 w-4" />} tone="sage" />
        </section>

        <section className="mt-7 rounded-[24px] border border-[#dce7d8] bg-[#f7faf5] p-5 sm:p-6"><div className="flex flex-wrap items-end justify-between gap-3"><div><p className="text-[10px] font-bold uppercase tracking-[.16em] text-[#718471]">Voluntary field practice</p><h2 className="mt-1 font-serif text-2xl font-semibold text-[#294235]">Exercise completion summary</h2></div><p className="max-w-md text-xs leading-5 text-[#667866]">These checklists reflect completed prompts in this browser only. They support practice and do not change formal assessment, progression, scoring, certification, or alerts.</p></div><div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">{fieldExerciseCatalog.map(item=>{const record=exerciseProgress[item.route];const done=Boolean(record&&record.total>0&&record.completed===record.total);return <button key={item.route} onClick={()=>setLocation(item.route)} className="rounded-xl border border-[#dce7d8] bg-white p-3 text-left transition-colors hover:bg-[#eef7ec]"><div className="flex items-center justify-between gap-2"><span className="text-xs font-bold text-[#315f47]">{item.module}</span><Badge className={cn("border-0 text-[9px]",done?"bg-[#dcefdc] text-[#337047]":"bg-[#edf1eb] text-[#647464]")}>{done?"Complete":"Not complete"}</Badge></div><p className="mt-1 text-sm font-semibold text-[#334b3a]">{item.title}</p><p className="mt-1 text-xs text-[#718071]">{record?`${record.completed}/${record.total} prompts completed`:"Open to begin practice"}</p></button>})}</div></section>

        <section className="mt-7 rounded-[24px] border border-[#e0e5dc] bg-[#fcfcf8] shadow-[0_9px_24px_rgba(39,67,47,.035)]">
          <div className="flex flex-wrap items-end justify-between gap-4 border-b border-[#e7ece4] px-5 py-5 sm:px-6">
            <div><p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#7a8978]">All 31 upgraded modules</p><h2 className="mt-1 font-serif text-2xl font-semibold tracking-[-0.035em] text-[#263a2d]">Completion and score tracker</h2></div>
            <p className="max-w-sm text-xs leading-5 text-[#718071]">A dash means no scored attempt has been recorded. A module unlocks when its preceding assessment is passed.</p>
          </div>
          <div className="hidden grid-cols-[70px_minmax(230px,1fr)_160px_120px_126px] gap-4 border-b border-[#edf0ea] px-6 py-3 text-[10px] font-bold uppercase tracking-[0.14em] text-[#849183] lg:grid">
            <span>Module</span><span>Learning requirement</span><span>Latest score</span><span>Status</span><span>Next step</span>
          </div>
          <div className="divide-y divide-[#edf0ea]">
            {documentStates.map(({ module, state, score }, position) => {
              const lessonCount = state?.lessonCount ?? module.lessons.length;
              const completed = state?.completedLessons ?? 0;
              const passed = Boolean(state?.assessmentPassed);
              const locked = Boolean(state?.locked);
              const ready = Boolean(state?.assessmentReady);
              const status = passed ? "Passed" : locked ? "Locked" : ready ? "Ready for check" : completed > 0 ? "In progress" : "Not started";
              const actionLabel = passed ? "Review" : ready ? "Take check" : locked ? "Locked" : "Continue";
              const actionHref = ready ? `/assessment/${module.assessment.id}` : `/course/${module.id}`;
              const percent = Math.round((completed / lessonCount) * 100);
              const track = getLearningTrack(module.index);
              const previousTrack = position > 0 ? getLearningTrack(documentStates[position - 1].module.index) : null;
              return (
                <div key={module.id}>
                  {(!previousTrack || previousTrack.title !== track.title) && <div className="flex items-center justify-between gap-4 bg-[#f4f7f1] px-5 py-3 lg:px-6"><div className="flex items-center gap-3"><span className="h-px w-7 bg-[#87a77f]" /><p className="font-serif text-base font-semibold text-[#35513d]">{track.title}</p></div><span className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#748672]">{track.range}</span></div>}
                  <article className="grid gap-4 px-5 py-5 lg:grid-cols-[70px_minmax(230px,1fr)_160px_120px_126px] lg:items-center lg:px-6">
                    <div className="flex items-center gap-3 lg:block"><span className={cn("grid h-10 w-10 place-items-center rounded-xl text-xs font-extrabold", passed ? "bg-[#e1f0e1] text-[#327148]" : locked ? "bg-[#edf0ea] text-[#8c978c]" : "bg-[#e8f0e4] text-[#305e45]")}>{passed ? <CheckCircle2 className="h-4 w-4" /> : locked ? <LockKeyhole className="h-3.5 w-3.5" /> : String(module.index).padStart(2, "0")}</span><span className="text-xs font-bold text-[#738273] lg:hidden">Module {String(module.index).padStart(2, "0")}</span></div>
                    <div><p className="text-sm font-bold text-[#2b4334]">{module.title}</p><div className="mt-2 flex items-center gap-3"><div className="h-1.5 min-w-24 flex-1 overflow-hidden rounded-full bg-[#e8ece5]"><div className="h-full rounded-full bg-[#70a269]" style={{ width: `${percent}%` }} /></div><span className="shrink-0 text-[11px] font-semibold text-[#758274]">{completed}/{lessonCount} lessons</span></div></div>
                    <div className="flex items-center justify-between lg:block"><p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#869284] lg:hidden">Latest score</p><p className={cn("font-serif text-xl font-semibold", typeof score === "number" ? score >= module.assessment.passMark ? "text-[#327148]" : "text-[#9b652e]" : "text-[#7d897c]")}>{typeof score === "number" ? `${score}%` : "—"}</p><p className="mt-0.5 text-[11px] text-[#7c887b]">Pass mark {module.assessment.passMark}%</p></div>
                    <div><Badge className={cn("border-0 px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.12em]", passed ? "bg-[#e2f0e2] text-[#347048] hover:bg-[#e2f0e2]" : locked ? "bg-[#edf0ea] text-[#778276] hover:bg-[#edf0ea]" : ready ? "bg-[#f7edd8] text-[#8b6029] hover:bg-[#f7edd8]" : "bg-[#e7eee2] text-[#4d7056] hover:bg-[#e7eee2]")}>{status}</Badge></div>
                    <Button variant="outline" disabled={locked} onClick={() => setLocation(actionHref)} className="justify-between rounded-full border-[#d8e2d4] px-3 text-xs font-bold text-[#325a42] hover:bg-[#f0f5ed]">{actionLabel}{locked ? <LockKeyhole className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}</Button>
                  </article>
                </div>
              );
            })}
          </div>
        </section>
      </main>
    </TrainingShell>
  );
}

function MetricCard({ label, value, detail, icon, tone }: { label: string; value: string; detail: string; icon: React.ReactNode; tone: "green" | "sage" | "gold" }) {
  const toneClass = tone === "gold" ? "border-[#eadfcb] bg-[#fffaf0] text-[#9b692e]" : tone === "sage" ? "border-[#dce7d8] bg-[#f3f7f0] text-[#5f7f5f]" : "border-[#dbe7d7] bg-[#edf4e9] text-[#427456]";
  return <div className={cn("rounded-[22px] border p-5", toneClass)}><div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.16em]"><span className="grid h-7 w-7 place-items-center rounded-full bg-white/60">{icon}</span>{label}</div><p className="mt-4 font-serif text-3xl font-semibold tracking-[-0.04em] text-[#294235]">{value}</p><p className="mt-1.5 text-xs leading-5 text-[#6d7d6e]">{detail}</p></div>;
}
