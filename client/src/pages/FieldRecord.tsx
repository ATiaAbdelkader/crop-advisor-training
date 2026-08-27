import TrainingShell from "@/components/TrainingShell";
import { Button } from "@/components/ui/button";
import { fieldRecordTemplates } from "@shared/fieldRecordTemplates";
import { ArrowLeft, ClipboardList, FileText, Printer } from "lucide-react";
import { useLocation, useParams } from "wouter";

const blankRows = Array.from({ length: 5 }, (_, index) => index + 1);

export default function FieldRecord() {
  const { recordId } = useParams<{ recordId: string }>();
  const [, setLocation] = useLocation();
  const template = fieldRecordTemplates[recordId];

  if (!template) {
    return (
      <TrainingShell>
        <main className="mx-auto max-w-3xl px-5 py-16 text-center sm:px-8">
          <ClipboardList className="mx-auto h-10 w-10 text-[#668468]" />
          <h1 className="mt-4 font-serif text-3xl font-semibold text-[#263a2d]">Record template not found</h1>
          <p className="mt-3 text-sm leading-6 text-[#607060]">Return to the curriculum and open the field record from its linked module.</p>
          <Button onClick={() => setLocation("/dashboard")} className="mt-6 rounded-full bg-[#315f47] hover:bg-[#214d36]">Return to dashboard</Button>
        </main>
      </TrainingShell>
    );
  }

  return (
    <TrainingShell wide>
      <style>{`
        @page { size: A4 portrait; margin: 10mm; }
        @media print {
          body { background: #fff !important; }
          .record-screen-only { display: none !important; }
          .record-print-sheet { box-shadow: none !important; border: 0 !important; max-width: none !important; padding: 0 !important; }
          .record-table { font-size: 9px !important; }
          .record-table th, .record-table td { padding: 7px !important; }
          .record-avoid-break { break-inside: avoid; }
        }
      `}</style>
      <main className="mx-auto max-w-6xl px-5 py-7 sm:px-8 lg:py-10">
        <div className="record-screen-only mb-6 flex flex-wrap items-center justify-between gap-4">
          <button type="button" onClick={() => setLocation(`/course/${template.moduleId}`)} className="inline-flex items-center gap-1 text-xs font-bold text-[#69806d] transition-colors hover:text-[#1f4a37]"><ArrowLeft className="h-3.5 w-3.5" />Return to linked module</button>
          <div className="flex flex-wrap gap-2"><Button variant="outline" onClick={() => setLocation(`/records/${template.id}/entry`)} className="rounded-full px-5 text-xs font-bold"><FileText className="mr-2 h-3.5 w-3.5" />Fill online</Button><Button onClick={() => window.print()} className="rounded-full bg-[#315f47] px-5 text-xs font-bold shadow-none hover:bg-[#214d36]"><Printer className="mr-2 h-3.5 w-3.5" />Print blank record</Button></div>
        </div>

        <article className="record-print-sheet rounded-[26px] border border-[#dfe8da] bg-[#fcfcf8] p-6 shadow-[0_10px_26px_rgba(39,67,47,.05)] sm:p-10">
          <header className="border-b-2 border-[#365d42] pb-6">
            <div className="flex items-start justify-between gap-5">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#658164]">Crop Advisor Training Institute</p>
                <h1 className="mt-3 font-serif text-3xl font-semibold tracking-[-0.04em] text-[#263a2d] sm:text-4xl">{template.title}</h1>
                <p className="mt-3 max-w-3xl text-sm leading-6 text-[#5b6d5d]">{template.purpose}</p>
              </div>
              <ClipboardList className="h-9 w-9 shrink-0 text-[#4c7e57]" />
            </div>
          </header>

          <section className="record-avoid-break mt-7 rounded-2xl border border-[#dce8d8] bg-[#f3f8f0] p-5">
            <h2 className="font-serif text-xl font-semibold text-[#2d4834]">Use this record in the field</h2>
            <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-6 text-[#4e6651]">
              {template.useSteps.map(step => <li key={step}>{step}</li>)}
            </ol>
          </section>

          <section className="record-avoid-break mt-7">
            <h2 className="font-serif text-xl font-semibold text-[#2d4834]">Field and crop details</h2>
            <div className="mt-4 grid gap-x-8 gap-y-5 sm:grid-cols-2">
              {template.setupFields.map(field => (
                <div key={field} className="border-b border-dashed border-[#9fb39f] pb-2">
                  <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#6c856d]">{field}</p>
                  <div className="mt-6 h-px bg-[#b7c8b6]" />
                </div>
              ))}
              <div className="border-b border-dashed border-[#9fb39f] pb-2"><p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#6c856d]">Record period</p><div className="mt-6 h-px bg-[#b7c8b6]" /></div>
            </div>
          </section>

          {template.mapSketchPrompt && (
            <section className="record-avoid-break mt-8">
              <div className="flex flex-wrap items-end justify-between gap-3">
                <div>
                  <h2 className="font-serif text-xl font-semibold text-[#2d4834]">Crop-walk map sketch</h2>
                  <p className="mt-1 max-w-3xl text-xs leading-5 text-[#607460]">{template.mapSketchPrompt}</p>
                </div>
                <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#6c856d]">North ↑ · route · key</p>
              </div>
              <div className="mt-4 min-h-52 rounded-xl border border-dashed border-[#9fb39f] bg-[linear-gradient(rgba(178,199,176,.32)_1px,transparent_1px),linear-gradient(90deg,rgba(178,199,176,.32)_1px,transparent_1px)] bg-[size:24px_24px] p-4">
                <div className="flex h-44 items-start justify-between text-[10px] font-bold uppercase tracking-[0.14em] text-[#85a086]"><span>Sketch area</span><span>Observation key</span></div>
              </div>
            </section>
          )}

          <section className="record-avoid-break mt-8">
            <div className="flex items-end justify-between gap-4">
              <h2 className="font-serif text-xl font-semibold text-[#2d4834]">Observation and action log</h2>
              <p className="text-xs text-[#6d7c6e]">Use one row per visit, decision, or material change.</p>
            </div>
            <div className="mt-4 overflow-x-auto rounded-xl border border-[#cfdccc]">
              <table className="record-table min-w-[920px] w-full border-collapse text-left text-[11px] leading-4 text-[#3f5443]">
                <thead className="bg-[#e9f1e5] text-[9px] uppercase tracking-[0.1em] text-[#527557]">
                  <tr>{template.recordColumns.map(column => <th key={column} className="border-b border-r border-[#c9d9c7] px-3 py-2 font-bold last:border-r-0">{column}</th>)}</tr>
                </thead>
                <tbody>
                  {blankRows.map(row => (
                    <tr key={row} className="h-20">
                      {template.recordColumns.map(column => <td key={column} className="border-r border-t border-[#d7e2d4] px-3 py-2 align-top last:border-r-0"><span className="text-[9px] text-[#b4c2b2]">{row}.</span></td>)}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="record-avoid-break mt-8 grid gap-5 lg:grid-cols-[1.35fr_.65fr]">
            <div className="rounded-2xl border border-[#d9e6d5] bg-[#f8fbf6] p-5">
              <h2 className="font-serif text-xl font-semibold text-[#2d4834]">Decision review</h2>
              <div className="mt-4 space-y-5">
                {template.reviewPrompts.map(prompt => (
                  <div key={prompt}>
                    <p className="text-sm font-semibold leading-6 text-[#466049]">{prompt}</p>
                    <div className="mt-5 h-px bg-[#b8c9b6]" /><div className="mt-5 h-px bg-[#b8c9b6]" />
                  </div>
                ))}
              </div>
            </div>
            <aside className="rounded-2xl border border-[#eadfc7] bg-[#fffaf0] p-5">
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#98713c]">Safety and stewardship</p>
              <p className="mt-3 text-sm leading-6 text-[#6d5630]">{template.safetyNote}</p>
            </aside>
          </section>

          <footer className="mt-8 border-t border-[#dce5d8] pt-4 text-[10px] leading-5 text-[#718271]">This blank field record supports learning and farm documentation. It does not replace local laws, product labels, laboratory interpretation, or specialist advice.</footer>
        </article>
      </main>
    </TrainingShell>
  );
}
