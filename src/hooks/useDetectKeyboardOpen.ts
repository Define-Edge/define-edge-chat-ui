"use client";

import { useEffect, useState } from "react";

export default function useDetectKeyboardOpen() {
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const initialHeight = window.innerHeight;

    const handleResize = () => {
      const currentHeight = window.visualViewport?.height || window.innerHeight;

      // If the current height is significantly smaller than the initial height,
      // we assume the keyboard is open.
      // We use a threshold of 150px (typical keyboard is larger).
      // We also check check against window.innerHeight to account for Android resizing.
      const isWindowShrunk = window.innerHeight < initialHeight - 150;
      const isViewportShrunk = currentHeight < initialHeight - 150;

      setIsKeyboardOpen(isWindowShrunk || isViewportShrunk);
    };

    // Attach to both regular resize and visualViewport resize for maximum compatibility
    window.addEventListener("resize", handleResize);
    window.visualViewport?.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.visualViewport?.removeEventListener("resize", handleResize);
    };
  }, []);

  return isKeyboardOpen;
}
