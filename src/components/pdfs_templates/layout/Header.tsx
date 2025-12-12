import React from "react";

function Header() {

  return (
    <header className="flex items-center px-14 h-[4.5rem] bg-gradient-to-r from-[#063baaff] to-[#00004fff] text-white">
      <div className="flex-1 text-xl">
        FinSharpe's{" "}
        <strong className="text-secondary">Insight360</strong>
      </div>
      <div className="mt-2">
        <div className="text-xl leading-3">
          FinSharpe
        </div>
        <span className="text-[0.65rem]">
          Investment Advisors
        </span>
      </div>
    </header>
  );
}

export default Header;
