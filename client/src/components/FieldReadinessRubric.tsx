import { fieldReadinessRubric } from "@shared/fieldReadiness";

const levels = [
  { value: 0, label: "Not yet" },
  { value: 1, label: "1 · Aware" },
  { value: 2, label: "2 · Partial" },
  { value: 3, label: "3 · Demonstrated" },
  { value: 4, label: "4 · Defensible" },
];

export default function FieldReadinessRubric({ values, onChange }: { values: Record<string, number>; onChange: (criterionId: string, value: number) => void }) {
  return <section className="mt-7 rounded-[20px] border border-[#d5e4d1] bg-[#f3f8f0] p-5 sm:p-6"><p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#638062]">Structured self-review rubric</p><h2 className="mt-2 font-serif text-2xl font-semibold text-[#2d4834]">Rate the evidence, not your confidence.</h2><p className="mt-2 max-w-3xl text-sm leading-6 text-[#58705a]">Choose the lowest honest level for each criterion. A score of 4 means the evidence is clear, ethically gathered, locally grounded, and defensible at review; it is not a formal external grade.</p><div className="mt-5 space-y-4">{fieldReadinessRubric.map(criterion => <div key={criterion.id} className="rounded-xl border border-[#dbe7d7] bg-white p-4"><p className="text-sm font-bold text-[#345139]">{criterion.label}</p><p className="mt-1 text-xs leading-5 text-[#68806a]">{criterion.description}</p><div className="mt-3 flex flex-wrap gap-2">{levels.map(level => <button key={level.value} type="button" onClick={() => onChange(criterion.id, level.value)} className={`rounded-full border px-3 py-1.5 text-xs font-bold transition-colors ${values[criterion.id] === level.value ? "border-[#356d41] bg-[#356d41] text-white" : "border-[#d4e0d1] bg-[#fbfcf9] text-[#5a705c] hover:bg-[#eef5eb]"}`}>{level.label}</button>)}</div></div>)}</div></section>;
}
