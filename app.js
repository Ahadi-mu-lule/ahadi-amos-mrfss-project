/**
 * BAKYENGA TRADERS - POINT OF SALE & INVENTORY MANAGEMENT SYSTEM
 * Author: Antigravity AI Engineering
 * Features: Multi-User Role-Based Access Control (RBAC), Custom Category Input, Offline Persistence
 */

// =============================================================================
// 1. STATE & STORAGE MANAGEMENT
// =============================================================================

const STORAGE_KEYS = {
  PRODUCTS: 'bakyenga_products',
  SALES: 'bakyenga_sales',
  CUSTOMERS: 'bakyenga_customers',
  SETTINGS: 'bakyenga_settings',
  SHIFT: 'bakyenga_shift',
  TICKETS: 'bakyenga_held_tickets',
  ACTIVE_TICKET_ID: 'bakyenga_active_ticket_id',
  SOUND_ENABLED: 'bakyenga_sound_enabled',
  USERS: 'bakyenga_users',
  CURRENT_USER_ID: 'bakyenga_current_user_id',
  CATEGORIES: 'bakyenga_categories'
};

// Initial Pre-configured Staff Users
const INITIAL_USERS = [
  {
    id: 'USR-001',
    name: 'Brian Bakyenga',
    username: 'admin',
    role: 'ADMIN',
    pin: '1234',
    phone: '+256 701 456 789',
    avatar: 'BB',
    title: 'Main Admin / Store Owner'
  },
  {
    id: 'USR-002',
    name: 'Grace Natukunda',
    username: 'grace',
    role: 'CASHIER',
    pin: '2222',
    phone: '+256 772 987 654',
    avatar: 'GN',
    title: 'Cashier / Sales Associate'
  },
  {
    id: 'USR-003',
    name: 'Denis Mugisha',
    username: 'denis',
    role: 'CASHIER',
    pin: '3333',
    phone: '+256 752 443 210',
    avatar: 'DM',
    title: 'Shop Assistant / Cashier'
  }
];

// Initial Categories (Extendable dynamically by users)
const INITIAL_CATEGORIES = [
  'Grains & Flour',
  'Beverages & Drinks',
  'Household & Cleaning',
  'Cooking Essentials',
  'Hardware & Tools',
  'Personal Care'
];

// Initial Seed Products
const INITIAL_PRODUCTS = [
  // Grains & Flour
  { id: 'PRD-001', barcode: '6001001', name: 'Super Basmati Rice 25kg (Bakyenga Grade 1)', category: 'Grains & Flour', costPrice: 95000, price: 115000, stock: 45, minStock: 10, unit: 'bags' },
  { id: 'PRD-002', barcode: '6001002', name: 'Pearl White Refined Sugar 50kg Bag', category: 'Grains & Flour', costPrice: 180000, price: 210000, stock: 22, minStock: 8, unit: 'bags' },
  { id: 'PRD-003', barcode: '6001003', name: 'Pembe Fortified Maize Flour 25kg', category: 'Grains & Flour', costPrice: 52000, price: 62000, stock: 35, minStock: 12, unit: 'bags' },
  { id: 'PRD-004', barcode: '6001004', name: 'Supreme Wheat Flour 2kg Pack', category: 'Grains & Flour', costPrice: 6200, price: 7800, stock: 80, minStock: 20, unit: 'packets' },
  { id: 'PRD-005', barcode: '6001005', name: 'Aponye Special Dry Yellow Beans 50kg', category: 'Grains & Flour', costPrice: 145000, price: 175000, stock: 14, minStock: 5, unit: 'bags' },

  // Cooking Essentials
  { id: 'PRD-006', barcode: '6002001', name: 'Fortune Butto Cooking Oil 20L Jerrycan', category: 'Cooking Essentials', costPrice: 110000, price: 128000, stock: 18, minStock: 6, unit: 'litres' },
  { id: 'PRD-007', barcode: '6002002', name: 'Golden Fry Vegetable Oil 5L Can', category: 'Cooking Essentials', costPrice: 32000, price: 38000, stock: 28, minStock: 10, unit: 'litres' },
  { id: 'PRD-008', barcode: '6002003', name: 'Sunseed Refined Sunflower Oil 2L', category: 'Cooking Essentials', costPrice: 14500, price: 17500, stock: 42, minStock: 15, unit: 'litres' },
  { id: 'PRD-009', barcode: '6002004', name: 'Royco Mchuzi Mix Beef 200g Jar', category: 'Cooking Essentials', costPrice: 4200, price: 5500, stock: 65, minStock: 15, unit: 'pcs' },
  { id: 'PRD-010', barcode: '6002005', name: 'Habari Iodated Table Salt 1kg Pack', category: 'Cooking Essentials', costPrice: 1200, price: 1800, stock: 120, minStock: 30, unit: 'packets' },

  // Beverages & Drinks
  { id: 'PRD-011', barcode: '6003001', name: 'Coca-Cola 500ml Pet Bottles (Crate of 24)', category: 'Beverages & Drinks', costPrice: 38000, price: 46000, stock: 30, minStock: 8, unit: 'cartons' },
  { id: 'PRD-012', barcode: '6003002', name: 'Rwenzori Natural Mineral Water 500ml (24-Pack)', category: 'Beverages & Drinks', costPrice: 15000, price: 19500, stock: 55, minStock: 15, unit: 'cartons' },
  { id: 'PRD-013', barcode: '6003003', name: 'Minute Maid Mango Delight 1L', category: 'Beverages & Drinks', costPrice: 4200, price: 5500, stock: 38, minStock: 10, unit: 'pcs' },
  { id: 'PRD-014', barcode: '6003004', name: 'Nescafe Classic Instant Coffee 200g Glass', category: 'Beverages & Drinks', costPrice: 19500, price: 24000, stock: 16, minStock: 5, unit: 'pcs' },
  { id: 'PRD-015', barcode: '6003005', name: 'Nile Special Premium Lager 500ml (Crate 25s)', category: 'Beverages & Drinks', costPrice: 65000, price: 78000, stock: 12, minStock: 5, unit: 'cartons' },

  // Household & Cleaning
  { id: 'PRD-016', barcode: '6004001', name: 'Mukwano Star Laundry Bar Soap (Box of 25)', category: 'Household & Cleaning', costPrice: 78000, price: 92000, stock: 15, minStock: 6, unit: 'cartons' },
  { id: 'PRD-017', barcode: '6004002', name: 'Omo Active Auto Washing Powder 1kg', category: 'Household & Cleaning', costPrice: 8500, price: 10500, stock: 40, minStock: 12, unit: 'packets' },
  { id: 'PRD-018', barcode: '6004003', name: 'Sunlight Lemon Dishwashing Liquid 750ml', category: 'Household & Cleaning', costPrice: 6800, price: 8500, stock: 26, minStock: 8, unit: 'pcs' },
  { id: 'PRD-019', barcode: '6004004', name: 'Jik Regular Disinfectant Bleach 1L', category: 'Household & Cleaning', costPrice: 6200, price: 7800, stock: 30, minStock: 8, unit: 'pcs' },
  { id: 'PRD-020', barcode: '6004005', name: 'Velvex Premium 2-Ply Toilet Tissue (Pack 10)', category: 'Household & Cleaning', costPrice: 14000, price: 18000, stock: 45, minStock: 10, unit: 'packets' },

  // Hardware & Tools
  { id: 'PRD-021', barcode: '6005001', name: 'Tororo Portland Cement 50kg Bag (CEM II 32.5N)', category: 'Hardware & Tools', costPrice: 31000, price: 36000, stock: 110, minStock: 25, unit: 'bags' },
  { id: 'PRD-022', barcode: '6005002', name: 'Power King Heavy Duty 4-Way Extension 3M', category: 'Hardware & Tools', costPrice: 18000, price: 25000, stock: 14, minStock: 5, unit: 'pcs' },
  { id: 'PRD-023', barcode: '6005003', name: 'Philips Ultra Bright LED Bulb 12W (B22/E27)', category: 'Hardware & Tools', costPrice: 5800, price: 8000, stock: 60, minStock: 15, unit: 'pcs' },
  { id: 'PRD-024', barcode: '6005004', name: 'Galvanized Roofing Nails 2.5 Inch (1kg Bag)', category: 'Hardware & Tools', costPrice: 6500, price: 8500, stock: 50, minStock: 10, unit: 'kg' },

  // Personal Care
  { id: 'PRD-025', barcode: '6006001', name: 'Geisha Herbal Bathing Soap 225g (Pack 3)', category: 'Personal Care', costPrice: 7500, price: 9500, stock: 36, minStock: 10, unit: 'packets' },
  { id: 'PRD-026', barcode: '6006002', name: 'Colgate Maximum Cavity Protection 140g', category: 'Personal Care', costPrice: 3800, price: 5000, stock: 50, minStock: 12, unit: 'pcs' },
  { id: 'PRD-027', barcode: '6006003', name: 'Dettol Original Antiseptic Liquid 250ml', category: 'Personal Care', costPrice: 11500, price: 14500, stock: 8, minStock: 10, unit: 'pcs' },
  { id: 'PRD-028', barcode: '6006004', name: 'Nice & Lovely Cocoa Butter Body Lotion 400ml', category: 'Personal Care', costPrice: 8800, price: 11500, stock: 2, minStock: 8, unit: 'pcs' }
];

const INITIAL_CUSTOMERS = [
  { id: 'CST-001', name: 'Hajji Juma Retailers', phone: '+256 772 345 678', address: 'Nakasero Market, Stall #42', creditLimit: 2500000, debtBalance: 320000, totalSpent: 4850000 },
  { id: 'CST-002', name: 'Mama Kevina Wholesale Store', phone: '+256 701 987 654', address: 'Kalerwe Roundabout Complex', creditLimit: 1500000, debtBalance: 140000, totalSpent: 3120000 },
  { id: 'CST-003', name: 'Patrick Muhwezi Contractors', phone: '+256 752 112 233', address: 'Kololo Construction Yard', creditLimit: 5000000, debtBalance: 0, totalSpent: 7890000 },
  { id: 'CST-004', name: 'Sarah Kyomugisha Mini-Supermarket', phone: '+256 782 554 433', address: 'Ntinda Shopping Village', creditLimit: 3000000, debtBalance: 480000, totalSpent: 6240000 }
];

const INITIAL_SETTINGS = {
  storeName: 'BAKYENGA TRADERS',
  tagline: 'Wholesale & Retail General Merchants',
  phone: '+256 701 456 789 / +256 772 123 456',
  tin: '1008492019',
  address: 'Plot 14, Commercial Plaza, High Street, Kampala, Uganda',
  currency: 'UGX',
  defaultTaxRate: 18,
  receiptFooter: 'Thank you for trading with Bakyenga Traders! Goods once sold are not returnable without original receipt.'
};

const INITIAL_SHIFT = {
  shiftId: 'SH-20261002-01',
  cashier: 'Brian Bakyenga',
  startTime: '08:00 AM Today',
  openingFloat: 150000,
  movements: [
    { type: 'CASH_IN', amount: 150000, reason: 'Initial Morning Float', time: '08:00 AM' },
    { type: 'CASH_OUT', amount: 15000, reason: 'Store Cleaning Detergent & Water', time: '09:15 AM' }
  ]
};

const INITIAL_SALES = [
  {
    id: 'BK-20261002-001',
    timestamp: '2026-10-02T08:35:10',
    cashier: 'Brian Bakyenga',
    customerId: 'CST-001',
    customerName: 'Hajji Juma Retailers',
    items: [
      { id: 'PRD-001', name: 'Super Basmati Rice 25kg (Bakyenga Grade 1)', price: 115000, costPrice: 95000, qty: 2, total: 230000 },
      { id: 'PRD-006', name: 'Fortune Butto Cooking Oil 20L Jerrycan', price: 128000, costPrice: 110000, qty: 1, total: 128000 }
    ],
    subtotal: 358000,
    discount: 8000,
    tax: 0,
    taxRate: 0,
    total: 350000,
    paymentMethod: 'MTN_MOMO',
    tendered: 350000,
    change: 0,
    reference: 'MP261002.0835.A102'
  },
  {
    id: 'BK-20261002-002',
    timestamp: '2026-10-02T09:12:44',
    cashier: 'Brian Bakyenga',
    customerId: 'walk-in',
    customerName: 'Walk-in Customer',
    items: [
      { id: 'PRD-011', name: 'Coca-Cola 500ml Pet Bottles (Crate of 24)', price: 46000, costPrice: 38000, qty: 1, total: 46000 },
      { id: 'PRD-012', name: 'Rwenzori Natural Mineral Water 500ml (24-Pack)', price: 19500, costPrice: 15000, qty: 2, total: 39000 },
      { id: 'PRD-004', name: 'Supreme Wheat Flour 2kg Pack', price: 7800, costPrice: 6200, qty: 3, total: 23400 }
    ],
    subtotal: 108400,
    discount: 0,
    tax: 0,
    taxRate: 0,
    total: 108400,
    paymentMethod: 'CASH',
    tendered: 110000,
    change: 1600,
    reference: ''
  },
  {
    id: 'BK-20261002-003',
    timestamp: '2026-10-02T09:50:20',
    cashier: 'Brian Bakyenga',
    customerId: 'CST-003',
    customerName: 'Patrick Muhwezi Contractors',
    items: [
      { id: 'PRD-021', name: 'Tororo Portland Cement 50kg Bag (CEM II 32.5N)', price: 36000, costPrice: 31000, qty: 10, total: 360000 }
    ],
    subtotal: 360000,
    discount: 10000,
    tax: 0,
    taxRate: 0,
    total: 350000,
    paymentMethod: 'AIRTEL_MONEY',
    tendered: 350000,
    change: 0,
    reference: 'AM261002.950.T99'
  }
];

// Application State Container
const AppState = {
  products: [],
  sales: [],
  customers: [],
  settings: {},
  shift: {},
  heldTickets: [],
  activeTicketId: 'TKT-1',
  soundEnabled: true,
  currentCategory: 'ALL',
  searchQuery: '',
  selectedPaymentMethod: 'CASH',

  // RBAC & Multi-user additions
  users: [],
  currentUser: null,
  loginSelectedUser: null,
  pinEntered: '',

  // Categories addition
  categories: []
};

// =============================================================================
// 2. AUDIO SYNTHESIZER (WEB AUDIO API)
// =============================================================================

class SoundFX {
  constructor() {
    this.ctx = null;
  }

