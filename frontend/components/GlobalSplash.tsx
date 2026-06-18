'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PixarLoader from './PixarLoader';

export default function GlobalSplash() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Sadece ilk giriste calisacak
    const hasShown = sessionStorage.getItem('global_splash_shown');
    if (!hasShown) {
      setShow(true);
      sessionStorage.setItem('global_splash_shown', 'true');
      
      // 3 saniye sonra ekrandan kaldir
      const timer = setTimeout(() => {
        setShow(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, []);

  if (!show) return null;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="splash"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, y: -50, scale: 1.05 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[9999] bg-white dark:bg-[#050505] flex items-center justify-center overflow-hidden"
        >
          {/* Arkadaki dekoratif gradientler */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 0.5, scale: 1.2 }}
            transition={{ duration: 2.5, ease: "easeOut" }}
            className="absolute -top-[20%] -right-[10%] w-[60%] h-[60%] bg-rose-500/20 dark:bg-rose-600/10 blur-[120px] rounded-full pointer-events-none"
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 0.5, scale: 1.2 }}
            transition={{ duration: 2.5, ease: "easeOut", delay: 0.2 }}
            className="absolute -bottom-[20%] -left-[10%] w-[60%] h-[60%] bg-amber-500/20 dark:bg-amber-600/10 blur-[120px] rounded-full pointer-events-none"
          />
          
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <PixarLoader fullScreen={false} />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
