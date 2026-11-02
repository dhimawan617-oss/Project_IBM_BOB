/**
 * ═══════════════════════════════════════════════════════════
 * Warung Nusantara — script.js
 * Sistem Pemesanan Makanan — Sunda & Jawa Tengah
 *
 * Modul:
 *   1. STORAGE  — abstraksi localStorage
 *   2. DATA     — seed data & CRUD helpers
 *   3. RENDER   — semua fungsi render ke DOM
 *   4. HANDLERS — event listeners & logika UI
 *   5. GACHA    — algoritma gacha dengan batasan budget
 *   6. INIT     — inisialisasi aplikasi
 * ═══════════════════════════════════════════════════════════
 */

'use strict';

/* ╔═════════════════════════════════════════════════
   ║  1. STORAGE — Abstraksi localStorage
   ╚═════════════════════════════════════════════════ */

const KEYS = {
  MENUS:  'wn_menus',
  CART:   'wn_cart',
  ORDERS: 'wn_orders',
};

const Storage = {
  get(key)        { try { return JSON.parse(localStorage.getItem(key)) || []; } catch { return []; } },
  set(key, value) { localStorage.setItem(key, JSON.stringify(value)); },
};

/* ╔═════════════════════════════════════════════════
   ║  2. DATA — Seed Data & CRUD Helpers
   ╚═════════════════════════════════════════════════ */

/** Data menu awal yang di-seed saat pertama kali aplikasi dibuka */
const SEED_MENUS = [
  // ── Sunda ──────────────────────────────────────────────
  {
    id: 'mn-001', name: 'Nasi Timbel', category: 'Makanan', origin: 'Sunda',
    price: 28000, available: true,
    description: 'Nasi pulen dibungkus daun pisang, disajikan dengan lauk pauk khas Sunda.',
    imageUrl: 'Nasi-Timbel.jpg',
  },
  {
    id: 'mn-002', name: 'Ayam Goreng Lalapan', category: 'Makanan', origin: 'Sunda',
    price: 32000, available: true,
    description: 'Ayam kampung goreng crispy, disajikan dengan lalapan segar dan sambal terasi.',
    imageUrl: 'Ayam-lalapan.jpg',
  },
  {
    id: 'mn-003', name: 'Karedok', category: 'Makanan', origin: 'Sunda',
    price: 18000, available: true,
    description: 'Salad sayuran mentah segar dengan bumbu kacang pedas khas Sunda.',
    imageUrl: 'karedok.jpg',
  },
  {
    id: 'mn-004', name: 'Soto Bandung', category: 'Makanan', origin: 'Sunda',
    price: 25000, available: true,
    description: 'Soto segar berkuah bening dengan daging sapi, lobak, dan kedelai goreng.',
    imageUrl: 'Soto-Bandung.jpg',
  },
  {
    id: 'mn-005', name: 'Batagor', category: 'Makanan', origin: 'Sunda',
    price: 20000, available: true,
    description: 'Bakso tahu goreng renyah dengan siraman bumbu kacang dan kecap.',
    imageUrl: 'Batagor-Bandung.jpg',
  },
  {
    id: 'mn-006', name: 'Es Cendol', category: 'Minuman', origin: 'Sunda',
    price: 12000, available: true,
    description: 'Minuman segar dari tepung beras, santan, dan gula merah cair.',
    imageUrl: 'Es-Cendol.jpg',
  },
  // ── Jawa Tengah ────────────────────────────────────────
  {
    id: 'mn-007', name: 'Gudeg', category: 'Makanan', origin: 'Jawa Tengah',
    price: 27000, available: true,
    description: 'Masakan khas Yogyakarta dari nangka muda dengan kuah santan manis gurih.',
    imageUrl: 'Gudeg.jpg',
  },
  {
    id: 'mn-008', name: 'Soto Kudus', category: 'Makanan', origin: 'Jawa Tengah',
    price: 23000, available: true,
    description: 'Soto berkuah bening khas Kudus dengan daging kerbau dan tauge.',
    imageUrl: 'soto-kudus.jpg',
  },
  {
    id: 'mn-009', name: 'Nasi Liwet Solo', category: 'Makanan', origin: 'Jawa Tengah',
    price: 30000, available: true,
    description: 'Nasi gurih dimasak dengan santan, disajikan dengan ayam, labu siam, dan sambal goreng.',
    imageUrl: 'nasi-liwet-solo.jpg',
  },
  {
    id: 'mn-010', name: 'Tahu Gimbal', category: 'Makanan', origin: 'Jawa Tengah',
    price: 19000, available: true,
    description: 'Tahu goreng dengan gimbal udang, lontong, dan bumbu kacang khas Semarang.',
    imageUrl: 'timbal-gimbal.jpg',
  },
  {
    id: 'mn-011', name: 'Sate Ayam Jateng', category: 'Makanan', origin: 'Jawa Tengah',
    price: 35000, available: true,
    description: 'Sate ayam dengan bumbu kacang legit khas Jawa Tengah, disajikan dengan lontong.',
    imageUrl: 'https://images.unsplash.com/photo-1529563021893-cc83c992d75d?w=600&q=80',
  },
  {
    id: 'mn-012', name: 'Wedang Ronde', category: 'Minuman', origin: 'Jawa Tengah',
    price: 13000, available: true,
    description: 'Minuman hangat jahe dengan bola-bola ketan berisi kacang tanah.',
    imageUrl: 'wedang-ronde.jpg',
  },
  // ── Dessert ────────────────────────────────────────────
  {
    id: 'mn-013', name: 'Klepon', category: 'Dessert', origin: 'Jawa Tengah',
    price: 10000, available: true,
    description: 'Bola-bola ketan hijau berisi gula merah cair, dibalut parutan kelapa.',
    imageUrl: 'Klepon.jpg',
  },
  {
    id: 'mn-014', name: 'Getuk Lindri', category: 'Dessert', origin: 'Jawa Tengah',
    price: 9000, available: true,
    description: 'Kue tradisional dari singkong yang dihaluskan dengan kelapa dan gula merah.',
    imageUrl: 'getuk-lindri.jpg',
  },
  {
    id: 'mn-015', name: 'Wajit Cililin', category: 'Dessert', origin: 'Sunda',
    price: 11000, available: true,
    description: 'Kue manis dari ketan, gula merah, dan kelapa khas Cililin, Jawa Barat.',
    imageUrl: 'wajit-cililin.jpg',
  },
  {
    id: 'mn-016', name: 'Es Doger', category: 'Minuman', origin: 'Sunda',
    price: 14000, available: true,
    description: 'Es serut khas Bandung dengan tape, alpukat, kelapa muda, dan sirup merah.',
    imageUrl: 'Es-Doger.jpg',
  },
];