  init() {
    if (!this.ctx && (window.AudioContext || window.webkitAudioContext)) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();
    }
  }

  play(type) {
    if (!AppState.soundEnabled) return;
    try {
      this.init();
      if (!this.ctx) return;
      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }

      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.connect(gain);
      gain.connect(this.ctx.destination);

      if (type === 'beep') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(880, t);
        osc.frequency.exponentialRampToValueAtTime(1320, t + 0.05);
        gain.gain.setValueAtTime(0.15, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.06);
        osc.start(t);
        osc.stop(t + 0.06);
      } else if (type === 'success') {
        const notes = [523.25, 659.25, 783.99, 1046.50];
        notes.forEach((freq, idx) => {
          const o = this.ctx.createOscillator();
          const g = this.ctx.createGain();
          o.type = 'triangle';
          o.frequency.setValueAtTime(freq, t + idx * 0.07);
          g.gain.setValueAtTime(0.18, t + idx * 0.07);
          g.gain.exponentialRampToValueAtTime(0.001, t + idx * 0.07 + 0.25);
          o.connect(g);
          g.connect(this.ctx.destination);
          o.start(t + idx * 0.07);
          o.stop(t + idx * 0.07 + 0.25);
        });
      } else if (type === 'error') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(220, t);
        gain.gain.setValueAtTime(0.2, t);
        gain.gain.exponentialRampToValueAtTime(0.01, t + 0.15);
        osc.start(t);
        osc.stop(t + 0.15);
      } else if (type === 'click') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(440, t);
        gain.gain.setValueAtTime(0.05, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.03);
        osc.start(t);
        osc.stop(t + 0.03);
      }
    } catch (e) {
      // Audio autoplay policy fallback
    }
  }
}

const sound = new SoundFX();

// =============================================================================
// 3. PERSISTENCE & DATA INITIALIZATION
// =============================================================================

function loadFromStorage(key, defaultValue) {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (e) {
    console.error('Storage read error for key:', key, e);
    return defaultValue;
  }
}

function saveToStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error('Storage write error for key:', key, e);
  }
}

function initDataStore() {
  AppState.products = loadFromStorage(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
  AppState.sales = loadFromStorage(STORAGE_KEYS.SALES, INITIAL_SALES);
  AppState.customers = loadFromStorage(STORAGE_KEYS.CUSTOMERS, INITIAL_CUSTOMERS);
  AppState.settings = loadFromStorage(STORAGE_KEYS.SETTINGS, INITIAL_SETTINGS);
  AppState.shift = loadFromStorage(STORAGE_KEYS.SHIFT, INITIAL_SHIFT);
  AppState.soundEnabled = loadFromStorage(STORAGE_KEYS.SOUND_ENABLED, true);

  // Multi-user & RBAC state
  AppState.users = loadFromStorage(STORAGE_KEYS.USERS, INITIAL_USERS);
  const currentUserId = loadFromStorage(STORAGE_KEYS.CURRENT_USER_ID, AppState.users[0].id);
  AppState.currentUser = AppState.users.find(u => u.id === currentUserId) || AppState.users[0];

  // Dynamic Categories state (merge initial with any unique categories from existing products)
  const productCats = AppState.products.map(p => p.category);
  const initialCatsCombined = Array.from(new Set([...INITIAL_CATEGORIES, ...productCats]));
  AppState.categories = loadFromStorage(STORAGE_KEYS.CATEGORIES, initialCatsCombined);

  // Load or initialize held tickets
  let tickets = loadFromStorage(STORAGE_KEYS.TICKETS, null);
  if (!tickets || !tickets.length) {
    tickets = [
      {
        id: 'TKT-1',
        title: 'Ticket 1',
        customerId: 'walk-in',
        items: [],
        discount: 0,
        discountType: 'UGX',
        taxEnabled: false,
        createdAt: new Date().toISOString()
      }
    ];
  }
  AppState.heldTickets = tickets;
  AppState.activeTicketId = loadFromStorage(STORAGE_KEYS.ACTIVE_TICKET_ID, tickets[0].id);

  // Sync settings and permissions to DOM
  applyStoreSettingsToDOM();
  applyUserPermissions();
  renderCategoryPills();
  renderCategorySelects();
}

function getActiveTicket() {
  let ticket = AppState.heldTickets.find(t => t.id === AppState.activeTicketId);
  if (!ticket) {
    ticket = AppState.heldTickets[0];
    AppState.activeTicketId = ticket.id;
  }
  return ticket;
}

function saveActiveTickets() {
  saveToStorage(STORAGE_KEYS.TICKETS, AppState.heldTickets);
  saveToStorage(STORAGE_KEYS.ACTIVE_TICKET_ID, AppState.activeTicketId);
}

function formatMoney(amount) {
  const code = AppState.settings.currency || 'UGX';
  const val = Math.round(Number(amount) || 0);
  return `${code} ${val.toLocaleString('en-US')}`;
}

// =============================================================================
// 4. ROLE-BASED ACCESS CONTROL (RBAC) & PERMISSIONS ENFORCEMENT
// =============================================================================

function isCurrentUserAdmin() {
  return AppState.currentUser && AppState.currentUser.role === 'ADMIN';
}

function applyUserPermissions() {
  const user = AppState.currentUser;
  if (!user) return;

  const isAdmin = user.role === 'ADMIN';

  // 1. Update Header Profile & Badges
  const avatarEl = document.getElementById('current-user-avatar');
  const nameEl = document.getElementById('current-cashier-name');
  const roleBadgeEl = document.getElementById('current-user-role-badge');
  const userTitleEl = document.getElementById('current-user-title');

  if (avatarEl) avatarEl.textContent = user.avatar || user.name.split(' ').map(n => n[0]).join('').slice(0, 2);
  if (nameEl) nameEl.textContent = user.name;

  if (roleBadgeEl) {
    roleBadgeEl.textContent = isAdmin ? 'ADMIN' : 'CASHIER';
    roleBadgeEl.className = `role-badge ${isAdmin ? 'admin' : 'cashier'}`;
  }

  if (userTitleEl) {
    userTitleEl.textContent = user.title || (isAdmin ? 'Main Admin / Owner' : 'Cashier / Worker');
  }

  // Update current shift cashier
  AppState.shift.cashier = user.name;
  const shiftCashierDisp = document.getElementById('shift-cashier-display');
  if (shiftCashierDisp) shiftCashierDisp.textContent = user.name;

  // 2. Lock icons on tabs
  const salesLock = document.getElementById('sales-lock-icon');
  const settingsLock = document.getElementById('settings-lock-icon');
  if (salesLock) salesLock.style.display = isAdmin ? 'none' : 'inline-flex';
  if (settingsLock) settingsLock.style.display = isAdmin ? 'none' : 'inline-flex';

  // 3. Top Navigation Revenue Stat Masking
  const revEl = document.getElementById('nav-today-rev');
  const revHiddenEl = document.getElementById('nav-rev-hidden');
  const drawerBalTag = document.getElementById('header-drawer-tag');

  if (isAdmin) {
    if (revEl) revEl.style.display = 'inline';
    if (revHiddenEl) revHiddenEl.style.display = 'none';
    if (drawerBalTag) drawerBalTag.style.display = 'inline-block';
  } else {
    // Worker / Cashier cannot see business cash report numbers in header
    if (revEl) revEl.style.display = 'none';
    if (revHiddenEl) revHiddenEl.style.display = 'inline-flex';
    if (drawerBalTag) drawerBalTag.style.display = 'none';
  }

  // 4. Sales & Analytics Tab Access Control
  const salesAdminContent = document.getElementById('sales-admin-content');
  const salesRestricted = document.getElementById('sales-restricted-screen');
  const deniedName = document.getElementById('denied-user-name');
  const deniedBadge = document.getElementById('denied-role-badge');

  if (isAdmin) {
    if (salesAdminContent) salesAdminContent.style.display = 'block';
    if (salesRestricted) salesRestricted.style.display = 'none';
  } else {
    if (salesAdminContent) salesAdminContent.style.display = 'none';
    if (salesRestricted) salesRestricted.style.display = 'flex';
    if (deniedName) deniedName.textContent = user.name;
    if (deniedBadge) {
      deniedBadge.textContent = 'CASHIER (STAFF)';
      deniedBadge.className = 'role-badge cashier';
    }
  }

  // 5. Store Settings & Staff Management Tab Access Control
  const settingsAdminContent = document.getElementById('settings-admin-content');
  const settingsRestricted = document.getElementById('settings-restricted-screen');
  const setDeniedName = document.getElementById('settings-denied-user-name');
  const setDeniedBadge = document.getElementById('settings-denied-role-badge');

  if (isAdmin) {
    if (settingsAdminContent) settingsAdminContent.style.display = 'block';
    if (settingsRestricted) settingsRestricted.style.display = 'none';
  } else {
    if (settingsAdminContent) settingsAdminContent.style.display = 'none';
    if (settingsRestricted) settingsRestricted.style.display = 'flex';
    if (setDeniedName) setDeniedName.textContent = user.name;
    if (setDeniedBadge) {
      setDeniedBadge.textContent = 'CASHIER (STAFF)';
      setDeniedBadge.className = 'role-badge cashier';
    }
  }

  // 6. Shift & Cash Drawer View Controls
  const drawerExpectedEl = document.getElementById('drawer-expected-cash');
  const btnCloseShift = document.getElementById('btn-close-shift-modal');
  const shiftWorkerNotice = document.getElementById('shift-worker-notice');

  if (isAdmin) {
    if (drawerExpectedEl) drawerExpectedEl.classList.remove('masked-cell');
    if (btnCloseShift) btnCloseShift.style.display = 'inline-flex';
    if (shiftWorkerNotice) shiftWorkerNotice.style.display = 'none';
  } else {
    if (drawerExpectedEl) {
      drawerExpectedEl.textContent = 'UGX ••••••';
      drawerExpectedEl.classList.add('masked-cell');
    }
    if (btnCloseShift) btnCloseShift.style.display = 'none';
    if (shiftWorkerNotice) shiftWorkerNotice.style.display = 'flex';
  }

  // Refresh Views
  renderProductCatalog();
  renderCart();
  renderInventoryTable();
  renderSalesAnalytics();
  renderCustomersTable();
  renderShiftView();
  renderStaffTable();

  if (window.lucide) {
    lucide.createIcons();
  }
}

// =============================================================================
// 5. DYNAMIC CATEGORIES MANAGEMENT
// =============================================================================

function renderCategoryPills() {
  const container = document.getElementById('category-pills');
  if (!container) return;

  const current = AppState.currentCategory;
  container.innerHTML = `
    <button class="cat-pill ${current === 'ALL' ? 'active' : ''}" data-category="ALL">All Items</button>
    ${AppState.categories.map(cat => `
      <button class="cat-pill ${current === cat ? 'active' : ''}" data-category="${cat}">${cat}</button>
    `).join('')}
  `;
}

function renderCategorySelects(selectedCat = null) {
  // 1. Product Form Category Select
  const prodCatSelect = document.getElementById('prod-category');
  if (prodCatSelect) {
    prodCatSelect.innerHTML = AppState.categories.map(cat => `
      <option value="${cat}" ${selectedCat === cat ? 'selected' : ''}>${cat}</option>
    `).join('');
  }

  // 2. Inventory Filter Category Select
  const invCatFilter = document.getElementById('inventory-cat-filter');
  if (invCatFilter) {
    const currentVal = invCatFilter.value || 'ALL';
    invCatFilter.innerHTML = `
      <option value="ALL">All Categories</option>
      ${AppState.categories.map(cat => `
        <option value="${cat}" ${currentVal === cat ? 'selected' : ''}>${cat}</option>
      `).join('')}
    `;
  }
}

function addCustomCategory(newCatName) {
  const trimmed = newCatName.trim();
  if (!trimmed) {
    alert('Please enter a valid category name.');
    return null;
  }

  // Case-insensitive duplicate check
  const exists = AppState.categories.find(c => c.toLowerCase() === trimmed.toLowerCase());
  if (!exists) {
    AppState.categories.push(trimmed);
    saveToStorage(STORAGE_KEYS.CATEGORIES, AppState.categories);
  }

  const finalCat = exists || trimmed;

  // Re-render UI
  renderCategoryPills();
  renderCategorySelects(finalCat);
  sound.play('success');

  return finalCat;
}

// =============================================================================
// 6. UI RENDERING & COMPONENT LOGIC
// =============================================================================

function applyStoreSettingsToDOM() {
  const s = AppState.settings;
  const storeNameEls = document.querySelectorAll('.brand-name, .receipt-store-name');
  storeNameEls.forEach(el => el.textContent = s.storeName);

  const taglineEls = document.querySelectorAll('.receipt-tagline');
  taglineEls.forEach(el => el.textContent = s.tagline);

  const addressEls = document.querySelectorAll('.brand-sub');
  addressEls.forEach(el => el.textContent = s.address);

  const currPrefixes = document.querySelectorAll('.curr-prefix');
  currPrefixes.forEach(el => el.textContent = s.currency);

  const elName = document.getElementById('setting-store-name');
  if (elName) elName.value = s.storeName;
  const elTagline = document.getElementById('setting-store-tagline');
  if (elTagline) elTagline.value = s.tagline;
  const elPhone = document.getElementById('setting-store-phone');
  if (elPhone) elPhone.value = s.phone;
  const elTin = document.getElementById('setting-store-tin');
  if (elTin) elTin.value = s.tin;
  const elAddress = document.getElementById('setting-store-address');
  if (elAddress) elAddress.value = s.address;
  const elCurr = document.getElementById('setting-currency');
  if (elCurr) elCurr.value = s.currency;
  const elTax = document.getElementById('setting-tax-rate');
  if (elTax) elTax.value = s.defaultTaxRate;
  const elFooter = document.getElementById('setting-receipt-footer');
  if (elFooter) elFooter.value = s.receiptFooter;
}

// Render product catalog grid
function renderProductCatalog() {
  const grid = document.getElementById('products-grid');
  const emptyState = document.getElementById('empty-catalog');
  const countSummary = document.getElementById('catalog-count-text');

  let list = AppState.products;

  // Filter by category
  if (AppState.currentCategory !== 'ALL') {
    list = list.filter(p => p.category === AppState.currentCategory);
  }

  // Filter by search query
  if (AppState.searchQuery.trim()) {
    const q = AppState.searchQuery.toLowerCase().trim();
    list = list.filter(p => 
      p.name.toLowerCase().includes(q) ||
      p.barcode.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q)
    );
  }

  if (list.length === 0) {
    grid.innerHTML = '';
    emptyState.style.display = 'block';
    if (countSummary) countSummary.textContent = 'No matching products';
    return;
  }

  emptyState.style.display = 'none';
  if (countSummary) {
    countSummary.textContent = `Showing ${list.length} of ${AppState.products.length} products`;
  }

  grid.innerHTML = list.map(prod => {
    let stockClass = 'in-stock';
    let stockLabel = `${prod.stock} in stock`;

    if (prod.stock <= 0) {
      stockClass = 'out-stock';
      stockLabel = 'Out of Stock';
    } else if (prod.stock <= prod.minStock) {
      stockClass = 'low-stock';
      stockLabel = `Low (${prod.stock} left)`;
    }

    return `
      <div class="product-card" data-product-id="${prod.id}">
        <div class="prod-card-top">
          <span class="prod-category-tag">${prod.category}</span>
          <span class="stock-tag ${stockClass}">${stockLabel}</span>
        </div>
        <h4 class="prod-title" title="${prod.name}">${prod.name}</h4>
        <div class="prod-sku">SKU: ${prod.barcode} &bull; ${prod.unit}</div>
        <div class="prod-card-bottom">
          <div class="prod-price">${formatMoney(prod.price)}</div>
          <button class="btn-card-add" title="Add to ticket" data-id="${prod.id}">
            <i data-lucide="plus"></i>
          </button>
        </div>
      </div>
    `;
  }).join('');

  if (window.lucide) {
    lucide.createIcons();
  }
}

