# Selpak Store — Web (frontend)

The B2C storefront, built with Next.js 16 (App Router), React 19 and TypeScript. Styling is plain
CSS in `src/app/globals.css`, using the design-system tokens.

Design screenshots: [full design PDF](../design/Selpak_Store_Design.pdf) ·
Team guide: [PDF](../docs/Selpak_Team_Guide.pdf) ·
Backend endpoints: [API contract](../docs/API_CONTRACT.md)

## Run it

You need Node.js 20.9 or newer.

```bash
cd web
npm install
npm run dev        # http://localhost:3000
```

Other commands:

```bash
npm run lint       # check the code
npm run build      # production build
npm run start      # serve the production build
```

## Demo mode and the real backend

Copy `.env.example` to `.env.local`.

- `NEXT_PUBLIC_API_URL` **empty** → demo mode: the login OTP is `123456`, orders are saved in the
  browser, and online payment opens a test screen (no real money).
- `NEXT_PUBLIC_API_URL` **set** → the real backend is used (`src/lib/api/http.ts`). The endpoints
  are listed in the [API contract](../docs/API_CONTRACT.md). This path has not yet been tested
  against a real server.

`NEXT_PUBLIC_RAZORPAY_KEY_ID` takes the **public** Razorpay key only. The secret key belongs to the
backend and must never be added to the frontend or committed to Git.

## Folder structure

```
src/
  app/            Pages (one folder per URL)
  components/     UI pieces (Header, ProductCard, CheckoutView ...)
  data/           catalog.ts — product data (2026 catalogue)
  lib/            catalog.ts (reading products), api/ (backend calls), config.ts, format.ts
  store/          cart, auth, address, toast (state saved in the browser)
public/products/  Product images, named <product-id>.png
```

### Routes

| URL | Page |
|---|---|
| `/` | Home |
| `/shop`, `/shop/[category]` | All products, category pages (search, filter, sort) |
| `/product/[slug]` | Product detail |
| `/cart` | Cart |
| `/checkout` | Address and payment |
| `/order?id=...` | Order confirmation and details |
| `/login` | Mobile number + OTP login |
| `/account`, `/account/orders` | Profile, order history |
| `/contact` | Contact form |
| `/policies/[slug]` | Shipping, returns, privacy, terms |

## How data flows

```
Page (app/) → Component (components/) → lib/catalog, lib/api, store/ → data file + localStorage (demo)
                                                                      → backend API (production)
```

Pages and components never read the data file, `fetch` or `localStorage` directly. They go through
`lib/catalog.ts` (products) and `api` from `lib/api` (login, orders, payment). That is why the
backend can be connected later without changing the pages.

## Rules

- Do not invent new colours or font sizes; use the tokens and classes in `globals.css`.
- Build every state: loading, empty, error and success.
- Show prices with `inr(amount)`. Totals in the frontend are for display only; the backend must
  calculate the real amount.
- `npm run lint` and `npm run build` must pass before every pull request.
- This Next.js version is new. Before using a Next.js feature, read the bundled docs in
  `node_modules/next/dist/docs/` (see `AGENTS.md`).
