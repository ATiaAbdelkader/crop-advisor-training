import { useAuth } from "@/_core/hooks/useAuth";
import LearnerLoading from "@/components/LearnerLoading";
import TrainingShell from "@/components/TrainingShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { trpc } from "@/lib/trpc";
import { cropAdvisorCourse } from "@shared/curriculum";
import { fieldInquiryPeerReviewBoundary, fieldInquiryPeerReviewRequirements } from "@shared/fieldInquiryPeerReview";
import { fieldInquiryPeerReflectionBoundary, fieldInquiryPeerReflectionPrompts, fieldInquiryPeerReflectionRequirements } from "@shared/fieldInquiryPeerReflections";
import { ArrowLeft, CheckCircle2, Copy, Link2, LockKeyhole, RefreshCw, ShieldCheck, UserRoundCheck, UsersRound } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useLocation, useParams } from "wouter";

type InquiryDraft = { decisionQuestion: string; observationPlan: string; interpretation: string; boundedNextAction: string; recheckOrReferral: string };
const emptyDraft: InquiryDraft = { decisionQuestion: "", observationPlan: "", interpretation: "", boundedNextAction: "", recheckOrReferral: "" };
const decisionFields: ReadonlyArray<{ key: keyof InquiryDraft; label: string; helper: string }> = [
  { key: "decisionQuestion", label: "Field decision question", helper: "What decision must be made from this inquiry?" },
  { key: "observationPlan", label: "Observation and comparison plan", helper: "What will you observe, record, and compare before acting?" },
  { key: "interpretation", label: "Interpretation with uncertainty", helper: "What does the evidence suggest, and what remains unconfirmed?" },
  { key: "boundedNextAction", label: "Bounded next action", helper: "What safe, evidence-led next step will you take or investigate?" },
  { key: "recheckOrReferral", label: "Recheck or referral trigger", helper: "What would you review, and when would authorised advice or referral be needed?" },
];

