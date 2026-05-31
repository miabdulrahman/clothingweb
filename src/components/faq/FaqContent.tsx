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
        <p className="text-[10px] font-semibold uppercase tracking-widest text-brand-gold dark:text-dark-gold">
          Help Center
        </p>
        <h1 className="font-display text-3xl sm:text-5xl font-bold uppercase tracking-wider text-brand-charcoal dark:text-dark-text">
          Frequently Asked
        </h1>
        <p className="text-sm text-brand-charcoal/50 dark:text-dark-muted font-light leading-relaxed">
          Quick answers to reduce back-and-forth WhatsApp inquiries. If you can&apos;t find your answer here, feel free to chat with us.
        </p>
      </div>

      {/* Accordions */}
      <div className="space-y-8">
        {categories.map((category) => (
          <div key={category} className="space-y-4">
            <h2 className="font-display text-xs font-bold uppercase tracking-widest text-brand-gold dark:text-dark-gold border-b border-brand-charcoal/10 dark:border-dark-border pb-2">
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
                    className={cn(
                      'border bg-brand-cream/50 dark:bg-dark-card/50 transition-all duration-300',
                      isOpen
                        ? 'border-brand-charcoal/15 dark:border-dark-gold/20'
                        : 'border-brand-charcoal/5 dark:border-dark-border'
                    )}
                  >
                    <button
                      onClick={() => setActiveIdx(isOpen ? null : globalIdx)}
                      className="w-full flex items-center justify-between text-left p-4 font-medium text-xs sm:text-sm text-brand-charcoal dark:text-dark-text uppercase tracking-wider focus:outline-none cursor-pointer group"
                    >
                      <span className={cn('transition-colors duration-300 font-semibold', isOpen && 'text-brand-gold dark:text-dark-gold')}>{faq.question}</span>
                      <motion.span
                        className="text-base font-bold ml-2 text-brand-charcoal/60 dark:text-dark-muted"
                        animate={{ rotate: isOpen ? 45 : 0 }}
                        transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
                      >
                        +
                      </motion.span>
                    </button>

                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
                          className="overflow-hidden"
                        >
                          <div className="px-4 pb-5 pt-1 text-xs font-light text-brand-charcoal/70 dark:text-dark-muted leading-relaxed border-t border-brand-charcoal/5 dark:border-dark-border">
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
