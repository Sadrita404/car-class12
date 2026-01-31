import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import ThemeToggle from "@/components/ThemeToggle";

const About = () => {
  const navigate = useNavigate();

  const contributors = [
    "Sadrita Neogi",
    "Bhaswata Mukherjee",
    "Proyash Kumar Sarkar",
    "Debayan Roy",
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 overflow-hidden">
      <ThemeToggle />
      
      {/* Background effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
        <div className="absolute top-0 left-0 w-32 h-32 border-l-2 border-t-2 border-primary/20" />
        <div className="absolute bottom-0 right-0 w-32 h-32 border-r-2 border-b-2 border-primary/20" />
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      </div>

      <motion.div
        className="relative z-10 w-full max-w-2xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Back Button */}
        <Button
          onClick={() => navigate("/")}
          variant="outline"
          className="mb-8 border-primary/50 text-primary hover:bg-primary hover:text-primary-foreground transition-all"
        >
          <ArrowLeft className="mr-2 h-5 w-5" />
          Back to Race
        </Button>

        {/* Title */}
        <motion.h1
          className="text-4xl md:text-5xl font-bold text-center mb-8 font-display"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <span className="text-primary">ABOUT</span>
          <span className="text-foreground"> THE PROJECT</span>
        </motion.h1>

        {/* Project Description */}
        <motion.div
          className="bg-card/80 backdrop-blur-sm border-2 border-primary/30 rounded-xl p-6 md:p-8 mb-8 shadow-lg"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          style={{ boxShadow: "0 4px 30px hsl(0 85% 55% / 0.15)" }}
        >
          <p className="text-lg md:text-xl text-foreground/90 leading-relaxed text-center">
            A lightweight <span className="text-primary font-semibold">Vite + React + TypeScript</span> starter 
            with shadcn-style components, <span className="text-primary font-semibold">Tailwind CSS</span>, and 
            Radix primitives — includes a small car-race game.
          </p>
        </motion.div>

        {/* Contributors Section */}
        <motion.div
          className="bg-card/80 backdrop-blur-sm border-2 border-primary/30 rounded-xl p-6 md:p-8 shadow-lg"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          style={{ boxShadow: "0 4px 30px hsl(0 85% 55% / 0.15)" }}
        >
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-6 font-display">
            <span className="text-primary">CONTRIBUTORS</span>
          </h2>
          
          <div className="space-y-3">
            {contributors.map((name, index) => (
              <motion.div
                key={name}
                className="flex items-center gap-4 p-3 bg-secondary/50 rounded-lg border border-primary/20"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
              >
                <span className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold text-lg">
                  {index + 1}
                </span>
                <span className="text-lg font-medium text-foreground">{name}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Class Info */}
        <motion.p
          className="text-center mt-8 text-muted-foreground font-medium"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
        >
          Class 12 CBSE Computer Science Project 2025-26
        </motion.p>
      </motion.div>
    </div>
  );
};

export default About;
