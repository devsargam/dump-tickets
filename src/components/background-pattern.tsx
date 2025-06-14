"use client";

import { motion } from "framer-motion";

export function BackgroundPattern() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Base background with bold subtle gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-300/90 via-white to-rose-300/90" />

      {/* Layered depth - back layer with minimal color */}
      <div className="absolute inset-0 opacity-60">
        <div className="absolute top-20 left-20 w-64 h-64 bg-gradient-to-br from-blue-100/80 to-indigo-50/60 rounded-full blur-3xl" />
        <div className="absolute bottom-32 right-32 w-80 h-80 bg-gradient-to-br from-amber-50/70 to-orange-50/50 rounded-full blur-3xl" />
        <div className="absolute top-1/2 right-1/4 w-48 h-48 bg-gradient-to-br from-violet-50/60 to-blue-50/50 rounded-full blur-2xl" />
      </div>

      {/* Subtle grid pattern */}
      <svg
        className="absolute inset-0 h-full w-full opacity-[0.12]"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern
            id="grid"
            width="40"
            height="40"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 40 0 L 0 0 0 40"
              fill="none"
              stroke="rgb(59 130 246)"
              strokeWidth="0.5"
            />
          </pattern>
          <pattern
            id="dots"
            width="80"
            height="80"
            patternUnits="userSpaceOnUse"
          >
            <circle
              cx="40"
              cy="40"
              r="0.8"
              fill="rgb(139 69 19)"
              opacity="0.4"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
        <rect width="100%" height="100%" fill="url(#dots)" />
      </svg>

      {/* Geometric shapes - floating elements with minimal color */}
      <motion.div
        className="absolute top-1/6 left-1/12 w-5 h-5 bg-blue-300/80 rounded-full"
        animate={{
          y: [-12, 12, -12],
          opacity: [0.4, 0.8, 0.4],
          scale: [0.8, 1.2, 0.8],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <motion.div
        className="absolute top-1/4 right-1/6 w-4 h-4 bg-amber-300/90 rotate-45"
        animate={{
          y: [8, -8, 8],
          rotate: [45, 135, 45],
          opacity: [0.5, 0.9, 0.5],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
      />

      <motion.div
        className="absolute bottom-1/4 left-1/4 w-6 h-6 border-2 border-violet-300/70 rounded-full"
        animate={{
          y: [-8, 16, -8],
          x: [-4, 4, -4],
          opacity: [0.4, 0.7, 0.4],
          scale: [0.9, 1.1, 0.9],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 3,
        }}
      />

      <motion.div
        className="absolute top-2/3 right-1/3 w-3 h-3 bg-indigo-300/80 rounded-full"
        animate={{
          y: [5, -10, 5],
          opacity: [0.5, 0.9, 0.5],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
      />

      {/* Subtle lines and connectors with color */}
      <motion.div
        className="absolute top-1/3 left-0 w-24 h-px bg-gradient-to-r from-transparent via-blue-400/80 to-transparent"
        animate={{
          width: [80, 120, 80],
          opacity: [0.4, 0.8, 0.4],
        }}
        transition={{
          duration: 9,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <motion.div
        className="absolute bottom-1/3 right-0 w-20 h-px bg-gradient-to-l from-transparent via-amber-400/80 to-transparent"
        animate={{
          width: [64, 96, 64],
          opacity: [0.5, 0.8, 0.5],
        }}
        transition={{
          duration: 11,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 4,
        }}
      />

      {/* Diagonal accent lines */}
      <motion.div
        className="absolute top-1/2 left-1/2 w-px h-16 bg-gradient-to-b from-transparent via-violet-400/70 to-transparent rotate-12"
        animate={{
          height: [48, 72, 48],
          opacity: [0.4, 0.6, 0.4],
          rotate: [12, 24, 12],
        }}
        transition={{
          duration: 13,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1.5,
        }}
      />

      {/* Corner accent elements with color */}
      <div className="absolute top-0 left-0 w-32 h-32 opacity-30">
        <div className="absolute top-6 left-6 w-1.5 h-12 bg-blue-300 rounded-full" />
        <div className="absolute top-12 left-2 w-12 h-1.5 bg-blue-300 rounded-full" />
      </div>

      <div className="absolute bottom-0 right-0 w-32 h-32 opacity-30">
        <div className="absolute bottom-6 right-6 w-1.5 h-12 bg-amber-300 rounded-full" />
        <div className="absolute bottom-12 right-2 w-12 h-1.5 bg-amber-300 rounded-full" />
      </div>

      {/* Additional floating elements for more presence */}
      <motion.div
        className="absolute top-1/5 right-1/12 w-6 h-1 bg-gradient-to-r from-blue-200/60 to-transparent rounded-full"
        animate={{
          width: [24, 36, 24],
          opacity: [0.3, 0.6, 0.3],
          x: [0, 10, 0],
        }}
        transition={{
          duration: 14,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.5,
        }}
      />

      <motion.div
        className="absolute bottom-1/5 left-1/8 w-1 h-6 bg-gradient-to-b from-amber-200/60 to-transparent rounded-full"
        animate={{
          height: [24, 36, 24],
          opacity: [0.3, 0.6, 0.3],
          y: [0, -10, 0],
        }}
        transition={{
          duration: 16,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2.5,
        }}
      />
    </div>
  );
}
