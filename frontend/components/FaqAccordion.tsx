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
    <div className="w-full space-y-4">
      {faqs.map((faq, index) => {
        const isOpen = openIndex === index;

        return (
          <div
            key={index}
            className={`border rounded-[2rem] overflow-hidden transition-all duration-300 ${
              isOpen
                ? 'bg-white dark:bg-[#111] border-rose-500/30 dark:border-rose-500/30 shadow-[0_8px_30px_rgb(0,0,0,0.08)] dark:shadow-[0_8px_30px_rgb(225,29,72,0.1)]'
                : 'bg-white dark:bg-[#0a0a0a] border-gray-100 dark:border-white/5 hover:border-rose-400/50 dark:hover:border-rose-500/30 hover:shadow-lg dark:hover:bg-[#111]'
            }`}
          >
            <button
              onClick={() => toggleOpen(index)}
              className="w-full flex items-center justify-between p-6 sm:p-8 text-left focus:outline-none group"
              aria-expanded={isOpen}
            >
              <h3 className={`text-lg sm:text-xl font-black transition-colors duration-300 pr-6 ${isOpen ? 'text-rose-600 dark:text-rose-400' : 'text-gray-900 dark:text-white group-hover:text-rose-600 dark:group-hover:text-rose-400'}`}>
                {faq.q}
              </h3>
              <div
                className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 border-2 ${
                  isOpen 
                    ? 'bg-rose-600 border-rose-600 text-white rotate-180 shadow-lg shadow-rose-600/30' 
                    : 'bg-rose-50 dark:bg-rose-900/20 border-rose-100 dark:border-rose-900/30 text-rose-600 dark:text-rose-400 group-hover:bg-rose-600 group-hover:border-rose-600 group-hover:text-white group-hover:scale-110'
                }`}
              >
                {isOpen ? <Minus size={22} /> : <Plus size={22} />}
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
                  <div className="px-6 sm:px-8 pb-8 pt-2">
                    <div className="w-12 h-1 bg-gradient-to-r from-rose-600 to-rose-400 rounded-full mb-6" />
                    <p className="text-gray-600 dark:text-white/70 leading-relaxed text-[16px] sm:text-[17px] font-medium">
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
