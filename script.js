
const $ = (id) => document.getElementById(id);

const products = [
  {id:1,name:"Earthy Ceramic Mug",category:"Mugs",price:399,rating:4.8,stock:20,size:"350 ml",material:"Stoneware ceramic",color:"Terracotta",image:"https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&w=700&q=80",description:"A handmade mug for your everyday tea and coffee."},
  {id:2,name:"Rustic Clay Vase",category:"Vases",price:899,rating:4.9,stock:12,size:"24 cm",material:"Hand-shaped clay",color:"Rust brown",image:"https://images.unsplash.com/photo-1578500494198-246f612d3b3d?auto=format&fit=crop&w=700&q=80",description:"A warm rustic vase for flowers or shelf styling."},
  {id:3,name:"Minimal Plant Planter",category:"Planters",price:549,rating:4.7,stock:16,size:"15 cm",material:"Natural ceramic",color:"Sand beige",image:"https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=700&q=80",description:"A simple ceramic planter for your favourite plant."},
  {id:4,name:"Handmade Serving Bowl",category:"Bowls",price:649,rating:4.6,stock:14,size:"18 cm",material:"Glazed ceramic",color:"Cream",image:"https://images.unsplash.com/photo-1493106641515-6b5631de4bb9?auto=format&fit=crop&w=700&q=80",description:"A versatile handmade bowl for serving and display."},
  {id:5,name:"Speckled Coffee Cup",category:"Mugs",price:449,rating:4.8,stock:18,size:"300 ml",material:"Stoneware",color:"Speckled cream",image:"https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=700&q=80",description:"A charming speckled cup for slow mornings."},
  {id:6,name:"Sculpted Flower Vase",category:"Vases",price:1199,rating:4.9,stock:8,size:"28 cm",material:"Handcrafted clay",color:"Natural brown",image:"https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=700&q=80",description:"A sculptural statement vase for your home."},
  {id:7,name:"Round Table Planter",category:"Planters",price:499,rating:4.5,stock:20,size:"13 cm",material:"Ceramic",color:"Warm white",image:"https://images.unsplash.com/photo-1497250681960-ef046c08a56e?auto=format&fit=crop&w=700&q=80",description:"A compact planter for a desk or windowsill."},
  {id:8,name:"Artisan Dinner Plate",category:"Dinnerware",price:599,rating:4.7,stock:15,size:"25 cm",material:"Glazed stoneware",color:"Ivory",image:"https://images.unsplash.com/photo-1603199506016-b9a594b593c0?auto=format&fit=crop&w=700&q=80",description:"A handmade plate for everyday meals."}
];

const STORAGE = {
  user:"clayoraUser",
  cart:"clayoraCart",
  wishlist:"clayoraWishlist",
  orders:"clayoraOrders",
  posts:"clayoraPosts",
  feedback:"clayoraFeedback"
};

function readStore(key, fallback) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

function saveStore(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function currentUser() {
  return readStore(STORAGE.user, null);
}

function cartItems() {
  return readStore(STORAGE.cart, []);
}

function money(amount) {
  return "₹" + Number(amount).toLocaleString("en-IN");
}

function escapeHTML(value) {
  return String(value ?? "").replace(/[&<>"']/g, char => ({
    "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"
  })[char]);
}

function notify(message) {
  const toast = $("toast");
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(window.clayoraToastTimer);
  window.clayoraToastTimer = setTimeout(() => toast.classList.remove("show"), 3500);
}

function getProduct(id) {
  return products.find(p => p.id === Number(id));
}

function productCard(p) {
  const wished = readStore(STORAGE.wishlist, []).includes(p.id);
  return `
    <article class="product-card">
      <button class="heart-btn ${wished ? "is-wished" : ""}" data-action="wish"
        data-id="${p.id}" aria-label="Add ${escapeHTML(p.name)} to wishlist">
        ${wished ? "♥" : "♡"}
      </button>
      <a class="product-image" href="product.html?id=${p.id}" aria-label="View ${escapeHTML(p.name)}">
        <img src="${p.image}" alt="${escapeHTML(p.name)}" loading="lazy">
      </a>
      <div class="product-card-content">
        <p class="product-category">${escapeHTML(p.category)}</p>
        <a class="product-name" href="product.html?id=${p.id}">${escapeHTML(p.name)}</a>
        <div class="rating">★ ${p.rating} <span>(${p.stock} available)</span></div>
        <div class="price-row"><strong>${money(p.price)}</strong></div>
        <a class="outline-btn full-width" href="product.html?id=${p.id}">View details</a>
        <button class="primary-btn full-width space-top" data-action="add" data-id="${p.id}">
          Add to cart
        </button>
      </div>
    </article>`;
}

