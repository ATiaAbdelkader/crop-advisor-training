import { useAuth } from "@/_core/hooks/useAuth";
import LearnerLoading from "@/components/LearnerLoading";
import TrainingShell from "@/components/TrainingShell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { startLogin } from "@/const";
import { trpc } from "@/lib/trpc";
import { CalendarClock, CheckCircle2, CircleX, FileText, Loader2, LockKeyhole, Paperclip, Plus, RefreshCw, ShieldCheck, Upload, UsersRound, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

const allowedPreparationTypes = ["application/pdf", "text/plain", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"] as const;
const preparationAccept = allowedPreparationTypes.join(",");
const maximumPreparationFiles = 3;
const maximumPreparationBytes = 3 * 1024 * 1024;

type PreparationMaterial = { name: string; key: string; url: string; contentType: (typeof allowedPreparationTypes)[number]; sizeBytes: number };
type PreparationSlot = { id: number; title: string; status: "open" | "cancelled"; facilitatorUserId: number; preparation?: { notes: string | null; materials: readonly PreparationMaterial[] } };

function formatSlot(startsAt: Date, endsAt: Date) {
  const day = new Intl.DateTimeFormat(undefined, { weekday: "short", day: "numeric", month: "short", year: "numeric" }).format(startsAt);
  const times = new Intl.DateTimeFormat(undefined, { hour: "numeric", minute: "2-digit" }).formatRange(startsAt, endsAt);
  return `${day} · ${times}`;
}

function formatBytes(sizeBytes: number) {
  return sizeBytes < 1024 * 1024 ? `${Math.max(1, Math.ceil(sizeBytes / 1024))} KB` : `${(sizeBytes / (1024 * 1024)).toFixed(1)} MB`;
}

function toLocalInput(date: Date) {
  const offset = date.getTimezoneOffset() * 60_000;
  return new Date(date.getTime() - offset).toISOString().slice(0, 16);
}

function readAsDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("The selected file could not be read."));
    reader.onload = () => typeof reader.result === "string" ? resolve(reader.result) : reject(new Error("The selected file could not be read."));
    reader.readAsDataURL(file);
  });
}

function PreparationMaterials({ materials, compact = false }: { materials: readonly PreparationMaterial[]; compact?: boolean }) {
  if (!materials.length) return null;
  return <div className={`space-y-2 ${compact ? "mt-3" : "mt-4"}`}>{materials.map(material => <a key={material.key} href={material.url} target="_blank" rel="noreferrer" className="flex items-center justify-between gap-3 rounded-lg border border-[#cfe0d0] bg-white px-3 py-2 text-xs font-semibold text-[#3e6747] transition hover:border-[#95bc9d] hover:bg-[#f5fbf2]"><span className="flex min-w-0 items-center gap-2"><FileText className="h-3.5 w-3.5 shrink-0" /><span className="truncate">{material.name}</span></span><span className="shrink-0 font-normal text-[#6a7b6d]">{formatBytes(material.sizeBytes)}</span></a>)}</div>;
}

