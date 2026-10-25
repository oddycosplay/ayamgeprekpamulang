import React, { useEffect } from 'react';
import { X, LogIn, ShieldCheck, ArrowRight } from 'lucide-react';
import { CRM_URL } from '../lib/crmApi.ts';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  // Kept for compatibility with App.tsx; login is owner-only now.
  isLoggedIn?: boolean;
  userName?: string;
  onLogin?: (name: string) => void;
  onLogout?: () => void;
}

// Login khusus owner: kata sandi diperiksa di CRM (server), bukan di website ini.
export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" role="dialog" aria-modal="true">
      <button aria-label="Tutup" className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl">
        <div className="flex items-center justify-between gap-3 bg-[#FBF8F3] px-6 py-5 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-[#781519] text-[#F5C518]">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-serif text-xl font-bold text-gray-900">Login Owner</h2>
              <p className="text-xs text-gray-500">Khusus pemilik Ayam Penyet Al-Fariz</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-700" aria-label="Tutup">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-5 px-6 py-6">
          <p className="text-sm leading-relaxed text-gray-600">
            Halaman ini untuk owner mengelola menu, harga, dan melacak pesanan masuk. Kamu akan diarahkan ke
            <strong> Dapur Al-Fariz CRM</strong> untuk memasukkan kata sandi owner.
          </p>
          <a
            href={`${CRM_URL}/crm.html`}
            className="flex w-full items-center justify-between rounded-2xl bg-[#F5C518] px-5 py-3.5 text-sm font-extrabold text-[#5e0d10] shadow-sm transition hover:bg-[#e0b312]"
          >
            <span className="flex items-center gap-2">
              <LogIn className="h-4 w-4" /> Masuk ke CRM Owner
            </span>
            <ArrowRight className="h-4 w-4" />
          </a>
          <p className="text-center text-[11px] text-gray-400">
            Pelanggan tidak perlu login. Langsung pesan lewat menu atau WhatsApp.
          </p>
        </div>
      </div>
    </div>
  );
};