// Render Register Cart Ticket
function renderCart() {
  const ticket = getActiveTicket();
  const itemsContainer = document.getElementById('cart-items-list');
  const emptyState = document.getElementById('cart-empty-state');
  const heldTabsContainer = document.getElementById('held-tickets-list');
  const customerSelect = document.getElementById('cart-customer-select');

  // Customer options
  customerSelect.innerHTML = `
    <option value="walk-in" ${ticket.customerId === 'walk-in' ? 'selected' : ''}>Walk-in Customer (General)</option>
    ${AppState.customers.map(c => `
      <option value="${c.id}" ${ticket.customerId === c.id ? 'selected' : ''}>
        ${c.name} ${c.debtBalance > 0 ? `(Debt: ${formatMoney(c.debtBalance)})` : ''}
      </option>
    `).join('')}
  `;

  // Render Parked Tabs
  heldTabsContainer.innerHTML = AppState.heldTickets.map((t) => {
    const itemCount = t.items.reduce((sum, item) => sum + item.qty, 0);
    const isActive = t.id === AppState.activeTicketId;
    return `
      <div class="ticket-tab ${isActive ? 'active' : ''}" data-ticket-id="${t.id}">
        <span>${t.title} ${itemCount > 0 ? `(${itemCount})` : ''}</span>
        ${AppState.heldTickets.length > 1 ? `
          <button class="tab-close" data-close-ticket="${t.id}" title="Close tab">&times;</button>
        ` : ''}
      </div>
    `;
  }).join('');

  // Nav cart count badge
  const totalCartItems = ticket.items.reduce((acc, it) => acc + it.qty, 0);
  const navCartBadge = document.getElementById('nav-cart-count');
  if (navCartBadge) navCartBadge.textContent = totalCartItems;

  if (ticket.items.length === 0) {
    itemsContainer.innerHTML = '';
    emptyState.style.display = 'flex';
  } else {
    emptyState.style.display = 'none';
    itemsContainer.innerHTML = ticket.items.map(item => {
      const lineTotal = item.qty * item.price;
      return `
        <div class="cart-item-row" data-item-id="${item.id}">
          <div class="cart-item-info">
            <span class="cart-item-title" title="${item.name}">${item.name}</span>
            <span class="cart-item-sub">${formatMoney(item.price)} &bull; ${item.unit || 'pcs'}</span>
          </div>
          <div class="cart-qty-ctrl">
            <button class="qty-btn" data-action="dec" data-id="${item.id}">-</button>
            <input type="text" class="qty-input" data-id="${item.id}" value="${item.qty}" />
            <button class="qty-btn" data-action="inc" data-id="${item.id}">+</button>
          </div>
          <div class="cart-item-price">${formatMoney(item.price)}</div>
          <div class="cart-item-total">${formatMoney(lineTotal)}</div>
          <button class="cart-item-del" data-action="del" data-id="${item.id}" title="Remove item">
            <i data-lucide="trash-2" style="width:15px; height:15px;"></i>
          </button>
        </div>
      `;
    }).join('');
  }

  // Calculate Cart Financials
  const subtotal = ticket.items.reduce((sum, it) => sum + (it.qty * it.price), 0);
  let discountAmount = 0;
  if (ticket.discount > 0) {
    if (ticket.discountType === '%') {
      discountAmount = (subtotal * ticket.discount) / 100;
    } else {
      discountAmount = Math.min(ticket.discount, subtotal);
    }
  }

  const taxableBase = Math.max(0, subtotal - discountAmount);
  let taxAmount = 0;
  if (ticket.taxEnabled) {
    const taxRate = AppState.settings.defaultTaxRate || 18;
    taxAmount = Math.round((taxableBase * taxRate) / 100);
  }

  const grandTotal = taxableBase + taxAmount;

  // Update DOM Totals
  document.getElementById('cart-item-count').textContent = totalCartItems;
  document.getElementById('cart-subtotal-val').textContent = formatMoney(subtotal);

  const discountRow = document.getElementById('discount-display-row');
  if (discountAmount > 0) {
    discountRow.style.display = 'flex';
    document.getElementById('cart-discount-val').textContent = `- ${formatMoney(discountAmount)}`;
  } else {
    discountRow.style.display = 'none';
  }

  const taxRow = document.getElementById('tax-display-row');
  if (ticket.taxEnabled) {
    taxRow.style.display = 'flex';
    document.getElementById('cart-tax-val').textContent = formatMoney(taxAmount);
    document.getElementById('tax-status-label').textContent = `VAT ${AppState.settings.defaultTaxRate}%`;
  } else {
    taxRow.style.display = 'none';
    document.getElementById('tax-status-label').textContent = 'Exempt';
  }

  document.getElementById('tax-toggle').checked = !!ticket.taxEnabled;
  document.getElementById('cart-discount-input').value = ticket.discount || '';
  document.getElementById('cart-discount-type').value = ticket.discountType || 'UGX';

  document.getElementById('cart-total-val').textContent = formatMoney(grandTotal);
  document.getElementById('checkout-btn-total').textContent = formatMoney(grandTotal);

  if (window.lucide) {
    lucide.createIcons();
  }
}

// Add item to cart
function addItemToCart(productId, quantity = 1) {
  const product = AppState.products.find(p => p.id === productId);
  if (!product) return;

  if (product.stock <= 0) {
    sound.play('error');
    alert(`"${product.name}" is currently OUT OF STOCK! Please restock before selling.`);
    return;
  }

  const ticket = getActiveTicket();
  const existingItem = ticket.items.find(item => item.id === productId);

  if (existingItem) {
    if (existingItem.qty + quantity > product.stock) {
      sound.play('error');
      alert(`Cannot add more than available stock (${product.stock} ${product.unit || 'units'}).`);
      return;
    }
    existingItem.qty += quantity;
  } else {
    ticket.items.push({
      id: product.id,
      barcode: product.barcode,
      name: product.name,
      price: product.price,
      costPrice: product.costPrice,
      qty: quantity,
      unit: product.unit
    });
  }

  sound.play('beep');
  saveActiveTickets();
  renderCart();
}

// Update Cart item quantity
function updateCartItemQty(productId, newQty) {
  const ticket = getActiveTicket();
  const item = ticket.items.find(it => it.id === productId);
  if (!item) return;

  const product = AppState.products.find(p => p.id === productId);
  const parsedQty = parseInt(newQty, 10);

  if (isNaN(parsedQty) || parsedQty <= 0) {
    ticket.items = ticket.items.filter(it => it.id !== productId);
    sound.play('click');
  } else {
    if (product && parsedQty > product.stock) {
      sound.play('error');
      alert(`Requested quantity exceeds available stock (${product.stock}).`);
      item.qty = product.stock;
    } else {
      item.qty = parsedQty;
      sound.play('click');
    }
  }

  saveActiveTickets();
  renderCart();
}

// =============================================================================
// 7. INVENTORY & STOCK MANAGEMENT VIEW (WITH RBAC MASKING)
// =============================================================================

function renderInventoryTable() {
  const tbody = document.getElementById('inventory-table-body');
  const catFilter = document.getElementById('inventory-cat-filter');
  const stockFilter = document.getElementById('inventory-stock-filter');
  const searchInput = document.getElementById('inventory-search');

  let list = [...AppState.products];

  // Filters
  const selectedCat = catFilter ? catFilter.value : 'ALL';
  if (selectedCat !== 'ALL') {
    list = list.filter(p => p.category === selectedCat);
  }

  const selectedStock = stockFilter ? stockFilter.value : 'ALL';
  if (selectedStock === 'IN_STOCK') {
    list = list.filter(p => p.stock > p.minStock);
  } else if (selectedStock === 'LOW_STOCK') {
    list = list.filter(p => p.stock > 0 && p.stock <= p.minStock);
  } else if (selectedStock === 'OUT_OF_STOCK') {
    list = list.filter(p => p.stock <= 0);
  }

  const q = searchInput ? searchInput.value.toLowerCase().trim() : '';
  if (q) {
    list = list.filter(p => 
      p.name.toLowerCase().includes(q) ||
      p.barcode.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q)
    );
  }

  // Update Low Stock badge in navigation
  const lowStockCount = AppState.products.filter(p => p.stock <= p.minStock).length;
  const navLowBadge = document.getElementById('nav-low-stock-count');
  const kpiLowNum = document.getElementById('kpi-low-stock-num');
  if (navLowBadge) navLowBadge.textContent = lowStockCount;
  if (kpiLowNum) kpiLowNum.textContent = lowStockCount;

  if (list.length === 0) {
    tbody.innerHTML = `<tr><td colspan="8" class="text-muted text-center" style="padding: 2rem;">No products match the selected criteria.</td></tr>`;
    return;
  }

  const isAdmin = isCurrentUserAdmin();

  // Hide or Show Table Header columns for Cost & Margin based on role
  const costHeaders = document.querySelectorAll('.col-cost');
  const marginHeaders = document.querySelectorAll('.col-margin');
  costHeaders.forEach(th => th.style.display = isAdmin ? 'table-cell' : 'none');
  marginHeaders.forEach(th => th.style.display = isAdmin ? 'table-cell' : 'none');

  tbody.innerHTML = list.map(p => {
    let statusBadge = '<span class="stock-tag in-stock">Good Stock</span>';
    if (p.stock <= 0) {
      statusBadge = '<span class="stock-tag out-stock">Out of Stock</span>';
    } else if (p.stock <= p.minStock) {
      statusBadge = `<span class="stock-tag low-stock">Low Stock (≤ ${p.minStock})</span>`;
    }

    const marginPct = p.costPrice > 0 ? Math.round(((p.price - p.costPrice) / p.costPrice) * 100) : 0;

    return `
      <tr>
        <td>
          <div style="font-weight: 700; color: #fff;">${p.name}</div>
          <div class="text-dim font-mono" style="font-size: 0.72rem;">SKU: ${p.barcode} &bull; ${p.unit}</div>
        </td>
        <td><span class="prod-category-tag">${p.category}</span></td>
        ${isAdmin ? `<td class="font-mono col-cost">${formatMoney(p.costPrice)}</td>` : ''}
        <td class="font-mono text-emerald font-bold">${formatMoney(p.price)}</td>
        <td class="font-mono font-bold">${p.stock} ${p.unit}</td>
        ${isAdmin ? `<td class="font-mono text-sapphire col-margin">${marginPct}%</td>` : ''}
        <td>${statusBadge}</td>
        <td>
          <div style="display: flex; gap: 4px;">
            <button class="btn btn-secondary btn-xs" data-action="adjust-stock" data-id="${p.id}" title="Restock / Adjust">
              <i data-lucide="layers" style="width:13px; height:13px;"></i> Adjust
            </button>
            <button class="btn btn-secondary btn-xs" data-action="edit-product" data-id="${p.id}" title="Edit product">
              <i data-lucide="edit-3" style="width:13px; height:13px;"></i>
            </button>
            ${isAdmin ? `
              <button class="btn btn-danger btn-xs" data-action="del-product" data-id="${p.id}" title="Delete product">
                <i data-lucide="trash" style="width:13px; height:13px;"></i>
              </button>
            ` : ''}
          </div>
        </td>
      </tr>
    `;
  }).join('');

  if (window.lucide) {
    lucide.createIcons();
  }
}

// =============================================================================
// 8. SALES ANALYTICS & LEDGER (ADMIN ONLY)
// =============================================================================

function renderSalesAnalytics() {
  const sales = AppState.sales;
  const todayStr = new Date().toISOString().slice(0, 10);

  // Filter today's sales
  const todaySales = sales.filter(s => s.timestamp.startsWith(todayStr));
  const totalRevenue = todaySales.reduce((acc, s) => acc + s.total, 0);
  const totalOrders = todaySales.length;

  let totalProfit = 0;
  todaySales.forEach(sale => {
    sale.items.forEach(item => {
      const cost = (item.costPrice || 0) * item.qty;
      const rev = (item.price || 0) * item.qty;
      totalProfit += (rev - cost);
    });
  });

  const avgBasket = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0;
  const marginPct = totalRevenue > 0 ? Math.round((totalProfit / totalRevenue) * 100) : 0;

  // Update KPI Cards
  const navRev = document.getElementById('nav-today-rev');
  if (navRev) navRev.textContent = formatMoney(totalRevenue);

  const kpiSales = document.getElementById('kpi-today-sales');
  if (kpiSales) kpiSales.textContent = formatMoney(totalRevenue);

  const kpiCount = document.getElementById('kpi-today-count');
  if (kpiCount) kpiCount.textContent = `${totalOrders} orders completed today`;

  const kpiProfit = document.getElementById('kpi-today-profit');
  if (kpiProfit) kpiProfit.textContent = formatMoney(totalProfit);

  const kpiMargin = document.getElementById('kpi-margin-pct');
  if (kpiMargin) kpiMargin.textContent = `${marginPct}% Gross Margin`;

  const kpiBasket = document.getElementById('kpi-avg-basket');
  if (kpiBasket) kpiBasket.textContent = formatMoney(avgBasket);

  // Payment Breakdown Bars
  const methodTotals = { CASH: 0, MTN_MOMO: 0, AIRTEL_MONEY: 0, CARD: 0, CREDIT: 0 };
  sales.forEach(s => {
    const m = s.paymentMethod || 'CASH';
    if (methodTotals[m] !== undefined) methodTotals[m] += s.total;
  });

  const grandAllTime = Object.values(methodTotals).reduce((a, b) => a + b, 0) || 1;
  const methodsMeta = [
    { key: 'CASH', label: 'Cash Tendered', color: '#10b981' },
    { key: 'MTN_MOMO', label: 'MTN Mobile Money', color: '#f59e0b' },
    { key: 'AIRTEL_MONEY', label: 'Airtel Money', color: '#ef4444' },
    { key: 'CARD', label: 'Visa / Mastercard', color: '#3b82f6' },
    { key: 'CREDIT', label: 'Store Credit (Debtors)', color: '#8b5cf6' }
  ];

  const payBarsContainer = document.getElementById('payment-method-breakdown');
  if (payBarsContainer) {
    payBarsContainer.innerHTML = methodsMeta.map(m => {
      const amt = methodTotals[m.key] || 0;
      const pct = Math.round((amt / grandAllTime) * 100);
      return `
        <div class="pay-bar-item">
          <div class="pay-bar-header">
            <span>${m.label}</span>
            <span class="font-mono font-bold">${formatMoney(amt)} (${pct}%)</span>
          </div>
          <div class="progress-track">
            <div class="progress-fill" style="width: ${pct}%; background-color: ${m.color};"></div>
          </div>
        </div>
      `;
    }).join('');
  }

  // Top Selling Products Rank
  const itemQtyMap = {};
  sales.forEach(s => {
    s.items.forEach(it => {
      if (!itemQtyMap[it.name]) {
        itemQtyMap[it.name] = { name: it.name, qty: 0, revenue: 0 };
      }
      itemQtyMap[it.name].qty += it.qty;
      itemQtyMap[it.name].revenue += (it.qty * it.price);
    });
  });

  const sortedTopItems = Object.values(itemQtyMap).sort((a, b) => b.qty - a.qty).slice(0, 5);
  const topProductsContainer = document.getElementById('top-products-list');

  if (topProductsContainer) {
    if (sortedTopItems.length === 0) {
      topProductsContainer.innerHTML = '<p class="text-muted small">No sales data recorded yet.</p>';
    } else {
      topProductsContainer.innerHTML = sortedTopItems.map((item, idx) => `
        <div class="top-prod-row">
          <div style="display: flex; align-items: center;">
            <div class="top-prod-rank">#${idx + 1}</div>
            <div>
              <div style="font-weight: 600; color: #fff; font-size: 0.85rem;">${item.name}</div>
              <div class="text-dim font-mono" style="font-size: 0.72rem;">${item.qty} units sold</div>
            </div>
          </div>
          <div class="font-mono font-bold text-emerald" style="font-size: 0.88rem;">${formatMoney(item.revenue)}</div>
        </div>
      `).join('');
    }
  }

  renderSalesTable();
}

