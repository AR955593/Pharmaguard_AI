"use client";

import React from "react";
import { motion } from "framer-motion";

export const Background = () => {
  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden">
      <div className="absolute inset-0 grid-frost opacity-70" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_22%,rgba(255,255,255,0.8),transparent_58%)]" />

      <motion.div
        animate={{
          x: [0, 70, 0],
          y: [0, -25, 0],
          rotate: [0, 4, 0],
        }}
        transition={{
          duration: 14,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute -top-36 -left-24 h-[20rem] w-[20rem] rounded-[45%] bg-[radial-gradient(circle_at_35%_35%,#ffffff_0%,#8fcdff_48%,#53a8f2_100%)] opacity-65 blur-2xl md:h-[26rem] md:w-[26rem]"
      />

      <motion.div
        animate={{
          x: [0, -60, 0],
          y: [0, 42, 0],
          rotate: [0, -7, 0],
        }}
        transition={{
          duration: 16,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.7,
        }}
        className="absolute -right-28 top-10 h-[18rem] w-[18rem] rounded-[40%] bg-[radial-gradient(circle_at_32%_28%,#ffffff_0%,#b9f2f4_45%,#47c7c6_100%)] opacity-70 blur-2xl md:h-[24rem] md:w-[24rem]"
      />

      <motion.div
        animate={{
          y: [0, -36, 0],
          scale: [1, 1.08, 1],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1.2,
        }}
        className="absolute bottom-[-7rem] left-1/2 h-[19rem] w-[21rem] -translate-x-1/2 rounded-[48%] bg-[radial-gradient(circle_at_50%_26%,#ffffff_0%,#dae7ff_44%,#9fbef2_100%)] opacity-75 blur-3xl md:h-[24rem] md:w-[32rem]"
      />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: [0.18, 0.35, 0.18] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
        className="absolute left-1/2 top-[18%] h-[210px] w-[210px] -translate-x-1/2 rounded-full border border-white/80 bg-white/45 shadow-[0_24px_60px_-26px_rgba(90,151,218,0.45)] backdrop-blur-lg md:h-[270px] md:w-[270px]"
      />

      <div className="absolute inset-0 opacity-80">
        <div className="pulse-glow absolute left-[20%] top-[26%] h-2 w-2 rounded-full bg-sky-300" />
        <div className="pulse-glow absolute right-[24%] top-[58%] h-2.5 w-2.5 rounded-full bg-cyan-300 [animation-delay:1.2s]" />
        <div className="pulse-glow absolute bottom-[20%] left-[45%] h-1.5 w-1.5 rounded-full bg-blue-300 [animation-delay:0.6s]" />
      </div>
    </div>
  );
};
