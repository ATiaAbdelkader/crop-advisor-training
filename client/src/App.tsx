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
import SupervisorCompetencyReviews from "@/pages/SupervisorCompetencyReviews";
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
      <Route path="/competency-review/:moduleId" component={CompetencyReview} />
      <Route path="/supervisor/competency-reviews" component={SupervisorCompetencyReviews} />
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
