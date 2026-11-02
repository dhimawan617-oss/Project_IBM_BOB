# 🍛 Warung Nusantara

Aplikasi web sistem pemesanan makanan berbasis **HTML, CSS, dan JavaScript murni** (tanpa framework backend) yang menampilkan menu khas **Sunda** dan **Jawa Tengah**, dilengkapi fitur **Gacha Menu** untuk memilih menu secara acak sesuai budget.

---

## 📁 Struktur File

```
warung-nusantara/
├── index.html          # Halaman utama (markup & modal)
├── style.css           # Styling tambahan (komplemen Tailwind CSS)
├── script.js           # Seluruh logika aplikasi (Storage, Data, Render, Gacha)
├── *.jpg               # Foto menu makanan lokal
└── README.md           # Dokumentasi ini
```

---

## 🚀 Cara Menjalankan

Aplikasi ini adalah **static web app** — tidak memerlukan server, backend, atau instalasi apapun.

### Cara 1 — Buka Langsung di Browser
1. Buka folder `warung-nusantara/`
2. Klik dua kali file **`index.html`**
3. Aplikasi langsung berjalan di browser

> ⚠️ Beberapa browser (seperti Chrome) memblokir loading gambar lokal via `file://` karena kebijakan CORS. Gunakan Cara 2 agar gambar tampil dengan benar.

### Cara 2 — Menggunakan Live Server (Disarankan)

**Dengan VS Code:**
1. Install ekstensi **Live Server** (Ritwick Dey) dari Marketplace VS Code
2. Klik kanan pada `index.html` → **"Open with Live Server"**
3. Browser akan otomatis membuka `http://127.0.0.1:5500`

**Dengan Python (jika sudah terinstall):**
```bash
# Python 3
cd warung-nusantara
python -m http.server 8000
```
Lalu buka `http://localhost:8000` di browser.

**Dengan Node.js:**
```bash
npx serve warung-nusantara
```

---

## 🗂️ Fitur Utama

### 1. 📋 Halaman Menu
- Menampilkan seluruh daftar menu dalam grid kartu
- Setiap kartu berisi foto, nama, kategori, asal daerah, harga, dan status ketersediaan
- **Filter Kategori:** Semua / Makanan / Minuman / Dessert
- **Filter Daerah:** Semua / Sunda / Jawa Tengah
- **Pencarian** real-time berdasarkan nama menu
- Tambah / Edit / Hapus menu melalui modal form
- Tandai menu sebagai **Tersedia** atau **Habis**

### 2. 🛒 Keranjang Belanja
- Sidebar drawer yang muncul dari sisi kanan
- Tambah menu ke keranjang dengan tombol **🛒 Pesan**
- Ubah jumlah (qty) atau hapus item langsung dari keranjang
- Menampilkan total harga secara real-time
- Badge angka di ikon keranjang menunjukkan jumlah item

### 3. 🧾 Checkout & Pesanan
- Isi nama pemesan, nomor meja, dan catatan opsional
- Setelah konfirmasi, pesanan masuk ke tab **Pesanan**
- Status pesanan: **Menunggu → Diproses → Selesai**
- Filter pesanan berdasarkan status
- Semua data tersimpan di `localStorage` browser

### 4. 🎰 Gacha Menu *(fitur unggulan)*
> Pilih menu secara acak sesuai budget — cocok untuk pelanggan yang bingung memilih!

---

## 🎰 Sistem Gacha — Penjelasan Lengkap

### Cara Mengakses
- Klik tombol **🎰 Gacha Menu** di navbar (desktop)
- Atau klik **🎰 Gacha** di pojok kanan tab bar (mobile)

### Parameter Gacha

| Parameter | Pilihan | Keterangan |
|---|---|---|
| **Budget Maksimal** | Bebas (Rp) | Batas total harga yang boleh dipilih |
| **Mode Gacha** | Satu Menu Acak / Paket Lengkap | Lihat penjelasan di bawah |
| **Asal Daerah** | Campur / Sunda / Jawa Tengah | Filter asal daerah menu |
| **Sertakan Dessert** | ✓ / ✗ *(hanya mode Paket)* | Tambahkan dessert dalam paket |

---

### Mode 1 — Satu Menu Acak (`gachaOne`)

**Cara kerja:**
1. Filter semua menu yang **tersedia** (`available: true`) dan **harga ≤ budget**
2. Jika ada filter daerah, saring sesuai daerah yang dipilih
3. Daftar menu di-*shuffle* menggunakan algoritma **Fisher-Yates** (O(n))
4. Ambil satu menu pertama dari hasil shuffle

```
Pool → Filter (tersedia + harga ≤ budget + daerah) → Shuffle → Ambil [0]
```

---

