# Selpak Store

A B2C e-commerce storefront for Selpak tissue and hygiene products: toilet paper, kitchen towels,
facial tissue, hankies, wet wipes and napkins. Customers can browse the catalogue, add items to a
cart, and check out with online payment (Razorpay) or cash on delivery.

This repository is the **frontend**, built with Next.js 16 (App Router), React 19 and TypeScript.
Styling is plain CSS in `src/app/globals.css`, using design-system tokens. The backend (database,
API, payment verification) is built by a separate team.

<p align="center">
  <img src="docs/screenshots/05-product.png" alt="Product detail page on desktop and mobile" width="820">
</p>

## Design and screenshots

Every screen was designed before development, in desktop and mobile sizes.

- **[Full design (PDF)](docs/Selpak_Store_Design.pdf)** — all screens in one file
- **[Team guide (PDF)](docs/Selpak_Team_Guide.pdf)** — project structure, team roles, workflow and launch plan
- **[API contract](docs/API_CONTRACT.md)** — the endpoints the frontend expects from the backend

| Screen | Image |
|---|---|
| Sitemap and user flows | [01-sitemap-userflow.png](docs/screenshots/01-sitemap-userflow.png) |
| Design system | [02-design-system.png](docs/screenshots/02-design-system.png) |
| Home | [03-home.png](docs/screenshots/03-home.png) |
| Shop / category | [04-shop.png](docs/screenshots/04-shop.png) |
| Product detail | [05-product.png](docs/screenshots/05-product.png) |
| Cart | [06-cart.png](docs/screenshots/06-cart.png) |
| Checkout | [07-checkout.png](docs/screenshots/07-checkout.png) |
| Order placed | [08-order-placed.png](docs/screenshots/08-order-placed.png) |
| My orders | [09-my-orders.png](docs/screenshots/09-my-orders.png) |
| Login / sign up | [10-login.png](docs/screenshots/10-login.png) |
| Contact | [11-contact.png](docs/screenshots/11-contact.png) |

## Features

- **Catalogue** — home page, 6 category pages and 40 product pages, with search, filters and sorting
- **Cart** — quantities, totals, and a cart that survives closing the browser
- **Checkout** — validated address form, cash on delivery, and online payment with failure and retry handling
- **Orders** — order confirmation, order details, progress tracking and one-click reorder
- **Account** — mobile number + OTP login, order history and profile
- **Support** — contact form and shipping, returns, privacy and terms pages
- **SEO** — server-rendered product lists, page titles, canonical URLs, product structured data, sitemap and robots.txt
- **Responsive** — mobile-first layout with a bottom navigation bar and accessible, keyboard-friendly forms
- **Tested** — 30 end-to-end tests cover the shopping flow, server-rendered HTML and a clean browser console
- **Private** — no analytics or tracking scripts, and Next.js telemetry is switched off

## Tech stack

| Tool | Used for |
|---|---|
| [Next.js 16](https://nextjs.org) (App Router) | Framework, routing, static pages, image optimisation |
| React 19 | UI components |
| TypeScript | Type safety |
| Plain CSS with design tokens | Styling (`src/app/globals.css`) |
| ESLint | Code quality |
| Playwright | End-to-end tests |

## Run it

You need [Node.js](https://nodejs.org) 20.9 or newer.

```bash
git clone https://github.com/roshantiwati0/selpak-store.git
cd selpak-store
npm install
npm run dev        # http://localhost:3000
```

Other commands:

```bash
npm run lint       # check the code with ESLint
npm run typecheck  # check TypeScript types
npm run build      # production build
npm run start      # serve the production build
npm run test:e2e   # end-to-end tests in a real browser (see Testing)
npm run check      # lint + typecheck + build, run this before every pull request
```

The `dev`, `build` and `start` scripts set `NEXT_TELEMETRY_DISABLED=1`, so Next.js does not send
usage data from this project. The app itself contains no analytics or tracking scripts.

## Demo mode and the real backend

Copy `.env.example` to `.env.local`.

- `NEXT_PUBLIC_API_URL` **empty** → demo mode: the login OTP is `123456`, orders are saved in the
  browser, and online payment opens a test screen (no real money).
- `NEXT_PUBLIC_API_URL` **set** → the real backend is used (`src/lib/api/http.ts`). The endpoints
  are listed in the [API contract](docs/API_CONTRACT.md). This path has not yet been tested
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
e2e/              End-to-end tests (Playwright)
docs/             Design PDF, screenshots, team guide and API contract
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

## Testing

`npm run test:e2e` runs the [Playwright](https://playwright.dev) tests in `e2e/`. It uses the dev
server if one is already running on port 3000, otherwise it starts one. The tests use the Microsoft
Edge already installed on the computer, so nothing extra is downloaded
(`PW_CHANNEL=chrome npm run test:e2e` uses Chrome instead).

| File | What it checks |
|---|---|
| `e2e/console.spec.ts` | Every page loads with **no console errors or warnings** and no issues in the Next.js dev overlay |
| `e2e/seo.spec.ts` | Product lists, titles, canonical links and structured data are in the server HTML; sitemap and robots.txt |
| `e2e/shopping.spec.ts` | Cart, checkout (COD and online with failure + retry), login, orders, reorder, filters, search, contact form, mobile layout |

To test a production build: `npm run build`, then `npm run start -- -p 3210`, then
`E2E_BASE_URL=http://localhost:3210 npm run test:e2e`.

## Next.js 16 rules that are easy to get wrong

These caused real errors in the dev overlay, so follow them in new pages:

- **Do not `await params` or `await searchParams` at the top of a page.** Pass the promise to a child
  component wrapped in `<Suspense fallback={...}>` and await it there. See
  `src/app/product/[slug]/page.tsx` and `src/app/shop/page.tsx`.
- **Read URL data on the server, not with `useSearchParams`, when the result should be in the HTML.**
  A client component that calls `useSearchParams` is rendered only in the browser, so its content is
  missing from the server HTML (bad for SEO). `ShopView` gets `search` and `initialTag` as props.
- **Images above the fold need `loading="eager"`** (or `preload` for the single main image). The old
  `priority` prop is deprecated.
- **Previous pages stay mounted but hidden.** Use `useId()` for element ids in components that can
  appear on more than one page at once, and in tests select with `:visible`.

## Rules

- Do not invent new colours or font sizes; use the tokens and classes in `globals.css`.
- Build every state: loading, empty, error and success.
- Show prices with `inr(amount)`. Totals in the frontend are for display only; the backend must
  calculate the real amount.
- `npm run check` and `npm run test:e2e` must pass before every pull request.
- This Next.js version is new. Before using a Next.js feature, read the bundled docs in
  `node_modules/next/dist/docs/` (see `AGENTS.md`).

## Project status

The frontend is complete and tested in demo mode. Before launch, the following still needs to be done:

- Connect and test the real backend API
- Connect and test live Razorpay payments and SMS OTP
- Confirm prices, delivery charges and delivery areas with the seller
- Replace the draft policy pages with the seller's final text

Prices shown are the catalogue MRP. Order numbers and addresses in the design screenshots are sample data.

## Sold by

Hariom Marketing, Mumbai.
