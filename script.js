// 4. DATA
const menuData = [
    {
        category: "BILAO",
        items: [
            { name: "Bihon", image: "img/menu/bilao/bihon.webp" },
            { name: "Canton Bihon", image: "img/menu/bilao/canton-bihon.webp" },
            { name: "Canton Guisado", image: "img/menu/bilao/canton-guisado.webp" },
            { name: "Jacks Special Bilao", image: "img/menu/bilao/jacks-special-bilao.webp" },
            { name: "Miki Bihon", image: "img/menu/bilao/miki-bihon.webp" },
            { name: "Palabok", image: "img/menu/bilao/palabok.webp" },
            { name: "Spaghetti", image: "img/menu/bilao/spaghetti.webp" }
        ]
    },
    {
        category: "CHICKEN",
        items: [
            { name: "Battered Chicken", image: "img/menu/chicken/battered-chicken.webp" },
            { name: "Chicken Curry", image: "img/menu/chicken/chicken-curry.webp" },
            { name: "Chicken Mushroom", image: "img/menu/chicken/chicken-mushroom.webp" },
            { name: "Spicy Chicken", image: "img/menu/chicken/spicy-chicken.webp" }
        ]
    },
    {
        category: "PANCIT SHORT ORDER",
        items: [
            { name: "Bihon Guisado", image: "img/menu/pancit/bihon-guisado.webp" },
            { name: "Canton Bihon", image: "img/menu/pancit/canton-bihon.webp" },
            { name: "Canton Guisado", image: "img/menu/pancit/canton-guisado.webp" },
            { name: "Jacks Special", image: "img/menu/pancit/jacks-special.webp" },
            { name: "Miki Bihon", image: "img/menu/pancit/miki-bihon.webp" },
            { name: "Special Lomi", image: "img/menu/pancit/special-lomi.webp" }
        ]
    },
    {
        category: "PORK AND VEGGIES",
        items: [
            { name: "Crispy Pata", image: "img/menu/pork/crispy-pata.webp" },
            { name: "Lechon con Ampalaya", image: "img/menu/pork/lechon-con-ampalaya.webp" },
            { name: "Lechon on Tokwa", image: "img/menu/pork/lechon-con-tokwa.webp" },
            { name: "Lumpiang Shanghai", image: "img/menu/pork/lumpiang-shanghai.webp" },
            { name: "Pata Tim", image: "img/menu/pork/pata-tim.webp" },
            { name: "Pork Chopsuey", image: "img/menu/pork/pork-chopsuey.webp" },
            { name: "Pork Mushroom", image: "img/menu/pork/pork-mushroom.webp" },
            { name: "Pork Sisig", image: "img/menu/pork/pork-sisig.webp" },
            { name: "Sweet and Sour Pork", image: "img/menu/pork/sweet-and-sour-pork.webp" }
        ]
    }
];

// State
let cart = JSON.parse(localStorage.getItem('topjacks_cart')) || [];
const PRICE = 350;

// Helper to Save Cart
function saveCart() {
    localStorage.setItem('topjacks_cart', JSON.stringify(cart));
    updateCartUI();
}

// DOM Elements
const categoryList = document.getElementById('category-list');
const menuGrid = document.getElementById('menu-grid');
const storeStatus = document.getElementById('store-status');
const cartBtn = document.getElementById('cart-btn');
const cartCount = document.getElementById('cart-count');
const cartTotalPreview = document.getElementById('cart-total-preview');
const cartModal = document.getElementById('cart-modal');
const closeModal = document.getElementById('close-modal');
const cartItemsContainer = document.getElementById('cart-items');
const cartTotal = document.getElementById('cart-total');
const placeOrderBtn = document.getElementById('place-order-btn');
const customerNameInput = document.getElementById('customer-name');
const customerAddressInput = document.getElementById('customer-address');
const toast = document.getElementById('toast');

