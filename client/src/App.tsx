import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import Assessment from "@/pages/Assessment";
import Certificate from "@/pages/Certificate";
import Course from "@/pages/Course";
import FieldRecord from "@/pages/FieldRecord";
import FieldRecordEntry from "@/pages/FieldRecordEntry";
import ScenarioPractice from "@/pages/ScenarioPractice";
import RecordsDashboard from "@/pages/RecordsDashboard";
import ReviewShare from "@/pages/ReviewShare";
import CompetencyPortfolio from "@/pages/CompetencyPortfolio";
import FieldReadinessHub from "@/pages/FieldReadinessHub";
import FieldPracticum from "@/pages/FieldPracticum";
import CapstonePractice from "@/pages/CapstonePractice";
import MeasurementCards from "@/pages/MeasurementCards";
import NurseryQualityPack from "@/pages/NurseryQualityPack";
import PesticideIncidentDrill from "@/pages/PesticideIncidentDrill";
import QuantifiedScoutingProtocol from "@/pages/QuantifiedScoutingProtocol";
import ScoutingSheet from "@/pages/ScoutingSheet";
import CropDiagnosisAnnotation from "@/pages/CropDiagnosisAnnotation";
import AnnotationSupervisorReviews from "@/pages/AnnotationSupervisorReviews";
import CompetencyMap from "@/pages/CompetencyMap";
import CompetencyReview from "@/pages/CompetencyReview";
import CompetencyEvidenceComparison from "@/pages/CompetencyEvidenceComparison";
import ScorecardReflection from "@/pages/ScorecardReflection";
import ScorecardReflectionLibrary from "@/pages/ScorecardReflectionLibrary";
import SupervisorCompetencyReviews from "@/pages/SupervisorCompetencyReviews";
import SupervisorCalibration from "@/pages/SupervisorCalibration";
import AssessmentTimeLimits from "@/pages/AssessmentTimeLimits";
import FieldInquiryPeerReview from "@/pages/FieldInquiryPeerReview";
import FieldInquiryPeerFeedback from "@/pages/FieldInquiryPeerFeedback";
import LearningExperience from "@/pages/LearningExperience";
import LearningTools from "@/pages/LearningTools";
import CaseConferenceBooking from "@/pages/CaseConferenceBooking";
import FertilisationPlanningLab from "@/pages/FertilisationPlanningLab";
import CropWalkEvidenceLab from "@/pages/CropWalkEvidenceLab";
import SoilSamplingQualityAudit from "@/pages/SoilSamplingQualityAudit";
import RootZoneWaterDecisionLab from "@/pages/RootZoneWaterDecisionLab";
import Home from "@/pages/Home";
import NotFound from "@/pages/NotFound";
import ProgressDashboard from "@/pages/ProgressDashboard";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/dashboard" component={Home} />
      <Route path="/progress" component={ProgressDashboard} />
      <Route path="/records" component={RecordsDashboard} />
      <Route path="/portfolio" component={CompetencyPortfolio} />
      <Route path="/field-readiness" component={FieldReadinessHub} />
      <Route path="/measurements" component={MeasurementCards} />
      <Route path="/nursery-quality" component={NurseryQualityPack} />
      <Route path="/pesticide-incident" component={PesticideIncidentDrill} />
      <Route path="/scouting-protocol" component={QuantifiedScoutingProtocol} />
      <Route path="/scouting-sheet" component={ScoutingSheet} />
      <Route path="/diagnosis-annotation" component={CropDiagnosisAnnotation} />
      <Route path="/competencies" component={CompetencyMap} />
      <Route path="/learning-experience" component={LearningExperience} />
      <Route path="/learning-tools" component={LearningTools} />
      <Route path="/case-conferences" component={CaseConferenceBooking} />
      <Route path="/fertilisation-planner" component={FertilisationPlanningLab} />
      <Route path="/crop-walk-lab" component={CropWalkEvidenceLab} />
      <Route path="/soil-sampling-audit" component={SoilSamplingQualityAudit} />
      <Route path="/root-zone-water-lab" component={RootZoneWaterDecisionLab} />
      <Route path="/competency-reflections" component={ScorecardReflectionLibrary} />
      <Route path="/competency-reflection/:assessmentId" component={ScorecardReflection} />
      <Route path="/competency-comparison/:assessmentId" component={CompetencyEvidenceComparison} />
      <Route path="/competency-review/:moduleId" component={CompetencyReview} />
      <Route path="/supervisor/competency-reviews" component={SupervisorCompetencyReviews} />
      <Route path="/supervisor/competency-calibration" component={SupervisorCalibration} />
      <Route path="/supervisor/assessment-time-limits" component={AssessmentTimeLimits} />
      <Route path="/field-inquiry-peer/:shareToken" component={FieldInquiryPeerFeedback} />
      <Route path="/field-inquiry/:moduleId" component={FieldInquiryPeerReview} />
      <Route path="/supervisor/annotation-reviews" component={AnnotationSupervisorReviews} />
      <Route path="/practicum/:entryId" component={FieldPracticum} />
      <Route path="/practicum" component={FieldPracticum} />
      <Route path="/capstone/:capstoneId" component={CapstonePractice} />
      <Route path="/review/:shareToken" component={ReviewShare} />
      <Route path="/course/:moduleId" component={Course} />
      <Route path="/scenario/:scenarioId" component={ScenarioPractice} />
      <Route path="/records/:recordId/entry/:entryId" component={FieldRecordEntry} />
      <Route path="/records/:recordId/entry" component={FieldRecordEntry} />
      <Route path="/records/:recordId" component={FieldRecord} />
      <Route path="/assessment/:assessmentId" component={Assessment} />
      <Route path="/certificate" component={Certificate} />
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster richColors closeButton />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
