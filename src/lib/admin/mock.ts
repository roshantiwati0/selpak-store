/* Admin panel ka DEMO backend: sab kuch browser ke localStorage me.
   Orders wahi hain jo dukaan ka demo backend (src/lib/api/mock.ts) banata hai.
   Daam / stock ke badlav sirf isi browser me rehte hain aur dukaan ke pages par nahi dikhte:
   dukaan ka catalogue abhi file se aata hai. Asli backend aane par yeh file use nahi hogi (dekho ./index.ts). */
import { readOrders, updateOrder, writeOrders } from "@/lib/api/mock";
import { ApiError } from "@/lib/api/types";
import { getProduct, getProducts } from "@/lib/catalog";
import { DEMO_ADMIN } from "@/lib/config";
import type { Address, Order, OrderLine, OrderStatus, PaymentMethod, PaymentStatus, Product } from "@/lib/types";
import { adminAuth } from "@/store/adminAuth";
import { customersOf, statsOf } from "./stats";
import type { AdminApi, AdminProduct, ProductPatch } from "./types";

const PRODUCTS_KEY = "selpak.admin.products.v1";
const wait = (ms = 300) => new Promise((r) => setTimeout(r, ms));

function requireAdmin() {
  if (!adminAuth.token()) throw new ApiError("Please log in to the admin panel.", 401);
}

type Overrides = Record<string, ProductPatch>;

function readOverrides(): Overrides {
  try {
    return JSON.parse(window.localStorage.getItem(PRODUCTS_KEY) ?? "{}") as Overrides;
  } catch {
    return {};
  }
}

/** Sample stock for the demo: always the same number for the same product, and a few come out low. */
function demoStock(p: Product) {
  return (Number(p.barcode.slice(-4)) % 57) + 4;
}

function withAdminFields(p: Product, patch: ProductPatch | undefined): AdminProduct {
  return { ...p, mrp: patch?.mrp ?? p.mrp, stock: patch?.stock ?? demoStock(p), active: patch?.active ?? true };
}

function readProducts(): AdminProduct[] {
  const overrides = readOverrides();
  return getProducts().map((p) => withAdminFields(p, overrides[p.id]));
}

/* ---- sample orders (button on the dashboard) ---- */

interface Sample {
  id: string;
  daysAgo: number;
  hour: number;
  customer: [name: string, phone: string, city: string, pincode: string, line1: string];
  items: [productId: string, qty: number][];
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  status: OrderStatus;
}

// Naam aur number banaye hue hain (asli log nahi).
const C1: Sample["customer"] = ["Sample Customer One", "9000000001", "Mumbai", "400001", "12 Sample Building, Test Road"];
const C2: Sample["customer"] = ["Sample Customer Two", "9000000002", "Thane", "400601", "4 Demo Residency, Station Road"];
const C3: Sample["customer"] = ["Sample Customer Three", "9000000003", "Navi Mumbai", "400703", "9 Example Towers, Sector 17"];
const C4: Sample["customer"] = ["Sample Customer Four", "9000000004", "Mumbai", "400050", "27 Test Apartments, Hill Road"];

const SAMPLES: Sample[] = [
  { id: "SP-DEMO01", daysAgo: 0, hour: 10, customer: C1, items: [["tp-12", 1], ["kt-4", 2]], paymentMethod: "online", paymentStatus: "paid", status: "placed" },
  { id: "SP-DEMO02", daysAgo: 0, hour: 9, customer: C2, items: [["ft-maxi-100", 3]], paymentMethod: "cod", paymentStatus: "cod", status: "packed" },
  { id: "SP-DEMO03", daysAgo: 1, hour: 18, customer: C3, items: [["tp-24", 1], ["ww-organic-100", 2]], paymentMethod: "online", paymentStatus: "paid", status: "out_for_delivery" },
  { id: "SP-DEMO04", daysAgo: 2, hour: 13, customer: C1, items: [["kt-2", 2]], paymentMethod: "cod", paymentStatus: "cod", status: "delivered" },
  { id: "SP-DEMO05", daysAgo: 3, hour: 16, customer: C4, items: [["tp-8", 2], ["nap-lunch-100", 1]], paymentMethod: "online", paymentStatus: "paid", status: "delivered" },
  { id: "SP-DEMO06", daysAgo: 4, hour: 11, customer: C2, items: [["tp-4", 1]], paymentMethod: "online", paymentStatus: "failed", status: "placed" },
  { id: "SP-DEMO07", daysAgo: 5, hour: 20, customer: C3, items: [["hanky-classic", 4], ["ft-maxi-100", 1]], paymentMethod: "cod", paymentStatus: "cod", status: "cancelled" },
  { id: "SP-DEMO08", daysAgo: 6, hour: 12, customer: C4, items: [["tp-16", 1], ["kt-4", 1]], paymentMethod: "online", paymentStatus: "paid", status: "delivered" },
];

