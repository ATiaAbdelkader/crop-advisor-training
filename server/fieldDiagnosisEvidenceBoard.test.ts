import { expect, it } from "vitest";
import { diagnosisBoardIsComplete, fieldDiagnosisEvidenceBoardRequirements } from "../shared/fieldDiagnosisEvidenceBoard";
it("keeps the diagnosis evidence board non-diagnostic and non-gating", () => { expect(fieldDiagnosisEvidenceBoardRequirements.safetyBoundary).toContain("do not confirm"); expect(fieldDiagnosisEvidenceBoardRequirements.nonGatingBoundary).toContain("80% pass rule"); expect(diagnosisBoardIsComplete({ question:"q", pattern:"p", working:"w", alternative:"a", evidence:"e", referral:"r" })).toBe(true); });
