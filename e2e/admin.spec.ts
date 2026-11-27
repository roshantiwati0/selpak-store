import { expect, test, type Page } from "@playwright/test";

/* Admin panel (demo mode): login -> dashboard -> orders -> products -> customers,
   aur dukaan ke navbar ka glass effect. */

/** Table rows of the page on screen (Next.js keeps the previous page hidden in the DOM, hence :visible). */
const rows = (page: Page) => page.locator(".adm-table tbody tr:visible");

async function login(page: Page) {
  await page.goto("/admin", { waitUntil: "networkidle" });
  await page.getByLabel("Username").fill("admin");
  await page.getByLabel("Password").fill("selpak123");
  await page.getByRole("button", { name: "Log in" }).click();
  await expect(page.getByRole("heading", { name: "Dashboard" })).toBeVisible();
}

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

async function overlayIssues(page: Page) {
  const text = await page.evaluate(
    () => document.querySelector("nextjs-portal")?.shadowRoot?.querySelector("[data-issues-count]")?.textContent ?? "0",
  );
  return Number.parseInt(text, 10) || 0;
}

test("the store navbar is glass with a border, and still readable", async ({ page }) => {
  await page.goto("/", { waitUntil: "networkidle" });
  const header = page.locator("header.header");
  const style = await header.evaluate((el) => {
    const s = getComputedStyle(el);
    return { blur: s.backdropFilter || s.getPropertyValue("-webkit-backdrop-filter"), background: s.backgroundColor, border: s.borderBottomWidth, position: s.position };
  });
  expect(style.blur).toContain("blur(");
  expect(style.background).toMatch(/rgba\(255, 255, 255, 0\.\d+\)/); // see-through white, not solid
  expect(style.border).toBe("1px");
  expect(style.position).toBe("sticky");

  // scrolled down, the navbar stays on top of the page content
  await page.evaluate(() => window.scrollTo(0, 900));
  await expect(header).toBeInViewport();
  await expect(page.getByRole("searchbox", { name: "Search products" })).toBeVisible();
});

test("the admin panel asks for a login and refuses a wrong password", async ({ page }) => {
  await page.goto("/admin/orders", { waitUntil: "networkidle" });
  await expect(page.getByRole("heading", { name: "Admin login" })).toBeVisible();
  // the store's own header and footer are not part of the admin panel
  await expect(page.locator("header.header")).toHaveCount(0);
  await expect(page.locator("footer.footer")).toHaveCount(0);

  await page.getByLabel("Username").fill("admin");
  await page.getByLabel("Password").fill("wrong");
  await page.getByRole("button", { name: "Log in" }).click();
  await expect(page.locator(".notice-err:visible")).toHaveText("Wrong username or password.");
  await expect(page.getByRole("heading", { name: "Admin login" })).toBeVisible();
});

