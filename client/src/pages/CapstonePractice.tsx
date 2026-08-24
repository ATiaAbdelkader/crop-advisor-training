import { useAuth } from "@/_core/hooks/useAuth";
import FieldReadinessRubric from "@/components/FieldReadinessRubric";
import LearnerLoading from "@/components/LearnerLoading";
import TrainingShell from "@/components/TrainingShell";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { startLogin } from "@/const";
import { trpc } from "@/lib/trpc";
import {
  capstoneCases,
  createEmptyCapstoneSubmissionPayload,
  isCompleteCapstoneSubmission,
} from "@shared/fieldReadiness";
import {
  ArrowLeft,
  CheckCircle2,
  ClipboardCheck,
  MapPinned,
  RefreshCw,
  Save,
  ShieldCheck,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { useLocation, useRoute } from "wouter";

export default function CapstonePractice() {
  const { isAuthenticated } = useAuth();
  const [, params] = useRoute("/capstone/:capstoneId");
  const requested = params?.capstoneId ? capstoneCases[params.capstoneId] : undefined;
  const activeCapstone = requested ?? Object.values(capstoneCases)[0];
  const [, setLocation] = useLocation();
  const utils = trpc.useUtils();
  const submissionsQuery = trpc.fieldReadiness.capstones.list.useQuery(undefined, {
    enabled: isAuthenticated,
  });
  const savedSubmission = useMemo(
    () => submissionsQuery.data?.find(item => item.capstoneId === activeCapstone.id),
    [activeCapstone.id, submissionsQuery.data]
  );
  const [payload, setPayload] = useState(() => createEmptyCapstoneSubmissionPayload(activeCapstone));

  useEffect(() => {
    setPayload(savedSubmission?.payload ?? createEmptyCapstoneSubmissionPayload(activeCapstone));
  }, [activeCapstone, savedSubmission]);

  const saveMutation = trpc.fieldReadiness.capstones.save.useMutation({
    onSuccess: async () => {
      await Promise.all([
        utils.fieldReadiness.capstones.list.invalidate(),
        utils.fieldReadiness.overview.invalidate(),
      ]);
      toast.success("Capstone response saved");
    },
    onError: error => toast.error("Unable to save capstone response", { description: error.message }),
  });
  const complete = isCompleteCapstoneSubmission(payload, activeCapstone);

  if (!isAuthenticated) {
    return <TrainingShell><main className="mx-auto max-w-xl px-5 py-20 text-center sm:px-8"><MapPinned className="mx-auto h-10 w-10 text-[#5c8d61]" /><h1 className="mt-5 font-serif text-3xl font-semibold text-[#263a2d]">Work an integrated farm case</h1><p className="mt-3 text-sm leading-6 text-[#627262]">Sign in to save private capstone analysis and field-readiness self-review.</p><Button onClick={startLogin} className="mt-7 rounded-full bg-[#315f47] hover:bg-[#214d36]">Sign in to begin</Button></main></TrainingShell>;
  }
  if (submissionsQuery.isLoading) return <TrainingShell wide><LearnerLoading message="Opening integrated capstone practice" /></TrainingShell>;
  if (submissionsQuery.isError) {
    return <TrainingShell><main className="mx-auto max-w-xl px-5 py-20 text-center sm:px-8"><RefreshCw className="mx-auto h-10 w-10 text-[#a77c36]" /><h1 className="mt-5 font-serif text-3xl font-semibold text-[#263a2d]">Capstone evidence is unavailable</h1><Button onClick={() => submissionsQuery.refetch()} className="mt-7 rounded-full bg-[#315f47] hover:bg-[#214d36]">Retry</Button></main></TrainingShell>;
  }

  return <TrainingShell wide><main className="mx-auto max-w-[1360px] px-5 py-8 sm:px-8 lg:py-10">
    <button type="button" onClick={() => setLocation("/field-readiness")} className="inline-flex items-center gap-2 text-xs font-bold text-[#526f55] hover:text-[#214d36]"><ArrowLeft className="h-3.5 w-3.5" />Field Readiness Portfolio</button>
    <div className="mt-5 grid gap-6 xl:grid-cols-[280px_1fr]">
      <aside className="rounded-[24px] border border-[#dfe7dc] bg-[#fcfcf8] p-5"><p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#698068]">Integrated capstones</p><div className="mt-4 space-y-2">{Object.values(capstoneCases).map(capstone => <button key={capstone.id} type="button" onClick={() => setLocation(`/capstone/${capstone.id}`)} className={`w-full rounded-xl border p-3 text-left ${capstone.id === activeCapstone.id ? "border-[#76a16f] bg-[#edf6e9]" : "border-[#e0e8de] bg-[#fafcf9] hover:bg-[#f1f7ee]"}`}><p className="text-sm font-bold leading-5 text-[#3a553e]">{capstone.title.replace("Capstone: ", "")}</p><p className="mt-1 text-xs text-[#718271]">{submissionsQuery.data?.some(entry => entry.capstoneId === capstone.id) ? "Draft saved" : "Not started"}</p></button>)}</div></aside>
      <section>
        <header className="rounded-[26px] border border-[#dce6d7] bg-[#edf4e9] px-6 py-7 sm:px-9"><p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#60815f]">Integrated advisory capstone</p><h1 className="mt-3 font-serif text-3xl font-semibold tracking-[-0.04em] text-[#263a2d] sm:text-4xl">{activeCapstone.title.replace("Capstone: ", "")}</h1><p className="mt-3 max-w-3xl text-sm leading-6 text-[#59705a]">{activeCapstone.setting}</p></header>
        <div className="mt-6 rounded-[24px] border border-[#dfe7dc] bg-[#fcfcf8] p-6 sm:p-7"><h2 className="font-serif text-2xl font-semibold text-[#2c4733]">Decision brief</h2><p className="mt-3 text-sm leading-6 text-[#526a55]">{activeCapstone.decisionBrief}</p><div className="mt-5 grid gap-3 md:grid-cols-2">{activeCapstone.evidencePack.map(item => <p key={item} className="rounded-xl bg-[#f2f7ef] p-4 text-sm leading-6 text-[#516a53]"><CheckCircle2 className="mr-2 inline h-4 w-4 text-[#4c8355]" />{item}</p>)}</div><h3 className="mt-7 text-sm font-bold text-[#304a36]">Required advisory decisions</h3><ul className="mt-3 space-y-2">{activeCapstone.requiredDecisions.map(item => <li key={item} className="text-sm leading-6 text-[#516a53]">• {item}</li>)}</ul></div>
        <div className="mt-6 rounded-[24px] border border-[#dfe7dc] bg-[#fcfcf8] p-6 sm:p-7"><p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#658164]">Your case response</p>{activeCapstone.responsePrompts.map((prompt, index) => <label key={prompt} className="mt-6 block"><span className="text-sm font-bold text-[#304a36]">{index + 1}. {prompt}</span><Textarea value={payload.responses[index] ?? ""} onChange={event => setPayload(current => ({ ...current, responses: current.responses.map((value, responseIndex) => responseIndex === index ? event.target.value : value) }))} className="mt-3 min-h-32 bg-white" placeholder="Use dated local evidence, make uncertainty explicit, and identify a practical review trigger…" /></label>)}<label className="mt-6 block"><span className="text-sm font-bold text-[#304a36]">Written self-review</span><p className="mt-1 text-xs leading-5 text-[#6b806c]">What is strongest in your response, what remains uncertain, and what evidence or supervision would improve it?</p><Textarea value={payload.selfReview} onChange={event => setPayload(current => ({ ...current, selfReview: event.target.value }))} className="mt-3 min-h-32 bg-white" /></label><FieldReadinessRubric values={payload.rubric} onChange={(criterionId, value) => setPayload(current => ({ ...current, rubric: { ...current.rubric, [criterionId]: value } }))} /><div className="mt-6 flex flex-wrap items-center gap-3"><Button disabled={saveMutation.isPending} onClick={() => saveMutation.mutate({ capstoneId: activeCapstone.id, payload })} className="rounded-full bg-[#315f47] text-xs font-bold hover:bg-[#214d36]"><Save className="mr-1.5 h-3.5 w-3.5" />{saveMutation.isPending ? "Saving response" : "Save capstone response"}</Button><p className={`text-xs font-bold ${complete ? "text-[#3d7748]" : "text-[#8c713b]"}`}><ClipboardCheck className="mr-1.5 inline h-3.5 w-3.5" />{complete ? "Self-review completion check met" : "Write a substantive response and score every rubric criterion"}</p></div><p className="mt-5 rounded-xl bg-[#f3f8f0] p-4 text-xs leading-5 text-[#537056]"><ShieldCheck className="mr-2 inline h-4 w-4" />This self-review is practical evidence, not a substitute for current local legal, label, laboratory, extension, or specialist advice.</p></div>
      </section>
    </div>
  </main></TrainingShell>;
}
