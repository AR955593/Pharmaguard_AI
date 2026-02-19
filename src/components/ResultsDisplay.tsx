"use client";

import React from "react";
import { AnalysisResult } from "@/types";
import {
  AlertTriangle,
  CheckCircle,
  XCircle,
  Info,
  Dna,
  Activity,
  ClipboardCopy,
  Download,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface ResultsDisplayProps {
  result: AnalysisResult | null;
}

export const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ result }) => {
  if (!result) return null;

  const { risk_assessment, pharmacogenomic_profile, clinical_recommendation, llm_generated_explanation } = result;

  const getRiskColor = (label: string) => {
    switch (label) {
      case "Safe":
        return "text-emerald-700 bg-emerald-50 border-emerald-200 shadow-[0_26px_48px_-34px_rgba(16,185,129,0.7)]";
      case "Adjust Dosage":
        return "text-amber-700 bg-amber-50 border-amber-200 shadow-[0_26px_48px_-34px_rgba(245,158,11,0.7)]";
      case "Toxic":
        return "text-rose-700 bg-rose-50 border-rose-200 shadow-[0_26px_48px_-34px_rgba(239,68,68,0.7)]";
      case "Ineffective":
        return "text-orange-700 bg-orange-50 border-orange-200 shadow-[0_26px_48px_-34px_rgba(249,115,22,0.7)]";
      default:
        return "text-slate-700 bg-slate-50 border-slate-200";
    }
  };

  const getRiskIcon = (label: string) => {
    switch (label) {
      case "Safe":
        return <CheckCircle className="h-6 w-6" />;
      case "Adjust Dosage":
        return <AlertTriangle className="h-6 w-6" />;
      case "Toxic":
        return <XCircle className="h-6 w-6" />;
      case "Ineffective":
        return <XCircle className="h-6 w-6" />;
      default:
        return <Info className="h-6 w-6" />;
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(JSON.stringify(result, null, 2));
  };

  const downloadJson = () => {
    const blob = new Blob([JSON.stringify(result, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `pharmaguard_report_${result.patient_id}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.13,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 18 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="mx-auto mt-12 w-full max-w-5xl space-y-6">
      <motion.div
        variants={item}
        whileHover={{ y: -3, rotateX: 1, rotateY: -1.2 }}
        className={cn(
          "rounded-3xl border px-5 py-6 transition-all duration-300 md:px-7 [transform-style:preserve-3d]",
          getRiskColor(risk_assessment.risk_label),
        )}
      >
        <div className="flex flex-col gap-5 md:flex-row md:items-center md:gap-6">
          <div className="rounded-2xl bg-white/70 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.95)]">{getRiskIcon(risk_assessment.risk_label)}</div>
          <div className="flex-1">
            <h2 className="text-xs font-bold uppercase tracking-[0.18em] opacity-80">Risk Assessment</h2>
            <div className="mt-1 flex flex-wrap items-center gap-3">
              <h1 className="text-3xl font-black tracking-tight md:text-4xl">{risk_assessment.risk_label}</h1>
              <span className="rounded-full border border-white/80 bg-white/60 px-2.5 py-0.5 text-xs font-bold uppercase">
                Severity {risk_assessment.severity}
              </span>
            </div>
          </div>
          <div className="rounded-2xl border border-white/80 bg-white/65 px-4 py-3 text-left md:text-right">
            <div className="text-xs font-semibold uppercase tracking-[0.16em] opacity-70">Confidence</div>
            <div className="text-2xl font-black">{(risk_assessment.confidence_score * 100).toFixed(0)}%</div>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <motion.div variants={item} whileHover={{ y: -2 }} className="glass-card rounded-3xl p-6 md:p-7">
          <div className="mb-4 flex items-center gap-2 text-sky-700">
            <Activity className="h-5 w-5" />
            <h3 className="text-lg font-black">Clinical Recommendation</h3>
          </div>
          <p className="text-base leading-relaxed text-slate-700">{clinical_recommendation.recommendation}</p>

          {clinical_recommendation.alternatives && (
            <div className="mt-5 border-t border-sky-100 pt-4">
              <span className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">Alternatives</span>
              <div className="mt-3 flex flex-wrap gap-2">
                {clinical_recommendation.alternatives.map((alt) => (
                  <span
                    key={alt}
                    className="rounded-full border border-sky-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700 shadow-[0_12px_20px_-18px_rgba(47,115,181,0.8)]"
                  >
                    {alt}
                  </span>
                ))}
              </div>
            </div>
          )}
        </motion.div>

        <motion.div variants={item} whileHover={{ y: -2 }} className="glass-card rounded-3xl p-6 md:p-7">
          <div className="mb-4 flex items-center gap-2 text-cyan-700">
            <Dna className="h-5 w-5" />
            <h3 className="text-lg font-black">Genomic Profile</h3>
          </div>
          <div className="space-y-3 text-sm md:text-base">
            <div className="flex items-center justify-between rounded-xl border border-sky-100 bg-white/70 px-3 py-2">
              <span className="font-semibold text-slate-500">Primary Gene</span>
              <span className="font-mono font-bold text-slate-800">{pharmacogenomic_profile.primary_gene}</span>
            </div>
            <div className="flex items-center justify-between rounded-xl border border-sky-100 bg-white/70 px-3 py-2">
              <span className="font-semibold text-slate-500">Phenotype</span>
              <span
                className={cn(
                  "rounded-full px-2 py-0.5 font-mono font-bold",
                  pharmacogenomic_profile.phenotype !== "NM"
                    ? "bg-amber-100 text-amber-700"
                    : "bg-emerald-100 text-emerald-700",
                )}
              >
                {pharmacogenomic_profile.phenotype}
              </span>
            </div>
            <div className="flex items-center justify-between rounded-xl border border-sky-100 bg-white/70 px-3 py-2">
              <span className="font-semibold text-slate-500">Diplotype</span>
              <span className="font-mono font-bold text-slate-700">{pharmacogenomic_profile.diplotype}</span>
            </div>
            <div className="rounded-xl border border-sky-100 bg-white/70 px-3 py-3">
              <span className="text-xs font-bold uppercase tracking-[0.15em] text-slate-500">Detected Variants</span>
              {pharmacogenomic_profile.detected_variants.length > 0 ? (
                <div className="mt-2 flex flex-wrap gap-2">
                  {pharmacogenomic_profile.detected_variants.map((v, i) => (
                    <span key={i} className="rounded-md border border-cyan-100 bg-cyan-50 px-2 py-1 text-xs font-mono font-semibold text-cyan-700">
                      {v.rsid} ({v.genotype})
                    </span>
                  ))}
                </div>
              ) : (
                <p className="mt-2 text-xs italic text-slate-500">No specific variants detected. Wild type assumed.</p>
              )}
            </div>
          </div>
        </motion.div>
      </div>

      <motion.div variants={item} whileHover={{ y: -2 }} className="glass-card rounded-3xl p-6 md:p-8">
        <div className="mb-4 flex items-center gap-2 text-blue-700">
          <Sparkles className="h-5 w-5" />
          <h3 className="text-lg font-black">AI Interpretation</h3>
        </div>
        <p className="text-slate-700 leading-relaxed">{llm_generated_explanation.summary}</p>
        <div className="mt-5 rounded-2xl border border-sky-100 bg-white/75 p-4">
          <h4 className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">Mechanism of Action</h4>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">{llm_generated_explanation.mechanism_of_action}</p>
        </div>
        {llm_generated_explanation.citations && (
          <div className="mt-4 flex flex-wrap gap-2 text-xs text-slate-500">
            {llm_generated_explanation.citations.map((cite, i) => (
              <span key={i} className="rounded-full border border-sky-100 bg-white/75 px-2 py-1 font-medium">
                {cite}
              </span>
            ))}
          </div>
        )}
      </motion.div>

      <motion.div variants={item} className="flex flex-wrap justify-end gap-3 pt-2">
        <button
          onClick={copyToClipboard}
          className="glass-card-soft flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-bold text-slate-700 transition hover:translate-y-[-1px]"
        >
          <ClipboardCopy className="h-4 w-4 text-sky-600" />
          Copy JSON
        </button>
        <button
          onClick={downloadJson}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-br from-sky-500 to-cyan-400 px-4 py-2 text-sm font-black text-white shadow-[0_16px_26px_-16px_rgba(47,155,255,0.8)] transition hover:brightness-110"
        >
          <Download className="h-4 w-4" />
          Download Report
        </button>
      </motion.div>

      <motion.details variants={item} className="glass-card-soft scroll-card rounded-2xl p-3 text-xs text-slate-600">
        <summary className="cursor-pointer select-none font-bold tracking-[0.11em] uppercase text-slate-500">
          Raw JSON Output
        </summary>
        <pre className="scroll-card mt-3 max-h-[360px] overflow-auto rounded-xl border border-sky-100 bg-white/75 p-4 text-[11px] leading-relaxed text-slate-700">
          {JSON.stringify(result, null, 2)}
        </pre>
      </motion.details>
    </motion.div>
  );
};
