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
            className={`border rounded-2xl overflow-hidden transition-all duration-300 ${
              isOpen
                ? 'bg-white border-rose-600/30 shadow-lg'
                : 'bg-[#ffffff]/80 border-rose-900/10 hover:border-rose-400 hover:bg-white shadow-sm'
            }`}
          >
            <button
              onClick={() => toggleOpen(index)}
              className="w-full flex items-center justify-between p-6 text-left focus:outline-none"
              aria-expanded={isOpen}
            >
              <h3 className={`text-lg font-black transition-colors duration-300 ${isOpen ? 'text-[#9a0002]' : 'text-rose-950'}`}>
                {faq.q}
              </h3>
              <div
                className={`flex-shrink-0 ml-4 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                  isOpen ? 'bg-[#9a0002] text-white rotate-180' : 'bg-rose-50 text-[#9a0002]'
                }`}
              >
                {isOpen ? <Minus size={20} /> : <Plus size={20} />}
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
                  <div className="px-6 pb-6 pt-2">
                    <div className="w-full h-px bg-gradient-to-r from-rose-100 to-transparent mb-4" />
                    <p className="text-rose-950/80 leading-relaxed text-[16px] font-medium">
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
