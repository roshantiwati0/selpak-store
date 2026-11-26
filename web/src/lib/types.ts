export type CategoryId = "toilet" | "kitchen" | "facial" | "hanky" | "wipes" | "napkin";

export type ProductTag = "promo" | "new" | "deluxe";

export interface Category {
  id: CategoryId;
  name: string;
  image: string; // product id whose image represents the category
  blurb: string;
}

export interface Product {
  id: string; // also the URL slug and the image file name
  category: CategoryId;
  name: string;
  size: string;
  mrp: number; // rupees, inclusive of taxes
  barcode: string;
  tag?: ProductTag;
  tagText?: string;
  scented?: boolean;
}

export interface CartItem {
  productId: string;
  qty: number;
}

export interface Address {
  name: string;
  phone: string;
  email?: string;
  pincode: string;
  city: string;
  line1: string;
  landmark?: string;
  state: string;
}

export type PaymentMethod = "online" | "cod";
export type PaymentStatus = "paid" | "pending" | "cod" | "failed";
export type OrderStatus = "placed" | "packed" | "out_for_delivery" | "delivered" | "cancelled";

export interface OrderLine {
  productId: string;
  name: string;
  size: string;
  price: number;
  qty: number;
}

export interface Order {
  id: string;
  createdAt: string; // ISO date
  lines: OrderLine[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  address: Address;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  status: OrderStatus;
}

export interface User {
  phone: string;
  name?: string;
}
