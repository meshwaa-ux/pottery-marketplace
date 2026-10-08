/* =================================================
   POTTERYHUB JAVASCRIPT
================================================= */


/* =================================================
   PRODUCT DATABASE
================================================= */

const products = [

    {
        id: 1,
        name: "Handmade Terracotta Vase",
        category: "vases",
        price: 899,
        rating: 4.9,
        image: "🏺",
        description: "Beautiful handmade terracotta vase."
    },

    {
        id: 2,
        name: "Blue Ceramic Coffee Mug",
        category: "mugs",
        price: 499,
        rating: 4.8,
        image: "☕",
        description: "Handcrafted blue ceramic coffee mug."
    },

    {
        id: 3,
        name: "Natural Clay Planter",
        category: "planters",
        price: 699,
        rating: 4.9,
        image: "🪴",
        description: "Simple handmade planter for your home."
    },

    {
        id: 4,
        name: "Traditional Clay Pot",
        category: "pots",
        price: 799,
        rating: 4.7,
        image: "🏺",
        description: "Traditional Indian handmade clay pot."
    },

    {
        id: 5,
        name: "White Ceramic Cup",
        category: "ceramics",
        price: 549,
        rating: 4.6,
        image: "☕",
        description: "Minimal handmade ceramic cup."
    },

    {
        id: 6,
        name: "Mini Indoor Planter",
        category: "planters",
        price: 399,
        rating: 4.7,
        image: "🪴",
        description: "Cute handmade planter for indoor plants."
    },

    {
        id: 7,
        name: "Large Earthen Water Pot",
        category: "pots",
        price: 999,
        rating: 4.9,
        image: "🏺",
        description: "Traditional earthen water pot."
    },

    {
        id: 8,
        name: "Artistic Ceramic Vase",
        category: "vases",
        price: 1299,
        rating: 5.0,
        image: "🏺",
        description: "Unique artistic ceramic vase."
    },

    {
        id: 9,
        name: "Hand Painted Mug",
        category: "mugs",
        price: 599,
        rating: 4.8,
        image: "☕",
        description: "Beautiful hand painted pottery mug."
    },

    {
        id: 10,
        name: "Rustic Flower Pot",
        category: "pots",
        price: 749,
        rating: 4.6,
        image: "🪴",
        description: "Rustic handmade flower pot."
    },

    {
        id: 11,
        name: "Decorative Ceramic Bowl",
        category: "ceramics",
        price: 649,
        rating: 4.8,
        image: "🍵",
        description: "Decorative handmade ceramic bowl."
    },

    {
        id: 12,
        name: "Luxury Pottery Vase",
        category: "vases",
        price: 1599,
        rating: 5.0,
        image: "🏺",
        description: "Premium handmade pottery vase."
    }

];


/* =================================================
   COMMUNITY POSTS
================================================= */

const posts = [

    {
        id: 1,
        user: "@MayaPottery",
        avatar: "👩‍🎨",
        image: "🏺",
        caption:
            "Finished my new terracotta vase today! " +
            "What do you think about this design?",
        hashtags:
            "#Terracotta #HandmadePottery",
        likes: 245,
        comments: 32,
        following: false
    },

    {
        id: 2,
        user: "@ClayArtist",
        avatar: "🧑‍🎨",
        image: "☕",
        caption:
            "Trying a new glaze technique today. " +
            "The final color turned out beautiful!",
        hashtags:
            "#CeramicArt #PotteryDesign",
        likes: 389,
        comments: 45,
        following: false
    },

    {
        id: 3,
        user: "@EarthAndClay",
        avatar: "👩‍🎨",
        image: "🪴",
        caption:
            "Simple handmade planters inspired by nature.",
        hashtags:
            "#Clay #Plants #Handmade",
        likes: 178,
        comments: 21,
        following: false
    }

];


/* =================================================
   PAGE NAVIGATION
================================================= */

function showPage(page) {

    const pages = [
        "home",
        "shop",
        "community",
        "trending",
        "cart",
        "checkout",
        "orders",
        "profile"
    ];

    pages.forEach(function(item) {

        const element =
            document.getElementById(
                item + "Page"
            );

        if (element) {

            element.classList.add("hidden");

        }

    });


    const selected =
        document.getElementById(
            page + "Page"
        );

    if (selected) {

        selected.classList.remove("hidden");

    }


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });


    document
        .getElementById("mobileMenu")
        ?.classList.remove("show");


    if (page === "home") {

        displayHomeProducts();

    }

    if (page === "shop") {

        filterProducts();

    }

    if (page === "community") {

        displayPosts();

    }

    if (page === "trending") {

        displayTrending();

    }

    if (page === "cart") {

        displayCart();

    }

    if (page === "checkout") {

        displayCheckout();

    }

    if (page === "orders") {

        displayOrders();

    }

}