function renderProducts() {
  const grid = $("productGrid");
  if (!grid) return;

  const query = ($("searchInput")?.value || "").trim().toLowerCase();
  const category = $("categorySelect")?.value || "All";
  const sort = $("sortSelect")?.value || "featured";

  let filtered = products.filter(p =>
    (category === "All" || p.category === category) &&
    (p.name + " " + p.category + " " + p.description).toLowerCase().includes(query)
  );

  if (sort === "low") filtered.sort((a,b) => a.price-b.price);
  if (sort === "high") filtered.sort((a,b) => b.price-a.price);
  if (sort === "rating") filtered.sort((a,b) => b.rating-a.rating);

  grid.innerHTML = filtered.length
    ? filtered.map(productCard).join("")
    : '<div class="empty-state">No products found. Try another search.</div>';

  if ($("resultCount")) $("resultCount").textContent = `${filtered.length} products found`;
  renderSuggestions();
}

function renderSuggestions() {
  const box = $("suggestions");
  const input = $("searchInput");
  if (!box || !input) return;

  const query = input.value.trim().toLowerCase();
  if (!query) {
    box.innerHTML = "";
    box.classList.remove("visible");
    return;
  }

  const matches = products.filter(p =>
    (p.name + " " + p.category).toLowerCase().includes(query)
  ).slice(0,5);

  box.innerHTML = matches.map(p =>
    `<a href="product.html?id=${p.id}">${escapeHTML(p.name)} — ${money(p.price)}</a>`
  ).join("");

  box.classList.toggle("visible", matches.length > 0);
}

function updateCartCount() {
  const count = $("cartCount");
  if (count) count.textContent = cartItems().reduce((sum,item) => sum + item.qty, 0);
}

function addToCart(id) {
  const p = getProduct(id);
  if (!p) return;

  const cart = cartItems();
  const existing = cart.find(item => item.id === p.id);
  if (existing) {
    if (existing.qty >= p.stock) return notify("Maximum available quantity reached.");
    existing.qty++;
  } else {
    cart.push({id:p.id,qty:1});
  }

  saveStore(STORAGE.cart, cart);
  updateCartCount();
  notify(`${p.name} added to cart.`);
}

function toggleWishlist(id) {
  const list = readStore(STORAGE.wishlist, []);
  const index = list.indexOf(Number(id));

  if (index >= 0) {
    list.splice(index,1);
    notify("Removed from wishlist.");
  } else {
    list.push(Number(id));
    notify("Added to wishlist.");
  }

  saveStore(STORAGE.wishlist, list);
  renderProducts();
  renderProductDetail();
}

function openModal(title, content) {
  const root = $("modalRoot");
  if (!root) return;

  root.innerHTML = `
    <div class="modal-backdrop" data-action="backdrop">
      <section class="modal-card" role="dialog" aria-modal="true" aria-label="${escapeHTML(title)}">
        <button type="button" class="modal-close" data-action="close" aria-label="Close">×</button>
        <h2>${escapeHTML(title)}</h2>
        <div>${content}</div>
      </section>
    </div>`;
}

function closeModal() {
  if ($("modalRoot")) $("modalRoot").innerHTML = "";
}

