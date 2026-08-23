import { Leaf } from "lucide-react";

export default function LearnerLoading({
  message = "Preparing your learning record",
}: {
  message?: string;
}) {
  return (
    <main className="mx-auto flex min-h-[58vh] max-w-xl items-center px-5 py-16 text-center" aria-live="polite" aria-busy="true">
      <div className="w-full rounded-[24px] border border-[#dfe6da] bg-[#fcfcf8] px-8 py-12 shadow-[0_12px_30px_rgba(39,67,47,.055)]">
        <span className="mx-auto grid h-11 w-11 place-items-center rounded-full bg-[#e9f0e5] text-[#3e7751]"><Leaf className="h-5 w-5 animate-pulse" /></span>
        <p className="mt-5 font-serif text-2xl font-semibold tracking-[-0.035em] text-[#2d4534]">{message}</p>
        <p className="mt-2 text-sm leading-6 text-[#6e7e6e]">Checking your completed lessons, assessment evidence, and next required activity.</p>
        <div className="mx-auto mt-7 h-1.5 w-48 overflow-hidden rounded-full bg-[#e6ebe2]"><div className="h-full w-2/3 animate-pulse rounded-full bg-[#8cab80]" /></div>
      </div>
    </main>
  );
}
