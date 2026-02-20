"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { Feature } from "../../constants/features-data";

interface FeatureCardProps {
  feature: Feature;
  index: number;
}

export default function FeatureCard({ feature, index }: FeatureCardProps) {
  const Icon = feature.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ delay: index * 0.08, duration: 0.5, ease: "easeOut" }}
      className="group rounded-xl border border-gray-100 bg-white p-6 shadow-sm transition-shadow duration-300 hover:shadow-md"
    >
      <div
        className={cn(
          "mb-4 flex size-12 items-center justify-center rounded-lg",
          feature.color,
        )}
      >
        <Icon className={cn("size-6", feature.iconColor)} />
      </div>
      <h3 className="mb-2 text-lg font-semibold text-text-primary">
        {feature.title}
      </h3>
      <p className="text-sm leading-relaxed text-text-secondary">
        {feature.description}
      </p>
    </motion.div>
  );
}