function sampleOrder(s: Sample, now: Date): Order | null {
  const lines: OrderLine[] = [];
  for (const [productId, qty] of s.items) {
    const p = getProduct(productId);
    if (p) lines.push({ productId: p.id, name: `Selpak ${p.name}`, size: p.size, price: p.mrp, qty });
  }
  if (!lines.length) return null;
  const [name, phone, city, pincode, line1] = s.customer;
  const address: Address = { name, phone, city, pincode, line1, state: "Maharashtra" };
  const subtotal = lines.reduce((sum, l) => sum + l.price * l.qty, 0);
  const createdAt = new Date(now.getFullYear(), now.getMonth(), now.getDate() - s.daysAgo, s.hour).toISOString();
  return { id: s.id, createdAt, lines, subtotal, deliveryFee: 0, total: subtotal, address, paymentMethod: s.paymentMethod, paymentStatus: s.paymentStatus, status: s.status };
}

export const mockAdminApi: AdminApi = {
  async login(username, password) {
    await wait(450);
    if (username.trim().toLowerCase() !== DEMO_ADMIN.username || password !== DEMO_ADMIN.password)
      throw new ApiError("Wrong username or password.");
    return { admin: { name: "Store admin" }, token: "demo-admin" };
  },

  async getStats() {
    await wait();
    requireAdmin();
    return statsOf(readOrders(), readProducts(), new Date());
  },

  async getOrders() {
    await wait();
    requireAdmin();
    return [...readOrders()].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  },

  async getOrder(id) {
    await wait(200);
    requireAdmin();
    return readOrders().find((o) => o.id === id) ?? null;
  },

  async updateOrderStatus(id, status) {
    await wait();
    requireAdmin();
    return updateOrder(id, { status });
  },

  async getProducts() {
    await wait();
    requireAdmin();
    return readProducts();
  },

  async updateProduct(id, patch) {
    await wait();
    requireAdmin();
    const product = getProduct(id);
    if (!product) throw new ApiError("Product not found", 404);
    if (patch.mrp !== undefined && !(Number.isInteger(patch.mrp) && patch.mrp > 0)) throw new ApiError("Price must be a whole number above 0.");
    if (patch.stock !== undefined && !(Number.isInteger(patch.stock) && patch.stock >= 0)) throw new ApiError("Stock must be a whole number, 0 or more.");
    const overrides = readOverrides();
    overrides[id] = { ...overrides[id], ...patch };
    try {
      window.localStorage.setItem(PRODUCTS_KEY, JSON.stringify(overrides));
    } catch {
      throw new ApiError("Could not save: this browser's storage is full or blocked.");
    }
    return withAdminFields(product, overrides[id]);
  },

  async getCustomers() {
    await wait();
    requireAdmin();
    return customersOf(readOrders());
  },

  async addSampleOrders() {
    await wait(400);
    requireAdmin();
    const orders = readOrders();
    const have = new Set(orders.map((o) => o.id));
    const now = new Date();
    const fresh = SAMPLES.filter((s) => !have.has(s.id)).map((s) => sampleOrder(s, now)).filter((o): o is Order => o !== null);
    if (fresh.length) writeOrders([...orders, ...fresh].sort((a, b) => b.createdAt.localeCompare(a.createdAt)));
    return fresh.length;
  },
};
