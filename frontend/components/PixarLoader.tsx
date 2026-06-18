'use client';

import { motion } from 'framer-motion';

export default function PixarLoader({ fullScreen = true }: { fullScreen?: boolean }) {
  const containerClasses = fullScreen 
    ? "flex flex-col items-center justify-center min-h-screen bg-white dark:bg-[#050505] w-full absolute inset-0 z-[100]" 
    : "flex flex-col items-center justify-center py-24 w-full";

  return (
    <div className={containerClasses}>
      <div className="relative flex items-end text-5xl md:text-6xl font-black tracking-tighter text-gray-900 dark:text-white font-celinda">

        {/* "H" */}
        <span className="relative z-10">H</span>
        
        {/* "i" container */}
        <div className="relative flex flex-col items-center justify-end w-6 md:w-8">
          {/* Bouncing Ball */}
          <motion.div
            className="absolute w-5 h-5 md:w-7 md:h-7 bg-rose-600 rounded-full z-20"
            style={{ bottom: 0 }}
            initial={{ y: -200, x: -100, opacity: 0 }}
            animate={{ 
              y: [-200, -20, -100, 0, -50, 15, 15], 
              x: [-100, -50, 0,   0,   0,   0, 0],
              opacity: [0, 1, 1, 1, 1, 1, 1]
            }}
            transition={{ 
              duration: 2, 
              ease: "easeOut",
              times: [0, 0.15, 0.35, 0.55, 0.75, 0.9, 1],
              repeat: Infinity,
              repeatDelay: 1
            }}
          />
          {/* Letter "i" */}
          <motion.span
            className="inline-block origin-bottom"
            animate={{ 
              scaleY: [1, 1, 1, 0.7, 1, 0.2, 0.2],
              scaleX: [1, 1, 1, 1.1, 1, 1.5, 1.5]
            }}
            transition={{ 
              duration: 2, 
              ease: "easeOut",
              times: [0, 0.15, 0.35, 0.55, 0.75, 0.9, 1],
              repeat: Infinity,
              repeatDelay: 1
            }}
          >
            i
          </motion.span>
        </div>
        
        {/* "zmetBul" */}
        <span className="relative z-10">zmetBul</span>
      </div>
      
      <motion.p 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        transition={{ delay: 0.5 }}
        className="mt-8 text-xs md:text-sm font-bold text-gray-400 tracking-[0.3em] uppercase"
      >
        Yükleniyor
      </motion.p>
    </div>
  );
}
