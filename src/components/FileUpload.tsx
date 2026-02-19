"use client";

import React, { useState } from "react";
import { Upload, CheckCircle, AlertCircle } from "lucide-react";
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
        <div className="w-full max-w-xl mx-auto">
            <motion.div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                whileHover={{ scale: 1.01, borderColor: "rgba(16, 185, 129, 0.4)" }}
                whileTap={{ scale: 0.98 }}
                animate={{
                    borderColor: isDragging ? "rgb(16, 185, 129)" : error ? "rgb(239, 68, 68)" : fileName ? "rgb(16, 185, 129)" : "rgba(51, 65, 85, 0.5)",
                    backgroundColor: isDragging ? "rgba(16, 185, 129, 0.1)" : "rgba(15, 23, 42, 0.6)",
                    boxShadow: isDragging ? "0 0 30px rgba(16,185,129,0.2)" : "0 0 0 rgba(0,0,0,0)"
                }}
                className={cn(
                    "relative border-2 border-dashed rounded-xl p-8 transition-colors flex flex-col items-center justify-center text-center cursor-pointer backdrop-blur-md",
                )}
            >
                <input
                    type="file"
                    accept=".vcf"
                    onChange={handleInputChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />

                <AnimatePresence mode="wait">
                    {fileName ? (
                        <motion.div
                            key="success"
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.5 }}
                            className="flex flex-col items-center"
                        >
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: "spring", stiffness: 200, damping: 10 }}
                                className="bg-emerald-500/20 p-4 rounded-full mb-3 ring-1 ring-emerald-500/50"
                            >
                                <CheckCircle className="w-8 h-8 text-emerald-400" />
                            </motion.div>
                            <p className="text-emerald-400 font-semibold text-lg">{fileName}</p>
                            <p className="text-slate-400 text-sm mt-1">Ready for analysis</p>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="upload"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex flex-col items-center"
                        >
                            <div className="bg-slate-800/80 p-4 rounded-full mb-4 shadow-lg shadow-black/20 group-hover:bg-slate-700 transition-colors">
                                <Upload className="w-8 h-8 text-emerald-400" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">Upload VCF File</h3>
                            <p className="text-slate-400 mb-4 max-w-xs">
                                Drag & drop your genomic data file (.vcf) here, or click to browse
                            </p>
                            <div className="px-3 py-1 bg-slate-800/50 rounded text-xs text-slate-500 font-mono border border-slate-700/50">
                                Max 5MB • Standard VCF v4.2
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>

            <AnimatePresence>
                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: -10, height: 0 }}
                        animate={{ opacity: 1, y: 0, height: "auto" }}
                        exit={{ opacity: 0, y: -10, height: 0 }}
                        className="mt-4 overflow-hidden"
                    >
                        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-3 text-red-400">
                            <AlertCircle className="w-5 h-5 flex-shrink-0" />
                            <p className="text-sm font-medium">{error}</p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