/** Buat ID unik sederhana */
function generateId() {
  return 'mn-' + Date.now().toString(36) + Math.random().toString(36).slice(2, 5);
}

/** CRUD helpers */
const MenuData = {
  getAll()             { return Storage.get(KEYS.MENUS); },
  save(menus)          { Storage.set(KEYS.MENUS, menus); },
  add(menu)            { const m = this.getAll(); m.push(menu); this.save(m); },
  update(updated)      { this.save(this.getAll().map(m => m.id === updated.id ? updated : m)); },
  delete(id)           { this.save(this.getAll().filter(m => m.id !== id)); },
  getById(id)          { return this.getAll().find(m => m.id === id) || null; },
};

const CartData = {
  getAll()             { return Storage.get(KEYS.CART); },
  save(cart)           { Storage.set(KEYS.CART, cart); },
  addItem(menuItem)    {
    const cart = this.getAll();
    const existing = cart.find(c => c.menuId === menuItem.id);
    if (existing) { existing.qty += 1; }
    else { cart.push({ menuId: menuItem.id, name: menuItem.name, price: menuItem.price, qty: 1 }); }
    this.save(cart);
  },
  removeItem(menuId)   { this.save(this.getAll().filter(c => c.menuId !== menuId)); },
  updateQty(menuId, qty) {
    if (qty <= 0) { this.removeItem(menuId); return; }
    this.save(this.getAll().map(c => c.menuId === menuId ? { ...c, qty } : c));
  },
  clear()              { this.save([]); },
  getTotal()           { return this.getAll().reduce((sum, c) => sum + c.price * c.qty, 0); },
  getCount()           { return this.getAll().reduce((sum, c) => sum + c.qty, 0); },
};

const OrderData = {
  getAll()             { return Storage.get(KEYS.ORDERS); },
  save(orders)         { Storage.set(KEYS.ORDERS, orders); },
  add(order)           { const o = this.getAll(); o.unshift(order); this.save(o); },
  updateStatus(id, status) {
    this.save(this.getAll().map(o => o.id === id ? { ...o, status } : o));
  },
};

/* ╔═════════════════════════════════════════════════
   ║  3. RENDER — Semua fungsi render ke DOM
   ╚═════════════════════════════════════════════════ */

/** Format angka ke format Rupiah */
function formatRupiah(num) {
  return 'Rp ' + num.toLocaleString('id-ID');
}

/** Emoji representasi per kategori */
function categoryEmoji(category) {
  const map = { Makanan: '🍽️', Minuman: '🥤', Dessert: '🍡' };
  return map[category] || '🍴';
}

/**
 * Render grid kartu menu berdasarkan filter & pencarian aktif
 */