test("dashboard, orders, products and customers work end to end", async ({ page }) => {
  const problems = watchConsole(page);
  await login(page);

  // dashboard: empty at first, then the sample orders
  await expect(page.locator(".adm-stat:visible").first()).toContainText("Orders today");
  await page.getByRole("button", { name: "Add sample orders" }).click();
  await expect(page.locator(".toast")).toContainText("8 sample orders added");
  const stat = (label: string) => page.locator(".adm-stat:visible", { hasText: label }).locator("b");
  await expect(stat("All orders")).toHaveText("8");
  await expect(stat("Orders today")).toHaveText("2");
  await expect(stat("To pack or deliver")).toHaveText("4");
  await expect(stat("Customers")).toHaveText("4");
  await expect(page.locator(".adm-bar:visible")).toHaveCount(7);
  await expect(page.locator(".adm-rank li:visible").first()).toBeVisible();
  // a second press adds nothing
  await page.getByRole("button", { name: "Add sample orders" }).click();
  await expect(page.locator(".toast").last()).toContainText("already there");
  await expect(stat("All orders")).toHaveText("8");

  // orders: filter, search, change a status, and it is still changed after a reload
  await page.getByRole("link", { name: "Orders", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Orders" })).toBeVisible();
  await expect(rows(page)).toHaveCount(8);
  await page.getByRole("button", { name: /To pack or deliver/ }).click();
  await expect(rows(page)).toHaveCount(4);
  await page.getByRole("button", { name: /^All/ }).click();
  await page.getByLabel("Search orders").fill("thane");
  await expect(rows(page)).toHaveCount(2);
  await page.getByLabel("Search orders").fill("");
  await page.getByLabel("Status of order SP-DEMO01").selectOption("packed");
  await expect(page.locator(".toast").last()).toContainText("SP-DEMO01: Packed");
  await page.reload({ waitUntil: "networkidle" });
  await expect(page.getByLabel("Status of order SP-DEMO01")).toHaveValue("packed");

  // one order: move it to the next step
  await page.getByRole("link", { name: "SP-DEMO01" }).click();
  await expect(page.getByRole("heading", { name: "Order SP-DEMO01" })).toBeVisible();
  await expect(page.getByText("12 Sample Building, Test Road")).toBeVisible();
  await page.getByRole("button", { name: "Mark as out for delivery" }).click();
  await expect(page.getByRole("button", { name: "Mark as delivered" })).toBeVisible();

  // the customer's own order page shows the new status
  await page.goto("/order?id=SP-DEMO01", { waitUntil: "networkidle" });
  await expect(page.locator(".badge:visible", { hasText: "Out for delivery" })).toBeVisible();

  // products: change a price and stock, take one off sale; kept after a reload
  await page.goto("/admin/products", { waitUntil: "networkidle" });
  await expect(rows(page).first()).toBeVisible();
  const total = await rows(page).count();
  expect(total).toBeGreaterThan(30);
  await page.getByLabel("Search products").fill("toilet 12 rolls");
  const row = rows(page).filter({ hasText: "8690530204508" });
  await expect(row).toHaveCount(1);
  await expect(row.getByRole("button", { name: "Save" })).toBeDisabled();
  await row.getByLabel(/^Price of/).fill("abc");
  await row.getByRole("button", { name: "Save" }).click();
  await expect(page.locator(".toast").last()).toContainText("Price must be a whole number");
  await row.getByLabel(/^Price of/).fill("1100");
  await row.getByLabel(/^Stock of/).fill("3");
  await row.getByRole("button", { name: "Save" }).click();
  await expect(page.locator(".toast").last()).toContainText("Saved: Toilet Roll 3 Ply, 12 rolls");
  await expect(row.locator(".adm-low")).toHaveText("Low");
  await row.getByRole("switch").uncheck();
  await expect(page.locator(".toast").last()).toContainText("Off sale");
  await page.reload({ waitUntil: "networkidle" });
  await page.getByLabel("Search products").fill("8690530204508");
  await expect(row.getByLabel(/^Price of/)).toHaveValue("1100");
  await expect(row.getByLabel(/^Stock of/)).toHaveValue("3");
  await expect(row.getByRole("switch")).not.toBeChecked();

  // customers: one row per mobile number
  await page.getByRole("link", { name: "Customers", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Customers" })).toBeVisible();
  await expect(rows(page)).toHaveCount(4);
  await page.getByLabel("Search customers").fill("9000000003");
  await expect(rows(page)).toHaveCount(1);
  await expect(rows(page)).toContainText("Sample Customer Three");

  // log out: back to the login form, and the pages are closed again
  await page.getByRole("button", { name: "Log out" }).click();
  await expect(page.getByRole("heading", { name: "Admin login" })).toBeVisible();
  await page.goto("/admin/customers", { waitUntil: "networkidle" });
  await expect(page.getByRole("heading", { name: "Admin login" })).toBeVisible();

  await page.waitForTimeout(500);
  expect(problems, problems.join("\n")).toEqual([]);
  expect(await overlayIssues(page), "Next.js dev overlay issues").toBe(0);
});

test("an order placed in the store shows up in the admin panel", async ({ page }) => {
  await page.goto("/product/tp-4", { waitUntil: "networkidle" });
  await page.getByRole("button", { name: /Add to cart/ }).click();
  await expect(page.locator(".toast")).toContainText("Added to cart");
  await page.goto("/checkout", { waitUntil: "networkidle" });
  await page.fill("#f-name", "Test Customer");
  await page.fill("#f-phone", "9876543210");
  await page.fill("#f-pincode", "400001");
  await page.fill("#f-city", "Mumbai");
  await page.fill("#f-line1", "12 Sample Building, Test Road");
  await page.getByText("Cash on delivery", { exact: true }).click();
  await page.locator("aside:visible button[type=submit]").click();
  await expect(page).toHaveURL(/\/order\?id=/);
  const id = new URL(page.url()).searchParams.get("id") ?? "";
  expect(id).toMatch(/^SP-/);

  await login(page);
  await expect(page.locator(".adm-stat:visible", { hasText: "Orders today" }).locator("b")).toHaveText("1");
  await expect(page.locator(".adm-stat:visible", { hasText: "Orders today" })).toContainText("₹360");
  await expect(page.getByRole("link", { name: id })).toBeVisible();
  await page.getByRole("link", { name: "Customers", exact: true }).click();
  await expect(rows(page)).toContainText("Test Customer");
  await expect(rows(page)).toContainText("9876543210");
});

test("the admin panel fits a phone screen", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 800 });
  await login(page);
  await page.getByRole("button", { name: "Add sample orders" }).click();
  await expect(page.locator(".adm-stat:visible", { hasText: "All orders" }).locator("b")).toHaveText("8");
  for (const path of ["/admin", "/admin/orders", "/admin/products", "/admin/customers"]) {
    await page.goto(path, { waitUntil: "networkidle" });
    await expect(page.locator(".adm-content h1:visible")).toBeVisible();
    // the page itself never scrolls sideways (a wide table scrolls inside its own card)
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow, `sideways scroll on ${path}`).toBeLessThanOrEqual(0);
    await expect(page.locator(".bottom-nav")).toHaveCount(0);
  }
});