function renderSalesTable() {
  const tbody = document.getElementById('sales-table-body');
  if (!tbody) return;

  const searchInput = document.getElementById('sales-search-input');
  const q = searchInput ? searchInput.value.toLowerCase().trim() : '';

  let list = [...AppState.sales].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  if (q) {
    list = list.filter(s => 
      s.id.toLowerCase().includes(q) ||
      s.customerName.toLowerCase().includes(q) ||
      (s.paymentMethod || '').toLowerCase().includes(q) ||
      (s.cashier || '').toLowerCase().includes(q)
    );
  }

  if (list.length === 0) {
    tbody.innerHTML = `<tr><td colspan="8" class="text-muted text-center" style="padding: 2rem;">No transaction records found.</td></tr>`;
    return;
  }

  tbody.innerHTML = list.map(s => {
    const formattedDate = new Date(s.timestamp).toLocaleString('en-GB', {
      day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
    });

    const itemsSummary = s.items.map(it => `${it.qty}x ${it.name}`).join(', ');

    let methodTag = `<span class="badge-counter" style="background:#10b981; color:#000;">${s.paymentMethod}</span>`;
    if (s.paymentMethod === 'MTN_MOMO') methodTag = `<span class="badge-counter" style="background:#f59e0b; color:#000;">MTN MoMo</span>`;
    if (s.paymentMethod === 'AIRTEL_MONEY') methodTag = `<span class="badge-counter" style="background:#ef4444; color:#fff;">Airtel</span>`;
    if (s.paymentMethod === 'CARD') methodTag = `<span class="badge-counter" style="background:#3b82f6; color:#fff;">Card</span>`;
    if (s.paymentMethod === 'CREDIT') methodTag = `<span class="badge-counter" style="background:#8b5cf6; color:#fff;">Store Credit</span>`;

    return `
      <tr>
        <td class="font-mono font-bold text-sapphire">${s.id}</td>
        <td style="font-size: 0.78rem;">${formattedDate}</td>
        <td><strong style="color: #fff;">${s.customerName}</strong></td>
        <td>${methodTag}</td>
        <td style="max-width: 250px; font-size: 0.78rem; color: #94a3b8;" class="truncate" title="${itemsSummary}">${itemsSummary}</td>
        <td class="font-mono font-bold text-emerald">${formatMoney(s.total)}</td>
        <td style="font-size: 0.78rem;">${s.cashier}</td>
        <td>
          <button class="btn btn-secondary btn-xs" data-action="view-receipt" data-id="${s.id}">
            <i data-lucide="printer" style="width:13px; height:13px;"></i> Slip
          </button>
        </td>
      </tr>
    `;
  }).join('');

  if (window.lucide) {
    lucide.createIcons();
  }
}

// =============================================================================
// 9. CUSTOMERS & CREDIT (DEBTORS)
// =============================================================================

