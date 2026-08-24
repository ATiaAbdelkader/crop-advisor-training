import { useAuth } from "@/_core/hooks/useAuth";
import LearnerLoading from "@/components/LearnerLoading";
import TrainingShell from "@/components/TrainingShell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { trpc } from "@/lib/trpc";
import { startLogin } from "@/const";
import { appliedScenarios } from "@shared/appliedScenarios";
import { CheckCircle2, ChevronLeft, ChevronRight, CircleAlert, ClipboardCheck, RotateCcw, Sprout, Target } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useLocation, useParams } from "wouter";

export default function ScenarioPractice() {
  const { scenarioId } = useParams<{ scenarioId: string }>();
  const scenario = appliedScenarios[scenarioId];
  const { isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [result, setResult] = useState<{
    score: number;
    passed: boolean;
    correctCount: number;
    totalQuestions: number;
    results: { questionId: string; correct: boolean; feedback: string }[];
  } | null>(null);
  const submit = trpc.scenarios.submit.useMutation({
    onSuccess: response => {
      setResult(response);
      toast.success("Scenario practice recorded", { description: response.passed ? "Your evidence-led decision sequence is on track." : "Use the feedback to refine your field decision." });
    },
    onError: error => toast.error("Unable to record scenario practice", { description: error.message }),
  });

  if (!scenario) {
    return <TrainingShell><main className="mx-auto max-w-xl px-5 py-20 text-center"><ClipboardCheck className="mx-auto h-10 w-10 text-[#668468]" /><h1 className="mt-5 font-serif text-3xl font-semibold text-[#263a2d]">Scenario not found</h1><Button onClick={() => setLocation("/dashboard")} className="mt-6 rounded-full bg-[#315f47] hover:bg-[#214d36]">Return to dashboard</Button></main></TrainingShell>;
  }

  const ready = scenario.questions.every(question => answers[question.id]);
  const submitScenario = () => {
    if (!isAuthenticated) return startLogin();
    if (!ready) return toast.message("Complete every decision", { description: "Choose a response for each evidence check before submitting your practice." });
    submit.mutate({ scenarioId: scenario.id, answers });
  };

  return (
    <TrainingShell>
      <main className="mx-auto max-w-[980px] px-5 py-8 sm:px-8 lg:py-12">
        <button type="button" onClick={() => setLocation(`/course/${scenario.moduleId}`)} className="mb-6 inline-flex items-center gap-1 text-xs font-bold text-[#69806d] transition-colors hover:text-[#1f4a37]"><ChevronLeft className="h-3.5 w-3.5" />Return to linked module</button>
        <article className="overflow-hidden rounded-[26px] border border-[#dce5d7] bg-[#fcfcf8] shadow-[0_16px_38px_rgba(39,67,47,.07)]">
          <header className="border-b border-[#e1e8dd] bg-[#edf5e9] px-6 py-7 sm:px-10 sm:py-9"><div className="flex flex-wrap items-center gap-3"><Badge className="border-0 bg-[#dcebd7] px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-[#356146] hover:bg-[#dcebd7]">Applied scenario practice</Badge><span className="inline-flex items-center gap-2 text-xs font-bold text-[#527055]"><Target className="h-3.5 w-3.5" />Practice score: 67% or higher</span></div><h1 className="mt-5 font-serif text-3xl font-semibold tracking-[-0.045em] text-[#273c2e] sm:text-[38px]">{scenario.title}</h1><p className="mt-3 max-w-3xl text-sm leading-6 text-[#5d715f]">{scenario.context}</p></header>
          {!isAuthenticated ? <div className="px-6 py-12 text-center sm:px-10"><Sprout className="mx-auto h-10 w-10 text-[#5b9062]" /><h2 className="mt-5 font-serif text-2xl font-semibold text-[#304434]">Sign in to record practice</h2><p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[#6b796b]">Scenario practice does not change the course gate, but it becomes evidence in your competency portfolio.</p><Button onClick={startLogin} className="mt-6 rounded-full bg-[#315f47] px-5 text-xs font-bold hover:bg-[#214d36]">Sign in to practise</Button></div> : result ? <div className="px-6 py-8 sm:px-10 sm:py-10"><div className={cn("rounded-2xl p-6 sm:p-7", result.passed ? "bg-[#ebf4e7]" : "bg-[#fbf1e8]")}><div className="flex flex-wrap items-start justify-between gap-5"><div><div className={cn("grid h-10 w-10 place-items-center rounded-full", result.passed ? "bg-[#68a16c] text-white" : "bg-[#d68a4f] text-white")}>{result.passed ? <CheckCircle2 className="h-5 w-5" /> : <CircleAlert className="h-5 w-5" />}</div><p className="mt-4 text-[10px] font-bold uppercase tracking-[0.18em] text-[#728671]">Practice outcome</p><h2 className="mt-2 font-serif text-3xl font-semibold tracking-[-0.04em] text-[#2d4934]">{result.passed ? "Evidence sequence applied." : "Refine the decision sequence."}</h2><p className="mt-2 text-sm text-[#58705a]">You selected {result.correctCount} of {result.totalQuestions} evidence-led decisions.</p></div><div className="rounded-2xl bg-white/60 px-6 py-4 text-center"><p className="font-serif text-4xl font-semibold tracking-[-0.05em] text-[#315a3d]">{result.score}%</p><p className="mt-1 text-[10px] font-bold uppercase tracking-[0.15em] text-[#708370]">Practice score</p></div></div></div><div className="mt-8 rounded-2xl border border-[#d9e6d5] bg-[#f8fbf6] p-5"><p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#718571]">Field reflection</p><p className="mt-3 text-sm leading-6 text-[#466049]">{scenario.reflectionPrompt}</p></div><div className="mt-8 space-y-4"><p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#819080]">Decision feedback</p>{scenario.questions.map((question, index) => { const item = result.results.find(entry => entry.questionId === question.id); return <div key={question.id} className={cn("rounded-2xl border p-5", item?.correct ? "border-[#d8e7d5] bg-[#fbfdf9]" : "border-[#eadccf] bg-[#fffcf8]")}><div className="flex gap-3"><span className={cn("grid h-6 w-6 shrink-0 place-items-center rounded-full text-[10px] font-extrabold", item?.correct ? "bg-[#dff0da] text-[#357243]" : "bg-[#f5e2d2] text-[#a66230]")}>{item?.correct ? <CheckCircle2 className="h-3.5 w-3.5" /> : String(index + 1)}</span><div><p className="text-sm font-bold leading-6 text-[#344838]">{question.prompt}</p><p className="mt-2 text-xs leading-5 text-[#617162]">{item?.feedback}</p></div></div></div>; })}</div><div className="mt-8 flex flex-wrap justify-between gap-3"><Button variant="outline" onClick={() => { setResult(null); setAnswers({}); }} className="rounded-full border-[#c9d7c5] text-xs font-bold text-[#426045] hover:bg-[#edf3ea]"><RotateCcw className="mr-1.5 h-3.5 w-3.5" />Practise again</Button><Button onClick={() => setLocation(`/course/${scenario.moduleId}`)} className="rounded-full bg-[#315f47] px-5 text-xs font-bold hover:bg-[#214d36]">Return to module<ChevronRight className="ml-1 h-3.5 w-3.5" /></Button></div></div> : <div className="px-6 py-8 sm:px-10 sm:py-10"><section className="rounded-2xl border border-[#d8e6d5] bg-[#f7fbf4] p-5"><p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#648264]">Decision brief</p><h2 className="mt-3 font-serif text-2xl font-semibold text-[#2b4532]">{scenario.decisionPrompt}</h2><div className="mt-5 grid gap-3 sm:grid-cols-2">{scenario.evidenceChecklist.map(item => <div key={item} className="flex gap-2 rounded-xl border border-[#deeadb] bg-white/65 p-3 text-xs leading-5 text-[#48614b]"><CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#609766]" />{item}</div>)}</div></section><div className="mt-8 space-y-8">{scenario.questions.map((question, index) => <section key={question.id}><div className="flex gap-3"><span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-[#e7eee3] text-[10px] font-extrabold text-[#416847]">{String(index + 1).padStart(2, "0")}</span><h2 className="pt-0.5 text-[15px] font-bold leading-6 text-[#334838]">{question.prompt}</h2></div><div className="mt-4 grid gap-2 pl-9">{question.options.map(option => { const selected = answers[question.id] === option.id; return <button type="button" key={option.id} onClick={() => setAnswers(current => ({ ...current, [question.id]: option.id }))} className={cn("flex items-center gap-3 rounded-xl border px-4 py-3 text-left text-sm transition-colors", selected ? "border-[#78a679] bg-[#eef6ea] text-[#2f5a39]" : "border-[#e2e7df] bg-white text-[#556856] hover:border-[#c4d3c1] hover:bg-[#fafcf8]")}><span className={cn("grid h-5 w-5 shrink-0 place-items-center rounded-full border text-[9px] font-bold", selected ? "border-[#5e9762] bg-[#5e9762] text-white" : "border-[#cbd6c7] text-[#7b8a79]")}>{selected ? <CheckCircle2 className="h-3.5 w-3.5" /> : option.id.toUpperCase()}</span>{option.label}</button>; })}</div></section>)}</div><div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-[#e7ece4] pt-6"><p className="text-xs leading-5 text-[#748273]">{Object.keys(answers).length} of {scenario.questions.length} decisions selected</p><Button onClick={submitScenario} disabled={submit.isPending} className="rounded-full bg-[#315f47] px-5 text-xs font-bold hover:bg-[#214d36]">{submit.isPending ? "Recording practice" : "Check your decision"}<ChevronRight className="ml-1 h-3.5 w-3.5" /></Button></div></div>}
        </article>
      </main>
    </TrainingShell>
  );
}
