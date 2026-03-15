import { motion } from "framer-motion";
import Navbar from "@/components/navbar";

export default function Landing() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/20">
      <Navbar />
      
      <main className="container mx-auto px-6 py-24 md:py-32 flex flex-col items-center justify-center min-h-[80vh]">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-2xl mx-auto"
        >
          <div className="inline-flex items-center justify-center px-4 py-1.5 mb-8 rounded-full border bg-muted/50 text-sm font-medium">
            <span className="flex h-2 w-2 rounded-full bg-primary mr-2"></span>
            Coming Soon
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 text-balance">
            Building something extraordinary
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground mb-10 text-balance">
            We're crafting a new experience that will change how you work. 
            Stay tuned for updates.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button className="h-12 px-8 rounded-full bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors w-full sm:w-auto">
              Get Notified
            </button>
            <button className="h-12 px-8 rounded-full border bg-background font-medium hover:bg-muted transition-colors w-full sm:w-auto">
              Learn More
            </button>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
