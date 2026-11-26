import { expect, test, type Page } from "@playwright/test";

/* Customer ka poora safar (demo mode): browse -> cart -> checkout -> order -> login -> orders.
   Note: Next.js pichhle page ko chhupa kar DOM me rakhta hai, isliye locators me `:visible` lagate hain. */

const PHONE = "9876543210";
const cards = (page: Page) => page.locator(".pcard:visible");
const placeOrderButton = (page: Page) => page.locator("aside:visible button[type=submit]");

async function addToCart(page: Page, productId: string, extraClicks = 0) {
  await page.goto(`/product/${productId}`, { waitUntil: "networkidle" });
  for (let i = 0; i < extraClicks; i++) await page.getByRole("button", { name: "Increase quantity" }).click();
  await page.getByRole("button", { name: /Add to cart/ }).click();
  await expect(page.locator(".toast")).toContainText("Added to cart");
}

async function fillAddress(page: Page) {
  await page.fill("#f-name", "Test Customer");
  await page.fill("#f-phone", PHONE);
  await page.fill("#f-pincode", "400001");
  await page.fill("#f-city", "Mumbai");
  await page.fill("#f-line1", "12 Sample Building, Test Road");
}

async function placeCodOrder(page: Page, productId = "tp-4") {
  await addToCart(page, productId);
  await page.goto("/checkout", { waitUntil: "networkidle" });
  await fillAddress(page);
  await page.getByText("Cash on delivery", { exact: true }).click();
  await placeOrderButton(page).click();
  await expect(page).toHaveURL(/\/order\?id=/);
  await expect(page.getByRole("heading", { name: "Order placed" })).toBeVisible();
}

test("add to cart from a card and from the product page; cart survives reload", async ({ page }) => {
  await page.goto("/", { waitUntil: "networkidle" });
  await cards(page).first().getByRole("button").click(); // Toilet Roll 12 rolls, ₹1,040
  await expect(page.locator(".cart-count")).toHaveText("1");

  await page.goto("/product/kt-4", { waitUntil: "networkidle" });
  await page.getByRole("button", { name: "Increase quantity" }).click();
  await expect(page.getByRole("button", { name: /Add to cart/ })).toContainText("1,120");
  await page.getByRole("button", { name: /Add to cart/ }).click();
  await expect(page.locator(".cart-count")).toHaveText("3");

  await page.goto("/cart", { waitUntil: "networkidle" });
  await expect(page.locator(".sum-total")).toContainText("2,160");
  await page.reload({ waitUntil: "networkidle" });
  await expect(page.locator(".line")).toHaveCount(2);

  await page.getByRole("button", { name: "Remove" }).first().click();
  await expect(page.locator(".line")).toHaveCount(1);
  await expect(page.locator(".sum-total")).toContainText("1,120");
});

test("pincode check on the product page", async ({ page }) => {
  await page.goto("/product/tp-12", { waitUntil: "networkidle" });
  await page.getByLabel("Check delivery").fill("400001");
  await page.getByRole("button", { name: "Check", exact: true }).click();
  await expect(page.getByText("Delivery available to 400001.")).toBeVisible();
  await page.getByLabel("Check delivery").fill("123");
  await page.getByRole("button", { name: "Check", exact: true }).click();
  await expect(page.getByText("Enter a valid 6-digit pincode.")).toBeVisible();
});

test("checkout validates the form, then places a cash-on-delivery order", async ({ page }) => {
  await addToCart(page, "tp-12");
  await page.goto("/checkout", { waitUntil: "networkidle" });
  await placeOrderButton(page).click();
  await expect(page.locator(".field .err")).toHaveCount(5);
  await expect(page.locator("#f-name")).toBeFocused();

  await fillAddress(page);
  await page.getByText("Cash on delivery", { exact: true }).click();
  await placeOrderButton(page).click();

  await expect(page).toHaveURL(/\/order\?id=/);
  await expect(page.getByRole("heading", { name: "Order placed" })).toBeVisible();
  await expect(page.locator("#main")).toContainText("Cash on delivery");
  await expect(page.locator(".cart-count")).toHaveCount(0);
});

