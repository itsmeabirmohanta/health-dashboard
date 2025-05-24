import React, { ReactNode, useEffect } from 'react';
import { createPortal } from 'react-dom';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  className?: string;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children, className }) => {
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-gradient-to-br from-blue-200/40 via-white/30 to-purple-200/40 backdrop-blur-[8px] transition-opacity animate-fade-in"
        onClick={onClose}
      />
      {/* Modal Content */}
      <div
        className={`relative z-10 rounded-[2.5rem] shadow-2xl max-w-[95vw] max-h-[90vh] w-[95vw] h-[90vh] mx-auto flex flex-col items-center justify-center overflow-hidden border border-white/30 bg-white/30 dark:bg-slate-900/40 backdrop-blur-[16px] ${className || ''}`}
        onClick={e => e.stopPropagation()}
        style={{ boxShadow: '0 8px 64px 0 rgba(80,120,255,0.18)' }}
      >
        {/* Accent bar */}
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-blue-500 via-purple-400 to-pink-400 rounded-t-[2.5rem]" />
        {children}
        {/* Floating close button */}
        <button
          className="absolute top-7 right-8 w-12 h-12 flex items-center justify-center rounded-full bg-white/70 dark:bg-slate-800/70 shadow-lg text-gray-500 hover:text-blue-600 hover:bg-white/90 dark:hover:bg-slate-700/90 text-2xl font-bold transition-all border border-white/40 backdrop-blur"
          onClick={onClose}
          aria-label="Close"
          style={{ boxShadow: '0 2px 16px 0 rgba(80,120,255,0.10)' }}
        >
          &times;
        </button>
      </div>
    </div>,
    document.body
  );
}; 