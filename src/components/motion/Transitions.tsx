'use client';

import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

interface AnimationProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
}

// Smoother ease curves
const smoothEase: [number, number, number, number] = [0.25, 0.46, 0.45, 0.94];
const decelerate: [number, number, number, number] = [0.0, 0.0, 0.2, 1.0];
const snappy: [number, number, number, number] = [0.16, 1, 0.3, 1];

export function FadeIn({ children, className, delay = 0, duration = 0.6 }: AnimationProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration, delay, ease: smoothEase }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function SlideUp({ children, className, delay = 0, duration = 0.7 }: AnimationProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration, delay, ease: snappy }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function SlideInLeft({ children, className, delay = 0, duration = 0.7 }: AnimationProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -40 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration, delay, ease: snappy }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function SlideInRight({ children, className, delay = 0, duration = 0.7 }: AnimationProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration, delay, ease: snappy }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function ScaleIn({ children, className, delay = 0, duration = 0.6 }: AnimationProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration, delay, ease: smoothEase }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function BlurIn({ children, className, delay = 0, duration = 0.7 }: AnimationProps) {
  return (
    <motion.div
      initial={{ opacity: 0, filter: 'blur(8px)' }}
      whileInView={{ opacity: 1, filter: 'blur(0px)' }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration, delay, ease: smoothEase }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function ScaleOnHover({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.3, ease: smoothEase }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function StaggerContainer({
  children,
  className,
  delay = 0,
  staggerInterval = 0.08,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  staggerInterval?: number;
}) {
  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-40px' }}
      variants={{
        hidden: {},
        show: {
          transition: {
            staggerChildren: staggerInterval,
            delayChildren: delay,
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function StaggerChild({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 24, filter: 'blur(4px)' },
        show: {
          opacity: 1,
          y: 0,
          filter: 'blur(0px)',
          transition: { duration: 0.6, ease: snappy },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function ParallaxSection({
  children,
  className,
  offset = 50,
}: {
  children: React.ReactNode;
  className?: string;
  offset?: number;
}) {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, offset]);

  return (
    <motion.div style={{ y }} className={className}>
      {children}
    </motion.div>
  );
}
