"use client";

import React, { useEffect, useState } from "react";

export function TypingBarsLoader() {
  const messages = [
    "Thinking",
    "Processing",
    "Analyzing",
    "Generating response",
  ];

  const [messageIndex, setMessageIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setMessageIndex((prev) => (prev + 1) % messages.length);
        setIsAnimating(false);
      }, 300); // Half of the animation duration
    }, 5000);

    return () => clearInterval(interval);
  }, [messages.length]);

  return (
    <div className="w-full">
      <div className="flex items-center gap-3">
        {/* Animated bars */}
        <div className="flex items-center gap-1.5">
          {/* Bar 1 */}
          <div className="w-1 rounded-full bg-gradient-to-t from-indigo-600 to-indigo-400 animate-bar-bounce"
               style={{ animationDelay: '0s', height: '24px' }} />

          {/* Bar 2 */}
          <div className="w-1 rounded-full bg-gradient-to-t from-purple-600 to-purple-400 animate-bar-bounce"
               style={{ animationDelay: '0.15s', height: '24px' }} />

          {/* Bar 3 */}
          <div className="w-1 rounded-full bg-gradient-to-t from-blue-600 to-blue-400 animate-bar-bounce"
               style={{ animationDelay: '0.3s', height: '24px' }} />

          {/* Bar 4 */}
          <div className="w-1 rounded-full bg-gradient-to-t from-indigo-600 to-indigo-400 animate-bar-bounce"
               style={{ animationDelay: '0.45s', height: '24px' }} />
        </div>

        {/* Text with gradient - changes every 5 seconds */}
        <span className={`text-sm font-medium bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 bg-clip-text text-transparent ${isAnimating ? 'animate-text-exit' : 'animate-text-enter'}`}>
          {messages[messageIndex]}...
        </span>
      </div>

      <style jsx>{`
        @keyframes bar-bounce {
          0%, 100% {
            transform: scaleY(0.5);
            opacity: 0.5;
          }
          50% {
            transform: scaleY(1);
            opacity: 1;
          }
        }

        @keyframes text-exit {
          0% {
            opacity: 1;
            transform: translateY(0);
          }
          100% {
            opacity: 0;
            transform: translateY(-8px);
          }
        }

        @keyframes text-enter {
          0% {
            opacity: 0;
            transform: translateY(8px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-bar-bounce {
          animation: bar-bounce 1.2s ease-in-out infinite;
          transform-origin: center;
        }

        .animate-text-exit {
          animation: text-exit 0.3s ease-out forwards;
        }

        .animate-text-enter {
          animation: text-enter 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
