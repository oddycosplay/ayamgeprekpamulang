import React, { useState, useEffect, useRef } from 'react';
import { MenuItem } from '../types.ts';
import { useLiveMenu, submitOrderToCrm } from '../lib/crmApi.ts';
import {
  Check,
  MessageCircle,
  Bookmark,
  RotateCcw,
  Trash2,
  History,
  Calculator,
  Copy,
  PlusCircle,
  PartyPopper,
  CheckCircle2,
  X,
  QrCode,
  Wallet,
  Building2,
  Banknote,
  Receipt,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Clock
} from 'lucide-react';
import { DigitalPaymentModal, PaymentSimulationData } from './DigitalPaymentModal.tsx';

export interface SavedOrderRecord {
  id: string;
  timestamp: number;
  dateStr: string;
  menuItem: MenuItem;
  portion: number;
  spiceLevel: number;
  sambalServing: 'dicampur' | 'dipisah' | 'tanpa_sambal';
  addons: {
    extraSambel: boolean;
    tambahNasi: boolean;
    esTehJumbo?: boolean;
    tahuTempe?: boolean;
  };
  pickupMethod: string;
  customerName: string;
  notes: string;
  subtotal: number;
  ppn: number;
  grandTotal: number;
  paymentMethod?: string;
  paymentStatus?: 'lunas_simulasi' | 'bayar_di_tempat';
  txId?: string;
  crmCode?: string;
  trackUrl?: string;
}

interface SimulasiPemesananProps {
  selectedMenuItem: MenuItem | null;
  onMenuItemChange: (item: MenuItem) => void;
}

const STORAGE_KEY = 'alfariz_custom_geprek_orders_v1';