function showCart() {
  const cart = cartItems();
  if (!cart.length) {
    openModal("Your cart", '<div class="empty-state">Your cart is empty. Explore our handmade collection.</div><a class="primary-btn full-width" href="index.html#shop">Shop products</a>');
    return;
  }

  const subtotal = cart.reduce((sum,item) => {
    const p = getProduct(item.id);
    return sum + (p ? p.price * item.qty : 0);
  }, 0);

  const lines = cart.map(item => {
    const p = getProduct(item.id);
    if (!p) return "";
    return `
      <div class="cart-line">
        <img class="cart-thumb" src="${p.image}" alt="">
        <div class="cart-line-info">
          <strong>${escapeHTML(p.name)}</strong>
          <p>${money(p.price)} each</p>
          <div class="qty-control">
            <button data-action="qty" data-id="${p.id}" data-change="-1">−</button>
            <span>${item.qty}</span>
            <button data-action="qty" data-id="${p.id}" data-change="1">+</button>
            <button class="text-btn" data-action="remove" data-id="${p.id}">Remove</button>
          </div>
        </div>
        <strong>${money(p.price*item.qty)}</strong>
      </div>`;
  }).join("");

  openModal("Your shopping cart", `
    ${lines}
    <div class="coupon-form">
      <input id="couponInput" placeholder="Coupon code (try CLAY10)">
      <button class="outline-btn" type="button" data-action="coupon">Apply</button>
    </div>
    <p id="couponMessage" class="small-note"></p>
    <div class="grand-total"><span>Subtotal</span><strong>${money(subtotal)}</strong></div>
    <div class="grand-total"><span>Discount</span><strong id="discountValue">₹0</strong></div>
    <div class="grand-total"><span>Total</span><strong id="cartGrandTotal">${money(subtotal)}</strong></div>
    <button class="primary-btn full-width space-top" data-action="checkout">Proceed to checkout</button>
  `);
}

let couponApplied = false;

function showCheckout() {
  const cart = cartItems();
  if (!cart.length) return notify("Your cart is empty.");

  const user = currentUser() || {};
  openModal("Delivery details", `
    <p class="small-note">Enter your real delivery details. Incomplete or invalid details will not be accepted.</p>
    <form id="checkoutForm" class="checkout-form">
      <label for="checkoutName">Full name</label>
      <input id="checkoutName" name="name" required minlength="3" maxlength="70"
        pattern="[A-Za-z][A-Za-z .'-]{2,69}" autocomplete="name"
        value="${escapeHTML(user.name || "")}" placeholder="Your full name">

      <label for="checkoutPhone">10-digit mobile number</label>
      <input id="checkoutPhone" name="phone" type="tel" required
        inputmode="numeric" pattern="[6-9][0-9]{9}" maxlength="10"
        autocomplete="tel" value="${escapeHTML(user.phone || "")}" placeholder="9876543210">

      <label for="checkoutEmail">Email</label>
      <input id="checkoutEmail" name="email" type="email" required maxlength="100"
        autocomplete="email" value="${escapeHTML(user.email || "")}" placeholder="you@example.com">

      <label for="checkoutAddress">House / flat, street and area</label>
      <input id="checkoutAddress" name="address" required minlength="8" maxlength="150"
        autocomplete="street-address" placeholder="House number, street, area">

      <div class="two-columns">
        <div>
          <label for="checkoutCity">City</label>
          <input id="checkoutCity" name="city" required minlength="2" maxlength="50"
            pattern="[A-Za-z][A-Za-z .'-]{1,49}" autocomplete="address-level2">
        </div>
        <div>
          <label for="checkoutState">State</label>
          <input id="checkoutState" name="state" required minlength="2" maxlength="50"
            pattern="[A-Za-z][A-Za-z .'-]{1,49}" autocomplete="address-level1">
        </div>
      </div>

      <label for="checkoutPincode">6-digit PIN code</label>
      <input id="checkoutPincode" name="pincode" required inputmode="numeric"
        pattern="[1-9][0-9]{5}" maxlength="6" autocomplete="postal-code">

      <label for="paymentMethod">Payment method</label>
      <select id="paymentMethod" name="payment" required>
        <option value="">Select payment method</option>
        <option value="COD">Cash on delivery</option>
        <option value="UPI demo">UPI (demo only)</option>
        <option value="Card demo">Card (demo only)</option>
        <option value="Net banking demo">Net banking (demo only)</option>
      </select>

      <p class="small-note">Online payment options are demonstrations only. No real payment will be collected.</p>
      <button class="primary-btn full-width space-top" type="submit">Place order</button>
    </form>
  `);
}

