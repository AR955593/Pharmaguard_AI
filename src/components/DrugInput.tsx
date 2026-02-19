"use client";

import React from "react";
import { Pill, Search, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface DrugInputProps {
    onAnalyze: (drugs: string) => void;
    isLoading: boolean;
    disabled?: boolean;
}

export const DrugInput: React.FC<DrugInputProps> = ({ onAnalyze, isLoading, disabled }) => {
    const [value, setValue] = React.useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (value.trim() && !disabled) {
            onAnalyze(value);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="w-full max-w-xl mx-auto mt-6 relative z-20">
            <motion.div
                className={cn("relative group rounded-xl overflow-hidden", disabled && "opacity-60 grayscale")}
                animate={{
                    boxShadow: isLoading
                        ? "0 0 30px rgba(16, 185, 129, 0.3)"
                        : "0 0 15px rgba(0, 0, 0, 0.1)"
                }}
            >
                {/* Scanning Beam Effect */}
                {isLoading && (
                    <motion.div
                        initial={{ x: "-100%" }}
                        animate={{ x: "200%" }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent z-10 skew-x-12"
                    />
                )}

                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-20">
                    <Pill className={cn("h-5 w-5 transition-colors", isLoading ? "text-emerald-400 animate-pulse" : "text-slate-500 group-focus-within:text-emerald-400")} />
                </div>

                <input
                    type="text"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    disabled={disabled || isLoading}
                    placeholder={disabled ? "Upload VCF file to enable search..." : "Enter drug names (e.g., Codeine, Warfarin)..."}
                    className="block w-full pl-12 pr-32 py-4 bg-slate-900/80 backdrop-blur-md border border-slate-700/80 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all disabled:cursor-not-allowed disabled:bg-slate-900/50 relative z-10"
                />

                <button
                    type="submit"
                    disabled={!value.trim() || isLoading || disabled}
                    className="absolute right-2 top-2 bottom-2 bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-bold px-6 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 z-20 overflow-hidden"
                >
                    {isLoading ? (
                        <div className="flex items-center gap-2">
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                className="w-4 h-4 border-2 border-slate-900 border-t-white/50 rounded-full"
                            />
                            <span>Scanning...</span>
                        </div>
                    ) : (
                        <>
                            <span>Analyze</span>
                            <Search className="w-4 h-4 ml-1" />
                        </>
                    )}
                </button>
            </motion.div>

            {!disabled && !isLoading && (
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-3 text-center text-xs text-slate-500"
                >
                    <Sparkles className="w-3 h-3 inline mr-1 text-emerald-500" />
                    Try: <span className="text-slate-400 cursor-pointer hover:text-emerald-400 transition-colors" onClick={() => setValue("Codeine")}>Codeine</span>, <span className="text-slate-400 cursor-pointer hover:text-emerald-400 transition-colors" onClick={() => setValue("Warfarin")}>Warfarin</span>
                </motion.p>
            )}
        </form>
    );
};
