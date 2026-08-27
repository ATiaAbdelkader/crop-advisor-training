import { CheckCircle2, Circle, ListChecks } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useLocation } from "wouter";
import { exerciseProgressStorageKey, fieldExerciseRoutes, isFieldExerciseRoute, parseExerciseProgress } from "@shared/exerciseProgress";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";

type Step = readonly [string, string];
export function ExerciseChecklistProgress({ steps, values, exerciseRoute }: { steps: readonly Step[]; values: Record<string, string>; exerciseRoute?: string }) {
  const { isAuthenticated } = useAuth();
  const utils = trpc.useUtils();
  const accountProgressQuery = trpc.exerciseProgress.mine.useQuery(undefined, { enabled: isAuthenticated && Boolean(exerciseRoute) });
  const syncProgress = trpc.exerciseProgress.sync.useMutation({ onSuccess: () => void utils.exerciseProgress.mine.invalidate() });
  const done = steps.filter(([id]) => Boolean(values[id]?.trim())).length;
  const routeProgress = accountProgressQuery.data?.find(entry => entry.exerciseRoute === exerciseRoute);
  const savedDone = Math.min(steps.length, Math.max(done, routeProgress?.completedPrompts ?? 0));
  const percent = Math.round((savedDone / steps.length) * 100);
  useEffect(() => {
    if (!exerciseRoute || !isFieldExerciseRoute(exerciseRoute) || !steps.length) return;
    const existing = parseExerciseProgress(localStorage.getItem(exerciseProgressStorageKey));
    existing[exerciseRoute] = { completed: done, total: steps.length, updatedAt: Date.now() };
    localStorage.setItem(exerciseProgressStorageKey, JSON.stringify(existing));
    if (isAuthenticated && accountProgressQuery.isSuccess) {
      syncProgress.mutate({ progress: [{ exerciseRoute, completedPrompts: done, totalPrompts: steps.length }] });
    }
  }, [accountProgressQuery.isSuccess, done, exerciseRoute, isAuthenticated, steps.length]);
  return <section aria-label="Exercise progress" className="mt-6 rounded-2xl border border-[#cfe1d0] bg-white/80 p-4 shadow-sm"><div className="flex items-center justify-between gap-3"><div className="flex items-center gap-2 text-sm font-bold text-[#315f47]"><ListChecks className="h-4 w-4"/>Your practice checklist</div><span className="text-xs font-bold text-[#527056]">{savedDone} of {steps.length} complete</span></div><div className="mt-3 h-2 overflow-hidden rounded-full bg-[#e6efe4]" role="progressbar" aria-valuemin={0} aria-valuemax={steps.length} aria-valuenow={savedDone} aria-label={`${savedDone} of ${steps.length} prompts complete`}><div className="h-full rounded-full bg-[#4c7e57] transition-[width] duration-200" style={{width:`${percent}%`}}/></div>{routeProgress&&routeProgress.completedPrompts>done?<p className="mt-2 text-[11px] leading-4 text-[#527056]">Your account retains {routeProgress.completedPrompts} completed prompt{routeProgress.completedPrompts===1?"":"s"} from another device. Response text stays on its original device.</p>:null}<div className="mt-3 grid gap-2 sm:grid-cols-2">{steps.map(([id,label])=>{const complete=Boolean(values[id]?.trim());return <a key={id} href={`#${id}`} className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-xs font-medium text-[#48614e] hover:bg-[#eef7ec] focus:outline-none focus:ring-2 focus:ring-[#6b9a74]">{complete?<CheckCircle2 className="h-4 w-4 text-[#4c7e57]" aria-hidden="true"/>:<Circle className="h-4 w-4 text-[#97ad9b]" aria-hidden="true"/>}<span>{label}</span></a>})}</div></section>
}

const autoExerciseRoutes=new Set(Array.from(fieldExerciseRoutes).filter(route=>route!=="/field-layout-evidence-exercise"));
export function AutoExerciseProgress(){const[location]=useLocation();const[values,setValues]=useState<Record<string,string>>({});useEffect(()=>{if(!autoExerciseRoutes.has(location))return;const read=()=>{const next:Record<string,string>={};document.querySelectorAll<HTMLTextAreaElement>("textarea[id]").forEach(x=>{next[x.id]=x.value});setValues(next)};read();document.addEventListener("input",read);return()=>document.removeEventListener("input",read)},[location]);const labels=useMemo(()=>Object.keys(values).map(id=>[id,document.querySelector(`label[for='${id}']`)?.textContent?.trim()||id]as const),[values]);if(!autoExerciseRoutes.has(location))return null;return labels.length?<aside className="mx-auto max-w-[1050px] px-5 pt-4 sm:px-8"><ExerciseChecklistProgress steps={labels} values={values} exerciseRoute={location}/></aside>:null}