/* =================================================
   MOBILE MENU
================================================= */

function toggleMobileMenu() {

    document
        .getElementById("mobileMenu")
        .classList.toggle("show");

}


/* =================================================
   PRODUCT CARD
================================================= */

function createProductCard(product) {

    return `

        <article class="product-card">

            <div class="product-image">

                ${product.image}

            </div>


            <div class="product-info">

                <h3>
                    ${product.name}
                </h3>

                <p>
                    ${product.description}
                </p>

                <div class="rating">

                    ⭐ ${product.rating}

                </div>

                <div class="price">

                    ₹${product.price.toLocaleString("en-IN")}

                </div>


                <div class="card-buttons">

                    <button
                        class="add-btn"
                        onclick="addToCart(${product.id})">

                        🛒 Add

                    </button>


                    <button
                        class="buy-btn"
                        onclick="buyNow(${product.id})">

                        Buy Now

                    </button>

                </div>

            </div>

        </article>

    `;

}


/* =================================================
   HOME PRODUCTS
================================================= */

function displayHomeProducts() {

    const container =
        document.getElementById(
            "homeProducts"
        );

    if (!container) return;

    container.innerHTML =
        products
            .slice(0, 4)
            .map(createProductCard)
            .join("");

}


/* =================================================
   SHOP PRODUCTS
================================================= */

function filterProducts() {

    const container =
        document.getElementById(
            "shopProducts"
        );

    if (!container) return;


    const search =
        document
            .getElementById("searchInput")
            ?.value
            .toLowerCase() || "";


    const category =
        document
            .getElementById("categoryFilter")
            ?.value || "all";


    const sort =
        document
            .getElementById("sortFilter")
            ?.value || "default";


    let result =
        products.filter(function(product) {

            const matchesSearch =
                product.name
                    .toLowerCase()
                    .includes(search);


            const matchesCategory =
                category === "all" ||
                product.category === category;


            return (
                matchesSearch &&
                matchesCategory
            );

        });


    if (sort === "low") {

        result.sort(
            (a, b) =>
                a.price - b.price
        );

    }


    if (sort === "high") {

        result.sort(
            (a, b) =>
                b.price - a.price
        );

    }


    if (sort === "rating") {

        result.sort(
            (a, b) =>
                b.rating - a.rating
        );

    }


    if (result.length === 0) {

        container.innerHTML = `

            <div class="empty-state">

                <h2>
                    😔 No products found
                </h2>

                <p>
                    Try another search.
                </p>

            </div>

        `;

        return;

    }


    container.innerHTML =
        result
            .map(createProductCard)
            .join("");

}


/* =================================================
   CATEGORY
================================================= */

function openCategory(category) {

    showPage("shop");

    const filter =
        document.getElementById(
            "categoryFilter"
        );

    if (filter) {

        filter.value = category;

    }

    filterProducts();

}


/* =================================================
   CART
================================================= */

function getCart() {

    return JSON.parse(
        localStorage.getItem("potteryCart")
    ) || [];

}


function saveCart(cart) {

    localStorage.setItem(
        "potteryCart",
        JSON.stringify(cart)
    );

    updateCartCount();

}


function addToCart(productId) {

    const product =
        products.find(
            item => item.id === productId
        );


    const cart = getCart();


    const existing =
        cart.find(
            item => item.id === productId
        );


    if (existing) {

        existing.quantity++;

    } else {

        cart.push({

            ...product,

            quantity: 1

        });

    }


    saveCart(cart);


    showToast(
        product.name +
        " added to your cart 🛒"
    );

}


function updateCartCount() {

    const cart = getCart();


    const count =
        cart.reduce(
            (total, item) =>
                total + item.quantity,
            0
        );


    const element =
        document.getElementById(
            "cartCount"
        );


    if (element) {

        element.textContent = count;

    }

}


/* =================================================
   CART PAGE
================================================= */

