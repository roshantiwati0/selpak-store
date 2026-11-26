# Selpak Store — Web (frontend)

B2C ecommerce frontend. Next.js 16 (App Router) + React 19 + TypeScript. Styling plain CSS
(`src/app/globals.css`) jo design system ke tokens use karta hai.

## Chalana

Node.js 20.9 ya naya chahiye.

```bash
cd web
npm install
npm run dev        # http://localhost:3000
```

Dusre commands:

```bash
npm run lint       # code check
npm run build      # production build
npm run start      # build ko chalana
```

## Demo mode aur asli backend

`.env.example` ko copy karke `.env.local` banao.

- `NEXT_PUBLIC_API_URL` **khaali** → demo mode: login ka OTP `123456`, orders browser me save,
  online payment ek test screen (koi asli paisa nahi).
- `NEXT_PUBLIC_API_URL` **set** → asli backend (`src/lib/api/http.ts`). Endpoints
  team ke paas `API_CONTRACT.md` me hain. Yeh hissa abhi kisi asli server ke saath test nahi hua.

## Folder structure

```
src/
  app/            Pages (har folder = ek URL)
  components/     UI ke tukde (Header, ProductCard, CheckoutView ...)
  data/           catalog.ts — products ka data (catalogue 2026)
  lib/            catalog.ts (products padhna), api/ (backend calls), config.ts, format.ts
  store/          cart, auth, address, toast (browser me save hone wala state)
public/products/  Product images
```

Poora guide team ke paas `Selpak_Team_Guide.pdf` me hai.

## Rules

- Pages data ke liye sirf `lib/catalog.ts` aur `lib/api` use karein, `data/` ko seedha nahi.
- Naye colours / font sizes mat banao; `globals.css` ke tokens use karo.
- Har PR se pehle `npm run lint` aur `npm run build` pass hona chahiye.
- Next.js ka yeh version naya hai: koi naya Next feature use karne se pehle
  `node_modules/next/dist/docs/` padho (dekho `AGENTS.md`).