test("a failed online payment can be retried", async ({ page }) => {
  await addToCart(page, "tp-4");
  await page.goto("/checkout", { waitUntil: "networkidle" });
  await fillAddress(page);
  await placeOrderButton(page).click();
  await page.getByRole("button", { name: "Simulate failed payment" }).click();
  await expect(page.locator(".notice-err")).toContainText("Payment failed");
  await expect(page).toHaveURL(/\/checkout/);
  await expect(placeOrderButton(page)).toHaveText("Retry payment");

  await placeOrderButton(page).click();
  await page.getByRole("button", { name: "Simulate successful payment" }).click();
  await expect(page).toHaveURL(/\/order\?id=/);
  await expect(page.locator("#main")).toContainText("Paid online");
});

test("login with OTP, see orders, reorder", async ({ page }) => {
  await placeCodOrder(page);

  await page.goto("/account/orders", { waitUntil: "networkidle" });
  await expect(page.locator("#main")).toContainText("Please log in");
  await page.locator("#main").getByRole("link", { name: "Login", exact: true }).click();

  await page.fill("#l-phone", "12345");
  await page.getByRole("button", { name: "Send OTP" }).click();
  await expect(page.locator("#l-err")).toContainText("valid 10-digit");

  await page.fill("#l-phone", PHONE);
  await page.getByRole("button", { name: "Send OTP" }).click();
  await page.fill("#l-otp", "000000");
  await page.getByRole("button", { name: "Verify and continue" }).click();
  await expect(page.locator("#l-err")).toContainText("Incorrect OTP");

  await page.fill("#l-otp", "123456");
  await page.getByRole("button", { name: "Verify and continue" }).click();
  await expect(page).toHaveURL(/\/account\/orders/);
  await expect(page.locator("article.card:visible")).toHaveCount(1);

  await page.getByRole("button", { name: "Reorder" }).click();
  await expect(page).toHaveURL(/\/cart/);
  await expect(page.locator(".line")).toHaveCount(1);
});

test("category filters, sorting and search", async ({ page }) => {
  await page.goto("/shop/toilet", { waitUntil: "networkidle" });
  await expect(cards(page)).toHaveCount(15);
  await page.getByLabel("Promo packs").check();
  await expect(cards(page)).toHaveCount(3);
  await page.getByLabel("Sort by").selectOption("price-desc");
  await expect(cards(page).first().locator(".pcard-price")).toContainText("2,650");

  await page.fill("input[name=q]", "wet wipes");
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/q=wet/);
  await expect(page.locator("h1:visible")).toContainText("wet wipes");
  await expect(cards(page)).toHaveCount(4);

  await page.fill("input[name=q]", "kitchen");
  await page.keyboard.press("Enter");
  await expect(page.locator("h1:visible")).toContainText("kitchen");
  await expect(cards(page)).toHaveCount(7);

  await page.goto("/shop?q=zzzz", { waitUntil: "networkidle" });
  await expect(page.getByText("No products found")).toBeVisible();

  await page.goto("/", { waitUntil: "networkidle" });
  await page.getByRole("link", { name: "See promo packs" }).first().click();
  await expect(page).toHaveURL(/tag=promo/);
  await expect(cards(page)).toHaveCount(5);
});

test("contact form validates and sends", async ({ page }) => {
  await page.goto("/contact", { waitUntil: "networkidle" });
  await page.getByRole("button", { name: "Send message" }).click();
  await expect(page.locator(".field .err")).toHaveCount(3);
  await page.fill("#c-name", "Test Customer");
  await page.fill("#c-phone", PHONE);
  await page.fill("#c-message", "This is a test message.");
  await page.getByRole("button", { name: "Send message" }).click();
  await expect(page.getByRole("heading", { name: "Message sent" })).toBeVisible();
});

test.describe("mobile", () => {
  test.use({ viewport: { width: 390, height: 800 }, isMobile: true, hasTouch: true });

  test("no horizontal scroll, bottom navigation and filter sheet work", async ({ page }) => {
    for (const path of ["/", "/shop/kitchen", "/product/tp-12", "/cart", "/checkout", "/login", "/contact"]) {
      await page.goto(path, { waitUntil: "networkidle" });
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
      expect(overflow, `horizontal overflow on ${path}`).toBeLessThanOrEqual(0);
    }
    await expect(page.locator(".bottom-nav")).toBeVisible();

    await page.goto("/shop/kitchen", { waitUntil: "networkidle" });
    await page.getByRole("button", { name: /^Filters/ }).click();
    await expect(page.locator(".filters.is-open")).toBeVisible();
    await page.getByLabel("Deluxe / Premium").check();
    await page.getByRole("button", { name: "Show 1" }).click();
    await expect(page.locator(".filters.is-open")).toHaveCount(0);
    await expect(cards(page)).toHaveCount(1);
  });
});