function displayCart() {

    const container =
        document.getElementById(
            "cartItems"
        );


    if (!container) return;


    const cart = getCart();


    if (cart.length === 0) {

        container.innerHTML = `

            <div class="empty-state">

                <h2>
                    🛒 Your cart is empty
                </h2>

                <p>
                    Add some beautiful pottery.
                </p>

                <button
                    class="primary-btn"
                    onclick="showPage('shop')">

                    Start Shopping

                </button>

            </div>

        `;

        updateCartSummary(0);

        return;

    }


    container.innerHTML =
        cart.map(function(item) {

            return `

                <div class="cart-item">

                    <div class="cart-item-image">
                        ${item.image}
                    </div>


                    <div>

                        <h3>
                            ${item.name}
                        </h3>

                        <p>
                            ₹${item.price.toLocaleString("en-IN")}
                        </p>


                        <div class="quantity">

                            <button
                                onclick="changeQuantity(${item.id}, -1)">
                                −
                            </button>

                            <strong>
                                ${item.quantity}
                            </strong>

                            <button
                                onclick="changeQuantity(${item.id}, 1)">
                                +
                            </button>

                        </div>

                    </div>


                    <div>

                        <strong>
                            ₹${(
                                item.price *
                                item.quantity
                            ).toLocaleString("en-IN")}
                        </strong>

                        <br>

                        <button
                            class="remove-btn"
                            onclick="removeFromCart(${item.id})">

                            Remove

                        </button>

                    </div>

                </div>

            `;

        }).join("");


    const subtotal =
        cart.reduce(
            (total, item) =>
                total +
                item.price *
                item.quantity,
            0
        );


    updateCartSummary(subtotal);

}


function changeQuantity(
    productId,
    change
) {

    const cart = getCart();


    const item =
        cart.find(
            product =>
                product.id === productId
        );


    if (!item) return;


    item.quantity += change;


    if (item.quantity <= 0) {

        const index =
            cart.indexOf(item);

        cart.splice(index, 1);

    }


    saveCart(cart);

    displayCart();

}


function removeFromCart(productId) {

    let cart = getCart();


    cart =
        cart.filter(
            item =>
                item.id !== productId
        );


    saveCart(cart);

    displayCart();


    showToast(
        "Product removed from cart."
    );

}


function updateCartSummary(subtotal) {

    const delivery =
        subtotal > 0 ? 50 : 0;

    const total =
        subtotal + delivery;


    const subtotalElement =
        document.getElementById(
            "cartSubtotal"
        );

    const deliveryElement =
        document.getElementById(
            "deliveryCharge"
        );

    const totalElement =
        document.getElementById(
            "cartTotal"
        );


    if (subtotalElement) {

        subtotalElement.textContent =
            "₹" +
            subtotal.toLocaleString("en-IN");

    }


    if (deliveryElement) {

        deliveryElement.textContent =
            "₹" +
            delivery.toLocaleString("en-IN");

    }


    if (totalElement) {

        totalElement.textContent =
            "₹" +
            total.toLocaleString("en-IN");

    }

}


/* =================================================
   BUY NOW
================================================= */

function buyNow(productId) {

    const product =
        products.find(
            item => item.id === productId
        );


    let cart = [

        {
            ...product,
            quantity: 1
        }

    ];


    localStorage.setItem(
        "potteryCart",
        JSON.stringify(cart)
    );


    updateCartCount();

    showPage("checkout");

}


/* =================================================
   CHECKOUT
================================================= */

function showCheckout() {

    const cart = getCart();


    if (cart.length === 0) {

        showToast(
            "Your cart is empty."
        );

        return;

    }


    showPage("checkout");

}


function displayCheckout() {

    const container =
        document.getElementById(
            "checkoutItems"
        );


    if (!container) return;


    const cart = getCart();


    let total = 0;


    container.innerHTML =
        cart.map(function(item) {

            const itemTotal =
                item.price *
                item.quantity;


            total += itemTotal;


            return `

                <div class="checkout-product">

                    <span>

                        ${item.name}

                        × ${item.quantity}

                    </span>

                    <strong>

                        ₹${itemTotal.toLocaleString("en-IN")}

                    </strong>

                </div>

            `;

        }).join("");


    total +=
        cart.length > 0 ? 50 : 0;


    const totalElement =
        document.getElementById(
            "checkoutTotal"
        );


    if (totalElement) {

        totalElement.textContent =
            "₹" +
            total.toLocaleString("en-IN");

    }

}


/* =================================================
   PLACE ORDER
================================================= */

