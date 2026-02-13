"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import SectionWrapper from "../shared/SectionWrapper";
import { showcaseFeatures } from "../../constants/features-data";

export default function FeatureShowcase() {
  return (
    <SectionWrapper className="bg-white">
      <div className="flex flex-col gap-24">
        {showcaseFeatures.map((feature, idx) => {
          const Icon = feature.icon;
          const isReversed = idx % 2 !== 0;

          return (
            <div
              key={feature.title}
              className={cn(
                "flex flex-col items-center gap-10 lg:flex-row lg:gap-16",
                isReversed && "lg:flex-row-reverse",
              )}
            >
              {/* Text side */}
              <motion.div
                initial={{ opacity: 0, x: isReversed ? 30 : -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="flex-1"
              >
                <div
                  className={cn(
                    "mb-4 flex size-12 items-center justify-center rounded-lg",
                    feature.iconBg,
                  )}
                >
                  <Icon className="size-6 text-primary-main-dark" />
                </div>
                <h3 className="mb-3 text-2xl font-bold text-primary-main-dark sm:text-3xl">
                  {feature.title}
                </h3>
                <p className="mb-6 text-text-secondary leading-relaxed">
                  {feature.description}
                </p>
                <ul className="space-y-3">
                  {feature.bullets.map((bullet) => (
                    <li
                      key={bullet}
                      className="flex items-start gap-3 text-text-secondary"
                    >
                      <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-green-100">
                        <Check className="size-3 text-green-600" />
                      </span>
                      {bullet}
                    </li>
                  ))}
                </ul>
              </motion.div>

              {/* Visual side */}
              <motion.div
                initial={{ opacity: 0, x: isReversed ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.6, delay: 0.15, ease: "easeOut" }}
                className="flex flex-1 items-center justify-center"
              >
                <div
                  className={cn(
                    "relative h-64 w-full max-w-md overflow-hidden rounded-2xl bg-gradient-to-br shadow-lg sm:h-80",
                    feature.gradient,
                  )}
                >
                  {/* Decorative elements */}
                  <div className="absolute inset-0 opacity-20">
                    <div className="absolute top-6 left-6 h-20 w-32 rounded-lg bg-white/30" />
                    <div className="absolute top-10 right-8 h-16 w-16 rounded-full bg-white/20" />
                    <div className="absolute bottom-8 left-10 h-12 w-40 rounded-lg bg-white/25" />
                    <div className="absolute right-6 bottom-6 h-24 w-24 rounded-xl bg-white/15" />
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Icon className="size-20 text-white/30" />
                  </div>
                </div>
              </motion.div>
            </div>
          );
        })}
      </div>
    </SectionWrapper>
  );
}
