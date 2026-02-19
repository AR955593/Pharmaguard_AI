"use client";

import React from "react";
import { motion } from "framer-motion";

export const Background = () => {
    return (
        <div className="fixed inset-0 z-[-1] overflow-hidden bg-[#0B0F19]">
            {/* Grid Overlay */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

            {/* Floating Orbs */}
            <motion.div
                animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 0.5, 0.3],
                    x: [0, 50, 0],
                    y: [0, -50, 0],
                }}
                transition={{
                    duration: 10,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
                className="absolute -top-40 -left-40 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl mix-blend-screen"
            />

            <motion.div
                animate={{
                    scale: [1, 1.3, 1],
                    opacity: [0.2, 0.4, 0.2],
                    x: [0, -30, 0],
                    y: [0, 60, 0],
                }}
                transition={{
                    duration: 15,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 1,
                }}
                className="absolute top-20 right-0 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-3xl mix-blend-screen"
            />

            <motion.div
                animate={{
                    scale: [1, 1.1, 1],
                    opacity: [0.1, 0.3, 0.1],
                    x: [0, 40, 0],
                    y: [0, 40, 0],
                }}
                transition={{
                    duration: 12,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 2,
                }}
                className="absolute -bottom-40 left-1/2 w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-3xl mix-blend-screen"
            />

            {/* Particles (Simplified) */}
            <div className="absolute inset-0 opacity-20">
                <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-white rounded-full animate-pulse" />
                <div className="absolute top-3/4 right-1/4 w-1 h-1 bg-emerald-400 rounded-full animate-ping" />
                <div className="absolute bottom-1/4 left-1/2 w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse delay-700" />
            </div>
        </div>
    );
};
