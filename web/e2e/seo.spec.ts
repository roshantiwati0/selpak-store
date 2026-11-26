import { expect, test } from "@playwright/test";

/* Yeh tests JavaScript chalaye bina sirf server ka HTML dekhte hain,
   jaisa Google ya koi crawler pehli baar dekhta hai. */

const count = (html: string, needle: string) => html.split(needle).length - 1;
const CARD = '<article class="pcard"';

test("product lists are in the server HTML", async ({ request }) => {
  const expected: Record<string, number> = {
    "/": 16,
    "/shop": 40,
    "/shop?q=wipes": 4,
    "/shop?tag=promo": 5,
    "/shop/toilet": 15,
    "/shop/kitchen": 7,
    "/shop/facial": 5,
    "/shop/hanky": 4,
    "/shop/wipes": 4,
    "/shop/napkin": 5,
  };
  for (const [path, cards] of Object.entries(expected)) {
    const html = await (await request.get(path)).text();
    expect(count(html, CARD), `product cards on ${path}`).toBe(cards);
  }
});

test("product page has title, price, canonical link and structured data", async ({ request }) => {
  const response = await request.get("/product/tp-12");
  expect(response.status()).toBe(200);
  const html = await response.text();
  expect(html).toContain("<title>Selpak Toilet Roll 3 Ply, 12 rolls — Selpak Store</title>");
  expect(html).toMatch(/<h1[^>]*>Selpak Toilet Roll 3 Ply, 12 rolls<\/h1>/);
  expect(html).toContain("₹1,040");
  expect(html).toMatch(/<link rel="canonical" href="[^"]*\/product\/tp-12"/);
  expect(html).toContain('type="application/ld+json"');
  expect(html).toContain('"gtin13":"8690530204508"');
});

test("category page has its own title and heading", async ({ request }) => {
  const html = await (await request.get("/shop/kitchen")).text();
  expect(html).toContain("<title>Kitchen Towels — Selpak Store</title>");
  expect(html).toMatch(/<h1[^>]*>Kitchen Towels<\/h1>/);
});

test("unknown pages are not indexable", async ({ request }) => {
  expect((await request.get("/this-page-does-not-exist")).status()).toBe(404);
  for (const path of ["/product/does-not-exist", "/shop/does-not-exist"]) {
    const html = await (await request.get(path)).text();
    expect(html, path).toContain('name="robots" content="noindex"');
  }
});

test("sitemap and robots.txt", async ({ request }) => {
  const sitemap = await (await request.get("/sitemap.xml")).text();
  expect(count(sitemap, "<url>")).toBe(3 + 6 + 40 + 4); // home, shop, contact + categories + products + policies
  expect(sitemap).toContain("/product/tp-12</loc>");
  const robots = await (await request.get("/robots.txt")).text();
  expect(robots).toContain("Disallow: /checkout");
  expect(robots).toContain("sitemap.xml");
});
