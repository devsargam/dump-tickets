"use client";

import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import { useEffect } from "react";

export function BackgroundPattern() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth spring animations for mouse tracking
  const smoothMouseX = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const smoothMouseY = useSpring(mouseY, { stiffness: 50, damping: 20 });

  useEffect(() => {
    const handle = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    window.addEventListener("mousemove", handle);
    return () => window.removeEventListener("mousemove", handle);
  }, [mouseX, mouseY]);

  // Enhanced logo positions with more depth layers and better distribution
  const logoPositions = [
    {
      top: "8%",
      left: "12%",
      size: 18,
      layer: 1,
      color: "text-blue-400/70",
      blur: 0,
    },
    {
      top: "18%",
      left: "75%",
      size: 16,
      layer: 2,
      color: "text-indigo-500/60",
      blur: 0.5,
    },
    {
      top: "28%",
      left: "25%",
      size: 20,
      layer: 1,
      color: "text-purple-400/80",
      blur: 0,
    },
    {
      top: "35%",
      left: "65%",
      size: 14,
      layer: 3,
      color: "text-blue-600/50",
      blur: 1,
    },
    {
      top: "45%",
      left: "15%",
      size: 22,
      layer: 1,
      color: "text-indigo-400/90",
      blur: 0,
    },
    {
      top: "52%",
      left: "85%",
      size: 18,
      layer: 2,
      color: "text-violet-500/65",
      blur: 0.5,
    },
    {
      top: "62%",
      left: "40%",
      size: 16,
      layer: 3,
      color: "text-blue-500/45",
      blur: 1,
    },
    {
      top: "72%",
      left: "78%",
      size: 20,
      layer: 1,
      color: "text-indigo-600/85",
      blur: 0,
    },
    {
      top: "82%",
      left: "20%",
      size: 14,
      layer: 2,
      color: "text-purple-500/55",
      blur: 0.5,
    },
    {
      top: "15%",
      left: "45%",
      size: 12,
      layer: 4,
      color: "text-blue-400/35",
      blur: 1.5,
    },
    {
      top: "38%",
      left: "88%",
      size: 18,
      layer: 1,
      color: "text-indigo-500/75",
      blur: 0,
    },
    {
      top: "68%",
      left: "8%",
      size: 16,
      layer: 2,
      color: "text-violet-400/60",
      blur: 0.5,
    },
    {
      top: "25%",
      left: "55%",
      size: 10,
      layer: 4,
      color: "text-blue-600/30",
      blur: 1.5,
    },
    {
      top: "78%",
      left: "60%",
      size: 24,
      layer: 1,
      color: "text-indigo-400/95",
      blur: 0,
    },
    {
      top: "5%",
      left: "60%",
      size: 14,
      layer: 3,
      color: "text-purple-400/40",
      blur: 1,
    },
    {
      top: "90%",
      left: "45%",
      size: 12,
      layer: 4,
      color: "text-blue-500/25",
      blur: 1.5,
    },
    {
      top: "12%",
      left: "92%",
      size: 16,
      layer: 2,
      color: "text-indigo-600/65",
      blur: 0.5,
    },
    {
      top: "55%",
      left: "5%",
      size: 18,
      layer: 1,
      color: "text-violet-600/80",
      blur: 0,
    },
  ];

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Deep layered background with multiple gradients */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-blue-50/80" />

      {/* Dynamic mouse-reactive gradient with smooth transitions */}
      <motion.div
        className="absolute inset-0"
        style={{
          background: useTransform(
            [smoothMouseX, smoothMouseY],
            (values: number[]) => {
              const [x, y] = values;
              return `radial-gradient(circle at ${x}px ${y}px, rgba(99, 102, 241, 0.12) 0%, rgba(168, 85, 247, 0.08) 25%, rgba(59, 130, 246, 0.04) 50%, transparent 70%),
               radial-gradient(circle at ${x * 0.7}px ${
                y * 0.7
              }px, rgba(147, 197, 253, 0.06) 0%, transparent 60%)`;
            }
          ),
        }}
      />

      {/* Depth layer 1 - Far background */}
      <motion.div
        className="absolute inset-0 opacity-30"
        animate={{
          background: [
            "radial-gradient(ellipse at 10% 10%, rgba(99, 102, 241, 0.15) 0%, transparent 60%), radial-gradient(ellipse at 90% 90%, rgba(168, 85, 247, 0.1) 0%, transparent 60%)",
            "radial-gradient(ellipse at 90% 10%, rgba(59, 130, 246, 0.15) 0%, transparent 60%), radial-gradient(ellipse at 10% 90%, rgba(147, 51, 234, 0.1) 0%, transparent 60%)",
            "radial-gradient(ellipse at 50% 50%, rgba(79, 70, 229, 0.15) 0%, transparent 60%), radial-gradient(ellipse at 70% 30%, rgba(139, 92, 246, 0.1) 0%, transparent 60%)",
            "radial-gradient(ellipse at 30% 70%, rgba(99, 102, 241, 0.15) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(168, 85, 247, 0.1) 0%, transparent 60%)",
          ],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: [0.4, 0, 0.6, 1],
        }}
      />

      {/* Depth layer 2 - Mid background */}
      <motion.div
        className="absolute inset-0 opacity-20"
        animate={{
          background: [
            "conic-gradient(from 0deg at 20% 20%, rgba(99, 102, 241, 0.1) 0deg, transparent 60deg, rgba(168, 85, 247, 0.08) 120deg, transparent 180deg)",
            "conic-gradient(from 90deg at 80% 80%, rgba(59, 130, 246, 0.1) 0deg, transparent 60deg, rgba(147, 51, 234, 0.08) 120deg, transparent 180deg)",
            "conic-gradient(from 180deg at 60% 40%, rgba(79, 70, 229, 0.1) 0deg, transparent 60deg, rgba(139, 92, 246, 0.08) 120deg, transparent 180deg)",
          ],
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: [0.25, 0.46, 0.45, 0.94],
          delay: 5,
        }}
      />

      {/* Enhanced grid with multiple layers */}
      <svg
        className="absolute inset-0 h-full w-full opacity-[0.06]"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern
            id="fine-grid"
            width="40"
            height="40"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 40 0 L 0 0 0 40"
              fill="none"
              stroke="rgb(99 102 241)"
              strokeWidth="0.3"
            />
          </pattern>
          <pattern
            id="major-grid"
            width="120"
            height="120"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 120 0 L 0 0 0 120"
              fill="none"
              stroke="rgb(79 70 229)"
              strokeWidth="0.5"
            />
            <circle
              cx="60"
              cy="60"
              r="1.5"
              fill="rgb(99 102 241)"
              opacity="0.4"
            />
          </pattern>
          <pattern
            id="micro-dots"
            width="200"
            height="200"
            patternUnits="userSpaceOnUse"
          >
            <circle
              cx="100"
              cy="100"
              r="0.8"
              fill="rgb(168 85 247)"
              opacity="0.3"
            />
            <circle
              cx="50"
              cy="50"
              r="0.4"
              fill="rgb(139 92 246)"
              opacity="0.2"
            />
            <circle
              cx="150"
              cy="150"
              r="0.4"
              fill="rgb(139 92 246)"
              opacity="0.2"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#fine-grid)" />
        <rect width="100%" height="100%" fill="url(#major-grid)" />
        <rect width="100%" height="100%" fill="url(#micro-dots)" />
      </svg>

      {/* Animated connection network */}
      <motion.svg
        className="absolute inset-0 h-full w-full opacity-15"
        xmlns="http://www.w3.org/2000/svg"
      >
        <motion.path
          d="M 50 150 Q 300 80 600 200 T 1100 150 Q 1300 100 1500 180"
          fill="none"
          stroke="url(#connection-gradient)"
          strokeWidth="1.5"
          animate={{
            d: [
              "M 50 150 Q 300 80 600 200 T 1100 150 Q 1300 100 1500 180",
              "M 80 180 Q 350 120 650 180 T 1150 200 Q 1350 140 1550 160",
              "M 30 120 Q 280 60 580 240 T 1080 120 Q 1280 80 1480 200",
              "M 50 150 Q 300 80 600 200 T 1100 150 Q 1300 100 1500 180",
            ],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
        />
        <motion.path
          d="M 100 400 Q 400 300 800 500 T 1300 400 Q 1500 350 1700 450"
          fill="none"
          stroke="url(#connection-gradient-2)"
          strokeWidth="1"
          animate={{
            d: [
              "M 100 400 Q 400 300 800 500 T 1300 400 Q 1500 350 1700 450",
              "M 150 450 Q 450 350 850 480 T 1350 450 Q 1550 400 1750 420",
              "M 70 380 Q 370 280 770 520 T 1270 380 Q 1470 330 1670 480",
              "M 100 400 Q 400 300 800 500 T 1300 400 Q 1500 350 1700 450",
            ],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: [0.4, 0, 0.6, 1],
            delay: 3,
          }}
        />
        <motion.path
          d="M 200 700 Q 500 600 900 800 T 1400 700"
          fill="none"
          stroke="url(#connection-gradient-3)"
          strokeWidth="0.8"
          animate={{
            d: [
              "M 200 700 Q 500 600 900 800 T 1400 700",
              "M 250 750 Q 550 650 950 780 T 1450 750",
              "M 170 680 Q 470 580 870 820 T 1370 680",
              "M 200 700 Q 500 600 900 800 T 1400 700",
            ],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: [0.65, 0, 0.35, 1],
            delay: 7,
          }}
        />
        <defs>
          <linearGradient
            id="connection-gradient"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="0%"
          >
            <stop offset="0%" stopColor="rgb(99 102 241)" stopOpacity="0" />
            <stop offset="30%" stopColor="rgb(99 102 241)" stopOpacity="0.6" />
            <stop offset="70%" stopColor="rgb(168 85 247)" stopOpacity="0.4" />
            <stop offset="100%" stopColor="rgb(168 85 247)" stopOpacity="0" />
          </linearGradient>
          <linearGradient
            id="connection-gradient-2"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="0%"
          >
            <stop offset="0%" stopColor="rgb(79 70 229)" stopOpacity="0" />
            <stop offset="50%" stopColor="rgb(139 92 246)" stopOpacity="0.5" />
            <stop offset="100%" stopColor="rgb(79 70 229)" stopOpacity="0" />
          </linearGradient>
          <linearGradient
            id="connection-gradient-3"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="0%"
          >
            <stop offset="0%" stopColor="rgb(147 51 234)" stopOpacity="0" />
            <stop offset="50%" stopColor="rgb(168 85 247)" stopOpacity="0.3" />
            <stop offset="100%" stopColor="rgb(147 51 234)" stopOpacity="0" />
          </linearGradient>
        </defs>
      </motion.svg>

      {/* Ultra-smooth Linear logos with depth-based blur and parallax */}
      {logoPositions.map(({ top, left, size, layer, color, blur }, idx) => {
        const parallaxX = useTransform(
          smoothMouseX,
          [0, typeof window !== "undefined" ? window.innerWidth : 1920],
          [-layer * 3, layer * 3]
        );
        const parallaxY = useTransform(
          smoothMouseY,
          [0, typeof window !== "undefined" ? window.innerHeight : 1080],
          [-layer * 2, layer * 2]
        );

        return (
          <motion.svg
            key={`linear-${idx}`}
            className={`absolute ${color} transition-all duration-700 ease-out`}
            viewBox="0 0 100 100"
            fill="currentColor"
            style={{
              width: size,
              height: size,
              top: top,
              left: left,
              x: parallaxX,
              y: parallaxY,
              filter: blur > 0 ? `blur(${blur}px)` : "none",
            }}
            animate={{
              y: [0, -6 - layer * 1.5, 0],
              x: [0, 4 + layer * 0.8, 0],
              rotate: [0, 8 - layer * 2, -6 + layer * 1.5, 0],
              opacity: [
                0.3 + layer * 0.15,
                0.7 + layer * 0.1,
                0.3 + layer * 0.15,
              ],
              scale: [1, 1.03 + layer * 0.01, 1],
            }}
            transition={{
              duration: 15 + idx * 0.8 + layer * 1.5,
              repeat: Infinity,
              ease: [0.25, 0.46, 0.45, 0.94],
              delay: idx * 0.2,
            }}
            whileHover={{
              scale: 1.15,
              rotate: 12,
              opacity: 1,
              transition: {
                type: "spring",
                stiffness: 300,
                damping: 20,
              },
            }}
          >
            <path d="M1.22541 61.5228c-.2225-.9485.90748-1.5459 1.59638-.857L39.3342 97.1782c.6889.6889.0915 1.8189-.857 1.5964C20.0515 94.4522 5.54779 79.9485 1.22541 61.5228ZM.00189135 46.8891c-.01764375.2833.08887215.5599.28957165.7606L52.3503 99.7085c.2007.2007.4773.3075.7606.2896 2.3692-.1476 4.6938-.46 6.9624-.9259.7645-.157 1.0301-1.0963.4782-1.6481L2.57595 39.4485c-.55186-.5519-1.49117-.2863-1.648174.4782-.465915 2.2686-.77832 4.5932-.92588465 6.9624ZM4.21093 29.7054c-.16649.3738-.08169.8106.20765 1.1l64.77602 64.776c.2894.2894.7262.3742 1.1.2077 1.7861-.7956 3.5171-1.6927 5.1855-2.684.5521-.328.6373-1.0867.1832-1.5407L8.43566 24.3367c-.45409-.4541-1.21271-.3689-1.54074.1832-.99132 1.6684-1.88843 3.3994-2.68399 5.1855ZM12.6587 18.074c-.3701-.3701-.393-.9637-.0443-1.3541C21.7795 6.45931 35.1114 0 49.9519 0 77.5927 0 100 22.4073 100 50.0481c0 14.8405-6.4593 28.1724-16.7199 37.3375-.3903.3487-.984.3258-1.3542-.0443L12.6587 18.074Z" />
          </motion.svg>
        );
      })}

      {/* Enhanced ambient particles with depth */}
      {Array.from({ length: 12 }).map((_, i) => {
        // Use deterministic positions based on index to avoid hydration mismatch
        const positions = [
          { top: 15, left: 25 },
          { top: 75, left: 85 },
          { top: 35, left: 65 },
          { top: 85, left: 15 },
          { top: 45, left: 75 },
          { top: 25, left: 45 },
          { top: 65, left: 35 },
          { top: 55, left: 85 },
          { top: 85, left: 55 },
          { top: 25, left: 75 },
          { top: 75, left: 25 },
          { top: 45, left: 15 },
        ];

        return (
          <motion.div
            key={`particle-${i}`}
            className={`absolute rounded-full ${
              i % 3 === 0
                ? "w-1.5 h-1.5 bg-indigo-400/40"
                : i % 3 === 1
                ? "w-1 h-1 bg-blue-500/30"
                : "w-0.5 h-0.5 bg-violet-400/20"
            }`}
            style={{
              top: `${positions[i].top}%`,
              left: `${positions[i].left}%`,
            }}
            animate={{
              y: [0, -120 - i * 10, 0],
              x: [0, (i % 2 === 0 ? 1 : -1) * (10 + i * 3), 0],
              opacity: [0, 0.8, 0],
              scale: [0, 1.2, 0],
            }}
            transition={{
              duration: 12 + i * 0.8,
              repeat: Infinity,
              delay: i * 0.8,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
          />
        );
      })}

      {/* Depth fog overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-white/20 via-transparent to-white/10 pointer-events-none" />
    </div>
  );
}
