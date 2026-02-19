"use client";

import { FileUpload } from "@/components/FileUpload";
import { DrugInput } from "@/components/DrugInput";
import { ResultsDisplay } from "@/components/ResultsDisplay";
import { Background } from "@/components/Background";
import { parseVCF } from "@/lib/vcfParser";
import { analyzeRisk } from "@/lib/riskEngine";
import { AnalysisResult } from "@/types";
import { useState } from "react";
import { Activity } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Home() {
  const [vcfContent, setVcfContent] = useState<string | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = (content: string) => {
    setVcfContent(content);
    setError(null);
  };

  const handleAnalyze = async (drugName: string) => {
    if (!vcfContent) {
      setError("Please upload a VCF file first.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setResult(null); // Clear previous result for animation re-trigger

    try {
      // Simulate a slightly longer delay for the "scanning" effect
      await new Promise(resolve => setTimeout(resolve, 1500));

      const variants = parseVCF(vcfContent);
      const riskAnalysis = await analyzeRisk(variants, drugName);
      setResult(riskAnalysis);
    } catch (err) {
      console.error(err);
      setError("An error occurred during analysis. Please check your file and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen text-white selection:bg-emerald-500/30 font-sans relative">
      <Background />

      {/* Navbar */}
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="border-b border-slate-800/50 bg-[#0B0F19]/50 backdrop-blur-md sticky top-0 z-50"
      >
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.3)]">
              <Activity className="text-white w-5 h-5" />
            </div>
            <span className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
              PharmaGuard
            </span>
          </div>
          <div className="text-sm font-medium text-slate-400 hidden sm:block border border-slate-800/50 px-3 py-1 rounded-full bg-slate-900/30">
            RIFT 2026 • Precision Medicine
          </div>
        </div>
      </motion.header>

      <main className="max-w-7xl mx-auto px-6 py-12 relative z-10">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-emerald-100 to-slate-400 bg-clip-text text-transparent tracking-tight"
          >
            Personalized Pharmacogenomic Risk Prediction
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-lg text-slate-400 leading-relaxed"
          >
            Upload your genetic data to receive clinically actionable insights and AI-driven explanations for drug compatibility.
          </motion.p>
        </div>

        <div className="space-y-12">
          {/* File Upload Section */}
          <motion.section
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <FileUpload onFileUpload={handleFileUpload} />

            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0, marginTop: 0 }}
                  animate={{ opacity: 1, height: "auto", marginTop: 16 }}
                  exit={{ opacity: 0, height: 0, marginTop: 0 }}
                  className="max-w-xl mx-auto overflow-hidden"
                >
                  <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-400">
                    <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.5)]" />
                    <p className="text-sm font-medium">{error}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.section>

          {/* Drug Input Section */}
          <motion.section
            layout
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <DrugInput
              onAnalyze={handleAnalyze}
              isLoading={isLoading}
              disabled={!vcfContent}
            />
          </motion.section>

          {/* Results Section */}
          <section>
            <AnimatePresence mode="wait">
              {result && (
                <motion.div
                  key="results"
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.5 }}
                >
                  <ResultsDisplay result={result} />
                </motion.div>
              )}
            </AnimatePresence>
          </section>
        </div>
      </main>

      <footer className="border-t border-slate-800/50 mt-32 py-12 bg-slate-900/20 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 text-center text-slate-600 text-sm">
          <p className="font-medium text-slate-500">© 2026 PharmaGuard. RIFT Hackathon Submission.</p>
          <p className="mt-3 text-xs opacity-60 max-w-lg mx-auto leading-relaxed">
            Disclaimer: For demonstration purposes only. Not a medical device. Consult a physician before changing medication.
            Analysis is performed locally in your browser for privacy.
          </p>
        </div>
      </footer>
    </div>
  );
}