export const SimulasiPemesanan: React.FC<SimulasiPemesananProps> = ({
  selectedMenuItem,
  onMenuItemChange
}) => {
  const liveMenu = useLiveMenu();
  const { extraSambel: EXTRA_SAMBEL_PRICE, tambahNasi: TAMBAH_NASI_PRICE } = liveMenu.addonPrices;
  const primaryMenus = liveMenu.items.filter((item) => item.category === 'paket' || item.category === 'alacarte');
  // Avoid sending the same order to the CRM twice (WhatsApp click + save).
  const crmSentRef = useRef<{ key: string; code: string; trackUrl: string } | null>(null);

  // Form State
  const [currentMenu, setCurrentMenu] = useState<MenuItem>(selectedMenuItem || primaryMenus[0]);
  const [spiceLevel, setSpiceLevel] = useState<number>(2);
  const [sambalServing, setSambalServing] = useState<'dicampur' | 'dipisah' | 'tanpa_sambal'>('dicampur');
  const [portion, setPortion] = useState<number>(1);
  const [pickupMethod, setPickupMethod] = useState<string>('ambil_gerobak');
  const [customerName, setCustomerName] = useState<string>('');
  const [notes, setNotes] = useState<string>('');

  // Payment Method State
  const [paymentMethod, setPaymentMethod] = useState<'qris' | 'ewallet' | 'va' | 'cash'>('qris');
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
  const [activeView, setActiveView] = useState<'calculator' | 'history'>('calculator');
  const [notification, setNotification] = useState<string | null>(null);
  const [celebrationOrder, setCelebrationOrder] = useState<SavedOrderRecord | null>(null);

  // Sync if item selected from external catalog
  useEffect(() => {
    if (selectedMenuItem) {
      setCurrentMenu(selectedMenuItem);
      setActiveView('calculator');
      setPaidStatus(null); // Reset payment simulation on menu change
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

  // Save to local storage helper
  const persistOrders = (orders: SavedOrderRecord[]) => {
    setSavedOrders(orders);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
    } catch (err) {
      console.warn('Failed to save to localStorage:', err);
    }
  };

  // Calculations
  const baseMenuTotal = currentMenu.price * portion;
  const extraSambelTotal = addons.extraSambel ? EXTRA_SAMBEL_PRICE * portion : 0;
  const tambahNasiTotal = addons.tambahNasi ? TAMBAH_NASI_PRICE * portion : 0;

  const subtotal = baseMenuTotal + extraSambelTotal + tambahNasiTotal;
  const ppn = Math.round((subtotal * liveMenu.taxPercent) / 100);
  const grandTotal = subtotal + ppn;

  const getPickupLabel = (_m?: string) => {
    return 'Ambil di Gerobak Depan UNPAM';
  };

  const getPaymentMethodLabel = (m: string) => {
    switch (m) {
      case 'qris': return 'QRIS Standar Nasional';
      case 'ewallet': return 'E-Wallet (GoPay/OVO/DANA/ShopeePay)';
      case 'va': return 'Virtual Account (BCA/Mandiri/BRI)';
      case 'cash': return 'Tunai / Cash di Gerobak';
      default: return m;
    }
  };

  const createWhatsAppTextForOrder = (ord: {
    portion: number;
    menuName: string;
    price: number;
    spiceLevelSupported?: boolean;
    spiceLevel: number;
    sambalServing: string;
    addons: { extraSambel: boolean; tambahNasi: boolean; esTehJumbo?: boolean; tahuTempe?: boolean };
    subtotal: number;
    ppn: number;
    grandTotal: number;
    pickupMethod: string;
    customerName: string;
    notes: string;
    paymentMethod?: string;
    paymentStatus?: 'lunas_simulasi' | 'bayar_di_tempat';
    txId?: string;
  }) => {
    let msg = `Halo Admin Ayam Geprek Al-Fariz UNPAM!\n\n`;
    if (ord.paymentStatus === 'lunas_simulasi') {
      msg += `[PEMBAYARAN LUNAS TERVERIFIKASI] ✅\n`;
      msg += `Metode: ${ord.paymentMethod || 'QRIS Digital'}\n`;
      msg += `Ref ID: ${ord.txId || 'TX-FARIZ'}\n\n`;
    }

    msg += `Saya mau pesan kustom:\n`;
    msg += `• ${ord.portion}x ${ord.menuName} (Rp ${(ord.price * ord.portion).toLocaleString('id-ID')})\n`;
    if (ord.spiceLevelSupported ?? true) {
      msg += `  - Sambal: ${ord.sambalServing === 'dicampur' ? 'Dicampur di atas ayam' : ord.sambalServing === 'dipisah' ? 'Dipisah di wadah cup' : 'Tanpa Sambal'}\n`;
    }

    if (ord.addons.extraSambel) msg += `• ${ord.portion}x Extra Sambel (+Rp ${(EXTRA_SAMBEL_PRICE * ord.portion).toLocaleString('id-ID')})\n`;
    if (ord.addons.tambahNasi) msg += `• ${ord.portion}x Tambah Nasi Pulen (+Rp ${(TAMBAH_NASI_PRICE * ord.portion).toLocaleString('id-ID')})\n`;

    msg += `\nSubtotal: Rp ${ord.subtotal.toLocaleString('id-ID')}`;
    msg += `\nPPN (11%): Rp ${ord.ppn.toLocaleString('id-ID')}`;
    msg += `\nTOTAL PEMBAYARAN: Rp ${ord.grandTotal.toLocaleString('id-ID')}`;
    msg += `\n\nMetode Pengambilan: ${getPickupLabel(ord.pickupMethod)}`;
    if (ord.customerName) msg += `\nNama Pemesan: ${ord.customerName}`;
    if (ord.notes) msg += `\nCatatan Khusus: ${ord.notes}`;

    if (ord.paymentStatus === 'lunas_simulasi') {
      msg += `\nStatus Pembayaran: SUDAH LUNAS (Simulasi ${ord.paymentMethod || 'Digital'})`;
    } else {
      msg += `\nStatus Pembayaran: Bayar saat ambil (${ord.paymentMethod || 'Tunai/QRIS di Tempat'})`;
    }

    msg += `\n\nMohon konfirmasi dan segera diproses ya! Terima kasih 🙏`;
    return msg;
  };

  const currentWhatsAppUrl = () => {
    const text = createWhatsAppTextForOrder({
      portion,
      menuName: currentMenu.name,
      price: currentMenu.price,
      spiceLevelSupported: currentMenu.spiceLevelSupported,
      spiceLevel,
      sambalServing,
      addons,
      subtotal,
      ppn,
      grandTotal,
      pickupMethod,
      customerName,
      notes,
      paymentMethod: getPaymentMethodLabel(paymentMethod),
      paymentStatus: paidStatus?.isPaid ? 'lunas_simulasi' : 'bayar_di_tempat',
      txId: paidStatus?.txId
    });
    return `https://wa.me/628973816530?text=${encodeURIComponent(text)}`;
  };

  // Open digital payment modal for active current calculator order
  const handleOpenCurrentPaymentModal = () => {
    setActiveModalOrder({
      menuItem: currentMenu,
      portion,
      spiceLevel,
      sambalServing,
      addons,
      pickupMethod,
      customerName,
      notes,
      subtotal,
      ppn,
      grandTotal
    });
    setModalIsPaid(!!paidStatus?.isPaid);
    setModalTxId(paidStatus?.txId);
    setIsPaymentModalOpen(true);
  };

  // Open digital receipt for historical saved order
  const handleOpenHistoricalReceipt = (ord: SavedOrderRecord) => {
    setActiveModalOrder({
      orderId: ord.id,
      menuItem: ord.menuItem,
      portion: ord.portion,
      spiceLevel: ord.spiceLevel,
      sambalServing: ord.sambalServing,
      addons: ord.addons,
      pickupMethod: ord.pickupMethod,
      customerName: ord.customerName,
      notes: ord.notes,
      subtotal: ord.subtotal,
      ppn: ord.ppn,
      grandTotal: ord.grandTotal
    });
    setModalIsPaid(ord.paymentStatus === 'lunas_simulasi');
    setModalTxId(ord.txId);
    setIsPaymentModalOpen(true);
  };

  // Callback when user simulates successful payment in modal
  const handlePaymentSuccess = (method: string, tx: string) => {
    setPaidStatus({ isPaid: true, method, txId: tx });
    setNotification(`💳 Berhasil! Simulasi pembayaran via ${method} terverifikasi lunas (ID: ${tx})`);
    setTimeout(() => setNotification(null), 4000);
  };

  // Save current order into tracker
  const handleSaveToHistory = (silent = false) => {
    const newRecord: SavedOrderRecord = {
      id: `ORD-${Date.now()}`,
      timestamp: Date.now(),
      dateStr: new Date().toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      menuItem: currentMenu,
      portion,
      spiceLevel,
      sambalServing,
      addons: { ...addons },
      pickupMethod,
      customerName: customerName || 'Pelanggan UNPAM',
      notes,
      subtotal,
      ppn,
      grandTotal,
      paymentMethod: getPaymentMethodLabel(paymentMethod),
      paymentStatus: paidStatus?.isPaid ? 'lunas_simulasi' : 'bayar_di_tempat',
      txId: paidStatus?.txId
    };

    // Prepend to list, limit to 20 recent custom orders
    const updated = [newRecord, ...savedOrders].slice(0, 20);
    persistOrders(updated);

    if (!silent) {
      setCelebrationOrder(newRecord);
      setNotification('🎉 Hore! Pesanan kustom berhasil disimpan ke Riwayat Lokal!');
      setTimeout(() => setNotification(null), 4000);
    }

    void sendToCrm(newRecord, updated);
  };

  // Kirim pesanan ke CRM owner agar bisa dilacak; gagal pun WhatsApp tetap jalan.
  const sendToCrm = async (record: SavedOrderRecord, list: SavedOrderRecord[]) => {
    const key = JSON.stringify([record.menuItem.id, record.portion, record.spiceLevel, record.sambalServing, record.addons, record.customerName, record.notes, record.paymentStatus]);
    const attach = (code: string, trackUrl: string) => {
      const withCode = { ...record, crmCode: code, trackUrl };
      persistOrders(list.map((o) => (o.id === record.id ? withCode : o)));
      setCelebrationOrder((c) => (c && c.id === record.id ? withCode : c));
    };
    if (crmSentRef.current?.key === key) {
      attach(crmSentRef.current.code, crmSentRef.current.trackUrl);
      return;
    }
    const sambal = record.sambalServing === 'dicampur' ? 'Sambal dicampur' : record.sambalServing === 'dipisah' ? 'Sambal dipisah' : 'Tanpa sambal';
    const res = await submitOrderToCrm({
      customerName: record.customerName,
      notes: record.notes,
      paymentMethod: record.paymentMethod || '',
      paid: record.paymentStatus === 'lunas_simulasi',
      menuId: record.menuItem.id,
      portion: record.portion,
      options: record.menuItem.spiceLevelSupported ? `Level ${record.spiceLevel} · ${sambal}` : '',
      extraSambel: !!record.addons.extraSambel,
      tambahNasi: !!record.addons.tambahNasi,
    });
    if (!res) return;
    crmSentRef.current = { key, ...res };
    attach(res.code, res.trackUrl);
  };

  // Re-order: load saved order into active form
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
    setPickupMethod(order.pickupMethod);
    setCustomerName(order.customerName);
    setNotes(order.notes);

    if (order.paymentStatus === 'lunas_simulasi' && order.txId) {
      setPaidStatus({
        isPaid: true,
        method: order.paymentMethod || 'QRIS Digital',
        txId: order.txId
      });
    } else {
      setPaidStatus(null);
    }

    setActiveView('calculator');
    setNotification(`🔄 Pesanan "${order.menuItem.name}" berhasil dimuat kembali ke kalkulator!`);
    setTimeout(() => setNotification(null), 3500);

    const el = document.getElementById('simulasi-pemesanan');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  // Delete single order
  const handleDeleteOrder = (orderId: string) => {
    const filtered = savedOrders.filter((item) => item.id !== orderId);
    persistOrders(filtered);
    setNotification('🗑️ Pesanan dihapus dari riwayat.');
    setTimeout(() => setNotification(null), 2500);
  };

  // Clear all history
  const handleClearAllHistory = () => {
    if (window.confirm('Yakin ingin menghapus semua riwayat pesanan yang tersimpan di perangkat ini?')) {
      persistOrders([]);
      setNotification('Semua riwayat pesanan telah dibersihkan.');
      setTimeout(() => setNotification(null), 2500);
    }
  };

  // Copy order summary text to clipboard
  const handleCopyText = (order: SavedOrderRecord) => {
    const text = createWhatsAppTextForOrder({
      portion: order.portion,
      menuName: order.menuItem.name,
      price: order.menuItem.price,
      spiceLevelSupported: order.menuItem.spiceLevelSupported,
      spiceLevel: order.spiceLevel,
      sambalServing: order.sambalServing,
      addons: order.addons,
      subtotal: order.subtotal,
      ppn: order.ppn,
      grandTotal: order.grandTotal,
      pickupMethod: order.pickupMethod,
      customerName: order.customerName,
      notes: order.notes,
      paymentMethod: order.paymentMethod,
      paymentStatus: order.paymentStatus,
      txId: order.txId
    });

    navigator.clipboard.writeText(text).then(() => {
      setNotification('📋 Rincian pesanan berhasil disalin ke clipboard!');
      setTimeout(() => setNotification(null), 3000);
    });
  };

  return (
    <section className="py-16 lg:py-24 bg-[#FCFAF7] border-t border-gray-200 relative overflow-hidden scroll-mt-20" id="simulasi-pemesanan">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-6 sm:mb-8 space-y-2 sm:space-y-3">

          <h2 className="text-2xl xs:text-3xl sm:text-4xl font-extrabold text-[#1F1F1F] font-serif tracking-tight">
            Order Sekarang & Pesan Langsung
          </h2>
          <p className="text-xs xs:text-sm sm:text-base text-gray-600 leading-relaxed px-2">
            Kustomisasi menu geprek favoritmu, pilih metode bayar digital (QRIS & E-Wallet), simpan ke riwayat lokal, dan pesan langsung via WhatsApp!
          </p>
        </div>

        {/* View Switcher Tabs (Calculator vs Order History Tracker) */}
        <div className="flex flex-col xs:flex-row items-center justify-center gap-2 sm:gap-3 mb-6 sm:mb-8">
          <button
            type="button"
            onClick={() => setActiveView('calculator')}
            className={`w-full xs:w-auto inline-flex items-center justify-center gap-2 px-4 sm:px-5 py-2.5 rounded-full text-xs sm:text-sm font-extrabold transition-all shadow-sm ${
              activeView === 'calculator'
                ? 'bg-[#781519] text-[#F5C518] shadow-md scale-102 xs:scale-105'
                : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            <Calculator className="w-4 h-4" />
            <span>Order Sekarang / Pesan Baru</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveView('history')}
            className={`w-full xs:w-auto inline-flex items-center justify-center gap-2 px-4 sm:px-5 py-2.5 rounded-full text-xs sm:text-sm font-extrabold transition-all shadow-sm ${
              activeView === 'history'
                ? 'bg-[#781519] text-[#F5C518] shadow-md scale-102 xs:scale-105'
                : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            <History className="w-4 h-4" />
            <span>Tracker Riwayat Pesanan</span>
            {savedOrders.length > 0 && (
              <span className="bg-[#F5C518] text-[#5e0d10] text-[10px] font-black px-2 py-0.5 rounded-full">
                {savedOrders.length}
              </span>
            )}
          </button>
        </div>

        {/* Toast / Notification Banner */}
        {notification && (
          <div className="max-w-md mx-auto mb-6 p-3 bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-bold rounded-2xl text-center shadow-sm animate-in fade-in flex items-center justify-center gap-2">
            <span>{notification}</span>
          </div>
        )}

        {/* TAB 1: KALKULATOR PESANAN BARU */}
        {activeView === 'calculator' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start max-w-6xl mx-auto">
            {/* Left: Interactive Form Configuration */}
            <div className="lg:col-span-7 bg-white rounded-3xl p-4 xs:p-6 sm:p-8 border border-amber-100 shadow-md space-y-5 sm:space-y-6">
              {/* Step 1: Menu Utama Selection */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="text-sm font-bold text-gray-900 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-[#781519] text-white text-xs flex items-center justify-center font-bold">1</span>
                    Pilih Menu Utama
                  </label>
                  <span className="text-[11px] text-[#781519] font-semibold">Wajib Dipilih</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {primaryMenus.map((item) => {
                    const isSelected = currentMenu.id === item.id;
                    return (
                      <label
                        key={item.id}
                        onClick={() => {
                          setCurrentMenu(item);
                          onMenuItemChange(item);
                          setPaidStatus(null);
                        }}
                        className={`relative flex flex-col p-3.5 rounded-2xl border-2 cursor-pointer transition ${
                          isSelected
                            ? 'border-[#F5C518] bg-[#F5C518]/10'
                            : 'border-gray-200 bg-white hover:border-[#F5C518]'
                        }`}
                      >
                        <input
                          type="radio"
                          name="menu_utama"
                          value={item.name}
                          checked={isSelected}
                          onChange={() => {}}
                          className="hidden"
                        />
                        <div className="flex justify-between items-start">
                          <span className="font-bold text-sm text-gray-900">{item.name}</span>
                          <span className="text-xs font-black text-[#781519]">
                            Rp {item.price.toLocaleString('id-ID')}
                          </span>
                        </div>
                        <span className="text-[11px] text-gray-500 mt-1 line-clamp-1">{item.description}</span>
                        {item.badge && (
                          <span className="mt-2 text-[10px] bg-[#781519] text-[#F5C518] font-bold px-2 py-0.5 rounded-full w-max">
                            {item.badge}
                          </span>
                        )}
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Step 2: Penyajian Sambal */}
              {currentMenu.spiceLevelSupported && (
                <div>
                  <div className="flex items-center justify-between mb-2.5">
                    <label className="text-xs font-bold text-gray-900 flex items-center gap-1.5">
                      <span className="w-5 h-5 rounded-full bg-[#781519] text-white text-[10px] flex items-center justify-center font-bold">2</span>
                      Penyajian Sambal Ijo Uleg Dadakan
                    </label>
                    <span className="text-[11px] text-gray-500 font-medium">Sesuai Selera</span>
                  </div>

                  <div className="grid grid-cols-1 xs:grid-cols-3 gap-2 sm:gap-2.5">
                    <label
                      onClick={() => setSambalServing('dicampur')}
                      className={`relative flex items-center justify-between p-2.5 rounded-xl border-2 cursor-pointer transition ${
                        sambalServing === 'dicampur'
                          ? 'border-[#781519] bg-[#781519]/10'
                          : 'border-gray-200 bg-white hover:border-[#F5C518]'
                      }`}
                    >
                      <div className="flex flex-col">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-[#781519]">Dicampur</span>
                          <span className="text-[9px] bg-[#F5C518] text-[#5e0d10] font-black px-1.5 py-0.2 rounded-full">
                            Favorit
                          </span>
                        </div>
                        <span className="text-[10px] text-gray-600 mt-0.5">Dibalur di atas ayam</span>
                      </div>
                      <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-black ${sambalServing === 'dicampur' ? 'bg-[#781519] text-white' : 'border border-gray-300'}`}>
                        {sambalServing === 'dicampur' ? '✓' : ''}
                      </span>
                    </label>

                    <label
                      onClick={() => setSambalServing('dipisah')}
                      className={`relative flex items-center justify-between p-2.5 rounded-xl border-2 cursor-pointer transition ${
                        sambalServing === 'dipisah'
                          ? 'border-[#781519] bg-[#781519]/10'
                          : 'border-gray-200 bg-white hover:border-[#F5C518]'
                      }`}
                    >
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-gray-800">Dipisah</span>
                        <span className="text-[10px] text-gray-500 mt-0.5">Wadah cup tersendiri</span>
                      </div>
                      <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-black ${sambalServing === 'dipisah' ? 'bg-[#781519] text-white' : 'border border-gray-300'}`}>
                        {sambalServing === 'dipisah' ? '✓' : ''}
                      </span>
                    </label>

                    <label
                      onClick={() => setSambalServing('tanpa_sambal')}
                      className={`relative flex items-center justify-between p-2.5 rounded-xl border-2 cursor-pointer transition ${
                        sambalServing === 'tanpa_sambal'
                          ? 'border-[#781519] bg-[#781519]/10'
                          : 'border-gray-200 bg-white hover:border-[#F5C518]'
                      }`}
                    >
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-gray-800">Tanpa Sambal</span>
                        <span className="text-[10px] text-gray-500 mt-0.5">Ayam krispi original</span>
                      </div>
                      <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-black ${sambalServing === 'tanpa_sambal' ? 'bg-[#781519] text-white' : 'border border-gray-300'}`}>
                        {sambalServing === 'tanpa_sambal' ? '✓' : ''}
                      </span>
                    </label>
                  </div>
                </div>
              )}

              {/* Step 3: Porsi & Metode Ambil */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                {/* Jumlah Porsi Counter */}
                <div className="p-4 rounded-2xl bg-[#FCFAF7] border border-gray-200">
                  <label className="text-xs font-bold text-gray-900 block mb-2">Jumlah Porsi</label>
                  <div className="flex items-center justify-between bg-white rounded-xl border border-gray-300 p-1.5">
                    <button
                      type="button"
                      onClick={() => {
                        setPortion(Math.max(1, portion - 1));
                        setPaidStatus(null);
                      }}
                      className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-800 font-black text-sm flex items-center justify-center transition"
                    >
                      -
                    </button>
                    <span className="font-black text-base text-gray-900 px-3">
                      {portion} Porsi
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setPortion(portion + 1);
                        setPaidStatus(null);
                      }}
                      className="w-8 h-8 rounded-lg bg-[#F5C518] hover:bg-[#e0b312] text-[#5e0d10] font-black text-sm flex items-center justify-center transition"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Metode Ambil */}
                <div className="p-4 rounded-2xl bg-[#FCFAF7] border border-gray-200">
                  <label className="text-xs font-bold text-gray-900 block mb-2">Metode Pengambilan</label>
                  <select
                    value={pickupMethod}
                    onChange={(e) => setPickupMethod(e.target.value)}
                    className="w-full text-xs font-semibold rounded-xl border border-gray-300 bg-white py-2 px-3 text-gray-700 focus:border-[#781519] focus:ring-[#781519]"
                  >
                    <option value="ambil_gerobak">Ambil di Gerobak Depan UNPAM</option>
                  </select>
                </div>
              </div>

              {/* Step 4: Opsi Tambahan / Minuman */}
              <div>
                <label className="text-xs font-bold text-gray-900 block mb-2.5">Menu Pelengkap / Tambahan</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <label className="flex items-center gap-2 p-3 rounded-xl border border-gray-200 bg-white cursor-pointer hover:border-[#F5C518] transition text-xs font-semibold text-gray-800">
                    <input
                      type="checkbox"
                      checked={addons.extraSambel}
                      onChange={(e) => {
                        setAddons({ ...addons, extraSambel: e.target.checked });
                        setPaidStatus(null);
                      }}
                      className="rounded border-gray-300 text-[#781519] focus:ring-[#781519]"
                    />
                    <span>Extra Sambel Rawit (+Rp {EXTRA_SAMBEL_PRICE.toLocaleString('id-ID')})</span>
                  </label>

                  <label className="flex items-center gap-2 p-3 rounded-xl border border-gray-200 bg-white cursor-pointer hover:border-[#F5C518] transition text-xs font-semibold text-gray-800">
                    <input
                      type="checkbox"
                      checked={addons.tambahNasi}
                      onChange={(e) => {
                        setAddons({ ...addons, tambahNasi: e.target.checked });
                        setPaidStatus(null);
                      }}
                      className="rounded border-gray-300 text-[#781519] focus:ring-[#781519]"
                    />
                    <span>Tambah Nasi Pulen (+Rp {TAMBAH_NASI_PRICE.toLocaleString('id-ID')})</span>
                  </label>
                </div>
              </div>

              {/* Step 5: Metode Pembayaran (Digital & Tunai) */}
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <label className="text-xs font-bold text-gray-900 flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-[#781519] text-white text-[10px] flex items-center justify-center font-bold">5</span>
                    Pilihan Metode Pembayaran
                  </label>
                  <span className="text-[11px] text-[#2D864E] font-bold flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" /> Transaksi Digital Bebas Admin
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'qris', label: 'QRIS Dinamis', desc: 'Semua Bank & E-Wallet', icon: QrCode, badge: 'Favorit' },
                    { id: 'ewallet', label: 'E-Wallet', desc: 'GoPay/OVO/DANA/Shopee', icon: Wallet },
                    { id: 'va', label: 'Transfer VA', desc: 'BCA / Mandiri / BRI', icon: Building2 },
                    { id: 'cash', label: 'Tunai di Gerobak', desc: 'Bayar Langsung', icon: Banknote }
                  ].map((method) => {
                    const isSelected = paymentMethod === method.id;
                    const IconComp = method.icon;
                    return (
                      <button
                        key={method.id}
                        type="button"
                        onClick={() => setPaymentMethod(method.id as any)}
                        className={`p-3 rounded-2xl border-2 text-left transition relative flex flex-col justify-between ${
                          isSelected
                            ? 'border-[#781519] bg-[#781519]/5 shadow-sm'
                            : 'border-gray-200 bg-white hover:border-[#F5C518]'
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between mb-1.5">
                            <span className={`p-1.5 rounded-lg ${isSelected ? 'bg-[#781519] text-white' : 'bg-gray-100 text-gray-700'}`}>
                              <IconComp className="w-4 h-4" />
                            </span>
                            {method.badge && (
                              <span className="text-[9px] bg-[#F5C518] text-[#5e0d10] font-black px-1.5 py-0.5 rounded-full">
                                {method.badge}
                              </span>
                            )}
                          </div>
                          <span className="font-bold text-xs text-gray-900 block">{method.label}</span>
                          <span className="text-[10px] text-gray-500 leading-tight block mt-0.5">{method.desc}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Quick Button to Launch Payment */}
                <div className="mt-3 p-3 bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl border border-amber-200 flex flex-col sm:flex-row items-center justify-between gap-2.5">
                  <div className="flex items-center gap-2">
                    <span className="p-2 bg-[#781519] text-[#F5C518] rounded-xl shadow-sm">
                      <QrCode className="w-4 h-4" />
                    </span>
                    <div>
                      <span className="text-xs font-bold text-gray-900 block">
                        Pembayaran Digital (QRIS / E-Wallet)
                      </span>
                      <span className="text-[11px] text-gray-600 block">
                        Scan kode QR dinamis dan verifikasi pembayaran instan.
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleOpenCurrentPaymentModal}
                    className="w-full sm:w-auto px-4 py-2 bg-[#781519] hover:bg-[#5e0d10] text-[#F5C518] text-xs font-extrabold rounded-xl shadow transition flex items-center justify-center gap-1.5 flex-shrink-0"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Buka Scanner QRIS</span>
                  </button>
                </div>
              </div>

              {/* Step 6: Identitas & Catatan */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">Nama Pemesan</label>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Contoh: Fikri / Dinda (UNPAM)"
                    className="w-full text-xs rounded-xl border border-gray-300 py-2 px-3 focus:border-[#781519] focus:ring-[#781519]"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">Catatan Khusus</label>
                  <input
                    type="text"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Contoh: Sambel dipisah / bagian dada"
                    className="w-full text-xs rounded-xl border border-gray-300 py-2 px-3 focus:border-[#781519] focus:ring-[#781519]"
                  />
                </div>
              </div>
            </div>

            {/* Right: Real-time Order Summary Card */}
            <div className="lg:col-span-5 bg-white rounded-3xl p-4 xs:p-6 sm:p-8 border-2 border-[#F5C518] shadow-xl relative overflow-hidden">
              <div className="absolute -top-12 -right-12 w-36 h-36 bg-[#F5C518]/20 rounded-full blur-2xl pointer-events-none"></div>

              <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-[#2D864E] animate-pulse"></span>
                  <h3 className="font-extrabold text-base text-gray-900 font-serif">Ringkasan Pesanan</h3>
                </div>
                <span className="text-[11px] font-bold text-[#781519] bg-[#781519]/10 px-2.5 py-0.5 rounded-full">
                  Siap 10-15 Menit
                </span>
              </div>

              {/* Order Breakdown */}
              <div className="py-5 space-y-3 text-xs">
                <div className="flex justify-between items-start text-gray-700">
                  <div>
                    <span className="font-bold block text-sm text-gray-900">
                      {portion}x {currentMenu.name}
                    </span>
                    {currentMenu.spiceLevelSupported && (
                      <span className="text-gray-500 text-[11px]">
                        🥣 Sambal: {sambalServing === 'dicampur' ? 'Dicampur di atas ayam' : sambalServing === 'dipisah' ? 'Dipisah di wadah cup' : 'Tanpa Sambal'}
                      </span>
                    )}
                  </div>
                  <span className="font-bold text-gray-900 text-sm">
                    Rp {(currentMenu.price * portion).toLocaleString('id-ID')}
                  </span>
                </div>

                {addons.extraSambel && (
                  <div className="flex justify-between items-center text-gray-600">
                    <span>{portion}x Extra Sambel</span>
                    <span className="font-semibold text-gray-800">
                      Rp {(EXTRA_SAMBEL_PRICE * portion).toLocaleString('id-ID')}
                    </span>
                  </div>
                )}

                {addons.tambahNasi && (
                  <div className="flex justify-between items-center text-gray-600">
                    <span>{portion}x Tambah Nasi</span>
                    <span className="font-semibold text-gray-800">
                      Rp {(TAMBAH_NASI_PRICE * portion).toLocaleString('id-ID')}
                    </span>
                  </div>
                )}

                <div className="flex justify-between items-center text-gray-600 pt-2 border-t border-gray-100">
                  <span className="font-medium">Subtotal</span>
                  <span className="font-bold text-gray-900">Rp {subtotal.toLocaleString('id-ID')}</span>
                </div>

                <div className="flex justify-between items-center text-gray-600">
                  <span>Pajak PPN (11%)</span>
                  <span className="font-semibold text-gray-800">Rp {ppn.toLocaleString('id-ID')}</span>
                </div>

                <div className="flex justify-between items-center text-gray-500 text-[11px]">
                  <span>Lokasi Pengambilan:</span>
                  <span className="font-semibold text-[#781519]">{getPickupLabel(pickupMethod)}</span>
                </div>

                <div className="flex justify-between items-center text-gray-500 text-[11px]">
                  <span>Metode Pembayaran:</span>
                  <span className="font-semibold text-gray-900">{getPaymentMethodLabel(paymentMethod)}</span>
                </div>

                <div className="flex justify-between items-center text-gray-500 text-[11px]">
                  <span>Biaya Layanan/Bungkus:</span>
                  <span className="text-[#2D864E] font-bold">GRATIS (Rp 0)</span>
                </div>
              </div>

              {/* Total Price Box with Live Payment Status */}
              <div className="p-4 rounded-2xl bg-[#781519] text-white flex items-center justify-between mb-4 shadow-inner">
                <div>
                  <span className="text-[10px] text-amber-200 block uppercase font-bold tracking-wider">
                    Total Pembayaran
                  </span>
                  <span className="text-2xl font-black text-[#F5C518] font-serif">
                    Rp {grandTotal.toLocaleString('id-ID')}
                  </span>
                </div>
                <div className="text-right">
                  {paidStatus?.isPaid ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-black bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 px-2.5 py-1 rounded-full animate-pulse">
                      <CheckCircle2 className="w-3.5 h-3.5" /> LUNAS (Simulasi)
                    </span>
                  ) : (
                    <>
                      <span className="text-[10px] text-white/80 block">Status Bayar:</span>
                      <span className="text-xs font-bold text-white">
                        {paymentMethod === 'cash' ? 'Cash di Gerobak' : 'Menunggu Bayar'}
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* Action Buttons: Digital Payment Simulation, WhatsApp & Local Storage Save */}
              <div className="space-y-2">
                {/* 1. Interactive Digital Payment Button */}
                <button
                  type="button"
                  onClick={handleOpenCurrentPaymentModal}
                  className={`w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-2xl text-xs sm:text-sm font-extrabold shadow-sm transition transform hover:-translate-y-0.5 ${
                    paidStatus?.isPaid
                      ? 'bg-emerald-50 text-emerald-800 border-2 border-emerald-300 hover:bg-emerald-100'
                      : 'bg-gradient-to-r from-[#781519] to-[#8E1B20] text-[#F5C518] hover:from-[#5e0d10] hover:to-[#781519]'
                  }`}
                >
                  {paidStatus?.isPaid ? (
                    <>
                      <Receipt className="w-4 h-4 text-emerald-700" />
                      <span>Lihat Bukti Struk Digital (Lunas)</span>
                    </>
                  ) : (
                    <>
                      <QrCode className="w-4 h-4" />
                      <span>Order Sekarang & Bayar Digital (QRIS / E-Wallet)</span>
                      <span className="bg-[#F5C518] text-[#5e0d10] text-[9px] font-black px-1.5 py-0.5 rounded-full ml-1">
                        Coba
                      </span>
                    </>
                  )}
                </button>

                {/* 2. Direct WhatsApp Order */}
                <a
                  href={currentWhatsAppUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => handleSaveToHistory(true)}
                  className="w-full inline-flex items-center justify-center gap-2.5 bg-[#F5C518] hover:bg-[#e0b312] text-[#5e0d10] font-extrabold text-sm py-3.5 rounded-2xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5"
                >
                  <MessageCircle className="w-5 h-5 fill-current" />
                  <span>
                    {paidStatus?.isPaid
                      ? 'Kirim Pesanan ke WA (+ Bukti Bayar)'
                      : 'Pesan Sekarang via WhatsApp'}
                  </span>
                </a>

                {/* 3. Local Storage Tracker Save */}
                <button
                  type="button"
                  onClick={() => handleSaveToHistory(false)}
                  className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 bg-gray-50 hover:bg-amber-50 text-gray-800 hover:text-[#781519] rounded-xl border border-gray-200 text-xs font-bold transition"
                >
                  <Bookmark className="w-4 h-4 text-[#781519]" />
                  <span>Simpan ke Tracker Riwayat Lokal</span>
                </button>
              </div>

              {/* Microcopy guarantee */}
              <div className="pt-4 text-center">
                <p className="text-[11px] text-gray-500 flex items-center justify-center gap-1.5 font-medium">
                  <Check className="w-3.5 h-3.5 text-[#2D864E]" />
                  Dukungan QRIS • Uleg Dadakan Masih Panas • Pesanan Langsung Diproses
                </p>
              </div>

              {/* Quick glance at latest saved order */}
              {savedOrders.length > 0 && (
                <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-600">
                  <span className="text-[11px]">
                    Tersimpan di perangkat: <strong>{savedOrders.length} pesanan</strong>
                  </span>
                  <button
                    type="button"
                    onClick={() => setActiveView('history')}
                    className="text-[#781519] font-bold hover:underline flex items-center gap-1 text-[11px]"
                  >
                    Buka Tracker Riwayat →
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: TRACKER RIWAYAT PESANAN TERSIMPAN (LOCAL STORAGE BASED) */}
        {activeView === 'history' && (
          <div className="max-w-4xl mx-auto space-y-6">
            {/* History Control Bar */}
            <div className="bg-white p-5 rounded-3xl border border-gray-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#781519]/10 text-[#781519] flex items-center justify-center">
                  <History className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-gray-900 font-serif">
                    Riwayat Pesanan Kustom Tersimpan
                  </h3>
                  <p className="text-xs text-gray-500">
                    Disimpan secara aman di browser lokal Anda ({savedOrders.length} pesanan tercatat).
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setActiveView('calculator')}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#F5C518] hover:bg-[#e0b312] text-[#5e0d10] font-bold text-xs rounded-xl shadow-sm transition"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  Racik Pesanan Baru
                </button>

                {savedOrders.length > 0 && (
                  <button
                    type="button"
                    onClick={handleClearAllHistory}
                    className="inline-flex items-center gap-1 px-3 py-2 text-rose-700 hover:bg-rose-50 rounded-xl text-xs font-semibold border border-rose-200 transition"
                    title="Hapus seluruh riwayat pesanan"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Hapus Semua
                  </button>
                )}
              </div>
            </div>

            {/* List of Saved Orders or Empty State */}
            {savedOrders.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-gray-200 shadow-sm space-y-4">
                <div className="w-16 h-16 rounded-3xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
                  <Bookmark className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-lg font-bold text-gray-800 font-serif">
                    Belum Ada Riwayat Pesanan Tersimpan
                  </h4>
                  <p className="text-xs sm:text-sm text-gray-500 max-w-md mx-auto">
                    Kustomisasi paket geprek favoritmu, tentukan metode pembayaran digital/tunai, lalu simpan ke perangkat ini agar mudah dipesan kembali kapan saja!
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveView('calculator')}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-[#781519] hover:bg-[#5e0d10] text-[#F5C518] font-extrabold text-xs sm:text-sm rounded-full shadow transition"
                >
                  <Calculator className="w-4 h-4" />
                  Mulai Racik & Pesan Sekarang
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {savedOrders.map((ord) => {
                  const ordWaUrl = `https://wa.me/628973816530?text=${encodeURIComponent(
                    createWhatsAppTextForOrder({
                      portion: ord.portion,
                      menuName: ord.menuItem.name,
                      price: ord.menuItem.price,
                      spiceLevelSupported: ord.menuItem.spiceLevelSupported,
                      spiceLevel: ord.spiceLevel,
                      sambalServing: ord.sambalServing,
                      addons: ord.addons,
                      subtotal: ord.subtotal,
                      ppn: ord.ppn,
                      grandTotal: ord.grandTotal,
                      pickupMethod: ord.pickupMethod,
                      customerName: ord.customerName,
                      notes: ord.notes,
                      paymentMethod: ord.paymentMethod,
                      paymentStatus: ord.paymentStatus,
                      txId: ord.txId
                    })
                  )}`;

                  return (
                    <div
                      key={ord.id}
                      className="bg-white rounded-3xl p-5 sm:p-6 border border-gray-200 shadow-sm hover:shadow-md transition-all space-y-4"
                    >
                      {/* Order Card Top Bar */}
                      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-gray-100">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[11px] font-bold text-gray-400">
                            #{ord.id}
                          </span>
                          <span className="text-xs text-gray-500">
                            • {ord.dateStr}
                          </span>
                          {ord.paymentStatus === 'lunas_simulasi' ? (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-full">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                              Lunas ({ord.paymentMethod || 'QRIS'})
                            </span>
                          ) : (
                            <span className="text-[10px] font-bold bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                              {ord.paymentMethod || 'Bayar di Tempat'}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-xs font-black text-[#781519] bg-[#781519]/10 px-3 py-1 rounded-full">
                            Total: Rp {ord.grandTotal.toLocaleString('id-ID')}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleDeleteOrder(ord.id)}
                            className="p-1.5 text-gray-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition"
                            title="Hapus pesanan ini"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Order Details Body */}
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                        <div className="md:col-span-7 flex items-start gap-4">
                          <img
                            src={ord.menuItem.image}
                            alt={ord.menuItem.name}
                            className="w-16 h-16 rounded-2xl object-cover flex-shrink-0 shadow-sm border border-gray-100"
                          />
                          <div className="space-y-1">
                            <h4 className="font-bold text-sm sm:text-base text-gray-900">
                              {ord.portion}x {ord.menuItem.name}
                            </h4>
                            <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
                              <span className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-900 font-bold border border-amber-200">
                                Sambal: {ord.sambalServing === 'dicampur' ? 'Dicampur' : ord.sambalServing === 'dipisah' ? 'Dipisah' : 'Tanpa Sambal'}
                              </span>
                              <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 font-medium">
                                {getPickupLabel(ord.pickupMethod)}
                              </span>
                            </div>

                            {/* Addons List */}
                            <div className="text-[11px] text-gray-500 pt-0.5">
                              {ord.addons.esTehJumbo && <span className="mr-2">• Es Teh Jumbo</span>}
                              {ord.addons.extraSambel && <span className="mr-2">• Extra Sambal</span>}
                              {ord.addons.tambahNasi && <span className="mr-2">• Tambah Nasi</span>}
                              {ord.addons.tahuTempe && <span className="mr-2">• Tahu Tempe</span>}
                            </div>

                            {/* Notes & Customer */}
                            {(ord.notes || ord.customerName) && (
                              <p className="text-[11px] text-gray-600 italic">
                                Pemesan: {ord.customerName} {ord.notes ? `(Catatan: "${ord.notes}")` : ''}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Order Actions Right */}
                        <div className="md:col-span-5 grid grid-cols-2 xs:flex xs:flex-wrap sm:flex-nowrap items-center md:justify-end gap-2 pt-2 md:pt-0 w-full md:w-auto">
                          {/* Receipt Modal Trigger */}
                          <button
                            type="button"
                            onClick={() => handleOpenHistoricalReceipt(ord)}
                            className="inline-flex items-center justify-center gap-1 px-3 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-[#781519] font-bold text-xs border border-amber-200 transition"
                            title="Buka struk pembayaran digital"
                          >
                            <Receipt className="w-3.5 h-3.5" />
                            <span>Struk</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleLoadOrder(ord)}
                            className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold text-xs transition"
                            title="Muat konfigurasi ini ke kalkulator untuk diedit"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                            <span>Pesan Lagi</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleCopyText(ord)}
                            className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-900 transition flex items-center justify-center col-span-2 xs:col-auto"
                            title="Salin rincian pesanan"
                          >
                            <Copy className="w-4 h-4" />
                          </button>

                          <a
                            href={ordWaUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="col-span-2 xs:col-auto inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-[#25D366] hover:bg-[#1EBE5D] text-white font-extrabold text-xs shadow-sm transition transform hover:scale-105"
                          >
                            <MessageCircle className="w-4 h-4 fill-current" />
                            <span>Kirim ke WA</span>
                          </a>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Celebratory Success Modal */}
        {celebrationOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            {/* Confetti celebration particles in background */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
              <span className="absolute top-10 left-[15%] text-3xl animate-confetti" style={{ animationDelay: '0.1s' }}>🎉</span>
              <span className="absolute top-14 left-[28%] text-2xl animate-confetti" style={{ animationDelay: '0.3s' }}>🌶️</span>
              <span className="absolute top-8 left-[45%] text-3xl animate-confetti" style={{ animationDelay: '0.2s' }}>✨</span>
              <span className="absolute top-12 left-[60%] text-2xl animate-confetti" style={{ animationDelay: '0.4s' }}>🍗</span>
              <span className="absolute top-16 left-[75%] text-3xl animate-confetti" style={{ animationDelay: '0.15s' }}>🎊</span>
              <span className="absolute top-10 left-[88%] text-2xl animate-confetti" style={{ animationDelay: '0.35s' }}>🍃</span>
            </div>

            <div className="relative w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 border-2 border-[#F5C518] shadow-2xl animate-pop-in space-y-6 overflow-hidden">
              {/* Top gradient glow */}
              <div className="absolute -top-16 -right-16 w-36 h-36 bg-[#F5C518]/25 rounded-full blur-2xl pointer-events-none"></div>

              {/* Close Button */}
              <button
                onClick={() => setCelebrationOrder(null)}
                className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition"
                aria-label="Tutup modal perayaan"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Header with Icon */}
              <div className="text-center space-y-2 pt-2">
                <div className="relative inline-block">
                  <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-[#F5C518] to-amber-300 text-[#5e0d10] flex items-center justify-center mx-auto shadow-lg shadow-amber-300/50">
                    <PartyPopper className="w-8 h-8" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[#2D864E] text-white flex items-center justify-center text-xs font-bold border-2 border-white shadow">
                    ✓
                  </div>
                </div>

                <h3 className="text-xl sm:text-2xl font-black text-gray-900 font-serif leading-tight">
                  Hore! Pesanan Berhasil Disimpan! 🎉
                </h3>
                <p className="text-xs sm:text-sm text-gray-500 max-w-sm mx-auto leading-relaxed">
                  Racikan kustom geprek favoritmu telah tercatat aman di riwayat lokal browser ini.
                </p>
              </div>

              {/* Order Preview Card */}
              <div className="bg-[#FCFAF7] rounded-2xl p-4 sm:p-5 border border-amber-200/80 space-y-3">
                <div className="flex items-center gap-3">
                  <img
                    src={celebrationOrder.menuItem.image}
                    alt={celebrationOrder.menuItem.name}
                    className="w-14 h-14 rounded-xl object-cover flex-shrink-0 shadow-sm border border-amber-100"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-extrabold text-sm sm:text-base text-gray-900 truncate">
                      {celebrationOrder.portion}x {celebrationOrder.menuItem.name}
                    </h4>
                    <div className="flex flex-wrap items-center gap-1.5 mt-1 text-[11px]">
                      <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 font-bold">
                        Sambal {celebrationOrder.sambalServing === 'dicampur' ? 'Dicampur' : celebrationOrder.sambalServing === 'dipisah' ? 'Dipisah' : 'Tanpa Sambal'}
                      </span>
                      {celebrationOrder.paymentStatus === 'lunas_simulasi' && (
                        <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-bold">
                          ✓ Lunas ({celebrationOrder.paymentMethod})
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Addons Summary */}
                {(celebrationOrder.addons.esTehJumbo ||
                  celebrationOrder.addons.extraSambel ||
                  celebrationOrder.addons.tambahNasi ||
                  celebrationOrder.addons.tahuTempe) && (
                  <div className="text-[11px] text-gray-500 pt-1 border-t border-amber-100 flex flex-wrap gap-1">
                    <span className="font-semibold text-gray-700">Pelengkap:</span>
                    {celebrationOrder.addons.esTehJumbo && <span className="bg-white px-1.5 py-0.5 rounded border border-gray-200">Es Teh Jumbo</span>}
                    {celebrationOrder.addons.extraSambel && <span className="bg-white px-1.5 py-0.5 rounded border border-gray-200">Extra Sambel</span>}
                    {celebrationOrder.addons.tambahNasi && <span className="bg-white px-1.5 py-0.5 rounded border border-gray-200">Tambah Nasi</span>}
                    {celebrationOrder.addons.tahuTempe && <span className="bg-white px-1.5 py-0.5 rounded border border-gray-200">Tahu & Tempe</span>}
                  </div>
                )}

                {celebrationOrder.trackUrl && (
                  <a
                    href={celebrationOrder.trackUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between rounded-xl bg-emerald-50 border border-emerald-200 px-3 py-2 text-[11px] font-bold text-emerald-800 hover:bg-emerald-100"
                  >
                    <span>Kode pesanan: {celebrationOrder.crmCode}</span>
                    <span>Lacak status →</span>
                  </a>
                )}

                {/* Total Price strip */}
                <div className="pt-2 border-t border-amber-200/60 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-[10px] text-gray-400 block">Total Pembayaran (+PPN)</span>
                    <span className="text-base sm:text-lg font-black text-[#781519]">
                      Rp {celebrationOrder.grandTotal.toLocaleString('id-ID')}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-gray-400 block">Pengambilan</span>
                    <span className="font-semibold text-gray-800 text-[11px]">
                      {getPickupLabel(celebrationOrder.pickupMethod)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2.5 pt-1">
                <a
                  href={`https://wa.me/628973816530?text=${encodeURIComponent(
                    createWhatsAppTextForOrder({
                      portion: celebrationOrder.portion,
                      menuName: celebrationOrder.menuItem.name,
                      price: celebrationOrder.menuItem.price,
                      spiceLevelSupported: celebrationOrder.menuItem.spiceLevelSupported,
                      spiceLevel: celebrationOrder.spiceLevel,
                      sambalServing: celebrationOrder.sambalServing,
                      addons: celebrationOrder.addons,
                      subtotal: celebrationOrder.subtotal,
                      ppn: celebrationOrder.ppn,
                      grandTotal: celebrationOrder.grandTotal,
                      pickupMethod: celebrationOrder.pickupMethod,
                      customerName: celebrationOrder.customerName,
                      notes: celebrationOrder.notes,
                      paymentMethod: celebrationOrder.paymentMethod,
                      paymentStatus: celebrationOrder.paymentStatus,
                      txId: celebrationOrder.txId
                    })
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setCelebrationOrder(null)}
                  className="w-full inline-flex items-center justify-center gap-2 bg-[#F5C518] hover:bg-[#e0b312] text-[#5e0d10] font-black text-sm py-3.5 rounded-2xl shadow-lg transition transform hover:-translate-y-0.5"
                >
                  <MessageCircle className="w-4 h-4 fill-current" />
                  <span>Langsung Kirim Pesanan ke WhatsApp</span>
                </a>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setActiveView('history');
                      setCelebrationOrder(null);
                    }}
                    className="inline-flex items-center justify-center gap-1.5 py-2.5 px-3 bg-white hover:bg-gray-100 text-gray-800 font-bold text-xs rounded-xl border border-gray-300 transition"
                  >
                    <History className="w-3.5 h-3.5 text-[#781519]" />
                    <span>Lihat di Tracker</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setCelebrationOrder(null)}
                    className="inline-flex items-center justify-center py-2.5 px-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs rounded-xl transition"
                  >
                    <span>Tutup & Selesai</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal Simulasi Pembayaran Digital (QRIS, E-Wallet, VA) */}
        {activeModalOrder && (
          <DigitalPaymentModal
            isOpen={isPaymentModalOpen}
            onClose={() => setIsPaymentModalOpen(false)}
            orderData={activeModalOrder}
            onPaymentSuccess={handlePaymentSuccess}
            isPaid={modalIsPaid}
            existingTxId={modalTxId}
          />
        )}
      </div>
    </section>
  );
};
