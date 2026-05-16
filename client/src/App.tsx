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
import { useEffect, useState } from "react";
import { ThemeProvider, useTheme } from "next-themes";
import { Home as HomeIcon, MonitorPlay, Sun, Moon } from "lucide-react";

import Landing from "@/pages/landing";
import Signup from "@/pages/signup";
import PrivacyPolicy from "@/pages/privacy-policy";
import { FloatingNav } from "@/components/floating-nav";

function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;
  const isDark = theme === "dark" || (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);
  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="fixed bottom-[60px] left-6 z-[100] w-9 h-9 flex items-center justify-center bg-[#1A1A1A] rounded-full shadow-xl border border-white/10 text-white/70 hover:text-white transition-colors"
      aria-label="Toggle light/dark mode"
    >
      {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
    </button>
  );
}

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
      <ThemeToggle />
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