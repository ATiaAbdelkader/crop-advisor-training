import { Button } from "@/components/ui/button";
import TrainingShell from "@/components/TrainingShell";
import { quantifiedScoutingSheet } from "@shared/quantifiedScoutingSheet";
import { ArrowLeft, ClipboardList, FileDown, Printer, Search } from "lucide-react";
import { useLocation } from "wouter";

const rows = Array.from({ length: 5 }, (_, index) => index + 1);

export default function ScoutingSheet() {
  const [, setLocation] = useLocation();
  const sheet = quantifiedScoutingSheet;

  return <TrainingShell wide>
    <style>{`
      @page { size: A4 landscape; margin: 8mm; }
      @media print {
        body { background: #fff !important; }
        .scouting-sheet-screen-only { display: none !important; }
        .scouting-sheet-print { box-shadow: none !important; border: 0 !important; max-width: none !important; padding: 0 !important; }
        .scouting-sheet-table { font-size: 8px !important; }
        .scouting-sheet-table th, .scouting-sheet-table td { padding: 5px !important; }
        .scouting-sheet-avoid-break { break-inside: avoid; }
      }
    `}</style>
    <main className="mx-auto max-w-[1440px] px-5 py-7 sm:px-8 lg:py-10">
      <div className="scouting-sheet-screen-only mb-6 flex flex-wrap items-center justify-between gap-4"><button type="button" onClick={() => setLocation("/scouting-protocol")} className="inline-flex items-center gap-1 text-xs font-bold text-[#56746e] transition-colors hover:text-[#185c56]"><ArrowLeft className="h-3.5 w-3.5" />Return to scouting protocol</button><div className="flex flex-wrap gap-2"><Button variant="outline" onClick={() => setLocation("/field-readiness")} className="rounded-full px-5 text-xs font-bold"><Search className="mr-2 h-3.5 w-3.5" />Field Ready</Button><Button onClick={() => window.print()} className="rounded-full bg-[#1d6760] px-5 text-xs font-bold shadow-none hover:bg-[#124f4a]"><Printer className="mr-2 h-3.5 w-3.5" />Print / save as PDF</Button></div></div>
      <article className="scouting-sheet-print rounded-[26px] border border-[#cfe2de] bg-[#fcfefd] p-6 shadow-[0_10px_26px_rgba(26,91,83,.06)] sm:p-9">
        <header className="border-b-2 border-[#1c665e] pb-5"><div className="flex items-start justify-between gap-5"><div><p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#4d7d76]">Crop Advisor Training Institute</p><h1 className="mt-3 font-serif text-3xl font-semibold tracking-[-0.04em] text-[#234b46] sm:text-4xl">{sheet.title}</h1><p className="mt-3 max-w-4xl text-sm leading-6 text-[#56716d]">{sheet.purpose}</p></div><ClipboardList className="h-9 w-9 shrink-0 text-[#397a72]" /></div></header>
        <section className="scouting-sheet-avoid-break mt-5 rounded-2xl border border-[#d4e6e2] bg-[#eff9f6] p-5"><h2 className="font-serif text-xl font-semibold text-[#28544e]">Use this sheet in the field</h2><ol className="mt-3 grid gap-x-8 gap-y-2 pl-5 text-sm leading-6 text-[#4d6f6a] sm:grid-cols-2">{sheet.useSteps.map(step => <li key={step} className="list-decimal">{step}</li>)}</ol></section>
        <section className="scouting-sheet-avoid-break mt-6"><h2 className="font-serif text-xl font-semibold text-[#28544e]">Scouting setup</h2><div className="mt-3 grid gap-x-7 gap-y-4 sm:grid-cols-2 lg:grid-cols-3">{sheet.setupFields.map(field => <div key={field} className="border-b border-dashed border-[#9ebbb5] pb-2"><p className="text-[9px] font-bold uppercase tracking-[0.15em] text-[#61837d]">{field}</p><div className="mt-5 h-px bg-[#bad0cb]" /></div>)}</div></section>
        <section className="mt-6"><div className="flex items-end justify-between gap-4"><h2 className="font-serif text-xl font-semibold text-[#28544e]">Quantified field observations</h2><p className="text-xs text-[#6a827e]">Use one row per zone, sample, or repeatable observation unit.</p></div><div className="mt-3 overflow-x-auto rounded-xl border border-[#bdd8d2]"><table className="scouting-sheet-table min-w-[1120px] w-full border-collapse text-left text-[10px] leading-4 text-[#365954]"><thead className="bg-[#e4f2ee] text-[8px] uppercase tracking-[0.08em] text-[#4c756f]"><tr>{sheet.columns.map(column => <th key={column} className="border-b border-r border-[#bdd8d2] px-2 py-2 font-bold last:border-r-0">{column}</th>)}</tr></thead><tbody>{rows.map(row => <tr key={row} className="h-16">{sheet.columns.map(column => <td key={column} className="border-r border-t border-[#d3e6e1] px-2 py-1 align-top last:border-r-0"><span className="text-[8px] text-[#adc3bd]">{row}.</span></td>)}</tr>)}</tbody></table></div></section>
        <section className="scouting-sheet-avoid-break mt-6 grid gap-5 lg:grid-cols-[1.4fr_.6fr]"><div className="rounded-2xl border border-[#d4e6e2] bg-[#f7fcfa] p-5"><h2 className="font-serif text-xl font-semibold text-[#28544e]">Decision and review</h2><div className="mt-4 space-y-4">{sheet.reviewPrompts.map(prompt => <div key={prompt}><p className="text-sm font-semibold leading-5 text-[#486863]">{prompt}</p><div className="mt-4 h-px bg-[#b7cec8]" /><div className="mt-4 h-px bg-[#b7cec8]" /></div>)}</div></div><aside className="rounded-2xl border border-[#eadfc7] bg-[#fffaf0] p-5"><FileDown className="h-5 w-5 text-[#a57934]" /><p className="mt-4 text-[9px] font-bold uppercase tracking-[0.16em] text-[#8e713e]">Evidence boundary</p><p className="mt-3 text-sm leading-6 text-[#6d5630]">{sheet.boundary}</p></aside></section>
        <footer className="mt-6 border-t border-[#d4e3df] pt-4 text-[9px] leading-5 text-[#6a817c]">This blank sheet supports learning and field documentation. Recheck using the same route and sampling unit; record uncertainty and authorised referral rather than making unsupported recommendations.</footer>
      </article>
    </main>
  </TrainingShell>;
}
