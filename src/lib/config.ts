/* Store-wide settings. Jo cheezein sir se confirm honi hain woh yahan ek jagah hain. */

export const SITE = {
  name: "Selpak Store",
  brand: "Selpak",
  description: "Selpak toilet rolls, kitchen towels, facial tissues, wet wipes and napkins, delivered to your door.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  year: 2026,
};

export const SELLER = {
  name: "Hariom Marketing",
  city: "Mumbai",
  phone: "8169161409",
  // TODO(sir se confirm): address, email, timing, WhatsApp number
};

/* TODO(sir se confirm): delivery charge aur free-delivery limit */
export const DELIVERY_FEE = 0;

export const STATES = ["Maharashtra"]; // TODO: delivery area tay hone par badhana

/* Backend ka base URL. Khaali ho to app mock (demo) data par chalta hai. */
export const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "";
export const IS_DEMO = API_URL === "";

/* Razorpay public key (key_id). Secret key kabhi frontend me nahi aati. */
export const RAZORPAY_KEY_ID = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID ?? "";

export const DEMO_OTP = "123456";

/* Admin panel (/admin). Demo mode ka login; asli backend aane par login backend check karega. */
export const DEMO_ADMIN = { username: "admin", password: "selpak123" };

/* Itne ya isse kam stock par product "Low stock" dikhta hai. TODO(sir se confirm) */
export const LOW_STOCK = 10;
