import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import { a4PageSizes } from "@/configs/pdf-constants";

type Props = {
  children: React.ReactNode,
  pgNo: number,
};

function PageLayout({ children, pgNo }: Props) {
  return (
    <div
      className={`flex flex-col w-[${a4PageSizes.width}] h-[${a4PageSizes.height}]`}
    >
      <Header />
      <main className="flex-1 py-8 px-14">{children}</main>
      <Footer pgNo={pgNo} />
    </div>
  );
}

export default PageLayout;
