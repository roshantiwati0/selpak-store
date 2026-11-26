/* Catalogue data — Selpak Product Catalogue 2026 (PDF se liya gaya).
   id = assets/<id>.png. Yahi structure baad me products.json / backend API banega. */

const CATEGORIES = [
  { id: "toilet",  name: "Toilet Paper",   img: "tp-12",          blurb: "3-ply, scented, Deluxe & Comfort" },
  { id: "kitchen", name: "Kitchen Towels", img: "kt-4",           blurb: "Super absorbent paper towels" },
  { id: "facial",  name: "Facial Tissue",  img: "ft-maxi-100",    blurb: "Boxes & soft packs" },
  { id: "hanky",   name: "Hanky",          img: "hanky-classic",  blurb: "Pocket packs, 4 variants" },
  { id: "wipes",   name: "Wet Wipes",      img: "ww-organic-100", blurb: "Classic, anti-bacterial, organic" },
  { id: "napkin",  name: "Napkins",        img: "nap-lunch-100",  blurb: "Cocktail, luncheon, dinner" },
];

const PRODUCTS = [
  // Toilet paper — plain
  { id: "tp-4",         cat: "toilet",  name: "Toilet Roll 3 Ply",                 size: "4 rolls",     mrp: 360,  caseQty: 12, barcode: "8690530204492" },
  { id: "tp-8",         cat: "toilet",  name: "Toilet Roll 3 Ply",                 size: "8 rolls",     mrp: 710,  caseQty: 6,  barcode: "8690530204515" },
  { id: "tp-12",        cat: "toilet",  name: "Toilet Roll 3 Ply",                 size: "12 rolls",    mrp: 1040, caseQty: 4,  barcode: "8690530204508" },
  { id: "tp-16",        cat: "toilet",  name: "Toilet Roll 3 Ply",                 size: "16 rolls",    mrp: 1370, caseQty: 3,  barcode: "8690530134546" },
  { id: "tp-24",        cat: "toilet",  name: "Toilet Roll 3 Ply",                 size: "24 rolls",    mrp: 2000, caseQty: 3,  barcode: "8690530204478" },
  { id: "tp-7-2",       cat: "toilet",  name: "Toilet Roll 3 Ply",                 size: "7+2 rolls",   mrp: 625,  caseQty: 8,  barcode: "8690530015920", tag: "promo", tagText: "2 rolls free" },
  { id: "tp-14-4",      cat: "toilet",  name: "Toilet Roll 3 Ply",                 size: "14+4 rolls",  mrp: 1250, caseQty: 4,  barcode: "8690530184466", tag: "promo", tagText: "4 rolls free" },
  { id: "tp-32-8",      cat: "toilet",  name: "Toilet Roll 3 Ply",                 size: "32+8 rolls",  mrp: 2650, caseQty: 3,  barcode: "8690530059474", tag: "promo", tagText: "8 rolls free" },
  // Toilet paper — variants
  { id: "tp-powder-4",  cat: "toilet",  name: "Toilet Roll Powder Scented",        size: "4 rolls",     mrp: 380,  caseQty: 12, barcode: "8690530065482", scented: true },
  { id: "tp-powder-8",  cat: "toilet",  name: "Toilet Roll Powder Scented",        size: "8 rolls",     mrp: 740,  caseQty: 6,  barcode: "8690530044517", scented: true },
  { id: "tp-extra-4",   cat: "toilet",  name: "Extra Perfumed Toilet Roll",        size: "4 rolls",     mrp: 380,  caseQty: 12, barcode: "8690530046573", scented: true },
  { id: "tp-deluxe-4",  cat: "toilet",  name: "Toilet Roll Deluxe",                size: "4 rolls",     mrp: 360,  caseQty: 12, barcode: "8690530028975", tag: "deluxe", tagText: "Deluxe" },
  { id: "tp-comfort-4", cat: "toilet",  name: "Comfort Toilet Roll",               size: "4 rolls",     mrp: 300,  caseQty: 12, barcode: "8690530802117", tag: "new", tagText: "New" },
  { id: "tp-comfort-12",cat: "toilet",  name: "Comfort Toilet Roll",               size: "12 rolls",    mrp: 850,  caseQty: 4,  barcode: "8690530999053", tag: "new", tagText: "New" },
  { id: "tp-4ply-16",   cat: "toilet",  name: "Premium Toilet Roll 4 Ply",         size: "16 rolls",    mrp: 1635, caseQty: 3,  barcode: "8690530073210", tag: "deluxe", tagText: "4 Ply" },
  // Kitchen towel
  { id: "kt-2",         cat: "kitchen", name: "Kitchen Towel",                     size: "2 rolls",     mrp: 285,  caseQty: 12, barcode: "8690530015029" },
  { id: "kt-4",         cat: "kitchen", name: "Kitchen Towel",                     size: "4 rolls",     mrp: 560,  caseQty: 6,  barcode: "8690530015012" },
  { id: "kt-6",         cat: "kitchen", name: "Kitchen Towel",                     size: "6 rolls",     mrp: 810,  caseQty: 4,  barcode: "8690530015043" },
  { id: "kt-3-promo",   cat: "kitchen", name: "Kitchen Towel Promo",               size: "3 rolls",     mrp: 345,  caseQty: 8,  barcode: "8690530018242", tag: "promo", tagText: "20% free" },
  { id: "kt-3-1",       cat: "kitchen", name: "Kitchen Towel Promo",               size: "3+1 rolls",   mrp: 435,  caseQty: 6,  barcode: "8690530012356", tag: "promo", tagText: "1 roll free" },
  { id: "kt-8-deluxe",  cat: "kitchen", name: "Kitchen Towel Deluxe",              size: "8 rolls",     mrp: 1100, caseQty: 3,  barcode: "8690530044807", tag: "deluxe", tagText: "Deluxe" },
  { id: "kt-3-calorie", cat: "kitchen", name: "Kitchen Towel Calorie Absorb",      size: "3 rolls",     mrp: 450,  caseQty: 12, barcode: "8690530274297" },
  // Facial tissue
  { id: "ft-maxi-100",    cat: "facial", name: "Facial Tissue Maxi",               size: "100 sheets",  mrp: 250,  caseQty: 15, barcode: "8690530036727" },
  { id: "ft-boutique-48", cat: "facial", name: "Facial Tissue Boutique",           size: "48 sheets",   mrp: 145,  caseQty: 20, barcode: "8690530212220" },
  { id: "ft-standard-50", cat: "facial", name: "Facial Tissue Standard",           size: "50 sheets",   mrp: 140,  caseQty: 24, barcode: "8690530036697" },
  { id: "ft-mini-70",     cat: "facial", name: "Facial Tissue Mini",               size: "70 sheets",   mrp: 175,  caseQty: 24, barcode: "8690530454781" },
  { id: "ft-soft-200",    cat: "facial", name: "Facial Tissue Soft Pack",          size: "200 pulls",   mrp: 230,  caseQty: 20, barcode: "8690530035751" },
  // Hanky
  { id: "hanky-classic", cat: "hanky",  name: "Hanky Classic",                     size: "10 packs",    mrp: 280,  caseQty: 30, barcode: "8690530151338" },
  { id: "hanky-flower",  cat: "hanky",  name: "Hanky Flower Scented",              size: "10 packs",    mrp: 280,  caseQty: 30, barcode: "8690530151352", scented: true },
  { id: "hanky-lotion",  cat: "hanky",  name: "Hanky Lotion Scented",              size: "10 packs",    mrp: 280,  caseQty: 30, barcode: "8690530161320", scented: true },
  { id: "hanky-menthol", cat: "hanky",  name: "Hanky Menthol Scented",             size: "10 packs",    mrp: 280,  caseQty: 30, barcode: "8690530151345", scented: true },
  // Wet wipes
  { id: "ww-organic-100", cat: "wipes", name: "Organic Cotton Extract Wet Wipes",  size: "100 wipes",   mrp: 320,  caseQty: 12, barcode: "8690530063914" },
  { id: "ww-antibac",     cat: "wipes", name: "Anti-Bacterial Wet Wipes",          size: "15 x 3 packs",mrp: 315,  caseQty: 24, barcode: "8690530068254" },
  { id: "ww-classic",     cat: "wipes", name: "Classic Wet Wipes",                 size: "15 x 3 packs",mrp: 315,  caseQty: 24, barcode: "8690530068193" },
  { id: "ww-toilet",      cat: "wipes", name: "Wet Toilet Wipes",                  size: "1 pack",      mrp: 315,  caseQty: 24, barcode: "8690530012233" },
  // Napkin
  { id: "nap-deluxe-20",   cat: "napkin", name: "Deluxe Printed Napkin",           size: "20 sheets",   mrp: 110,  caseQty: 20, barcode: "8690530029330", tag: "deluxe", tagText: "Deluxe" },
  { id: "nap-lunch-75",    cat: "napkin", name: "Luncheon Napkin",                 size: "75 sheets",   mrp: 225,  caseQty: 24, barcode: "8690530016514" },
  { id: "nap-cocktail-50", cat: "napkin", name: "Cocktail Napkin",                 size: "50 sheets",   mrp: 100,  caseQty: 24, barcode: "8690530118263" },
  { id: "nap-lunch-100",   cat: "napkin", name: "Luncheon Napkin",                 size: "100 sheets",  mrp: 320,  caseQty: 24, barcode: "8690530118232" },
  { id: "nap-dinner-50",   cat: "napkin", name: "Dinner Napkin",                   size: "50 sheets",   mrp: 250,  caseQty: 20, barcode: "8690530118256" },
];

