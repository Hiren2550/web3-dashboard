"use client";

import React, { useEffect } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export default function Modal({ isOpen, onClose, title, children }: ModalProps) {
  // Close modal on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      {/* Backdrop overlay click to close */}
      <div
        className="fixed inset-0 z-0"
        onClick={onClose}
        aria-label="Close modal background"
      />

      {/* Modal Dialog Content Container */}
      <div className="relative z-10 glass-panel rounded-3xl border border-white/15 shadow-2xl max-w-lg w-full p-6 sm:p-8 bg-slate-900/95 overflow-hidden transform transition-all animate-scaleUp">
        
        {/* Modal Header with Title & Close Button */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
          <h3 className="text-xl font-bold text-white tracking-tight">{title}</h3>
          
          {/* Close Button ('✕') */}
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-red-500/20 hover:text-red-400 text-slate-300 flex items-center justify-center transition-all border border-white/10 cursor-pointer group"
            title="Close modal (Esc)"
            aria-label="Close modal"
          >
            <svg
              className="w-5 h-5 group-hover:rotate-90 transition-transform duration-200"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Modal Body */}
        <div>{children}</div>
      </div>
    </div>
  );
}
