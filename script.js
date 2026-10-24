
const $ = id => document.getElementById(id);

const products = [
  {id:1,name:"Earthy Ceramic Mug",category:"Mugs",price:399,rating:4.8,size:"350 ml",material:"Stoneware ceramic",color:"Terracotta",stock:20,image:"https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&w=700&q=80",description:"A handmade mug for everyday tea and coffee."},
  {id:2,name:"Rustic Clay Vase",category:"Vases",price:899,rating:4.9,size:"24 cm",material:"Hand-shaped clay",color:"Rust brown",stock:12,image:"https://images.unsplash.com/photo-1578500494198-246f612d3b3d?auto=format&fit=crop&w=700&q=80",description:"A warm rustic vase for your home."},
  {id:3,name:"Minimal Plant Planter",category:"Planters",price:549,rating:4.7,size:"15 cm",material:"Natural ceramic",color:"Sand beige",stock:16,image:"https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=700&q=80",description:"A ceramic planter for your favourite plant."},
  {id:4,name:"Handmade Serving Bowl",category:"Bowls",price:649,rating:4.6,size:"18 cm",material:"Glazed ceramic",color:"Cream",stock:14,image:"https://images.unsplash.com/photo-1493106641515-6b5631de4bb9?auto=format&fit=crop&w=700&q=80",description:"A versatile handmade serving bowl."},
  {id:5,name:"Speckled Coffee Cup",category:"Mugs",price:449,rating:4.8,size:"300 ml",material:"Stoneware",color:"Cream",stock:18,image:"https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=700&q=80",description:"A charming cup for slow mornings."},
  {id:6,name:"Sculpted Flower Vase",category:"Vases",price:1199,rating:4.9,size:"28 cm",material:"Handcrafted clay",color:"Natural brown",stock:8,image:"https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=700&q=80",description:"A sculptural statement vase."},
  {id:7,name:"Round Table Planter",category:"Planters",price:499,rating:4.5,size:"13 cm",material:"Ceramic",color:"Warm white",stock:20,image:"https://images.unsplash.com/photo-1497250681960-ef046c08a56e?auto=format&fit=crop&w=700&q=80",description:"A compact planter for your desk."},
  {id:8,name:"Artisan Dinner Plate",category:"Dinnerware",price:599,rating:4.7,size:"25 cm",material:"Glazed stoneware",color:"Ivory",stock:15,image:"https://images.unsplash.com/photo-1603199506016-b9a594b593c0?auto=format&fit=crop&w=700&q=80",description:"A handmade plate for everyday meals."}
];

const KEY = {
  user:"clayoraUser", cart:"clayoraCart", wishlist:"clayoraWishlist",
  orders:"clayoraOrders", posts:"clayoraPosts", feedback:"clayoraFeedback"
};

function read(key, fallback) {
  try { return JSON.parse(localStorage.getItem(key)) ?? fallback; }
  catch { return fallback; }
}
function save(key, value) { localStorage.setItem(key, JSON.stringify(value)); }
function user() { return read(KEY.user, null); }
function cart() { return read(KEY.cart, []); }
function money(n) { return "₹" + Number(n || 0).toLocaleString("en-IN"); }
function product(id) { return products.find(p => p.id === Number(id)); }

