export function ProgressRing({ value, size = 52 }: { value: number; size?: number }) {
  const radius = 16;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (Math.max(0, Math.min(100, value)) / 100) * circumference;
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }} aria-label={`${value}% complete`} role="img">
      <svg viewBox="0 0 40 40" className="h-full w-full -rotate-90">
        <circle cx="20" cy="20" r={radius} fill="none" stroke="#dbe2d4" strokeWidth="4" />
        <circle
          cx="20"
          cy="20"
          r={radius}
          fill="none"
          stroke="#4f8063"
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-[stroke-dashoffset] duration-500"
        />
      </svg>
      <span className="absolute inset-0 grid place-items-center text-[10px] font-extrabold text-[#1c4639]">{value}%</span>
    </div>
  );
}
