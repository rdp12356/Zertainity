import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import EducationLevel from "./pages/EducationLevel";
import MarksEntry from "./pages/MarksEntry";
import Quiz from "./pages/Quiz";
import Results from "./pages/Results";
import Pathways from "./pages/Pathways";
import Careers from "./pages/Careers";
import Admin from "./pages/Admin";
import Setup from "./pages/Setup";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/education-level" element={<EducationLevel />} />
          <Route path="/marks-entry" element={<MarksEntry />} />
          <Route path="/quiz" element={<Quiz />} />
          <Route path="/results" element={<Results />} />
          <Route path="/pathways" element={<Pathways />} />
          <Route path="/careers" element={<Careers />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/setup" element={<Setup />} />
          <Route path="/auth" element={<Auth />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