function ConferencePreparationEditor({ slot, onSaved }: { slot: PreparationSlot; onSaved: () => Promise<unknown> }) {
  const [notes, setNotes] = useState(slot.preparation?.notes ?? "");
  const [materials, setMaterials] = useState<PreparationMaterial[]>(() => [...(slot.preparation?.materials ?? [])]);
  const upload = trpc.caseConferences.uploadPreparationMaterial.useMutation({
    onSuccess: material => {
      setMaterials(current => [...current, material]);
      toast.success("Preparation material added", { description: "Save the preparation content to share it with reserved learners." });
    },
    onError: error => toast.error("Material upload was not completed", { description: error.message }),
  });
  const save = trpc.caseConferences.savePreparation.useMutation({
    onSuccess: async () => {
      await onSaved();
      toast.success("Conference preparation saved", { description: "Only reserved learners and authorised administrators can see it." });
    },
    onError: error => toast.error("Preparation was not saved", { description: error.message }),
  });

  useEffect(() => {
    setNotes(slot.preparation?.notes ?? "");
    setMaterials([...(slot.preparation?.materials ?? [])]);
  }, [slot.id]);

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    if (materials.length >= maximumPreparationFiles) return toast.error("Up to three preparation materials are allowed.");
    if (!allowedPreparationTypes.includes(file.type as (typeof allowedPreparationTypes)[number])) return toast.error("Use a PDF, plain-text file, or DOCX document.");
    if (file.size > maximumPreparationBytes) return toast.error("Each preparation material must be 3 MB or smaller.");
    try {
      upload.mutate({ slotId: slot.id, name: file.name, contentType: file.type as (typeof allowedPreparationTypes)[number], dataUrl: await readAsDataUrl(file) });
    } catch (error) {
      toast.error("Material upload was not completed", { description: error instanceof Error ? error.message : "The selected file could not be read." });
    }
  };

  return <section className="mt-4 rounded-xl border border-[#cce0cf] bg-[#f4faf1] p-4"><div className="flex items-start justify-between gap-3"><div><p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#5e8063]">Private preparation</p><p className="mt-1 text-xs leading-5 text-[#5d715f]">Optional notes and materials are visible only to learners with an active reservation and authorised administrators. They do not affect assessment, progression, or certification.</p></div><LockKeyhole className="mt-0.5 h-4 w-4 shrink-0 text-[#4c7f54]" /></div><div className="mt-4"><Label htmlFor={`conference-notes-${slot.id}`} className="text-xs text-[#46654a]">Preparation note <span className="font-normal text-[#718071]">(optional)</span></Label><Textarea id={`conference-notes-${slot.id}`} value={notes} maxLength={2500} onChange={event => setNotes(event.target.value)} placeholder="For example: evidence to bring, questions to consider, or an appropriate referral boundary." className="mt-2 min-h-24 bg-white text-sm" /><p className="mt-1 text-right text-[10px] text-[#718071]">{notes.length}/2,500</p></div><div className="mt-3"><div className="flex items-center justify-between gap-3"><Label className="text-xs text-[#46654a]">Materials <span className="font-normal text-[#718071]">(optional, up to 3)</span></Label><label className={`inline-flex cursor-pointer items-center gap-1.5 text-xs font-bold text-[#37683f] ${materials.length >= maximumPreparationFiles || upload.isPending ? "pointer-events-none opacity-50" : ""}`}><Upload className="h-3.5 w-3.5" />{upload.isPending ? "Uploading…" : "Add file"}<input type="file" accept={preparationAccept} className="sr-only" disabled={materials.length >= maximumPreparationFiles || upload.isPending} onChange={handleUpload} /></label></div><p className="mt-1 text-[10px] leading-4 text-[#718071]">PDF, plain text, or DOCX only; 3 MB maximum per file.</p><div className="mt-2 space-y-2">{materials.length ? materials.map(material => <div key={material.key} className="flex items-center justify-between gap-3 rounded-lg border border-[#d5e4d5] bg-white px-3 py-2 text-xs"><span className="flex min-w-0 items-center gap-2 text-[#46654a]"><Paperclip className="h-3.5 w-3.5 shrink-0" /><span className="truncate">{material.name}</span><span className="shrink-0 text-[#768477]">{formatBytes(material.sizeBytes)}</span></span><Button type="button" variant="ghost" size="icon" aria-label={`Remove ${material.name}`} onClick={() => setMaterials(current => current.filter(item => item.key !== material.key))} className="h-6 w-6 text-[#9d5e42] hover:bg-[#fff3ed] hover:text-[#8b4e33]"><X className="h-3.5 w-3.5" /></Button></div>) : <p className="rounded-lg border border-dashed border-[#cdddcc] bg-white/70 px-3 py-2 text-xs text-[#718071]">No preparation materials attached.</p>}</div></div><Button disabled={save.isPending || upload.isPending} onClick={() => save.mutate({ slotId: slot.id, notes: notes.trim() || null, materials })} className="mt-4 rounded-full bg-[#315f47] text-xs font-bold hover:bg-[#214d36]">{save.isPending ? <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" /> : <CheckCircle2 className="mr-1.5 h-3.5 w-3.5" />}Save preparation</Button></section>;
}

