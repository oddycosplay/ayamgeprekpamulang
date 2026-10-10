import React from 'react';
import { MapPin, Clock, Phone, ExternalLink, MessageCircle } from 'lucide-react';

interface LokasiKontakSectionProps {
  onExploreMapsGrounding?: () => void;
}

export const LokasiKontakSection: React.FC<LokasiKontakSectionProps> = () => {
  return (
    <section className="py-20 bg-[#781519] text-white relative overflow-hidden" id="lokasi">
      {/* Background subtle elements */}
      <div className="absolute -top-20 right-0 w-80 h-80 bg-[#F5C518]/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Contact Detail Left */}
          <div className="lg:col-span-6 space-y-6">
            <div>
              <span className="text-[#F5C518] text-xs font-bold tracking-widest uppercase block mb-1">
                Kunjungi Gerobak Kami
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold font-serif">
                Lokasi Strategis Depan UNPAM Pamulang
              </h2>
            </div>

            <p className="text-amber-100/90 text-sm sm:text-base leading-relaxed">
              Temukan gerobak ikonik kami tepat di seberang gerbang utama kampus Universitas Pamulang. Sangat mudah dijangkau bagi pejalan kaki, pengguna transportasi online, maupun yang membawa kendaraan pribadi.
            </p>

            <div className="space-y-4 pt-2">
              {/* Address Item */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0 text-[#F5C518]">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-base">Alamat Gerobak:</h4>
                  <p className="text-amber-100/80 text-sm">
                    Jl. Surya Kencana No. 27, Pamulang Barat (Depan Gerbang Kampus UNPAM, samping Mie Ayam & dekat minimarket Lawson), Tangerang Selatan, Banten.
                  </p>
                </div>
              </div>

              {/* Operational Hours */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0 text-[#F5C518]">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-base">Jam Operasional:</h4>
                  <p className="text-amber-100/80 text-sm">
                    Senin – Minggu: 15.00 – 22.00 WIB (Buka Setiap Hari)
                  </p>
                </div>
              </div>

              {/* WhatsApp */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0 text-[#F5C518]">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-base">Kontak & Pemesanan:</h4>
                  <p className="text-amber-100/80 text-sm">
                    WhatsApp: +62 897-3816-530 (Fast Response)
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-4 flex flex-wrap gap-3 sm:gap-4">
              <a
                className="inline-flex items-center gap-2 bg-[#F5C518] hover:bg-[#e0b312] text-[#5e0d10] font-bold px-6 py-3 rounded-full text-sm shadow transition transform hover:-translate-y-0.5"
                href="https://maps.google.com/?q=Universitas+Pamulang+Jl.+Surya+Kencana+No.27+Pamulang+Barat"
                rel="noopener noreferrer"
                target="_blank"
              >
                <ExternalLink className="w-4 h-4" />
                Buka di Google Maps
              </a>
              <a
                className="inline-flex items-center gap-2 bg-white/15 hover:bg-white/25 text-white font-bold px-6 py-3 rounded-full text-sm border border-white/30 backdrop-blur transition"
                href="https://wa.me/628973816530?text=Halo%20Ayam%20Geprek%20Al-Fariz,%20saya%20ingin%20tanya%20lokasi%20gerobak"
                rel="noopener noreferrer"
                target="_blank"
              >
                <MessageCircle className="w-4 h-4" />
                Chat via WhatsApp
              </a>
            </div>
          </div>

          {/* Visual Map Container Right */}
          <div className="lg:col-span-6">
            <div className="bg-[#5e0d10]/80 p-4 sm:p-6 rounded-3xl border border-white/15 shadow-2xl backdrop-blur-md">
              <div className="aspect-video w-full rounded-2xl overflow-hidden bg-neutral-800 relative flex items-center justify-center border border-white/10">
                <iframe
                  className="w-full h-full border-0 absolute inset-0 z-0"
                  src="https://maps.google.com/maps?q=Universitas%20Pamulang%20Jl.%20Surya%20Kencana%20No.27%20Pamulang%20Barat&t=&z=16&ie=UTF8&iwloc=&output=embed"
                  allowFullScreen={false}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Lokasi Google Maps Ayam Geprek Al-Fariz UNPAM"
                />
                <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/80 via-transparent to-transparent z-10 flex flex-col justify-end p-5 sm:p-6">
                  <div className="pointer-events-auto bg-[#F5C518] text-[#5e0d10] text-xs font-black px-3 py-1 rounded-full w-max mb-2 shadow-md flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 fill-current" />
                    <span>📍 DEPAN KAMPUS UNPAM</span>
                  </div>
                  <h4 className="text-white font-bold text-base sm:text-lg drop-shadow-sm">
                    Ayam Geprek Sambel Ijo Al-Fariz
                  </h4>
                  <p className="text-gray-200 text-xs mt-1 drop-shadow-sm">
                    Samping Mie Ayam & Dekat Lawson Jl. Surya Kencana Pamulang
                  </p>
                </div>
              </div>

              {/* Quick note card */}
              <div className="mt-4 p-4 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between text-xs text-amber-100">
                <span>🛵 Tersedia pesan bawa pulang (Take Away) & Makan di Tempat</span>
                <span className="text-[#F5C518] font-bold">100% Halal</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