// Initialization
document.addEventListener('DOMContentLoaded', () => {
    checkStoreStatus();
    updateCartUI(); // Ensure UI matches saved cart immediately
    
    // Hamburger Menu Logic
    const hamburgerBtn = document.querySelector('.hamburger-btn');
    const mobileNav = document.querySelector('.mobile-nav-overlay');
    const closeNavBtn = document.querySelector('.close-nav-btn');

    if(hamburgerBtn && mobileNav && closeNavBtn) {
        hamburgerBtn.addEventListener('click', () => {
            mobileNav.classList.remove('hidden');
            // Small delay to allow transition
            setTimeout(() => mobileNav.classList.add('visible'), 10);
        });

        closeNavBtn.addEventListener('click', () => {
            mobileNav.classList.remove('visible');
            setTimeout(() => mobileNav.classList.add('hidden'), 300);
        });
    }

    // Search Functionality
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase().trim();
            filterMenuItems(query);
        });
    }

    if (typeof menuGrid !== 'undefined' && menuGrid) {
        renderMenu();
        // Observer for headers
        setTimeout(() => {
            document.querySelectorAll('.category-header').forEach(header => {
                observer.observe(header);
            });
        }, 100);
    }
    setupEventListeners();
});

// Store Status
function checkStoreStatus() {
    const now = new Date();
    const hours = now.getHours();
    const isOpen = hours >= 8 && hours < 19;

    if (isOpen) {
        storeStatus.textContent = "OPEN";
        storeStatus.classList.add('open');
        storeStatus.classList.remove('closed');
    } else {
        storeStatus.textContent = "CLOSED";
        storeStatus.classList.add('closed');
        storeStatus.classList.remove('open');
    }
}

// Render Menu
function renderMenu() {
    menuData.forEach((cat, index) => {
        // Nav Item
        const li = document.createElement('li');
        const btn = document.createElement('button');
        btn.textContent = cat.category;
        btn.className = 'category-btn';
        if(index === 0) btn.classList.add('active'); // Default active
        btn.onclick = () => scrollToCategory(index);
        li.appendChild(btn);
        categoryList.appendChild(li);

        // Header
        const header = document.createElement('h3');
        header.textContent = cat.category;
        header.className = 'category-header';
        header.id = `cat-${index}`;
        menuGrid.appendChild(header);

        // Items
        cat.items.forEach(item => {
            const itemCard = createItemCard(item, cat.category);
            menuGrid.appendChild(itemCard);
        });
    });
}

function createItemCard(item, category) {
    const name = item.name;
    const image = item.image;
    const card = document.createElement('div');
    card.className = 'menu-item';

    // Added a fake description for "app-like" feel
    const description = "Delicious authentic dish made with fresh ingredients.";

    card.innerHTML = `
        <img src="${image}" alt="${name}" loading="lazy">
        <div class="item-content">
            <div>
                <h4 class="item-name">${name}</h4>
                <p class="item-desc">${description}</p>
            </div>
            <div class="item-footer">
                <div class="item-price">₱ ${PRICE.toFixed(2)}</div>
                <button class="add-btn" aria-label="Add to cart" onclick="addToCart('${name}')">+</button>
            </div>
        </div>
    `;
    return card;
}

// Search Filter Function
function filterMenuItems(query) {
    const allMenuItems = document.querySelectorAll('.menu-item');
    const allCategoryHeaders = document.querySelectorAll('.category-header');
    
    if (!query) {
        // Show everything if search is empty
        allMenuItems.forEach(item => item.style.display = 'flex');
        allCategoryHeaders.forEach(header => header.style.display = 'block');
        return;
    }
    
    // Hide all initially
    allMenuItems.forEach(item => item.style.display = 'none');
    allCategoryHeaders.forEach(header => header.style.display = 'none');
    
    // Show matching items
    allMenuItems.forEach(item => {
        const itemName = item.querySelector('.item-name').textContent.toLowerCase();
        if (itemName.includes(query)) {
            item.style.display = 'flex';
            // Show the category header for this item
            const categoryHeader = item.previousElementSibling;
            if (categoryHeader && categoryHeader.classList.contains('category-header')) {
                categoryHeader.style.display = 'block';
            } else {
                // Find the closest previous category header
                let prevElement = item.previousElementSibling;
                while (prevElement) {
                    if (prevElement.classList.contains('category-header')) {
                        prevElement.style.display = 'block';
                        break;
                    }
                    prevElement = prevElement.previousElementSibling;
                }
            }
        }
    });
}

