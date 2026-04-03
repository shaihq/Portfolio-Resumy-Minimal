import { Switch, Route, Link, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { TemplateProvider } from "@/hooks/use-template";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Project from "@/pages/project";
import { useEffect } from "react";
import { ThemeProvider } from "next-themes";

import Landing from "@/pages/landing";
import PrivacyPolicy from "@/pages/privacy-policy";

// Temporary dev navigation to easily switch pages in the Replit preview
function DevNav() {
  const [location] = useLocation();
  
  return (
    <div className="fixed bottom-6 left-6 z-[100] flex gap-2 bg-[#1A1A1A] p-1.5 rounded-[100px] shadow-xl border border-white/10 backdrop-blur-md">
      <Link href="/" className={`cursor-pointer px-4 py-2 text-xs font-medium rounded-full transition-colors ${location === '/' ? 'bg-white text-black' : 'text-white/70 hover:text-white hover:bg-white/10'}`}>
        Home
      </Link>
      <Link href="/landing" className={`cursor-pointer px-4 py-2 text-xs font-medium rounded-full transition-colors ${location === '/landing' ? 'bg-white text-black' : 'text-white/70 hover:text-white hover:bg-white/10'}`}>
        Landing
      </Link>
    </div>
  );
}

function Router() {
  return (
    <>
      <Switch>
        <Route path="/" component={Home}/>
        <Route path="/landing" component={Landing}/>
        <Route path="/privacy-policy" component={PrivacyPolicy}/>
        <Route path="/project/:id" component={Project}/>
        <Route component={NotFound} />
      </Switch>
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