function renderMenus() {
  const grid        = document.getElementById('menu-grid');
  const search      = document.getElementById('search-input').value.toLowerCase().trim();
  const catFilter   = State.filters.category;
  const origFilter  = State.filters.origin;

  let menus = MenuData.getAll();

  // Terapkan filter
  if (catFilter  !== 'all') menus = menus.filter(m => m.category === catFilter);
  if (origFilter !== 'all') menus = menus.filter(m => m.origin   === origFilter);
  if (search)               menus = menus.filter(m => m.name.toLowerCase().includes(search));

  // Empty state
  if (menus.length === 0) {
    grid.innerHTML = `
      <div class="empty-state sm:col-span-2 lg:col-span-3 xl:col-span-4">
        <div class="empty-icon">🍽️</div>
        <div class="empty-title">Tidak ada menu ditemukan</div>
        <div class="empty-desc">Coba ubah filter atau tambah menu baru.</div>
      </div>`;
    return;
  }

  grid.innerHTML = menus.map(menu => `
    <div class="menu-card" data-id="${menu.id}">
      ${menu.imageUrl
        ? `<img src="${menu.imageUrl}" alt="${menu.name}" class="menu-card-img" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'" /><div class="menu-card-placeholder" style="display:none">${categoryEmoji(menu.category)}</div>`
        : `<div class="menu-card-placeholder">${categoryEmoji(menu.category)}</div>`
      }
      <div class="p-4 flex flex-col flex-1">
        <div class="flex items-start justify-between gap-2 mb-2">
          <h3 class="font-bold text-gray-800 text-sm leading-snug flex-1">${menu.name}</h3>
          <span class="${menu.available ? 'badge-available' : 'badge-unavailable'} shrink-0">
            ${menu.available ? '✅ Tersedia' : '❌ Habis'}
          </span>
        </div>
        <div class="flex flex-wrap gap-1 mb-2">
          <span class="badge-category">${categoryEmoji(menu.category)} ${menu.category}</span>
          <span class="badge-origin">📍 ${menu.origin}</span>
        </div>
        ${menu.description ? `<p class="text-xs text-gray-500 mb-3 flex-1 leading-relaxed">${menu.description}</p>` : '<div class="flex-1"></div>'}
        <div class="flex items-center justify-between mt-auto pt-2 border-t border-gray-100">
          <span class="font-bold text-primary text-base">${formatRupiah(menu.price)}</span>
          <div class="flex gap-1">
            <button onclick="handleToggleAvailable('${menu.id}')"
              class="p-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 text-gray-500 transition-all text-xs"
              title="${menu.available ? 'Tandai Habis' : 'Tandai Tersedia'}">
              ${menu.available ? '🚫' : '✅'}
            </button>
            <button onclick="handleEditMenu('${menu.id}')"
              class="p-1.5 rounded-lg border border-gray-200 hover:bg-blue-50 text-blue-600 transition-all text-xs"
              title="Edit">✏️</button>
            <button onclick="handleDeleteMenu('${menu.id}')"
              class="p-1.5 rounded-lg border border-gray-200 hover:bg-red-50 text-red-500 transition-all text-xs"
              title="Hapus">🗑️</button>
            <button onclick="handleAddToCart('${menu.id}', event)"
              class="btn-pesan relative overflow-hidden px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all shadow-sm
                     ${menu.available
                       ? 'bg-accent hover:bg-accent-dark text-white'
                       : 'bg-gray-200 text-gray-400 cursor-not-allowed'}"
              ${!menu.available ? 'disabled' : ''}
              title="Tambah ke Keranjang">
              🛒 Pesan
            </button>
          </div>
        </div>
      </div>
    </div>
  `).join('');
}

/**
 * Render isi keranjang (sidebar drawer)
 */
function renderCart() {
  const container = document.getElementById('cart-items');
  const cart      = CartData.getAll();

  if (cart.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">🛒</div>
        <div class="empty-title">Keranjang Kosong</div>
        <div class="empty-desc">Belum ada menu yang dipesan.</div>
      </div>`;
  } else {
    container.innerHTML = cart.map(item => `
      <div class="bg-gray-50 rounded-xl p-3 flex items-start gap-3">
        <div class="flex-1 min-w-0">
          <p class="font-semibold text-sm text-gray-800 leading-snug truncate">${item.name}</p>
          <p class="text-primary font-bold text-sm">${formatRupiah(item.price)}</p>
        </div>
        <div class="flex items-center gap-1 shrink-0">
          <button onclick="handleCartQty('${item.menuId}', ${item.qty - 1})"
            class="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center
                   hover:bg-red-50 hover:border-red-300 text-gray-600 font-bold text-sm transition-all">−</button>
          <span class="w-6 text-center font-bold text-sm">${item.qty}</span>
          <button onclick="handleCartQty('${item.menuId}', ${item.qty + 1})"
            class="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center
                   hover:bg-green-50 hover:border-green-300 text-gray-600 font-bold text-sm transition-all">+</button>
          <button onclick="handleCartRemove('${item.menuId}')"
            class="w-7 h-7 rounded-full flex items-center justify-center hover:bg-red-100 text-red-400 transition-all ml-0.5">✕</button>
        </div>
        <p class="text-xs font-bold text-gray-700 shrink-0 self-center">${formatRupiah(item.price * item.qty)}</p>
      </div>
    `).join('');
  }

  document.getElementById('cart-total').textContent = formatRupiah(CartData.getTotal());
  renderCartBadge();
}

/** Render badge jumlah item di ikon keranjang */
function renderCartBadge() {
  const badge = document.getElementById('cart-badge');
  const count = CartData.getCount();
  if (count > 0) {
    badge.textContent = count > 99 ? '99+' : count;
    badge.classList.remove('hidden');
    badge.classList.add('flex');
  } else {
    badge.classList.add('hidden');
    badge.classList.remove('flex');
  }
}

/**
 * Render daftar pesanan berdasarkan filter status
 */
