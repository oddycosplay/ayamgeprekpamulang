import geprekPaketNasi from '../produk/geprek-paket-nasi.jpg';
import geprekAlacarte from '../produk/geprek-alacarte.jpg';
import { MenuItem, Testimonial } from '../types.ts';

export const MENU_ITEMS: MenuItem[] = [
  {
    id: 'paket-geprek-nasi',
    name: 'Paket Penyet + Nasi',
    category: 'paket',
    price: 17000,
    description: 'Ayam krispi fillet penyet sambel ijo uleg dadakan + Nasi putih pulen hangat + Lalapan timun segar.',
    image: geprekPaketNasi,
    badge: 'BEST SELLER',
    spiceLevelSupported: true
  },
  {
    id: 'ayam-geprek-saja',
    name: 'Ayam Penyet Saja',
    category: 'alacarte',
    price: 15000,
    description: '1 potong ayam krispi jumbo berbalut sambel ijo cabai rawit pedas gurih tanpa nasi + lalapan.',
    image: geprekAlacarte,
    badge: 'ALACARTE',
    spiceLevelSupported: true
  }
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: '1',
    name: 'Dimas P.',
    role: 'Mahasiswa UNPAM',
    comment: 'Sambel ijo uleg dadakannya gila pedes mantep banget, ayamnya renyah gurih sampai ke tulang. Nagih abis!',
    rating: 5,
    highlightTag: 'Sambel Nampol 🌶️',
    favoriteMenu: 'Paket Penyet + Nasi (Level 3)',
    date: 'Kemarin',
    avatarColor: 'from-amber-500 to-red-600'
  },
  {
    id: '2',
    name: 'Ibu Sari',
    role: 'Dosen & Penikmat Kuliner',
    comment: 'Langganan makan siang di sini setiap jeda kuliah, porsi nasinya banyak dan harganya beneran ramah kantong.',
    rating: 5,
    highlightTag: 'Porsi Puas & Kenyang 🍚',
    favoriteMenu: 'Paket Penyet + Nasi',
    date: '3 hari lalu',
    avatarColor: 'from-emerald-500 to-teal-700'
  },
  {
    id: '3',
    name: 'Reza Kurnia',
    role: 'Warga Pamulang Permai',
    comment: 'Aroma minyak bawang dan cabe rawit ijonya khas banget. Tiap kangen sambel rumahan yang pedes gurih larinya ke sini!',
    rating: 5,
    highlightTag: 'Aroma Minyak Bawang Khas 🧄',
    favoriteMenu: 'Ayam Penyet Saja',
    date: '5 hari lalu',
    avatarColor: 'from-blue-500 to-indigo-700'
  },
  {
    id: '4',
    name: 'Nadia A.',
    role: 'Ketua Panitia Kampus UNPAM',
    comment: 'Pesan 45 box untuk acara himpunan mahasiswa, datangnya on-time, ayam tetap krispi dan sambelnya nampol bikin nagih!',
    rating: 5,
    highlightTag: 'Paling Cocok Pesanan Box 📦',
    favoriteMenu: 'Paket Box Acara Kampus',
    date: '1 minggu lalu',
    avatarColor: 'from-purple-500 to-pink-600'
  },
  {
    id: '5',
    name: 'Bima Sakti',
    role: 'Alumni UNPAM & Komuter Ojol',
    comment: 'Tempat nongkrong malam paling favorit depan kampus. Jam 21.00 masih panas ulegannya, Mas Al-Fariz pelayanannya ramah banget.',
    rating: 5,
    highlightTag: 'Favorit Malam Hari 🌙',
    favoriteMenu: 'Penyet Sambel Ijo Uleg Dadakan',
    date: '2 minggu lalu',
    avatarColor: 'from-rose-500 to-red-700'
  }
];