export default function CaseConferenceBooking() {
  const { isAuthenticated, user } = useAuth();
  const isAdmin = user?.role === "admin";
  const currentUserId = user?.id;
  const utils = trpc.useUtils();
  const learnerSlots = trpc.caseConferences.list.useQuery(undefined, { enabled: isAuthenticated });
  const adminSlotsQuery = trpc.caseConferences.adminList.useQuery(undefined, { enabled: isAuthenticated && isAdmin });
  const adminSlots = { ...adminSlotsQuery, data: adminSlotsQuery.data ?? [] };
  const [title, setTitle] = useState("Facilitator-led case conference");
  const [startsAt, setStartsAt] = useState(() => toLocalInput(new Date(Date.now() + 7 * 86_400_000)));
  const [endsAt, setEndsAt] = useState(() => toLocalInput(new Date(Date.now() + 7 * 86_400_000 + 60 * 60_000)));
  const [capacity, setCapacity] = useState("6");
  const refresh = async () => Promise.all([utils.caseConferences.list.invalidate(), utils.caseConferences.adminList.invalidate()]);
  const reserve = trpc.caseConferences.reserve.useMutation({ onSuccess: async () => { await refresh(); toast.success("Conference place reserved"); }, onError: error => toast.error("Unable to reserve this place", { description: error.message }) });
  const cancelReservation = trpc.caseConferences.cancelReservation.useMutation({ onSuccess: async () => { await refresh(); toast.success("Conference reservation cancelled"); }, onError: error => toast.error("Unable to cancel this reservation", { description: error.message }) });
  const createSlot = trpc.caseConferences.createSlot.useMutation({ onSuccess: async () => { await refresh(); toast.success("Conference availability published"); }, onError: error => toast.error("Unable to publish availability", { description: error.message }) });
  const cancelSlot = trpc.caseConferences.cancelSlot.useMutation({ onSuccess: async () => { await refresh(); toast.success("Conference slot cancelled"); }, onError: error => toast.error("Unable to cancel this slot", { description: error.message }) });
  const availableSlots = useMemo(() => learnerSlots.data ?? [], [learnerSlots.data]);

  if (!isAuthenticated) return <TrainingShell><main className="mx-auto max-w-xl px-5 py-24 text-center"><CalendarClock className="mx-auto h-10 w-10 text-[#5a8a62]" /><h1 className="mt-5 font-serif text-3xl font-semibold text-[#294a39]">Book a case conference</h1><p className="mt-3 text-sm leading-6 text-[#617461]">Sign in to reserve a private place in an administrator-published facilitator-led case conference.</p><Button onClick={startLogin} className="mt-7 rounded-full bg-[#315f47]">Sign in to continue</Button></main></TrainingShell>;
  if (learnerSlots.isLoading || (isAdmin && adminSlots.isLoading)) return <TrainingShell wide><LearnerLoading message="Loading conference availability" /></TrainingShell>;
  if (learnerSlots.isError || (isAdmin && adminSlots.isError)) return <TrainingShell><main className="mx-auto max-w-xl px-5 py-24 text-center"><RefreshCw className="mx-auto h-10 w-10 text-[#a77c36]" /><h1 className="mt-5 font-serif text-3xl font-semibold text-[#2f4836]">Conference availability is unavailable</h1><Button onClick={() => { learnerSlots.refetch(); adminSlots.refetch(); }} className="mt-6 rounded-full bg-[#315f47]">Retry</Button></main></TrainingShell>;

  return <TrainingShell wide><main className="mx-auto max-w-[1280px] px-5 py-8 sm:px-8 lg:py-10"><header className="rounded-[28px] border border-[#cce1d0] bg-[#edf6e9] px-6 py-8 sm:px-9"><div className="flex flex-wrap items-start justify-between gap-5"><div><p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#648266]">Facilitator-led case conferences</p><h1 className="mt-2 font-serif text-4xl font-semibold tracking-[-0.05em] text-[#294a39]">Discuss a field decision with a facilitator.</h1><p className="mt-3 max-w-3xl text-sm leading-6 text-[#56705a]">Reserve an available conference place to discuss evidence, uncertainty, communication, and a practical recheck. A booking and its optional preparation content support learning; neither is a formal assessment, progression gate, or certificate condition.</p></div><Badge className="border-0 bg-white px-3 py-2 text-[10px] font-bold uppercase tracking-[0.12em] text-[#4b7754]">Private reservation</Badge></div><p className="mt-5 flex gap-2 rounded-xl border border-[#cde0cf] bg-white/70 p-4 text-xs leading-5 text-[#56705a]"><ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-[#4c8355]" />Only you and authorised administrators can see your reservation and associated preparation content. No external calendar connection or automated reminder is used.</p></header>
    <section className="mt-7"><div className="flex items-center gap-3"><CalendarClock className="h-5 w-5 text-[#4d8256]" /><div><p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#668167]">Available places</p><h2 className="mt-1 font-serif text-2xl font-semibold text-[#304d38]">Choose an upcoming case conference.</h2></div></div><div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">{availableSlots.length ? availableSlots.map(slot => { const full = slot.reservedCount >= slot.capacity; const preparation = slot.isBooked ? slot.preparation : undefined; return <article key={slot.id} className={`rounded-[20px] border p-5 ${slot.isBooked ? "border-[#a7caaa] bg-[#f1f9f1]" : full ? "border-[#ead9c7] bg-[#fffaf4]" : "border-[#dce7d9] bg-[#fcfdf9]"}`}><div className="flex items-start justify-between gap-3"><div><h3 className="text-sm font-bold leading-5 text-[#385640]">{slot.title}</h3><p className="mt-2 text-xs leading-5 text-[#617462]">{formatSlot(new Date(slot.startsAt), new Date(slot.endsAt))}</p></div>{slot.isBooked ? <Badge className="border-0 bg-[#dcefdc] text-[10px] font-bold text-[#397146]">Reserved</Badge> : full ? <Badge className="border-0 bg-[#f7e8db] text-[10px] font-bold text-[#98643f]">Full</Badge> : <Badge className="border-0 bg-[#e8f2e5] text-[10px] font-bold text-[#4b7754]">{slot.capacity - slot.reservedCount} place{slot.capacity - slot.reservedCount === 1 ? "" : "s"}</Badge>}</div><p className="mt-5 text-xs leading-5 text-[#687a69]">{slot.reservedCount}/{slot.capacity} reserved. Reserve only if you can attend; you may cancel online before the start.</p>{preparation && (preparation.notes || preparation.materials.length > 0) && <aside className="mt-4 rounded-xl border border-[#c7dfc8] bg-white/80 p-3"><p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-[#4f7c56]"><LockKeyhole className="h-3.5 w-3.5" />Private preparation</p>{preparation.notes && <p className="mt-2 whitespace-pre-wrap text-xs leading-5 text-[#58705b]">{preparation.notes}</p>}<PreparationMaterials materials={preparation.materials} /></aside>}{slot.isBooked ? <Button variant="outline" disabled={cancelReservation.isPending} onClick={() => cancelReservation.mutate({ slotId: slot.id })} className="mt-5 w-full rounded-full border-[#b7cfb9] bg-white text-xs font-bold text-[#315f47]">{cancelReservation.isPending ? <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" /> : <CircleX className="mr-1.5 h-3.5 w-3.5" />}Cancel reservation</Button> : <Button disabled={full || reserve.isPending} onClick={() => reserve.mutate({ slotId: slot.id })} className="mt-5 w-full rounded-full bg-[#315f47] text-xs font-bold hover:bg-[#214d36]">{reserve.isPending ? <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" /> : <CheckCircle2 className="mr-1.5 h-3.5 w-3.5" />}Reserve place</Button>}</article>; }) : <div className="rounded-[20px] border border-dashed border-[#c9d8c8] bg-[#f8fbf6] p-6 text-sm leading-6 text-[#617462]">No conference slots are currently open. Check again after an administrator publishes availability.</div>}</div></section>
    {isAdmin && <section className="mt-9 grid gap-6 xl:grid-cols-[.8fr_1.2fr]"><article className="rounded-[24px] border border-[#dce7d9] bg-[#fcfdf9] p-6"><div className="flex items-center gap-3"><Plus className="h-5 w-5 text-[#4d8256]" /><div><p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#668167]">Administrator availability</p><h2 className="mt-1 font-serif text-2xl font-semibold text-[#304d38]">Publish a conference slot.</h2></div></div><div className="mt-5 space-y-4"><div><Label htmlFor="conference-title">Conference title</Label><Input id="conference-title" value={title} onChange={event => setTitle(event.target.value)} className="mt-2 bg-white" /></div><div><Label htmlFor="conference-start">Start time</Label><Input id="conference-start" type="datetime-local" value={startsAt} onChange={event => setStartsAt(event.target.value)} className="mt-2 bg-white" /></div><div><Label htmlFor="conference-end">End time</Label><Input id="conference-end" type="datetime-local" value={endsAt} onChange={event => setEndsAt(event.target.value)} className="mt-2 bg-white" /></div><div><Label htmlFor="conference-capacity">Learner capacity</Label><Input id="conference-capacity" type="number" min="1" max="24" value={capacity} onChange={event => setCapacity(event.target.value)} className="mt-2 bg-white" /></div><Button disabled={createSlot.isPending || !title.trim() || !startsAt || !endsAt} onClick={() => createSlot.mutate({ title: title.trim(), startsAt: new Date(startsAt), endsAt: new Date(endsAt), capacity: Number(capacity) })} className="w-full rounded-full bg-[#315f47] text-xs font-bold hover:bg-[#214d36]">{createSlot.isPending ? <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" /> : <Plus className="mr-1.5 h-3.5 w-3.5" />}Publish availability</Button></div></article><article className="rounded-[24px] border border-[#dce7d9] bg-[#fcfdf9] p-6"><div className="flex items-center gap-3"><UsersRound className="h-5 w-5 text-[#4d8256]" /><div><p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#668167]">Administrator reservations</p><h2 className="mt-1 font-serif text-2xl font-semibold text-[#304d38]">Manage published availability.</h2></div></div><div className="mt-5 space-y-3">{adminSlots.data.length ? adminSlots.data.map(slot => <article key={slot.id} className="rounded-xl border border-[#dce7d9] bg-white p-4"><div className="flex flex-wrap items-start justify-between gap-3"><div><p className="text-sm font-bold text-[#3b5841]">{slot.title}</p><p className="mt-1 text-xs text-[#687a69]">{formatSlot(new Date(slot.startsAt), new Date(slot.endsAt))} · {slot.reservedCount}/{slot.capacity} reserved</p></div><Badge className={`border-0 text-[10px] font-bold ${slot.status === "open" ? "bg-[#e8f2e5] text-[#4b7754]" : "bg-[#f7e8db] text-[#98643f]"}`}>{slot.status}</Badge></div><div className="mt-3 space-y-2">{slot.reservations.filter(reservation => reservation.status === "booked").length ? slot.reservations.filter(reservation => reservation.status === "booked").map(reservation => <p key={reservation.id} className="rounded-lg bg-[#f4f8f1] px-3 py-2 text-xs text-[#5e705f]"><LockKeyhole className="mr-1.5 inline h-3.5 w-3.5 text-[#537a58]" />{reservation.learnerName}{reservation.learnerEmail ? ` · ${reservation.learnerEmail}` : ""}</p>) : <p className="text-xs text-[#718071]">No active learner reservations.</p>}</div>{slot.preparation && slot.facilitatorUserId !== currentUserId && (slot.preparation.notes || slot.preparation.materials.length > 0) && <aside className="mt-4 rounded-lg border border-[#d5e3d5] bg-[#f5faf3] p-3"><p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#5d7f61]">Authorised administrator view</p>{slot.preparation.notes && <p className="mt-2 whitespace-pre-wrap text-xs leading-5 text-[#5e705f]">{slot.preparation.notes}</p>}<PreparationMaterials compact materials={slot.preparation.materials} /></aside>}{slot.status === "open" && slot.facilitatorUserId === currentUserId && <ConferencePreparationEditor slot={slot} onSaved={refresh} />}{slot.status === "open" && slot.facilitatorUserId === currentUserId && <Button variant="ghost" disabled={cancelSlot.isPending} onClick={() => cancelSlot.mutate({ slotId: slot.id })} className="mt-3 h-auto p-0 text-xs font-bold text-[#9a5d40] hover:bg-transparent">Cancel availability</Button>}</article>) : <p className="rounded-xl bg-[#f2f8ef] p-4 text-sm text-[#5c705d]">No slots have been published.</p>}</div></article></section>}</main></TrainingShell>;
}
