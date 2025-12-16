"use client";
import { ComponentType } from "react";
import Sources from "./sources";
import { ScannerResults } from "./scanner-results";
import SimulationChart from "./SimulationChart";
import LineChart from "./LineChart";
import StockAnalysisComponent from "./stock-analysis";
import MfAnalysisComponent from "./mf-analysis";

const ClientComponentsRegistry: Record<string, ComponentType<any>> = {
  sources: Sources,
  scanner_results: ScannerResults,
  simulation_chart: SimulationChart,
  line_chart: LineChart,
  stock_analysis: StockAnalysisComponent,
  mf_analysis: MfAnalysisComponent,
};

export default ClientComponentsRegistry;