function placeOrder(form) {
  if (!form.reportValidity()) return;

  const data = new FormData(form);
  const cart = cartItems();
  if (!cart.length) return notify("Your cart is empty.");

  const items = cart.map(item => {
    const p = getProduct(item.id);
    return p ? {id:p.id,name:p.name,price:p.price,qty:item.qty} : null;
  }).filter(Boolean);

  if (!items.length) return notify("No valid products in cart.");

  const subtotal = items.reduce((sum,item) => sum + item.price*item.qty, 0);
  const discount = couponApplied ? Math.round(subtotal * 0.1) : 0;

  const order = {
    orderId:"CLY" + Date.now().toString().slice(-9),
    date:new Date().toLocaleString("en-IN"),
    status:"Order placed",
    items,
    subtotal,
    discount,
    total:subtotal-discount,
    payment:data.get("payment"),
    customer:{
      name:data.get("name").trim(),
      phone:data.get("phone").trim(),
      email:data.get("email").trim(),
      address:data.get("address").trim(),
      city:data.get("city").trim(),
      state:data.get("state").trim(),
      pincode:data.get("pincode").trim()
    }
  };

  const orders = readStore(STORAGE.orders, []);
  orders.unshift(order);
  saveStore(STORAGE.orders, orders);
  saveStore(STORAGE.cart, []);
  couponApplied = false;
  updateCartCount();

  openModal("Order placed successfully!", `
    <div class="success-icon">✓</div>
    <p>Your demo order has been recorded.</p>
    <div class="history-card">
      <p><strong>Order ID:</strong> ${escapeHTML(order.orderId)}</p>
      <p><strong>Total:</strong> ${money(order.total)}</p>
      <p><strong>Payment:</strong> ${escapeHTML(order.payment)}</p>
      <p><strong>Delivery to:</strong> ${escapeHTML(order.customer.name)}, ${escapeHTML(order.customer.address)}, ${escapeHTML(order.customer.city)}, ${escapeHTML(order.customer.state)} - ${escapeHTML(order.customer.pincode)}</p>
    </div>
    <button class="primary-btn full-width" data-action="history">View order history</button>
    <a class="outline-btn full-width space-top" href="index.html#shop">Continue shopping</a>
  `);
}

function showProfile() {
  const user = currentUser();
  if (!user) return notify("Please sign in first.");

  const orders = readStore(STORAGE.orders, []);
  openModal("My profile", `
    <div class="profile-info">
      <p><strong>Name:</strong> ${escapeHTML(user.name)}</p>
      <p><strong>Email:</strong> ${escapeHTML(user.email)}</p>
      <p><strong>Phone:</strong> ${escapeHTML(user.phone)}</p>
      <p><strong>Orders placed:</strong> ${orders.length}</p>
    </div>
    <button class="primary-btn full-width" data-action="history">View order history</button>
  `);
}


function showHistory() {
  const orders = readStore(STORAGE.orders, []);

  if (!orders.length) {
    openModal(
      "Order History",
      '<div class="empty-state">You have not placed any orders yet.</div>'
    );
    return;
  }

  openModal(
    "Your Order History",
    orders.slice().reverse().map(order => `
      <article class="history-card">

        <div class="history-heading">
          <strong>Order ${escapeHTML(order.orderId || "N/A")}</strong>
          <span class="order-status">
            ${escapeHTML(order.status || "Order placed")}
          </span>
        </div>

        <p class="small-note">
          ${escapeHTML(order.date || "Date not available")}
        </p>

        ${(Array.isArray(order.items) ? order.items : []).map(item => `
          <div class="history-item">
            <span>
              ${escapeHTML(item.name || "Product")} ×
              ${Number(item.qty || 1)}
            </span>
            <strong>
              ${money(Number(item.price || 0) * Number(item.qty || 1))}
            </strong>
          </div>
        `).join("")}

        <div class="history-total">
          <span>Total</span>
          <strong>${money(Number(order.total || 0))}</strong>
        </div>

        ${
          order.customer ? `
            <details class="order-address">
              <summary>Delivery Details</summary>
              <p>${escapeHTML(order.customer.name || "")}</p>
              <p>${escapeHTML(order.customer.phone || "")}</p>
              <p>
                ${escapeHTML(order.customer.address || "")},
                ${escapeHTML(order.customer.city || "")},
                ${escapeHTML(order.customer.state || "")} -
                ${escapeHTML(order.customer.pincode || "")}
              </p>
            </details>
          ` : ""
        }

      </article>
    `).join("")
  );
}


function showWishlist() {
  const ids = readStore(STORAGE.wishlist, []);
  const items = ids.map(getProduct).filter(Boolean);
  openModal("My wishlist", items.length
    ? `<div class="product-grid wishlist-grid">${items.map(productCard).join("")}</div>`
    : '<div class="empty-state">Your wishlist is empty.</div>');
}

