import { Switch, Route, Link, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { TemplateProvider } from "@/hooks/use-template";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Project from "@/pages/project";
import Jobs from "@/pages/jobs";
import { useEffect } from "react";
import { ThemeProvider } from "next-themes";
import { Home as HomeIcon, MonitorPlay } from "lucide-react";

import Landing from "@/pages/landing";
import Signup from "@/pages/signup";
import PrivacyPolicy from "@/pages/privacy-policy";
import { FloatingNav } from "@/components/floating-nav";

// Temporary dev navigation to easily switch pages in the Replit preview
function DevNav() {
  const [location] = useLocation();
  const isHome = location === "/";

  return (
    <Link
      href={isHome ? "/landing" : "/"}
      className="fixed bottom-6 left-6 z-[100] w-9 h-9 flex items-center justify-center bg-[#1A1A1A] rounded-full shadow-xl border border-white/10 text-white/70 hover:text-white transition-colors"
    >
      {isHome ? <MonitorPlay className="w-4 h-4" /> : <HomeIcon className="w-4 h-4" />}
    </Link>
  );
}

function Router() {
  const [location] = useLocation();
  const showFloatingNav = location === "/" || location.startsWith("/jobs");

  return (
    <>
      <Switch>
        <Route path="/" component={Home}/>
        <Route path="/jobs" component={Jobs}/>
        <Route path="/landing" component={Landing}/>
        <Route path="/signup" component={Signup}/>
        <Route path="/privacy-policy" component={PrivacyPolicy}/>
        <Route path="/project/:id" component={Project}/>
        <Route component={NotFound} />
      </Switch>
      {showFloatingNav && <FloatingNav />}
      <DevNav />
    </>
  );
}

function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <QueryClientProvider client={queryClient}>
        <TemplateProvider>
          <TooltipProvider>
            <Toaster />
            <Router />
          </TooltipProvider>
        </TemplateProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;