function renderOrders() {
  const container  = document.getElementById('orders-list');
  const statusFilter = State.orderFilter;
  let orders = OrderData.getAll();

  if (statusFilter !== 'all') orders = orders.filter(o => o.status === statusFilter);

  if (orders.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">📦</div>
        <div class="empty-title">Belum ada pesanan</div>
        <div class="empty-desc">Pesanan akan muncul di sini setelah checkout.</div>
      </div>`;
    return;
  }

  container.innerHTML = orders.map(order => `
    <div class="order-card">
      <div class="flex items-start justify-between gap-3 mb-3">
        <div>
          <p class="font-bold text-gray-800">${order.customerName}</p>
          <p class="text-xs text-gray-500">🪑 ${order.tableNumber} · ${new Date(order.createdAt).toLocaleString('id-ID')}</p>
          ${order.note ? `<p class="text-xs text-gray-500 mt-0.5">📝 ${order.note}</p>` : ''}
        </div>
        <span class="status-badge status-${order.status}">${order.status}</span>
      </div>
      <ul class="text-sm text-gray-700 space-y-1 mb-3">
        ${order.items.map(i => `
          <li class="flex justify-between">
            <span>${i.name} × ${i.qty}</span>
            <span class="font-medium">${formatRupiah(i.price * i.qty)}</span>
          </li>
        `).join('')}
      </ul>
      <div class="flex items-center justify-between border-t border-gray-100 pt-3">
        <span class="font-bold text-primary">${formatRupiah(order.total)}</span>
        <div class="flex gap-2">
          ${order.status !== 'Selesai' ? `
            <button onclick="handleOrderStatus('${order.id}', '${order.status === 'Menunggu' ? 'Diproses' : 'Selesai'}')"
              class="px-3 py-1.5 bg-primary hover:bg-primary-dark text-white rounded-lg text-xs font-semibold transition-all shadow-sm">
              ${order.status === 'Menunggu' ? '▶ Proses' : '✅ Selesai'}
            </button>
          ` : ''}
          ${order.status === 'Menunggu' ? `
            <button onclick="handleOrderStatus('${order.id}', 'Selesai')"
              class="px-3 py-1.5 bg-green-500 hover:bg-green-600 text-white rounded-lg text-xs font-semibold transition-all shadow-sm">
              ✅ Selesai Langsung
            </button>
          ` : ''}
        </div>
      </div>
    </div>
  `).join('');
}

/* ╔═════════════════════════════════════════════════
   ║  4. STATE — Objek state UI terpusat
   ╚═════════════════════════════════════════════════ */

const State = {
  filters:     { category: 'all', origin: 'all' },
  orderFilter: 'all',
  deleteTarget: null,          // ID menu yang akan dihapus
  gachaResult:  null,          // Hasil gacha aktif
};

/* ╔═════════════════════════════════════════════════
   ║  5. GACHA ENGINE
   ╚═════════════════════════════════════════════════ */

/**
 * Fisher-Yates shuffle — in-place, O(n)
 */
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * gachaOne — Pilih satu menu acak dengan harga ≤ budget
 * @param {number} budget - Budget dalam rupiah
 * @param {string} origin - 'all' | 'Sunda' | 'Jawa Tengah'
 * @returns {{ items: Menu[], total: number } | null}
 */
function gachaOne(budget, origin) {
  let pool = MenuData.getAll().filter(m => m.available && m.price <= budget);
  if (origin !== 'all') pool = pool.filter(m => m.origin === origin);
  if (pool.length === 0) return null;
  const picked = shuffle(pool)[0];
  return { items: [picked], total: picked.price };
}

/**
 * gachaPaket — Pilih paket (1 makanan + 1 minuman [+ 1 dessert]) ≤ budget
 * Algoritma:
 *   1. Pisahkan pool per kategori, filter available & origin
 *   2. Shuffle masing-masing pool
 *   3. Iterasi maks 500 kombinasi untuk menghindari O(n³) berat
 *   4. Kumpulkan semua kombinasi valid, shuffle, ambil pertama
 * @param {number}  budget
 * @param {string}  origin
 * @param {boolean} includeDessert
 * @returns {{ items: Menu[], total: number } | null}
 */
function gachaPaket(budget, origin, includeDessert) {
  const all = MenuData.getAll().filter(m => m.available && (origin === 'all' || m.origin === origin));

  const makanan  = shuffle(all.filter(m => m.category === 'Makanan'));
  const minuman  = shuffle(all.filter(m => m.category === 'Minuman'));
  const desserts = includeDessert ? shuffle(all.filter(m => m.category === 'Dessert')) : [];

  if (makanan.length === 0 || minuman.length === 0) return null;
  if (includeDessert && desserts.length === 0) return null;

  const valid = [];
  let iterations = 0;
  const MAX_ITER = 500;

  outerLoop:
  for (const m of makanan) {
    for (const d of minuman) {
      if (includeDessert) {
        for (const ds of desserts) {
          if (++iterations > MAX_ITER) break outerLoop;
          const total = m.price + d.price + ds.price;
          if (total <= budget) valid.push({ items: [m, d, ds], total });
        }
      } else {
        if (++iterations > MAX_ITER) break outerLoop;
        const total = m.price + d.price;
        if (total <= budget) valid.push({ items: [m, d], total });
      }
    }
  }

  if (valid.length === 0) return null;
  return shuffle(valid)[0];
}

/**
 * Harga termurah dari menu yang tersedia untuk pesan error budget
 * @param {string} origin
 * @param {string} mode 'single' | 'package'
 * @param {boolean} includeDessert
 */
function getCheapestInfo(origin, mode, includeDessert) {
  const pool = MenuData.getAll().filter(m => m.available && (origin === 'all' || m.origin === origin));
  if (pool.length === 0) return 'Tidak ada menu tersedia.';

  if (mode === 'single') {
    const cheapest = pool.reduce((a, b) => a.price < b.price ? a : b);
    return `Menu termurah: ${cheapest.name} — ${formatRupiah(cheapest.price)}`;
  }

  // Package: jumlahkan minimum per kategori
  const makanan  = pool.filter(m => m.category === 'Makanan');
  const minuman  = pool.filter(m => m.category === 'Minuman');
  const desserts = pool.filter(m => m.category === 'Dessert');

  if (makanan.length === 0 || minuman.length === 0) return 'Tidak cukup menu untuk paket lengkap.';
  if (includeDessert && desserts.length === 0) return 'Tidak ada dessert tersedia untuk paket ini.';

  const minMakanan = Math.min(...makanan.map(m => m.price));
  const minMinuman = Math.min(...minuman.map(m => m.price));
  const minDessert = includeDessert ? Math.min(...desserts.map(m => m.price)) : 0;
  const minTotal   = minMakanan + minMinuman + minDessert;

  return `Paket termurah (estimasi): ${formatRupiah(minTotal)}`;
}

/* ─── Gacha UI Steps ─── */

function showGachaStep(step) {
  ['input', 'anim', 'result', 'nobudget'].forEach(s => {
    document.getElementById(`gacha-step-${s}`).classList.toggle('hidden', s !== step);
  });
}

/** Isi reel dengan kartu acak untuk animasi slot */
function populateReel(menus) {
  const reel = document.getElementById('gacha-reel');
  // Duplikasi beberapa menu untuk efek bergulir
  const items = shuffle(menus).slice(0, 12);
  // Gandakan agar reel bisa loop
  reel.innerHTML = [...items, ...items].map(m => `
    <div class="gacha-reel-item">
      ${m.imageUrl
        ? `<img src="${m.imageUrl}" alt="${m.name}" class="reel-img" onerror="this.style.display='none';this.nextElementSibling.style.display='block'" /><div class="reel-emoji" style="display:none">${categoryEmoji(m.category)}</div>`
        : `<div class="reel-emoji">${categoryEmoji(m.category)}</div>`
      }
      <div class="reel-name">${m.name}</div>
    </div>
  `).join('');
}

/** Render kartu hasil gacha */
function renderGachaResultCards(result) {
  const container = document.getElementById('gacha-result-cards');
  container.innerHTML = result.items.map((item, i) => `
    <div class="gacha-result-card${i === 0 ? ' flash' : ''}">
      ${item.imageUrl
        ? `<img src="${item.imageUrl}" alt="${item.name}" class="gacha-result-card-img" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'" /><div class="gacha-result-card-placeholder" style="display:none">${categoryEmoji(item.category)}</div>`
        : `<div class="gacha-result-card-placeholder">${categoryEmoji(item.category)}</div>`
      }
      <div class="gacha-result-card-body">
        <p class="font-bold text-gray-800 text-sm leading-snug">${item.name}</p>
        <p class="text-xs text-gray-500 mt-0.5">📍 ${item.origin} · ${item.category}</p>
        <p class="text-primary font-bold text-sm mt-1">${formatRupiah(item.price)}</p>
      </div>
    </div>
  `).join('');
}

/** Jalankan animasi slot lalu tampilkan hasil */
function runGachaAnimation(result, budget) {
  const allMenus = MenuData.getAll().filter(m => m.available);
  populateReel(allMenus.length > 0 ? allMenus : result.items);

  const reel = document.getElementById('gacha-reel');
  showGachaStep('anim');

  // Fase 1: berputar cepat
  reel.className = 'gacha-slot-reel spinning';

  // Fase 2: melambat
  setTimeout(() => {
    reel.className = 'gacha-slot-reel slowing';
  }, 1800);

  // Fase 3: tampilkan hasil
  setTimeout(() => {
    reel.className = 'gacha-slot-reel';
    const budget_ = parseInt(document.getElementById('gacha-budget').value, 10) || budget;
    document.getElementById('gacha-res-total').textContent     = formatRupiah(result.total);
    document.getElementById('gacha-res-remaining').textContent = formatRupiah(budget_ - result.total);
    renderGachaResultCards(result);
    showGachaStep('result');
    State.gachaResult = result;
  }, 2600);
}

/* ╔═════════════════════════════════════════════════
   ║  6. HANDLERS — Event listener & logika UI
   ╚═════════════════════════════════════════════════ */

// ── Tab switching ──────────────────────────────────
function initTabs() {
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const tab = btn.dataset.tab;
      if (!tab) return;

      // Update button states
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active-tab'));
      btn.classList.add('active-tab');

      // Show/hide content
      document.querySelectorAll('.tab-content').forEach(c => c.classList.add('hidden'));
      document.getElementById(`tab-${tab}`)?.classList.remove('hidden');

      if (tab === 'orders') renderOrders();
    });
  });
}

// ── Filter buttons ──────────────────────────────────
function initFilters() {
  // Menu category & origin filters
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const type  = btn.dataset.filter;
      const value = btn.dataset.value;

      // Update active state in same group
      document.querySelectorAll(`.filter-btn[data-filter="${type}"]`).forEach(b => b.classList.remove('active-filter'));
      btn.classList.add('active-filter');

      State.filters[type] = value;
      renderMenus();
    });
  });

  // Order status filter
  document.querySelectorAll('.order-filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.order-filter-btn').forEach(b => b.classList.remove('active-filter'));
      btn.classList.add('active-filter');
      State.orderFilter = btn.dataset.orderFilter;
      renderOrders();
    });
  });
}

// ── Search ──────────────────────────────────────────
function initSearch() {
  document.getElementById('search-input').addEventListener('input', () => renderMenus());
}

// ── Cart drawer ─────────────────────────────────────
function openCart()  {
  document.getElementById('cart-drawer').classList.add('open');
  document.getElementById('cart-overlay').classList.remove('hidden');
  renderCart();
}
function closeCart() {
  document.getElementById('cart-drawer').classList.remove('open');
  document.getElementById('cart-overlay').classList.add('hidden');
}

function initCart() {
  document.getElementById('btn-open-cart').addEventListener('click', openCart);
  document.getElementById('btn-close-cart').addEventListener('click', closeCart);
  document.getElementById('cart-overlay').addEventListener('click', closeCart);
}

/**
 * Tampilkan floating toast "✓ Ditambahkan!" di dekat tombol yang diklik
 * @param {HTMLElement} btn - elemen tombol pemicu
 */
function showAddToCartToast(btn) {
  const toast = document.createElement('div');
  toast.className = 'cart-toast';
  toast.textContent = '✓ Ditambahkan!';

  // Posisi relatif terhadap tombol (fixed = viewport coords)
  const rect = btn.getBoundingClientRect();
  toast.style.left = rect.left + rect.width / 2 + 'px';
  toast.style.top  = rect.top + 'px';

  document.body.appendChild(toast);

  // Trigger animasi setelah paint
  requestAnimationFrame(() => {
    requestAnimationFrame(() => toast.classList.add('cart-toast-visible'));
  });

  // Hapus setelah animasi selesai
  setTimeout(() => toast.remove(), 900);
}

/**
 * Efek ripple pada tombol yang diklik
 * @param {HTMLElement} btn
 * @param {MouseEvent} event
 */
function triggerRipple(btn, event) {
  const circle = document.createElement('span');
  const diameter = Math.max(btn.clientWidth, btn.clientHeight);
  const radius   = diameter / 2;
  const rect     = btn.getBoundingClientRect();

  circle.style.width  = circle.style.height = `${diameter}px`;
  circle.style.left   = `${event.clientX - rect.left - radius}px`;
  circle.style.top    = `${event.clientY - rect.top  - radius}px`;
  circle.className    = 'ripple';

  // Hapus ripple lama jika ada
  btn.querySelector('.ripple')?.remove();
  btn.appendChild(circle);
  setTimeout(() => circle.remove(), 600);
}

function handleAddToCart(menuId, event) {
  const menu = MenuData.getById(menuId);
  if (!menu || !menu.available) return;

  CartData.addItem(menu);
  renderCartBadge();

  // Cari elemen tombol pemicu dari event atau dari DOM
  const btn = event?.currentTarget
    ?? document.querySelector(`.menu-card[data-id="${menuId}"] .btn-pesan`);

  if (btn) {
    // 1. Ripple effect
    if (event) triggerRipple(btn, event);

    // 2. Bounce animation pada tombol
    btn.classList.add('btn-pesan-bounce');
    setTimeout(() => btn.classList.remove('btn-pesan-bounce'), 500);

    // 3. Floating toast
    showAddToCartToast(btn);

    // 4. Kartu sedikit terangkat (pop)
    const card = btn.closest('.menu-card');
    if (card) {
      card.classList.add('card-pop');
      setTimeout(() => card.classList.remove('card-pop'), 400);
    }
  }

  // 5. Flash & bounce badge keranjang
  const badge = document.getElementById('cart-badge');
  badge.classList.add('badge-bounce');
  setTimeout(() => badge.classList.remove('badge-bounce'), 400);
}

function handleCartQty(menuId, qty)  { CartData.updateQty(menuId, qty); renderCart(); }
function handleCartRemove(menuId)    { CartData.removeItem(menuId);      renderCart(); }

// ── Modal helpers ────────────────────────────────────
function openModal(overlayId)  { document.getElementById(overlayId).classList.add('open'); }
function closeModal(overlayId) { document.getElementById(overlayId).classList.remove('open'); }

function initModalClose() {
  // Close on overlay click
  document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', e => {
      if (e.target === overlay) {
        const id = overlay.id;
        // Don't close gacha overlay on outside click mid-animation
        if (id === 'gacha-modal-overlay') { handleCloseGacha(); return; }
        closeModal(id);
      }
    });
  });

  // Esc key
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      closeModal('menu-modal-overlay');
      closeModal('delete-modal-overlay');
      closeModal('checkout-modal-overlay');
      handleCloseGacha();
      closeCart();
    }
  });
}

// ── Menu CRUD handlers ───────────────────────────────

function openMenuModal(menu = null) {
  const isEdit = !!menu;
  document.getElementById('menu-modal-title').textContent = isEdit ? 'Edit Menu' : 'Tambah Menu Baru';
  document.getElementById('menu-id').value          = isEdit ? menu.id          : '';
  document.getElementById('f-name').value           = isEdit ? menu.name        : '';
  document.getElementById('f-category').value       = isEdit ? menu.category    : '';
  document.getElementById('f-origin').value         = isEdit ? menu.origin      : '';
  document.getElementById('f-price').value          = isEdit ? menu.price       : '';
  document.getElementById('f-available').value      = isEdit ? String(menu.available) : 'true';
  document.getElementById('f-description').value    = isEdit ? menu.description : '';
  document.getElementById('f-image').value          = isEdit ? menu.imageUrl    : '';
  openModal('menu-modal-overlay');
  document.getElementById('f-name').focus();
}

function initMenuModal() {
  document.getElementById('btn-add-menu').addEventListener('click', () => openMenuModal());
  document.getElementById('btn-close-menu-modal').addEventListener('click', () => closeModal('menu-modal-overlay'));
  document.getElementById('btn-cancel-menu-modal').addEventListener('click', () => closeModal('menu-modal-overlay'));

  document.getElementById('menu-form').addEventListener('submit', e => {
    e.preventDefault();
    const id    = document.getElementById('menu-id').value;
    const menu  = {
      id:          id || generateId(),
      name:        document.getElementById('f-name').value.trim(),
      category:    document.getElementById('f-category').value,
      origin:      document.getElementById('f-origin').value,
      price:       parseInt(document.getElementById('f-price').value, 10),
      available:   document.getElementById('f-available').value === 'true',
      description: document.getElementById('f-description').value.trim(),
      imageUrl:    document.getElementById('f-image').value.trim(),
    };

    if (id) MenuData.update(menu);
    else    MenuData.add(menu);

    closeModal('menu-modal-overlay');
    renderMenus();
  });
}

function handleEditMenu(menuId) {
  const menu = MenuData.getById(menuId);
  if (menu) openMenuModal(menu);
}

function handleToggleAvailable(menuId) {
  const menu = MenuData.getById(menuId);
  if (!menu) return;
  MenuData.update({ ...menu, available: !menu.available });
  renderMenus();
}

// ── Delete handlers ──────────────────────────────────
function initDeleteModal() {
  document.getElementById('btn-cancel-delete').addEventListener('click', () => closeModal('delete-modal-overlay'));
  document.getElementById('btn-confirm-delete').addEventListener('click', () => {
    if (State.deleteTarget) {
      MenuData.delete(State.deleteTarget);
      State.deleteTarget = null;
      closeModal('delete-modal-overlay');
      renderMenus();
    }
  });
}

function handleDeleteMenu(menuId) {
  State.deleteTarget = menuId;
  openModal('delete-modal-overlay');
}

// ── Checkout handlers ────────────────────────────────
function initCheckout() {
  document.getElementById('btn-checkout').addEventListener('click', () => {
    if (CartData.getCount() === 0) return;
    document.getElementById('co-total').textContent = formatRupiah(CartData.getTotal());
    document.getElementById('co-name').value  = '';
    document.getElementById('co-table').value = '';
    document.getElementById('co-note').value  = '';
    closeCart();
    openModal('checkout-modal-overlay');
    document.getElementById('co-name').focus();
  });

  document.getElementById('btn-close-checkout').addEventListener('click', () => closeModal('checkout-modal-overlay'));
  document.getElementById('btn-cancel-checkout').addEventListener('click', () => closeModal('checkout-modal-overlay'));

  document.getElementById('checkout-form').addEventListener('submit', e => {
    e.preventDefault();
    const order = {
      id:           'ord-' + Date.now(),
      customerName: document.getElementById('co-name').value.trim(),
      tableNumber:  document.getElementById('co-table').value.trim(),
      note:         document.getElementById('co-note').value.trim(),
      items:        CartData.getAll(),
      total:        CartData.getTotal(),
      status:       'Menunggu',
      createdAt:    new Date().toISOString(),
    };
    OrderData.add(order);
    CartData.clear();
    renderCart();
    closeModal('checkout-modal-overlay');

    // Switch ke tab pesanan
    document.querySelector('[data-tab="orders"]').click();
  });
}

// ── Order status handler ─────────────────────────────
function handleOrderStatus(orderId, newStatus) {
  OrderData.updateStatus(orderId, newStatus);
  renderOrders();
}

// ── Gacha handlers ───────────────────────────────────
function handleCloseGacha() {
  closeModal('gacha-modal-overlay');
  // Reset gacha ke step input tanpa mengubah keranjang
  showGachaStep('input');
  State.gachaResult = null;
  // Reset form fields (budget dibersihkan hanya saat benar-benar keluar)
  document.getElementById('gacha-budget').value  = '';
  document.getElementById('gacha-mode').value    = 'single';
  document.getElementById('gacha-origin').value  = 'all';
  document.getElementById('gacha-dessert').checked = false;
  document.getElementById('gacha-dessert-wrap').classList.add('hidden');
}

function initGacha() {
  // Buka gacha dari tombol navbar & mobile
  document.getElementById('btn-open-gacha').addEventListener('click',        () => { showGachaStep('input'); openModal('gacha-modal-overlay'); });
  document.getElementById('btn-open-gacha-mobile').addEventListener('click', () => { showGachaStep('input'); openModal('gacha-modal-overlay'); });

  // Tutup gacha
  document.getElementById('btn-close-gacha').addEventListener('click', handleCloseGacha);

  // Toggle dessert option
  document.getElementById('gacha-mode').addEventListener('change', e => {
    document.getElementById('gacha-dessert-wrap').classList.toggle('hidden', e.target.value !== 'package');
  });

  // Tombol Putar Gacha
  document.getElementById('btn-spin-gacha').addEventListener('click', () => {
    const budgetVal = document.getElementById('gacha-budget').value;
    const budget    = parseInt(budgetVal, 10);

    if (!budgetVal || isNaN(budget) || budget <= 0) {
      document.getElementById('gacha-budget').focus();
      document.getElementById('gacha-budget').style.borderColor = '#ef4444';
      setTimeout(() => { document.getElementById('gacha-budget').style.borderColor = ''; }, 1500);
      return;
    }

    const mode          = document.getElementById('gacha-mode').value;
    const origin        = document.getElementById('gacha-origin').value;
    const includeDessert = document.getElementById('gacha-dessert').checked;

    // Jalankan algoritma gacha
    const result = mode === 'single'
      ? gachaOne(budget, origin)
      : gachaPaket(budget, origin, includeDessert);

    if (!result) {
      // Tampilkan pesan budget kurang
      const info = getCheapestInfo(origin, mode, includeDessert);
      document.getElementById('gacha-cheapest-info').textContent = info;
      showGachaStep('nobudget');
      return;
    }

    // Mulai animasi
    runGachaAnimation(result, budget);
  });

  // Tombol Gacha Ulang — spin ulang langsung tanpa kembali ke form input
  document.getElementById('btn-gacha-again').addEventListener('click', () => {
    const budget = parseInt(document.getElementById('gacha-budget').value, 10);
    const mode   = document.getElementById('gacha-mode').value;
    const origin = document.getElementById('gacha-origin').value;
    const includeDessert = document.getElementById('gacha-dessert').checked;

    const result = mode === 'single'
      ? gachaOne(budget, origin)
      : gachaPaket(budget, origin, includeDessert);

    if (!result) {
      const info = getCheapestInfo(origin, mode, includeDessert);
      document.getElementById('gacha-cheapest-info').textContent = info;
      showGachaStep('nobudget');
      return;
    }

    State.gachaResult = null;
    runGachaAnimation(result, budget);
  });

  // Tambah hasil gacha ke keranjang
  document.getElementById('btn-gacha-add-cart').addEventListener('click', () => {
    if (!State.gachaResult) return;
    State.gachaResult.items.forEach(item => CartData.addItem(item));
    renderCartBadge();
    handleCloseGacha();
    openCart();
  });

  // Naikkan Budget — kembali ke form input dengan fokus
  document.getElementById('btn-gacha-raise-budget').addEventListener('click', () => {
    showGachaStep('input');
    const budgetInput = document.getElementById('gacha-budget');
    budgetInput.focus();
    budgetInput.select();
  });

  // Tidak, Terima Kasih — tutup gacha
  document.getElementById('btn-gacha-cancel').addEventListener('click', handleCloseGacha);
}

/* ╔═════════════════════════════════════════════════
   ║  7. INIT — Inisialisasi Aplikasi
   ╚═════════════════════════════════════════════════ */

function init() {
  // Seed data jika localStorage kosong
  if (MenuData.getAll().length === 0) {
    Storage.set(KEYS.MENUS, SEED_MENUS);
  } else {
    // Selalu sync imageUrl menu seed dari SEED_MENUS ke localStorage
    // agar perubahan URL di kode langsung terefleksi tanpa hapus data manual
    const stored = MenuData.getAll();
    const seedMap = Object.fromEntries(SEED_MENUS.map(m => [m.id, m]));
    const patched = stored.map(m => {
      if (seedMap[m.id] && seedMap[m.id].imageUrl) {
        return { ...m, imageUrl: seedMap[m.id].imageUrl };
      }
      return m;
    });
    Storage.set(KEYS.MENUS, patched);
  }

  // Init semua modul
  initTabs();
  initFilters();
  initSearch();
  initCart();
  initModalClose();
  initMenuModal();
  initDeleteModal();
  initCheckout();
  initGacha();

  // Render initial state
  renderMenus();
  renderCartBadge();
}

// Jalankan saat DOM siap
document.addEventListener('DOMContentLoaded', init);
