import TrainingShell from "@/components/TrainingShell";
import { ExerciseChecklistProgress } from "@/components/ExerciseChecklistProgress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { fieldLayoutEvidenceComplete, fieldLayoutEvidenceExerciseRequirements } from "@shared/fieldLayoutEvidenceExercise";
import { ArrowLeft, FileDown, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { useLocation } from "wouter";

const prompts = [
  ["site", "Site and field context", "Record crop, field zone, slope/drainage context, existing soil-test or site evidence, and uncertainties."],
  ["layout", "Draft layout and support context", "Sketch or describe access, beds/rows, mulch/support needs, and what requires crop-specific verification."],
  ["readiness", "Readiness checks", "Record labour, material, water, soil, or access checks before implementation; do not set specifications."],
  ["next", "Next evidence or escalation", "State the local crop/site guidance, soil-test interpretation, or specialist support needed before a layout decision."],
] as const;

export default function FieldLayoutEvidenceExercise() {
  const [, go] = useLocation();
  const [values, setValues] = useState<Record<string, string>>({});

  return <TrainingShell wide><main className="mx-auto max-w-[1050px] px-5 py-7 sm:px-8">
    <button onClick={() => go("/course/field-preparation-mulching-and-trellising")} className="inline-flex items-center gap-1 text-xs font-bold text-[#59705e]"><ArrowLeft className="h-3.5 w-3.5" />Back to Module 21</button>
    <header className="mt-5 rounded-[28px] border border-[#cfe1d0] bg-[#eef7ec] p-7"><Badge className="border-0 bg-white text-[10px] font-bold uppercase tracking-[.15em] text-[#4a7753]">Voluntary field practice</Badge><h1 className="mt-4 font-serif text-4xl font-semibold text-[#294a39]">Field Layout Evidence Exercise</h1><p className="mt-3 text-sm leading-6 text-[#557057]">Prepare a field-layout discussion record from site context, a draft layout, readiness checks, and the next evidence or escalation step.</p><p className="mt-5 flex gap-2 rounded-xl border border-[#cae0cc] bg-white/75 p-4 text-xs leading-5 text-[#527056]"><ShieldCheck className="h-4 w-4 shrink-0" />{fieldLayoutEvidenceExerciseRequirements.safetyBoundary}</p></header>
    <ExerciseChecklistProgress steps={prompts.map(([id, title]) => [id, title] as const)} values={values} exerciseRoute="/field-layout-evidence-exercise" />
    <section className="mt-7 rounded-[24px] border border-[#dce8da] bg-white p-5 sm:p-6"><h2 className="font-serif text-2xl font-semibold text-[#2f4c38]">Build a readiness record.</h2><div className="mt-5 space-y-4">{prompts.map(([id, title, hint]) => <div key={id}><Label htmlFor={id}>{title}</Label><Textarea id={id} value={values[id] ?? ""} onChange={event => setValues(current => ({ ...current, [id]: event.target.value }))} placeholder={hint} className="mt-2 min-h-24 bg-white text-sm" /></div>)}</div></section>
    <section className="mt-7 rounded-[24px] border border-[#cfe1d0] bg-[#eef7ec] p-5"><div className="flex justify-between gap-4"><p className="text-sm text-[#425f47]">{fieldLayoutEvidenceComplete(values) ? "Readiness record complete: verify crop- and site-specific decisions through current authorised guidance." : "Complete all four prompts before using this as a field-layout discussion record."}</p><Button variant="outline" onClick={() => window.print()} className="rounded-full border-[#9db99d] bg-white text-xs font-bold text-[#315f47]"><FileDown className="mr-1 h-3.5 w-3.5" />Print</Button></div><p className="mt-4 text-xs leading-5 text-[#5c735f]">{fieldLayoutEvidenceExerciseRequirements.nonGatingBoundary}</p></section>
  </main></TrainingShell>;
}
