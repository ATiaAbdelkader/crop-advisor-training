import TrainingShell from "@/components/TrainingShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { trpc } from "@/lib/trpc";
import { fieldRecordTemplates } from "@shared/fieldRecordTemplates";
import { CheckCircle2, ClipboardCheck, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useParams } from "wouter";

export default function ReviewShare() {
  const { shareToken } = useParams<{ shareToken: string }>();
  const shareQuery = trpc.reviewShares.open.useQuery({ shareToken });
  const [reviewerName, setReviewerName] = useState("");
  const [reviewComment, setReviewComment] = useState("");
  const submit = trpc.reviewShares.submitReview.useMutation({ onSuccess: () => { setReviewComment(""); toast.success("Review submitted to the learner"); }, onError: error => toast.error("Unable to submit review", { description: error.message }) });
  const share = shareQuery.data;
  const template = share ? fieldRecordTemplates[share.record.templateId] : undefined;

  if (shareQuery.isLoading) return <TrainingShell><main className="mx-auto max-w-xl px-5 py-20 text-center"><ClipboardCheck className="mx-auto h-10 w-10 animate-pulse text-[#5c8d61]" /><p className="mt-5 text-sm text-[#627262]">Opening shared field record…</p></main></TrainingShell>;
  if (shareQuery.isError || !share || !template) return <TrainingShell><main className="mx-auto max-w-xl px-5 py-20 text-center"><ShieldCheck className="mx-auto h-10 w-10 text-[#a77c36]" /><h1 className="mt-5 font-serif text-3xl font-semibold text-[#263a2d]">Review link unavailable</h1><p className="mt-3 text-sm leading-6 text-[#627262]">This link may have been revoked by the learner or entered incorrectly.</p></main></TrainingShell>;
  const sendReview = () => { if (reviewerName.trim().length < 2 || reviewComment.trim().length < 10) return toast.message("Add your name and a useful review", { description: "Use at least two characters for your name and ten for the review." }); submit.mutate({ shareToken, reviewerName, reviewComment }); };

  return <TrainingShell><main className="mx-auto max-w-4xl px-5 py-8 sm:px-8 lg:py-12"><header className="rounded-[26px] border border-[#dce6d7] bg-[#edf4e9] px-6 py-7 sm:px-9"><p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#60815f]">Learner-controlled review</p><h1 className="mt-3 font-serif text-3xl font-semibold text-[#263a2d]">{share.record.title}</h1><p className="mt-3 text-sm leading-6 text-[#5c735e]">You are viewing a shared {template.shortTitle.toLowerCase()}. Add concise, evidence-focused feedback for the learner.</p></header><article className="mt-6 rounded-[24px] border border-[#dfe7dc] bg-[#fcfcf8] p-6 sm:p-8"><h2 className="font-serif text-2xl font-semibold text-[#2c4632]">Field and crop details</h2><dl className="mt-5 grid gap-4 sm:grid-cols-2">{template.setupFields.map(field => <div key={field} className="rounded-xl border border-[#e1e9df] bg-[#f8fbf6] p-4"><dt className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#6a856b]">{field}</dt><dd className="mt-2 text-sm leading-6 text-[#425d45]">{share.record.payload.setup[field] || "Not recorded"}</dd></div>)}</dl><h2 className="mt-8 font-serif text-2xl font-semibold text-[#2c4632]">Observation and action log</h2><div className="mt-4 overflow-x-auto rounded-xl border border-[#d4e0d1]"><table className="min-w-[850px] w-full border-collapse text-left text-xs"><thead className="bg-[#e9f1e5]"><tr>{template.recordColumns.map(column => <th key={column} className="border-b border-r border-[#cbd8c8] px-3 py-3 text-[9px] font-bold uppercase tracking-[0.1em] text-[#527557] last:border-r-0">{column}</th>)}</tr></thead><tbody>{share.record.payload.entries.map((entry, index) => <tr key={index}>{template.recordColumns.map(column => <td key={column} className="border-r border-t border-[#d8e2d6] px-3 py-3 align-top leading-5 text-[#48604a] last:border-r-0">{entry[column] || "—"}</td>)}</tr>)}</tbody></table></div><section className="mt-8 rounded-2xl border border-[#dbe7d7] bg-[#f7fbf4] p-5"><h2 className="font-serif text-xl font-semibold text-[#2d4834]">Provide feedback</h2><div className="mt-5 grid gap-5"><div><Label htmlFor="reviewer-name">Your name</Label><Input id="reviewer-name" value={reviewerName} onChange={event => setReviewerName(event.target.value)} className="mt-2 bg-white" /></div><div><Label htmlFor="review-comment">Evidence-focused review</Label><Textarea id="review-comment" value={reviewComment} onChange={event => setReviewComment(event.target.value)} className="mt-2 min-h-32 bg-white" placeholder="Identify the evidence that supports the decision, one improvement to consider, and a useful follow-up question." /></div><Button disabled={submit.isPending} onClick={sendReview} className="w-fit rounded-full bg-[#315f47] text-xs font-bold hover:bg-[#214d36]">{submit.isPending ? "Submitting review" : "Submit review"}<CheckCircle2 className="ml-1.5 h-3.5 w-3.5" /></Button></div></section></article></main></TrainingShell>;
}
