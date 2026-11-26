# API Contract — Frontend ↔ Backend

Yeh document frontend aur backend team ke beech ka "agreement" hai. Frontend ka code
(`web/src/lib/api/http.ts`) inhi endpoints ko call karta hai. Koi bhi badlav dono team
milkar karein aur is file me update karein.

- **Base URL:** `NEXT_PUBLIC_API_URL` (jaise `https://api.example.com/v1`)
- **Format:** JSON (`Content-Type: application/json`)
- **Auth:** login ke baad `Authorization: Bearer <token>` header
- **Paise:** sab amount **rupees** me (integer), sirf Razorpay ka `amount` **paise** me
- **Error:** HTTP status 4xx/5xx + body `{ "message": "User ko dikhane layak text" }`
- **CORS:** backend ko frontend ke domain ko allow karna hoga

## Data shapes

TypeScript types `web/src/lib/types.ts` me hain. Wahi source of truth hai.

```ts
Product   { id, category, name, size, mrp, barcode, tag?, tagText?, scented? }
Address   { name, phone, email?, pincode, city, line1, landmark?, state }
OrderLine { productId, name, size, price, qty }
Order     { id, createdAt, lines[], subtotal, deliveryFee, total, address,
            paymentMethod: "online"|"cod",
            paymentStatus: "paid"|"pending"|"cod"|"failed",
            status: "placed"|"packed"|"out_for_delivery"|"delivered"|"cancelled" }
User      { phone, name? }
```

## Endpoints

| # | Method | Path | Auth | Request body | Response |
|---|--------|------|------|--------------|----------|
| 1 | POST | `/auth/otp` | No | `{ phone }` | `204` |
| 2 | POST | `/auth/verify` | No | `{ phone, otp }` | `{ user: User, token: string }` |
| 3 | GET | `/delivery/pincode/:pincode` | No | — | `{ serviceable: boolean, message: string }` |
| 4 | POST | `/orders` | Optional | `{ items: [{ productId, qty }], address: Address, paymentMethod }` | `Order` |
| 5 | POST | `/orders/:id/razorpay` | Optional | — | `{ razorpayOrderId, amount (paise), currency: "INR" }` |
| 6 | POST | `/orders/:id/verify-payment` | Optional | `{ razorpay_order_id, razorpay_payment_id, razorpay_signature }` | `Order` (paymentStatus `paid`) |
| 7 | GET | `/orders` | **Yes** | — | `Order[]` (naya pehle) |
| 8 | GET | `/orders/:id` | Optional | — | `Order` ya `404` |
| 9 | POST | `/contact` | No | `{ name, phone, topic, message }` | `204` |

Abhi products frontend ki file `web/src/data/catalog.ts` se aate hain. Jab backend products dega:

| # | Method | Path | Response |
|---|--------|------|----------|
| 10 | GET | `/categories` | `Category[]` |
| 11 | GET | `/products?category=&q=&tag=&sort=` | `Product[]` |
| 12 | GET | `/products/:id` | `Product` ya `404` |

Tab sirf `web/src/lib/catalog.ts` badlega; pages nahi.

## Backend ke liye zaruri rules

1. **Price hamesha backend calculate kare.** Frontend sirf `productId` aur `qty` bhejta hai;
   `subtotal`, `deliveryFee`, `total` backend apne database ke price se nikale. Frontend ke
   bheje price par kabhi bharosa nahi.
2. **Razorpay secret key sirf backend ke paas.** Frontend ke paas sirf public `key_id` hota hai.
3. **Payment verify:** endpoint 6 me backend `razorpay_signature` ko HMAC-SHA256 se check kare,
   tabhi order `paid` kare. Saath me Razorpay **webhook** bhi lagayein (agar user payment ke
   baad browser band kar de to bhi order paid ho).
4. **OTP:** rate-limit (jaise ek number par 1 minute me 1 OTP), OTP 5 minute me expire.
5. **Guest order:** login ke bina bhi order ban sakta hai (endpoints 4, 5, 6, 8). `GET /orders`
   login wale user ke phone number ke orders lautata hai.
6. **Order id** aisa ho jo guess na ho sake (kyunki endpoint 8 bina login ke khulta hai),
   ya phir us par bhi login/phone check lagayein. Yeh dono team milkar tay karein.
7. **Validation:** phone `^[6-9]\d{9}$`, pincode `^[1-9]\d{5}$`, qty 1–20.

## Payment flow (online)

```
Frontend                         Backend                      Razorpay
   | POST /orders  ---------------> | order banaya (pending)
   | POST /orders/:id/razorpay ---> | ---- create order ------> |
   | <-- razorpayOrderId, amount -- |
   | Razorpay popup kholta hai ---------------------------------> |
   | <-- payment_id, signature ---------------------------------- |
   | POST /orders/:id/verify-payment > | signature check, paid
   | <-- Order (paid) ------------- |
   | /order?id=... (confirmation)
```

## Demo mode

`NEXT_PUBLIC_API_URL` khaali ho to frontend `web/src/lib/api/mock.ts` use karta hai:
orders/login browser ke localStorage me, OTP hamesha `123456`, payment ek test screen.
Isse frontend backend ke bina bhi poora chal sakta hai.
