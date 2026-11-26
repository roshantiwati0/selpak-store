/* Catalogue data — Selpak Product Catalogue 2026.
   Abhi yeh file hi "database" hai. Backend ready hone par src/lib/catalog.ts
   ke functions API se data layenge; pages ko badalna nahi padega. */
import type { Category, Product } from "@/lib/types";

export const CATEGORIES: Category[] = [
  { id: "toilet", name: "Toilet Paper", image: "tp-12", blurb: "3-ply, scented, Deluxe & Comfort" },
  { id: "kitchen", name: "Kitchen Towels", image: "kt-4", blurb: "Super absorbent paper towels" },
  { id: "facial", name: "Facial Tissue", image: "ft-maxi-100", blurb: "Boxes & soft packs" },
  { id: "hanky", name: "Hanky", image: "hanky-classic", blurb: "Pocket packs, 4 variants" },
  { id: "wipes", name: "Wet Wipes", image: "ww-organic-100", blurb: "Classic, anti-bacterial, organic" },
  { id: "napkin", name: "Napkins", image: "nap-lunch-100", blurb: "Cocktail, luncheon, dinner" },
];

export const PRODUCTS: Product[] = [
  // Toilet paper — plain
  { id: "tp-4", category: "toilet", name: "Toilet Roll 3 Ply", size: "4 rolls", mrp: 360, barcode: "8690530204492" },
  { id: "tp-8", category: "toilet", name: "Toilet Roll 3 Ply", size: "8 rolls", mrp: 710, barcode: "8690530204515" },
  { id: "tp-12", category: "toilet", name: "Toilet Roll 3 Ply", size: "12 rolls", mrp: 1040, barcode: "8690530204508" },
  { id: "tp-16", category: "toilet", name: "Toilet Roll 3 Ply", size: "16 rolls", mrp: 1370, barcode: "8690530134546" },
  { id: "tp-24", category: "toilet", name: "Toilet Roll 3 Ply", size: "24 rolls", mrp: 2000, barcode: "8690530204478" },
  { id: "tp-7-2", category: "toilet", name: "Toilet Roll 3 Ply", size: "7+2 rolls", mrp: 625, barcode: "8690530015920", tag: "promo", tagText: "2 rolls free" },
  { id: "tp-14-4", category: "toilet", name: "Toilet Roll 3 Ply", size: "14+4 rolls", mrp: 1250, barcode: "8690530184466", tag: "promo", tagText: "4 rolls free" },
  { id: "tp-32-8", category: "toilet", name: "Toilet Roll 3 Ply", size: "32+8 rolls", mrp: 2650, barcode: "8690530059474", tag: "promo", tagText: "8 rolls free" },
  // Toilet paper — variants
  { id: "tp-powder-4", category: "toilet", name: "Toilet Roll Powder Scented", size: "4 rolls", mrp: 380, barcode: "8690530065482", scented: true },
  { id: "tp-powder-8", category: "toilet", name: "Toilet Roll Powder Scented", size: "8 rolls", mrp: 740, barcode: "8690530044517", scented: true },
  { id: "tp-extra-4", category: "toilet", name: "Extra Perfumed Toilet Roll", size: "4 rolls", mrp: 380, barcode: "8690530046573", scented: true },
  { id: "tp-deluxe-4", category: "toilet", name: "Toilet Roll Deluxe", size: "4 rolls", mrp: 360, barcode: "8690530028975", tag: "deluxe", tagText: "Deluxe" },
  { id: "tp-comfort-4", category: "toilet", name: "Comfort Toilet Roll", size: "4 rolls", mrp: 300, barcode: "8690530802117", tag: "new", tagText: "New" },
  { id: "tp-comfort-12", category: "toilet", name: "Comfort Toilet Roll", size: "12 rolls", mrp: 850, barcode: "8690530999053", tag: "new", tagText: "New" },
  { id: "tp-4ply-16", category: "toilet", name: "Premium Toilet Roll 4 Ply", size: "16 rolls", mrp: 1635, barcode: "8690530073210", tag: "deluxe", tagText: "4 Ply" },
  // Kitchen towel
  { id: "kt-2", category: "kitchen", name: "Kitchen Towel", size: "2 rolls", mrp: 285, barcode: "8690530015029" },
  { id: "kt-4", category: "kitchen", name: "Kitchen Towel", size: "4 rolls", mrp: 560, barcode: "8690530015012" },
  { id: "kt-6", category: "kitchen", name: "Kitchen Towel", size: "6 rolls", mrp: 810, barcode: "8690530015043" },
  { id: "kt-3-promo", category: "kitchen", name: "Kitchen Towel Promo", size: "3 rolls", mrp: 345, barcode: "8690530018242", tag: "promo", tagText: "20% free" },
  { id: "kt-3-1", category: "kitchen", name: "Kitchen Towel Promo", size: "3+1 rolls", mrp: 435, barcode: "8690530012356", tag: "promo", tagText: "1 roll free" },
  { id: "kt-8-deluxe", category: "kitchen", name: "Kitchen Towel Deluxe", size: "8 rolls", mrp: 1100, barcode: "8690530044807", tag: "deluxe", tagText: "Deluxe" },
  { id: "kt-3-calorie", category: "kitchen", name: "Kitchen Towel Calorie Absorb", size: "3 rolls", mrp: 450, barcode: "8690530274297" },
  // Facial tissue
  { id: "ft-maxi-100", category: "facial", name: "Facial Tissue Maxi", size: "100 sheets", mrp: 250, barcode: "8690530036727" },
  { id: "ft-boutique-48", category: "facial", name: "Facial Tissue Boutique", size: "48 sheets", mrp: 145, barcode: "8690530212220" },
  { id: "ft-standard-50", category: "facial", name: "Facial Tissue Standard", size: "50 sheets", mrp: 140, barcode: "8690530036697" },
  { id: "ft-mini-70", category: "facial", name: "Facial Tissue Mini", size: "70 sheets", mrp: 175, barcode: "8690530454781" },
  { id: "ft-soft-200", category: "facial", name: "Facial Tissue Soft Pack", size: "200 pulls", mrp: 230, barcode: "8690530035751" },
  // Hanky
  { id: "hanky-classic", category: "hanky", name: "Hanky Classic", size: "10 packs", mrp: 280, barcode: "8690530151338" },
  { id: "hanky-flower", category: "hanky", name: "Hanky Flower Scented", size: "10 packs", mrp: 280, barcode: "8690530151352", scented: true },
  { id: "hanky-lotion", category: "hanky", name: "Hanky Lotion Scented", size: "10 packs", mrp: 280, barcode: "8690530161320", scented: true },
  { id: "hanky-menthol", category: "hanky", name: "Hanky Menthol Scented", size: "10 packs", mrp: 280, barcode: "8690530151345", scented: true },
  // Wet wipes
  { id: "ww-organic-100", category: "wipes", name: "Organic Cotton Extract Wet Wipes", size: "100 wipes", mrp: 320, barcode: "8690530063914" },
  { id: "ww-antibac", category: "wipes", name: "Anti-Bacterial Wet Wipes", size: "15 x 3 packs", mrp: 315, barcode: "8690530068254" },
  { id: "ww-classic", category: "wipes", name: "Classic Wet Wipes", size: "15 x 3 packs", mrp: 315, barcode: "8690530068193" },
  { id: "ww-toilet", category: "wipes", name: "Wet Toilet Wipes", size: "1 pack", mrp: 315, barcode: "8690530012233" },
  // Napkin
  { id: "nap-deluxe-20", category: "napkin", name: "Deluxe Printed Napkin", size: "20 sheets", mrp: 110, barcode: "8690530029330", tag: "deluxe", tagText: "Deluxe" },
  { id: "nap-lunch-75", category: "napkin", name: "Luncheon Napkin", size: "75 sheets", mrp: 225, barcode: "8690530016514" },
  { id: "nap-cocktail-50", category: "napkin", name: "Cocktail Napkin", size: "50 sheets", mrp: 100, barcode: "8690530118263" },
  { id: "nap-lunch-100", category: "napkin", name: "Luncheon Napkin", size: "100 sheets", mrp: 320, barcode: "8690530118232" },
  { id: "nap-dinner-50", category: "napkin", name: "Dinner Napkin", size: "50 sheets", mrp: 250, barcode: "8690530118256" },
];
