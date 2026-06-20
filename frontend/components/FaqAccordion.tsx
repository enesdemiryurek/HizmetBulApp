'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';

interface FAQ {
  q: string;
  a: string;
}

export default function FaqAccordion({ faqs }: { faqs: FAQ[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleOpen = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 items-start">
      {faqs.map((faq, index) => {
        const isOpen = openIndex === index;

        return (
          <div
            key={index}
            className={`border rounded-2xl overflow-hidden transition-all duration-300 ${
              isOpen
                ? 'bg-white dark:bg-[#111] border-rose-500/30 dark:border-rose-500/30 shadow-lg dark:shadow-[0_4px_20px_rgb(225,29,72,0.1)]'
                : 'bg-white dark:bg-[#0a0a0a] border-gray-100 dark:border-white/5 hover:border-rose-400/50 dark:hover:border-rose-500/30 hover:shadow-md dark:hover:bg-[#111]'
            }`}
          >
            <button
              onClick={() => toggleOpen(index)}
              className="w-full flex items-center justify-between p-4 sm:p-5 text-left focus:outline-none group"
              aria-expanded={isOpen}
            >
              <h3 className={`text-base sm:text-lg font-black transition-colors duration-300 pr-4 ${isOpen ? 'text-rose-600 dark:text-rose-400' : 'text-gray-900 dark:text-white group-hover:text-rose-600 dark:group-hover:text-rose-400'}`}>
                {faq.q}
              </h3>
              <div
                className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 border-2 ${
                  isOpen 
                    ? 'bg-rose-600 border-rose-600 text-white rotate-180 shadow-md shadow-rose-600/30' 
                    : 'bg-rose-50 dark:bg-rose-900/20 border-rose-100 dark:border-rose-900/30 text-rose-600 dark:text-rose-400 group-hover:bg-rose-600 group-hover:border-rose-600 group-hover:text-white group-hover:scale-110'
                }`}
              >
                {isOpen ? <Minus size={16} /> : <Plus size={16} />}
              </div>
            </button>

            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                >
                  <div className="px-4 sm:px-5 pb-5 pt-1">
                    <div className="w-8 h-1 bg-gradient-to-r from-rose-600 to-rose-400 rounded-full mb-4" />
                    <p className="text-gray-600 dark:text-white/70 leading-relaxed text-sm sm:text-base font-medium">
                      {faq.a}
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
