import type { Order, OrderStatus, PaymentStatus } from "@/lib/types";

const STEPS: { key: OrderStatus; label: string }[] = [
  { key: "placed", label: "Placed" },
  { key: "packed", label: "Packed" },
  { key: "out_for_delivery", label: "Out for delivery" },
  { key: "delivered", label: "Delivered" },
];

export function OrderTrack({ status }: { status: OrderStatus }) {
  if (status === "cancelled") return null;
  const current = STEPS.findIndex((s) => s.key === status);
  return (
    <div className="track" role="list" aria-label="Order progress">
      {STEPS.map((s, i) => (
        <div key={s.key} role="listitem" className={i <= current ? "is-done" : undefined} aria-current={i === current ? "step" : undefined}>
          {s.label}
        </div>
      ))}
    </div>
  );
}

const STATUS: Record<OrderStatus, [string, string]> = {
  placed: ["Order placed", "warn"],
  packed: ["Packed", "warn"],
  out_for_delivery: ["Out for delivery", "warn"],
  delivered: ["Delivered", "ok"],
  cancelled: ["Cancelled", "err"],
};

export function StatusBadge({ status }: { status: OrderStatus }) {
  const [label, tone] = STATUS[status];
  return <span className={`badge badge-${tone}`}>{label}</span>;
}

const PAYMENT: Record<PaymentStatus, [string, string]> = {
  paid: ["Paid online", "ok"],
  pending: ["Payment pending", "warn"],
  cod: ["Cash on delivery", "pro"],
  failed: ["Payment failed", "err"],
};

export function PaymentBadge({ order }: { order: Order }) {
  const [label, tone] = PAYMENT[order.paymentStatus];
  return <span className={`badge badge-${tone}`}>{label}</span>;
}
