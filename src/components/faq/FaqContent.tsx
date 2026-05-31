'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MOCK_FAQS } from '@/lib/mockData';
import { cn } from '@/lib/utils';

export default function FaqContent() {
  const [activeIdx, setActiveIdx] = useState<number | null>(0);

  // Group FAQs by category
  const categories = Array.from(new Set(MOCK_FAQS.map((item) => item.category)));

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 space-y-12 pb-20 select-none">
      {/* Header */}
      <div className="text-center space-y-3">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-brand-gold">
          Help Center
        </p>
        <h1 className="font-display text-3xl sm:text-5xl font-bold uppercase tracking-wider text-brand-charcoal">
          Frequently Asked
        </h1>
        <p className="text-sm text-brand-charcoal/50 font-light leading-relaxed">
          Quick answers to reduce back-and-forth WhatsApp inquiries. If you can&apos;t find your answer here, feel free to chat with us.
        </p>
      </div>

      {/* Accordions */}
      <div className="space-y-8">
        {categories.map((category) => (
          <div key={category} className="space-y-4">
            <h2 className="font-display text-xs font-bold uppercase tracking-widest text-brand-gold border-b border-brand-charcoal/10 pb-2">
              {category}
            </h2>
            <div className="space-y-3">
              {MOCK_FAQS.filter((faq) => faq.category === category).map((faq, index) => {
                // Find index globally in MOCK_FAQS to use as unique key/idx
                const globalIdx = MOCK_FAQS.findIndex((item) => item.question === faq.question);
                const isOpen = activeIdx === globalIdx;

                return (
                  <div
                    key={globalIdx}
                    className="border border-brand-charcoal/5 bg-brand-cream/50 transition-colors duration-200"
                  >
                    <button
                      onClick={() => setActiveIdx(isOpen ? null : globalIdx)}
                      className="w-full flex items-center justify-between text-left p-4 font-medium text-xs sm:text-sm text-brand-charcoal uppercase tracking-wider focus:outline-none cursor-pointer"
                    >
                      <span className={cn('transition-colors font-semibold', isOpen && 'text-brand-gold')}>{faq.question}</span>
                      <span className="text-base font-bold ml-2">
                        {isOpen ? '−' : '+'}
                      </span>
                    </button>

                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25, ease: 'easeInOut' }}
                          className="overflow-hidden"
                        >
                          <div className="px-4 pb-5 pt-1 text-xs font-light text-brand-charcoal/70 leading-relaxed border-t border-brand-charcoal/5">
                            {faq.answer}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