function renderCustomersTable() {
  const tbody = document.getElementById('customers-table-body');
  if (!tbody) return;
  const customers = AppState.customers;

  const totalDebt = customers.reduce((sum, c) => sum + (c.debtBalance || 0), 0);
  const activeDebtors = customers.filter(c => (c.debtBalance || 0) > 0).length;

  const totalCustEl = document.getElementById('debtor-stat-total-cust');
  const activeCountEl = document.getElementById('debtor-stat-active-count');
  const totalDebtEl = document.getElementById('debtor-stat-total-debt');
  const navDebtorsBadge = document.getElementById('nav-debtors-count');

  if (totalCustEl) totalCustEl.textContent = customers.length;
  if (activeCountEl) activeCountEl.textContent = activeDebtors;
  if (totalDebtEl) totalDebtEl.textContent = formatMoney(totalDebt);
  if (navDebtorsBadge) navDebtorsBadge.textContent = activeDebtors;

  if (customers.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" class="text-muted text-center" style="padding: 2rem;">No registered customers in system.</td></tr>`;
    return;
  }

  tbody.innerHTML = customers.map(c => {
    const debtClass = c.debtBalance > 0 ? 'text-ruby font-bold' : 'text-muted';
    return `
      <tr>
        <td>
          <strong style="color: #fff; font-size: 0.9rem;">${c.name}</strong>
          <div class="text-dim" style="font-size: 0.72rem;">ID: ${c.id}</div>
        </td>
        <td class="font-mono">${c.phone}</td>
        <td>${c.address || 'Kampala'}</td>
        <td class="font-mono">${formatMoney(c.creditLimit || 0)}</td>
        <td class="font-mono ${debtClass}">${formatMoney(c.debtBalance || 0)}</td>
        <td class="font-mono text-emerald">${formatMoney(c.totalSpent || 0)}</td>
        <td>
          <div style="display: flex; gap: 4px;">
            ${c.debtBalance > 0 ? `
              <button class="btn btn-primary btn-xs" data-action="repay-debt" data-id="${c.id}" title="Record Repayment">
                <i data-lucide="hand-coins" style="width:13px; height:13px;"></i> Repay
              </button>
            ` : ''}
            <button class="btn btn-secondary btn-xs" data-action="edit-customer" data-id="${c.id}">
              <i data-lucide="edit-2" style="width:13px; height:13px;"></i>
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join('');

  if (window.lucide) {
    lucide.createIcons();
  }
}

// =============================================================================
// 10. SHIFT & CASH DRAWER RECONCILIATION
// =============================================================================

function calculateShiftMetrics() {
  const shift = AppState.shift;
  const cashSales = AppState.sales
    .filter(s => (s.paymentMethod === 'CASH'))
    .reduce((sum, s) => sum + s.total, 0);

  const mtnSales = AppState.sales
    .filter(s => s.paymentMethod === 'MTN_MOMO')
    .reduce((sum, s) => sum + s.total, 0);

  const airtelSales = AppState.sales
    .filter(s => s.paymentMethod === 'AIRTEL_MONEY')
    .reduce((sum, s) => sum + s.total, 0);

  const cardSales = AppState.sales
    .filter(s => s.paymentMethod === 'CARD')
    .reduce((sum, s) => sum + s.total, 0);

  const creditSales = AppState.sales
    .filter(s => s.paymentMethod === 'CREDIT')
    .reduce((sum, s) => sum + s.total, 0);

  const initialFloat = shift.openingFloat || 150000;
  const additionalCashIn = shift.movements
    .filter(m => m.type === 'CASH_IN' && m.reason !== 'Initial Morning Float')
    .reduce((s, m) => s + m.amount, 0);
  const totalCashOut = shift.movements
    .filter(m => m.type === 'CASH_OUT')
    .reduce((s, m) => s + m.amount, 0);

  const expectedCashInDrawer = initialFloat + cashSales + additionalCashIn - totalCashOut;
  const totalGrossShift = cashSales + mtnSales + airtelSales + cardSales + creditSales;

  return {
    initialFloat,
    cashSales,
    mtnSales,
    airtelSales,
    cardSales,
    creditSales,
    totalGrossShift,
    totalCashOut,
    additionalCashIn,
    expectedCashInDrawer
  };
}

function renderShiftView() {
  const shift = AppState.shift;
  const m = calculateShiftMetrics();
  const isAdmin = isCurrentUserAdmin();

  const cashierDisp = document.getElementById('shift-cashier-display');
  const startTimeDisp = document.getElementById('shift-start-time');
  const floatDisp = document.getElementById('shift-opening-float');
  const headerDrawerTag = document.getElementById('header-drawer-tag');
  const expectedCashDisp = document.getElementById('drawer-expected-cash');

  if (cashierDisp) cashierDisp.textContent = AppState.currentUser.name;
  if (startTimeDisp) startTimeDisp.textContent = shift.startTime || '08:00 AM Today';

  if (isAdmin) {
    if (floatDisp) floatDisp.textContent = formatMoney(m.initialFloat);
    if (headerDrawerTag) headerDrawerTag.textContent = `Drawer: ${formatMoney(m.expectedCashInDrawer)}`;
    if (expectedCashDisp) expectedCashDisp.textContent = formatMoney(m.expectedCashInDrawer);

    document.getElementById('shift-tender-cash').textContent = formatMoney(m.cashSales);
    document.getElementById('shift-tender-mtn').textContent = formatMoney(m.mtnSales);
    document.getElementById('shift-tender-airtel').textContent = formatMoney(m.airtelSales);
    document.getElementById('shift-tender-card').textContent = formatMoney(m.cardSales);
    document.getElementById('shift-tender-credit').textContent = formatMoney(m.creditSales);
    document.getElementById('shift-tender-total').textContent = formatMoney(m.totalGrossShift);
  } else {
    // Mask cash figures for workers
    if (floatDisp) floatDisp.textContent = 'Protected (Admin)';
    if (expectedCashDisp) expectedCashDisp.textContent = 'UGX ••••••';

    document.getElementById('shift-tender-cash').textContent = '••••••';
    document.getElementById('shift-tender-mtn').textContent = '••••••';
    document.getElementById('shift-tender-airtel').textContent = '••••••';
    document.getElementById('shift-tender-card').textContent = '••••••';
    document.getElementById('shift-tender-credit').textContent = '••••••';
    document.getElementById('shift-tender-total').textContent = 'Protected';
  }

  // Movements List
  const listEl = document.getElementById('cash-movements-list');
  if (listEl) {
    if (shift.movements.length === 0) {
      listEl.innerHTML = '<p class="text-muted small">No petty cash movements logged.</p>';
    } else {
      listEl.innerHTML = shift.movements.map(mov => {
        const isPlus = mov.type === 'CASH_IN';
        const colorClass = isPlus ? 'text-emerald' : 'text-ruby';
        const sign = isPlus ? '+' : '-';
        const amtStr = isAdmin ? `${sign} ${formatMoney(mov.amount)}` : `${sign} UGX ••••••`;
        return `
          <div class="movement-item">
            <div>
              <strong style="color: #fff;">${mov.reason}</strong>
              <div class="text-dim" style="font-size: 0.72rem;">${mov.time || 'Today'}</div>
            </div>
            <span class="font-mono font-bold ${colorClass}">${amtStr}</span>
          </div>
        `;
      }).join('');
    }
  }
}

// =============================================================================
// 11. STAFF & ROLE MANAGEMENT (ADMIN ONLY PANEL)
// =============================================================================

function renderStaffTable() {
  const tbody = document.getElementById('staff-table-body');
  if (!tbody) return;

  const users = AppState.users;
  const currentUserId = AppState.currentUser ? AppState.currentUser.id : '';

  tbody.innerHTML = users.map(u => {
    const isThisAdmin = u.role === 'ADMIN';
    const isSelf = u.id === currentUserId;

    const roleBadge = isThisAdmin
      ? '<span class="role-badge admin">MAIN ADMIN</span>'
      : '<span class="role-badge cashier">CASHIER / WORKER</span>';

    const cashAccess = isThisAdmin
      ? '<span class="text-emerald font-bold"><i data-lucide="check-circle-2" style="width:14px; height:14px; vertical-align:middle;"></i> Full Cash Access</span>'
      : '<span class="text-ruby font-bold"><i data-lucide="x-circle" style="width:14px; height:14px; vertical-align:middle;"></i> Blocked (No Reports)</span>';

    const marginAccess = isThisAdmin
      ? '<span class="text-emerald font-bold"><i data-lucide="check" style="width:14px; height:14px; vertical-align:middle;"></i> Visible</span>'
      : '<span class="text-dim font-bold"><i data-lucide="lock" style="width:14px; height:14px; vertical-align:middle;"></i> Masked</span>';

    return `
      <tr>
        <td>
          <div style="font-weight: 700; color: #fff;">${u.name} ${isSelf ? '<span class="text-sapphire small">(You)</span>' : ''}</div>
          <div class="text-dim font-mono" style="font-size: 0.72rem;">Username: @${u.username} &bull; ID: ${u.id}</div>
        </td>
        <td>${roleBadge}</td>
        <td>${cashAccess}</td>
        <td>${marginAccess}</td>
        <td class="font-mono font-bold text-amber">&bull;&bull;&bull;&bull; (${u.pin})</td>
        <td>${u.phone || 'N/A'}</td>
        <td>
          <div style="display: flex; gap: 4px;">
            <button class="btn btn-secondary btn-xs" data-action="edit-staff-role" data-id="${u.id}" title="Change Role">
              <i data-lucide="user-cog" style="width:13px; height:13px;"></i> Role
            </button>
            <button class="btn btn-secondary btn-xs" data-action="edit-staff-pin" data-id="${u.id}" title="Change PIN">
              <i data-lucide="key" style="width:13px; height:13px;"></i> PIN
            </button>
            ${!isSelf && users.length > 1 ? `
              <button class="btn btn-danger btn-xs" data-action="del-staff" data-id="${u.id}" title="Remove staff account">
                <i data-lucide="trash" style="width:13px; height:13px;"></i>
              </button>
            ` : ''}
          </div>
        </td>
      </tr>
    `;
  }).join('');

  if (window.lucide) {
    lucide.createIcons();
  }
}

function openStaffModal(staffId = null) {
  const form = document.getElementById('staff-form');
  form.reset();

  if (staffId) {
    const u = AppState.users.find(usr => usr.id === staffId);
    if (!u) return;
    document.getElementById('staff-modal-title').textContent = 'Edit Staff Member / Role';
    document.getElementById('staff-edit-id').value = u.id;
    document.getElementById('staff-name-input').value = u.name;
    document.getElementById('staff-username-input').value = u.username;
    document.getElementById('staff-role-select').value = u.role;
    document.getElementById('staff-pin-setting').value = u.pin;
    document.getElementById('staff-phone-input').value = u.phone || '';
  } else {
    document.getElementById('staff-modal-title').textContent = 'Add New Staff Member';
    document.getElementById('staff-edit-id').value = '';
    document.getElementById('staff-role-select').value = 'CASHIER';
    document.getElementById('staff-pin-setting').value = Math.floor(1000 + Math.random() * 9000).toString();
  }

  document.getElementById('staff-modal').classList.add('open');
}

function saveStaffMemberFromForm(e) {
  e.preventDefault();
  const id = document.getElementById('staff-edit-id').value;
  const name = document.getElementById('staff-name-input').value.trim();
  const username = document.getElementById('staff-username-input').value.trim().toLowerCase();
  const role = document.getElementById('staff-role-select').value;
  const pin = document.getElementById('staff-pin-setting').value.trim();
  const phone = document.getElementById('staff-phone-input').value.trim();

  if (!pin || pin.length < 4) {
    alert('PIN must be at least 4 digits.');
    return;
  }

  if (id) {
    const u = AppState.users.find(usr => usr.id === id);
    if (u) {
      u.name = name;
      u.username = username;
      u.role = role;
      u.pin = pin;
      u.phone = phone;
      u.title = role === 'ADMIN' ? 'Main Admin / Store Owner' : 'Cashier / Worker';
      u.avatar = name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
    }
  } else {
    // New user
    const newId = `USR-${(AppState.users.length + 1).toString().padStart(3, '0')}`;
    AppState.users.push({
      id: newId,
      name,
      username,
      role,
      pin,
      phone,
      avatar: name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase(),
      title: role === 'ADMIN' ? 'Main Admin / Store Owner' : 'Cashier / Worker'
    });
  }

  saveToStorage(STORAGE_KEYS.USERS, AppState.users);
  document.getElementById('staff-modal').classList.remove('open');
  sound.play('success');
  alert(`Staff member "${name}" saved with role "${role === 'ADMIN' ? 'Main Admin' : 'Cashier (Restricted)'}".`);

  // If editing currently active user, re-apply permissions
  if (AppState.currentUser && AppState.currentUser.id === id) {
    AppState.currentUser = AppState.users.find(usr => usr.id === id);
    saveToStorage(STORAGE_KEYS.CURRENT_USER_ID, AppState.currentUser.id);
    applyUserPermissions();
  } else {
    renderStaffTable();
  }
}

// =============================================================================
// 12. USER SWITCHER & TOUCH PIN AUTHENTICATION
// =============================================================================

function openUserSwitcherModal() {
  const modal = document.getElementById('user-modal');
  const pickerGrid = document.getElementById('staff-picker-grid');
  const pinSection = document.getElementById('pin-entry-section');

  pinSection.style.display = 'none';
  pickerGrid.style.display = 'grid';
  AppState.loginSelectedUser = null;
  AppState.pinEntered = '';
  updatePinDots();

  // Populate users list
  pickerGrid.innerHTML = AppState.users.map(u => {
    const isCurrent = AppState.currentUser && AppState.currentUser.id === u.id;
    const isAdm = u.role === 'ADMIN';
    return `
      <div class="staff-card-btn" data-user-id="${u.id}">
        <div class="staff-card-left">
          <div class="user-avatar" style="${isAdm ? 'background: linear-gradient(135deg, #f59e0b, #b45309);' : ''}">
            ${u.avatar}
          </div>
          <div>
            <strong style="color: #fff; font-size: 0.95rem;">${u.name}</strong>
            <div class="text-dim" style="font-size: 0.75rem;">@${u.username} &bull; ${u.title}</div>
          </div>
        </div>
        <div style="display: flex; align-items: center; gap: 8px;">
          <span class="role-badge ${isAdm ? 'admin' : 'cashier'}">${isAdm ? 'ADMIN' : 'CASHIER'}</span>
          ${isCurrent ? '<span class="text-emerald font-bold small">&bull; Active</span>' : ''}
          <i data-lucide="chevron-right" style="width:16px; height:16px; color: var(--text-dim);"></i>
        </div>
      </div>
    `;
  }).join('');

  modal.classList.add('open');
  if (window.lucide) lucide.createIcons();
}

function selectUserForLogin(userId) {
  const user = AppState.users.find(u => u.id === userId);
  if (!user) return;

  AppState.loginSelectedUser = user;
  AppState.pinEntered = '';

  document.getElementById('staff-picker-grid').style.display = 'none';
  const pinSec = document.getElementById('pin-entry-section');
  pinSec.style.display = 'block';

  document.getElementById('login-selected-avatar').textContent = user.avatar;
  document.getElementById('login-selected-name').textContent = user.name;
  
  const isAdm = user.role === 'ADMIN';
  document.getElementById('login-selected-role-tag').innerHTML = `
    <span class="role-badge ${isAdm ? 'admin' : 'cashier'}">${isAdm ? 'MAIN ADMIN' : 'CASHIER / WORKER'}</span>
  `;

  document.getElementById('pin-error-msg').style.display = 'none';
  updatePinDots();

  const pinInput = document.getElementById('staff-pin-input');
  pinInput.value = '';
  pinInput.focus();
}

function updatePinDots() {
  const dotsRow = document.getElementById('pin-dots-row');
  if (!dotsRow) return;
  const count = AppState.pinEntered.length;
  dotsRow.innerHTML = [0, 1, 2, 3].map(i => `
    <span class="pin-dot ${i < count ? 'filled' : ''}"></span>
  `).join('');
}

function handlePinInput(char) {
  if (char === 'CLEAR') {
    AppState.pinEntered = '';
  } else if (char === 'BACK') {
    AppState.pinEntered = AppState.pinEntered.slice(0, -1);
  } else if (/^[0-9]$/.test(char) && AppState.pinEntered.length < 6) {
    AppState.pinEntered += char;
  }

  updatePinDots();
  const inputEl = document.getElementById('staff-pin-input');
  if (inputEl) inputEl.value = AppState.pinEntered;

  // Auto-verify if 4 digits
  if (AppState.pinEntered.length === 4) {
    verifyAndCompleteLogin();
  }
}

function verifyAndCompleteLogin() {
  const user = AppState.loginSelectedUser;
  if (!user) return;

  if (AppState.pinEntered === user.pin) {
    // Success!
    AppState.currentUser = user;
    saveToStorage(STORAGE_KEYS.CURRENT_USER_ID, user.id);
    document.getElementById('user-modal').classList.remove('open');
    sound.play('success');

    // Apply permissions
    applyUserPermissions();

    // If worker tried to access sales/settings before, switch them back to register tab safely
    if (user.role !== 'ADMIN') {
      const activeTabBtn = document.querySelector('.nav-tab.active');
      const activeTabId = activeTabBtn ? activeTabBtn.dataset.tab : '';
      if (activeTabId === 'sales-tab' || activeTabId === 'settings-tab') {
        document.querySelector('.nav-tab[data-tab="register-tab"]').click();
      }
    }
  } else {
    // Incorrect PIN
    sound.play('error');
    const errEl = document.getElementById('pin-error-msg');
    errEl.style.display = 'block';
    AppState.pinEntered = '';
    updatePinDots();
  }
}

// =============================================================================
// 13. CHECKOUT & RECEIPT PRINTING WORKFLOW
// =============================================================================

function openPaymentModal() {
  const ticket = getActiveTicket();
  if (ticket.items.length === 0) {
    sound.play('error');
    alert('Cannot checkout: Current cart ticket is empty. Scan or select products first.');
    return;
  }

  const subtotal = ticket.items.reduce((s, it) => s + (it.qty * it.price), 0);
  let discountAmount = 0;
  if (ticket.discount > 0) {
    if (ticket.discountType === '%') {
      discountAmount = (subtotal * ticket.discount) / 100;
    } else {
      discountAmount = Math.min(ticket.discount, subtotal);
    }
  }

  let taxAmount = 0;
  if (ticket.taxEnabled) {
    taxAmount = Math.round(((subtotal - discountAmount) * (AppState.settings.defaultTaxRate || 18)) / 100);
  }

  const grandTotal = Math.max(0, subtotal - discountAmount + taxAmount);

  document.getElementById('pay-total-due').textContent = formatMoney(grandTotal);
  const totalItemCount = ticket.items.reduce((acc, it) => acc + it.qty, 0);
  document.getElementById('pay-item-summary').textContent = `${totalItemCount} items in ticket`;

  const custObj = AppState.customers.find(c => c.id === ticket.customerId);
  const custName = custObj ? custObj.name : 'Walk-in Customer (General)';
  document.getElementById('pay-modal-customer').textContent = `Customer: ${custName}`;

  const creditStatus = document.getElementById('credit-cust-status');
  if (custObj) {
    creditStatus.innerHTML = `
      <strong>${custObj.name}</strong><br>
      Available Credit Limit: <strong>${formatMoney(custObj.creditLimit - custObj.debtBalance)}</strong><br>
      Current Outstanding Debt: <span class="text-ruby">${formatMoney(custObj.debtBalance)}</span>
    `;
  } else {
    creditStatus.innerHTML = `
      <em>Note: Walk-in customers cannot purchase on Store Credit. Please select a registered debtor customer from the register customer dropdown.</em>
    `;
  }

  const tenderInput = document.getElementById('cash-tendered-input');
  tenderInput.value = grandTotal;
  updateChangeDisplay(grandTotal, grandTotal);

  const chipsContainer = document.getElementById('modal-quick-tender');
  const denominations = [grandTotal, Math.ceil(grandTotal / 5000) * 5000, Math.ceil(grandTotal / 10000) * 10000, Math.ceil(grandTotal / 50000) * 50000, 100000, 200000];
  const uniqueDenoms = Array.from(new Set(denominations)).filter(d => d >= grandTotal).slice(0, 4);

  chipsContainer.innerHTML = `
    <button class="tender-chip" data-amt="${grandTotal}">Exact (${formatMoney(grandTotal)})</button>
    ${uniqueDenoms.map(amt => `
      <button class="tender-chip" data-amt="${amt}">${formatMoney(amt)}</button>
    `).join('')}
  `;

  document.getElementById('payment-modal').classList.add('open');
  tenderInput.focus();
  tenderInput.select();
}

function updateChangeDisplay(tendered, totalDue) {
  const changeVal = document.getElementById('cash-change-val');
  const change = tendered - totalDue;

  if (change >= 0) {
    changeVal.className = 'change-val text-emerald';
    changeVal.textContent = formatMoney(change);
  } else {
    changeVal.className = 'change-val unpaid';
    changeVal.textContent = `Short by ${formatMoney(Math.abs(change))}`;
  }
}

function completeSaleTransaction() {
  const ticket = getActiveTicket();
  if (ticket.items.length === 0) return;

  const method = AppState.selectedPaymentMethod;
  const subtotal = ticket.items.reduce((s, it) => s + (it.qty * it.price), 0);

  let discountAmount = 0;
  if (ticket.discount > 0) {
    if (ticket.discountType === '%') {
      discountAmount = (subtotal * ticket.discount) / 100;
    } else {
      discountAmount = Math.min(ticket.discount, subtotal);
    }
  }

  let taxAmount = 0;
  if (ticket.taxEnabled) {
    taxAmount = Math.round(((subtotal - discountAmount) * (AppState.settings.defaultTaxRate || 18)) / 100);
  }
  const grandTotal = Math.max(0, subtotal - discountAmount + taxAmount);

  let tendered = grandTotal;
  let change = 0;
  let refCode = '';

  if (method === 'CASH') {
    tendered = parseFloat(document.getElementById('cash-tendered-input').value) || 0;
    if (tendered < grandTotal) {
      sound.play('error');
      alert(`Amount tendered (${formatMoney(tendered)}) is less than total payable (${formatMoney(grandTotal)}).`);
      return;
    }
    change = tendered - grandTotal;
  } else if (method === 'MTN_MOMO') {
    refCode = document.getElementById('mtn-ref-input').value || `MOMO-${Date.now().toString().slice(-6)}`;
  } else if (method === 'AIRTEL_MONEY') {
    refCode = document.getElementById('airtel-ref-input').value || `AIRTEL-${Date.now().toString().slice(-6)}`;
  } else if (method === 'CARD') {
    refCode = document.getElementById('card-ref-input').value || `AUTH-${Date.now().toString().slice(-6)}`;
  } else if (method === 'CREDIT') {
    const cust = AppState.customers.find(c => c.id === ticket.customerId);
    if (!cust) {
      sound.play('error');
      alert('Walk-in customers cannot purchase on Store Credit. Please register or select an account customer.');
      return;
    }
    if ((cust.debtBalance + grandTotal) > cust.creditLimit) {
      const proceed = confirm(`Customer has exceeded their credit limit of ${formatMoney(cust.creditLimit)}. Current debt is ${formatMoney(cust.debtBalance)}. Do you wish to override and approve on manager authority?`);
      if (!proceed) return;
    }
    cust.debtBalance += grandTotal;
    refCode = document.getElementById('credit-notes-input').value || 'On Store Account';
  }

  // Deduct inventory stock
  ticket.items.forEach(cartItem => {
    const prod = AppState.products.find(p => p.id === cartItem.id);
    if (prod) {
      prod.stock = Math.max(0, prod.stock - cartItem.qty);
    }
  });
  saveToStorage(STORAGE_KEYS.PRODUCTS, AppState.products);

  // Update customer total spend
  if (ticket.customerId !== 'walk-in') {
    const cust = AppState.customers.find(c => c.id === ticket.customerId);
    if (cust) {
      cust.totalSpent = (cust.totalSpent || 0) + grandTotal;
      saveToStorage(STORAGE_KEYS.CUSTOMERS, AppState.customers);
    }
  }

  // Generate Receipt Record
  const receiptNum = `BK-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${(AppState.sales.length + 1).toString().padStart(3, '0')}`;
  const custName = ticket.customerId === 'walk-in' ? 'Walk-in Customer' : (AppState.customers.find(c => c.id === ticket.customerId)?.name || 'Account Customer');

  const saleRecord = {
    id: receiptNum,
    timestamp: new Date().toISOString(),
    cashier: AppState.currentUser ? AppState.currentUser.name : 'Brian Bakyenga',
    customerId: ticket.customerId,
    customerName: custName,
    items: JSON.parse(JSON.stringify(ticket.items)),
    subtotal: subtotal,
    discount: discountAmount,
    tax: taxAmount,
    taxRate: ticket.taxEnabled ? AppState.settings.defaultTaxRate : 0,
    total: grandTotal,
    paymentMethod: method,
    tendered: tendered,
    change: change,
    reference: refCode
  };

  AppState.sales.unshift(saleRecord);
  saveToStorage(STORAGE_KEYS.SALES, AppState.sales);

  document.getElementById('payment-modal').classList.remove('open');
  sound.play('success');

  populateThermalReceipt(saleRecord);

  // Reset ticket
  ticket.items = [];
  ticket.discount = 0;
  ticket.taxEnabled = false;
  saveActiveTickets();

  // Re-render views
  renderProductCatalog();
  renderCart();
  renderSalesAnalytics();
  renderCustomersTable();
  renderShiftView();
  applyUserPermissions();

  document.getElementById('receipt-modal').classList.add('open');
}

function populateThermalReceipt(sale) {
  const s = AppState.settings;
  document.getElementById('rec-number').textContent = sale.id;
  document.getElementById('rec-date').textContent = new Date(sale.timestamp).toLocaleString('en-GB', {
    day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
  });
  document.getElementById('rec-cashier').textContent = sale.cashier;
  document.getElementById('rec-customer').textContent = sale.customerName;

  const tbody = document.getElementById('rec-items-body');
  tbody.innerHTML = sale.items.map(it => `
    <tr>
      <td class="rec-item-name">${it.name}</td>
      <td class="rec-item-qty">${it.qty}</td>
      <td class="rec-item-price">${formatMoney(it.price)}</td>
      <td class="rec-item-amt">${formatMoney(it.qty * it.price)}</td>
    </tr>
  `).join('');

  document.getElementById('rec-subtotal').textContent = formatMoney(sale.subtotal);

  const discRow = document.getElementById('rec-discount-row');
  if (sale.discount > 0) {
    discRow.style.display = 'flex';
    document.getElementById('rec-discount').textContent = `- ${formatMoney(sale.discount)}`;
  } else {
    discRow.style.display = 'none';
  }

  const taxRow = document.getElementById('rec-tax-row');
  if (sale.tax > 0) {
    taxRow.style.display = 'flex';
    document.getElementById('rec-tax').textContent = formatMoney(sale.tax);
  } else {
    taxRow.style.display = 'none';
  }

  document.getElementById('rec-grand-total').textContent = formatMoney(sale.total);
  document.getElementById('rec-pay-mode').textContent = sale.paymentMethod.replace('_', ' ');

  const tenderRow = document.getElementById('rec-tendered-row');
  const changeRow = document.getElementById('rec-change-row');

  if (sale.paymentMethod === 'CASH') {
    tenderRow.style.display = 'flex';
    changeRow.style.display = 'flex';
    document.getElementById('rec-tendered').textContent = formatMoney(sale.tendered);
    document.getElementById('rec-change').textContent = formatMoney(sale.change);
  } else {
    tenderRow.style.display = 'none';
    changeRow.style.display = 'none';
  }

  document.getElementById('rec-barcode-val').textContent = `*${sale.id.replace(/-/g, '')}*`;
  document.getElementById('rec-footer-text').textContent = s.receiptFooter;
}

// =============================================================================
// 14. PRODUCT CRUD & STOCK ADJUST MODALS
// =============================================================================

function openProductModal(prodId = null) {
  const form = document.getElementById('product-form');
  form.reset();

  // Reset custom category field
  const customCatWrap = document.getElementById('custom-cat-wrapper');
  if (customCatWrap) customCatWrap.style.display = 'none';

  if (prodId) {
    const p = AppState.products.find(item => item.id === prodId);
    if (!p) return;
    document.getElementById('product-modal-title').textContent = 'Edit Product Details';
    document.getElementById('prod-id').value = p.id;
    document.getElementById('prod-name').value = p.name;
    document.getElementById('prod-barcode').value = p.barcode;
    renderCategorySelects(p.category);
    document.getElementById('prod-category').value = p.category;
    document.getElementById('prod-cost').value = p.costPrice;
    document.getElementById('prod-price').value = p.price;
    document.getElementById('prod-stock').value = p.stock;
    document.getElementById('prod-min-stock').value = p.minStock;
    document.getElementById('prod-unit').value = p.unit || 'pcs';
  } else {
    document.getElementById('product-modal-title').textContent = 'Add New Product to Catalog';
    document.getElementById('prod-id').value = '';
    document.getElementById('prod-barcode').value = `600${Math.floor(1000 + Math.random() * 9000)}`;
    renderCategorySelects();
    document.getElementById('prod-min-stock').value = '10';
  }

  document.getElementById('product-modal').classList.add('open');
}

function saveProductFromForm(e) {
  e.preventDefault();
  const id = document.getElementById('prod-id').value;
  const name = document.getElementById('prod-name').value.trim();
  const barcode = document.getElementById('prod-barcode').value.trim();
  const category = document.getElementById('prod-category').value;
  const costPrice = parseFloat(document.getElementById('prod-cost').value) || 0;
  const price = parseFloat(document.getElementById('prod-price').value) || 0;
  const stock = parseInt(document.getElementById('prod-stock').value, 10) || 0;
  const minStock = parseInt(document.getElementById('prod-min-stock').value, 10) || 5;
  const unit = document.getElementById('prod-unit').value;

  if (id) {
    const p = AppState.products.find(item => item.id === id);
    if (p) {
      p.name = name;
      p.barcode = barcode;
      p.category = category;
      p.costPrice = costPrice;
      p.price = price;
      p.stock = stock;
      p.minStock = minStock;
      p.unit = unit;
    }
  } else {
    const newId = `PRD-${(AppState.products.length + 1).toString().padStart(3, '0')}`;
    AppState.products.unshift({
      id: newId,
      barcode,
      name,
      category,
      costPrice,
      price,
      stock,
      minStock,
      unit
    });
  }

  saveToStorage(STORAGE_KEYS.PRODUCTS, AppState.products);
  document.getElementById('product-modal').classList.remove('open');
  sound.play('success');

  renderProductCatalog();
  renderInventoryTable();
}

function openStockAdjustModal(prodId) {
  const prod = AppState.products.find(p => p.id === prodId);
  if (!prod) return;

  document.getElementById('adjust-prod-id').value = prod.id;
  document.getElementById('adjust-prod-title').textContent = `${prod.name} (${prod.barcode})`;
  document.getElementById('adjust-current-stock-val').textContent = `${prod.stock} ${prod.unit}`;
  document.getElementById('adjust-qty').value = '1';
  document.getElementById('adjust-reason').value = '';

  document.getElementById('stock-adjust-modal').classList.add('open');
}

function saveStockAdjustment(e) {
  e.preventDefault();
  const prodId = document.getElementById('adjust-prod-id').value;
  const type = document.getElementById('adjust-type').value;
  const qty = parseInt(document.getElementById('adjust-qty').value, 10) || 0;

  const prod = AppState.products.find(p => p.id === prodId);
  if (!prod) return;

  if (type === 'ADD') {
    prod.stock += qty;
  } else if (type === 'REMOVE') {
    prod.stock = Math.max(0, prod.stock - qty);
  } else if (type === 'SET') {
    prod.stock = Math.max(0, qty);
  }

  saveToStorage(STORAGE_KEYS.PRODUCTS, AppState.products);
  document.getElementById('stock-adjust-modal').classList.remove('open');
  sound.play('success');

  renderProductCatalog();
  renderInventoryTable();
}

// =============================================================================
// 15. CUSTOMER REGISTRATION & DEBT REPAYMENT
// =============================================================================

function openCustomerModal() {
  document.getElementById('customer-form').reset();
  document.getElementById('customer-modal').classList.add('open');
}

function saveCustomerFromForm(e) {
  e.preventDefault();
  const name = document.getElementById('cust-name').value.trim();
  const phone = document.getElementById('cust-phone').value.trim();
  const creditLimit = parseFloat(document.getElementById('cust-credit-limit').value) || 500000;
  const address = document.getElementById('cust-address').value.trim();

  const newCust = {
    id: `CST-${(AppState.customers.length + 1).toString().padStart(3, '0')}`,
    name,
    phone,
    address,
    creditLimit,
    debtBalance: 0,
    totalSpent: 0
  };

  AppState.customers.push(newCust);
  saveToStorage(STORAGE_KEYS.CUSTOMERS, AppState.customers);
  document.getElementById('customer-modal').classList.remove('open');
  sound.play('success');

  renderCustomersTable();
  renderCart();
}

function openRepayModal(custId) {
  const cust = AppState.customers.find(c => c.id === custId);
  if (!cust) return;

  document.getElementById('repay-cust-id').value = cust.id;
  document.getElementById('repay-cust-name').textContent = cust.name;
  document.getElementById('repay-current-debt').textContent = formatMoney(cust.debtBalance);
  document.getElementById('repay-amount').value = cust.debtBalance;
  document.getElementById('repay-amount').max = cust.debtBalance;

  document.getElementById('repay-modal').classList.add('open');
}

function saveDebtRepayment(e) {
  e.preventDefault();
  const custId = document.getElementById('repay-cust-id').value;
  const amount = parseFloat(document.getElementById('repay-amount').value) || 0;
  const method = document.getElementById('repay-method').value;

  const cust = AppState.customers.find(c => c.id === custId);
  if (!cust || amount <= 0) return;

  cust.debtBalance = Math.max(0, cust.debtBalance - amount);
  saveToStorage(STORAGE_KEYS.CUSTOMERS, AppState.customers);

  if (method === 'CASH') {
    AppState.shift.movements.push({
      type: 'CASH_IN',
      amount: amount,
      reason: `Debt Repayment - ${cust.name}`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });
    saveToStorage(STORAGE_KEYS.SHIFT, AppState.shift);
  }

  document.getElementById('repay-modal').classList.remove('open');
  sound.play('success');
  alert(`Payment of ${formatMoney(amount)} recorded for ${cust.name}. Remaining debt: ${formatMoney(cust.debtBalance)}.`);

  renderCustomersTable();
  renderShiftView();
}

// =============================================================================
// 16. SHIFT DRAWER MOVEMENTS & Z-REPORT
// =============================================================================

function openCashMovementModal() {
  document.getElementById('cash-movement-form').reset();
  document.getElementById('cash-movement-modal').classList.add('open');
}

function saveCashMovement(e) {
  e.preventDefault();
  const type = document.getElementById('movement-type').value;
  const amount = parseFloat(document.getElementById('movement-amount').value) || 0;
  const reason = document.getElementById('movement-reason').value.trim();

  if (amount <= 0 || !reason) return;

  AppState.shift.movements.push({
    type,
    amount,
    reason,
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  });

  saveToStorage(STORAGE_KEYS.SHIFT, AppState.shift);
  document.getElementById('cash-movement-modal').classList.remove('open');
  sound.play('success');

  renderShiftView();
}

function openCloseShiftModal() {
  if (!isCurrentUserAdmin()) {
    alert('Restricted: Day-End Z-Report reconciliation requires Store Main Admin role.');
    return;
  }

  const m = calculateShiftMetrics();
  document.getElementById('z-report-time').textContent = `Generated on ${new Date().toLocaleString()}`;
  document.getElementById('z-float-val').textContent = formatMoney(m.initialFloat);
  document.getElementById('z-cash-sales-val').textContent = formatMoney(m.cashSales);
  
  const netPetty = m.additionalCashIn - m.totalCashOut;
  document.getElementById('z-petty-net-val').textContent = (netPetty >= 0 ? '+' : '-') + ' ' + formatMoney(Math.abs(netPetty));
  document.getElementById('z-expected-cash-val').textContent = formatMoney(m.expectedCashInDrawer);

  const inputEl = document.getElementById('z-counted-cash-input');
  inputEl.value = '';
  document.getElementById('z-discrepancy-val').textContent = 'Awaiting Physical Count...';

  document.getElementById('close-shift-modal').classList.add('open');
}

function updateZDiscrepancy() {
  const m = calculateShiftMetrics();
  const counted = parseFloat(document.getElementById('z-counted-cash-input').value) || 0;
  const diff = counted - m.expectedCashInDrawer;
  const discEl = document.getElementById('z-discrepancy-val');

  if (diff === 0) {
    discEl.textContent = 'Balanced (UGX 0 Variance)';
    discEl.className = 'text-emerald font-bold';
  } else if (diff > 0) {
    discEl.textContent = `OVER by +${formatMoney(diff)}`;
    discEl.className = 'text-sapphire font-bold';
  } else {
    discEl.textContent = `SHORTAGE by -${formatMoney(Math.abs(diff))}`;
    discEl.className = 'text-ruby font-bold';
  }
}

// =============================================================================
// 17. CSV EXPORTS & BACKUP/RESTORE SYSTEM
// =============================================================================

function exportInventoryToCSV() {
  const isAdmin = isCurrentUserAdmin();
  const headers = isAdmin
    ? ['Product ID', 'Barcode/SKU', 'Product Name', 'Category', 'Cost Price (UGX)', 'Selling Price (UGX)', 'Current Stock', 'Unit', 'Alert Level']
    : ['Product ID', 'Barcode/SKU', 'Product Name', 'Category', 'Selling Price (UGX)', 'Current Stock', 'Unit', 'Alert Level'];

  const rows = AppState.products.map(p => {
    if (isAdmin) {
      return [`"${p.id}"`, `"${p.barcode}"`, `"${p.name.replace(/"/g, '""')}"`, `"${p.category}"`, p.costPrice, p.price, p.stock, `"${p.unit}"`, p.minStock];
    } else {
      return [`"${p.id}"`, `"${p.barcode}"`, `"${p.name.replace(/"/g, '""')}"`, `"${p.category}"`, p.price, p.stock, `"${p.unit}"`, p.minStock];
    }
  });

  downloadCSV([headers.join(','), ...rows.map(r => r.join(','))].join('\n'), `bakyenga_inventory_${Date.now()}.csv`);
}

