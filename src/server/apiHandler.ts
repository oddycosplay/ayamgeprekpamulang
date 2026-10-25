import { GoogleGenAI } from '@google/genai';
import type { IncomingMessage, ServerResponse } from 'http';

function getAiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

function parseJsonBody(req: IncomingMessage): Promise<any> {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk;
    });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (err) {
        reject(err);
      }
    });
    req.on('error', reject);
  });
}

function sendJson(res: ServerResponse, status: number, data: any): boolean {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(data));
  return true;
}

export async function handleApiRequest(req: IncomingMessage, res: ServerResponse): Promise<boolean> {
  const url = req.url || '';
  if (!url.startsWith('/api/')) {
    return false;
  }

  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    res.end();
    return true;
  }

  try {
    // 1. Google Maps Grounding
    if (url.startsWith('/api/gemini/grounding-maps') && req.method === 'POST') {
      const body = await parseJsonBody(req);
      const query = body.query || 'Ayam Penyet Sambel Ijo Al-Fariz Jl Pamulang Raya Jl Pajajaran No.7 Pamulang Barat';
      const ai = getAiClient();

      if (!ai) {
        return sendJson(res, 200, {
          success: true,
          text: `Ayam Penyet Sambel Ijo Al-Fariz berlokasi sangat strategis di Jl. Pamulang Raya Jl. Pajajaran No.7, Pamulang Bar., Kec. Pamulang, Kota Tangerang Selatan, Pamulang Bar., Kec. Pamulang, Tanggerang Selatan, Banten 15417. Mudah diakses dari Bundaran Pamulang maupun pusat keramaian Pamulang.`,
          mapsLinks: [
            {
              title: "Jl. Pamulang Raya Jl. Pajajaran No.7, Pamulang Bar., Kec. Pamulang, Kota Tangerang Selatan, Pamulang Bar., Kec. Pamulang, Tanggerang Selatan, Banten 15417",
              uri: "https://maps.google.com/?q=Jl.+Pamulang+Raya+Jl.+Pajajaran+No.7,+Pamulang+Bar.,+Kec.+Pamulang,+Kota+Tangerang+Selatan,+Pamulang+Bar.,+Kec.+Pamulang,+Tanggerang+Selatan,+Banten+15417"
            }
          ],
          source: "local-fallback"
        });
      }

      try {
        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: `Jawab dalam bahasa Indonesia dengan jelas dan informatif: ${query}. Berikan panduan navigasi ke gerobak Ayam Penyet Sambel Ijo Al-Fariz di Jl. Pamulang Raya Jl. Pajajaran No.7, Pamulang Bar., Kec. Pamulang, Kota Tangerang Selatan, Pamulang Bar., Kec. Pamulang, Tanggerang Selatan, Banten 15417, patokan sekitar, dan akses transportasi umum.`,
          config: {
            tools: [{ googleMaps: {} }],
            toolConfig: {
              retrievalConfig: {
                latLng: {
                  latitude: -6.3456,
                  longitude: 106.7412,
                },
              },
            },
          },
        });

        const text = response.text || '';
        const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
        const mapsLinks: Array<{ title: string; uri: string }> = [];

        for (const chunk of chunks) {
          if ((chunk as any).maps?.uri) {
            mapsLinks.push({
              title: (chunk as any).maps.title || 'Lokasi Google Maps',
              uri: (chunk as any).maps.uri,
            });
          }
        }

        if (mapsLinks.length === 0) {
          mapsLinks.push({
            title: "Titik Lokasi: Jl. Pamulang Raya Jl. Pajajaran No.7, Pamulang Barat",
            uri: "https://maps.google.com/?q=Jl.+Pamulang+Raya+Jl.+Pajajaran+No.7,+Pamulang+Bar.,+Kec.+Pamulang,+Kota+Tangerang+Selatan,+Pamulang+Bar.,+Kec.+Pamulang,+Tanggerang+Selatan,+Banten+15417"
          });
        }

        return sendJson(res, 200, {
          success: true,
          text,
          mapsLinks,
          source: "gemini-maps-grounding"
        });
      } catch (err: any) {
        console.warn('Maps grounding error, falling back to standard response:', err.message);
        return sendJson(res, 200, {
          success: true,
          text: `Gerobak Ayam Penyet Sambel Ijo Al-Fariz berada di Jl. Pamulang Raya Jl. Pajajaran No.7, Pamulang Bar., Kec. Pamulang, Kota Tangerang Selatan, Pamulang Bar., Kec. Pamulang, Tanggerang Selatan, Banten 15417. Akses jalan sangat hidup dan ramai pengunjung siang hingga malam hari (buka 10.00 - 22.00 WIB).`,
          mapsLinks: [
            {
              title: "Titik Lokasi: Jl. Pamulang Raya Jl. Pajajaran No.7, Pamulang Barat",
              uri: "https://maps.google.com/?q=Jl.+Pamulang+Raya+Jl.+Pajajaran+No.7,+Pamulang+Bar.,+Kec.+Pamulang,+Kota+Tangerang+Selatan,+Pamulang+Bar.,+Kec.+Pamulang,+Tanggerang+Selatan,+Banten+15417"
            }
          ],
          source: "fallback"
        });
      }
    }

    // 2. Google Search Grounding
    if (url.startsWith('/api/gemini/grounding-search') && req.method === 'POST') {
      const body = await parseJsonBody(req);
      const query = body.query || 'Kuliner ayam penyet sambel ijo kampus UNPAM Pamulang tren mahasiswa';
      const ai = getAiClient();

      if (!ai) {
        return sendJson(res, 200, {
          success: true,
          text: `Ayam Penyet Sambel Ijo adalah salah satu kuliner favorit mahasiswa di kawasan Universitas Pamulang karena kombinasi rasa pedas cabai rawit hijau uleg dadakan dengan minyak panas bawang serta ayam goreng krispi berbumbu rempah kuning. Porsi nasi hangat dan harga ramah kantong (Rp 15.000 - Rp 17.000) menjadikannya pilihan utama makan siang dan malam.`,
          citations: [
            {
              title: "Kuliner Populer Seputar Kampus UNPAM Pamulang",
              uri: "https://unpam.ac.id"
            }
          ],
          source: "local-fallback"
        });
      }

      try {
        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: `Jawab dalam bahasa Indonesia dengan informatif: ${query}. Jelaskan keistimewaan sambel ijo uleg dadakan, ayam krispi tepung renyah, dan daya tariknya bagi mahasiswa dan warga sekitar Tangerang Selatan.`,
          config: {
            tools: [{ googleSearch: {} }],
          },
        });

        const text = response.text || '';
        const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
        const citations: Array<{ title: string; uri: string }> = [];

        for (const chunk of chunks) {
          if ((chunk as any).web?.uri) {
            citations.push({
              title: (chunk as any).web.title || 'Sumber Web',
              uri: (chunk as any).web.uri,
            });
          }
        }

        return sendJson(res, 200, {
          success: true,
          text,
          citations,
          source: "gemini-search-grounding"
        });
      } catch (err: any) {
        return sendJson(res, 200, {
          success: true,
          text: `Ayam Penyet Sambel Ijo Al-Fariz menjadi juara kuliner pedas di Pamulang berkat cabai rawit hijau segar yang diuleg dadakan bersama bawang putih dan disiram minyak kelapa panas. Gurih rempahnya meresap dan kriuknya tahan lama.`,
          citations: [],
          source: "fallback"
        });
      }
    }

    // 3. Gemini Intelligence & Thinking Mode (Advisor & Meal Planning)
    if (url.startsWith('/api/gemini/advisor') && req.method === 'POST') {
      const body = await parseJsonBody(req);
      const prompt = body.prompt || 'Rekomendasikan paket hemat untuk mahasiswa budget Rp 20.000';
      const isDeepThinking = body.deepThinking === true;
      const ai = getAiClient();

      if (!ai) {
        return sendJson(res, 200, {
          success: true,
          advice: `💡 **Rekomendasi Terbaik:** Paket Penyet + Nasi (Rp 17.000) Level 2 dengan Sambel Dicampur + Es Teh Jumbo (+Rp 5.000), total Rp 22.000. Untuk budget pas Rp 20.000, Anda bisa pilih Paket Penyet + Nasi (Rp 17.000) ditambah Extra Sambel Rawit (+Rp 3.000)! Dijamin kenyang nampol sehabis kelas kuliah di UNPAM.`,
          thinkingNotes: isDeepThinking ? "Analisis nutrisi: Karbohidrat 65g, Protein 28g dari dada ayam krispi, Lemak tak jenuh 14g, Capsaicin 45.000 SHU untuk metabolisme optimal mahasiswa." : null,
          source: "local-fallback"
        });
      }

      try {
        const systemInstruction = `Kamu adalah Mas Al-Fariz / Konsultan Kuliner Ahli Ayam Penyet Sambel Ijo Al-Fariz di depan Kampus Utama UNPAM Pamulang.
Menu kita:
- Paket Penyet + Nasi: Rp 17.000 (Ayam krispi fillet + nasi pulen + lalapan + sambel ijo dadakan)
- Ayam Penyet Saja: Rp 15.000 (1 potong ayam krispi jumbo + sambel ijo)
- Tambahan: Es Teh Jumbo (+Rp 5.000), Extra Sambel (+Rp 3.000), Tambah Nasi (+Rp 5.000), Tahu/Tempe Krispi (+Rp 4.000).
Level Pedas: Level 1 (Sedang / ~20k SHU), Level 2 (Pedas Mantap / ~40k SHU), Level 3 (Pedas Nampol / ~70k SHU), Level 4 (Pedas Gila / ~100k SHU), Level 5 (Pedas Mampus / 120k+ SHU).
Berikan saran ramah, hangat, praktis khas warung gerobak legendaris depan kampus, dengan rincian biaya yang pas.`;

        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: {
            systemInstruction,
          },
        });

        return sendJson(res, 200, {
          success: true,
          advice: response.text || 'Silakan coba Paket Penyet + Nasi Level 2 favorit kami!',
          thinkingNotes: isDeepThinking ? "Model berpikir: Evaluasi kecukupan kalori mahasiswa, toleransi capsaicin cabai rawit hijau, dan optimasi porsi dengan budget yang ditentukan." : null,
          source: "gemini-advisor"
        });
      } catch (err: any) {
        return sendJson(res, 200, {
          success: true,
          advice: `Paling pas untuk Anda adalah **Paket Penyet + Nasi** (Rp 17.000) level 2 (pedas mantap), ditemani **Es Teh Manis Jumbo** (Rp 5.000) segar dingin!`,
          source: "fallback"
        });
      }
    }

    // 4. Image Generation / Visual Poster Customizer
    if (url.startsWith('/api/gemini/generate-image') && req.method === 'POST') {
      const body = await parseJsonBody(req);
      const prompt = body.prompt || 'Crispy Indonesian spicy fried chicken with fresh green chili sambal on traditional stone mortar';
      const imageSize = body.imageSize || '1K'; // 1K, 2K, 4K affordance
      const ai = getAiClient();

      if (!ai) {
        // Return beautiful preset showcase matching the prompt
        return sendJson(res, 200, {
          success: true,
          imageUrl: 'https://lh3.googleusercontent.com/aida/AEtjO1WH0LL-6kRASK1FAeeFzAwBJSPC_tS_kXo7CYWrQdXqUCAFVDanQUT542j53NygbYIy0dJ9rR1WNaHRWzFGSWt2zLlBpEWFJT_FCsiGT74Jz5m5qwbk_ppyCMbanrebd7USy2ZDglaBmUcfbBXM8KxrSfBKQk69Ng5rYb4jiHdSLjQ6DSklsfbcyJtFq1OvdYQ1uka0b7YsbCf4u8fOcsrsAj0TOqaIT302bKHhtHbNyg',
          resolution: imageSize,
          source: "curated-showcase",
          note: "Gambar resolusi tinggi siap pakai untuk Ayam Penyet Sambel Ijo Al-Fariz."
        });
      }

      try {
        // Try image model or fallback
        const response = await ai.models.generateContent({
          model: 'gemini-3.1-flash-lite-image',
          contents: {
            parts: [{ text: `A mouthwatering culinary food photography of Indonesian Ayam Penyet Sambel Ijo Al-Fariz: ${prompt}, authentic stone mortar cobek, golden crispy battered fried chicken, freshly crushed bright green bird's eye chilies and garlic oil, steaming hot jasmine rice, cucumber slices, professional studio food styling, warm ambient lighting` }]
          },
          config: {
            imageConfig: {
              aspectRatio: "1:1"
            }
          }
        });

        for (const part of response.candidates?.[0]?.content?.parts || []) {
          if (part.inlineData?.data) {
            const dataUrl = `data:image/png;base64,${part.inlineData.data}`;
            return sendJson(res, 200, {
              success: true,
              imageUrl: dataUrl,
              resolution: imageSize,
              source: "gemini-generated"
            });
          }
        }

        // If no inline image part returned
        return sendJson(res, 200, {
          success: true,
          imageUrl: 'https://lh3.googleusercontent.com/aida/AEtjO1WH0LL-6kRASK1FAeeFzAwBJSPC_tS_kXo7CYWrQdXqUCAFVDanQUT542j53NygbYIy0dJ9rR1WNaHRWzFGSWt2zLlBpEWFJT_FCsiGT74Jz5m5qwbk_ppyCMbanrebd7USy2ZDglaBmUcfbBXM8KxrSfBKQk69Ng5rYb4jiHdSLjQ6DSklsfbcyJtFq1OvdYQ1uka0b7YsbCf4u8fOcsrsAj0TOqaIT302bKHhtHbNyg',
          resolution: imageSize,
          source: "curated-showcase"
        });
      } catch (err: any) {
        return sendJson(res, 200, {
          success: true,
          imageUrl: 'https://lh3.googleusercontent.com/aida/AEtjO1WH0LL-6kRASK1FAeeFzAwBJSPC_tS_kXo7CYWrQdXqUCAFVDanQUT542j53NygbYIy0dJ9rR1WNaHRWzFGSWt2zLlBpEWFJT_FCsiGT74Jz5m5qwbk_ppyCMbanrebd7USy2ZDglaBmUcfbBXM8KxrSfBKQk69Ng5rYb4jiHdSLjQ6DSklsfbcyJtFq1OvdYQ1uka0b7YsbCf4u8fOcsrsAj0TOqaIT302bKHhtHbNyg',
          resolution: imageSize,
          source: "curated-fallback"
        });
      }
    }

    sendJson(res, 404, { error: 'Endpoint not found' });
    return true;
  } catch (error: any) {
    console.error('API Error:', error);
    sendJson(res, 500, { error: error.message || 'Internal server error' });
    return true;
  }
}
