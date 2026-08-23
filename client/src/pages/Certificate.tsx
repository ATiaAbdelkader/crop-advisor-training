import { useAuth } from "@/_core/hooks/useAuth";
import LearnerLoading from "@/components/LearnerLoading";
import TrainingShell from "@/components/TrainingShell";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { Award, BadgeCheck, Download, Leaf, LockKeyhole, ShieldCheck } from "lucide-react";
import { useLocation } from "wouter";

function escapeXml(value: string) {
  return value.replace(/[<>&'\"]/g, character => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", "'": "&apos;", '\"': "&quot;" })[character] ?? character);
}

function downloadCertificate(input: { name: string; credentialId: string; issuedAt: Date | string; score: number }) {
  const issuedDate = new Date(input.issuedAt).toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" });
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="1131" viewBox="0 0 1600 1131"><rect width="1600" height="1131" fill="#f7f5ed"/><rect x="35" y="35" width="1530" height="1061" rx="18" fill="none" stroke="#1f4a37" stroke-width="5"/><rect x="54" y="54" width="1492" height="1023" rx="13" fill="none" stroke="#bdcfae" stroke-width="2"/><path d="M0 910 C300 825 540 1025 800 916 C1060 808 1275 1010 1600 895 L1600 1131 L0 1131Z" fill="#e2ebdc"/><g fill="#315d43" opacity=".9"><path d="M195 156c-50 26-72 81-51 129 49-12 82-65 51-129Zm21 18c-7 53-38 85-72 101" fill="none" stroke="#315d43" stroke-width="8" stroke-linecap="round"/><path d="M1405 156c50 26 72 81 51 129-49-12-82-65-51-129Zm-21 18c7 53 38 85 72 101" fill="none" stroke="#315d43" stroke-width="8" stroke-linecap="round"/></g><text x="800" y="220" text-anchor="middle" fill="#315d43" font-family="Georgia, serif" font-size="42" letter-spacing="8">CROP ADVISOR TRAINING INSTITUTE</text><text x="800" y="340" text-anchor="middle" fill="#25392c" font-family="Georgia, serif" font-size="82">Certificate of Completion</text><text x="800" y="415" text-anchor="middle" fill="#667665" font-family="Arial, sans-serif" font-size="25" letter-spacing="3">THIS CERTIFIES THAT</text><text x="800" y="520" text-anchor="middle" fill="#1f4a37" font-family="Georgia, serif" font-size="65" font-style="italic">${escapeXml(input.name)}</text><line x1="470" y1="548" x2="1130" y2="548" stroke="#b8c8ad" stroke-width="2"/><text x="800" y="625" text-anchor="middle" fill="#435745" font-family="Arial, sans-serif" font-size="27">has successfully completed the requirements for</text><text x="800" y="695" text-anchor="middle" fill="#273d2e" font-family="Georgia, serif" font-size="48">Crop Advisor Foundations</text><text x="800" y="759" text-anchor="middle" fill="#516452" font-family="Arial, sans-serif" font-size="23">Final assessment score: ${input.score}%  ·  Issued ${escapeXml(issuedDate)}</text><line x1="285" y1="880" x2="600" y2="880" stroke="#5a745b" stroke-width="2"/><text x="442" y="915" text-anchor="middle" fill="#586e59" font-family="Arial, sans-serif" font-size="18">Training Institute</text><circle cx="800" cy="869" r="65" fill="#315d43"/><circle cx="800" cy="869" r="51" fill="none" stroke="#d9e5d3" stroke-width="3"/><text x="800" y="878" text-anchor="middle" fill="#f7f5ed" font-family="Georgia, serif" font-size="30">CA</text><line x1="1000" y1="880" x2="1315" y2="880" stroke="#5a745b" stroke-width="2"/><text x="1157" y="915" text-anchor="middle" fill="#586e59" font-family="Arial, sans-serif" font-size="18">Credential ID: ${escapeXml(input.credentialId)}</text></svg>`;
  const blob = new Blob([svg], { type: "image/svg+xml;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `crop-advisor-certificate-${input.credentialId}.svg`;
  anchor.click();
  URL.revokeObjectURL(url);
}

export default function Certificate() {
  const { isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const overviewQuery = trpc.training.overview.useQuery(undefined, { enabled: isAuthenticated });
  const certificate = overviewQuery.data?.certificate;
  const issuedDate = certificate ? new Date(certificate.issuedAt).toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" }) : "";

  if (isAuthenticated && overviewQuery.isLoading) {
    return <TrainingShell><LearnerLoading message="Checking your credential record" /></TrainingShell>;
  }

  return (
    <TrainingShell>
      <main className="mx-auto max-w-[1120px] px-5 py-9 sm:px-8 lg:py-14">
        {certificate ? (
          <div className="overflow-hidden rounded-[28px] border border-[#d8e0d3] bg-[#f7f5ed] shadow-[0_20px_50px_rgba(39,67,47,.11)]">
            <div className="relative min-h-[560px] overflow-hidden px-6 py-12 text-center sm:px-12 sm:py-16">
              <div className="absolute inset-5 rounded-[20px] border-2 border-[#2d5a43]" /><div className="absolute inset-8 rounded-[15px] border border-[#bfd0b7]" /><div className="absolute bottom-0 left-0 right-0 h-40 bg-[radial-gradient(ellipse_at_25%_100%,#d5e1cd_0%,transparent_58%),radial-gradient(ellipse_at_75%_110%,#c5d8be_0%,transparent_56%)] opacity-80" />
              <div className="relative z-10 mx-auto max-w-3xl"><div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-[#295943] text-white"><Leaf className="h-5 w-5" /></div><p className="mt-5 text-[10px] font-bold uppercase tracking-[0.25em] text-[#55715b]">Crop Advisor Training Institute</p><p className="mt-9 font-serif text-4xl font-semibold tracking-[-0.045em] text-[#273e2f] sm:text-5xl">Certificate of Completion</p><p className="mt-8 text-[10px] font-bold uppercase tracking-[0.2em] text-[#7c897a]">This certifies that</p><p className="mt-5 font-serif text-3xl font-semibold italic tracking-[-0.035em] text-[#1e5138] sm:text-5xl">{certificate.recipientName}</p><div className="mx-auto mt-6 h-px max-w-md bg-[#b5c7ad]" /><p className="mt-7 text-sm text-[#617260]">has successfully completed the required curriculum for</p><p className="mt-3 font-serif text-2xl font-semibold text-[#2e4836]">Crop Advisor Foundations</p><p className="mt-5 text-xs font-semibold text-[#687b68]">Final assessment score: {certificate.finalScore}% &nbsp;·&nbsp; Issued {issuedDate}</p><div className="mx-auto mt-10 flex max-w-xl items-center justify-between gap-4 text-left"><div className="flex-1 border-t border-[#5d765d] pt-2 text-center text-[10px] font-bold uppercase tracking-[0.12em] text-[#677967]">Training Institute</div><span className="grid h-14 w-14 place-items-center rounded-full border-[5px] border-[#2c5b44] bg-[#f7f5ed] font-serif text-sm font-bold text-[#2c5b44]">CA</span><div className="flex-1 border-t border-[#5d765d] pt-2 text-center text-[10px] font-bold uppercase tracking-[0.12em] text-[#677967]">{certificate.credentialId}</div></div></div>
            </div>
            <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 border-t border-[#dfe6da] bg-white/70 px-6 py-5 sm:px-10"><div className="flex items-center gap-3"><BadgeCheck className="h-5 w-5 text-[#4e8757]" /><div><p className="text-sm font-bold text-[#395140]">Credential issued and verified</p><p className="mt-0.5 text-xs text-[#718071]">Store the downloadable record with your professional-development files.</p></div></div><Button onClick={() => downloadCertificate({ name: certificate.recipientName, credentialId: certificate.credentialId, issuedAt: certificate.issuedAt, score: certificate.finalScore })} className="rounded-full bg-[#315f47] px-5 text-xs font-bold shadow-none hover:bg-[#214d36]"><Download className="mr-1.5 h-3.5 w-3.5" />Download certificate</Button></div>
          </div>
        ) : (
          <div className="mx-auto max-w-lg rounded-[26px] border border-[#e0e5dc] bg-[#fcfcf8] px-8 py-12 text-center shadow-[0_10px_28px_rgba(39,67,47,.05)]"><span className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-[#f3eee3] text-[#a77c36]"><LockKeyhole className="h-5 w-5" /></span><h1 className="mt-6 font-serif text-3xl font-semibold tracking-[-0.04em] text-[#2b4031]">Your credential is waiting</h1><p className="mt-3 text-sm leading-6 text-[#6b7a6c]">Complete every module and pass the final integrated assessment at 80% or above. Your digital certificate will be issued immediately.</p><Button onClick={() => setLocation("/dashboard")} className="mt-7 rounded-full bg-[#315f47] px-5 text-xs font-bold shadow-none hover:bg-[#214d36]"><Award className="mr-1.5 h-3.5 w-3.5" />View your pathway</Button><div className="mt-7 flex items-center justify-center gap-2 text-[11px] font-semibold text-[#789077]"><ShieldCheck className="h-3.5 w-3.5" />Verification-ready credential ID</div></div>
        )}
      </main>
    </TrainingShell>
  );
}
