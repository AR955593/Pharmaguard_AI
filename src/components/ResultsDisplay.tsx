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
    Sparkles
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
            case "Safe": return "text-emerald-400 bg-emerald-500/10 border-emerald-500/20 shadow-[0_0_30px_rgba(16,185,129,0.1)]";
            case "Adjust Dosage": return "text-amber-400 bg-amber-500/10 border-amber-500/20 shadow-[0_0_30px_rgba(245,158,11,0.1)]";
            case "Toxic": return "text-red-400 bg-red-500/10 border-red-500/20 shadow-[0_0_30px_rgba(239,68,68,0.1)]";
            case "Ineffective": return "text-orange-400 bg-orange-500/10 border-orange-500/20 shadow-[0_0_30px_rgba(249,115,22,0.1)]";
            default: return "text-slate-400 bg-slate-800 border-slate-700";
        }
    };

    const getRiskIcon = (label: string) => {
        switch (label) {
            case "Safe": return <CheckCircle className="w-6 h-6" />;
            case "Adjust Dosage": return <AlertTriangle className="w-6 h-6" />;
            case "Toxic": return <XCircle className="w-6 h-6" />;
            case "Ineffective": return <XCircle className="w-6 h-6" />;
            default: return <Info className="w-6 h-6" />;
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
                staggerChildren: 0.15
            }
        }
    };

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    return (
        <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="w-full max-w-4xl mx-auto mt-12 space-y-6"
        >

            {/* Risk Header Card */}
            <motion.div
                variants={item}
                whileHover={{ scale: 1.02 }}
                className={cn("p-6 rounded-2xl border flex items-center gap-6 backdrop-blur-md transition-all duration-300", getRiskColor(risk_assessment.risk_label))}
            >
                <div className="p-4 rounded-full bg-black/20 backdrop-blur-sm shadow-inner">
                    {getRiskIcon(risk_assessment.risk_label)}
                </div>
                <div className="flex-1">
                    <h2 className="text-sm uppercase tracking-wider font-semibold opacity-80 mb-1">Risk Assessment</h2>
                    <div className="flex items-baseline gap-3">
                        <h1 className="text-4xl font-bold tracking-tight">{risk_assessment.risk_label}</h1>
                        <span className="px-2 py-0.5 rounded text-xs font-mono bg-black/20 border border-white/10 uppercase">
                            Severity: {risk_assessment.severity}
                        </span>
                    </div>
                </div>
                <div className="text-right hidden sm:block">
                    <div className="text-sm opacity-60">Confidence Score</div>
                    <div className="text-2xl font-bold font-mono">{(risk_assessment.confidence_score * 100).toFixed(0)}%</div>
                </div>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Recommendation Card */}
                <motion.div
                    variants={item}
                    className="bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-2xl p-6 shadow-lg hover:border-slate-700 transition-colors"
                >
                    <div className="flex items-center gap-3 mb-4 text-emerald-400">
                        <Activity className="w-5 h-5" />
                        <h3 className="font-bold text-lg">Clinical Recommendation</h3>
                    </div>
                    <p className="text-slate-300 leading-relaxed text-lg">
                        {clinical_recommendation.recommendation}
                    </p>
                    {clinical_recommendation.alternatives && (
                        <div className="mt-4 pt-4 border-t border-slate-800/50">
                            <span className="text-sm text-slate-500 block mb-2">Alternatives</span>
                            <div className="flex flex-wrap gap-2">
                                {clinical_recommendation.alternatives.map(alt => (
                                    <span key={alt} className="px-3 py-1 bg-slate-800/80 rounded-full text-sm text-slate-300 border border-slate-700 hover:border-emerald-500/50 hover:text-emerald-400 transition-colors cursor-default">{alt}</span>
                                ))}
                            </div>
                        </div>
                    )}
                </motion.div>

                {/* Genomic Profile Card */}
                <motion.div
                    variants={item}
                    className="bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-2xl p-6 shadow-lg hover:border-slate-700 transition-colors"
                >
                    <div className="flex items-center gap-3 mb-4 text-blue-400">
                        <Dna className="w-5 h-5" />
                        <h3 className="font-bold text-lg">Genomic Profile</h3>
                    </div>
                    <div className="space-y-3">
                        <div className="flex justify-between items-center py-2 border-b border-slate-800/50">
                            <span className="text-slate-400">Primary Gene</span>
                            <span className="font-mono text-white font-bold bg-slate-800 px-2 rounded">{pharmacogenomic_profile.primary_gene}</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-slate-800/50">
                            <span className="text-slate-400">Phenotype</span>
                            <span className={cn("font-mono font-bold px-2 py-0.5 rounded", pharmacogenomic_profile.phenotype !== "NM" ? "bg-amber-500/10 text-amber-400" : "text-white")}>
                                {pharmacogenomic_profile.phenotype}
                            </span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-slate-800/50">
                            <span className="text-slate-400">Diplotype</span>
                            <span className="font-mono text-slate-300">{pharmacogenomic_profile.diplotype}</span>
                        </div>
                        <div className="pt-2">
                            <span className="text-slate-500 text-sm block mb-2">Detected Variants</span>
                            {pharmacogenomic_profile.detected_variants.length > 0 ? (
                                <div className="flex flex-wrap gap-2">
                                    {pharmacogenomic_profile.detected_variants.map((v, i) => (
                                        <span key={i} className="text-xs font-mono px-2 py-1 bg-slate-800 rounded border border-slate-700 text-slate-400">
                                            {v.rsid} ({v.genotype})
                                        </span>
                                    ))}
                                </div>
                            ) : (
                                <span className="text-xs text-slate-600 italic">No specific variants detected (Wild Type assumed)</span>
                            )}
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* LLM Explanation */}
            <motion.div
                variants={item}
                className="bg-gradient-to-br from-slate-900/80 to-slate-800/80 backdrop-blur-md border border-slate-700/50 rounded-2xl p-8 relative overflow-hidden group"
            >
                <div className="absolute top-0 right-0 p-32 bg-emerald-500/5 blur-3xl rounded-full pointer-events-none transition-all duration-1000 group-hover:bg-emerald-500/10" />
                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-4 text-purple-400">
                        <Sparkles className="w-5 h-5" />
                        <h3 className="font-bold text-lg">AI Analysis</h3>
                    </div>
                    <p className="text-slate-300 leading-relaxed mb-4">
                        {llm_generated_explanation.summary}
                    </p>
                    <div className="bg-black/20 p-4 rounded-xl border border-white/5">
                        <h4 className="text-xs font-bold text-slate-500 uppercase mb-2">Mechanism of Action</h4>
                        <p className="text-sm text-slate-400">
                            {llm_generated_explanation.mechanism_of_action}
                        </p>
                    </div>
                    {llm_generated_explanation.citations && (
                        <div className="mt-4 flex gap-4 text-xs text-slate-500">
                            {llm_generated_explanation.citations.map((cite, i) => (
                                <span key={i} className="hover:text-slate-300 cursor-help border-b border-dotted border-slate-600 transition-colors">{cite}</span>
                            ))}
                        </div>
                    )}
                </div>
            </motion.div>

            {/* Actions */}
            <motion.div
                variants={item}
                className="flex justify-end gap-3 pt-6 border-t border-slate-800/50"
            >
                <button
                    onClick={copyToClipboard}
                    className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-all border border-slate-700 hover:border-slate-600 text-sm font-medium active:scale-95"
                >
                    <ClipboardCopy className="w-4 h-4" />
                    Copy JSON
                </button>
                <button
                    onClick={downloadJson}
                    className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-white text-slate-900 rounded-lg transition-all border border-slate-200 text-sm font-bold shadow-lg shadow-emerald-500/10 hover:shadow-emerald-500/20 active:scale-95"
                >
                    <Download className="w-4 h-4" />
                    Download Report
                </button>
            </motion.div>

            {/* JSON Preview Helper */}
            <motion.details
                variants={item}
                className="text-xs text-slate-600 font-mono"
            >
                <summary className="cursor-pointer hover:text-slate-400 transition-colors mb-2 select-none">Raw JSON Output</summary>
                <pre className="p-4 bg-black/50 rounded-lg overflow-x-auto border border-slate-800/50 custom-scrollbar">
                    {JSON.stringify(result, null, 2)}
                </pre>
            </motion.details>

        </motion.div>
    );
};
