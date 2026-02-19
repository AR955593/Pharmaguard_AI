"use client";

import React, { useState } from "react";
import { Upload, CheckCircle, AlertCircle, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface FileUploadProps {
  onFileUpload: (content: string) => void;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onFileUpload }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const processFile = (file: File) => {
    if (!file.name.endsWith(".vcf")) {
      setError("Please upload a valid .vcf file.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("File size exceeds 5MB limit.");
      return;
    }

    setFileName(file.name);
    setError(null);

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      onFileUpload(text);
    };
    reader.readAsText(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  };

  return (
    <div className="mx-auto w-full max-w-2xl">
      <motion.div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        whileHover={{ y: -4, rotateX: 2, rotateY: -2 }}
        whileTap={{ scale: 0.995 }}
        animate={{
          borderColor: isDragging
            ? "rgba(47,155,255,0.7)"
            : error
              ? "rgba(227,91,116,0.5)"
              : fileName
                ? "rgba(47,210,193,0.65)"
                : "rgba(143,181,220,0.45)",
          backgroundColor: isDragging ? "rgba(236,247,255,0.95)" : "rgba(255,255,255,0.72)",
          boxShadow: isDragging
            ? "0 34px 70px -36px rgba(47,155,255,0.55), inset 0 1px 0 rgba(255,255,255,0.95)"
            : "0 26px 56px -36px rgba(47,115,181,0.42), inset 0 1px 0 rgba(255,255,255,0.9)",
        }}
        transition={{ type: "spring", stiffness: 180, damping: 18 }}
        className={cn(
          "relative overflow-hidden rounded-2xl border-2 border-dashed px-6 py-10 text-center backdrop-blur-xl md:px-10",
        )}
      >
        <div className="pointer-events-none absolute inset-x-0 top-0 h-16 bg-gradient-to-r from-sky-100/70 via-white/90 to-cyan-100/70" />

        <input
          type="file"
          accept=".vcf"
          onChange={handleInputChange}
          className="absolute inset-0 z-20 h-full w-full cursor-pointer opacity-0"
        />

        <AnimatePresence mode="wait">
          {fileName ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, y: 14, scale: 0.94 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6, scale: 0.95 }}
              className="relative z-10 flex flex-col items-center"
            >
              <motion.div
                initial={{ scale: 0.5, rotate: -12 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 220, damping: 12 }}
                className="mb-4 rounded-2xl bg-gradient-to-br from-cyan-400 to-sky-500 p-4 text-white shadow-[0_22px_28px_-18px_rgba(47,155,255,0.8)]"
              >
                <CheckCircle className="h-8 w-8" />
              </motion.div>
              <p className="flex items-center gap-2 text-lg font-bold text-slate-800">
                <FileText className="h-4 w-4 text-sky-500" />
                {fileName}
              </p>
              <p className="mt-1 text-sm font-medium text-slate-600">VCF loaded and ready for analysis</p>
            </motion.div>
          ) : (
            <motion.div
              key="upload"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="relative z-10 flex flex-col items-center"
            >
              <div className="float-soft mb-4 rounded-2xl bg-white p-4 text-sky-500 shadow-[0_22px_30px_-20px_rgba(47,155,255,0.8)]">
                <Upload className="h-8 w-8" />
              </div>
              <h3 className="text-2xl font-black text-slate-800">Drop Your VCF File</h3>
              <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-slate-600">
                Drag and drop genomic data here, or click to browse. The file stays local in your browser.
              </p>
              <div className="mt-4 rounded-full border border-sky-200 bg-white/80 px-3 py-1 text-xs font-semibold text-slate-600">
                Max 5MB | VCF v4.2 format
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -8, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -8, height: 0 }}
            className="mt-4 overflow-hidden"
          >
            <div className="glass-card-soft flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50/80 px-4 py-3 text-sm font-medium text-rose-600">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
