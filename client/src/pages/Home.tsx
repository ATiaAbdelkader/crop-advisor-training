import { useAuth } from "@/_core/hooks/useAuth";
import { startLogin } from "@/const";
import LearnerLoading from "@/components/LearnerLoading";
import TrainingShell from "@/components/TrainingShell";
import { ProgressRing } from "@/components/ProgressRing";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { trpc } from "@/lib/trpc";
import { cropAdvisorCourse } from "@shared/curriculum";
import { sortAnnotationReviewNotifications } from "@shared/cropDiagnosisAnnotation";
import { AlertTriangle, Award, BellRing, BookOpen, CheckCircle2, ChevronRight, Clock3, LockKeyhole, MessageSquareText, Play, RefreshCw, Sprout, Target } from "lucide-react";
import { useLocation } from "wouter";

const heroImage = "/manus-storage/vegetable-planning-field-hero_325e5a88.jpg";

function getActionIcon(type: string) {
  if (type === "assessment") return Target;
  if (type === "certificate") return Award;
  if (type === "enroll") return Sprout;
  return Play;
}

export default function Home() {
  const { user, isAuthenticated } = useAuth();
  const [location, setLocation] = useLocation();
  const utils = trpc.useUtils();
  const overviewQuery = trpc.training.overview.useQuery(undefined, { enabled: isAuthenticated });
  const annotationNotificationsQuery = trpc.annotationNotifications.list.useQuery(undefined, { enabled: isAuthenticated });
  const enroll = trpc.training.enroll.useMutation({
    onSuccess: () => utils.training.overview.invalidate(),
  });
  const markAnnotationFeedbackRead = trpc.annotationNotifications.markRead.useMutation({
    onSuccess: () => utils.annotationNotifications.list.invalidate(),
  });
  const overview = overviewQuery.data;
  const annotationNotifications = sortAnnotationReviewNotifications(annotationNotificationsQuery.data ?? []);
  const annotationFeedback = annotationNotifications.filter(notification => Boolean(notification.feedback));
  const unreadAnnotationFeedback = annotationFeedback.filter(notification => !notification.feedbackReadAt);
  const latestAnnotationReview = annotationNotifications[0];
  const progress = overview?.progressPercent ?? 0;
  const action = overview?.nextAction;
  const ActionIcon = getActionIcon(action?.type ?? "lesson");

  const continueLearning = () => {
    if (!isAuthenticated) return startLogin();
    if (action?.type === "enroll") {
      enroll.mutate();
      return;
    }
    if (action?.href) setLocation(action.href);
  };

  const openAnnotationFeedback = (id: number) => {
    if (unreadAnnotationFeedback.some(notification => notification.id === id)) {
      markAnnotationFeedbackRead.mutate({ ids: [id] });
    }
    setLocation("/diagnosis-annotation");
  };

  if (isAuthenticated && overviewQuery.isLoading) {
    return <TrainingShell wide><LearnerLoading message="Preparing your advisor dashboard" /></TrainingShell>;
  }

  return (
    <TrainingShell wide>
      <main className="pb-14">
        <section className="mx-auto max-w-[1520px] px-5 pt-6 sm:px-8 lg:pt-8">
          <div
            className="relative overflow-hidden rounded-[28px] bg-[#173c30] px-6 py-8 text-[#f8f7ef] shadow-[0_18px_55px_rgba(25,56,45,.18)] sm:px-10 sm:py-11 lg:min-h-[282px]"
            style={{
              backgroundImage: `linear-gradient(90deg, rgba(20,55,43,.97) 0%, rgba(21,57,45,.93) 33%, rgba(25,59,47,.55) 62%, rgba(24,55,43,.2) 100%), url(${heroImage})`,
              backgroundPosition: "center",
              backgroundSize: "cover",
            }}
          >
            <div className="relative z-10 max-w-2xl">
              <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#c6d9bc]">Crop Advisor Foundations</p>
              <h1 className="mt-4 font-serif text-3xl font-semibold leading-[1.02] tracking-[-0.045em] sm:text-[42px]">
                {isAuthenticated ? `Welcome back, ${user?.name?.split(" ")[0] || "advisor"}.` : "A sharper field of judgement."}
              </h1>
              <p className="mt-4 max-w-xl text-sm leading-6 text-[#e2ebd9] sm:text-[15px]">
                {isAuthenticated
                  ? "Continue through a rigorous, field-centred learning path built for the decisions that matter in crop production."
                  : "Master a disciplined, field-centred approach to crop advisory—from observation and soil context to sound recommendations."}
              </p>
              <div className="mt-7 flex flex-wrap items-center gap-3">
                <Button
                  onClick={continueLearning}
                  disabled={overviewQuery.isLoading || enroll.isPending}
                  aria-label="Start or continue the Crop Advisor Foundations course pathway"
                  className="rounded-full bg-[#eef3e9] px-5 text-xs font-bold text-[#1c4639] shadow-none transition-transform duration-200 hover:bg-white active:scale-[.97]"
                >
                  {action?.type === "enroll" || !overview ? "Begin the pathway" : action?.title}
                  <ChevronRight className="ml-1 h-3.5 w-3.5" />
                </Button>
                <span className="inline-flex items-center gap-2 text-xs font-semibold text-[#d3e0cc]">
                  <Clock3 className="h-3.5 w-3.5" />
                  {cropAdvisorCourse.duration}
                </span>
              </div>
            </div>
            <div className="absolute -bottom-24 -right-14 h-64 w-64 rounded-full border border-white/10 bg-white/[.03]" />
            <div className="absolute bottom-8 right-8 hidden items-end gap-5 lg:flex">
              <div className="rounded-2xl border border-white/15 bg-[#173c30]/55 px-5 py-4 backdrop-blur-sm">
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#cad8c5]">Certification standard</p>
                <p className="mt-1 font-serif text-2xl font-semibold">{cropAdvisorCourse.passMark}%</p>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto grid max-w-[1520px] gap-6 px-5 pt-7 sm:px-8 lg:grid-cols-[minmax(0,1fr)_370px]">
          <div className="min-w-0">
            <div className="mb-4 flex items-end justify-between gap-4">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#839080]">Your learning path</p>
                <h2 className="mt-1 font-serif text-2xl font-semibold tracking-[-0.035em] text-[#23362b]">Required modules</h2>
              </div>
              <span className="text-xs font-semibold text-[#718072]">{overview ? `${overview.completedSteps} of ${overview.totalSteps} checkpoints` : "4-hour pathway"}</span>
            </div>

            <div className="grid gap-3">
              {cropAdvisorCourse.modules.map((module, index) => {
                const state = overview?.moduleStates.find(item => item.id === module.id);
                const moduleProgress = state
                  ? Math.round(((state.completedLessons + (state.assessmentPassed ? 1 : 0)) / (state.lessonCount + 1)) * 100)
                  : 0;
                const locked = Boolean(state?.locked);
                const isDone = Boolean(state?.assessmentPassed);
                return (
                  <button
                    key={module.id}
                    type="button"
                    disabled={locked}
                    onClick={() => setLocation(`/course/${module.id}`)}
                    className={cn(
                      "group flex w-full items-center gap-4 rounded-[20px] border bg-[#fcfcf8] p-4 text-left transition-all duration-200 sm:p-5",
                      locked
                        ? "cursor-not-allowed border-[#e6e9e1] opacity-65"
                        : "border-[#e1e5dc] shadow-[0_7px_20px_rgba(39,67,47,.035)] hover:-translate-y-0.5 hover:border-[#b9c8b5] hover:shadow-[0_13px_28px_rgba(39,67,47,.08)] active:scale-[.995]"
                    )}
                  >
                    <div className={cn("grid h-11 w-11 shrink-0 place-items-center rounded-[15px] text-sm font-extrabold", isDone ? "bg-[#e2f0e2] text-[#31714a]" : locked ? "bg-[#edf0e9] text-[#8b958a]" : "bg-[#e7eee2] text-[#285744]")}>{isDone ? <CheckCircle2 className="h-5 w-5" /> : locked ? <LockKeyhole className="h-4 w-4" /> : `0${index + 1}`}</div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="truncate text-[15px] font-bold text-[#294237]">{module.title}</p>
                        {isDone && <Badge className="border-0 bg-[#e2f0e2] px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.12em] text-[#347048] hover:bg-[#e2f0e2]">Passed</Badge>}
                      </div>
                      <p className="mt-1 truncate text-xs leading-5 text-[#718072]">{locked ? "Complete the preceding module assessment to unlock." : module.description}</p>
                      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-[#e8ece5]">
                        <div className="h-full rounded-full bg-[#79a06c] transition-all duration-500" style={{ width: `${moduleProgress}%` }} />
                      </div>
                    </div>
                    <ChevronRight className="h-4 w-4 shrink-0 text-[#98a496] transition-transform duration-200 group-hover:translate-x-0.5" />
                  </button>
                );
              })}
            </div>
          </div>

          <aside className="space-y-4">
            {isAuthenticated && (
              <section className={`rounded-[22px] border p-5 shadow-[0_9px_24px_rgba(39,67,47,.035)] ${latestAnnotationReview?.status === "revision_requested" ? "border-[#ead3bd] bg-[#fff9f2]" : latestAnnotationReview?.status === "reviewed" ? "border-[#cfe3d2] bg-[#f4faf3]" : "border-[#dfe6d9] bg-[#fbfdf9]"}`}>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2 text-[#456f50]"><span className={`grid h-7 w-7 place-items-center rounded-full ${latestAnnotationReview?.status === "revision_requested" ? "bg-[#fff0e3] text-[#9a613f]" : "bg-[#e7f1e6] text-[#4c7e57]"}`}>{latestAnnotationReview?.status === "revision_requested" ? <AlertTriangle className="h-3.5 w-3.5" /> : <MessageSquareText className="h-3.5 w-3.5" />}</span><p className="text-[10px] font-bold uppercase tracking-[0.18em]">Supervisor review</p></div>
                  {unreadAnnotationFeedback.length > 0 && <span className="rounded-full bg-[#ba5536] px-2 py-0.5 text-[10px] font-bold text-white">{unreadAnnotationFeedback.length} new</span>}
                </div>
                {annotationNotificationsQuery.isLoading ? <p className="mt-4 text-xs leading-5 text-[#647764]">Checking your private supervisor-review status…</p> : annotationNotificationsQuery.isError ? <><p className="mt-4 text-sm font-bold text-[#805237]">Supervisor review status is unavailable</p><p className="mt-2 text-xs leading-5 text-[#7c6658]">Your learning progress is unchanged. Retry to load your private feedback status.</p><Button variant="ghost" onClick={() => annotationNotificationsQuery.refetch()} className="mt-4 h-auto p-0 text-xs font-bold text-[#8d563d] hover:bg-transparent"><RefreshCw className="mr-1.5 h-3.5 w-3.5" />Retry status</Button></> : latestAnnotationReview ? <><div className="mt-4 flex items-center gap-2"><span className={`h-2 w-2 rounded-full ${latestAnnotationReview.status === "revision_requested" ? "bg-[#c56a43]" : latestAnnotationReview.status === "reviewed" ? "bg-[#4b9a5b]" : "bg-[#d2a34f]"}`} /><p className="text-sm font-bold text-[#35513b]">{latestAnnotationReview.status === "revision_requested" ? "Revision requested" : latestAnnotationReview.status === "reviewed" ? "Feedback received" : "Awaiting supervisor feedback"}</p></div><p className="mt-2 text-xs leading-5 text-[#647764]">{latestAnnotationReview.status === "revision_requested" ? "Review the requested changes, then complete a fresh annotation submission when ready." : latestAnnotationReview.status === "reviewed" ? "Your completed annotation reasoning has supervisor feedback available." : "Your completed annotation reasoning is in the private supervisor queue."}</p><Button variant="ghost" onClick={() => latestAnnotationReview.feedback ? openAnnotationFeedback(latestAnnotationReview.id) : setLocation("/diagnosis-annotation")} className="mt-4 h-auto p-0 text-xs font-bold text-[#2d6844] hover:bg-transparent hover:text-[#1c4e31]">{latestAnnotationReview.feedback ? "Open feedback" : "Open annotation review"}<ChevronRight className="ml-1 h-3.5 w-3.5" /></Button></> : <><p className="mt-4 text-sm font-bold text-[#35513b]">No annotation review submitted</p><p className="mt-2 text-xs leading-5 text-[#647764]">Complete the crop-diagnosis photo annotation exercise to request private supervisor feedback on your evidence reasoning.</p><Button variant="ghost" onClick={() => setLocation("/diagnosis-annotation")} className="mt-4 h-auto p-0 text-xs font-bold text-[#2d6844] hover:bg-transparent hover:text-[#1c4e31]">Open annotation practice<ChevronRight className="ml-1 h-3.5 w-3.5" /></Button></>}
              </section>
            )}

            {isAuthenticated && annotationFeedback.length > 0 && (
              <section className="rounded-[22px] border border-[#dbe6d9] bg-[#fcfcf8] p-5 shadow-[0_9px_24px_rgba(39,67,47,.035)]">
                <div className="flex items-center justify-between gap-3"><div className="flex items-center gap-2"><BellRing className="h-4 w-4 text-[#4f8063]" /><p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#5a745f]">In-app feedback</p></div>{unreadAnnotationFeedback.length > 0 && <Button variant="ghost" disabled={markAnnotationFeedbackRead.isPending} onClick={() => markAnnotationFeedbackRead.mutate()} className="h-auto p-0 text-[10px] font-bold text-[#426e4d] hover:bg-transparent">Mark all read</Button>}</div>
                <div className="mt-4 space-y-3">{annotationFeedback.slice(0, 3).map(notification => <button key={notification.id} type="button" onClick={() => openAnnotationFeedback(notification.id)} className={`w-full rounded-xl border p-3 text-left transition-colors ${notification.feedbackReadAt ? "border-[#e2e8e0] bg-[#fafcf9] hover:bg-[#f4f9f3]" : notification.status === "revision_requested" ? "border-[#eacdaf] bg-[#fff8f0] hover:bg-[#fff3e7]" : "border-[#cfe3d1] bg-[#f2faf2] hover:bg-[#e9f6e8]"}`}><div className="flex items-start gap-2"><span className={`mt-1 h-2 w-2 shrink-0 rounded-full ${notification.feedbackReadAt ? "bg-[#bcc9ba]" : notification.status === "revision_requested" ? "bg-[#c56a43]" : "bg-[#4b9a5b]"}`} /><div className="min-w-0 flex-1"><p className="text-xs font-bold text-[#3c5842]">{notification.status === "revision_requested" ? "Supervisor requested a revision" : "Supervisor feedback received"}</p><p className="mt-1 line-clamp-2 text-[11px] leading-4 text-[#657765]">{notification.feedback}</p><p className="mt-2 text-[10px] text-[#7c8a7d]">{notification.supervisorName || "Course supervisor"} · {notification.reviewedAt ? new Date(notification.reviewedAt).toLocaleDateString() : "New update"}</p></div></div></button>)}</div>
              </section>
            )}
            <div className="rounded-[22px] border border-[#dfe6d9] bg-[#edf3e9] p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#728570]">Overall completion</p>
                  <p className="mt-2 font-serif text-3xl font-semibold tracking-[-0.04em] text-[#234032]">{progress}%</p>
                </div>
                <ProgressRing value={progress} />
              </div>
              <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-[#d7e2d1]">
                <div className="h-full rounded-full bg-[#4f8063] transition-all duration-500" style={{ width: `${progress}%` }} />
              </div>
              <p className="mt-3 text-xs leading-5 text-[#617762]">{progress === 100 ? "Your learning evidence is complete." : "Your pathway combines lessons, module checks, and an integrated final assessment."}</p>
            </div>

            <div className="rounded-[22px] border border-[#e0e5dc] bg-[#fcfcf8] p-5 shadow-[0_9px_24px_rgba(39,67,47,.035)]">
              <div className="flex items-center gap-2 text-[#4e8061]"><span className="grid h-7 w-7 place-items-center rounded-full bg-[#e7f0e4]"><ActionIcon className="h-3.5 w-3.5" /></span><p className="text-[10px] font-bold uppercase tracking-[0.18em]">Next required activity</p></div>
              <h3 className="mt-4 font-serif text-xl font-semibold leading-6 tracking-[-0.03em] text-[#23372b]">{action?.title ?? "Enroll to begin"}</h3>
              <p className="mt-2 text-xs leading-5 text-[#6c7a6c]">{action?.description ?? "Sign in to activate your personal progress record."}</p>
              <Button
                variant="ghost"
                onClick={continueLearning}
                disabled={overviewQuery.isLoading || enroll.isPending}
                className="mt-4 h-auto p-0 text-xs font-bold text-[#275b43] hover:bg-transparent hover:text-[#183e2f]"
              >
                {action?.type === "enroll" || !overview ? "Activate pathway" : "Continue learning"}
                <ChevronRight className="ml-1 h-3.5 w-3.5" />
              </Button>
            </div>

            <div className="rounded-[22px] border border-[#dfe5db] bg-[#fbfaf5] p-5">
              <div className="flex items-center gap-3"><BookOpen className="h-4 w-4 text-[#617f54]" /><p className="text-xs font-bold text-[#344b3b]">What the credential proves</p></div>
              <p className="mt-3 text-xs leading-5 text-[#718071]">You have demonstrated a structured approach to field observation, soil and nutrition context, and evidence-led crop decisions.</p>
            </div>
          </aside>
        </section>
      </main>
    </TrainingShell>
  );
}
