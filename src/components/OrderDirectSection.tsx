import React, { useState, useEffect, useRef } from 'react';
import { MenuItem } from '../types.ts';
import { useLiveMenu, submitOrderToCrm } from '../lib/crmApi.ts';
import {
  MessageCircle,
  Flame,
  Check,
  RotateCcw,
  Trash2,
  History,
  QrCode,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Bookmark,
  Receipt,
  Utensils,
  Plus
} from 'lucide-react';
import { DigitalPaymentModal, PaymentSimulationData } from './DigitalPaymentModal.tsx';
import { SavedOrderRecord } from './SimulasiPemesanan.tsx';

interface OrderDirectSectionProps {
  selectedMenuItem: MenuItem | null;
  onMenuItemChange: (item: MenuItem) => void;
}

const STORAGE_KEY = 'alfariz_custom_geprek_orders_v1';

export const OrderDirectSection: React.FC<OrderDirectSectionProps> = ({
  selectedMenuItem,
  onMenuItemChange
}) => {
  const liveMenu = useLiveMenu();
  const { extraSambel: EXTRA_SAMBEL_PRICE, tambahNasi: TAMBAH_NASI_PRICE } = liveMenu.addonPrices;
  const primaryMenus = liveMenu.items.filter((item) => item.category === 'paket' || item.category === 'alacarte');
  const crmSentRef = useRef<{ key: string; code: string; trackUrl: string } | null>(null);

  // Form State
  const [currentMenu, setCurrentMenu] = useState<MenuItem>(selectedMenuItem || primaryMenus[0]);
  const [spiceLevel, setSpiceLevel] = useState<number>(3);
  const [sambalServing, setSambalServing] = useState<'dicampur' | 'dipisah' | 'tanpa_sambal'>('dicampur');
  const [portion, setPortion] = useState<number>(1);
  const [customerName, setCustomerName] = useState<string>('');
  const [notes, setNotes] = useState<string>('');

  // Payment Method State
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'qris'>('cash');
  const [paidStatus, setPaidStatus] = useState<{ isPaid: boolean; method: string; txId: string } | null>(null);

  // Digital Payment Modal State
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState<boolean>(false);
  const [activeModalOrder, setActiveModalOrder] = useState<PaymentSimulationData | null>(null);
  const [modalIsPaid, setModalIsPaid] = useState<boolean>(false);
  const [modalTxId, setModalTxId] = useState<string | undefined>(undefined);

  // Addons State
  const [addons, setAddons] = useState({
    extraSambel: false,
    tambahNasi: false
  });

  // Tracker & History State
  const [savedOrders, setSavedOrders] = useState<SavedOrderRecord[]>([]);
  const [activeTab, setActiveTab] = useState<'order' | 'history'>('order');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync menu when parent changes
  useEffect(() => {
    if (selectedMenuItem) {
      setCurrentMenu(selectedMenuItem);
      setPaidStatus(null);
    }
  }, [selectedMenuItem]);

  // Load from local storage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setSavedOrders(parsed);
        }
      }
    } catch (err) {
      console.warn('Failed to load order history from localStorage:', err);
    }
  }, []);

  const persistOrders = (orders: SavedOrderRecord[]) => {
    setSavedOrders(orders);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
    } catch (err) {
      console.warn('Failed to save to localStorage:', err);
    }
  };

  // Pricing calculations
  const baseMenuTotal = currentMenu.price * portion;
  const extraSambelTotal = addons.extraSambel ? EXTRA_SAMBEL_PRICE * portion : 0;
  const tambahNasiTotal = addons.tambahNasi ? TAMBAH_NASI_PRICE * portion : 0;
  const subtotal = baseMenuTotal + extraSambelTotal + tambahNasiTotal;
  const grandTotal = subtotal; // Clean pricing for customers

  const spiceLabels: { [key: number]: { label: string; tag: string; desc: string } } = {
    1: { label: 'Level 1: Pedas Manja', tag: '2 Cabai', desc: 'Gurih hangat ramah anak & lambung' },
    2: { label: 'Level 2: Standar Gurih', tag: '4 Cabai', desc: 'Pedas nikmat santai' },
    3: { label: 'Level 3: Mulai Keringatan', tag: '7 Cabai 🔥', desc: 'Paling favorit mahasiswa UNPAM!' },
    4: { label: 'Level 4: Nendang Pol', tag: '10 Cabai 🔥🔥', desc: 'Sensasi pedas membara bikin melek' },
    5: { label: 'Level 5: Uji Nyali Rawit', tag: '15 Cabai 🌶️💥', desc: 'Berani coba? Sensasi pedas nendang maksimal!' }
  };

  const createWhatsAppText = () => {
    let msg = `Halo Mas Al-Fariz, saya mau pesan langsung via website:\n\n`;
    msg += `📋 *PESANAN:* ${portion}x ${currentMenu.name}\n`;
    msg += `💰 *Harga Satuan:* Rp ${currentMenu.price.toLocaleString('id-ID')}\n`;

    if (currentMenu.spiceLevelSupported) {
      const sDesc = sambalServing === 'dicampur' ? 'Dicampur di atas ayam' : sambalServing === 'dipisah' ? 'Dipisah di cup' : 'Tanpa Sambal';
      msg += `🌶️ *Level Pedas:* Level ${spiceLevel} (${spiceLabels[spiceLevel]?.tag || ''})\n`;
      msg += `🥣 *Penyajian Sambal:* ${sDesc}\n`;
    }

    if (addons.extraSambel) msg += `➕ Extra Sambel Ijo (+Rp ${(EXTRA_SAMBEL_PRICE * portion).toLocaleString('id-ID')})\n`;
    if (addons.tambahNasi) msg += `➕ Tambah Nasi Pulen (+Rp ${(TAMBAH_NASI_PRICE * portion).toLocaleString('id-ID')})\n`;

    msg += `\n💵 *TOTAL HARGA:* Rp ${grandTotal.toLocaleString('id-ID')}\n`;
    msg += `📍 *Pengambilan:* Ambil di Gerobak Depan UNPAM Pamulang\n`;
    msg += `💳 *Metode Bayar:* ${paymentMethod === 'cash' ? 'Bayar Tunai / QRIS saat Ambil' : 'QRIS Digital'}\n`;

    if (customerName.trim()) msg += `👤 *Nama Pemesan:* ${customerName.trim()}\n`;
    if (notes.trim()) msg += `📝 *Catatan:* ${notes.trim()}\n`;

    msg += `\nMohon dikonfirmasi ya Mas, terima kasih! 🙏`;
    return msg;
  };

  const currentWhatsAppUrl = () => {
    return `https://wa.me/628973816530?text=${encodeURIComponent(createWhatsAppText())}`;
  };

  const handleSaveOrderRecord = async (isSilent = false) => {
    const newRecord: SavedOrderRecord = {
      id: `ORD-${Date.now()}`,
      timestamp: Date.now(),
      dateStr: new Date().toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit'
      }),
      menuItem: currentMenu,
      portion,
      spiceLevel,
      sambalServing,
      addons: { ...addons },
      pickupMethod: 'ambil_gerobak',
      customerName: customerName || 'Pelanggan UNPAM',
      notes,
      subtotal,
      ppn: 0,
      grandTotal,
      paymentMethod: paymentMethod === 'cash' ? 'Tunai di Gerobak' : 'QRIS Digital',
      paymentStatus: paidStatus?.isPaid ? 'lunas_simulasi' : 'bayar_di_tempat',
      txId: paidStatus?.txId
    };

    const updated = [newRecord, ...savedOrders].slice(0, 20);
    persistOrders(updated);

    if (!isSilent) {
      setToastMessage('✅ Pesanan berhasil disimpan ke riwayat perangkat!');
      setTimeout(() => setToastMessage(null), 3000);
    }

    // Submit silently to owner CRM
    try {
      const sambalText = sambalServing === 'dicampur' ? 'Sambal dicampur' : sambalServing === 'dipisah' ? 'Sambal dipisah' : 'Tanpa sambal';
      await submitOrderToCrm({
        customerName: newRecord.customerName,
        notes: newRecord.notes,
        paymentMethod: newRecord.paymentMethod || '',
        paid: newRecord.paymentStatus === 'lunas_simulasi',
        menuId: newRecord.menuItem.id,
        portion: newRecord.portion,
        options: newRecord.menuItem.spiceLevelSupported ? `Level ${newRecord.spiceLevel} · ${sambalText}` : '',
        extraSambel: !!newRecord.addons.extraSambel,
        tambahNasi: !!newRecord.addons.tambahNasi
      });
    } catch {
      // ignore CRM sync errors
    }
  };

  const handleOpenCurrentPaymentModal = () => {
    setActiveModalOrder({
      menuItem: currentMenu,
      portion,
      spiceLevel,
      sambalServing,
      addons,
      pickupMethod: 'ambil_gerobak',
      customerName: customerName || 'Pelanggan UNPAM',
      notes,
      subtotal,
      ppn: 0,
      grandTotal
    });
    setModalIsPaid(!!paidStatus?.isPaid);
    setModalTxId(paidStatus?.txId);
    setIsPaymentModalOpen(true);
  };

  const handlePaymentSuccess = (method: string, tx: string) => {
    setPaidStatus({ isPaid: true, method, txId: tx });
    setPaymentMethod('qris');
    setToastMessage(`💳 Berhasil! Simulasi bayar via ${method} terverifikasi lunas.`);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleLoadOrder = (order: SavedOrderRecord) => {
    setCurrentMenu(order.menuItem);
    onMenuItemChange(order.menuItem);
    setPortion(order.portion);
    setSpiceLevel(order.spiceLevel);
    setSambalServing(order.sambalServing);
    setAddons({
      extraSambel: !!order.addons.extraSambel,
      tambahNasi: !!order.addons.tambahNasi
    });
    setCustomerName(order.customerName);
    setNotes(order.notes);
    setActiveTab('order');
    setToastMessage(`🔄 Menu "${order.menuItem.name}" dimuat kembali.`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleDeleteOrder = (orderId: string) => {
    const filtered = savedOrders.filter((item) => item.id !== orderId);
    persistOrders(filtered);
    setToastMessage('🗑️ Pesanan dihapus dari riwayat.');
    setTimeout(() => setToastMessage(null), 2500);
  };

  return (
    <section className="py-14 sm:py-20 bg-[#FBF8F3] border-t border-amber-200/60 relative scroll-mt-20" id="order">
      {/* Invisible anchor for backward compatibility with #menu and #simulasi-pemesanan */}
      <div id="menu" className="absolute -top-20" />
      <div id="simulasi-pemesanan" className="absolute -top-20" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Headline with Curiosity Hook */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12 space-y-2.5">
          <div className="inline-flex items-center gap-1.5 bg-[#781519]/10 text-[#781519] px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider">
            <Flame className="w-3.5 h-3.5 text-red-600 inline fill-current" />
            <span>Pesan Langsung via WhatsApp</span>
          </div>

          <h2 className="text-2xl xs:text-3xl sm:text-4xl font-black text-gray-900 font-serif leading-tight">
            Menu Juara Sambel Ijo Al-Fariz
          </h2>

          <p className="text-xs xs:text-sm sm:text-base text-gray-600 leading-relaxed">
            Hanya ada <strong className="text-[#781519]">2 menu andalan</strong> yang paling banyak dipesan mahasiswa & warga Pamulang. Pilih menu di bawah, atur level pedas, lalu klik pesan ke WhatsApp!
          </p>
        </div>

        {/* Tab Toggle: Order Form vs Riwayat Pesanan */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <button
            type="button"
            onClick={() => setActiveTab('order')}
            className={`px-4 sm:px-6 py-2.5 rounded-full text-xs sm:text-sm font-black transition-all ${
              activeTab === 'order'
                ? 'bg-[#781519] text-[#F5C518] shadow-md scale-102'
                : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            <span>Pesan Baru Sekarang</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('history')}
            className={`inline-flex items-center gap-1.5 px-4 sm:px-6 py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all ${
              activeTab === 'history'
                ? 'bg-[#781519] text-[#F5C518] shadow-md scale-102'
                : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>Riwayat Pesanan ({savedOrders.length})</span>
          </button>
        </div>

        {/* Toast Notification */}
        {toastMessage && (
          <div className="max-w-md mx-auto mb-6 p-3 bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-bold rounded-2xl text-center shadow-sm flex items-center justify-center gap-2">
            <span>{toastMessage}</span>
          </div>
        )}

        {/* TAB 1: FORM PEMESANAN LANGSUNG */}
        {activeTab === 'order' ? (
          <div className="space-y-8 max-w-5xl mx-auto">
            {/* STEP 1: PILIHAN 2 MENU JUARA (CARDS) */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-black text-gray-800 uppercase tracking-wider flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#781519] text-[#F5C518] flex items-center justify-center text-xs">1</span>
                  Pilih Menu Favoritmu:
                </span>
                <span className="text-xs text-[#781519] font-bold">Ketuk untuk memilih</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                {primaryMenus.map((item) => {
                  const isSelected = currentMenu.id === item.id;
                  return (
                    <div
                      key={item.id}
                      onClick={() => {
                        setCurrentMenu(item);
                        onMenuItemChange(item);
                        setPaidStatus(null);
                      }}
                      className={`rounded-3xl p-4 sm:p-5 border-3 transition-all duration-300 cursor-pointer flex flex-col justify-between group relative ${
                        isSelected
                          ? 'border-[#781519] bg-white shadow-xl ring-4 ring-[#F5C518]/30 scale-[1.01]'
                          : 'border-amber-200/80 bg-white hover:border-[#F5C518] hover:shadow-md'
                      }`}
                    >
                      <div>
                        {/* Image Preview */}
                        <div className="relative rounded-2xl overflow-hidden aspect-video mb-3.5 bg-gray-100">
                          <img
                            src={item.image}
                            alt={`${item.name} - Ayam Penyet Sambel Ijo Al-Fariz Pamulang`}
                            width={400}
                            height={225}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            loading="lazy"
                          />
                          {item.badge && (
                            <span className="absolute top-2.5 left-2.5 text-[10px] sm:text-xs font-black px-2.5 py-0.5 rounded-full shadow-md bg-[#F5C518] text-[#5e0d10]">
                              {item.badge}
                            </span>
                          )}
                          {isSelected && (
                            <div className="absolute top-2.5 right-2.5 bg-[#781519] text-[#F5C518] rounded-full p-1 shadow-md">
                              <Check className="w-4 h-4 stroke-[3]" />
                            </div>
                          )}
                        </div>

                        <div className="flex items-center justify-between gap-2 mb-1.5">
                          <h3 className="font-black text-lg sm:text-xl text-gray-900 group-hover:text-[#781519] transition-colors">
                            {item.name}
                          </h3>
                          <span className="text-base sm:text-xl font-black text-[#781519] whitespace-nowrap">
                            Rp {item.price.toLocaleString('id-ID')}
                          </span>
                        </div>

                        <p className="text-gray-600 text-xs sm:text-sm leading-relaxed mb-3">
                          {item.description}
                        </p>
                      </div>

                      {/* Select Indicator Button */}
                      <button
                        type="button"
                        className={`w-full py-2.5 rounded-xl font-black text-xs transition-all flex items-center justify-center gap-2 ${
                          isSelected
                            ? 'bg-[#781519] text-[#F5C518] shadow'
                            : 'bg-amber-50 text-[#781519] hover:bg-[#F5C518] hover:text-[#5e0d10]'
                        }`}
                      >
                        {isSelected ? (
                          <>
                            <Check className="w-4 h-4" />
                            <span>Menu Ini Terpilih</span>
                          </>
                        ) : (
                          <>
                            <span>Pilih {item.name}</span>
                          </>
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* STEP 2 & 3: FORM KUSTOMISASI RASA & PESAN WA */}
            <div className="bg-white rounded-3xl p-5 sm:p-8 border-2 border-amber-200 shadow-xl space-y-6">
              <div className="border-b border-gray-100 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <span className="text-[11px] font-black text-[#781519] uppercase tracking-wider block">
                    Kustomisasi Porsi & Rasa
                  </span>
                  <h3 className="text-xl sm:text-2xl font-black text-gray-900 font-serif">
                    {currentMenu.name} (Rp {currentMenu.price.toLocaleString('id-ID')})
                  </h3>
                </div>
                <div className="text-xs text-gray-500 font-medium bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-100 w-max">
                  🥣 Diuleg Dadakan Saat Pesanan Masuk
                </div>
              </div>

              {/* 1. Level Pedas Cabai Rawit Hijau */}
              {currentMenu.spiceLevelSupported && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-black text-gray-900 uppercase tracking-wider flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-[#781519] text-[#F5C518] flex items-center justify-center text-[10px]">2</span>
                      Pilih Level Pedas Cabai Rawit:
                    </label>
                    <span className="text-xs font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-full border border-red-200">
                      {spiceLabels[spiceLevel]?.tag}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 sm:gap-2.5">
                    {[1, 2, 3, 4, 5].map((lvl) => {
                      const isLvlSelected = spiceLevel === lvl;
                      return (
                        <button
                          key={lvl}
                          type="button"
                          onClick={() => setSpiceLevel(lvl)}
                          className={`p-2.5 sm:p-3 rounded-2xl border-2 text-left transition-all ${
                            isLvlSelected
                              ? 'border-[#781519] bg-[#781519] text-white shadow-md'
                              : 'border-gray-200 bg-white hover:border-[#F5C518] text-gray-800'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-black text-xs sm:text-sm">Lv {lvl}</span>
                            <Flame className={`w-3.5 h-3.5 ${isLvlSelected ? 'text-[#F5C518] fill-[#F5C518]' : 'text-gray-400'}`} />
                          </div>
                          <span className={`text-[10px] block font-bold mt-1 ${isLvlSelected ? 'text-amber-200' : 'text-[#781519]'}`}>
                            {spiceLabels[lvl]?.tag}
                          </span>
                          <span className={`text-[9px] block leading-tight mt-0.5 line-clamp-1 ${isLvlSelected ? 'text-white/80' : 'text-gray-500'}`}>
                            {spiceLabels[lvl]?.desc}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* 2. Cara Penyajian Sambal */}
              {currentMenu.spiceLevelSupported && (
                <div className="space-y-2.5">
                  <label className="text-xs font-black text-gray-900 uppercase tracking-wider flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-[#781519] text-[#F5C518] flex items-center justify-center text-[10px]">3</span>
                    Penyajian Sambal:
                  </label>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    {[
                      { id: 'dicampur', title: 'Dicampur di Atas Ayam', desc: 'Bumbu meresap gurih pedas (Rekomendasi)', badge: 'Favorit' },
                      { id: 'dipisah', title: 'Dipisah di Cup', desc: 'Kulit ayam tetap garing maksimal', badge: 'Praktis' },
                      { id: 'tanpa_sambal', title: 'Tanpa Sambal', desc: 'Hanya ayam krispi gurih original', badge: 'Anak-anak' }
                    ].map((opt) => {
                      const isOpt = sambalServing === opt.id;
                      return (
                        <div
                          key={opt.id}
                          onClick={() => setSambalServing(opt.id as any)}
                          className={`p-3 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                            isOpt
                              ? 'border-[#781519] bg-amber-50/70 shadow-sm'
                              : 'border-gray-200 bg-white hover:border-[#F5C518]'
                          }`}
                        >
                          <div>
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-xs font-black text-gray-900">{opt.title}</span>
                              <span className="text-[9px] bg-[#F5C518] text-[#5e0d10] font-black px-1.5 py-0.5 rounded-full">
                                {opt.badge}
                              </span>
                            </div>
                            <span className="text-[11px] text-gray-600 block">{opt.desc}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* 3. Porsi & Add-ons */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 pt-2">
                {/* Porsi Selector */}
                <div className="sm:col-span-4 p-3.5 rounded-2xl bg-gray-50 border border-gray-200">
                  <label className="text-xs font-black text-gray-800 block mb-2">Jumlah Porsi</label>
                  <div className="flex items-center justify-between bg-white rounded-xl border border-gray-300 p-1">
                    <button
                      type="button"
                      onClick={() => setPortion(Math.max(1, portion - 1))}
                      className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-900 font-black text-base flex items-center justify-center transition"
                    >
                      -
                    </button>
                    <span className="font-black text-base text-gray-900">{portion} Porsi</span>
                    <button
                      type="button"
                      onClick={() => setPortion(portion + 1)}
                      className="w-8 h-8 rounded-lg bg-[#F5C518] hover:bg-[#e0b312] text-[#5e0d10] font-black text-base flex items-center justify-center transition"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Add-ons Checkboxes */}
                <div className="sm:col-span-8 p-3.5 rounded-2xl bg-gray-50 border border-gray-200">
                  <label className="text-xs font-black text-gray-800 block mb-2">Tambahan (Opsional)</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <label className="flex items-center gap-2 p-2 rounded-xl bg-white border border-gray-200 text-xs font-bold text-gray-800 cursor-pointer hover:border-[#F5C518] transition">
                      <input
                        type="checkbox"
                        checked={addons.extraSambel}
                        onChange={(e) => setAddons({ ...addons, extraSambel: e.target.checked })}
                        className="rounded border-gray-300 text-[#781519] focus:ring-[#781519]"
                      />
                      <span>Extra Sambel Ijo (+Rp {EXTRA_SAMBEL_PRICE.toLocaleString('id-ID')})</span>
                    </label>
                    <label className="flex items-center gap-2 p-2 rounded-xl bg-white border border-gray-200 text-xs font-bold text-gray-800 cursor-pointer hover:border-[#F5C518] transition">
                      <input
                        type="checkbox"
                        checked={addons.tambahNasi}
                        onChange={(e) => setAddons({ ...addons, tambahNasi: e.target.checked })}
                        className="rounded border-gray-300 text-[#781519] focus:ring-[#781519]"
                      />
                      <span>Tambah Nasi (+Rp {TAMBAH_NASI_PRICE.toLocaleString('id-ID')})</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* 4. Nama & Catatan Singkat */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">Nama Pemesan (Opsional)</label>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Contoh: Dimas (UNPAM)"
                    className="w-full text-xs sm:text-sm px-3.5 py-2 rounded-xl border border-gray-300 focus:outline-none focus:border-[#781519]"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">Catatan Tambahan (Opsional)</label>
                  <input
                    type="text"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Contoh: Sambel dipisah / minta timun lebih"
                    className="w-full text-xs sm:text-sm px-3.5 py-2 rounded-xl border border-gray-300 focus:outline-none focus:border-[#781519]"
                  />
                </div>
              </div>

              {/* 5. SUMMARY & TOMBOL PESAN LANGSUNG VIA WA */}
              <div className="pt-4 border-t-2 border-dashed border-amber-200">
                <div className="p-4 rounded-2xl bg-[#781519] text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg mb-4">
                  <div>
                    <span className="text-[11px] text-amber-200 font-bold uppercase tracking-wider block">
                      Total Pesanan ({portion} Porsi)
                    </span>
                    <span className="text-2xl sm:text-3xl font-black text-[#F5C518] font-serif">
                      Rp {grandTotal.toLocaleString('id-ID')}
                    </span>
                    <span className="text-[10px] text-white/80 block mt-0.5">
                      📍 Ambil di Gerobak Depan Kampus UNPAM Pamulang
                    </span>
                  </div>

                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
                    {/* Primary Button: Direct to WhatsApp */}
                    <a
                      href={currentWhatsAppUrl()}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => handleSaveOrderRecord(true)}
                      className="inline-flex items-center justify-center gap-2.5 bg-[#F5C518] hover:bg-[#e0b312] text-[#5e0d10] font-black text-sm sm:text-base px-6 py-3.5 rounded-2xl shadow-xl transition-all transform hover:scale-102 active:scale-98 text-center"
                    >
                      <MessageCircle className="w-5 h-5 fill-current" />
                      <span>Kirim Pesanan ke WhatsApp</span>
                    </a>
                  </div>
                </div>

                {/* Sub-actions: Simpan ke Riwayat & Simulasi Bayar QRIS */}
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => handleSaveOrderRecord(false)}
                    className="inline-flex items-center gap-1.5 text-gray-700 hover:text-[#781519] font-bold p-1 transition"
                  >
                    <Bookmark className="w-3.5 h-3.5 text-[#781519]" />
                    <span>Simpan ke Riwayat Perangkat</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleOpenCurrentPaymentModal}
                    className="inline-flex items-center gap-1.5 text-gray-700 hover:text-[#781519] font-bold p-1 transition"
                  >
                    <QrCode className="w-3.5 h-3.5 text-[#781519]" />
                    <span>Mau Bayar Cashless? Buka Scanner QRIS</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* TAB 2: TRACKER RIWAYAT PESANAN */
          <div className="max-w-3xl mx-auto bg-white rounded-3xl p-6 sm:p-8 border border-amber-200 shadow-md">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-6">
              <div>
                <h3 className="font-black text-lg text-gray-900 font-serif">Riwayat Pesanan Anda</h3>
                <p className="text-xs text-gray-500">Tersimpan di browser perangkat ini untuk pemesanan ulang cepat.</p>
              </div>
              {savedOrders.length > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm('Hapus semua riwayat pesanan tersimpan?')) {
                      persistOrders([]);
                      setToastMessage('Riwayat pesanan telah dibersihkan.');
                    }
                  }}
                  className="text-xs font-bold text-red-600 hover:text-red-700 flex items-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Hapus Semua</span>
                </button>
              )}
            </div>

            {savedOrders.length === 0 ? (
              <div className="text-center py-12 text-gray-400 space-y-3">
                <Utensils className="w-10 h-10 mx-auto text-gray-300" />
                <p className="text-sm font-semibold">Belum ada riwayat pesanan yang tersimpan.</p>
                <button
                  type="button"
                  onClick={() => setActiveTab('order')}
                  className="px-4 py-2 bg-[#781519] text-[#F5C518] text-xs font-bold rounded-xl"
                >
                  Mulai Pesan Sekarang
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {savedOrders.map((ord) => (
                  <div
                    key={ord.id}
                    className="p-4 rounded-2xl border border-gray-200 hover:border-amber-300 transition flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gray-50/50"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-black text-sm text-gray-900">
                          {ord.portion}x {ord.menuItem.name}
                        </span>
                        <span className="text-[10px] bg-red-100 text-red-700 font-bold px-2 py-0.5 rounded-full">
                          Level {ord.spiceLevel}
                        </span>
                      </div>
                      <span className="text-xs text-gray-500 block mt-0.5">
                        {ord.dateStr} · Rp {ord.grandTotal.toLocaleString('id-ID')}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleLoadOrder(ord)}
                        className="px-3 py-1.5 bg-[#781519] text-[#F5C518] text-xs font-black rounded-xl hover:bg-[#5e0d10] transition flex items-center gap-1"
                      >
                        <RotateCcw className="w-3 h-3" />
                        <span>Pesan Lagi</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteOrder(ord.id)}
                        className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Digital Payment Modal */}
      {activeModalOrder && (
        <DigitalPaymentModal
          isOpen={isPaymentModalOpen}
          onClose={() => setIsPaymentModalOpen(false)}
          orderData={activeModalOrder}
          isPaid={modalIsPaid}
          existingTxId={modalTxId}
          onPaymentSuccess={handlePaymentSuccess}
        />
      )}
    </section>
  );
};
