export interface MenuItem {
  id: string;
  name: string;
  category: 'paket' | 'alacarte' | 'pelengkap' | 'minuman';
  price: number;
  description: string;
  image: string;
  badge?: string;
  spiceLevelSupported?: boolean;
}

export interface OrderItem {
  menuItem: MenuItem;
  spiceLevel: number;
  sambalServing: 'dicampur' | 'dipisah' | 'tanpa_sambal';
  portion: number;
  addons: {
    extraSambel: boolean;
    tambahNasi: boolean;
    esTehJumbo?: boolean;
    tahuTempe?: boolean;
  };
  customerName: string;
  pickupMethod: 'ambil_gerobak';
  notes: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  comment: string;
  rating: number;
  highlightTag?: string;
  favoriteMenu?: string;
  date?: string;
  avatarColor?: string;
}
