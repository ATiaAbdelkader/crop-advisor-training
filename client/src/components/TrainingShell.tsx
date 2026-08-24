import { useAuth } from "@/_core/hooks/useAuth";
import { startLogin } from "@/const";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Award, BarChart3, BookOpenCheck, ClipboardList, Leaf, LayoutDashboard, LogOut, Medal } from "lucide-react";
import type { ReactNode } from "react";
import { useLocation } from "wouter";

const navigation = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Progress", href: "/progress", icon: BarChart3 },
  { label: "Records", href: "/records", icon: ClipboardList },
  { label: "Portfolio", href: "/portfolio", icon: Medal },
  { label: "Curriculum", href: "/course/advisory-practice", icon: BookOpenCheck },
  { label: "Credential", href: "/certificate", icon: Award },
];

export default function TrainingShell({
  children,
  wide = false,
}: {
  children: ReactNode;
  wide?: boolean;
}) {
  const { user, isAuthenticated, logout } = useAuth();
  const [location, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-[#f7f6f0] text-[#1f2c24]">
      <header className="sticky top-0 z-50 border-b border-[#d8ddd1]/90 bg-[#f7f6f0]/92 backdrop-blur-xl">
        <div className={cn("mx-auto flex h-[72px] items-center justify-between px-5 sm:px-8", wide ? "max-w-[1520px]" : "max-w-[1360px]")}>
          <button
            type="button"
            onClick={() => setLocation("/dashboard")}
            className="group flex items-center gap-3 text-left"
            aria-label="Go to Crop Advisor Training dashboard"
          >
            <span className="grid h-10 w-10 place-items-center rounded-[15px] bg-[#1c4639] text-[#f2f1e7] shadow-[0_8px_20px_rgba(28,70,57,.18)] transition-transform duration-200 group-active:scale-[.97]">
              <Leaf className="h-5 w-5" strokeWidth={2.25} />
            </span>
            <span className="hidden sm:block">
              <span className="block font-serif text-[17px] font-semibold leading-[1.1] tracking-[-0.03em]">Crop Advisor</span>
              <span className="mt-0.5 block text-[10px] font-bold uppercase tracking-[0.18em] text-[#819080]">Training Institute</span>
            </span>
          </button>

          <nav className="hidden items-center gap-1 md:flex" aria-label="Primary navigation">
            {navigation.map(item => {
              const active = location === item.href || (item.href.includes("course") && location.startsWith("/course"));
              return (
                <button
                  type="button"
                  key={item.href}
                  onClick={() => setLocation(item.href)}
                  className={cn(
                    "inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-all duration-200 active:scale-[.97]",
                    active
                      ? "bg-[#e4eadf] text-[#1c4639]"
                      : "text-[#667568] hover:bg-[#edf0e8] hover:text-[#1c4639]"
                  )}
                >
                  <item.icon className="h-3.5 w-3.5" />
                  {item.label}
                </button>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            {isAuthenticated ? (
              <>
                <div className="hidden text-right sm:block">
                  <p className="max-w-36 truncate text-sm font-semibold text-[#294237]">{user?.name || "Learner"}</p>
                  <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#879486]">Learner account</p>
                </div>
                <button
                  type="button"
                  onClick={logout}
                  className="grid h-9 w-9 place-items-center rounded-full text-[#647465] transition-colors hover:bg-[#e6eadf] hover:text-[#1c4639]"
                  aria-label="Sign out"
                  title="Sign out"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </>
            ) : (
              <Button
                onClick={() => startLogin()}
                className="rounded-full bg-[#1c4639] px-4 text-xs font-bold shadow-none transition-transform duration-200 hover:bg-[#12362b] active:scale-[.97]"
              >
                Sign in to learn
              </Button>
            )}
          </div>
        </div>
      </header>
      {children}
    </div>
  );
}