export default function FieldInquiryPeerReview() {
  const { moduleId } = useParams<{ moduleId: string }>();
  const module = cropAdvisorCourse.modules.find(item => item.id === moduleId);
  const { isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const utils = trpc.useUtils();
  const [draft, setDraft] = useState<InquiryDraft>(emptyDraft);
  const [pairLabel, setPairLabel] = useState("");
  const inquiryQuery = trpc.fieldInquiryPeerReview.mine.useQuery({ moduleId: moduleId ?? "unknown-module" }, { enabled: isAuthenticated && Boolean(module) });
  const saveDecision = trpc.fieldInquiryPeerReview.saveDecision.useMutation({
    onSuccess: async decision => { await utils.fieldInquiryPeerReview.mine.invalidate({ moduleId: decision.moduleId }); toast.success("Field Inquiry decision saved", { description: "Creating a new save closes any active pair link so your peer always sees the current decision." }); },
    onError: error => toast.error("Unable to save Field Inquiry", { description: error.message }),
  });
  const createPair = trpc.fieldInquiryPeerReview.createPair.useMutation({
    onSuccess: async () => { await utils.fieldInquiryPeerReview.mine.invalidate({ moduleId: moduleId ?? "" }); toast.success("Private peer link created", { description: "Share it only with the one learner you choose as your peer." }); },
    onError: error => toast.error("Unable to create pair", { description: error.message }),
  });
  const revokePair = trpc.fieldInquiryPeerReview.revokePair.useMutation({
    onSuccess: async () => { await utils.fieldInquiryPeerReview.mine.invalidate({ moduleId: moduleId ?? "" }); toast.message("Peer link revoked"); },
    onError: error => toast.error("Unable to revoke peer link", { description: error.message }),
  });

  useEffect(() => {
    if (inquiryQuery.data?.decision) setDraft(inquiryQuery.data.decision.payload);
  }, [inquiryQuery.data?.decision?.updatedAt]);

  if (!module) return <TrainingShell><Gate title="Field Inquiry unavailable" text="The requested module is not part of this course." action={() => setLocation("/curriculum")} /></TrainingShell>;
  if (!isAuthenticated) return <TrainingShell><Gate title="Sign in to use paired peer review" text="Your Field Inquiry and any peer link remain private to your learning account." action={() => setLocation(`/course/${module.id}`)} /></TrainingShell>;
  if (inquiryQuery.isLoading) return <TrainingShell wide><LearnerLoading message="Opening your private Field Inquiry" /></TrainingShell>;
  if (inquiryQuery.isError) return <TrainingShell><Gate title="Field Inquiry unavailable" text="Your private decision space could not be loaded." action={() => inquiryQuery.refetch()} actionLabel="Retry" /></TrainingShell>;

  const decision = inquiryQuery.data?.decision ?? null;
  const shares = inquiryQuery.data?.shares ?? [];
  const activeShare = shares.find(share => !share.revokedAt);
  const completedShare = shares.find(share => Boolean(share.reviewedAt));
  const copyPairLink = async () => {
    if (!activeShare) return;
    const link = `${window.location.origin}/field-inquiry-peer/${activeShare.shareToken}`;
    try { await navigator.clipboard.writeText(link); toast.success("Private pair link copied"); } catch { toast.message("Copy the private link", { description: link }); }
  };

  return <TrainingShell wide><main className="mx-auto max-w-[1120px] px-5 py-8 sm:px-8 lg:py-10"><button type="button" onClick={() => setLocation(`/course/${module.id}`)} className="inline-flex items-center gap-1 text-xs font-bold text-[#69806d] hover:text-[#1f4a37]"><ArrowLeft className="h-3.5 w-3.5" />Return to module</button><header className="mt-5 rounded-[28px] bg-[#245b4d] px-6 py-8 text-[#f5fbf8] sm:px-8"><div className="flex flex-wrap items-start justify-between gap-4"><div><p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#c8e4da]">Private paired learning</p><h1 className="mt-2 font-serif text-3xl font-semibold sm:text-4xl">Share one Field Inquiry with one peer.</h1><p className="mt-3 max-w-3xl text-sm leading-6 text-[#d7ece4]">Save your evidence-to-decision reasoning, then create a revocable link for one signed-in learner to leave structured, constructive feedback.</p></div><UsersRound className="h-7 w-7 text-[#c8e4da]" /></div><div className="mt-6 flex gap-2 rounded-xl border border-[#57917d] bg-[#2c6a59] p-4"><ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-[#d5ece2]" /><p className="text-xs leading-5 text-[#e0f1e9]">{fieldInquiryPeerReviewBoundary}</p></div></header><section className="mt-7 rounded-[24px] border border-[#dbe8e1] bg-[#fcfdf9] p-5 sm:p-7"><div className="flex flex-wrap items-center justify-between gap-3"><div><p className="text-[10px] font-bold uppercase tracking-[0.17em] text-[#638275]">{module.eyebrow}</p><h2 className="mt-1 font-serif text-2xl font-semibold text-[#2d4f42]">Your Field Inquiry decision</h2></div><span className="inline-flex items-center gap-1.5 rounded-full bg-[#edf7f1] px-3 py-1.5 text-[10px] font-bold text-[#42725c]"><LockKeyhole className="h-3 w-3" />Learner-owned</span></div><div className="mt-6 grid gap-5">{decisionFields.map(field => <label key={field.key} className="block"><span className="text-sm font-bold text-[#365548]">{field.label}</span><span className="mt-1 block text-xs leading-5 text-[#6c7e70]">{field.helper}</span><Textarea value={draft[field.key]} onChange={event => setDraft(current => ({ ...current, [field.key]: event.target.value }))} maxLength={fieldInquiryPeerReviewRequirements.maximumDecisionLength} className="mt-3 min-h-28 bg-white" placeholder={`Write at least ${fieldInquiryPeerReviewRequirements.minimumDecisionLength} characters.`} /></label>)}</div><div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-[#e3ece5] pt-5"><p className="text-xs leading-5 text-[#687b6d]">Saving an updated decision closes any active share link so a paired learner only sees your latest reasoning.</p><Button onClick={() => saveDecision.mutate({ moduleId: module.id, payload: draft })} disabled={saveDecision.isPending} className="rounded-full bg-[#315f47] text-xs font-bold hover:bg-[#214d36]">{saveDecision.isPending ? "Saving" : decision ? "Save updated decision" : "Save Field Inquiry"}</Button></div></section><section className="mt-7 rounded-[24px] border border-[#d5e6dc] bg-[#f4fbf7] p-5 sm:p-7"><p className="text-[10px] font-bold uppercase tracking-[0.17em] text-[#578271]">Pair link</p><h2 className="mt-2 font-serif text-2xl font-semibold text-[#2c5345]">Choose one trusted peer.</h2><p className="mt-2 max-w-3xl text-sm leading-6 text-[#567064]">A private link permits one signed-in peer to review this decision once. You can revoke an unreviewed link at any time; a completed review stays visible in your private learning record.</p>{!decision ? <p className="mt-5 rounded-xl border border-[#e2dacb] bg-[#fffaf4] p-4 text-xs leading-5 text-[#765b46]">Save your Field Inquiry before creating a paired peer-review link.</p> : activeShare ? <div className="mt-5 rounded-xl border border-[#cfe4d7] bg-white p-5"><div className="flex flex-wrap items-start justify-between gap-4"><div><p className="text-sm font-bold text-[#34584a]">{activeShare.reviewedAt ? "Paired review completed" : "Active private pair link"}</p><p className="mt-1 text-xs leading-5 text-[#647a6b]">{activeShare.pairLabel ? `Pair: ${activeShare.pairLabel}` : "No pair label added"}{activeShare.reviewerName ? ` · Reviewed by ${activeShare.reviewerName}` : ""}</p></div><div className="flex flex-wrap gap-2"><Button variant="outline" onClick={copyPairLink} className="rounded-full border-[#a7c9b6] bg-white text-xs font-bold text-[#315f47]"><Copy className="mr-1.5 h-3.5 w-3.5" />Copy link</Button>{!activeShare.reviewedAt && <Button variant="outline" onClick={() => revokePair.mutate({ id: activeShare.id })} disabled={revokePair.isPending} className="rounded-full border-[#d7b9a4] bg-white text-xs font-bold text-[#875139] hover:bg-[#fff4ec]">Revoke link</Button>}</div></div>{activeShare.feedback && <div className="mt-5 grid gap-3 sm:grid-cols-3">{Object.entries(activeShare.feedback).map(([key, value]) => <div key={key} className="rounded-xl border border-[#dcebe2] bg-[#f8fdf9] p-4"><p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#5d8675]">{key === "evidenceSeen" ? "Evidence seen" : key === "questionToTest" ? "Question to test" : "Next evidence"}</p><p className="mt-2 text-xs leading-5 text-[#4f675b]">{value}</p></div>)}</div>}</div> : <div className="mt-5 flex flex-wrap items-end gap-3"><label className="min-w-56 flex-1"><span className="text-xs font-bold text-[#547266]">Optional pair label</span><Input value={pairLabel} onChange={event => setPairLabel(event.target.value)} maxLength={fieldInquiryPeerReviewRequirements.maximumPairLabelLength} placeholder="e.g., Wednesday study pair" className="mt-2 bg-white" /></label><Button onClick={() => createPair.mutate({ decisionId: decision.id, pairLabel: pairLabel.trim() || undefined })} disabled={createPair.isPending} className="rounded-full bg-[#315f47] text-xs font-bold hover:bg-[#214d36]"><Link2 className="mr-1.5 h-3.5 w-3.5" />{createPair.isPending ? "Creating" : "Create private pair link"}</Button></div>}</section>{completedShare && <PeerFeedbackReflection shareId={completedShare.id} />}</main></TrainingShell>;
}

function Gate({ title, text, action, actionLabel = "Return to curriculum" }: { title: string; text: string; action?: () => void; actionLabel?: string }) {
  return <main className="mx-auto max-w-xl px-5 py-24 text-center"><UserRoundCheck className="mx-auto h-10 w-10 text-[#668d6b]" /><h1 className="mt-5 font-serif text-3xl font-semibold text-[#2f4836]">{title}</h1><p className="mt-3 text-sm leading-6 text-[#617461]">{text}</p>{action && <Button onClick={action} className="mt-6 rounded-full bg-[#315f47]">{actionLabel}</Button>}</main>;
}

function PeerFeedbackReflection({ shareId }: { shareId: number }) {
  const utils = trpc.useUtils();
  const [draft, setDraft] = useState({ learningTaken: "", revisedAction: "", nextEvidence: "" });
  const reflectionQuery = trpc.fieldInquiryPeerReview.reflection.useQuery({ shareId });
  const saveReflection = trpc.fieldInquiryPeerReview.saveReflection.useMutation({
    onSuccess: async () => { await utils.fieldInquiryPeerReview.reflection.invalidate({ shareId }); toast.success("Peer-feedback reflection saved"); },
    onError: error => toast.error("Unable to save reflection", { description: error.message }),
  });
  useEffect(() => { if (reflectionQuery.data?.reflection) setDraft(reflectionQuery.data.reflection.payload); }, [reflectionQuery.data?.reflection?.updatedAt]);
  if (reflectionQuery.isLoading) return <section className="mt-7 rounded-[24px] border border-[#d5e6dc] bg-[#f4fbf7] p-6"><p className="text-sm text-[#547066]">Opening your private peer-feedback reflection…</p></section>;
  if (reflectionQuery.isError) return <section className="mt-7 rounded-[24px] border border-[#e8d9cb] bg-[#fffaf5] p-6"><p className="text-sm font-semibold text-[#755a48]">Your peer-feedback reflection is unavailable.</p><Button variant="outline" onClick={() => reflectionQuery.refetch()} className="mt-3 rounded-full">Retry</Button></section>;
  return <section className="mt-7 rounded-[24px] border border-[#cfdfd6] bg-[#eef8f2] p-5 sm:p-7"><p className="text-[10px] font-bold uppercase tracking-[0.17em] text-[#578271]">Private reflection</p><h2 className="mt-2 font-serif text-2xl font-semibold text-[#2c5345]">Turn peer feedback into your next field decision.</h2><p className="mt-2 max-w-3xl text-sm leading-6 text-[#567064]">Use this private space to identify what you learned, what you will revise, and what evidence you will gather next.</p><div className="mt-6 grid gap-5">{fieldInquiryPeerReflectionPrompts.map(prompt => <label key={prompt.key}><span className="text-sm font-bold text-[#365548]">{prompt.label}</span><span className="mt-1 block text-xs leading-5 text-[#687d70]">{prompt.helper}</span><Textarea value={draft[prompt.key]} onChange={event => setDraft(current => ({ ...current, [prompt.key]: event.target.value }))} maxLength={fieldInquiryPeerReflectionRequirements.maximumResponseLength} className="mt-3 min-h-28 bg-white" placeholder={`Write at least ${fieldInquiryPeerReflectionRequirements.minimumResponseLength} characters.`} /></label>)}</div><div className="mt-5 rounded-xl border border-[#dfd2c2] bg-[#fffaf5] p-4"><p className="text-xs leading-5 text-[#735948]">{fieldInquiryPeerReflectionBoundary}</p></div><div className="mt-5 flex items-center justify-between gap-3"><p className="text-xs text-[#668071]">{reflectionQuery.data?.reflection ? "You can update this reflection as your learning develops." : "This reflection remains visible only to you."}</p><Button onClick={() => saveReflection.mutate({ shareId, payload: draft })} disabled={saveReflection.isPending} className="rounded-full bg-[#315f47] text-xs font-bold hover:bg-[#214d36]">{saveReflection.isPending ? "Saving" : reflectionQuery.data?.reflection ? "Update reflection" : "Save reflection"}</Button></div></section>;
}
