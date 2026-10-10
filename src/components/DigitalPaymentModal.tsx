import React, { useState, useEffect } from 'react';
import { liveMenuSnapshot } from '../lib/crmApi.ts';
import {
  QrCode,
  Wallet,
  Building2,
  CheckCircle2,
  Copy,
  Check,
  Clock,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  X,
  Receipt,
  Download,
  MessageCircle,
  Smartphone
} from 'lucide-react';
import { MenuItem } from '../types.ts';

export interface PaymentSimulationData {
  orderId?: string;
  menuItem: MenuItem;
  portion: number;
  spiceLevel: number;
  sambalServing: string;
  addons: {
    extraSambel: boolean;
    tambahNasi: boolean;
  };
  pickupMethod: string;
  customerName: string;
  notes: string;
  subtotal: number;
  ppn: number;
  grandTotal: number;
}

interface DigitalPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderData: PaymentSimulationData;
  onPaymentSuccess?: (method: string, txId: string) => void;
  initialMethod?: 'qris' | 'gopay' | 'dana' | 'ovo' | 'shopeepay' | 'bca';
  isPaid?: boolean;
  existingTxId?: string;
}

export const DigitalPaymentModal: React.FC<DigitalPaymentModalProps> = ({
  isOpen,
  onClose,
  orderData,
  onPaymentSuccess,
  initialMethod = 'qris',
  isPaid = false,
  existingTxId
}) => {
  const [activeTab, setActiveTab] = useState<'qris' | 'ewallet' | 'va'>('qris');
  const [selectedEwallet, setSelectedEwallet] = useState<'gopay' | 'dana' | 'ovo' | 'shopeepay'>('gopay');
  const [selectedBank, setSelectedBank] = useState<'bca' | 'mandiri' | 'bri' | 'seabank'>('bca');
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentCompleted, setPaymentCompleted] = useState(isPaid);
  const [txId, setTxId] = useState(existingTxId || `TX-FARIZ-${Math.floor(100000 + Math.random() * 900000)}`);
  const [paymentTime, setPaymentTime] = useState(
    new Date().toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  );
  const [timeLeft, setTimeLeft] = useState(899); // 14 mins 59 secs

  // Sync state if modal reopens with different isPaid status
  useEffect(() => {
    if (isOpen) {
      setPaymentCompleted(isPaid);
      if (existingTxId) setTxId(existingTxId);
      setTimeLeft(899);
    }
  }, [isOpen, isPaid, existingTxId]);

  // Countdown timer for pending QRIS
  useEffect(() => {
    if (!isOpen || paymentCompleted) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [isOpen, paymentCompleted]);

  if (!isOpen) return null;

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const timerStr = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const copyToClipboard = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2500);
  };

  const handleSimulateSuccess = (methodName: string) => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setPaymentCompleted(true);
      const nowStr = new Date().toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
      setPaymentTime(nowStr);
      if (onPaymentSuccess) {
        onPaymentSuccess(methodName, txId);
      }
    }, 1200);
  };

  // WhatsApp text with paid proof
  const generateWhatsAppPaidUrl = () => {
    const text =
      `*BUKTI SIMULASI PEMBAYARAN DIGITAL LUNAS* ✅\n` +
      `----------------------------------------\n` +
      `No. Referensi: ${txId}\n` +
      `Waktu: ${paymentTime}\n` +
      `Metode: ${activeTab === 'qris' ? 'QRIS Nasional' : activeTab === 'ewallet' ? selectedEwallet.toUpperCase() : `VA ${selectedBank.toUpperCase()}`}\n` +
      `Status: *LUNAS (VERIFIKASI SUKSES)*\n\n` +
      `*RINCIAN PESANAN:*\n` +
      `• ${orderData.portion}x ${orderData.menuItem.name}\n` +
      `  - Sambal: ${orderData.sambalServing === 'dicampur' ? 'Dicampur di atas ayam' : orderData.sambalServing === 'dipisah' ? 'Dipisah' : 'Tanpa Sambal'}\n` +
      (orderData.addons.extraSambel ? `  - Extra Sambel (+Rp ${(liveMenuSnapshot().addonPrices.extraSambel * orderData.portion).toLocaleString('id-ID')})\n` : '') +
      (orderData.addons.tambahNasi ? `  - Tambah Nasi (+Rp ${(liveMenuSnapshot().addonPrices.tambahNasi * orderData.portion).toLocaleString('id-ID')})\n` : '') +
      `\n*TOTAL BAYAR: Rp ${orderData.grandTotal.toLocaleString('id-ID')}*\n` +
      `Pemesan: ${orderData.customerName || 'Pelanggan UNPAM'}\n` +
      (orderData.notes ? `Catatan: ${orderData.notes}\n` : '') +
      `\nMohon dicek dan langsung disiapkan ya kak! Terima kasih 🙏`;

    return `https://wa.me/628973816530?text=${encodeURIComponent(text)}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200 overflow-y-auto">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-gray-100 overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#781519] via-[#8E1B20] to-[#5e0d10] text-white p-5 sm:p-6 relative flex-shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition"
            aria-label="Tutup modal"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2.5 mb-2">
            <span className="p-1.5 bg-[#F5C518] text-[#5e0d10] rounded-xl shadow-sm">
              <QrCode className="w-5 h-5" />
            </span>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] tracking-wider font-extrabold uppercase bg-white/15 px-2 py-0.5 rounded-full text-amber-200">
                Pembayaran Digital • Order Sekarang
              </span>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" /> QRIS & E-Wallet
              </span>
            </div>
          </div>

          <h3 className="text-xl sm:text-2xl font-black font-serif text-white tracking-tight">
            {paymentCompleted ? 'Bukti Struk Digital Lunas' : 'Metode Pembayaran Digital'}
          </h3>
          <p className="text-xs text-amber-100/90 mt-0.5">
            Merchant: <strong>Ayam Geprek Al-Fariz (Depan UNPAM Pamulang)</strong>
          </p>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-5">
          {/* CASE 1: SUKSES / LUNAS */}
          {paymentCompleted ? (
            <div className="space-y-5">
              {/* Animated Success Badge */}
              <div className="text-center py-4 bg-emerald-50 rounded-2xl border border-emerald-200 space-y-2">
                <div className="w-16 h-16 bg-emerald-500 text-white rounded-full flex items-center justify-center mx-auto shadow-lg animate-bounce">
                  <Check className="w-9 h-9 stroke-[3]" />
                </div>
                <div>
                  <span className="inline-block px-3 py-1 bg-emerald-600 text-white text-xs font-black uppercase tracking-wider rounded-full shadow-sm">
                    ✓ PEMBAYARAN LUNAS (SIMULASI)
                  </span>
                  <h4 className="text-xl font-black text-gray-900 mt-2 font-serif">
                    Rp {orderData.grandTotal.toLocaleString('id-ID')}
                  </h4>
                  <p className="text-xs text-gray-600 mt-0.5">
                    Transaksi berhasil diverifikasi otomatis oleh sistem.
                  </p>
                </div>
              </div>

              {/* Digital Receipt Card */}
              <div className="border border-dashed border-gray-300 rounded-2xl p-4 bg-[#FCFAF7] space-y-3 text-xs">
                <div className="flex items-center justify-between border-b border-gray-200 pb-2.5">
                  <span className="font-bold text-gray-500 flex items-center gap-1.5">
                    <Receipt className="w-3.5 h-3.5 text-[#781519]" /> Struk Resmi Transaksi
                  </span>
                  <span className="font-mono text-[11px] font-bold text-gray-700 bg-gray-200/60 px-2 py-0.5 rounded">
                    {txId}
                  </span>
                </div>

                <div className="space-y-1.5 text-gray-600">
                  <div className="flex justify-between">
                    <span>Waktu Pembayaran</span>
                    <span className="font-semibold text-gray-900">{paymentTime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Metode Pembayaran</span>
                    <span className="font-semibold text-[#781519]">
                      {activeTab === 'qris'
                        ? 'QRIS Standar Nasional (Instant)'
                        : activeTab === 'ewallet'
                        ? `E-Wallet ${selectedEwallet.toUpperCase()}`
                        : `Virtual Account ${selectedBank.toUpperCase()}`}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Pesanan</span>
                    <span className="font-semibold text-gray-900">
                      {orderData.portion}x {orderData.menuItem.name}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Pemesan</span>
                    <span className="font-semibold text-gray-900">
                      {orderData.customerName || 'Pelanggan UNPAM'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Pengambilan</span>
                    <span className="font-semibold text-gray-900">
                      Ambil di Gerobak Depan UNPAM
                    </span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-gray-200 text-sm font-black text-gray-900">
                    <span>Total Pembayaran (+PPN)</span>
                    <span className="text-[#781519]">Rp {orderData.grandTotal.toLocaleString('id-ID')}</span>
                  </div>
                </div>

                <div className="text-[10px] text-gray-500 text-center pt-1 border-t border-gray-100 flex items-center justify-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  Struk ini valid sebagai bukti pembayaran resmi Al-Fariz UNPAM.
                </div>
              </div>

              {/* Action Buttons for Paid State */}
              <div className="space-y-2 pt-1">
                <a
                  href={generateWhatsAppPaidUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={onClose}
                  className="w-full inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20ba5a] text-white font-black text-sm py-3.5 rounded-2xl shadow-lg transition"
                >
                  <MessageCircle className="w-4 h-4 fill-current" />
                  <span>Kirim Pesanan ke WA (+ Bukti Bayar Lunas)</span>
                </a>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      copyToClipboard(
                        `BUKTI BAYAR LUNAS AL-FARIZ UNPAM\nID: ${txId}\nTotal: Rp ${orderData.grandTotal.toLocaleString('id-ID')}\nWaktu: ${paymentTime}\nStatus: VERIFIKASI LUNAS`,
                        'receipt'
                      );
                    }}
                    className="inline-flex items-center justify-center gap-1.5 py-2.5 px-3 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold text-xs rounded-xl transition"
                  >
                    {copiedField === 'receipt' ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Tersalin!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Salin Teks Struk</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setPaymentCompleted(false);
                    }}
                    className="inline-flex items-center justify-center py-2.5 px-3 bg-white hover:bg-gray-50 text-gray-700 font-bold text-xs rounded-xl border border-gray-300 transition"
                  >
                    <span>Ulangi Simulasi</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* CASE 2: PENDING / SIMULASI SELEKSI METODE */
            <div className="space-y-4">
              {/* Method Switcher Tabs */}
              <div className="grid grid-cols-3 gap-1.5 bg-gray-100 p-1 rounded-2xl text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setActiveTab('qris')}
                  className={`py-2 px-3 rounded-xl transition flex items-center justify-center gap-1.5 ${
                    activeTab === 'qris'
                      ? 'bg-white text-[#781519] shadow-sm font-black'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <QrCode className="w-3.5 h-3.5 text-rose-600" />
                  <span>QRIS</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('ewallet')}
                  className={`py-2 px-3 rounded-xl transition flex items-center justify-center gap-1.5 ${
                    activeTab === 'ewallet'
                      ? 'bg-white text-[#781519] shadow-sm font-black'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Wallet className="w-3.5 h-3.5 text-emerald-600" />
                  <span>E-Wallet</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('va')}
                  className={`py-2 px-3 rounded-xl transition flex items-center justify-center gap-1.5 ${
                    activeTab === 'va'
                      ? 'bg-white text-[#781519] shadow-sm font-black'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Building2 className="w-3.5 h-3.5 text-blue-600" />
                  <span>Transfer VA</span>
                </button>
              </div>

              {/* Total Tagihan Banner */}
              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200/80">
                <div>
                  <span className="text-[10px] uppercase font-bold text-amber-900 block">Total Tagihan Pesanan</span>
                  <span className="text-xl font-black text-[#781519] font-serif">
                    Rp {orderData.grandTotal.toLocaleString('id-ID')}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-gray-500 block">Batas Waktu Bayar</span>
                  <span className="text-xs font-mono font-black text-rose-700 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> {timerStr}
                  </span>
                </div>
              </div>

              {/* TAB 1: QRIS */}
              {activeTab === 'qris' && (
                <div className="space-y-4">
                  {/* Authentic QRIS Card Display */}
                  <div className="bg-white border-2 border-gray-300 rounded-3xl p-5 shadow-sm text-center relative overflow-hidden max-w-sm mx-auto">
                    {/* Header QRIS Resmi Look */}
                    <div className="flex items-center justify-between pb-3 border-b border-gray-200">
                      <div className="flex items-center gap-1.5">
                        <span className="bg-[#ED1C24] text-white font-black text-[11px] px-2 py-0.5 rounded tracking-tighter">
                          QRIS
                        </span>
                        <span className="text-[10px] text-gray-500 font-semibold">Standar Pembayaran Nasional</span>
                      </div>
                      <span className="text-[10px] font-mono font-bold text-gray-400">ASPI / BI</span>
                    </div>

                    <div className="pt-3 pb-1">
                      <h4 className="font-bold text-xs text-gray-900 uppercase tracking-wide">
                        AYAM GEPREK AL-FARIZ UNPAM
                      </h4>
                      <p className="text-[10px] font-mono text-gray-400">NMID: ID1020249816530</p>
                    </div>

                    {/* QR Code Graphic with Animated Scan Beam */}
                    <div className="relative my-3 p-3 bg-white border border-gray-200 rounded-2xl inline-block shadow-inner">
                      <svg
                        className="w-48 h-48 sm:w-52 sm:h-52 mx-auto"
                        viewBox="0 0 200 200"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        {/* Background */}
                        <rect width="200" height="200" fill="#ffffff" />
                        
                        {/* Top-Left Corner Position Marker */}
                        <rect x="15" y="15" width="45" height="45" fill="#1F1F1F" rx="6" />
                        <rect x="23" y="23" width="29" height="29" fill="#ffffff" rx="3" />
                        <rect x="29" y="29" width="17" height="17" fill="#781519" rx="2" />

                        {/* Top-Right Corner Position Marker */}
                        <rect x="140" y="15" width="45" height="45" fill="#1F1F1F" rx="6" />
                        <rect x="148" y="23" width="29" height="29" fill="#ffffff" rx="3" />
                        <rect x="154" y="29" width="17" height="17" fill="#781519" rx="2" />

                        {/* Bottom-Left Corner Position Marker */}
                        <rect x="15" y="140" width="45" height="45" fill="#1F1F1F" rx="6" />
                        <rect x="23" y="148" width="29" height="29" fill="#ffffff" rx="3" />
                        <rect x="29" y="154" width="17" height="17" fill="#781519" rx="2" />

                        {/* Dense Matrix Simulated QR Dots */}
                        {/* Row 1-4 */}
                        <rect x="68" y="20" width="8" height="8" fill="#1F1F1F" />
                        <rect x="80" y="20" width="16" height="8" fill="#1F1F1F" />
                        <rect x="104" y="20" width="8" height="8" fill="#1F1F1F" />
                        <rect x="120" y="20" width="8" height="8" fill="#1F1F1F" />
                        <rect x="72" y="32" width="16" height="8" fill="#1F1F1F" />
                        <rect x="96" y="32" width="8" height="8" fill="#1F1F1F" />
                        <rect x="112" y="32" width="16" height="8" fill="#1F1F1F" />
                        <rect x="68" y="44" width="8" height="8" fill="#1F1F1F" />
                        <rect x="88" y="44" width="8" height="8" fill="#1F1F1F" />
                        <rect x="104" y="44" width="16" height="8" fill="#1F1F1F" />

                        {/* Center Bands */}
                        <rect x="20" y="68" width="16" height="8" fill="#1F1F1F" />
                        <rect x="44" y="68" width="8" height="8" fill="#1F1F1F" />
                        <rect x="60" y="68" width="16" height="8" fill="#1F1F1F" />
                        <rect x="84" y="68" width="8" height="8" fill="#1F1F1F" />
                        <rect x="100" y="68" width="8" height="8" fill="#1F1F1F" />
                        <rect x="116" y="68" width="16" height="8" fill="#1F1F1F" />
                        <rect x="140" y="68" width="8" height="8" fill="#1F1F1F" />
                        <rect x="156" y="68" width="16" height="8" fill="#1F1F1F" />

                        <rect x="20" y="80" width="8" height="8" fill="#1F1F1F" />
                        <rect x="36" y="80" width="16" height="8" fill="#1F1F1F" />
                        <rect x="60" y="80" width="8" height="8" fill="#1F1F1F" />
                        <rect x="76" y="80" width="16" height="8" fill="#1F1F1F" />
                        <rect x="108" y="80" width="16" height="8" fill="#1F1F1F" />
                        <rect x="132" y="80" width="8" height="8" fill="#1F1F1F" />
                        <rect x="148" y="80" width="16" height="8" fill="#1F1F1F" />
                        <rect x="172" y="80" width="8" height="8" fill="#1F1F1F" />

                        <rect x="20" y="96" width="16" height="8" fill="#1F1F1F" />
                        <rect x="44" y="96" width="8" height="8" fill="#1F1F1F" />
                        <rect x="68" y="96" width="8" height="8" fill="#1F1F1F" />
                        <rect x="124" y="96" width="8" height="8" fill="#1F1F1F" />
                        <rect x="140" y="96" width="16" height="8" fill="#1F1F1F" />
                        <rect x="164" y="96" width="8" height="8" fill="#1F1F1F" />

                        {/* Center Logo Placeholder */}
                        <rect x="80" y="80" width="40" height="40" fill="#ffffff" rx="6" />
                        <rect x="82" y="82" width="36" height="36" fill="#781519" rx="5" />
                        <text
                          x="100"
                          y="104"
                          fontFamily="sans-serif"
                          fontSize="12"
                          fontWeight="bold"
                          fill="#F5C518"
                          textAnchor="middle"
                        >
                          FARIZ
                        </text>

                        {/* Lower patterns */}
                        <rect x="68" y="112" width="16" height="8" fill="#1F1F1F" />
                        <rect x="92" y="112" width="8" height="8" fill="#1F1F1F" />
                        <rect x="108" y="112" width="16" height="8" fill="#1F1F1F" />
                        <rect x="132" y="112" width="8" height="8" fill="#1F1F1F" />
                        <rect x="148" y="112" width="16" height="8" fill="#1F1F1F" />
                        <rect x="172" y="112" width="8" height="8" fill="#1F1F1F" />

                        <rect x="68" y="128" width="8" height="8" fill="#1F1F1F" />
                        <rect x="84" y="128" width="16" height="8" fill="#1F1F1F" />
                        <rect x="108" y="128" width="8" height="8" fill="#1F1F1F" />
                        <rect x="124" y="128" width="16" height="8" fill="#1F1F1F" />
                        <rect x="148" y="128" width="8" height="8" fill="#1F1F1F" />

                        <rect x="68" y="144" width="16" height="8" fill="#1F1F1F" />
                        <rect x="92" y="144" width="8" height="8" fill="#1F1F1F" />
                        <rect x="108" y="144" width="16" height="8" fill="#1F1F1F" />
                        <rect x="132" y="144" width="16" height="8" fill="#1F1F1F" />
                        <rect x="156" y="144" width="16" height="8" fill="#1F1F1F" />

                        <rect x="68" y="160" width="8" height="8" fill="#1F1F1F" />
                        <rect x="84" y="160" width="16" height="8" fill="#1F1F1F" />
                        <rect x="108" y="160" width="8" height="8" fill="#1F1F1F" />
                        <rect x="124" y="160" width="8" height="8" fill="#1F1F1F" />
                        <rect x="140" y="160" width="16" height="8" fill="#1F1F1F" />
                        <rect x="164" y="160" width="16" height="8" fill="#1F1F1F" />

                        <rect x="76" y="172" width="16" height="8" fill="#1F1F1F" />
                        <rect x="100" y="172" width="16" height="8" fill="#1F1F1F" />
                        <rect x="124" y="172" width="16" height="8" fill="#1F1F1F" />
                        <rect x="148" y="172" width="8" height="8" fill="#1F1F1F" />
                        <rect x="164" y="172" width="16" height="8" fill="#1F1F1F" />
                      </svg>

                      {/* Scanning Line Animation */}
                      <div className="absolute inset-x-3 top-3 h-1 bg-gradient-to-r from-transparent via-[#ED1C24] to-transparent animate-pulse opacity-75"></div>
                    </div>

                    <div className="flex flex-wrap items-center justify-center gap-1.5 pt-1 text-[10px] text-gray-500 font-medium">
                      <span>Dapat di-scan dengan:</span>
                      <span className="font-bold text-gray-800">BCA, Mandiri, BRI, BNI, GoPay, OVO, DANA, ShopeePay</span>
                    </div>
                  </div>

                  {/* Simulation Trigger Button */}
                  <button
                    type="button"
                    disabled={isProcessing}
                    onClick={() => handleSimulateSuccess('QRIS Standar')}
                    className="w-full inline-flex items-center justify-center gap-2 bg-[#781519] hover:bg-[#5e0d10] text-[#F5C518] font-black text-sm py-3.5 rounded-2xl shadow-md transition transform hover:-translate-y-0.5 disabled:opacity-50"
                  >
                    {isProcessing ? (
                      <>
                        <div className="w-4 h-4 border-2 border-[#F5C518] border-t-transparent rounded-full animate-spin"></div>
                        <span>Memproses Verifikasi QRIS...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        <span>Simulasikan Scan & Pembayaran Sukses</span>
                      </>
                    )}
                  </button>

                  <div className="bg-gray-50 p-3 rounded-xl border border-gray-200 text-[11px] text-gray-600 space-y-1">
                    <p className="font-bold text-gray-800">Cara Bayar QRIS:</p>
                    <ol className="list-decimal pl-4 space-y-0.5">
                      <li>Buka aplikasi m-Banking atau E-Wallet pilihanmu.</li>
                      <li>Pilih menu <strong>Scan / Bayar QR</strong>.</li>
                      <li>Arahkan kamera ke QR code di atas, pastikan nominal <strong>Rp {orderData.grandTotal.toLocaleString('id-ID')}</strong> cocok.</li>
                      <li>Masukkan PIN & tekan tombol simulasi selesai.</li>
                    </ol>
                  </div>
                </div>
              )}

              {/* TAB 2: E-WALLET */}
              {activeTab === 'ewallet' && (
                <div className="space-y-4">
                  {/* E-Wallet Selection Pill Buttons */}
                  <div className="grid grid-cols-4 gap-2">
                    {[
                      { id: 'gopay', name: 'GoPay', color: 'bg-emerald-600', text: 'text-emerald-700' },
                      { id: 'dana', name: 'DANA', color: 'bg-blue-600', text: 'text-blue-700' },
                      { id: 'ovo', name: 'OVO', color: 'bg-purple-600', text: 'text-purple-700' },
                      { id: 'shopeepay', name: 'ShopeePay', color: 'bg-orange-600', text: 'text-orange-700' }
                    ].map((wallet) => (
                      <button
                        key={wallet.id}
                        type="button"
                        onClick={() => setSelectedEwallet(wallet.id as any)}
                        className={`p-2 rounded-2xl border-2 text-center transition flex flex-col items-center justify-center gap-1 ${
                          selectedEwallet === wallet.id
                            ? 'border-[#781519] bg-[#781519]/5 font-black'
                            : 'border-gray-200 bg-white hover:border-gray-300'
                        }`}
                      >
                        <span className={`w-3 h-3 rounded-full ${wallet.color}`}></span>
                        <span className="text-[11px] text-gray-900">{wallet.name}</span>
                      </button>
                    ))}
                  </div>

                  {/* Account Detail Box */}
                  <div className="bg-white border border-gray-200 rounded-2xl p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500 font-medium">Nomor Akun Merchant E-Wallet</span>
                      <span className="text-[10px] font-bold uppercase bg-gray-100 px-2 py-0.5 rounded text-gray-700">
                        {selectedEwallet.toUpperCase()}
                      </span>
                    </div>

                    <div className="flex items-center justify-between bg-gray-50 p-3 rounded-xl border border-gray-200">
                      <div>
                        <span className="font-mono text-base font-black text-gray-900 tracking-wider">
                          0897-3816-530
                        </span>
                        <span className="text-[11px] text-gray-500 block">
                          a.n. Ayam Geprek Al-Fariz Pamulang
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => copyToClipboard('08973816530', 'ewallet')}
                        className="px-3 py-1.5 bg-white hover:bg-gray-100 text-[#781519] border border-gray-300 rounded-lg text-xs font-bold transition flex items-center gap-1 shadow-sm"
                      >
                        {copiedField === 'ewallet' ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Tersalin</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Salin</span>
                          </>
                        )}
                      </button>
                    </div>

                    <div className="flex items-center justify-between text-xs text-gray-600 pt-1">
                      <span>Nominal Transfer Tepat:</span>
                      <div className="flex items-center gap-1.5 font-bold text-gray-900">
                        <span>Rp {orderData.grandTotal.toLocaleString('id-ID')}</span>
                        <button
                          type="button"
                          onClick={() => copyToClipboard(String(orderData.grandTotal), 'nominal')}
                          className="text-[11px] text-gray-500 hover:text-gray-900 underline"
                        >
                          {copiedField === 'nominal' ? 'Tersalin' : 'Salin'}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Trigger simulation */}
                  <button
                    type="button"
                    disabled={isProcessing}
                    onClick={() => handleSimulateSuccess(selectedEwallet.toUpperCase())}
                    className="w-full inline-flex items-center justify-center gap-2 bg-[#781519] hover:bg-[#5e0d10] text-[#F5C518] font-black text-sm py-3.5 rounded-2xl shadow-md transition transform hover:-translate-y-0.5 disabled:opacity-50"
                  >
                    {isProcessing ? (
                      <>
                        <div className="w-4 h-4 border-2 border-[#F5C518] border-t-transparent rounded-full animate-spin"></div>
                        <span>Memvalidasi Transfer E-Wallet...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        <span>Simulasikan Pembayaran via {selectedEwallet.toUpperCase()}</span>
                      </>
                    )}
                  </button>
                </div>
              )}

              {/* TAB 3: VIRTUAL ACCOUNT / BANK TRANSFER */}
              {activeTab === 'va' && (
                <div className="space-y-4">
                  {/* Bank Choice */}
                  <div className="grid grid-cols-4 gap-2">
                    {[
                      { id: 'bca', name: 'BCA', code: '8077708973816530' },
                      { id: 'mandiri', name: 'Mandiri', code: '8870808973816530' },
                      { id: 'bri', name: 'BRI', code: '123408973816530' },
                      { id: 'seabank', name: 'SeaBank', code: '901238973816530' }
                    ].map((bank) => (
                      <button
                        key={bank.id}
                        type="button"
                        onClick={() => setSelectedBank(bank.id as any)}
                        className={`p-2 rounded-2xl border-2 text-center transition flex flex-col items-center justify-center gap-0.5 ${
                          selectedBank === bank.id
                            ? 'border-[#781519] bg-[#781519]/5 font-black text-[#781519]'
                            : 'border-gray-200 bg-white hover:border-gray-300 text-gray-700'
                        }`}
                      >
                        <span className="text-xs font-bold">{bank.name}</span>
                        <span className="text-[9px] text-gray-400">VA Otomatis</span>
                      </button>
                    ))}
                  </div>

                  {/* Virtual Account Box */}
                  <div className="bg-white border border-gray-200 rounded-2xl p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500 font-medium">Nomor Virtual Account {selectedBank.toUpperCase()}</span>
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        Otomatis Terverifikasi
                      </span>
                    </div>

                    <div className="flex items-center justify-between bg-gray-50 p-3 rounded-xl border border-gray-200">
                      <div>
                        <span className="font-mono text-base font-black text-gray-900 tracking-wider">
                          {selectedBank === 'bca'
                            ? '80777 08973816530'
                            : selectedBank === 'mandiri'
                            ? '88708 08973816530'
                            : selectedBank === 'bri'
                            ? '12340 8973816530'
                            : '90123 8973816530'}
                        </span>
                        <span className="text-[11px] text-gray-500 block">
                          a.n. Ayam Geprek Al-Fariz VA
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          copyToClipboard(
                            selectedBank === 'bca'
                              ? '8077708973816530'
                              : selectedBank === 'mandiri'
                              ? '8870808973816530'
                              : selectedBank === 'bri'
                              ? '123408973816530'
                              : '901238973816530',
                            'va'
                          )
                        }
                        className="px-3 py-1.5 bg-white hover:bg-gray-100 text-[#781519] border border-gray-300 rounded-lg text-xs font-bold transition flex items-center gap-1 shadow-sm"
                      >
                        {copiedField === 'va' ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Tersalin</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Salin</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Trigger simulation */}
                  <button
                    type="button"
                    disabled={isProcessing}
                    onClick={() => handleSimulateSuccess(`VA ${selectedBank.toUpperCase()}`)}
                    className="w-full inline-flex items-center justify-center gap-2 bg-[#781519] hover:bg-[#5e0d10] text-[#F5C518] font-black text-sm py-3.5 rounded-2xl shadow-md transition transform hover:-translate-y-0.5 disabled:opacity-50"
                  >
                    {isProcessing ? (
                      <>
                        <div className="w-4 h-4 border-2 border-[#F5C518] border-t-transparent rounded-full animate-spin"></div>
                        <span>Memverifikasi Mutasi Virtual Account...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        <span>Simulasikan Transfer VA Berhasil</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500 flex-shrink-0">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-[#2D864E]" />
            <span>Simulasi aman • Bebas biaya admin transaksi</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-600 hover:text-gray-900 font-bold px-3 py-1 rounded-lg hover:bg-gray-200 transition"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
