"use client";

import { motion } from "framer-motion";
import SectionWrapper from "../shared/SectionWrapper";
import FeatureCard from "./FeatureCard";
import { features } from "../../constants/features-data";

export default function FeaturesGrid() {
  return (
    <SectionWrapper id="features" className="bg-gray-50/80">
      <div className="mb-14 text-center">
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-3 text-sm font-semibold uppercase tracking-wider text-primary"
        >
          Features
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="text-3xl font-bold text-primary-main-dark sm:text-4xl"
        >
          Everything You Need to Invest Smarter
        </motion.h2>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
        {features.map((feature, i) => (
          <FeatureCard key={feature.title} feature={feature} index={i} />
        ))}
      </div>
    </SectionWrapper>
  );
}