// Smooth Scroll
function scrollToCategory(index) {
    const element = document.getElementById(`cat-${index}`);
    const headerHeight = 70; // Header height
    const navHeight = 60; // Nav height approx
    const offset = headerHeight + navHeight + 10;
    
    const bodyRect = document.body.getBoundingClientRect().top;
    const elementRect = element.getBoundingClientRect().top;
    const elementPosition = elementRect - bodyRect;
    const offsetPosition = elementPosition - offset;

    window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
    });

    updateActiveCategory(index);
}

function updateActiveCategory(index) {
    document.querySelectorAll('.category-btn').forEach(btn => btn.classList.remove('active'));
    const activeBtn = document.querySelectorAll('.category-btn')[index];
    if (activeBtn) {
        activeBtn.classList.add('active');
        activeBtn.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    }
}

// Add to Cart
window.addToCart = function(itemName) {
    cart.push({ name: itemName, price: PRICE });
    saveCart();
    showToast(`${itemName} added`);
};

function showToast(message) {
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => {
        toast.classList.remove('show');
    }, 2000);
}

function updateCartUI() {
    // Update count
    const count = cart.length;
    cartCount.textContent = `${count} item${count !== 1 ? 's' : ''}`;
    
    // Update total preview
    const total = cart.reduce((sum, item) => sum + item.price, 0);
    cartTotalPreview.textContent = `₱ ${total.toFixed(2)}`;

    // Show/Hide Floating Button
    if (count > 0) {
        cartBtn.classList.remove('hidden');
    } else {
        cartBtn.classList.add('hidden');
    }
}

// Modal
function openCart() {
    if(cart.length === 0) return;
    cartModal.classList.remove('hidden');
    void cartModal.offsetWidth; 
    cartModal.classList.add('visible');
    renderCartItems();
}

function closeCart() {
    cartModal.classList.remove('visible');
    setTimeout(() => {
        cartModal.classList.add('hidden');
    }, 300);
}

function renderCartItems() {
    cartItemsContainer.innerHTML = '';
    let total = 0;

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p style="text-align:center; padding: 2rem; color:#888;">Your cart is empty.</p>';
        cartTotal.textContent = '₱ 0.00';
        return;
    }

    // Group items logic could be added here, but keeping it simple for now
    cart.forEach((item, index) => {
        total += item.price;
        const div = document.createElement('div');
        div.className = 'cart-item';
        div.innerHTML = `
            <span class="cart-item-name">${item.name}</span>
            <div style="display:flex; align-items:center; gap: 1rem;">
                <span>₱ ${item.price.toFixed(2)}</span>
                <button onclick="removeFromCart(${index})" style="color:#E03E3E; background:none; border:none; font-size:1.2rem; cursor:pointer;">&times;</button>
            </div>
        `;
        cartItemsContainer.appendChild(div);
    });

    cartTotal.textContent = `₱ ${total.toFixed(2)}`;
}

window.removeFromCart = function(index) {
    cart.splice(index, 1);
    saveCart();
    renderCartItems();
    if (cart.length === 0) {
        closeCart();
    }
};