function renderProductDetail() {
  const container = $("productDetail");
  if (!container) return;

  const params = new URLSearchParams(location.search);
  const id = Number(params.get("id"));
  const p = getProduct(id);

  if (!p) {
    container.innerHTML = `
      <div class="empty-state">
        <h2>Product not found</h2>
        <p>Please select a product from our collection.</p>
        <a class="primary-btn" href="index.html#shop">Browse products</a>
      </div>`;
    return;
  }

  const wished = readStore(STORAGE.wishlist, []).includes(p.id);
  container.innerHTML = `
    <section class="product-detail">
      <div class="detail-image">
        <img src="${p.image}" alt="${escapeHTML(p.name)}">
      </div>
      <div class="detail-info">
        <p class="eyebrow">HANDMADE CLAYORA COLLECTION</p>
        <p class="product-category">${escapeHTML(p.category)}</p>
        <h1>${escapeHTML(p.name)}</h1>
        <div class="rating">★ ${p.rating} <span>Customer rating</span></div>
        <div class="detail-price"><strong>${money(p.price)}</strong></div>
        <p>${escapeHTML(p.description)}</p>
        <div class="spec-grid">
          <div><span>Product size</span><strong>${escapeHTML(p.size)}</strong></div>
          <div><span>Material</span><strong>${escapeHTML(p.material)}</strong></div>
          <div><span>Colour</span><strong>${escapeHTML(p.color)}</strong></div>
          <div><span>Availability</span><strong>${p.stock} available</strong></div>
          <div><span>Category</span><strong>${escapeHTML(p.category)}</strong></div>
          <div><span>Product ID</span><strong>CLY-${p.id}</strong></div>
        </div>
        <div class="detail-note">
          <strong>Delivery:</strong> Address and PIN code are checked at checkout.<br>
          <strong>Care:</strong> Handle handmade pottery with care.<br>
          <strong>Returns:</strong> Contact the seller for return eligibility before ordering.
        </div>
        <div class="detail-buttons">
          <button class="primary-btn" data-action="add" data-id="${p.id}">Add to cart</button>
          <button class="outline-btn" data-action="buy" data-id="${p.id}">Buy now</button>
          <button class="outline-btn" data-action="wish" data-id="${p.id}">${wished ? "♥ Wishlisted" : "♡ Wishlist"}</button>
        </div>
      </div>
    </section>
    <section class="review-box">
      <h2>Product information</h2>
      <p>${escapeHTML(p.description)}</p>
      <p>Ratings shown here are sample catalogue ratings, not verified customer reviews.</p>
    </section>`;

  const related = $("relatedGrid");
  if (related) {
    related.innerHTML = products.filter(item => item.id !== p.id && item.category === p.category)
      .concat(products.filter(item => item.id !== p.id && item.category !== p.category))
      .slice(0,4).map(productCard).join("");
  }
}

function renderPosts() {
  const box = $("communityPosts");
  if (!box) return;

  const posts = readStore(STORAGE.posts, []);
  box.innerHTML = posts.map(post => `
    <article class="community-post">
      <strong>${escapeHTML(post.name)}</strong>
      <p>${escapeHTML(post.text)}</p>
      <small>${escapeHTML(post.date)}</small>
    </article>`).join("");
}

