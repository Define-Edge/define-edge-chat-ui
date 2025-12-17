"use client"
import React from "react";
import { useTotalPageCtx } from "../stock-report/TotalPageCtx";
import { cn } from "@/lib/utils";
import BarChartIcon from "@/components/icons/BarChartIcon";
import HorizontalSeparatorIcon from "@/components/icons/HorizontalSeparatorIcon";

type Props = {
  pgNo: number;
  className?: string;
};

function Footer({
  pgNo,
  className = "bg-gradient-to-r from-[#00004fff] to-[#063baaff]",
}: Props) {
  const totalPages = useTotalPageCtx();
  return (
    <footer
      className={cn("flex items-center h-[4.5rem] px-14 text-white", className)}
    >
      <div className="flex-1 mt-1">
        <div className="text-sm leading-3">
          Copyright @FinSharpe Investment Advisors
        </div>
        <span className="text-[0.65rem]">*T & C Apply</span>
      </div>
      <div className="flex items-center gap-3">
        <BarChartIcon />
        <div className="flex items-center gap-1">
          Pg. {pgNo} <HorizontalSeparatorIcon /> {totalPages}
        </div>
      </div>
    </footer>
  );
}

export default Footer;