function exportSalesToCSV() {
  if (!isCurrentUserAdmin()) {
    alert('Access Restricted: Sales ledger export is restricted to Main Admin.');
    return;
  }

  const headers = ['Receipt No', 'Date Time', 'Cashier', 'Customer', 'Payment Method', 'Items Count', 'Subtotal', 'Discount', 'Tax', 'Grand Total', 'Reference'];
  const rows = AppState.sales.map(s => [
    `"${s.id}"`,
    `"${s.timestamp}"`,
    `"${s.cashier}"`,
    `"${s.customerName}"`,
    `"${s.paymentMethod}"`,
    s.items.reduce((sum, it) => sum + it.qty, 0),
    s.subtotal,
    s.discount,
    s.tax,
    s.total,
    `"${s.reference || ''}"`
  ]);

  downloadCSV([headers.join(','), ...rows.map(r => r.join(','))].join('\n'), `bakyenga_sales_ledger_${Date.now()}.csv`);
}

function downloadCSV(csvContent, fileName) {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = fileName;
  link.click();
}

function exportFullBackupJSON() {
  if (!isCurrentUserAdmin()) {
    alert('Restricted: Database backups require Main Admin role.');
    return;
  }

  const backup = {
    metadata: {
      system: 'Bakyenga Traders POS',
      version: '2.1.0',
      exportedAt: new Date().toISOString()
    },
    products: AppState.products,
    categories: AppState.categories,
    users: AppState.users,
    sales: AppState.sales,
    customers: AppState.customers,
    settings: AppState.settings,
    shift: AppState.shift
  };

  const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `bakyenga_backup_${new Date().toISOString().slice(0, 10)}.json`;
  link.click();
}