/* Selpak Professional — catalogue me price nahi hai, isliye "Request quote" */
const PRO_GROUPS = [
  { id: "towel",  name: "Paper Towels" },
  { id: "toilet", name: "Toilet Paper" },
  { id: "napkin", name: "Napkins" },
];

const PRO_PRODUCTS = [
  { id: "pro-hrt-70",         group: "towel",  type: "Consumable", name: "Dispenser Towel HRT 70 m",          pack: "Pack of 6",  specs: { "Roll length": "70 m", "Ply": "2", "Sheet width": "21 cm" } },
  { id: "pro-hrt-135",        group: "towel",  type: "Consumable", name: "Dispenser Towel HRT 135 m",         pack: "Pack of 6",  specs: { "Roll length": "135 m", "Ply": "2", "Sheet width": "21 cm" } },
  { id: "pro-cf-140",         group: "towel",  type: "Consumable", name: "Centre Feed HRT Towel 140 m",       pack: "Pack of 9",  specs: { "Roll length": "140 m", "Ply": "1", "Sheet width": "21 cm" } },
  { id: "pro-vfold-towel",    group: "towel",  type: "Consumable", name: "Professional V Fold Towel",         pack: "Case of 15", specs: { "Size": "21 x 21.5 cm", "Case qty": "15", "Barcode": "8690530066021" } },
  { id: "pro-zfold-towel",    group: "towel",  type: "Consumable", name: "Professional Z Fold Towel",         pack: "Case of 12", specs: { "Size": "21.5 x 24 cm", "Case qty": "12", "Barcode": "8690530279858" } },
  { id: "pro-cf-towel-disp",  group: "towel",  type: "Dispenser",  name: "Centre Feed HRT Towel Dispenser",   pack: "White / Black", specs: { "Width": "19 cm", "Height": "30 cm", "Depth": "17 cm" } },
  { id: "pro-handy-disp",     group: "towel",  type: "Dispenser",  name: "Centre Feed Towel Handy Dispenser", pack: "Portable",   specs: { "Diameter": "18 cm", "Length": "23.5 cm", "Weight": "760 g" } },
  { id: "pro-zfold-disp",     group: "towel",  type: "Dispenser",  name: "Z Fold Towel Dispenser",            pack: "White / Black", specs: { "Width": "32 cm", "Height": "35 cm", "Depth": "13 cm" } },
  { id: "pro-cf-tp-70",       group: "toilet", type: "Consumable", name: "Centre Feed Toilet Paper 70 m",     pack: "12 rolls",   specs: { "Roll length": "70 m", "Ply": "2", "Sheet size": "11.8 x 22 cm" } },
  { id: "pro-jrt-85",         group: "toilet", type: "Consumable", name: "JRT Toilet Paper 85 m",             pack: "12 rolls",   specs: { "Roll length": "85 m", "Ply": "2", "Sheet size": "9.7 x 17 cm" } },
  { id: "pro-cf-tp-disp",     group: "toilet", type: "Dispenser",  name: "Centre Feed Toilet Paper Dispenser",pack: "White / Black", specs: { "Width": "21.5 cm", "Height": "22 cm", "Depth": "15.8 cm" } },
  { id: "pro-jrt-disp",       group: "toilet", type: "Dispenser",  name: "JRT Toilet Paper Dispenser",        pack: "White / Black", specs: { "Width": "25.5 cm", "Height": "23.7 cm", "Depth": "13.2 cm" } },
  { id: "pro-domi-napkin",    group: "napkin", type: "Consumable", name: "Domi Dispenser Napkin 1 Ply",       pack: "250 sheets", specs: { "Sheet length": "24 cm", "Sheet width": "26.5 cm", "Ply": "1" } },
  { id: "pro-vfold-napkin",   group: "napkin", type: "Consumable", name: "V Fold Napkin 1 Ply",               pack: "250 sheets", specs: { "Sheet length": "21 cm", "Sheet width": "21 cm", "Ply": "1" } },
  { id: "pro-domi-disp",      group: "napkin", type: "Dispenser",  name: "Domi Napkin Dispenser",             pack: "White / Black", specs: { "Width": "12.5 cm", "Height": "16.5 cm", "Depth": "12.5 cm" } },
  { id: "pro-vfold-nap-disp", group: "napkin", type: "Dispenser",  name: "V Fold Napkin Dispenser",           pack: "3 colours",  specs: { "Width": "11 cm", "Height": "12 cm", "Depth": "11 cm" } },
];

const SELLER = { name: "Hariom Marketing", city: "Mumbai", phone: "8169161409" };