function safe(s) {
  return String(s ?? "").replace(/[&<>"']/g, c =>
    ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[c]);
}

function notify(message) {
  const toast = $("toast");
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(window.clayoraTimer);
  window.clayoraTimer = setTimeout(() => toast.classList.remove("show"), 3500);
}

function updateCartCount() {
  const el = $("cartCount");
  if (el) el.textContent = cart().reduce((s, i) => s + Number(i.qty || 0), 0);
}

function card(p) {
  const wished = read(KEY.wishlist, []).includes(p.id);
  return `<article class="product-card">
    <button class="heart-btn" data-action="wish" data-id="${p.id}">${wished ? "♥" : "♡"}</button>
    <a class="product-image" href="product.html?id=${p.id}">
      <img src="${p.image}" alt="${safe(p.name)}" loading="lazy">
    </a>
    <div class="product-card-content">
      <p class="product-category">${safe(p.category)}</p>
      <a class="product-name" href="product.html?id=${p.id}">${safe(p.name)}</a>
      <p class="rating">★ ${p.rating} <span>Sample rating</span></p>
      <strong class="price">${money(p.price)}</strong>
      <a class="outline-btn full-width space-top" href="product.html?id=${p.id}">View details</a>
      <button class="primary-btn full-width space-top" data-action="add" data-id="${p.id}">Add to cart</button>
    </div>
  </article>`;
}

function renderProducts() {
  const grid = $("productGrid");
  if (!grid) return;

  const q = ($("searchInput")?.value || "").toLowerCase().trim();
  const cat = $("categorySelect")?.value || "All";
  const sort = $("sortSelect")?.value || "featured";

  let list = products.filter(p =>
    (cat === "All" || p.category === cat) &&
    (p.name + p.category + p.description).toLowerCase().includes(q)
  );

  if (sort === "low") list.sort((a,b) => a.price-b.price);
  if (sort === "high") list.sort((a,b) => b.price-a.price);
  if (sort === "rating") list.sort((a,b) => b.rating-a.rating);

  grid.innerHTML = list.length ? list.map(card).join("") :
    '<div class="empty-state">No products found.</div>';

  if ($("resultCount")) $("resultCount").textContent = list.length + " products found";
  renderSuggestions();
}

function renderSuggestions() {
  const box = $("suggestions"), input = $("searchInput");
  if (!box || !input) return;
  const q = input.value.trim().toLowerCase();
  const list = q ? products.filter(p => (p.name+" "+p.category).toLowerCase().includes(q)).slice(0,5) : [];
  box.innerHTML = list.map(p => `<a href="product.html?id=${p.id}">${safe(p.name)} — ${money(p.price)}</a>`).join("");
  box.classList.toggle("visible", list.length > 0);
}

function addToCart(id) {
  const p = product(id);
  if (!p) return;
  const items = cart();
  const found = items.find(i => i.id === p.id);
  if (found) {
    if (found.qty >= p.stock) return notify("Maximum available quantity reached.");
    found.qty++;
  } else items.push({id:p.id, qty:1});
  save(KEY.cart, items);
  updateCartCount();
  notify(p.name + " added to cart.");
}

function openModal(title, html) {
  if (!$("modalRoot")) return;
  $("modalRoot").innerHTML = `<div class="modal-backdrop" data-action="backdrop">
    <section class="modal-card" role="dialog" aria-modal="true">
      <button class="modal-close" data-action="close" type="button">×</button>
      <h2>${safe(title)}</h2>${html}
    </section></div>`;
}
function closeModal() { if ($("modalRoot")) $("modalRoot").innerHTML = ""; }

function showCart() {
  const items = cart();
  if (!items.length) return openModal("Your cart", '<p class="empty-state">Your cart is empty.</p><a class="primary-btn" href="index.html#shop">Shop products</a>');

  const subtotal = items.reduce((s,i) => s + (product(i.id)?.price || 0)*i.qty, 0);
  openModal("Your shopping cart", `
    ${items.map(i => {
      const p = product(i.id);
      if (!p) return "";
      return `<div class="cart-line">
        <img class="cart-thumb" src="${p.image}" alt="">
        <div class="cart-line-info"><strong>${safe(p.name)}</strong><p>${money(p.price)} each</p>
          <button data-action="qty" data-id="${p.id}" data-change="-1">−</button>
          ${i.qty}
          <button data-action="qty" data-id="${p.id}" data-change="1">+</button>
          <button data-action="remove" data-id="${p.id}">Remove</button>
        </div><strong>${money(p.price*i.qty)}</strong>
      </div>`;
    }).join("")}
    <label>Coupon code</label>
    <input id="couponInput" placeholder="Try CLAY10">
    <p class="small-note">CLAY10 gives 10% off this demo order.</p>
    <button class="outline-btn" data-action="coupon">Apply coupon</button>
    <p id="couponMessage"></p>
    <div class="grand-total"><span>Subtotal</span><strong>${money(subtotal)}</strong></div>
    <div class="grand-total"><span>Discount</span><strong id="discountValue">₹0</strong></div>
    <div class="grand-total"><span>Total</span><strong id="cartGrandTotal">${money(subtotal)}</strong></div>
    <button class="primary-btn full-width space-top" data-action="checkout">Proceed to checkout</button>`);
}

let couponApplied = false;

function showCheckout() {
  if (!cart().length) return notify("Your cart is empty.");
  const u = user() || {};
  openModal("Delivery details", `
    <form id="checkoutForm" class="checkout-form">
      <label>Full name</label>
      <input name="name" required minlength="3" maxlength="70" value="${safe(u.name || "")}">
      <label>Phone number</label>
      <input name="phone" type="tel" required pattern="[6-9][0-9]{9}" maxlength="10" value="${safe(u.phone || "")}">
      <label>Email</label>
      <input name="email" type="email" required value="${safe(u.email || "")}">
      <label>House / flat, street and area</label>
      <input name="address" required minlength="8" maxlength="150">
      <div class="two-columns">
        <div><label>City</label><input name="city" required minlength="2"></div>
        <div><label>State</label><input name="state" required minlength="2"></div>
      </div>
      <label>6-digit PIN code</label>
      <input name="pincode" required pattern="[1-9][0-9]{5}" maxlength="6">
      <label>Payment method</label>
      <select name="payment" required>
        <option value="">Select payment method</option>
        <option>Cash on delivery</option>
        <option>UPI demo</option>
        <option>Card demo</option>
        <option>Net banking demo</option>
      </select>
      <p class="small-note">Online payments are demo only. No real payment is taken.</p>
      <button class="primary-btn full-width space-top" type="submit">Place order</button>
    </form>`);
}

function placeOrder(form) {
  if (!form.reportValidity()) return;
  const d = new FormData(form);
  const items = cart().map(i => {
    const p = product(i.id);
    return p ? {id:p.id, name:p.name, price:p.price, qty:i.qty} : null;
  }).filter(Boolean);
  if (!items.length) return notify("Your cart is empty.");

  const subtotal = items.reduce((s,i) => s+i.price*i.qty, 0);
  const discount = couponApplied ? Math.round(subtotal*0.1) : 0;
  const order = {
    orderId:"CLY"+Date.now().toString().slice(-9),
    date:new Date().toLocaleString("en-IN"),
    status:"Order placed",
    items, subtotal, discount, total:subtotal-discount,
    payment:d.get("payment"),
    customer:{
      name:String(d.get("name")).trim(),
      phone:String(d.get("phone")).trim(),
      email:String(d.get("email")).trim(),
      address:String(d.get("address")).trim(),
      city:String(d.get("city")).trim(),
      state:String(d.get("state")).trim(),
      pincode:String(d.get("pincode")).trim()
    }
  };

  const orders = read(KEY.orders, []);
  orders.unshift(order);
  save(KEY.orders, orders);
  save(KEY.cart, []);
  couponApplied = false;
  updateCartCount();

  openModal("Order placed successfully!", `
    <div class="success-icon">✓</div>
    <p>Your demo order has been saved in Order History.</p>
    <div class="history-card">
      <p><strong>Order ID:</strong> ${safe(order.orderId)}</p>
      <p><strong>Total:</strong> ${money(order.total)}</p>
      <p><strong>Payment:</strong> ${safe(order.payment)}</p>
      <p><strong>Delivery:</strong> ${safe(order.customer.address)}, ${safe(order.customer.city)}, ${safe(order.customer.state)} - ${safe(order.customer.pincode)}</p>
    </div>
    <button class="primary-btn full-width" data-action="history">View Order History</button>
    <a class="outline-btn full-width space-top" href="index.html#shop">Continue shopping</a>`);
}

function showHistory() {
  const orders = read(KEY.orders, []);
  if (!orders.length) {
    return openModal("Order History", '<p class="empty-state">No orders yet. Place an order and it will appear here.</p>');
  }

  openModal("Order History", orders.map(o => `
    <article class="history-card">
      <div class="history-heading">
        <strong>Order ${safe(o.orderId)}</strong>
        <span class="order-status">${safe(o.status || "Order placed")}</span>
      </div>
      <p class="small-note">${safe(o.date)}</p>
      ${(o.items || []).map(i => `<div class="history-item">
        <span>${safe(i.name)} × ${Number(i.qty || 1)}</span>
        <strong>${money(Number(i.price)*Number(i.qty || 1))}</strong>
      </div>`).join("")}
      <div class="history-total"><span>Total</span><strong>${money(o.total)}</strong></div>
      <p><strong>Payment:</strong> ${safe(o.payment)}</p>
      ${o.customer ? `<details class="order-address"><summary>Delivery details</summary>
        <p>${safe(o.customer.name)}</p><p>${safe(o.customer.phone)}</p>
        <p>${safe(o.customer.email)}</p>
        <p>${safe(o.customer.address)}, ${safe(o.customer.city)}, ${safe(o.customer.state)} - ${safe(o.customer.pincode)}</p>
      </details>` : ""}
    </article>`).join(""));
}

function showProfile() {
  const u = user();
  if (!u) return notify("Please sign in first.");
  openModal("My Profile", `
    <div class="history-card">
      <p><strong>Name:</strong> ${safe(u.name || "Guest")}</p>
      <p><strong>Email:</strong> ${safe(u.email || "Not provided")}</p>
      <p><strong>Phone:</strong> ${safe(u.phone || "Not provided")}</p>
      <p><strong>Orders placed:</strong> ${read(KEY.orders, []).length}</p>
    </div>
    <button class="primary-btn full-width" data-action="history">View Order History</button>`);
}

function showWishlist() {
  const items = read(KEY.wishlist, []).map(product).filter(Boolean);
  openModal("My Wishlist", items.length ? `<div class="product-grid">${items.map(card).join("")}</div>` :
    '<p class="empty-state">Your wishlist is empty.</p>');
}

function renderDetail() {
  const box = $("productDetail");
  if (!box) return;
  const p = product(new URLSearchParams(location.search).get("id"));
  if (!p) {
    box.innerHTML = '<p class="empty-state">Product not found. <a href="index.html#shop">Browse products</a></p>';
    return;
  }
  const wished = read(KEY.wishlist, []).includes(p.id);
  box.innerHTML = `
    <section class="product-detail">
      <div class="detail-image"><img src="${p.image}" alt="${safe(p.name)}"></div>
      <div class="detail-info">
        <p class="eyebrow">HANDMADE CLAYORA COLLECTION</p>
        <p class="product-category">${safe(p.category)}</p>
        <h1>${safe(p.name)}</h1>
        <p class="rating">★ ${p.rating} <span>Sample rating</span></p>
        <div class="detail-price"><strong>${money(p.price)}</strong></div>
        <p>${safe(p.description)}</p>
        <div class="spec-grid">
          <div><span>Size</span><strong>${safe(p.size)}</strong></div>
          <div><span>Material</span><strong>${safe(p.material)}</strong></div>
          <div><span>Colour</span><strong>${safe(p.color)}</strong></div>
          <div><span>Stock</span><strong>${p.stock} available</strong></div>
          <div><span>Category</span><strong>${safe(p.category)}</strong></div>
          <div><span>Product ID</span><strong>CLY-${p.id}</strong></div>
        </div>
        <div class="detail-note"><strong>Delivery:</strong> Address and PIN code are checked at checkout.
          <br><strong>Care:</strong> Handle handmade pottery with care.
          <br><strong>Returns:</strong> Confirm return eligibility with the seller.</div>
        <div class="detail-buttons">
          <button class="primary-btn" data-action="add" data-id="${p.id}">Add to cart</button>
          <button class="outline-btn" data-action="buy" data-id="${p.id}">Buy now</button>
          <button class="outline-btn" data-action="wish" data-id="${p.id}">${wished ? "♥ Wishlisted" : "♡ Wishlist"}</button>
        </div>
      </div>
    </section>
    <section class="review-box"><h2>Product information</h2>
      <p>${safe(p.description)}</p>
      <p>Ratings are sample catalogue ratings, not verified customer reviews.</p>
    </section>`;

  const related = $("relatedGrid");
  if (related) related.innerHTML = products.filter(x => x.id !== p.id).slice(0,4).map(card).join("");
}

function renderPosts() {
  const box = $("communityPosts");
  if (!box) return;
  box.innerHTML = read(KEY.posts, []).map(p => `<article class="community-post">
    <strong>${safe(p.name)}</strong><p>${safe(p.text)}</p><small>${safe(p.date)}</small>
  </article>`).join("");
}

function enterStore(u) {
  save(KEY.user, u);
  if ($("loginScreen")) $("loginScreen").hidden = true;
  if ($("storeScreen")) $("storeScreen").hidden = false;
  renderProducts();
  notify("Welcome to Clayora, " + (u.name || "Guest") + "!");
}

function init() {
  $("loginForm")?.addEventListener("submit", e => {
    e.preventDefault();
    if (!e.currentTarget.reportValidity()) return;
    enterStore({
      name:$("loginName").value.trim(),
      email:$("loginEmail").value.trim(),
      phone:$("loginPhone").value.trim()
    });
  });

  $("guestBtn")?.addEventListener("click", () => enterStore({
    name:"Guest", email:"", phone:""
  }));

  $("logoutBtn")?.addEventListener("click", () => {
    localStorage.removeItem(KEY.user);
    if ($("storeScreen")) $("storeScreen").hidden = true;
    if ($("loginScreen")) $("loginScreen").hidden = false;
    notify("You have signed out.");
  });

  $("searchInput")?.addEventListener("input", renderProducts);
  $("searchBtn")?.addEventListener("click", renderProducts);
  $("sortSelect")?.addEventListener("change", renderProducts);
  $("categorySelect")?.addEventListener("change", renderProducts);

  document.querySelectorAll(".category-nav button").forEach(b => b.addEventListener("click", () => {
    if ($("categorySelect")) $("categorySelect").value = b.dataset.category;
    renderProducts();
    $("shop")?.scrollIntoView({behavior:"smooth"});
  }));

  $("profileNav")?.addEventListener("click", showProfile);
  $("historyNav")?.addEventListener("click", showHistory);
  $("cartNav")?.addEventListener("click", showCart);
  $("wishlistNav")?.addEventListener("click", showWishlist);

  $("postForm")?.addEventListener("submit", e => {
    e.preventDefault();
    const posts = read(KEY.posts, []);
    posts.unshift({name:user()?.name || "Guest", text:$("postText").value.trim(), date:new Date().toLocaleDateString("en-IN")});
    save(KEY.posts, posts.slice(0,30));
    $("postText").value = "";
    renderPosts();
    notify("Post shared.");
  });

  $("feedbackForm")?.addEventListener("submit", e => {
    e.preventDefault();
    const list = read(KEY.feedback, []);
    list.push({rating:$("feedbackRating").value, text:$("feedbackText").value.trim(), date:new Date().toLocaleDateString("en-IN")});
    save(KEY.feedback, list);
    e.currentTarget.reset();
    notify("Thank you for your feedback!");
  });

  document.addEventListener("click", e => {
    const b = e.target.closest("[data-action]");
    if (!b) return;
    const id = Number(b.dataset.id);

    switch (b.dataset.action) {
      case "add": addToCart(id); break;
      case "wish": {
        const ids = read(KEY.wishlist, []);
        save(KEY.wishlist, ids.includes(id) ? ids.filter(x => x !== id) : [...ids,id]);
        renderProducts(); renderDetail();
        if ($("modalRoot")?.innerHTML.includes("My Wishlist")) showWishlist();
        break;
      }
      case "close": closeModal(); break;
      case "backdrop": if (e.target === b) closeModal(); break;
      case "history": showHistory(); break;
      case "profile": showProfile(); break;
      case "checkout": showCheckout(); break;
      case "buy": addToCart(id); showCheckout(); break;
      case "remove":
        save(KEY.cart, cart().filter(i => i.id !== id));
        updateCartCount(); showCart(); break;
      case "qty": {
        const list = cart(), item = list.find(i => i.id === id), p = product(id);
        if (item && p) {
          item.qty = Math.max(0, Math.min(p.stock, item.qty + Number(b.dataset.change)));
          save(KEY.cart, list.filter(i => i.qty > 0));
          updateCartCount(); showCart();
        }
        break;
      }
      case "coupon": {
        const valid = $("couponInput")?.value.trim().toUpperCase() === "CLAY10";
        couponApplied = valid;
        if ($("couponMessage")) $("couponMessage").textContent = valid ? "10% discount applied." : "Invalid code. Try CLAY10.";
        if (valid) {
          const subtotal = cart().reduce((s,i) => s+(product(i.id)?.price || 0)*i.qty, 0);
          $("discountValue").textContent = money(Math.round(subtotal*0.1));
          $("cartGrandTotal").textContent = money(subtotal-Math.round(subtotal*0.1));
        }
        break;
      }
    }
  });

  document.addEventListener("submit", e => {
    if (e.target.id === "checkoutForm") {
      e.preventDefault();
      placeOrder(e.target);
    }
  });

  document.addEventListener("keydown", e => { if (e.key === "Escape") closeModal(); });

  updateCartCount();
  renderProducts();
  renderDetail();
  renderPosts();

  const u = user();
  if ($("loginScreen") && $("storeScreen")) {
    $("loginScreen").hidden = !!u;
    $("storeScreen").hidden = !u;
  }
}
init();