function restoreFromJSON(file) {
  if (!isCurrentUserAdmin()) {
    alert('Restricted: Database restoration requires Main Admin role.');
    return;
  }

  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const data = JSON.parse(e.target.result);
      if (data.products && Array.isArray(data.products)) {
        AppState.products = data.products;
        saveToStorage(STORAGE_KEYS.PRODUCTS, data.products);
      }
      if (data.categories && Array.isArray(data.categories)) {
        AppState.categories = data.categories;
        saveToStorage(STORAGE_KEYS.CATEGORIES, data.categories);
      }
      if (data.users && Array.isArray(data.users)) {
        AppState.users = data.users;
        saveToStorage(STORAGE_KEYS.USERS, data.users);
      }
      if (data.sales && Array.isArray(data.sales)) {
        AppState.sales = data.sales;
        saveToStorage(STORAGE_KEYS.SALES, data.sales);
      }
      if (data.customers && Array.isArray(data.customers)) {
        AppState.customers = data.customers;
        saveToStorage(STORAGE_KEYS.CUSTOMERS, data.customers);
      }
      if (data.settings) {
        AppState.settings = data.settings;
        saveToStorage(STORAGE_KEYS.SETTINGS, data.settings);
      }

      alert('Database restored successfully from file!');
      window.location.reload();
    } catch (err) {
      alert('Error parsing backup file: ' + err.message);
    }
  };
  reader.readAsText(file);
}

function resetToFactoryDemoData() {
  if (!isCurrentUserAdmin()) {
    alert('Restricted: Resetting demo catalog requires Main Admin role.');
    return;
  }

  const confirmed = confirm('Are you sure you want to reset the system to sample demo data? All local records will be refreshed.');
  if (!confirmed) return;

  localStorage.clear();
  initDataStore();
  window.location.reload();
}

// =============================================================================
// 18. EVENT LISTENERS SETUP
// =============================================================================

