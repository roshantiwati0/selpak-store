import { expect, test, type Page } from "@playwright/test";

/* Har page khol kar check karta hai ki browser console me koi error / warning nahi hai
   aur Next.js ka dev overlay koi issue nahi dikha raha.
   Yahi test "params outside Suspense" aur "LCP image" jaisi galtiyan pakadta hai. */

const PAGES = [
  "/",
  "/shop",
  "/shop?q=wipes",
  "/shop?tag=promo",
  "/shop/toilet",
  "/product/tp-12",
  "/product/ft-maxi-100",
  "/cart",
  "/checkout",
  "/login",
  "/account",
  "/account/orders",
  "/contact",
  "/policies/shipping",
  "/order",
  // admin panel (bina login ke yeh login form dikhate hain; login ke baad wale pages admin.spec.ts me)
  "/admin",
  "/admin/orders",
  "/admin/order",
  "/admin/products",
  "/admin/customers",
];

function watchConsole(page: Page) {
  const problems: string[] = [];
  page.on("console", (message) => {
    const type = message.type();
    if (type === "error" || type === "warning") problems.push(`[console.${type}] ${message.text().slice(0, 300)}`);
  });
  page.on("pageerror", (error) => problems.push(`[pageerror] ${error.message}`));
  page.on("response", (response) => {
    if (response.status() >= 400) problems.push(`[http ${response.status()}] ${response.url()}`);
  });
  return problems;
}

/** Number of issues the Next.js dev overlay is showing (0 in production, where there is no overlay). */
async function overlayIssues(page: Page) {
  const text = await page.evaluate(
    () => document.querySelector("nextjs-portal")?.shadowRoot?.querySelector("[data-issues-count]")?.textContent ?? "0",
  );
  return Number.parseInt(text, 10) || 0;
}

async function scrollThrough(page: Page) {
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 600) {
      window.scrollTo(0, y);
      await new Promise((resolve) => setTimeout(resolve, 50));
    }
  });
}

for (const path of PAGES) {
  test(`no console errors or warnings on ${path}`, async ({ page }) => {
    const problems = watchConsole(page);
    await page.goto(path, { waitUntil: "networkidle" });
    await scrollThrough(page); // lazy images load, and their warnings (if any) show up
    await page.waitForTimeout(800);
    expect(problems, problems.join("\n")).toEqual([]);
    expect(await overlayIssues(page), "Next.js dev overlay issues").toBe(0);
  });
}

test("no console errors while navigating between pages", async ({ page }) => {
  const problems = watchConsole(page);
  await page.goto("/", { waitUntil: "networkidle" });
  await page.locator(".nav a", { hasText: "Kitchen Towels" }).click();
  await expect(page.locator("h1:visible")).toHaveText("Kitchen Towels");
  await page.locator(".pcard:visible .pcard-name").first().click();
  await expect(page).toHaveURL(/\/product\/kt-2$/);
  await expect(page.locator("h1:visible")).toHaveText("Selpak Kitchen Towel, 2 rolls");
  await page.locator(".pcard:visible .pcard-name").first().click(); // product -> related product
  await expect(page).toHaveURL(/\/product\/kt-4$/);
  await expect(page.locator("h1:visible")).toHaveText("Selpak Kitchen Towel, 4 rolls");
  await page.goBack();
  await expect(page.locator("h1:visible")).toHaveText("Selpak Kitchen Towel, 2 rolls");
  await page.goBack();
  await expect(page.locator("h1:visible")).toHaveText("Kitchen Towels");
  await page.waitForTimeout(500);
  expect(problems, problems.join("\n")).toEqual([]);
  expect(await overlayIssues(page), "Next.js dev overlay issues").toBe(0);
});

test("ids stay unique when a previous product page is kept hidden", async ({ page }) => {
  await page.goto("/product/tp-12", { waitUntil: "networkidle" });
  await page.locator(".pcard:visible .pcard-name").first().click();
  await expect(page).toHaveURL(/\/product\/tp-4/);
  const duplicates = await page.evaluate(() => {
    const seen = new Map<string, number>();
    document.querySelectorAll("[id]").forEach((el) => seen.set(el.id, (seen.get(el.id) ?? 0) + 1));
    return [...seen].filter(([id, count]) => id && count > 1).map(([id]) => id);
  });
  expect(duplicates).toEqual([]);
});
