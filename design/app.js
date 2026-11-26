/* Design prototype ka shared code: header, footer, product cards.
   Sirf mockup ke liye hai — asli site me yeh React components banenge. */

const inr = (n) => "₹" + Number(n).toLocaleString("en-IN");
const byId = (id) => PRODUCTS.find((p) => p.id === id);
const catName = (id) => (CATEGORIES.find((c) => c.id === id) || {}).name || "";
const qs = (k) => new URLSearchParams(location.search).get(k);
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

const ICON = {
  search: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>',
  user: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 3.6-6 8-6s8 2 8 6"/></svg>',
  cart: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 4h2.5l2.2 11h10.6L20.5 7H7"/><circle cx="9.5" cy="19.5" r="1.5"/><circle cx="17" cy="19.5" r="1.5"/></svg>',
  home: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M3 11 12 3l9 8v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/></svg>',
  grid: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></svg>',
  shield: '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M12 3 4 6v6c0 5 3.5 8 8 9 4.500-1 8-4 8-9V6z"/><path d="m9 12 2 2 4-4" stroke-linecap="round"/></svg>',
  cash: '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="12" cy="12" r="3"/></svg>',
  box: '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="m3 7 9-4 9 4v10l-9 4-9-4z"/><path d="m3 7 9 4 9-4M12 11v10"/></svg>',
  doc: '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M6 3h9l4 4v14H6z"/><path d="M9 12h7M9 16h7M9 8h3" stroke-linecap="round"/></svg>',
  check: '<svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m5 12.5 4.500 4.500L19 7.500"/></svg>',
};

function renderHeader() {
  const el = document.getElementById("site-header");
  if (!el) return;
  const active = document.body.dataset.page || "";
  const cat = qs("cat");
  const navLinks = CATEGORIES.map(
    (c) => `<a href="shop.html?cat=${c.id}" class="${active === "shop" && cat === c.id ? "is-on" : ""}">${c.name}</a>`
  ).join("");
  el.innerHTML = `
  <div class="topbar"><div class="container">
    <span>Sold by ${SELLER.name}, ${SELLER.city}</span>
    <span class="hide-m">Help? Call <a href="tel:${SELLER.phone}">${SELLER.phone}</a></span>
  </div></div>
  <header class="header">
    <div class="container header-main">
      <a class="logo" href="home.html" aria-label="Selpak home"><img src="assets/logo.png" alt="Selpak"></a>
      <form class="search" action="shop.html" role="search">
        ${ICON.search}
        <input type="search" name="q" placeholder="Search toilet rolls, tissues, wipes..." aria-label="Search products">
      </form>
      <div class="header-actions">
        <a class="icon-btn" href="login.html">${ICON.user}<span class="lbl">Login</span></a>
        <a class="icon-btn" href="cart.html">${ICON.cart}<span class="cart-count">3</span><span class="lbl">Cart</span></a>
      </div>
    </div>
    <nav class="nav" aria-label="Categories"><div class="container">
      <a href="shop.html" class="${active === "shop" && !cat ? "is-on" : ""}">All products</a>
      ${navLinks}
    </div></nav>
  </header>`;
}

