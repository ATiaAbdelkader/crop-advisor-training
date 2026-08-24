import { useAuth } from "@/_core/hooks/useAuth";
import LearnerLoading from "@/components/LearnerLoading";
import TrainingShell from "@/components/TrainingShell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { trpc } from "@/lib/trpc";
import { startLogin } from "@/const";
import { cropAdvisorCourse } from "@shared/curriculum";
import { documentModuleFieldBriefs } from "@shared/moduleFieldBriefs";
import { fieldRecordByModuleId } from "@shared/fieldRecordTemplates";
import { moduleVisuals } from "@shared/moduleVisuals";
import { CheckCircle2, ChevronLeft, ChevronRight, Circle, Clock3, FileText, ImageOff, LockKeyhole, NotebookPen, Target } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { useLocation, useParams } from "wouter";

export default function Course() {
  const { moduleId } = useParams<{ moduleId: string }>();
  const module = cropAdvisorCourse.modules.find(item => item.id === moduleId) ?? cropAdvisorCourse.modules[0];
  const { isAuthenticated } = useAuth();
  const [location, setLocation] = useLocation();
  const utils = trpc.useUtils();
  const overviewQuery = trpc.training.overview.useQuery(undefined, { enabled: isAuthenticated });
  const overview = overviewQuery.data;
  const [activeLessonId, setActiveLessonId] = useState(module.lessons[0].id);
  const [moduleVisualUnavailable, setModuleVisualUnavailable] = useState(false);
  const activeLesson = module.lessons.find(lesson => lesson.id === activeLessonId) ?? module.lessons[0];
  const currentIndex = module.lessons.findIndex(lesson => lesson.id === activeLesson.id);
  const completeLesson = trpc.training.completeLesson.useMutation({
    onSuccess: async updated => {
      await utils.training.overview.invalidate();
      toast.success("Lesson marked complete", { description: updated.nextAction.description });
    },
    onError: error => toast.error("Unable to record completion", { description: error.message }),
  });

  useEffect(() => {
    const firstAvailable = module.lessons.find(lesson => overview?.availableLessonIds.includes(lesson.id));
    setActiveLessonId(firstAvailable?.id ?? module.lessons[0].id);
  }, [module.id, overview?.availableLessonIds]);

  useEffect(() => {
    setModuleVisualUnavailable(false);
  }, [module.id]);

  const activeAccessible = useMemo(
    () => !isAuthenticated || !overview || overview.availableLessonIds.includes(activeLesson.id) || overview.completedLessonIds.includes(activeLesson.id),
    [activeLesson.id, isAuthenticated, overview]
  );
  const activeComplete = overview?.completedLessonIds.includes(activeLesson.id) ?? false;
  const allLessonsComplete = module.lessons.every(lesson => overview?.completedLessonIds.includes(lesson.id));
  const assessmentReady = overview?.availableAssessmentIds.includes(module.assessment.id) ?? false;
  const fieldBrief = documentModuleFieldBriefs[module.id];
  const fieldRecord = fieldRecordByModuleId[module.id];
  const moduleVisual = moduleVisuals[module.id];

  const goToLesson = (lessonId: string) => {
    if (!isAuthenticated) {
      startLogin();
      return;
    }
    const isAccessible = overview?.availableLessonIds.includes(lessonId) || overview?.completedLessonIds.includes(lessonId);
    if (!isAccessible) {
      toast.message("This lesson is gated", { description: "Complete the required prior lesson or module check first." });
      return;
    }
    setActiveLessonId(lessonId);
  };

  const completeCurrentLesson = () => {
    if (!isAuthenticated) return startLogin();
    completeLesson.mutate({ lessonId: activeLesson.id });
  };

  if (isAuthenticated && overviewQuery.isLoading) {
    return <TrainingShell wide><LearnerLoading message="Opening your field lesson" /></TrainingShell>;
  }

  return (
    <TrainingShell wide>
      <main className="mx-auto max-w-[1520px] px-5 py-6 sm:px-8 lg:py-8">
        <button type="button" onClick={() => setLocation("/dashboard")} className="mb-5 inline-flex items-center gap-1 text-xs font-bold text-[#69806d] transition-colors hover:text-[#1f4a37]"><ChevronLeft className="h-3.5 w-3.5" />Learning dashboard</button>
        <div className="grid gap-6 xl:grid-cols-[286px_minmax(0,1fr)_260px]">
          <aside className="xl:sticky xl:top-24 xl:h-fit">
            <div className="overflow-hidden rounded-[22px] border border-[#e0e5dc] bg-[#fcfcf8] shadow-[0_9px_24px_rgba(39,67,47,.035)]">
              <div className="border-b border-[#e8ece5] px-5 py-5">
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#839080]">{module.eyebrow}</p>
                <h1 className="mt-2 font-serif text-2xl font-semibold tracking-[-0.04em] text-[#263a2d]">{module.title}</h1>
                <p className="mt-2 text-xs leading-5 text-[#6e7d6e]">{module.description}</p>
              </div>
              <div className="p-2">
                {module.lessons.map((lesson, index) => {
                  const done = overview?.completedLessonIds.includes(lesson.id) ?? false;
                  const accessible = overview?.availableLessonIds.includes(lesson.id) || done;
                  const active = lesson.id === activeLesson.id;
                  return (
                    <button
                      key={lesson.id}
                      type="button"
                      onClick={() => goToLesson(lesson.id)}
                      className={cn("flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition-colors", active ? "bg-[#e9f0e5]" : accessible ? "hover:bg-[#f1f4ee]" : "opacity-55")}
                    >
                      <span className={cn("grid h-6 w-6 shrink-0 place-items-center rounded-full text-[10px] font-bold", done ? "bg-[#65a06c] text-white" : active ? "bg-[#315f47] text-white" : "bg-[#edf0ea] text-[#778376]")}>{done ? <CheckCircle2 className="h-3.5 w-3.5" /> : accessible ? `0${index + 1}` : <LockKeyhole className="h-3 w-3" />}</span>
                      <span className="min-w-0 flex-1"><span className="block truncate text-xs font-bold text-[#35483a]">{lesson.title}</span><span className="mt-0.5 block text-[10px] text-[#829081]">{lesson.duration}</span></span>
                    </button>
                  );
                })}
              </div>
              <div className="border-t border-[#e8ece5] p-3">
                <button
                  type="button"
                  onClick={() => assessmentReady ? setLocation(`/assessment/${module.assessment.id}`) : toast.message("Module check locked", { description: "Complete every lesson in this module to unlock it." })}
                  className={cn("flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition-colors", assessmentReady ? "bg-[#f4f8f1] hover:bg-[#e8f0e4]" : "opacity-55")}
                >
                  <Target className="h-4 w-4 text-[#4d7c5b]" />
                  <span><span className="block text-xs font-bold text-[#35483a]">Module assessment</span><span className="mt-0.5 block text-[10px] text-[#829081]">Pass mark {module.assessment.passMark}%</span></span>
                </button>
              </div>
            </div>
          </aside>

          <article className="min-w-0 rounded-[24px] border border-[#e0e5dc] bg-[#fcfcf8] px-6 py-7 shadow-[0_9px_24px_rgba(39,67,47,.035)] sm:px-10 sm:py-10">
            <div className="flex flex-wrap items-center gap-3"><Badge className="border-0 bg-[#e8f0e4] px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.15em] text-[#417052] hover:bg-[#e8f0e4]">{activeLesson.kicker}</Badge><span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#758374]"><Clock3 className="h-3.5 w-3.5" />{activeLesson.duration}</span></div>
            <h2 className="mt-5 max-w-3xl font-serif text-3xl font-semibold leading-[1.05] tracking-[-0.045em] text-[#263a2d] sm:text-[40px]">{activeLesson.title}</h2>
            <p className="mt-5 max-w-3xl text-[15px] leading-7 text-[#5e6f60]">{activeLesson.summary}</p>
            {moduleVisual && !moduleVisualUnavailable && (
              <figure className="mt-7 overflow-hidden rounded-2xl border border-[#d9e3d5] bg-[#f3f7f0]">
                <img src={moduleVisual.src} alt={moduleVisual.alt} onError={() => setModuleVisualUnavailable(true)} className="aspect-[16/7] w-full object-cover" />
                <figcaption className="border-t border-[#dce7d8] px-5 py-3 text-xs leading-5 text-[#58705b]">{moduleVisual.caption}</figcaption>
              </figure>
            )}
            {moduleVisual && moduleVisualUnavailable && (
              <aside className="mt-7 flex gap-3 rounded-2xl border border-[#dbe5d7] bg-[#f4f8f1] px-5 py-4 text-sm leading-6 text-[#4f6552]" aria-live="polite">
                <ImageOff className="mt-0.5 h-4 w-4 shrink-0 text-[#668468]" />
                <p><span className="font-bold text-[#36563d]">Instructional visual unavailable.</span> Continue with the lesson summary, outcomes, and field evidence below; the visual is a supporting cue, not a required source of learning content.</p>
              </aside>
            )}

            <div className="mt-9 rounded-2xl bg-[#f0f4ed] p-5 sm:p-6">
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#658064]">By the end of this lesson, you can</p>
              <ul className="mt-4 space-y-3">
                {activeLesson.outcomes.map(outcome => <li key={outcome} className="flex gap-3 text-sm leading-6 text-[#425443]"><CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-[#5e9664]" />{outcome}</li>)}
              </ul>
            </div>

            {!activeAccessible ? (
              <div className="mt-8 rounded-2xl border border-[#eadfc7] bg-[#fffaf0] p-5"><div className="flex gap-3"><LockKeyhole className="mt-0.5 h-4 w-4 shrink-0 text-[#a57934]" /><div><p className="text-sm font-bold text-[#6c4d20]">This lesson is not yet open</p><p className="mt-1 text-xs leading-5 text-[#88683b]">Complete the prior requirement in the pathway before returning to this lesson.</p></div></div></div>
            ) : (
              <div className="mt-9 space-y-8">
                {activeLesson.sections.map((section, index) => (
                  <section key={section.heading} className="max-w-3xl">
                    <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#7a8d78]">{String(index + 1).padStart(2, "0")}</p>
                    <h3 className="mt-2 font-serif text-2xl font-semibold tracking-[-0.035em] text-[#2b3e31]">{section.heading}</h3>
                    <p className="mt-3 text-[15px] leading-7 text-[#566859]">{section.body}</p>
                    {section.callout && <blockquote className="mt-5 border-l-[3px] border-[#77a266] bg-[#f1f6ed] px-5 py-4 text-sm leading-6 text-[#3c5d43]">{section.callout}</blockquote>}
                  </section>
                ))}
                {fieldBrief && (
                  <section className="max-w-3xl rounded-2xl border border-[#dbe7d5] bg-[#f7fbf4] p-5 sm:p-6">
                    <div className="flex items-start gap-3">
                      <NotebookPen className="mt-0.5 h-5 w-5 shrink-0 text-[#477a53]" />
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#658164]">Applied field brief</p>
                        <h3 className="mt-2 font-serif text-2xl font-semibold tracking-[-0.035em] text-[#2b3e31]">{fieldBrief.title}</h3>
                      </div>
                    </div>
                    <dl className="mt-5 grid gap-4 sm:grid-cols-2">
                      {[["Context", fieldBrief.context], ["Task", fieldBrief.task], ["Evidence to record", fieldBrief.evidence], ["Quality standard", fieldBrief.standard]].map(([label, value]) => (
                        <div key={label} className="rounded-xl border border-[#e0ebdc] bg-white/65 p-4">
                          <dt className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#6b876a]">{label}</dt>
                          <dd className="mt-2 text-sm leading-6 text-[#456047]">{value}</dd>
                        </div>
                      ))}
                    </dl>
                  </section>
                )}
              </div>
            )}

            <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-[#e7ece4] pt-6">
              <Button variant="ghost" disabled={currentIndex === 0} onClick={() => goToLesson(module.lessons[currentIndex - 1].id)} className="rounded-full text-xs font-bold text-[#59705e] hover:bg-[#eef2ec]"><ChevronLeft className="mr-1 h-3.5 w-3.5" />Previous lesson</Button>
              {activeComplete ? (
                <Button onClick={() => currentIndex < module.lessons.length - 1 ? goToLesson(module.lessons[currentIndex + 1].id) : setLocation(`/assessment/${module.assessment.id}`)} className="rounded-full bg-[#315f47] px-5 text-xs font-bold shadow-none hover:bg-[#214d36]">{currentIndex < module.lessons.length - 1 ? "Continue" : "Take module assessment"}<ChevronRight className="ml-1 h-3.5 w-3.5" /></Button>
              ) : (
                <Button disabled={!activeAccessible || completeLesson.isPending} onClick={completeCurrentLesson} className="rounded-full bg-[#315f47] px-5 text-xs font-bold shadow-none hover:bg-[#214d36]">{completeLesson.isPending ? "Saving progress" : "Mark lesson complete"}<CheckCircle2 className="ml-1.5 h-3.5 w-3.5" /></Button>
              )}
            </div>
          </article>

          <aside className="space-y-4 xl:sticky xl:top-24 xl:h-fit">
            <div className="rounded-[22px] border border-[#dce6d6] bg-[#edf4e9] p-5"><NotebookPen className="h-4 w-4 text-[#4c7e57]" /><p className="mt-4 text-[10px] font-bold uppercase tracking-[0.18em] text-[#658164]">Field note</p><p className="mt-2 text-sm font-semibold leading-6 text-[#314b39]">{activeLesson.sections[0].callout ?? "Build decisions from field evidence, not isolated symptoms."}</p></div>
            <div className="rounded-[22px] border border-[#e0e6dc] bg-[#fcfcf8] p-5"><p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#7d8b7c]">Module standard</p><p className="mt-2 font-serif text-2xl font-semibold text-[#2c4333]">{module.assessment.passMark}%</p><p className="mt-1 text-xs leading-5 text-[#748073]">Pass the scored module check to unlock the next requirement.</p></div>
            {fieldRecord && (
              <div className="rounded-[22px] border border-[#d9e6d5] bg-[#f7fbf4] p-5">
                <FileText className="h-4 w-4 text-[#4c7e57]" />
                <p className="mt-4 text-[10px] font-bold uppercase tracking-[0.18em] text-[#658164]">Field record template</p>
                <p className="mt-2 text-sm font-semibold leading-6 text-[#314b39]">{fieldRecord.shortTitle}</p>
                <p className="mt-1 text-xs leading-5 text-[#607460]">Fill, save, reopen, and export a private digital record for this field decision.</p>
                <Button onClick={() => setLocation(`/records/${fieldRecord.id}/entry`)} className="mt-4 w-full rounded-full bg-[#315f47] text-xs font-bold hover:bg-[#214d36]"><FileText className="mr-1.5 h-3.5 w-3.5" />Start digital record</Button>
                <button type="button" onClick={() => setLocation(`/records/${fieldRecord.id}`)} className="mt-3 w-full text-center text-[11px] font-bold text-[#54705a] hover:text-[#1f4a37]">View blank printable template</button>
              </div>
            )}
          </aside>
        </div>
      </main>
    </TrainingShell>
  );
}
