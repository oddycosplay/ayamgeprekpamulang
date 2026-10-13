import geprekPaketNasi from '../produk/geprek-paket-nasi.jpg';
import geprekAlacarte from '../produk/geprek-alacarte.jpg';
import geprekOriginal from '../produk/geprek-original.jpg';
import geprekExtraCrispy from '../produk/professional_food_photography_of_indonesian_ayam_geprek_sambel_ijo_extra_crispy.webp';
import { MenuItem, Testimonial } from '../types.ts';

export const MENU_ITEMS: MenuItem[] = [
  {
    id: 'paket-geprek-nasi',
    name: 'Paket Geprek + Nasi',
    category: 'paket',
    price: 17000,
    description: 'Ayam krispi fillet geprek sambel ijo uleg dadakan + Nasi putih pulen hangat + Lalapan timun segar.',
    image: geprekPaketNasi,
    badge: 'BEST SELLER',
    spiceLevelSupported: true
  },
  {
    id: 'ayam-geprek-saja',
    name: 'Ayam Geprek Saja',
    category: 'alacarte',
    price: 15000,
    description: '1 potong ayam krispi jumbo berbalut sambel ijo cabai rawit pedas gurih tanpa nasi + lalapan.',
    image: geprekAlacarte,
    badge: 'ALACARTE',
    spiceLevelSupported: true
  },
  {
    id: 'geprek-original',
    name: 'Geprek Original',
    category: 'alacarte',
    price: 13000,
    description: 'Ayam geprek krispi dengan sambel ijo uleg pedas khas Al-Fariz di atas daun pisang segar.',
    image: geprekOriginal,
    badge: 'FAVORIT',
    spiceLevelSupported: true
  },
  {
    id: 'geprek-extra-crispy',
    name: 'Geprek Extra Crispy',
    category: 'alacarte',
    price: 15000,
    description: 'Ayam goreng crispy super renyah double coating, disiram sambel ijo uleg dadakan cabai rawit hijau yang nampol dan segar.',
    image: geprekExtraCrispy,
    badge: 'NEW',
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
    favoriteMenu: 'Paket Geprek + Nasi (Level 3)',
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
    favoriteMenu: 'Paket Geprek + Nasi',
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
    favoriteMenu: 'Ayam Geprek Saja',
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
    favoriteMenu: 'Geprek Sambel Ijo Uleg Dadakan',
    date: '2 minggu lalu',
    avatarColor: 'from-rose-500 to-red-700'
  }
];