function renderFooter() {
  const el = document.getElementById("site-footer");
  if (!el) return;
  const active = document.body.dataset.page || "";
  const on = (p) => (active === p ? "is-on" : "");
  el.innerHTML = `
  <footer class="footer">
    <div class="container">
      <div>
        <img src="assets/logo.png" alt="Selpak">
        <p>Selpak tissue and hygiene products for your home, sold by ${SELLER.name}, ${SELLER.city}.</p>
      </div>
      <div><h4>Shop</h4>${CATEGORIES.map((c) => `<a href="shop.html?cat=${c.id}">${c.name}</a>`).join("")}</div>
      <div><h4>My account</h4>
        <a href="login.html">Login / sign up</a>
        <a href="account-orders.html">My orders</a>
        <a href="cart.html">Cart</a>
      </div>
      <div><h4>Help</h4>
        <a href="contact.html">Contact us</a>
        <a href="account-orders.html">Track order</a>
        <a href="#">Shipping policy</a>
        <a href="#">Returns &amp; refunds</a>
        <a href="#">Privacy policy</a>
        <a href="#">Terms &amp; conditions</a>
      </div>
    </div>
    <div class="footer-bottom"><div class="container">
      <span>&copy; 2026 ${SELLER.name}. All rights reserved.</span>
      <span>UPI &middot; Cards &middot; Net banking &middot; Cash on delivery</span>
    </div></div>
  </footer>
  <nav class="bottom-nav" aria-label="Mobile">
    <a href="home.html" class="${on("home")}">${ICON.home}Home</a>
    <a href="shop.html" class="${on("shop")}">${ICON.grid}Shop</a>
    <a href="cart.html" class="${on("cart")}">${ICON.cart}Cart</a>
    <a href="account-orders.html" class="${on("account")}">${ICON.user}Account</a>
  </nav>`;
}

function badge(p) {
  return p.tag ? `<span class="badge badge-${p.tag}">${esc(p.tagText)}</span>` : "";
}

function productCard(p) {
  return `
  <article class="pcard">
    <a class="pcard-media" href="product.html?id=${p.id}">
      ${badge(p)}
      <img src="assets/${p.id}.png" alt="Selpak ${esc(p.name)} ${esc(p.size)}" loading="lazy">
    </a>
    <div class="pcard-body">
      <a class="pcard-name" href="product.html?id=${p.id}">Selpak ${esc(p.name)}</a>
      <div class="pcard-meta">${esc(p.size)}</div>
      <div class="pcard-foot">
        <div class="pcard-price price">${inr(p.mrp)}<small>MRP incl. taxes</small></div>
        <button class="btn btn-primary btn-sm" type="button">Add</button>
      </div>
    </div>
  </article>`;
}

function proCard(p) {
  const specs = Object.entries(p.specs).map(([k, v]) => `<span>${esc(k)}: <b>${esc(v)}</b></span>`).join("");
  return `
  <article class="pcard pro-card">
    <div class="pcard-media">
      <span class="badge badge-pro">${p.type}</span>
      <img src="assets/${p.id}.png" alt="Selpak Professional ${esc(p.name)}" loading="lazy">
    </div>
    <div class="pcard-body">
      <div class="pcard-name">${esc(p.name)}</div>
      <div class="pcard-meta">${esc(p.pack)}</div>
      <div class="mini-spec">${specs}</div>
      <div class="pcard-foot"><button class="btn btn-secondary btn-sm btn-block" type="button">Add to quote</button></div>
    </div>
  </article>`;
}

/* <div data-products data-ids="a,b" | data-cat="toilet" | data-tag="promo" data-limit="8"> */
function renderGrids() {
  document.querySelectorAll("[data-products]").forEach((el) => {
    let list = PRODUCTS;
    if (el.dataset.ids) list = el.dataset.ids.split(",").map(byId).filter(Boolean);
    if (el.dataset.cat) list = list.filter((p) => p.cat === el.dataset.cat);
    if (el.dataset.tag) list = list.filter((p) => p.tag === el.dataset.tag);
    if (el.dataset.limit) list = list.slice(0, +el.dataset.limit);
    el.innerHTML = list.map(productCard).join("");
  });
  document.querySelectorAll("[data-pro]").forEach((el) => {
    el.innerHTML = PRO_PRODUCTS.filter((p) => p.group === el.dataset.pro).map(proCard).join("");
  });
}

/* +/- steppers (mockup interaction) */
document.addEventListener("click", (e) => {
  const b = e.target.closest(".stepper button");
  if (!b) return;
  const out = b.parentElement.querySelector("output");
  const v = Math.max(1, +out.textContent + (b.dataset.d === "-" ? -1 : 1));
  out.textContent = v;
  b.parentElement.dispatchEvent(new CustomEvent("qty", { bubbles: true, detail: v }));
});

document.addEventListener("DOMContentLoaded", () => {
  renderHeader();
  renderFooter();
  renderGrids();
});
