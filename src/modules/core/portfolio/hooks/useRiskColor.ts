import { useMemo } from "react";

type Data = { value: number }[] | undefined;

const useRiskColor = (data: Data) => {
  return useMemo(() => {
    if (data && data.length > 0) {
      const { value } = data[0];
      if (value < 30) return "#4ade80"; // Tailwind green-400
      if (value >= 30 && value <= 60) return "#fb923c"; // Tailwind orange-400
      if (value > 60) return "#ec4899"; // Tailwind pink-500
    }
    return "";
  }, [data]);
};

export default useRiskColor;
