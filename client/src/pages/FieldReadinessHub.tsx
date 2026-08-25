import { useAuth } from "@/_core/hooks/useAuth";
import FieldReadinessResources from "@/components/FieldReadinessResources";
import LearnerLoading from "@/components/LearnerLoading";
import TrainingShell from "@/components/TrainingShell";
import { Button } from "@/components/ui/button";
import { startLogin } from "@/const";
import { trpc } from "@/lib/trpc";
import {
  capstoneCases,
  fieldReadinessRequirements,
  fieldReadinessStandards,
  isCompleteCapstoneSubmission,
  isCompleteFieldPracticum,
} from "@shared/fieldReadiness";
import {
  Award,
  CheckCircle2,
  ClipboardList,
  Compass,
  FileText,
  Flag,
  MapPinned,
  RefreshCw,
  Ruler,
  ShieldCheck,
  Sprout,
  Target,
} from "lucide-react";
import { useMemo } from "react";
import { useLocation } from "wouter";

export default function FieldReadinessHub() {
  const { isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const readinessQuery = trpc.fieldReadiness.overview.useQuery(undefined, { enabled: isAuthenticated });
  const portfolioQuery = trpc.portfolio.overview.useQuery(undefined, { enabled: isAuthenticated });
  const readiness = readinessQuery.data;
  const portfolio = portfolioQuery.data;
  const passedScenarioCount = useMemo(() => {
    const latest = new Map<string, string>();
    portfolio?.attempts.forEach(attempt => {
      if (!latest.has(attempt.scenarioId)) latest.set(attempt.scenarioId, attempt.passed);
    });
    return Array.from(latest.values()).filter(passed => passed === "yes").length;
  }, [portfolio?.attempts]);
  const completePracticums = readiness?.practicums.filter(entry => isCompleteFieldPracticum(entry.payload)).length ?? 0;
  const completeCapstones = readiness?.capstones.filter(entry => {
    const capstone = capstoneCases[entry.capstoneId];
    return capstone ? isCompleteCapstoneSubmission(entry.payload, capstone) : false;
  }).length ?? 0;
  const reflectionFoci = new Set(portfolio?.reflections.map(item => item.focus) ?? []);
  const requirements = [
    { label: "Field practicum visits", current: completePracticums, target: fieldReadinessRequirements.minimumPracticumVisits, href: "/practicum", icon: Compass },
    { label: "Integrated capstones", current: completeCapstones, target: fieldReadinessRequirements.minimumIntegratedCapstones, href: "/capstone/water-market-resilience", icon: Target },
    { label: "Digital field records", current: portfolio?.records.length ?? 0, target: fieldReadinessRequirements.minimumFieldRecords, href: "/records", icon: ClipboardList },
    { label: "Applied scenarios passed", current: passedScenarioCount, target: fieldReadinessRequirements.minimumPassedScenarios, href: "/course/water-management", icon: CheckCircle2 },
    { label: "Professional reflections", current: fieldReadinessRequirements.requiredReflectionFoci.filter(focus => reflectionFoci.has(focus)).length, target: fieldReadinessRequirements.requiredReflectionFoci.length, href: "/portfolio", icon: FileText },
  ];

  if (!isAuthenticated) return <TrainingShell><main className="mx-auto max-w-xl px-5 py-20 text-center sm:px-8"><Award className="mx-auto h-10 w-10 text-[#5c8d61]" /><h1 className="mt-5 font-serif text-3xl font-semibold text-[#263a2d]">Build field readiness</h1><p className="mt-3 text-sm leading-6 text-[#627262]">Sign in to assemble practicum evidence, integrated capstones, local intelligence, and professional reflections.</p><Button onClick={startLogin} className="mt-7 rounded-full bg-[#315f47] hover:bg-[#214d36]">Sign in to begin</Button></main></TrainingShell>;
  if (readinessQuery.isLoading || portfolioQuery.isLoading) return <TrainingShell wide><LearnerLoading message="Assembling your field-readiness portfolio" /></TrainingShell>;
  if (readinessQuery.isError || portfolioQuery.isError || !readiness || !portfolio) return <TrainingShell><main className="mx-auto max-w-xl px-5 py-20 text-center sm:px-8"><RefreshCw className="mx-auto h-10 w-10 text-[#a77c36]" /><h1 className="mt-5 font-serif text-3xl font-semibold text-[#263a2d]">Field-readiness evidence is unavailable</h1><p className="mt-3 text-sm leading-6 text-[#627262]">Your practicum and portfolio evidence remain private. Please retry loading this workspace.</p><Button onClick={() => { readinessQuery.refetch(); portfolioQuery.refetch(); }} className="mt-7 rounded-full bg-[#315f47] hover:bg-[#214d36]">Retry</Button></main></TrainingShell>;

  return <TrainingShell wide><main className="mx-auto max-w-[1360px] px-5 py-8 sm:px-8 lg:py-10">
    <header className="rounded-[28px] border border-[#d8e5d3] bg-[#173c30] px-6 py-8 text-[#f7f8f1] shadow-[0_16px_38px_rgba(35,72,52,.12)] sm:px-9"><p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#c6d9bc]">Field Readiness Portfolio</p><h1 className="mt-3 max-w-3xl font-serif text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">Turn course knowledge into safe, defensible field judgement.</h1><p className="mt-3 max-w-3xl text-sm leading-6 text-[#d9e8d4]">Build evidence through real or supervised visits, integrated advisory cases, local-source checks, economics, professional communication, ethics, and honest referral boundaries.</p><p className="mt-5 rounded-xl bg-white/10 px-4 py-3 text-xs leading-5 text-[#e4efdf]"><ShieldCheck className="mr-2 inline h-4 w-4" />{fieldReadinessRequirements.note}</p></header>
    <section className="mt-7 grid gap-4 md:grid-cols-2 xl:grid-cols-5">{requirements.map(item => { const done = item.current >= item.target; const Icon = item.icon; return <button key={item.label} type="button" onClick={() => setLocation(item.href)} className="rounded-[22px] border border-[#dfe7dc] bg-[#fcfcf8] p-5 text-left shadow-[0_8px_22px_rgba(39,67,47,.04)] transition-colors hover:bg-[#f3f8f0]"><Icon className={done ? "h-5 w-5 text-[#4e8558]" : "h-5 w-5 text-[#aa7a37]"} /><p className="mt-5 font-serif text-3xl font-semibold text-[#294539]">{item.current}<span className="text-lg text-[#81907f]">/{item.target}</span></p><p className="mt-1 text-xs font-bold uppercase tracking-[0.12em] text-[#718071]">{item.label}</p><p className="mt-3 text-xs font-semibold text-[#527555]">{done ? "Evidence target met" : "Continue building evidence"}</p></button>; })}</section>
    <section className="mt-7 grid gap-6 xl:grid-cols-[.9fr_1.1fr]"><div className="rounded-[24px] border border-[#dfe7dc] bg-[#fcfcf8] p-6 sm:p-7"><p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#658164]">Professional standard</p><h2 className="mt-2 font-serif text-2xl font-semibold text-[#2c4733]">What a field-ready adviser can do</h2><ol className="mt-5 space-y-4">{fieldReadinessStandards.map((standard, index) => <li key={standard} className="flex gap-3 text-sm leading-6 text-[#526753]"><span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-[#e8f1e5] text-xs font-bold text-[#35623d]">{index + 1}</span>{standard}</li>)}</ol><Button variant="outline" onClick={() => setLocation("/portfolio")} className="mt-6 rounded-full text-xs font-bold text-[#315f47]">Open evidence portfolio</Button></div><div className="rounded-[24px] border border-[#dfe7dc] bg-[#fcfcf8] p-6 sm:p-7"><p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#658164]">Integrated capstones</p><h2 className="mt-2 font-serif text-2xl font-semibold text-[#2c4733]">Practice the whole advisory process</h2><p className="mt-2 text-sm leading-6 text-[#5d725f]">Each case connects agronomy, water, nutrition, crop protection, economics, climate, communication, and review. Score the response criterion by criterion as well as writing a reflection.</p><div className="mt-5 grid gap-3 sm:grid-cols-2">{Object.values(capstoneCases).map(capstone => <button key={capstone.id} type="button" onClick={() => setLocation(`/capstone/${capstone.id}`)} className="rounded-xl border border-[#e0e9de] bg-[#f8fbf6] p-4 text-left transition-colors hover:bg-[#edf5ea]"><MapPinned className="h-4 w-4 text-[#4c7d56]" /><p className="mt-3 text-sm font-bold leading-5 text-[#39543e]">{capstone.title.replace("Capstone: ", "")}</p><p className="mt-2 text-xs leading-5 text-[#6b806d]">Open case</p></button>)}</div></div></section>
    <FieldReadinessResources />
    <section className="mt-7 rounded-[24px] border border-[#d9e6d5] bg-[#f7fbf4] p-6 sm:p-7"><div className="flex flex-wrap items-end justify-between gap-4"><div><p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#658164]">Field measurement and decision cards</p><h2 className="mt-2 font-serif text-2xl font-semibold text-[#2d4834]">Use a repeatable routine before changing a high-consequence field decision.</h2><p className="mt-2 max-w-3xl text-sm leading-6 text-[#58705a]">Practise representative sampling, root-zone checks, water-quality screening, drip-uniformity checks, nutrient-plan evidence, and sprayer pre-use/calibration checks. Each card shows what to record, when to review, and when to stop or refer.</p></div><Button variant="outline" onClick={() => setLocation("/measurements")} className="rounded-full border-[#9db99d] bg-white text-xs font-bold text-[#315f47] hover:bg-[#edf5e9]"><Ruler className="mr-1.5 h-3.5 w-3.5" />Open six field routines</Button></div></section>
    <section className="mt-7 rounded-[24px] border border-[#d9e6d5] bg-[#f7fbf4] p-6 sm:p-7"><div className="flex flex-wrap items-end justify-between gap-4"><div><p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#658164]">Nursery-to-stand quality pack</p><h2 className="mt-2 font-serif text-2xl font-semibold text-[#2d4834]">Protect seedling quality before it becomes an uneven field stand.</h2><p className="mt-2 max-w-3xl text-sm leading-6 text-[#58705a]">Plan traceable batches, run daily nursery checks, decide whether seedlings are field-ready, and investigate early stand losses with source-grounded evidence and hold/refer boundaries.</p></div><Button variant="outline" onClick={() => setLocation("/nursery-quality")} className="rounded-full border-[#9db99d] bg-white text-xs font-bold text-[#315f47] hover:bg-[#edf5e9]"><Sprout className="mr-1.5 h-3.5 w-3.5" />Open four quality routines</Button></div></section>
    <section className="mt-7 rounded-[24px] border border-[#d9e6d5] bg-[#f1f7ee] p-6 sm:p-7"><div className="flex flex-wrap items-end justify-between gap-4"><div><p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#658164]">Begin a practicum visit</p><h2 className="mt-2 font-serif text-2xl font-semibold text-[#2d4834]">Record an advisory visit with local context and a review trigger.</h2><p className="mt-2 max-w-3xl text-sm leading-6 text-[#58705a]">The private visit form structures verification, interview evidence, observation, provisional diagnosis, economics, safety, local sources, follow-up outcome, referral boundaries, and a criterion-level rubric.</p></div><Button onClick={() => setLocation("/practicum")} className="rounded-full bg-[#315f47] text-xs font-bold hover:bg-[#214d36]"><Flag className="mr-1.5 h-3.5 w-3.5" />Start field practicum</Button></div></section>
  </main></TrainingShell>;
}
