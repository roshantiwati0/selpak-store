const rupees = new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 });

/** 1040 -> "₹1,040" */
export function inr(amount: number) {
  return `₹${rupees.format(amount)}`;
}

/** ISO date -> "26 Nov 2026" */
export function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

export const isPhone = (v: string) => /^[6-9]\d{9}$/.test(v.trim());
export const isPincode = (v: string) => /^[1-9]\d{5}$/.test(v.trim());
export const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
