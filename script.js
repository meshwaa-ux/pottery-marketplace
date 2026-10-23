
"use strict";

const $ = s => document.querySelector(s);
const safe = s => String(s ?? "").replace(/[&<>"']/g, c => ({
  "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"
}[c]));

const products = [
 {id:1,name:"Terracotta Coffee Mug",category:"Mugs",price:399,old:499,rating:4.8,size:"300 ml",height:"9 cm",material:"Terracotta clay",maker:"Asha Pottery Studio",image:"https://images.unsplash.com/photo-1577937927133-66ef06acdf18?auto=format&fit=crop&w=800&q=85",description:"A warm handmade mug for tea or coffee."},
 {id:2,name:"Earthy Ceramic Vase",category:"Vases",price:899,old:1099,rating:4.9,size:"Medium",height:"22 cm",material:"Ceramic",maker:"Mittika Studio",image:"https://images.unsplash.com/photo-1578500494198-246f612d3b3d?auto=format&fit=crop&w=800&q=85",description:"An earthy vase for shelves and flowers."},
 {id:3,name:"Mini Garden Planter",category:"Planters",price:349,old:449,rating:4.6,size:"Small",height:"11 cm",material:"Terracotta",maker:"Earth Nest",image:"https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=800&q=85",description:"A lovely planter for small plants."},
 {id:4,name:"Handmade Serving Bowl",category:"Bowls",price:599,old:749,rating:4.7,size:"16 cm diameter",height:"6 cm",material:"Glazed ceramic",maker:"Asha Pottery Studio",image:"https://images.unsplash.com/photo-1493106641515-6b5631de4bb9?auto=format&fit=crop&w=800&q=85",description:"A handmade bowl for your dining table."},
 {id:5,name:"Rustic Table Vase",category:"Vases",price:1299,old:1599,rating:4.8,size:"Large",height:"28 cm",material:"Handmade ceramic",maker:"Mittika Studio",image:"https://images.unsplash.com/photo-1612196808214-b7e1d6145a8c?auto=format&fit=crop&w=800&q=85",description:"A statement piece with a natural finish."},
 {id:6,name:"Decorative Clay Plate",category:"Decor",price:499,old:599,rating:4.5,size:"20 cm diameter",height:"2 cm",material:"Hand-shaped clay",maker:"Earth Nest",image:"https://images.unsplash.com/photo-1490312278390-ab64016e0aa9?auto=format&fit=crop&w=800&q=85",description:"A decorative plate for a shelf or table."},
 {id:7,name:"Speckled Tea Cup Set",category:"Mugs",price:799,old:999,rating:4.7,size:"Set of 2",height:"8 cm each",material:"Glazed ceramic",maker:"Asha Pottery Studio",image:"https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&w=800&q=85",description:"Two cosy tea cups for a peaceful break."},
 {id:8,name:"Rounded Desk Planter",category:"Planters",price:699,old:849,rating:4.6,size:"Medium",height:"14 cm",material:"Terracotta",maker:"Earth Nest",image:"https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=800&q=85",description:"A planter for desks and shelves."}
];

const getStore = (key, fallback) => {
  try { return JSON.parse(localStorage.getItem(key)) ?? fallback; }
  catch { return fallback; }
};

let cart = getStore("clayoraCart", []);
let wishlist = getStore("clayoraWishlist", []);
let orders = getStore("clayoraOrders", []);
let category = "All", search = "", coupon = false;
let toastTimer;

function money(n) {
  return "₹" + Number(n).toLocaleString("en-IN");
}

function notify(message) {
  const el = $("#toast");
  if (!el) return;
  el.textContent = message;
  el.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove("show"), 5000);
}