function bindEvents() {
  $("loginForm")?.addEventListener("submit", event => {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.reportValidity()) return;

    const otp = $("loginOtp").value.trim();
    if (otp !== sessionStorage.getItem("clayoraDemoOtp")) {
      return notify("Please enter the demo OTP generated on this page.");
    }

    const user = {
      name:$("loginName").value.trim(),
      email:$("loginEmail").value.trim(),
      phone:$("loginPhone").value.trim()
    };
    saveStore(STORAGE.user,user);
    $("loginScreen").hidden = true;
    $("storeScreen").hidden = false;
    notify("Welcome to Clayora, " + user.name + "!");
    renderProducts();
  });

  $("getOtp")?.addEventListener("click", () => {
    const email = $("loginEmail").value.trim();
    if (!email || !$("loginEmail").checkValidity()) {
      return notify("Enter a valid email address first.");
    }
    const otp = String(Math.floor(100000 + Math.random()*900000));
    sessionStorage.setItem("clayoraDemoOtp", otp);
    $("otpHint").textContent = "Your demo OTP is " + otp + ". This is not sent by email or SMS.";
  });

  $("logoutBtn")?.addEventListener("click", () => {
    localStorage.removeItem(STORAGE.user);
    if ($("storeScreen")) $("storeScreen").hidden = true;
    if ($("loginScreen")) $("loginScreen").hidden = false;
    notify("You have signed out.");
  });

  $("searchInput")?.addEventListener("input", renderProducts);
  $("searchBtn")?.addEventListener("click", renderProducts);
  $("sortSelect")?.addEventListener("change", renderProducts);
  $("categorySelect")?.addEventListener("change", renderProducts);

  document.querySelectorAll(".category-nav button").forEach(button => {
    button.addEventListener("click", () => {
      if ($("categorySelect")) $("categorySelect").value = button.dataset.category;
      renderProducts();
      $("shop")?.scrollIntoView({behavior:"smooth"});
    });
  });

  $("profileNav")?.addEventListener("click", showProfile);
  $("historyNav")?.addEventListener("click", showHistory);
  $("cartNav")?.addEventListener("click", showCart);
  $("wishlistNav")?.addEventListener("click", showWishlist);

  $("postForm")?.addEventListener("submit", event => {
    event.preventDefault();
    if (!event.currentTarget.reportValidity()) return;
    const posts = readStore(STORAGE.posts, []);
    posts.unshift({
      name:currentUser()?.name || "Clayora visitor",
      text:$("postText").value.trim(),
      date:new Date().toLocaleDateString("en-IN")
    });
    saveStore(STORAGE.posts,posts.slice(0,30));
    $("postText").value = "";
    renderPosts();
    notify("Your post has been shared.");
  });

  $("feedbackForm")?.addEventListener("submit", event => {
    event.preventDefault();
    if (!event.currentTarget.reportValidity()) return;
    const feedback = readStore(STORAGE.feedback, []);
    feedback.push({
      rating:$("feedbackRating").value,
      text:$("feedbackText").value.trim(),
      date:new Date().toLocaleDateString("en-IN")
    });
    saveStore(STORAGE.feedback,feedback);
    event.currentTarget.reset();
    notify("Thank you for your feedback!");
  });

  document.addEventListener("click", event => {
    const button = event.target.closest("[data-action]");
    if (!button) return;

    const action = button.dataset.action;
    const id = Number(button.dataset.id);

    if (action === "add") addToCart(id);
    if (action === "wish") toggleWishlist(id);
    if (action === "close") closeModal();
    if (action === "backdrop" && event.target === button) closeModal();
    if (action === "checkout") showCheckout();
    if (action === "history") showHistory();
    if (action === "coupon") {
      const input = $("couponInput");
      const message = $("couponMessage");
      if (input?.value.trim().toUpperCase() === "CLAY10") {
        couponApplied = true;
        if (message) message.textContent = "CLAY10 applied: 10% discount. Reopen cart to refresh total.";
        notify("Coupon applied.");
        showCart();
      } else {
        couponApplied = false;
        if (message) message.textContent = "Invalid code. Try CLAY10.";
      }
    }
    if (action === "remove") {
      saveStore(STORAGE.cart,cartItems().filter(item => item.id !== id));
      updateCartCount();
      showCart();
    }
    if (action === "qty") {
      const change = Number(button.dataset.change);
      const cart = cartItems();
      const item = cart.find(entry => entry.id === id);
      const p = getProduct(id);
      if (item && p) {
        item.qty = Math.max(0,Math.min(p.stock,item.qty+change));
        saveStore(STORAGE.cart,cart.filter(entry => entry.qty > 0));
        updateCartCount();
        showCart();
      }
    }
    if (action === "buy") {
      addToCart(id);
      showCheckout();
    }
  });

  document.addEventListener("submit", event => {
    if (event.target.id === "checkoutForm") {
      event.preventDefault();
      placeOrder(event.target);
    }
  });

  document.addEventListener("keydown", event => {
    if (event.key === "Escape") closeModal();
  });
}

function init() {
  bindEvents();
  updateCartCount();
  renderProducts();
  renderProductDetail();
  renderPosts();

  const user = currentUser();
  if ($("loginScreen") && $("storeScreen")) {
    $("loginScreen").hidden = !!user;
    $("storeScreen").hidden = !user;
  }
}

init();

