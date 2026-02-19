"use client";

import { FileUpload } from "@/components/FileUpload";
import { DrugInput } from "@/components/DrugInput";
import { ResultsDisplay } from "@/components/ResultsDisplay";
import { Background } from "@/components/Background";
import { parseVCF } from "@/lib/vcfParser";
import { analyzeRisk } from "@/lib/riskEngine";
import { AnalysisResult } from "@/types";
import { useState } from "react";
import { Activity, Sparkles, ShieldCheck, Microscope } from "lucide-react";
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
    setResult(null);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1200));
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
    <div className="relative min-h-screen overflow-hidden text-slate-800 selection:bg-sky-200/70">
      <Background />

      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="sticky top-0 z-50 mx-auto w-full border-b border-sky-200/70 bg-white/40 backdrop-blur-xl"
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 md:px-7">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-sky-500 to-cyan-400 text-white shadow-[0_18px_28px_-15px_rgba(35,143,230,0.8)]">
              <Activity className="h-5 w-5" />
            </div>
            <span className="text-xl font-black tracking-tight text-slate-800">PharmaGuard</span>
          </div>
          <div className="hidden rounded-full border border-sky-200 bg-white/70 px-3 py-1 text-xs font-semibold text-slate-600 md:block">
            RIFT 2026 | Precision Medicine
          </div>
        </div>
      </motion.header>

      <main className="relative z-10 mx-auto max-w-7xl px-5 pb-20 pt-10 md:px-7 md:pt-14">
        <section className="mx-auto mb-12 max-w-4xl text-center">
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="gradient-text text-4xl font-black leading-tight tracking-tight md:text-6xl"
          >
            3D Clinical Intelligence for Personalized Drug Safety
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-slate-600 md:text-lg"
          >
            Upload VCF data, analyze gene-drug response, and get actionable recommendations in a modern
            light-space interface built for clarity.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.45 }}
            className="mt-8 flex flex-wrap justify-center gap-3"
          >
            <div className="glass-card-soft flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold text-slate-700">
              <Sparkles className="h-4 w-4 text-sky-500" />
              AI Explanation
            </div>
            <div className="glass-card-soft flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold text-slate-700">
              <ShieldCheck className="h-4 w-4 text-cyan-500" />
              Risk Classification
            </div>
            <div className="glass-card-soft flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold text-slate-700">
              <Microscope className="h-4 w-4 text-blue-500" />
              Genomic Profile
            </div>
          </motion.div>
        </section>

        <div className="space-y-10 [perspective:1300px]">
          <motion.section
            initial={{ opacity: 0, y: 14, rotateX: 3 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            transition={{ duration: 0.65, delay: 0.55 }}
            className="glass-card rounded-[1.6rem] p-5 md:p-8"
          >
            <FileUpload onFileUpload={handleFileUpload} />

            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0, marginTop: 0 }}
                  animate={{ opacity: 1, height: "auto", marginTop: 16 }}
                  exit={{ opacity: 0, height: 0, marginTop: 0 }}
                  className="mx-auto max-w-xl overflow-hidden"
                >
                  <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-600 shadow-[0_16px_30px_-24px_rgba(227,91,116,0.9)]">
                    {error}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 14, rotateX: 2 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            transition={{ duration: 0.65, delay: 0.72 }}
            className="glass-card rounded-[1.6rem] p-5 md:p-8"
          >
            <DrugInput onAnalyze={handleAnalyze} isLoading={isLoading} disabled={!vcfContent} />
          </motion.section>

          <section>
            <AnimatePresence mode="wait">
              {result && (
                <motion.div
                  key="results"
                  initial={{ opacity: 0, y: 40, rotateX: 4 }}
                  animate={{ opacity: 1, y: 0, rotateX: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.55 }}
                >
                  <ResultsDisplay result={result} />
                </motion.div>
              )}
            </AnimatePresence>
          </section>
        </div>
      </main>

      <footer className="border-t border-sky-200/70 bg-white/40 py-10 backdrop-blur-lg">
        <div className="mx-auto max-w-7xl px-5 text-center text-sm text-slate-500 md:px-7">
          <p className="font-semibold text-slate-600">Copyright 2026 PharmaGuard. RIFT Hackathon Submission.</p>
          <p className="mx-auto mt-2 max-w-xl text-xs leading-relaxed">
            Demonstration only. Not a medical device. Consult a physician before changing any medication.
          </p>
        </div>
      </footer>
    </div>
  );
}