function placeOrder() {

    const name =
        document
            .getElementById("customerName")
            .value
            .trim();


    const phone =
        document
            .getElementById("customerPhone")
            .value
            .trim();


    const address =
        document
            .getElementById("customerAddress")
            .value
            .trim();


    const payment =
        document
            .querySelector(
                'input[name="payment"]:checked'
            )
            ?.value;


    if (!name || !phone || !address) {

        showToast(
            "Please fill all delivery details."
        );

        return;

    }


    const cart = getCart();


    if (cart.length === 0) {

        showToast(
            "Your cart is empty."
        );

        return;

    }


    let total =
        cart.reduce(
            (sum, item) =>
                sum +
                item.price *
                item.quantity,
            0
        );


    total += 50;


    const order = {

        id:
            "PH" +
            Date.now()
                .toString()
                .slice(-6),

        date:
            new Date()
                .toLocaleDateString("en-IN"),

        customer: name,

        phone: phone,

        address: address,

        payment:
            payment === "cod"
                ? "Cash on Delivery"
                : payment === "upi"
                    ? "UPI / Online Payment"
                    : "Card Payment",

        items: cart,

        total: total,

        status: "Placed",

        statusIndex: 0,

        cancelled: false

    };


    let orders =
        JSON.parse(
            localStorage.getItem(
                "potteryOrders"
            )
        ) || [];


    orders.unshift(order);


    localStorage.setItem(
        "potteryOrders",
        JSON.stringify(orders)
    );


    localStorage.removeItem(
        "potteryCart"
    );


    updateCartCount();


    alert(
        "🎉 Order placed successfully!\n\n" +
        "Order ID: " +
        order.id +
        "\n\n" +
        "Payment: " +
        order.payment
    );


    showPage("orders");

}


/* =================================================
   ORDERS
================================================= */

function getOrders() {

    return JSON.parse(
        localStorage.getItem(
            "potteryOrders"
        )
    ) || [];

}


function displayOrders() {

    const container =
        document.getElementById(
            "ordersContainer"
        );


    if (!container) return;


    const orders = getOrders();


    if (orders.length === 0) {

        container.innerHTML = `

            <div class="empty-state">

                <h2>
                    📦 No orders yet
                </h2>

                <p>
                    Your future orders will appear here.
                </p>

                <button
                    class="primary-btn"
                    onclick="showPage('shop')">

                    Shop Now

                </button>

            </div>

        `;

        return;

    }


    container.innerHTML =
        orders.map(function(order) {

            return createOrderCard(order);

        }).join("");

}


function createOrderCard(order) {

    const steps = [

        "Placed",
        "Confirmed",
        "Shipped",
        "Out for Delivery",
        "Delivered"

    ];


    const tracking =
        steps.map(
            function(step, index) {

                const active =
                    index <=
                    order.statusIndex
                        ? "active"
                        : "";


                return `

                    <div
                        class="track-step ${active}">

                        <div
                            class="track-circle">

                            ${index <=
                            order.statusIndex
                                ? "✓"
                                : index + 1}

                        </div>

                        ${step}

                    </div>

                `;

            }
        ).join("");


    const cancelDisabled =
        order.statusIndex >= 2 ||
        order.cancelled;


    let status =
        order.cancelled
            ? "Cancelled"
            : steps[order.statusIndex];


    return `

        <div class="order-card">

            <div class="order-top">

                <div>

                    <h2>
                        Order #${order.id}
                    </h2>

                    <p>
                        ${order.date}
                    </p>

                </div>


                <span class="order-status">

                    ${status}

                </span>

            </div>


            <p>
                <strong>
                    Payment:
                </strong>

                ${order.payment}
            </p>


            <p>
                <strong>
                    Total:
                </strong>

                ₹${order.total.toLocaleString("en-IN")}
            </p>


            <div class="tracking">

                ${tracking}

            </div>


            <div>

                <strong>
                    Items:
                </strong>

                ${order.items
                    .map(
                        item =>
                            `${item.name} × ${item.quantity}`
                    )
                    .join(", ")}

            </div>


            <br>


            <button
                class="cancel-btn"
                ${cancelDisabled ? "disabled" : ""}
                onclick="cancelOrder('${order.id}')">

                ${
                    order.cancelled
                        ? "Order Cancelled"
                        : order.statusIndex >= 2
                            ? "Cancellation Unavailable After Shipping"
                            : "Cancel Order"
                }

            </button>


            <button
                class="secondary-btn"
                onclick="advanceOrder('${order.id}')">

                Demo: Update Status →

            </button>

        </div>

    `;

}


/* =================================================
   CANCEL ORDER
================================================= */

function cancelOrder(orderId) {

    let orders = getOrders();


    const order =
        orders.find(
            item =>
                item.id === orderId
        );


    if (!order) return;


    /*
       IMPORTANT PROJECT RULE:

       Once statusIndex >= 2,
       the order has been shipped.

       Cancellation is NOT allowed.
    */

    if (order.statusIndex >= 2) {

        showToast(
            "❌ Order cannot be cancelled after shipping."
        );

        return;

    }


    if (order.cancelled) {

        return;

    }


    order.cancelled = true;

    order.status = "Cancelled";


    localStorage.setItem(
        "potteryOrders",
        JSON.stringify(orders)
    );


    displayOrders();


    showToast(
        "Order cancelled successfully."
    );

}