### Mode 2 — Paket Lengkap (`gachaPaket`)

**Cara kerja:**
1. Filter semua menu yang tersedia dan sesuai daerah
2. Pisahkan ke dalam 3 pool: **Makanan**, **Minuman**, dan **Dessert**
3. Masing-masing pool di-*shuffle*
4. Iterasi semua kombinasi (Makanan × Minuman [× Dessert]) hingga **maks 500 iterasi** untuk menghindari komputasi berat
5. Kumpulkan semua kombinasi yang **total harganya ≤ budget**
6. Shuffle daftar kombinasi valid, ambil kombinasi pertama

```
Pool Makanan × Pool Minuman [× Pool Dessert]
  → Kombinasi valid (total ≤ budget)
  → Shuffle → Ambil [0]
```

> **Batasan 500 iterasi** dipasang agar performa tetap cepat meski jumlah menu banyak, sambil tetap menghasilkan variasi yang cukup acak.

---

### Animasi Gacha

Saat tombol **Putar Gacha!** ditekan, animasi berjalan dalam 3 fase:

| Fase | Durasi | Keterangan |
|---|---|---|
| **Berputar cepat** | 0 – 1800 ms | Reel berputar dengan nama-nama menu acak |
| **Melambat** | 1800 – 2600 ms | Putaran makin pelan (CSS transition) |
| **Tampil hasil** | setelah 2600 ms | Kartu hasil muncul dengan info harga & sisa budget |

---

### Kondisi Budget Terlalu Kecil

Jika tidak ada kombinasi menu yang memenuhi budget, sistem menampilkan pesan **"Budget terlalu kecil"** beserta informasi harga minimum:
- **Mode Single:** menampilkan nama dan harga menu termurah yang tersedia
- **Mode Paket:** menampilkan estimasi harga paket termurah (min harga makanan + min harga minuman [+ min harga dessert])

---

### Hasil Gacha → Keranjang

Setelah hasil muncul, pengguna dapat:
- Klik **🔄 Gacha Ulang** — ulangi gacha dengan parameter yang sama
- Klik **🛒 Tambah ke Keranjang** — semua item hasil gacha langsung masuk ke keranjang

---

## 💾 Penyimpanan Data

Seluruh data disimpan di **`localStorage`** browser dengan tiga kunci:

| Key | Isi |
|---|---|
| `wn_menus` | Daftar menu (di-seed otomatis saat pertama buka) |
| `wn_cart` | Item di keranjang belanja |
| `wn_orders` | Riwayat pesanan |

> Data bersifat **persisten** — tetap ada meskipun browser ditutup. Untuk reset, buka *DevTools → Application → Local Storage → Clear*.

Saat aplikasi dibuka, sistem secara otomatis **mensinkronkan `imageUrl`** dari `SEED_MENUS` ke data yang tersimpan, sehingga perubahan foto pada kode langsung berlaku tanpa perlu clear localStorage manual.

---

## 🍽️ Daftar Menu Tersedia

### Makanan — Sunda
| Menu | Harga |
|---|---|
| Nasi Timbel | Rp 28.000 |
| Ayam Goreng Lalapan | Rp 32.000 |
| Karedok | Rp 18.000 |
| Soto Bandung | Rp 25.000 |
| Batagor | Rp 20.000 |

### Makanan — Jawa Tengah
| Menu | Harga |
|---|---|
| Gudeg | Rp 27.000 |
| Soto Kudus | Rp 23.000 |
| Nasi Liwet Solo | Rp 30.000 |
| Tahu Gimbal | Rp 19.000 |
| Sate Ayam Jateng | Rp 35.000 |

### Minuman
| Menu | Asal | Harga |
|---|---|---|
| Es Cendol | Sunda | Rp 12.000 |
| Wedang Ronde | Jawa Tengah | Rp 13.000 |
| Es Doger | Sunda | Rp 14.000 |

### Dessert
| Menu | Asal | Harga |
|---|---|---|
| Klepon | Jawa Tengah | Rp 10.000 |
| Getuk Lindri | Jawa Tengah | Rp 9.000 |
| Wajit Cililin | Sunda | Rp 11.000 |

---

## 🛠️ Teknologi yang Digunakan

| Teknologi | Kegunaan |
|---|---|
| HTML5 | Struktur halaman & modal |
| Tailwind CSS (CDN) | Utility-first styling |
| CSS kustom (`style.css`) | Komponen khusus (kartu, badge, animasi gacha) |
| Vanilla JavaScript | Logika penuh tanpa framework |
| localStorage API | Penyimpanan data di sisi klien |

---

## 👤 Informasi Proyek

- **Mata Kuliah:** Capstone Project — Semester 3  
- **Tema:** Sistem Pemesanan Makanan Tradisional Nusantara
