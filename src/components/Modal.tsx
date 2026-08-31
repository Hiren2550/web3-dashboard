"use client";

import React, { useEffect } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  maxWidth?: string;
}

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = "max-w-lg",
}: ModalProps) {
  // Prevent background scroll when modal is open & handle Escape key press
  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-modal-backdrop">
      {/* Backdrop overlay click to close */}
      <div
        className="fixed inset-0 z-0"
        onClick={onClose}
        aria-label="Close modal background"
      />

      {/* Modal Dialog Content Container */}
      <div
        className={`relative z-10 glass-panel rounded-3xl border border-white/15 shadow-2xl ${maxWidth} w-full max-h-[90vh] sm:max-h-[85vh] flex flex-col bg-slate-900/95 overflow-hidden transform transition-all animate-modal-content`}
      >
        {/* Modal Header with Title & Close Button (Fixed at top) */}
        <div className="shrink-0 flex items-center justify-between px-6 py-4 border-b border-white/10 bg-slate-900/90">
          <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">{title}</h3>

          {/* Close Button ('✕') */}
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-red-500/20 hover:text-red-400 text-slate-300 flex items-center justify-center transition-all border border-white/10 cursor-pointer group"
            title="Close modal (Esc)"
            aria-label="Close modal"
          >
            <svg
              className="w-4 h-4 group-hover:rotate-90 transition-transform duration-200"
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

        {/* Modal Body (Scrollable inside modal) */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 custom-scrollbar">
          {children}
        </div>
      </div>
    </div>
  );
}