/* =================================================
   DEMO ORDER STATUS
================================================= */

function advanceOrder(orderId) {

    let orders = getOrders();


    const order =
        orders.find(
            item =>
                item.id === orderId
        );


    if (!order) return;


    if (order.cancelled) {

        showToast(
            "Cancelled orders cannot be updated."
        );

        return;

    }


    if (order.statusIndex < 4) {

        order.statusIndex++;

    }


    localStorage.setItem(
        "potteryOrders",
        JSON.stringify(orders)
    );


    displayOrders();


    if (order.statusIndex === 2) {

        showToast(
            "🚚 Order shipped. Cancellation is now disabled."
        );

    }

}


/* =================================================
   COMMUNITY
================================================= */

function displayPosts() {

    const container =
        document.getElementById(
            "communityPosts"
        );


    if (!container) return;


    container.innerHTML =
        posts.map(function(post) {

            return `

                <article class="post-card">

                    <div class="post-header">

                        <div class="post-user">

                            <div
                                class="post-user-avatar">

                                ${post.avatar}

                            </div>

                            <strong>
                                ${post.user}
                            </strong>

                        </div>


                        <button
                            class="follow-btn"
                            onclick="followPotter(this)">

                            ${post.following
                                ? "Following"
                                : "Follow"}

                        </button>

                    </div>


                    <div class="post-image">

                        ${post.image}

                    </div>


                    <div class="post-body">

                        <div class="post-actions">

                            <button
                                onclick="likePost(${post.id}, this)">

                                ❤️
                                ${post.likes}

                            </button>

                            <button
                                onclick="commentPost()">

                                💬
                                ${post.comments}

                            </button>

                            <button
                                onclick="sharePost()">

                                ↗️ Share

                            </button>

                        </div>


                        <p class="post-caption">

                            <strong>
                                ${post.user}
                            </strong>

                            ${post.caption}

                        </p>


                        <p class="post-hashtags">

                            ${post.hashtags}

                        </p>

                    </div>

                </article>

            `;

        }).join("");

}


/* =================================================
   COMMUNITY ACTIONS
================================================= */

function likePost(
    postId,
    button
) {

    const post =
        posts.find(
            item =>
                item.id === postId
        );


    if (!post) return;


    post.likes++;


    button.innerHTML =
        `❤️ ${post.likes}`;


    showToast(
        "You liked this post ❤️"
    );

}


function followPotter(button) {

    button.textContent =
        "Following ✓";


    button.style.background =
        "#607d62";

    button.style.color =
        "white";


    showToast(
        "You are now following this potter."
    );

}


function commentPost() {

    const comment =
        prompt(
            "Write your comment:"
        );


    if (
        comment &&
        comment.trim()
    ) {

        showToast(
            "Comment added 💬"
        );

    }

}


function sharePost() {

    showToast(
        "Post link copied! ↗️"
    );

}


function createPost() {

    const text =
        prompt(
            "Write about your pottery:"
        );


    if (
        text &&
        text.trim()
    ) {

        posts.unshift({

            id:
                Date.now(),

            user:
                "@You",

            avatar:
                "👩‍🎨",

            image:
                "🏺",

            caption:
                text,

            hashtags:
                "#MyPottery #PotteryHub",

            likes:
                0,

            comments:
                0,

            following:
                false

        });


        displayPosts();


        showToast(
            "Your post was created! 🎨"
        );

    }

}


/* =================================================
   TRENDING
================================================= */

function displayTrending() {

    const container =
        document.getElementById(
            "trendingProducts"
        );


    if (!container) return;


    const trending =
        [...products]
            .sort(
                (a, b) =>
                    b.rating -
                    a.rating
            )
            .slice(0, 4);


    container.innerHTML =
        trending
            .map(createProductCard)
            .join("");

}


/* =================================================
   PROFILE
================================================= */

function editProfile() {

    const name =
        prompt(
            "Enter your potter/profile name:"
        );


    if (
        name &&
        name.trim()
    ) {

        showToast(
            "Profile updated for " +
            name
        );

    }

}


/* =================================================
   TOAST
================================================= */

function showToast(message) {

    const toast =
        document.getElementById(
            "toast"
        );


    if (!toast) return;


    toast.textContent =
        message;


    toast.classList.add(
        "show"
    );


    setTimeout(
        function() {

            toast.classList.remove(
                "show"
            );

        },
        2500
    );

}


/* =================================================
   INITIALIZE WEBSITE
================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function() {

        displayHomeProducts();

        updateCartCount();

        displayPosts();

    }
);