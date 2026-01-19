import { PlanType } from "@/api/generated/mf-portfolio-apis/models/planType";
import type {
  CategoryPreferenceOption,
  PlanTypeOption,
} from "../types/basket-builder.types";

/**
 * Available plan types for mutual fund baskets
 */
export const planTypeOptions: PlanTypeOption[] = [
  {
    id: PlanType.direct,
    name: "Direct Plan",
    description: "Lower expense ratio, higher returns",
  },
  {
    id: PlanType.regular,
    name: "Regular Plan",
    description: "With distributor commission",
  },
];

/**
 * Category preference options with preset allocations
 */
export const categoryPreferenceOptions: CategoryPreferenceOption[] = [
  {
    id: "largecap",
    name: "Largecap Focus",
    description: "Primarily large cap funds",
    categories: [
      { name: "Large Cap Fund", percentage: 60, schemesCount: 1 },
      { name: "Flexi Cap Fund", percentage: 25, schemesCount: 1 },
      { name: "Corporate Bond Fund", percentage: 15, schemesCount: 1 },
    ],
  },
  {
    id: "midcap",
    name: "Midcap Focus",
    description: "Primarily mid cap funds",
    categories: [
      { name: "Mid Cap Fund", percentage: 50, schemesCount: 1 },
      { name: "Large Cap Fund", percentage: 30, schemesCount: 1 },
      { name: "Corporate Bond Fund", percentage: 20, schemesCount: 1 },
    ],
  },
  {
    id: "smallcap",
    name: "Smallcap Focus",
    description: "Primarily small cap funds",
    categories: [
      { name: "Small Cap Fund", percentage: 40, schemesCount: 1 },
      { name: "Mid Cap Fund", percentage: 35, schemesCount: 1 },
      { name: "Large Cap Fund", percentage: 25, schemesCount: 1 },
    ],
  },
  {
    id: "balanced",
    name: "Balanced Portfolio",
    description: "Mix of equity and debt",
    categories: [
      { name: "Large Cap Fund", percentage: 40, schemesCount: 1 },
      { name: "Mid Cap Fund", percentage: 30, schemesCount: 1 },
      { name: "Corporate Bond Fund", percentage: 30, schemesCount: 1 },
    ],
  },
  {
    id: "custom",
    name: "Custom",
    description: "Build your own allocation",
    categories: [],
  },
];

/**
 * Step definitions for mutual fund basket builder
 */
export const mutualFundBasketSteps = [
  { number: 1, title: "Plan Type", description: "Direct or Regular" },
  {
    number: 2,
    title: "Category Preference",
    description: "Choose allocation style",
  },
  {
    number: 3,
    title: "Category Allocation",
    description: "Adjust weightages",
  },
  {
    number: 4,
    title: "Scheme per Category",
    description: "Number of schemes",
  },
];