function setupEventListeners() {
  // Navigation Tabs with RBAC Protection
  const navTabs = document.querySelectorAll('.nav-tab');
  navTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const targetId = tab.dataset.tab;
      const isAdmin = isCurrentUserAdmin();

      // If non-admin tries to open sales or settings tab
      if (!isAdmin && (targetId === 'sales-tab' || targetId === 'settings-tab')) {
        // Let them see the access restricted notice on that tab
      }

      navTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      document.querySelectorAll('.tab-view').forEach(view => view.classList.remove('active'));
      const activeView = document.getElementById(targetId);
      if (activeView) activeView.classList.add('active');

      sound.play('click');

      // Refresh target view
      if (targetId === 'inventory-tab') renderInventoryTable();
      if (targetId === 'sales-tab') renderSalesAnalytics();
      if (targetId === 'debtors-tab') renderCustomersTable();
      if (targetId === 'shift-tab') renderShiftView();
      if (targetId === 'settings-tab') renderStaffTable();
    });
  });

  // User Switcher button in Header
  const btnSwitchUser = document.getElementById('btn-switch-user');
  if (btnSwitchUser) {
    btnSwitchUser.addEventListener('click', openUserSwitcherModal);
  }

  // Switch to admin from restricted screens
  const btnSalesAdmin = document.getElementById('btn-sales-switch-admin');
  if (btnSalesAdmin) {
    btnSalesAdmin.addEventListener('click', openUserSwitcherModal);
  }

  const btnSettingsAdmin = document.getElementById('btn-settings-switch-admin');
  if (btnSettingsAdmin) {
    btnSettingsAdmin.addEventListener('click', openUserSwitcherModal);
  }

  // Staff picker card selection
  const staffGrid = document.getElementById('staff-picker-grid');
  if (staffGrid) {
    staffGrid.addEventListener('click', (e) => {
      const card = e.target.closest('.staff-card-btn');
      if (!card) return;
      const userId = card.dataset.userId;
      selectUserForLogin(userId);
    });
  }

  const btnBackToPicker = document.getElementById('btn-back-to-picker');
  if (btnBackToPicker) {
    btnBackToPicker.addEventListener('click', () => {
      document.getElementById('pin-entry-section').style.display = 'none';
      document.getElementById('staff-picker-grid').style.display = 'grid';
      AppState.loginSelectedUser = null;
      AppState.pinEntered = '';
      updatePinDots();
    });
  }

  // Touch Numpad buttons in login modal
  const numpad = document.querySelector('.touch-numpad');
  if (numpad) {
    numpad.addEventListener('click', (e) => {
      const btn = e.target.closest('button');
      if (!btn) return;
      if (btn.classList.contains('numpad-clear')) {
        handlePinInput('CLEAR');
      } else if (btn.classList.contains('numpad-back')) {
        handlePinInput('BACK');
      } else if (btn.dataset.num !== undefined) {
        handlePinInput(btn.dataset.num);
      }
      sound.play('click');
    });
  }

  const staffPinInput = document.getElementById('staff-pin-input');
  if (staffPinInput) {
    staffPinInput.addEventListener('input', (e) => {
      AppState.pinEntered = e.target.value.replace(/[^0-9]/g, '').slice(0, 6);
      e.target.value = AppState.pinEntered;
      updatePinDots();
      if (AppState.pinEntered.length === 4) {
        verifyAndCompleteLogin();
      }
    });
  }

  // Staff Role Management (Admin Panel)
  const btnAddStaff = document.getElementById('btn-add-staff-modal');
  if (btnAddStaff) {
    btnAddStaff.addEventListener('click', () => openStaffModal(null));
  }

  const staffForm = document.getElementById('staff-form');
  if (staffForm) {
    staffForm.addEventListener('submit', saveStaffMemberFromForm);
  }

  const staffRoleSelect = document.getElementById('staff-role-select');
  if (staffRoleSelect) {
    staffRoleSelect.addEventListener('change', () => {
      const isAdm = staffRoleSelect.value === 'ADMIN';
      const descText = document.getElementById('role-desc-text');
      if (descText) {
        descText.textContent = isAdm
          ? 'Main Admins have full access to business cash reports, drawer balances, profit margins, and system configuration.'
          : 'Cashiers/Workers can operate the register and make sales, but CANNOT view business revenue, profit margins, shift drawer balances, or financial reports.';
      }
    });
  }

  const staffTableBody = document.getElementById('staff-table-body');
  if (staffTableBody) {
    staffTableBody.addEventListener('click', (e) => {
      const btn = e.target.closest('button');
      if (!btn) return;
      const action = btn.dataset.action;
      const staffId = btn.dataset.id;
      const user = AppState.users.find(u => u.id === staffId);
      if (!user) return;

      if (action === 'edit-staff-role') {
        openStaffModal(staffId);
      } else if (action === 'edit-staff-pin') {
        const newPin = prompt(`Enter new 4-digit security PIN for ${user.name}:`, user.pin);
        if (newPin && newPin.trim().length >= 4) {
          user.pin = newPin.trim();
          saveToStorage(STORAGE_KEYS.USERS, AppState.users);
          renderStaffTable();
          sound.play('success');
          alert(`PIN updated for ${user.name}.`);
        }
      } else if (action === 'del-staff') {
        if (user.id === AppState.currentUser.id) {
          alert('Cannot delete your own active account.');
          return;
        }
        if (confirm(`Remove staff member "${user.name}" from system?`)) {
          AppState.users = AppState.users.filter(u => u.id !== staffId);
          saveToStorage(STORAGE_KEYS.USERS, AppState.users);
          renderStaffTable();
          sound.play('click');
        }
      }
    });
  }

  // Custom Category Input Features
  const btnToggleCustomCat = document.getElementById('btn-toggle-custom-cat');
  const customCatWrap = document.getElementById('custom-cat-wrapper');
  const customCatInput = document.getElementById('custom-cat-input');
  const btnApplyCustomCat = document.getElementById('btn-apply-custom-cat');
  const btnCancelCustomCat = document.getElementById('btn-cancel-custom-cat');

  if (btnToggleCustomCat) {
    btnToggleCustomCat.addEventListener('click', () => {
      if (customCatWrap) {
        customCatWrap.style.display = 'block';
        customCatInput.value = '';
        customCatInput.focus();
      }
    });
  }

  if (btnCancelCustomCat) {
    btnCancelCustomCat.addEventListener('click', () => {
      if (customCatWrap) customCatWrap.style.display = 'none';
    });
  }

  if (btnApplyCustomCat) {
    btnApplyCustomCat.addEventListener('click', () => {
      const newCat = customCatInput.value;
      const added = addCustomCategory(newCat);
      if (added) {
        if (customCatWrap) customCatWrap.style.display = 'none';
        const prodCatSelect = document.getElementById('prod-category');
        if (prodCatSelect) prodCatSelect.value = added;
      }
    });
  }

  // Quick category modal from inventory toolbar
  const btnQuickCat = document.getElementById('btn-quick-new-category');
  if (btnQuickCat) {
    btnQuickCat.addEventListener('click', () => {
      const qInput = document.getElementById('quick-cat-name-input');
      if (qInput) qInput.value = '';
      document.getElementById('category-modal').classList.add('open');
      if (qInput) qInput.focus();
    });
  }

  const quickCatForm = document.getElementById('quick-category-form');
  if (quickCatForm) {
    quickCatForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const val = document.getElementById('quick-cat-name-input').value;
      const added = addCustomCategory(val);
      if (added) {
        document.getElementById('category-modal').classList.remove('open');
        alert(`Category "${added}" created and available across the system!`);
      }
    });
  }

  // Category Filter Pills on POS Register
  const catPillsContainer = document.getElementById('category-pills');
  if (catPillsContainer) {
    catPillsContainer.addEventListener('click', (e) => {
      const pill = e.target.closest('.cat-pill');
      if (!pill) return;
      document.querySelectorAll('.cat-pill').forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      AppState.currentCategory = pill.dataset.category;
      sound.play('click');
      renderProductCatalog();
    });
  }

  // Product Catalog Search
  const searchInput = document.getElementById('catalog-search');
  const clearBtn = document.getElementById('clear-search-btn');

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      AppState.searchQuery = e.target.value;
      if (clearBtn) clearBtn.style.display = e.target.value ? 'block' : 'none';
      renderProductCatalog();
    });

    searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const q = searchInput.value.trim().toLowerCase();
        if (!q) return;

        const exact = AppState.products.find(p => p.barcode.toLowerCase() === q);
        if (exact) {
          addItemToCart(exact.id, 1);
          searchInput.value = '';
          AppState.searchQuery = '';
          if (clearBtn) clearBtn.style.display = 'none';
          renderProductCatalog();
          return;
        }

        const match = AppState.products.find(p => 
          p.name.toLowerCase().includes(q) || p.barcode.toLowerCase().includes(q)
        );
        if (match) {
          addItemToCart(match.id, 1);
          searchInput.value = '';
          AppState.searchQuery = '';
          if (clearBtn) clearBtn.style.display = 'none';
          renderProductCatalog();
        }
      }
    });
  }

  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      if (searchInput) {
        searchInput.value = '';
        searchInput.focus();
      }
      AppState.searchQuery = '';
      clearBtn.style.display = 'none';
      renderProductCatalog();
    });
  }

  const resetFiltersBtn = document.getElementById('btn-reset-filters');
  if (resetFiltersBtn) {
    resetFiltersBtn.addEventListener('click', () => {
      if (searchInput) searchInput.value = '';
      AppState.searchQuery = '';
      if (clearBtn) clearBtn.style.display = 'none';
      AppState.currentCategory = 'ALL';
      renderCategoryPills();
      renderProductCatalog();
    });
  }

  // Add product from catalog card
  const prodGrid = document.getElementById('products-grid');
  if (prodGrid) {
    prodGrid.addEventListener('click', (e) => {
      const card = e.target.closest('.product-card');
      if (!card) return;
      const prodId = card.dataset.productId;
      addItemToCart(prodId, 1);
    });
  }

  // Cart actions
  const cartItemsList = document.getElementById('cart-items-list');
  if (cartItemsList) {
    cartItemsList.addEventListener('click', (e) => {
      const btn = e.target.closest('button');
      if (!btn) return;
      const action = btn.dataset.action;
      const prodId = btn.dataset.id;
      const ticket = getActiveTicket();
      const item = ticket.items.find(it => it.id === prodId);
      if (!item) return;

      if (action === 'inc') updateCartItemQty(prodId, item.qty + 1);
      else if (action === 'dec') updateCartItemQty(prodId, item.qty - 1);
      else if (action === 'del') updateCartItemQty(prodId, 0);
    });

    cartItemsList.addEventListener('change', (e) => {
      if (e.target.classList.contains('qty-input')) {
        updateCartItemQty(e.target.dataset.id, e.target.value);
      }
    });
  }

  // Cart customer selector
  const custSelect = document.getElementById('cart-customer-select');
  if (custSelect) {
    custSelect.addEventListener('change', (e) => {
      const ticket = getActiveTicket();
      ticket.customerId = e.target.value;
      saveActiveTickets();
    });
  }

  // Discount & Tax Adjustments
  const discInput = document.getElementById('cart-discount-input');
  if (discInput) {
    discInput.addEventListener('input', (e) => {
      const ticket = getActiveTicket();
      ticket.discount = parseFloat(e.target.value) || 0;
      saveActiveTickets();
      renderCart();
    });
  }

  const discType = document.getElementById('cart-discount-type');
  if (discType) {
    discType.addEventListener('change', (e) => {
      const ticket = getActiveTicket();
      ticket.discountType = e.target.value;
      saveActiveTickets();
      renderCart();
    });
  }

  const taxToggle = document.getElementById('tax-toggle');
  if (taxToggle) {
    taxToggle.addEventListener('change', (e) => {
      const ticket = getActiveTicket();
      ticket.taxEnabled = e.target.checked;
      saveActiveTickets();
      renderCart();
    });
  }

  // Held Tickets Tabs
  const heldList = document.getElementById('held-tickets-list');
  if (heldList) {
    heldList.addEventListener('click', (e) => {
      const closeBtn = e.target.closest('[data-close-ticket]');
      if (closeBtn) {
        e.stopPropagation();
        const ticketId = closeBtn.dataset.closeTicket;
        if (AppState.heldTickets.length <= 1) return;
        AppState.heldTickets = AppState.heldTickets.filter(t => t.id !== ticketId);
        AppState.activeTicketId = AppState.heldTickets[0].id;
        saveActiveTickets();
        renderCart();
        return;
      }

      const tab = e.target.closest('.ticket-tab');
      if (tab) {
        AppState.activeTicketId = tab.dataset.ticketId;
        saveActiveTickets();
        sound.play('click');
        renderCart();
      }
    });
  }

  const btnAddTicket = document.getElementById('btn-add-ticket');
  if (btnAddTicket) {
    btnAddTicket.addEventListener('click', () => {
      const newId = `TKT-${Date.now().toString().slice(-4)}`;
      AppState.heldTickets.push({
        id: newId,
        title: `Ticket ${AppState.heldTickets.length + 1}`,
        customerId: 'walk-in',
        items: [],
        discount: 0,
        discountType: 'UGX',
        taxEnabled: false,
        createdAt: new Date().toISOString()
      });
      AppState.activeTicketId = newId;
      saveActiveTickets();
      sound.play('click');
      renderCart();
    });
  }

  const btnClearCart = document.getElementById('btn-clear-cart');
  if (btnClearCart) {
    btnClearCart.addEventListener('click', () => {
      const ticket = getActiveTicket();
      if (ticket.items.length === 0) return;
      if (confirm('Discard all items in the current cart?')) {
        ticket.items = [];
        ticket.discount = 0;
        saveActiveTickets();
        sound.play('click');
        renderCart();
      }
    });
  }

  const btnHoldCart = document.getElementById('btn-hold-cart');
  if (btnHoldCart) {
    btnHoldCart.addEventListener('click', () => {
      if (btnAddTicket) btnAddTicket.click();
    });
  }

  // Quick cash tender row
  const quickCashRow = document.getElementById('quick-cash-row');
  if (quickCashRow) {
    quickCashRow.addEventListener('click', (e) => {
      const btn = e.target.closest('.quick-cash-btn');
      if (!btn) return;
      openPaymentModal();

      const addVal = btn.dataset.add ? parseInt(btn.dataset.add, 10) : 0;
      const type = btn.dataset.type;
      const ticket = getActiveTicket();
      const subtotal = ticket.items.reduce((s, it) => s + (it.qty * it.price), 0);
      const grandTotal = Math.max(0, subtotal - (ticket.discount || 0));

      const tenderInput = document.getElementById('cash-tendered-input');
      if (type === 'exact') {
        tenderInput.value = grandTotal;
      } else if (addVal > 0) {
        tenderInput.value = grandTotal + addVal;
      }
      updateChangeDisplay(parseFloat(tenderInput.value) || 0, grandTotal);
    });
  }

  const btnPayNow = document.getElementById('btn-pay-now');
  if (btnPayNow) btnPayNow.addEventListener('click', openPaymentModal);

  // Payment methods in modal
  const payMethodBtns = document.querySelectorAll('.pay-method-btn');
  payMethodBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      payMethodBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const method = btn.dataset.method;
      AppState.selectedPaymentMethod = method;

      document.querySelectorAll('.pay-panel').forEach(p => p.classList.remove('active'));
      if (method === 'CASH') document.getElementById('panel-cash').classList.add('active');
      if (method === 'MTN_MOMO') document.getElementById('panel-mtn-momo').classList.add('active');
      if (method === 'AIRTEL_MONEY') document.getElementById('panel-airtel-money').classList.add('active');
      if (method === 'CARD') document.getElementById('panel-card').classList.add('active');
      if (method === 'CREDIT') document.getElementById('panel-credit').classList.add('active');

      sound.play('click');
    });
  });

  const cashInput = document.getElementById('cash-tendered-input');
  if (cashInput) {
    cashInput.addEventListener('input', () => {
      const ticket = getActiveTicket();
      const subtotal = ticket.items.reduce((s, it) => s + (it.qty * it.price), 0);
      let disc = ticket.discount || 0;
      if (ticket.discountType === '%') disc = (subtotal * disc) / 100;
      const total = Math.max(0, subtotal - disc);
      updateChangeDisplay(parseFloat(cashInput.value) || 0, total);
    });
  }

  const modalQuickTender = document.getElementById('modal-quick-tender');
  if (modalQuickTender) {
    modalQuickTender.addEventListener('click', (e) => {
      const chip = e.target.closest('.tender-chip');
      if (!chip) return;
      const amt = parseFloat(chip.dataset.amt) || 0;
      if (cashInput) cashInput.value = amt;

      const ticket = getActiveTicket();
      const subtotal = ticket.items.reduce((s, it) => s + (it.qty * it.price), 0);
      let disc = ticket.discount || 0;
      if (ticket.discountType === '%') disc = (subtotal * disc) / 100;
      const total = Math.max(0, subtotal - disc);

      updateChangeDisplay(amt, total);
      sound.play('click');
    });
  }

  const btnCompleteSale = document.getElementById('btn-complete-sale');
  if (btnCompleteSale) btnCompleteSale.addEventListener('click', completeSaleTransaction);

  const btnPrintReceipt = document.getElementById('btn-print-receipt');
  if (btnPrintReceipt) btnPrintReceipt.addEventListener('click', () => window.print());

  // Modal dismiss buttons
  document.querySelectorAll('[data-close]').forEach(btn => {
    btn.addEventListener('click', () => {
      const modalId = btn.dataset.close;
      const modal = document.getElementById(modalId);
      if (modal) modal.classList.remove('open');
    });
  });

  // Product CRUD
  const btnAddProduct = document.getElementById('btn-add-product-modal');
  if (btnAddProduct) btnAddProduct.addEventListener('click', () => openProductModal(null));

  const prodForm = document.getElementById('product-form');
  if (prodForm) prodForm.addEventListener('submit', saveProductFromForm);

  const btnGenBarcode = document.getElementById('btn-gen-barcode');
  if (btnGenBarcode) {
    btnGenBarcode.addEventListener('click', () => {
      document.getElementById('prod-barcode').value = `600${Math.floor(1000 + Math.random() * 9000)}`;
      sound.play('click');
    });
  }

  // Inventory Table actions
  const invTbody = document.getElementById('inventory-table-body');
  if (invTbody) {
    invTbody.addEventListener('click', (e) => {
      const btn = e.target.closest('button');
      if (!btn) return;
      const action = btn.dataset.action;
      const prodId = btn.dataset.id;

      if (action === 'adjust-stock') {
        openStockAdjustModal(prodId);
      } else if (action === 'edit-product') {
        openProductModal(prodId);
      } else if (action === 'del-product') {
        if (!isCurrentUserAdmin()) {
          alert('Restricted: Deleting products requires Main Admin role.');
          return;
        }
        const p = AppState.products.find(item => item.id === prodId);
        if (!p) return;
        if (confirm(`Remove "${p.name}" from catalog?`)) {
          AppState.products = AppState.products.filter(item => item.id !== prodId);
          saveToStorage(STORAGE_KEYS.PRODUCTS, AppState.products);
          sound.play('click');
          renderInventoryTable();
          renderProductCatalog();
        }
      }
    });
  }

  const stockAdjustForm = document.getElementById('stock-adjust-form');
  if (stockAdjustForm) stockAdjustForm.addEventListener('submit', saveStockAdjustment);

  const invSearch = document.getElementById('inventory-search');
  if (invSearch) invSearch.addEventListener('input', renderInventoryTable);

  const invCat = document.getElementById('inventory-cat-filter');
  if (invCat) invCat.addEventListener('change', renderInventoryTable);

  const invStock = document.getElementById('inventory-stock-filter');
  if (invStock) invStock.addEventListener('change', renderInventoryTable);

  const btnExportInv = document.getElementById('btn-export-inventory-csv');
  if (btnExportInv) btnExportInv.addEventListener('click', exportInventoryToCSV);

  // Sales View
  const btnExportSales = document.getElementById('btn-export-sales-csv');
  if (btnExportSales) btnExportSales.addEventListener('click', exportSalesToCSV);

  const salesSearch = document.getElementById('sales-search-input');
  if (salesSearch) salesSearch.addEventListener('input', renderSalesTable);

  const salesTbody = document.getElementById('sales-table-body');
  if (salesTbody) {
    salesTbody.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-action="view-receipt"]');
      if (!btn) return;
      const saleId = btn.dataset.id;
      const sale = AppState.sales.find(s => s.id === saleId);
      if (!sale) return;
      populateThermalReceipt(sale);
      document.getElementById('receipt-modal').classList.add('open');
    });
  }

  // Customer Management
  const btnAddCust = document.getElementById('btn-add-customer-modal');
  if (btnAddCust) btnAddCust.addEventListener('click', openCustomerModal);

  const btnAddCustQuick = document.getElementById('btn-add-cust-quick');
  if (btnAddCustQuick) btnAddCustQuick.addEventListener('click', openCustomerModal);

  const custForm = document.getElementById('customer-form');
  if (custForm) custForm.addEventListener('submit', saveCustomerFromForm);

  const custTbody = document.getElementById('customers-table-body');
  if (custTbody) {
    custTbody.addEventListener('click', (e) => {
      const btn = e.target.closest('button');
      if (!btn) return;
      const action = btn.dataset.action;
      const custId = btn.dataset.id;

      if (action === 'repay-debt') {
        openRepayModal(custId);
      } else if (action === 'edit-customer') {
        const c = AppState.customers.find(item => item.id === custId);
        if (!c) return;
        const newLimit = prompt(`Enter new credit limit for ${c.name}:`, c.creditLimit);
        if (newLimit !== null) {
          c.creditLimit = parseFloat(newLimit) || c.creditLimit;
          saveToStorage(STORAGE_KEYS.CUSTOMERS, AppState.customers);
          renderCustomersTable();
        }
      }
    });
  }

  const repayForm = document.getElementById('repay-form');
  if (repayForm) repayForm.addEventListener('submit', saveDebtRepayment);

  // Shift & Cash Drawer
  const btnCashMov = document.getElementById('btn-cash-movement-modal');
  if (btnCashMov) btnCashMov.addEventListener('click', openCashMovementModal);

  const cashMovForm = document.getElementById('cash-movement-form');
  if (cashMovForm) cashMovForm.addEventListener('submit', saveCashMovement);

  const btnCloseShift = document.getElementById('btn-close-shift-modal');
  if (btnCloseShift) btnCloseShift.addEventListener('click', openCloseShiftModal);

  const zCountedInput = document.getElementById('z-counted-cash-input');
  if (zCountedInput) zCountedInput.addEventListener('input', updateZDiscrepancy);

  const btnPrintZ = document.getElementById('btn-print-z-report');
  if (btnPrintZ) {
    btnPrintZ.addEventListener('click', () => {
      alert('Shift Z-Report reconciliation logged! Printing Day-End audit slip...');
      window.print();
    });
  }

  // Store Settings Form (Admin Only)
  const storeForm = document.getElementById('store-settings-form');
  if (storeForm) {
    storeForm.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!isCurrentUserAdmin()) {
        alert('Restricted: Modifying store settings requires Main Admin role.');
        return;
      }
      AppState.settings.storeName = document.getElementById('setting-store-name').value.trim();
      AppState.settings.tagline = document.getElementById('setting-store-tagline').value.trim();
      AppState.settings.phone = document.getElementById('setting-store-phone').value.trim();
      AppState.settings.tin = document.getElementById('setting-store-tin').value.trim();
      AppState.settings.address = document.getElementById('setting-store-address').value.trim();
      AppState.settings.currency = document.getElementById('setting-currency').value;
      AppState.settings.defaultTaxRate = parseFloat(document.getElementById('setting-tax-rate').value) || 18;
      AppState.settings.receiptFooter = document.getElementById('setting-receipt-footer').value.trim();

      saveToStorage(STORAGE_KEYS.SETTINGS, AppState.settings);
      applyStoreSettingsToDOM();
      sound.play('success');
      alert('Store configuration settings successfully updated!');

      renderProductCatalog();
      renderCart();
    });
  }

  // Backup & Restore
  const btnExportBackup = document.getElementById('btn-export-backup');
  if (btnExportBackup) btnExportBackup.addEventListener('click', exportFullBackupJSON);

  const restoreInput = document.getElementById('restore-file-input');
  if (restoreInput) {
    restoreInput.addEventListener('change', (e) => {
      if (e.target.files && e.target.files[0]) {
        restoreFromJSON(e.target.files[0]);
      }
    });
  }

  const btnResetDemo = document.getElementById('btn-reset-demo-data');
  if (btnResetDemo) btnResetDemo.addEventListener('click', resetToFactoryDemoData);

  // Quick custom item (F9)
  const btnQuickCustom = document.getElementById('btn-quick-custom-item');
  if (btnQuickCustom) {
    btnQuickCustom.addEventListener('click', () => {
      const itemName = prompt('Enter custom item name:');
      if (!itemName) return;
      const itemPrice = parseFloat(prompt('Enter item selling price in UGX:')) || 0;
      if (itemPrice <= 0) return;

      const ticket = getActiveTicket();
      ticket.items.push({
        id: `CUST-${Date.now()}`,
        barcode: 'CUSTOM',
        name: itemName,
        price: itemPrice,
        costPrice: Math.round(itemPrice * 0.8),
        qty: 1,
        unit: 'item'
      });
      sound.play('beep');
      saveActiveTickets();
      renderCart();
    });
  }

  // Sound Toggle
  const soundBtn = document.getElementById('sound-toggle-btn');
  if (soundBtn) {
    soundBtn.addEventListener('click', () => {
      AppState.soundEnabled = !AppState.soundEnabled;
      saveToStorage(STORAGE_KEYS.SOUND_ENABLED, AppState.soundEnabled);
      const icon = document.getElementById('sound-icon');
      if (icon) {
        if (AppState.soundEnabled) {
          icon.setAttribute('data-lucide', 'volume-2');
          sound.play('click');
        } else {
          icon.setAttribute('data-lucide', 'volume-x');
        }
      }
      if (window.lucide) lucide.createIcons();
    });
  }

  // Shortcuts Dialog
  const shortcutsBtn = document.getElementById('shortcuts-btn');
  if (shortcutsBtn) {
    shortcutsBtn.addEventListener('click', () => {
      document.getElementById('shortcuts-modal').classList.add('open');
    });
  }

  // Fullscreen Toggle
  const fullscreenBtn = document.getElementById('fullscreen-btn');
  if (fullscreenBtn) {
    fullscreenBtn.addEventListener('click', () => {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(() => {});
      } else {
        document.exitFullscreen().catch(() => {});
      }
    });
  }

  // Global Keyboard Shortcuts
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const openModals = document.querySelectorAll('.modal-overlay.open');
      if (openModals.length > 0) {
        openModals.forEach(m => m.classList.remove('open'));
        return;
      }
    }

    if (e.key === 'F1') {
      e.preventDefault();
      const s = document.getElementById('catalog-search');
      if (s) {
        s.focus();
        s.select();
      }
    } else if (e.key === 'F2') {
      e.preventDefault();
      const b = document.getElementById('btn-add-ticket');
      if (b) b.click();
    } else if (e.key === 'F4') {
      e.preventDefault();
      openPaymentModal();
    } else if (e.key === 'F9') {
      e.preventDefault();
      const b = document.getElementById('btn-quick-custom-item');
      if (b) b.click();
    }
  });

  // Digital Clock & Date ticker
  function updateClock() {
    const now = new Date();
    const clockEl = document.getElementById('digital-clock');
    const dateEl = document.getElementById('digital-date');

    if (clockEl) {
      clockEl.textContent = now.toLocaleTimeString('en-US', { hour12: true });
    }
    if (dateEl) {
      dateEl.textContent = now.toLocaleDateString('en-GB', {
        weekday: 'long', day: '2-digit', month: 'short', year: 'numeric'
      });
    }
  }
  updateClock();
  setInterval(updateClock, 1000);
}

// =============================================================================
// 19. MAIN BOOTSTRAP
// =============================================================================

document.addEventListener('DOMContentLoaded', () => {
  initDataStore();
  setupEventListeners();

  if (window.lucide) {
    lucide.createIcons();
  }
});
