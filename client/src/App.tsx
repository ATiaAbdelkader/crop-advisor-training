import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import Assessment from "@/pages/Assessment";
import Certificate from "@/pages/Certificate";
import Course from "@/pages/Course";
import FieldRecord from "@/pages/FieldRecord";
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
      <Route path="/course/:moduleId" component={Course} />
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