function setupEventListeners() {
    cartBtn.addEventListener('click', openCart);
    closeModal.addEventListener('click', closeCart);
    cartModal.addEventListener('click', (e) => {
        if (e.target === cartModal) closeCart();
    });

    placeOrderBtn.addEventListener('click', () => {
        if (cart.length === 0) return;

        const name = customerNameInput.value.trim();
        const address = customerAddressInput.value.trim();

        if (!name || !address) {
            alert("Please enter your Name and Address to proceed.");
            return;
        }
        
        // Disable button to prevent double clicks
        placeOrderBtn.disabled = true;
        placeOrderBtn.textContent = "Opening Messenger...";

        // 1. Summarize Items
        // We want to group items by name to show "2x Item Name"
        const summary = {};
        let grandTotal = 0;

        cart.forEach(item => {
            if (summary[item.name]) {
                summary[item.name].count++;
                summary[item.name].total += item.price;
            } else {
                summary[item.name] = { count: 1, total: item.price };
            }
            grandTotal += item.price;
        });

        // 2. Build String (Clean version for display/copy)
        let message = "Hello Top Jacks! I would like to order:\n\n";
        
        for (const [itemName, details] of Object.entries(summary)) {
            message += `- ${details.count}x ${itemName}\n`;
        }

        message += `\nTotal: ₱ ${grandTotal.toFixed(2)}\n\n`;
        message += `Customer: ${name}\n`;
        message += `Address: ${address}\n`;
        message += `Link: ${window.location.href}`; // Add current page link

        // 3. Show Copy Modal
        showOrderSummaryModal(message);
        
        placeOrderBtn.disabled = false;
        placeOrderBtn.textContent = "Order via Messenger";
    });
}

function showOrderSummaryModal(message) {
    // Create modal elements dynamically or use existing one if you prefer
    // For simplicity, let's create a specialized overlay
    const overlay = document.createElement('div');
    overlay.className = 'modal visible';
    overlay.style.zIndex = '3000'; // Higher than cart modal
    
    const content = document.createElement('div');
    content.className = 'modal-content';
    content.style.maxWidth = '400px';
    
    content.innerHTML = `
        <div class="modal-header">
            <h2>Order Summary</h2>
            <button class="close-btn" onclick="this.closest('.modal').remove()">&times;</button>
        </div>
        <div style="padding-bottom: 1rem;">
            <p style="margin-bottom:1rem; color:var(--text-muted); font-size:0.9rem;">
                Please <strong>Copy</strong> the details below and <strong>Paste</strong> them to our Messenger to confirm your order.
            </p>
            <textarea id="order-text-area" style="width:100%; height:200px; padding:0.75rem; border-radius:8px; border:1px solid #ddd; font-family:inherit; font-size:0.9rem; margin-bottom:1rem;" readonly>${message}</textarea>
            
            <div style="display:flex; gap:0.5rem; flex-direction:column;">
                <button id="copy-btn" class="btn-primary" style="background:#333;">Copy to Clipboard</button>
                <button id="open-messenger-btn" class="btn-primary messenger-btn">Open Messenger</button>
            </div>
        </div>
    `;
    
    overlay.appendChild(content);
    document.body.appendChild(overlay);

    // Event Listeners for the new modal
    const copyBtn = content.querySelector('#copy-btn');
    const openMessengerBtn = content.querySelector('#open-messenger-btn');
    const textArea = content.querySelector('#order-text-area');

    copyBtn.onclick = () => {
        textArea.select();
        textArea.setSelectionRange(0, 99999); // For mobile
        navigator.clipboard.writeText(textArea.value).then(() => {
            copyBtn.textContent = "Copied!";
            setTimeout(() => copyBtn.textContent = "Copy to Clipboard", 2000);
        }).catch(err => {
            console.error('Failed to copy: ', err);
            // Fallback
            document.execCommand('copy');
            copyBtn.textContent = "Copied!";
        });
    };

    openMessengerBtn.onclick = () => {
        // Just open messenger, user will paste manually
        // Using robust link format to avoid m.me certificate issues
        window.open('https://www.facebook.com/messages/t/topjacksofficial', '_blank');
        
        // Clear cart after they initiate the process
        cart = [];
        saveCart();
        updateCartUI();
        
        // Remove overlays
        overlay.remove();
        closeCart();
        
        // Reset Inputs
        customerNameInput.value = '';
        customerAddressInput.value = '';
    };
}

// Intersection Observer for Scroll Spy (Auto-update active category)
const observerOptions = {
    root: null,
    rootMargin: '-140px 0px 0px 0px', // Offset for headers
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            // Find index of this category header
            const id = entry.target.id;
            const index = parseInt(id.split('-')[1]);
            updateActiveCategory(index);
        }
    });
}, observerOptions);

// Note: Observer attachment moved to DOMContentLoaded to check for menuGrid existence
