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
    <form onSubmit={handleSubmit} className="relative z-20 mx-auto w-full max-w-2xl">
      <motion.div
        whileHover={{ y: -3, rotateX: 1.2, rotateY: -1.2 }}
        animate={{
          boxShadow: isLoading
            ? "0 32px 56px -38px rgba(47,155,255,0.6), inset 0 1px 0 rgba(255,255,255,0.95)"
            : "0 22px 44px -34px rgba(47,115,181,0.42), inset 0 1px 0 rgba(255,255,255,0.9)",
        }}
        className={cn(
          "relative overflow-hidden rounded-2xl border border-sky-200 bg-white/80 backdrop-blur-xl",
          disabled && "opacity-65 grayscale-[0.35]",
        )}
      >
        {isLoading && (
          <motion.div
            initial={{ x: "-110%" }}
            animate={{ x: "180%" }}
            transition={{ duration: 1.4, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 z-10 bg-gradient-to-r from-transparent via-cyan-200/60 to-transparent"
          />
        )}

        <div className="absolute inset-y-0 left-0 z-20 flex items-center pl-4">
          <Pill className={cn("h-5 w-5", isLoading ? "text-cyan-500" : "text-sky-500")} />
        </div>

        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          disabled={disabled || isLoading}
          placeholder={disabled ? "Upload a VCF file to enable analysis..." : "Enter drug name (example: Codeine, Warfarin)"}
          className="relative z-20 block w-full rounded-2xl border-0 bg-transparent py-4 pl-12 pr-36 text-base font-semibold text-slate-800 placeholder:text-slate-500 focus:outline-none focus:ring-4 focus:ring-sky-200/70 disabled:cursor-not-allowed"
        />

        <button
          type="submit"
          disabled={!value.trim() || isLoading || disabled}
          className="pulse-glow absolute bottom-2 right-2 top-2 z-20 flex items-center gap-2 rounded-xl bg-gradient-to-br from-sky-500 to-cyan-400 px-5 font-bold text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-45"
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="h-4 w-4 rounded-full border-2 border-white border-t-white/20"
              />
              <span>Scanning</span>
            </div>
          ) : (
            <>
              <span>Analyze</span>
              <Search className="h-4 w-4" />
            </>
          )}
        </button>
      </motion.div>

      {!disabled && !isLoading && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-4 text-center text-sm font-medium text-slate-600"
        >
          <Sparkles className="mr-1 inline h-3.5 w-3.5 text-cyan-500" />
          Quick picks:
          <button
            type="button"
            onClick={() => setValue("Codeine")}
            className="ml-2 rounded-full border border-sky-200 bg-white px-2 py-0.5 text-xs font-semibold text-sky-600 hover:bg-sky-50"
          >
            Codeine
          </button>
          <button
            type="button"
            onClick={() => setValue("Warfarin")}
            className="ml-2 rounded-full border border-cyan-200 bg-white px-2 py-0.5 text-xs font-semibold text-cyan-600 hover:bg-cyan-50"
          >
            Warfarin
          </button>
        </motion.p>
      )}
    </form>
  );
};
