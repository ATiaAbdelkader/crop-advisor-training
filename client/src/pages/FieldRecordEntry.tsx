import { useAuth } from "@/_core/hooks/useAuth";
import LearnerLoading from "@/components/LearnerLoading";
import TrainingShell from "@/components/TrainingShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { startLogin } from "@/const";
import { downloadFieldRecordPdf } from "@/lib/fieldRecordPdf";
import { fieldRecordDraftStorageKey, parseFieldRecordDraft } from "@/lib/fieldRecordDrafts";
import { getSavedRecordListState } from "@/lib/fieldRecordViewState";
import RecordReviewSharing from "@/components/RecordReviewSharing";
import { trpc } from "@/lib/trpc";
import { createEmptyFieldRecordPayload, getFieldRecordTitle, MAX_FIELD_RECORD_ENTRIES, MAX_FIELD_RECORD_TITLE_LENGTH, type FieldRecordPayload } from "@shared/digitalFieldRecords";
import { fieldRecordTemplates } from "@shared/fieldRecordTemplates";
import { ArrowLeft, FileText, Plus, Printer, Save, ShieldCheck, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useLocation, useParams } from "wouter";

function updatedDate(value: Date | string) {
  return new Date(value).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
}

export default function FieldRecordEntry() {
  const { recordId, entryId } = useParams<{ recordId: string; entryId?: string }>();
  const template = fieldRecordTemplates[recordId];
  const { isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const parsedEntryId = Number(entryId);
  const hasEntryId = Number.isInteger(parsedEntryId) && parsedEntryId > 0;
  const [savedRecordId, setSavedRecordId] = useState<number | null>(hasEntryId ? parsedEntryId : null);
  const [title, setTitle] = useState(template ? getFieldRecordTitle(template) : "");
  const [payload, setPayload] = useState<FieldRecordPayload>(() => template ? createEmptyFieldRecordPayload(template) : { setup: {}, entries: [], review: [] });
  const [draftReady, setDraftReady] = useState(false);
  const [draftRestored, setDraftRestored] = useState(false);
  const [isOnline, setIsOnline] = useState(() => typeof navigator === "undefined" ? true : navigator.onLine);
  const utils = trpc.useUtils();
  const recordsQuery = trpc.fieldRecords.list.useQuery({ templateId: template?.id ?? "" }, { enabled: Boolean(template && isAuthenticated) });
  const recordQuery = trpc.fieldRecords.get.useQuery({ id: parsedEntryId }, { enabled: Boolean(template && isAuthenticated && hasEntryId) });
  const savedRecordListState = getSavedRecordListState({
    isLoading: recordsQuery.isLoading,
    isError: recordsQuery.isError,
    recordCount: recordsQuery.data?.length ?? 0,
  });
  const draftKey = template ? fieldRecordDraftStorageKey(`${template.id}:${hasEntryId ? parsedEntryId : "new"}`) : "";

  useEffect(() => {
    if (!template || typeof window === "undefined") {
      setDraftReady(true);
      return;
    }
    if (hasEntryId && recordQuery.isLoading) {
      setDraftReady(false);
      return;
    }
    setDraftReady(false);
    try {
      const draft = parseFieldRecordDraft(window.localStorage.getItem(draftKey));
      if (draft) {
        setTitle(draft.title || getFieldRecordTitle(template));
        setPayload(draft.payload);
        setDraftRestored(true);
      }
    } catch {
      window.localStorage.removeItem(draftKey);
    }
    setDraftReady(true);
  }, [draftKey, hasEntryId, recordQuery.isLoading, template]);

  useEffect(() => {
    const updateOnlineStatus = () => setIsOnline(navigator.onLine);
    window.addEventListener("online", updateOnlineStatus);
    window.addEventListener("offline", updateOnlineStatus);
    return () => {
      window.removeEventListener("online", updateOnlineStatus);
      window.removeEventListener("offline", updateOnlineStatus);
    };
  }, []);

  useEffect(() => {
    if (!template || !draftReady || (savedRecordId && isOnline) || typeof window === "undefined") return;
    const saveDraft = window.setTimeout(() => {
      window.localStorage.setItem(draftKey, JSON.stringify({ title, payload }));
    }, 400);
    return () => window.clearTimeout(saveDraft);
  }, [draftKey, draftReady, isOnline, payload, savedRecordId, template, title]);

  useEffect(() => {
    if (!template || !recordQuery.data) return;
    if (recordQuery.data.templateId !== template.id) {
      toast.error("This saved record belongs to a different template.");
      setLocation(`/records/${template.id}/entry`);
      return;
    }
    setSavedRecordId(recordQuery.data.id);
    setTitle(recordQuery.data.title);
    setPayload(recordQuery.data.payload);
  }, [recordQuery.data, setLocation, template]);

  const saveRecord = trpc.fieldRecords.save.useMutation({
    onSuccess: async record => {
      setSavedRecordId(record.id);
      setTitle(record.title);
      if (draftKey) window.localStorage.removeItem(draftKey);
      setDraftRestored(false);
      await utils.fieldRecords.list.invalidate({ templateId: record.templateId });
      toast.success("Field record saved", { description: "Your private record is ready to reopen or export." });
      setLocation(`/records/${record.templateId}/entry/${record.id}`);
    },
    onError: error => toast.error("Unable to save the record", { description: error.message }),
  });
  const deleteRecord = trpc.fieldRecords.delete.useMutation({
    onSuccess: async () => {
      await utils.fieldRecords.list.invalidate({ templateId: template?.id ?? "" });
      if (draftKey) window.localStorage.removeItem(draftKey);
      setSavedRecordId(null);
      setTitle(template ? getFieldRecordTitle(template) : "");
      setPayload(template ? createEmptyFieldRecordPayload(template) : { setup: {}, entries: [], review: [] });
      toast.success("Saved field record deleted");
      if (template) setLocation(`/records/${template.id}/entry`);
    },
    onError: error => toast.error("Unable to delete the record", { description: error.message }),
  });

  if (!template) {
    return (
      <TrainingShell>
        <main className="mx-auto max-w-3xl px-5 py-16 text-center sm:px-8"><FileText className="mx-auto h-10 w-10 text-[#668468]" /><h1 className="mt-4 font-serif text-3xl font-semibold text-[#263a2d]">Record template not found</h1><Button onClick={() => setLocation("/dashboard")} className="mt-6 rounded-full bg-[#315f47] hover:bg-[#214d36]">Return to dashboard</Button></main>
      </TrainingShell>
    );
  }

  if (!isAuthenticated) {
    return (
      <TrainingShell>
        <main className="mx-auto max-w-xl px-5 py-16 text-center sm:px-8"><ShieldCheck className="mx-auto h-10 w-10 text-[#4d7c5b]" /><h1 className="mt-5 font-serif text-3xl font-semibold text-[#263a2d]">Save a private digital record</h1><p className="mt-3 text-sm leading-6 text-[#627262]">Sign in to complete, save, reopen, and export your {template.shortTitle.toLowerCase()} without exposing it to other learners.</p><div className="mt-7 flex flex-wrap justify-center gap-3"><Button onClick={startLogin} className="rounded-full bg-[#315f47] hover:bg-[#214d36]">Sign in to start</Button><Button variant="outline" onClick={() => setLocation(`/records/${template.id}`)} className="rounded-full">View blank record</Button></div></main>
      </TrainingShell>
    );
  }

  const updateSetup = (field: string, value: string) => setPayload(current => ({ ...current, setup: { ...current.setup, [field]: value } }));
  const updateEntry = (row: number, column: string, value: string) => setPayload(current => ({ ...current, entries: current.entries.map((entry, index) => index === row ? { ...entry, [column]: value } : entry) }));
  const updateReview = (index: number, value: string) => setPayload(current => ({ ...current, review: current.review.map((answer, answerIndex) => answerIndex === index ? value : answer) }));
  const addEntry = () => setPayload(current => current.entries.length >= MAX_FIELD_RECORD_ENTRIES ? current : ({ ...current, entries: [...current.entries, Object.fromEntries(template.recordColumns.map(column => [column, ""]))] }));
  const removeEntry = (row: number) => setPayload(current => ({ ...current, entries: current.entries.filter((_, index) => index !== row) }));
  const startNew = () => {
    setSavedRecordId(null);
    setTitle(getFieldRecordTitle(template));
    setPayload(createEmptyFieldRecordPayload(template));
    window.localStorage.removeItem(draftKey);
    window.localStorage.removeItem(fieldRecordDraftStorageKey(`${template.id}:new`));
    setDraftRestored(false);
    setLocation(`/records/${template.id}/entry`);
  };
  const discardDraft = () => {
    window.localStorage.removeItem(draftKey);
    setTitle(getFieldRecordTitle(template));
    setPayload(createEmptyFieldRecordPayload(template));
    setDraftRestored(false);
  };
  const save = () => {
    if (!isOnline) {
      toast.message("Working offline", { description: "Your draft is saved on this device. Reconnect before saving it to your learner account." });
      return;
    }
    saveRecord.mutate({ id: savedRecordId ?? undefined, templateId: template.id, title, payload });
  };
  const deleteCurrent = () => {
    if (!savedRecordId) return;
    if (window.confirm("Delete this saved field record? This cannot be undone.")) deleteRecord.mutate({ id: savedRecordId });
  };
  const exportPdf = async () => {
    try {
      await downloadFieldRecordPdf({ template, title: title || getFieldRecordTitle(template), payload, exportedAt: new Date() });
      toast.success("PDF export started", { description: "The completed record is downloading to your device." });
    } catch {
      toast.error("Unable to export PDF", { description: "Check your browser download settings and try again." });
    }
  };

  if (hasEntryId && recordQuery.isLoading) return <TrainingShell wide><LearnerLoading message="Opening your saved field record" /></TrainingShell>;
  if (hasEntryId && recordQuery.isError) {
    return <TrainingShell><main className="mx-auto max-w-xl px-5 py-16 text-center sm:px-8"><FileText className="mx-auto h-10 w-10 text-[#a77c36]" /><h1 className="mt-5 font-serif text-3xl font-semibold text-[#263a2d]">Saved record unavailable</h1><p className="mt-3 text-sm leading-6 text-[#627262]">The record may have been removed or it is not available to this learner account.</p><Button onClick={() => setLocation(`/records/${template.id}/entry`)} className="mt-7 rounded-full bg-[#315f47] hover:bg-[#214d36]">Create a new record</Button></main></TrainingShell>;
  }

  return (
    <TrainingShell wide>
      <main className="mx-auto max-w-[1460px] px-5 py-7 sm:px-8 lg:py-9">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4"><button type="button" onClick={() => setLocation(`/course/${template.moduleId}`)} className="inline-flex items-center gap-1 text-xs font-bold text-[#69806d] transition-colors hover:text-[#1f4a37]"><ArrowLeft className="h-3.5 w-3.5" />Return to linked module</button><div className="flex flex-wrap gap-2">{savedRecordId && <Button variant="outline" disabled={deleteRecord.isPending} onClick={deleteCurrent} className="rounded-full border-[#e5cabc] text-xs font-bold text-[#934f37] hover:bg-[#fff5ef] hover:text-[#7d3f2b]"><Trash2 className="mr-1.5 h-3.5 w-3.5" />Delete</Button>}<Button variant="outline" onClick={() => setLocation(`/records/${template.id}`)} className="rounded-full text-xs font-bold"><Printer className="mr-1.5 h-3.5 w-3.5" />Blank template</Button><Button variant="outline" onClick={exportPdf} className="rounded-full text-xs font-bold"><FileText className="mr-1.5 h-3.5 w-3.5" />Export PDF</Button><Button disabled={saveRecord.isPending} onClick={save} className="rounded-full bg-[#315f47] text-xs font-bold hover:bg-[#214d36]"><Save className="mr-1.5 h-3.5 w-3.5" />{saveRecord.isPending ? "Saving" : "Save record"}</Button></div></div>
        <div className="grid gap-6 xl:grid-cols-[280px_minmax(0,1fr)]">
          <aside className="space-y-4 xl:sticky xl:top-24 xl:h-fit">
            <div className="rounded-[22px] border border-[#dce6d6] bg-[#edf4e9] p-5"><ShieldCheck className="h-4 w-4 text-[#4c7e57]" /><p className="mt-4 text-[10px] font-bold uppercase tracking-[0.18em] text-[#658164]">Private learner record</p><p className="mt-2 text-sm font-semibold leading-6 text-[#314b39]">Only your signed-in account can open or change saved records.</p><p className="mt-2 text-xs leading-5 text-[#607460]">PDF export works with the current form values, whether or not you save first.</p></div>
            <div className="rounded-[22px] border border-[#e0e6dc] bg-[#fcfcf8] p-3"><div className="flex items-center justify-between gap-3 px-2 py-2"><p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#7d8b7c]">Your saved records</p><Button variant="ghost" size="sm" onClick={startNew} className="h-7 rounded-full px-2 text-[10px] font-bold text-[#315f47]"><Plus className="mr-1 h-3 w-3" />New</Button></div><div className="mt-1 space-y-1">{savedRecordListState === "loading" ? <p className="px-2 py-3 text-xs text-[#738073]">Loading saved records…</p> : savedRecordListState === "error" ? <div className="rounded-xl bg-[#fff8f2] px-3 py-3"><p className="text-xs font-semibold leading-5 text-[#87543b]">Saved records could not be loaded.</p><Button variant="ghost" size="sm" disabled={recordsQuery.isFetching} onClick={() => recordsQuery.refetch()} className="mt-1 h-7 px-0 text-[10px] font-bold text-[#8d5135] hover:bg-transparent hover:text-[#6f3724]">{recordsQuery.isFetching ? "Retrying…" : "Retry"}</Button></div> : savedRecordListState === "ready" ? recordsQuery.data!.map(record => <button key={record.id} type="button" onClick={() => setLocation(`/records/${template.id}/entry/${record.id}`)} className={`w-full rounded-xl px-3 py-3 text-left transition-colors ${savedRecordId === record.id ? "bg-[#e8f0e4]" : "hover:bg-[#f1f5ef]"}`}><span className="block truncate text-xs font-bold text-[#35513b]">{record.title}</span><span className="mt-1 block text-[10px] text-[#798878]">Updated {updatedDate(record.updatedAt)}</span></button>) : <p className="px-2 py-3 text-xs leading-5 text-[#738073]">No saved {template.shortTitle.toLowerCase()} yet.</p>}</div></div>
            {savedRecordId && <RecordReviewSharing recordId={savedRecordId} />}
          </aside>
          <article className="rounded-[26px] border border-[#dfe8da] bg-[#fcfcf8] p-6 shadow-[0_10px_26px_rgba(39,67,47,.05)] sm:p-9">
            <header className="border-b-2 border-[#365d42] pb-6"><p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#658164]">Digital field record</p><h1 className="mt-3 font-serif text-3xl font-semibold tracking-[-0.04em] text-[#263a2d] sm:text-4xl">{template.title}</h1><p className="mt-3 max-w-3xl text-sm leading-6 text-[#5b6d5d]">{template.purpose}</p></header>
            {!isOnline && <div className="mt-6 rounded-xl border border-[#eadfc7] bg-[#fffaf0] px-4 py-3 text-xs leading-5 text-[#79582d]"><span className="font-bold">Offline field mode.</span> Your draft is stored locally on this device; reconnect to save it to your learner account.</div>}
            {draftRestored && !savedRecordId && <div className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#d7e6d2] bg-[#f4faf1] px-4 py-3"><p className="text-xs leading-5 text-[#466349]"><span className="font-bold">Local draft restored.</span> Continue where you left off, export it, or save it when ready.</p><Button variant="ghost" size="sm" onClick={discardDraft} className="h-7 px-2 text-[10px] font-bold text-[#547356] hover:bg-transparent">Discard draft</Button></div>}
            <section className="mt-7"><Label htmlFor="record-title" className="text-sm font-bold text-[#38563d]">Record title</Label><Input id="record-title" value={title} onChange={event => setTitle(event.target.value)} maxLength={MAX_FIELD_RECORD_TITLE_LENGTH} className="mt-2 max-w-2xl border-[#c9d9c7] bg-white" /><p className="mt-2 text-xs text-[#718071]">Use a title that helps you identify this field visit or management decision later.</p></section>
            <section className="mt-8"><h2 className="font-serif text-2xl font-semibold text-[#2d4834]">Field and crop details</h2><div className="mt-5 grid gap-5 md:grid-cols-2">{template.setupFields.map(field => <div key={field}><Label htmlFor={`setup-${field}`} className="text-xs font-bold uppercase tracking-[0.12em] text-[#678067]">{field}</Label><Input id={`setup-${field}`} value={payload.setup[field] ?? ""} onChange={event => updateSetup(field, event.target.value)} maxLength={2000} className="mt-2 border-[#c9d9c7] bg-white" /></div>)}</div></section>
            <section className="mt-9"><div className="flex flex-wrap items-end justify-between gap-4"><div><h2 className="font-serif text-2xl font-semibold text-[#2d4834]">Observation and action log</h2><p className="mt-1 text-xs leading-5 text-[#718071]">Add one row for each visit, decision, or material change.</p></div><Button variant="outline" disabled={payload.entries.length >= MAX_FIELD_RECORD_ENTRIES} onClick={addEntry} className="rounded-full text-xs font-bold"><Plus className="mr-1.5 h-3.5 w-3.5" />Add row</Button></div><div className="mt-5 overflow-x-auto rounded-xl border border-[#d2dfcf]"><table className="min-w-[1160px] w-full border-collapse"><thead className="bg-[#e9f1e5]"><tr>{template.recordColumns.map(column => <th key={column} className="min-w-44 border-b border-r border-[#c9d9c7] px-3 py-3 text-left text-[9px] font-bold uppercase tracking-[0.1em] text-[#527557] last:border-r-0">{column}</th>)}<th className="w-14 border-b border-[#c9d9c7]" /></tr></thead><tbody>{payload.entries.map((entry, row) => <tr key={row}>{template.recordColumns.map(column => <td key={column} className="border-r border-t border-[#d7e2d4] p-2 align-top last:border-r-0"><Textarea value={entry[column] ?? ""} onChange={event => updateEntry(row, column, event.target.value)} maxLength={2000} aria-label={`${column}, log row ${row + 1}`} className="min-h-24 resize-y border-0 bg-transparent p-1 text-xs leading-5 shadow-none focus-visible:ring-1" /></td>)}<td className="border-t border-[#d7e2d4] p-2 align-top"><Button variant="ghost" size="sm" disabled={payload.entries.length === 1} onClick={() => removeEntry(row)} className="h-7 px-2 text-[10px] text-[#8b5a3c] hover:bg-[#fff5ef] hover:text-[#7d4e34]">Remove</Button></td></tr>)}</tbody></table></div></section>
            <section className="mt-9 grid gap-5 lg:grid-cols-[1.35fr_.65fr]"><div className="rounded-2xl border border-[#d9e6d5] bg-[#f8fbf6] p-5"><h2 className="font-serif text-2xl font-semibold text-[#2d4834]">Decision review</h2><div className="mt-5 space-y-6">{template.reviewPrompts.map((prompt, index) => <div key={prompt}><Label htmlFor={`review-${index}`} className="text-sm font-semibold leading-6 text-[#466049]">{prompt}</Label><Textarea id={`review-${index}`} value={payload.review[index] ?? ""} onChange={event => updateReview(index, event.target.value)} maxLength={2000} className="mt-3 min-h-28 border-[#c9d9c7] bg-white" /></div>)}</div></div><aside className="rounded-2xl border border-[#eadfc7] bg-[#fffaf0] p-5"><p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#98713c]">Safety and stewardship</p><p className="mt-3 text-sm leading-6 text-[#6d5630]">{template.safetyNote}</p></aside></section>
            <footer className="mt-9 flex flex-wrap items-center justify-between gap-4 border-t border-[#dce5d8] pt-5"><p className="max-w-2xl text-xs leading-5 text-[#718271]">This record supports learning and farm documentation. It does not replace local laws, product labels, laboratory interpretation, or specialist advice.</p><div className="flex gap-2"><Button variant="outline" onClick={exportPdf} className="rounded-full text-xs font-bold"><FileText className="mr-1.5 h-3.5 w-3.5" />Export PDF</Button><Button disabled={saveRecord.isPending} onClick={save} className="rounded-full bg-[#315f47] text-xs font-bold hover:bg-[#214d36]"><Save className="mr-1.5 h-3.5 w-3.5" />{saveRecord.isPending ? "Saving" : "Save record"}</Button></div></footer>
          </article>
        </div>
      </main>
    </TrainingShell>
  );
}