function save(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function saveCart() {
  save("clayoraCart", cart);
  updateCounts();
}

function currentUser() {
  return getStore("clayoraProfile", null);
}

function updateCounts() {
  if ($("#cartCount")) $("#cartCount").textContent =
    cart.reduce((n, item) => n + item.qty, 0);
  if ($("#wishCount")) $("#wishCount").textContent = wishlist.length;
}

function showModal(title, html) {
  if (!$("#modalRoot")) return;
  $("#modalRoot").innerHTML = `
    <div class="modal-backdrop" id="modalBackdrop">
      <section class="modal-card" role="dialog" aria-modal="true">
        <button class="modal-close" type="button" data-action="close">×</button>
        <h2>${title}</h2>${html}
      </section>
    </div>`;
}

function closeModal() {
  if ($("#modalRoot")) $("#modalRoot").innerHTML = "";
}

function productCard(p) {
  return `<article class="product-card">
    <button class="heart-btn ${wishlist.includes(p.id) ? "is-wished" : ""}"
      data-action="wish" data-id="${p.id}">${wishlist.includes(p.id) ? "♥" : "♡"}</button>
    <a class="product-image" href="product.html?id=${p.id}">
      <img src="${p.image}" alt="${safe(p.name)}" loading="lazy"
      onerror="this.onerror=null;this.src='https://placehold.co/600x600/F0E0D0/80503A?text=Clayora'">
    </a>
    <div class="product-card-content">
      <p class="product-category">${safe(p.category)}</p>
      <a class="product-name" href="product.html?id=${p.id}">${safe(p.name)}</a>
      <p class="rating">★ ${p.rating} <span>Sample rating</span></p>
      <div class="price-row"><strong>${money(p.price)}</strong><del>${money(p.old)}</del></div>
      <a class="primary-btn full-width" href="product.html?id=${p.id}">View details</a>
      <button class="outline-btn full-width" data-action="add" data-id="${p.id}">Add to cart</button>
    </div>
  </article>`;
}

function renderProducts() {
  const grid = $("#productGrid");
  if (!grid) return;

  let list = products.filter(p =>
    (category === "All" || p.category === category) &&
    (p.name + " " + p.category + " " + p.maker).toLowerCase().includes(search)
  );

  const max = $("#priceFilter")?.value || "all";
  if (max !== "all") list = list.filter(p => p.price < Number(max));

  const sort = $("#sortSelect")?.value;
  if (sort === "low") list.sort((a,b) => a.price-b.price);
  if (sort === "high") list.sort((a,b) => b.price-a.price);
  if (sort === "rating") list.sort((a,b) => b.rating-a.rating);

  grid.innerHTML = list.length ? list.map(productCard).join() :
    `<div class="empty-state"><h3>No products found</h3>
    <button class="outline-btn" data-action="reset">Show all products</button></div>`;
  if ($("#activeFilter")) $("#activeFilter").textContent = `${list.length} products found`;
}

function addToCart(id) {
  id = Number(id);
  if (!products.some(p => p.id === id)) return;
  const item = cart.find(x => x.id === id);
  if (item) item.qty++;
  else cart.push({id, qty:1});
  saveCart();
  notify("Product added to cart!");
}

function toggleWish(id) {
  id = Number(id);
  wishlist = wishlist.includes(id) ? wishlist.filter(x => x !== id) : [...wishlist,id];
  save("clayoraWishlist", wishlist);
  renderProducts();
  renderDetail();
  notify("Wishlist updated.");
}

function subtotal() {
  return cart.reduce((sum, item) => {
    const p = products.find(x => x.id === item.id);
    return sum + (p ? p.price * item.qty : 0);
  }, 0);
}

function total() {
  return subtotal() - (coupon && subtotal() >= 500 ? Math.round(subtotal() * .1) : 0);
}

function showCart() {
  const rows = cart.map(item => {
    const p = products.find(x => x.id === item.id);
    if (!p) return "";
    return `<div class="cart-line">
      <img class="cart-thumb" src="${p.image}" alt="${safe(p.name)}">
      <div class="cart-line-info"><strong>${safe(p.name)}</strong><p>${money(p.price)} each</p>
        <div class="qty-control">
          <button data-action="qty" data-id="${p.id}" data-change="-1">−</button>
          <span>${item.qty}</span>
          <button data-action="qty" data-id="${p.id}" data-change="1">+</button>
          <button data-action="remove" data-id="${p.id}">Remove</button>
        </div>
      </div>
      <strong>${money(p.price * item.qty)}</strong>
    </div>`;
  }).join();

  showModal("Your shopping cart", `
    ${rows || "<p>Your cart is empty.</p>"}
    <form id="couponForm" class="coupon-form">
      <input id="couponInput" placeholder="Coupon code">
      <button class="outline-btn" type="submit">Apply</button>
    </form>
    <p>Subtotal: <strong>${money(subtotal())}</strong></p>
    <p>Discount: <strong>−${money(subtotal()-total())}</strong></p>
    <p class="grand-total">Total <strong>${money(total())}</strong></p>
    <button class="primary-btn full-width" data-action="checkout" ${cart.length ? "" : "disabled"}>Proceed to checkout</button>`);
}

function showWishlist() {
  const items = products.filter(p => wishlist.includes(p.id));
  showModal("Your wishlist", items.length ? items.map(p => `
    <div class="cart-line"><img class="cart-thumb" src="${p.image}" alt="${safe(p.name)}">
    <div class="cart-line-info"><strong>${safe(p.name)}</strong><p>${money(p.price)}</p>
    <a class="nav-link" href="product.html?id=${p.id}">View details</a>
    <button class="outline-btn" data-action="add" data-id="${p.id}">Add to cart</button>
    <button class="text-btn" data-action="wish" data-id="${p.id}">Remove</button></div></div>`).join("") :
    "<p>Your wishlist is empty.</p>");
}

/* PROFILE */
function showProfile() {
  const p = currentUser();
  if (!p) {
    showModal("Profile", `<p>Please sign in first to view your profile.</p>`);
    return;
  }

  showModal("My Profile", `
    <p class="small-note">Update your customer details below.</p>
    <form id="profileForm" class="checkout-form">
      <label for="profileName">Full name *</label>
      <input id="profileName" required minlength="2" maxlength="60" value="${safe(p.name)}">
      <label for="profileEmail">Email address *</label>
      <input id="profileEmail" type="email" required value="${safe(p.email)}">
      <label for="profilePhone">Phone number *</label>
      <input id="profilePhone" type="tel" required pattern="(?:\\+91[\\s-]?)?[6-9][0-9]{9}" value="${safe(p.phone || "")}">
      <button class="primary-btn full-width" type="submit">Save profile</button>
    </form>
    <button class="outline-btn full-width space-top" data-action="history">View order history</button>`);
}

/* ORDER HISTORY */
function showHistory() {
  const user = currentUser();
  if (!user) {
    showModal("Order History", "<p>Please sign in to view your orders.</p>");
    return;
  }

  const mine = orders.filter(o => o.email.toLowerCase() === user.email.toLowerCase());

  showModal("My Order History", mine.length ? `
    <p class="small-note">Your demo orders saved in this browser.</p>
    ${mine.map(o => `
      <article class="history-card">
        <div class="history-heading">
          <strong>Order #${safe(o.id)}</strong>
          <span class="order-status">${safe(o.status)}</span>
        </div>
        <p class="small-note">${safe(o.date)}</p>
        ${o.items.map(item => `
          <div class="history-item">
            <span>${safe(item.name)} × ${item.qty}</span>
            <strong>${money(item.price * item.qty)}</strong>
          </div>`).join("")}
        <div class="history-total">
          <span>Payment: ${safe(o.payment)}</span>
          <strong>Total: ${money(o.total)}</strong>
        </div>
        <details class="order-address">
          <summary>Delivery details</summary>
          <p>${safe(o.name)}</p>
          <p>${safe(o.address)}, ${safe(o.city)}, ${safe(o.state)} - ${safe(o.pin)}</p>
          <p>${safe(o.phone)} · ${safe(o.email)}</p>
        </details>
      </article>`).join("")}` :
    `<div class="empty-state"><h3>No orders yet</h3>
      <p>Your completed demo orders will appear here.</p>
      <button class="primary-btn" data-action="close">Continue shopping</button>
    </div>`);
}

function showCheckout() {
  if (!cart.length) return notify("Your cart is empty.");
  const p = currentUser() || {};

  showModal("Delivery and checkout", `
    <p class="small-note">All required fields must be valid. This is a demo checkout.</p>
    <form id="checkoutForm" class="checkout-form">
      <label for="buyerName">Full name *</label>
      <input id="buyerName" required minlength="2" maxlength="60" pattern="[A-Za-z][A-Za-z .'-]{1,59}" value="${safe(p.name || "")}" autocomplete="name">

      <label for="buyerEmail">Email address *</label>
      <input id="buyerEmail" type="email" required value="${safe(p.email || "")}" autocomplete="email">

      <label for="buyerPhone">Mobile number *</label>
      <input id="buyerPhone" type="tel" required pattern="(?:\\+91[\\s-]?)?[6-9][0-9]{9}" value="${safe(p.phone || "")}" autocomplete="tel">

      <label for="buyerAddress">House number, street and area *</label>
      <textarea id="buyerAddress" required minlength="10" maxlength="200" placeholder="Complete delivery address"></textarea>

      <div class="two-columns">
        <div><label for="buyerCity">City *</label>
          <input id="buyerCity" required minlength="2" pattern="[A-Za-z][A-Za-z .'-]{1,59}" autocomplete="address-level2"></div>
        <div><label for="buyerState">State *</label>
          <input id="buyerState" required minlength="2" pattern="[A-Za-z][A-Za-z .'-]{1,59}" autocomplete="address-level1"></div>
      </div>

      <label for="buyerPin">PIN code *</label>
      <input id="buyerPin" required inputmode="numeric" pattern="[1-9][0-9]{5}" maxlength="6" autocomplete="postal-code">

      <label for="paymentMethod">Payment method *</label>
      <select id="paymentMethod" required>
        <option value="">Choose payment method</option>
        <option>Cash on Delivery (Demo)</option>
        <option>UPI (Demo)</option>
        <option>Debit/Credit Card (Demo)</option>
        <option>Net Banking (Demo)</option>
        <option>Wallet (Demo)</option>
      </select>

      <p class="grand-total">Order total <strong>${money(total())}</strong></p>
      <button class="primary-btn full-width" type="submit">Place demo order</button>
    </form>`);
}

function placeOrder(form) {
  if (!form.reportValidity()) return;

  const name = $("#buyerName").value.trim();
  const email = $("#buyerEmail").value.trim();
  const phone = $("#buyerPhone").value.replace(/[\s-]/g,"");
  const address = $("#buyerAddress").value.trim();
  const city = $("#buyerCity").value.trim();
  const state = $("#buyerState").value.trim();
  const pin = $("#buyerPin").value.trim();
  const payment = $("#paymentMethod").value;

  if (!/^[A-Za-z][A-Za-z .'-]{1,59}$/.test(name) ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
      !/^(?:\+91)?[6-9][0-9]{9}$/.test(phone) ||
      address.length < 10 ||
      !/^[A-Za-z][A-Za-z .'-]{1,59}$/.test(city) ||
      !/^[A-Za-z][A-Za-z .'-]{1,59}$/.test(state) ||
      !/^[1-9][0-9]{5}$/.test(pin) || !payment) {
    notify("Please enter valid details in every required field.");
    return;
  }

  const order = {
    id:"CLY" + Date.now().toString().slice(-8),
    date:new Date().toLocaleString("en-IN"),
    name,email,phone,address,city,state,pin,payment,
    total:total(),
    status:"Demo order placed",
    items:cart.map(item => {
      const p = products.find(x => x.id === item.id);
      return {id:item.id,name:p.name,price:p.price,qty:item.qty};
    })
  };

  orders = getStore("clayoraOrders", []);
  orders.unshift(order);
  save("clayoraOrders", orders);

  /* Save profile information for the next visit. */
  save("clayoraProfile", {name,email,phone});
  cart = [];
  coupon = false;
  saveCart();
  closeModal();

  showModal("🎉 Order placed successfully!", `
    <div class="success-icon">✓</div>
    <p>Thank you, <strong>${safe(name)}</strong>!</p>
    <p>Your order number is <strong>${safe(order.id)}</strong>.</p>
    <p>Order total: <strong>${money(order.total)}</strong></p>
    <p>Payment: ${safe(payment)}</p>
    <p class="small-note">This is a demo order. No real payment or delivery has been created.</p>
    <button class="primary-btn full-width" data-action="history">View order history</button>
    <button class="outline-btn full-width space-top" data-action="close">Continue shopping</button>`);
}

function renderDetail() {
  const area = $("#productDetail");
  if (!area) return;
  const id = Number(new URLSearchParams(location.search).get("id"));
  const p = products.find(x => x.id === id);

  if (!p) {
    area.innerHTML = `<div class="empty-state"><h2>Product not found</h2><a href="index.html" class="primary-btn">Back to shop</a></div>`;
    return;
  }

  area.innerHTML = `
    <div class="product-detail">
      <div class="detail-image"><img src="${p.image}" alt="${safe(p.name)}"></div>
      <div class="detail-info">
        <p class="product-category">${safe(p.category)} · Handmade collection</p>
        <h1>${safe(p.name)}</h1>
        <p class="rating">★ ${p.rating} <span>Sample rating</span></p>
        <div class="detail-price"><strong>${money(p.price)}</strong><del>${money(p.old)}</del></div>
        <p>${safe(p.description)}</p>
        <div class="spec-grid">
          <div><span>Size</span><strong>${safe(p.size)}</strong></div>
          <div><span>Height</span><strong>${safe(p.height)}</strong></div>
          <div><span>Material</span><strong>${safe(p.material)}</strong></div>
          <div><span>Maker</span><strong>${safe(p.maker)}</strong></div>
        </div>
        <div class="detail-note">
          <p><strong>Delivery:</strong> Confirm delivery availability with the seller.</p>
          <p><strong>Returns:</strong> Check the seller's return policy.</p>
          <p><strong>Cancellation:</strong> Demo store; no real order is created.</p>
        </div>
        <div class="detail-buttons">
          <button class="primary-btn" data-action="add" data-id="${p.id}">Add to cart</button>
          <button class="outline-btn" data-action="wish" data-id="${p.id}">${wishlist.includes(p.id) ? "♥ Saved" : "♡ Wishlist"}</button>
          <button class="outline-btn" data-action="cart">View cart</button>
        </div>
        <section class="review-box">
          <h3>Customer reviews</h3>
          <p>Sample product rating. Reviews are not verified.</p>
          <form id="reviewForm" class="review-form">
            <label for="reviewRating">Your rating</label>
            <select id="reviewRating" required>
              <option value="">Choose rating</option>
              <option value="5">★★★★★ 5</option><option value="4">★★★★ 4</option>
              <option value="3">★★★ 3</option><option value="2">★★ 2</option><option value="1">★ 1</option>
            </select>
            <label for="reviewText">Your review</label>
            <textarea id="reviewText" required minlength="5" maxlength="300"></textarea>
            <button class="outline-btn" type="submit">Submit demo review</button>
          </form>
          <div id="submittedReviews"></div>
        </section>
      </div>
    </div>`;

  const related = $("#relatedGrid");
  if (related) {
    related.innerHTML = products.filter(x => x.id !== p.id && x.category === p.category)
      .concat(products.filter(x => x.id !== p.id && x.category !== p.category))
      .slice(0,3).map(productCard).join("");
  }
}

function renderPosts() {
  const box = $("#communityPosts");
  if (!box) return;
  box.innerHTML = getStore("clayoraPosts", []).map(p =>
    `<article class="community-post"><p>${safe(p.text)}</p><span class="small-note">${safe(p.date)}</span></article>`
  ).join("");
}

function enterShop(profile) {
  if (profile) save("clayoraProfile", profile);
  if ($("#loginPage")) $("#loginPage").hidden = true;
  if ($("#shopPage")) $("#shopPage").hidden = false;
  renderProducts();
  renderPosts();
  updateCounts();
  notify("Welcome to Clayora!");
}

/* Login */
if ($("#loginForm")) {
  $("#getOtp").addEventListener("click", () => {
    $("#otp").value = "123456";
    notify("Demo OTP: 123456. No SMS was sent.");
  });

  $("#loginForm").addEventListener("submit", e => {
    e.preventDefault();
    if (!e.currentTarget.reportValidity()) return;
    if ($("#otp").value !== "123456") return notify("Enter the correct demo OTP: click Get OTP.");
    enterShop({
      name:$("#fullName").value.trim(),
      email:$("#email").value.trim(),
      phone:$("#phone").value.trim()
    });
  });

  $("#guestLogin").addEventListener("click", () => {
    const saved = currentUser();
    enterShop(saved || {name:"Guest",email:"guest@example.com",phone:""});
  });

  const existingUser = currentUser();
  if (existingUser) {
    $("#loginPage").hidden = true;
    $("#shopPage").hidden = false;
  }

  $("#logoutBtn").addEventListener("click", () => {
    sessionStorage.clear();
    if ($("#shopPage")) $("#shopPage").hidden = true;
    if ($("#loginPage")) $("#loginPage").hidden = false;
    $("#loginForm").reset();
    notify("You have signed out.");
  });
}

/* All clicks, including dynamically created modal buttons. */
document.addEventListener("click", e => {
  if (e.target.id === "modalBackdrop") return closeModal();

  const b = e.target.closest("[data-action]");
  if (b) {
    const id = Number(b.dataset.id);
    switch (b.dataset.action) {
      case "close": closeModal(); break;
      case "add": addToCart(id); break;
      case "wish": toggleWish(id); break;
      case "cart": showCart(); break;
      case "checkout": showCheckout(); break;
      case "history": showHistory(); break;
      case "qty": {
        const item = cart.find(x => x.id === id);
        if (item) {
          item.qty += Number(b.dataset.change);
          if (item.qty <= 0) cart = cart.filter(x => x.id !== id);
          saveCart();
          showCart();
        }
        break;
      }
      case "remove":
        cart = cart.filter(x => x.id !== id);
        saveCart();
        showCart();
        break;
      case "reset":
        category = "All"; search = "";
        if ($("#searchInput")) $("#searchInput").value = "";
        renderProducts();
        break;
    }
  }

  const cat = e.target.closest("[data-category]");
  if (cat) {
    category = cat.dataset.category;
    renderProducts();
    $("#products")?.scrollIntoView({behavior:"smooth"});
  }
});

document.addEventListener("submit", e => {
  if (e.target.id === "searchForm") {
    e.preventDefault();
    search = $("#searchInput").value.trim().toLowerCase();
    renderProducts();
    $("#products")?.scrollIntoView({behavior:"smooth"});
  }

  if (e.target.id === "couponForm") {
    e.preventDefault();
    coupon = $("#couponInput").value.trim().toUpperCase() === "CLAY10" && subtotal() >= 500;
    notify(coupon ? "Coupon applied!" : "CLAY10 works on orders above ₹500.");
    showCart();
  }

  if (e.target.id === "checkoutForm") {
    e.preventDefault();
    placeOrder(e.target);
  }

  if (e.target.id === "profileForm") {
    e.preventDefault();
    if (!e.target.reportValidity()) return;
    const profile = {
      name:$("#profileName").value.trim(),
      email:$("#profileEmail").value.trim(),
      phone:$("#profilePhone").value.trim()
    };
    save("clayoraProfile", profile);
    closeModal();
    notify("Profile updated successfully!");
  }

  if (e.target.id === "postForm") {
    e.preventDefault();
    const text = $("#postText").value.trim();
    if (text.length < 5) return notify("Please write a little more.");
    const posts = getStore("clayoraPosts", []);
    posts.unshift({text,date:new Date().toLocaleDateString("en-IN")});
    save("clayoraPosts", posts.slice(0,20));
    e.target.reset();
    renderPosts();
    notify("Your demo post has been shared!");
  }

  if (e.target.id === "feedbackForm") {
    e.preventDefault();
    notify("Thank you for your feedback!");
    e.target.reset();
  }

  if (e.target.id === "reviewForm") {
    e.preventDefault();
    const review = document.createElement("p");
    review.className = "submitted-review";
    review.textContent = "★".repeat(Number($("#reviewRating").value)) + " — " + $("#reviewText").value.trim();
    $("#submittedReviews").prepend(review);
    e.target.reset();
    notify("Demo review added.");
  }
});

document.addEventListener("input", e => {
  if (e.target.id !== "searchInput") return;
  search = e.target.value.trim().toLowerCase();
  const suggestions = $("#suggestions");
  if (suggestions) {
    const matches = products.filter(p => (p.name+" "+p.category).toLowerCase().includes(search)).slice(0,5);
    suggestions.innerHTML = search ? matches.map(p => `<a href="product.html?id=${p.id}">${safe(p.name)}</a>`).join("") : "";
    suggestions.classList.toggle("visible", Boolean(search && matches.length));
  }
  renderProducts();
});

$("#profileNav")?.addEventListener("click", showProfile);
$("#historyNav")?.addEventListener("click", showHistory);
$("#cartNav")?.addEventListener("click", showCart);
$("#wishlistNav")?.addEventListener("click", showWishlist);
$("#sortSelect")?.addEventListener("change", renderProducts);
$("#priceFilter")?.addEventListener("change", renderProducts);

$("#artisanPostBtn")?.addEventListener("click", () => showModal("Stories shaped in clay",
  "<p>Clayora celebrates the creativity and skill behind handmade pottery.</p>"));

renderProducts();
renderDetail();
renderPosts();
updateCounts();
