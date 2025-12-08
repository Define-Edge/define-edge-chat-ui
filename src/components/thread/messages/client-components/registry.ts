import Sources from "./sources";
import { ScannerResults } from "./scanner-results";
import SimulationChart from "./SimulationChart";
import LineChart from "./LineChart";

const ClientComponentsRegistry = {
    "sources": Sources,
    "scanner_results": ScannerResults,
    simulation_chart: SimulationChart,
    line_chart: LineChart,
}

export default ClientComponentsRegistry;