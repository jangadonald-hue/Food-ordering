const menuData = [
    {
        id: 1,
        name: "Classic Smash Burger",
        category: "Burgers",
        price: 12.99,
        desc: "Double beef patty, melted American cheese, caramelized onions, and our secret sauce on a toasted brioche bun.",
        image: "assets/burger.png"
    },
    {
        id: 2,
        name: "Spicy Volcano Burger",
        category: "Burgers",
        price: 14.50,
        desc: "Jalapeños, pepper jack cheese, crispy onion rings, and fiery chipotle mayo.",
        image: "assets/burger.png"
    },
    {
        id: 3,
        name: "Artisan Pepperoni Pizza",
        category: "Pizza",
        price: 18.00,
        desc: "Hand-tossed crust, San Marzano tomato sauce, fresh mozzarella, and cup-and-char pepperoni.",
        image: "assets/pizza.png"
    },
    {
        id: 4,
        name: "Margherita Supreme",
        category: "Pizza",
        price: 16.50,
        desc: "Fresh basil, sliced tomatoes, extra virgin olive oil and buffalo mozzarella.",
        image: "assets/pizza.png"
    },
    {
        id: 5,
        name: "Avocado Quinoa Bowl",
        category: "Healthy",
        price: 11.99,
        desc: "Fresh mixed greens, roasted sweet potatoes, cherry tomatoes, sliced avocado, and lemon tahini dressing.",
        image: "assets/salad.png"
    },
    {
        id: 6,
        name: "Grilled Chicken Salad",
        category: "Healthy",
        price: 13.50,
        desc: "Herb-marinated grilled chicken, cucumbers, feta cheese, olives, and balsamic vinaigrette.",
        image: "assets/salad.png"
    }
];

let cart = [];

// DOM Elements
const menuGrid = document.getElementById('menuGrid');
const cartIcon = document.getElementById('cartIcon');
const cartSidebar = document.getElementById('cartSidebar');
const cartOverlay = document.getElementById('cartOverlay');
const closeCartBtn = document.getElementById('closeCart');
const cartItemsContainer = document.getElementById('cartItems');
const cartBadge = document.getElementById('cartBadge');
const cartTotal = document.getElementById('cartTotal');
const checkoutBtn = document.getElementById('checkoutBtn');
const toast = document.getElementById('toast');
const categoryTabs = document.querySelectorAll('.category-btn');

// Initialize
function init() {
    renderMenu('all');
    setupEventListeners();
    updateCartUI();
}

function renderMenu(category) {
    menuGrid.innerHTML = '';
    
    // Simple fast fade-in animation
    menuGrid.style.opacity = 0;
    
    const filteredMenu = category === 'all' 
        ? menuData 
        : menuData.filter(item => item.category === category);
        
    filteredMenu.forEach(item => {
        const card = document.createElement('div');
        card.className = 'menu-card';
        card.innerHTML = `
            <div class="card-img-container">
                <img src="${item.image}" alt="${item.name}" loading="lazy">
            </div>
            <div class="card-info">
                <div class="card-header">
                    <h3 class="card-title">${item.name}</h3>
                    <div class="card-price">$${item.price.toFixed(2)}</div>
                </div>
                <p class="card-desc">${item.desc}</p>
                <button class="add-to-cart-btn" onclick="addToCart(${item.id})">
                    <i class='bx bx-cart-add'></i> Add to Cart
                </button>
            </div>
        `;
        menuGrid.appendChild(card);
    });

    setTimeout(() => {
        menuGrid.style.transition = 'opacity 0.3s ease';
        menuGrid.style.opacity = 1;
    }, 50);
}

function setupEventListeners() {
    // Categories
    categoryTabs.forEach(tab => {
        tab.addEventListener('click', (e) => {
            // Remove active class
            categoryTabs.forEach(t => t.classList.remove('active'));
            // Add to clicked
            e.target.classList.add('active');
            // Filter
            renderMenu(e.target.dataset.category);
        });
    });

    // Cart Toggle
    cartIcon.addEventListener('click', toggleCart);
    closeCartBtn.addEventListener('click', toggleCart);
    cartOverlay.addEventListener('click', toggleCart);

    // Checkout
    checkoutBtn.addEventListener('click', () => {
        if(cart.length > 0) {
            alert('Proceeding to checkout! (This is where payment integration would go)');
            cart = [];
            updateCartUI();
            toggleCart();
        }
    });
}

function toggleCart() {
    cartSidebar.classList.toggle('active');
    cartOverlay.classList.toggle('active');
}

window.addToCart = function(id) {
    const product = menuData.find(item => item.id === id);
    const existingItem = cart.find(item => item.id === id);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    updateCartUI();
    showToast();
}

window.changeQuantity = function(id, change) {
    const itemIndex = cart.findIndex(item => item.id === id);
    if (itemIndex > -1) {
        cart[itemIndex].quantity += change;
        if (cart[itemIndex].quantity <= 0) {
            cart.splice(itemIndex, 1);
        }
        updateCartUI();
    }
}

window.removeFromCart = function(id) {
    cart = cart.filter(item => item.id !== id);
    updateCartUI();
}

function updateCartUI() {
    // Update Badge
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartBadge.textContent = totalItems;
    
    // Pop animation for badge
    cartBadge.style.transform = 'scale(1.3)';
    setTimeout(() => cartBadge.style.transform = 'scale(1)', 200);

    // Render Items
    cartItemsContainer.innerHTML = '';
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<div class="empty-cart-msg" style="display:block">Your cart is empty</div>';
        checkoutBtn.disabled = true;
    } else {
        checkoutBtn.disabled = false;
        cart.forEach(item => {
            const cartItemEl = document.createElement('div');
            cartItemEl.className = 'cart-item';
            cartItemEl.innerHTML = `
                <img src="${item.image}" alt="${item.name}">
                <div class="item-details">
                    <div class="item-title">${item.name}</div>
                    <div class="item-price">$${(item.price * item.quantity).toFixed(2)}</div>
                </div>
                <div class="item-controls">
                    <button class="qty-btn" onclick="changeQuantity(${item.id}, -1)">-</button>
                    <span>${item.quantity}</span>
                    <button class="qty-btn" onclick="changeQuantity(${item.id}, 1)">+</button>
                    <button class="remove-btn" onclick="removeFromCart(${item.id})"><i class='bx bx-trash'></i></button>
                </div>
            `;
            cartItemsContainer.appendChild(cartItemEl);
        });
    }

    // Update Total
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotal.textContent = '$' + total.toFixed(2);
}

function showToast() {
    toast.innerHTML = "<i class='bx bx-check-circle'></i> Item added to cart!";
    toast.classList.add('show');
    setTimeout(() => {
        toast.classList.remove('show');
    }, 2500);
}

// Run the application
init();
