"use client";

import { motion } from "framer-motion";
import { Landmark, Lock, Eye } from "lucide-react";
import SectionWrapper from "../shared/SectionWrapper";

const badges = [
  {
    icon: Landmark,
    title: "RBI Regulated",
    description: "Account Aggregator framework approved by the Reserve Bank of India",
  },
  {
    icon: Lock,
    title: "256-bit Encryption",
    description: "Bank-level encryption for all data transfers and storage",
  },
  {
    icon: Eye,
    title: "Read-Only Access",
    description: "We can only view your data — never initiate transactions",
  },
];

export default function SecuritySection() {
  return (
    <SectionWrapper className="bg-primary-main-dark text-white">
      <div className="text-center">
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-3 text-sm font-semibold uppercase tracking-wider text-brand-teal"
        >
          Security
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="mb-4 text-3xl font-bold sm:text-4xl"
        >
          Bank-Level Security
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mx-auto mb-14 max-w-2xl text-blue-200"
        >
          Your financial data is protected with the highest standards of
          security and privacy. We follow industry best practices and
          regulatory guidelines.
        </motion.p>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        {badges.map((badge, i) => {
          const Icon = badge.icon;
          return (
            <motion.div
              key={badge.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12, duration: 0.5, ease: "easeOut" }}
              className="flex flex-col items-center text-center"
            >
              <div className="mb-4 flex size-14 items-center justify-center rounded-full bg-white/10">
                <Icon className="size-7 text-brand-teal" />
              </div>
              <h3 className="mb-2 text-lg font-semibold">{badge.title}</h3>
              <p className="text-sm leading-relaxed text-blue-200">
                {badge.description}
              </p>
            </motion.div>
          );
        })}
      </div>
    </SectionWrapper>
  );
}
