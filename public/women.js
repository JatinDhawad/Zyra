// Main JavaScript for ZYRA Fashion Website - Part 1: Core Functionality

document.addEventListener('DOMContentLoaded', function() {
    // Initialize core components
    initNavigation();
    initSearchBar();
    initFavorites();
    initShoppingCart();
    initCategoryButtons();
    initProductCards();
    
    // Add the required CSS styles for core functionality
    addCoreStyles();
});

// Mobile Navigation Toggle
function initNavigation() {
    // Create mobile menu button if it doesn't exist
    if (!document.querySelector('.mobile-menu-toggle')) {
        const header = document.querySelector('header');
        const mobileToggle = document.createElement('div');
        mobileToggle.className = 'mobile-menu-toggle';
        mobileToggle.innerHTML = '<i class="fas fa-bars"></i>';
        header.prepend(mobileToggle);
        
        mobileToggle.addEventListener('click', function() {
            document.querySelector('.main-nav').classList.toggle('active');
            document.querySelector('.head').classList.toggle('active');
        });
    }
    
    // Category navigation
    const navItems = document.querySelectorAll('.main-nav ul li');
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            navItems.forEach(navItem => navItem.classList.remove('active'));
            this.classList.add('active');
            
            // For demo purposes - would normally navigate to relevant section
            alert(`Navigating to ${this.textContent} section`);
        });
    });
}

// Search functionality
function initSearchBar() {
    const searchIcon = document.querySelector('.fa-search');
    
    if (searchIcon) {
        // Create search overlay if it doesn't exist
        if (!document.querySelector('.search-overlay')) {
            const searchOverlay = document.createElement('div');
            searchOverlay.className = 'search-overlay';
            searchOverlay.innerHTML = `
                <div class="search-container">
                    <input type="text" placeholder="Search for products..." class="search-input">
                    <button class="search-button"><i class="fas fa-search"></i></button>
                    <div class="close-search"><i class="fas fa-times"></i></div>
                </div>
            `;
            document.body.appendChild(searchOverlay);
            
            // Close search on click
            document.querySelector('.close-search').addEventListener('click', function() {
                document.querySelector('.search-overlay').classList.remove('active');
            });
            
            // Search functionality
            document.querySelector('.search-button').addEventListener('click', function() {
                const searchTerm = document.querySelector('.search-input').value.trim();
                if (searchTerm) {
                    // In a real application, this would search for products
                    alert(`Searching for: ${searchTerm}`);
                }
            });
        }
        
        // Toggle search overlay
        searchIcon.addEventListener('click', function(e) {
            e.preventDefault();
            document.querySelector('.search-overlay').classList.add('active');
            document.querySelector('.search-input').focus();
        });
    }
}

// Favorites functionality
function initFavorites() {
    const heartIcons = document.querySelectorAll('.fa-heart');
    
    heartIcons.forEach(icon => {
        icon.addEventListener('click', function(e) {
            e.preventDefault();
            this.classList.toggle('fas');
            this.classList.toggle('far');
            
            // Display message based on state
            if (this.classList.contains('fas')) {
                showNotification('Added to favorites!');
            } else {
                showNotification('Removed from favorites!');
            }
        });
    });
    
    // Add favorite functionality to products
    const products = document.querySelectorAll('.product-card');
    products.forEach(product => {
        if (!product.querySelector('.favorite-btn')) {
            const favoriteBtn = document.createElement('button');
            favoriteBtn.className = 'favorite-btn';
            favoriteBtn.innerHTML = '<i class="far fa-heart"></i>';
            product.querySelector('.product-info').appendChild(favoriteBtn);
            
            favoriteBtn.addEventListener('click', function() {
                const heartIcon = this.querySelector('i');
                heartIcon.classList.toggle('far');
                heartIcon.classList.toggle('fas');
                
                if (heartIcon.classList.contains('fas')) {
                    showNotification('Added to favorites!');
                } else {
                    showNotification('Removed from favorites!');
                }
            });
        }
    });
}

// Shopping cart functionality
function initShoppingCart() {
    // Initialize cart array in localStorage if not exists
    if (!localStorage.getItem('zyraCart')) {
        localStorage.setItem('zyraCart', JSON.stringify([]));
    }
    
    // Create cart sidebar if it doesn't exist
    if (!document.querySelector('.cart-sidebar')) {
        const cartSidebar = document.createElement('div');
        cartSidebar.className = 'cart-sidebar';
        cartSidebar.innerHTML = `
            <div class="cart-header">
                <h3>Your Shopping Cart</h3>
                <span class="close-cart"><i class="fas fa-times"></i></span>
            </div>
            <div class="cart-items"></div>
            <div class="cart-total">
                <span>Total:</span>
                <span class="total-amount">Rs. 0</span>
            </div>
            <button class="checkout-btn">Proceed to Checkout</button>
        `;
        document.body.appendChild(cartSidebar);
        
        // Close cart on click
        document.querySelector('.close-cart').addEventListener('click', function() {
            document.querySelector('.cart-sidebar').classList.remove('active');
        });
        
        // Checkout button functionality
        document.querySelector('.checkout-btn').addEventListener('click', function() {
            const cartItems = JSON.parse(localStorage.getItem('zyraCart'));
            if (cartItems.length > 0) {
                alert('Proceeding to checkout...');
                // In a real application, this would redirect to the checkout page
            } else {
                alert('Your cart is empty!');
            }
        });
    }
    
    // Toggle cart on cart icon click
    const cartIcon = document.querySelector('.fa-shopping-cart');
    if (cartIcon) {
        cartIcon.parentElement.addEventListener('click', function(e) {
            e.preventDefault();
            document.querySelector('.cart-sidebar').classList.add('active');
            updateCart();
        });
    }
    
    // Add to cart functionality
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function() {
            const productCard = this.closest('.product-card');
            const productName = productCard.querySelector('h3').textContent;
            const productPrice = productCard.querySelector('.price').textContent.replace('Rs. ', '');
            const productImage = productCard.querySelector('img').src;
            
            addToCart({
                name: productName,
                price: parseInt(productPrice),
                image: productImage,
                quantity: 1
            });
            
            showNotification(`${productName} added to cart!`);
        });
    });
    
    // Update cart count
    updateCartCount();
}

// Function to add items to cart
function addToCart(product) {
    let cart = JSON.parse(localStorage.getItem('zyraCart'));
    
    // Check if product already exists in cart
    const existingProduct = cart.find(item => item.name === product.name);
    
    if (existingProduct) {
        existingProduct.quantity += 1;
    } else {
        cart.push(product);
    }
    
    localStorage.setItem('zyraCart', JSON.stringify(cart));
    updateCartCount();
    updateCart();
}

// Update cart items display
function updateCart() {
    const cartItemsContainer = document.querySelector('.cart-items');
    const cartItems = JSON.parse(localStorage.getItem('zyraCart'));
    let totalAmount = 0;
    
    // Clear existing content
    cartItemsContainer.innerHTML = '';
    
    if (cartItems.length === 0) {
        cartItemsContainer.innerHTML = '<p class="empty-cart-message">Your cart is empty!</p>';
    } else {
        cartItems.forEach((item, index) => {
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            cartItem.innerHTML = `
                <div class="cart-item-image">
                    <img src="${item.image}" alt="${item.name}">
                </div>
                <div class="cart-item-details">
                    <h4>${item.name}</h4>
                    <div class="item-price">Rs. ${item.price}</div>
                    <div class="item-quantity">
                        <button class="quantity-btn decrease">-</button>
                        <span>${item.quantity}</span>
                        <button class="quantity-btn increase">+</button>
                    </div>
                </div>
                <button class="remove-item" data-index="${index}">
                    <i class="fas fa-trash"></i>
                </button>
            `;
            cartItemsContainer.appendChild(cartItem);
            
            totalAmount += item.price * item.quantity;
        });
        
        // Add event listeners for quantity buttons and remove buttons
        document.querySelectorAll('.quantity-btn.decrease').forEach((btn, index) => {
            btn.addEventListener('click', function() {
                updateItemQuantity(index, -1);
            });
        });
        
        document.querySelectorAll('.quantity-btn.increase').forEach((btn, index) => {
            btn.addEventListener('click', function() {
                updateItemQuantity(index, 1);
            });
        });
        
        document.querySelectorAll('.remove-item').forEach(btn => {
            btn.addEventListener('click', function() {
                removeFromCart(parseInt(this.dataset.index));
            });
        });
    }
    
    // Update total amount
    document.querySelector('.total-amount').textContent = `Rs. ${totalAmount}`;
}

// Update item quantity in cart
function updateItemQuantity(index, change) {
    let cart = JSON.parse(localStorage.getItem('zyraCart'));
    
    cart[index].quantity += change;
    
    if (cart[index].quantity <= 0) {
        cart.splice(index, 1);
    }
    
    localStorage.setItem('zyraCart', JSON.stringify(cart));
    updateCartCount();
    updateCart();
}

// Remove item from cart
function removeFromCart(index) {
    let cart = JSON.parse(localStorage.getItem('zyraCart'));
    const removedItem = cart[index];
    
    cart.splice(index, 1);
    localStorage.setItem('zyraCart', JSON.stringify(cart));
    
    showNotification(`${removedItem.name} removed from cart!`);
    updateCartCount();
    updateCart();
}

// Update cart count display
function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('zyraCart'));
    const cartIcon = document.querySelector('.fa-shopping-cart');
    
    // Create or update cart count badge
    let cartCount = document.querySelector('.cart-count');
    
    if (!cartCount) {
        cartCount = document.createElement('span');
        cartCount.className = 'cart-count';
        cartIcon.parentElement.appendChild(cartCount);
    }
    
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    
    if (totalItems > 0) {
        cartCount.textContent = totalItems;
        cartCount.style.display = 'block';
    } else {
        cartCount.style.display = 'none';
    }
}

// Shop by category functionality
function initCategoryButtons() {
    const shopButtons = document.querySelectorAll('.shop-btn');
    
    shopButtons.forEach(button => {
        button.addEventListener('click', function() {
            const categoryName = this.closest('.category-card').querySelector('h3').textContent;
            // In a real application, this would navigate to the category page
            alert(`Browsing ${categoryName} category`);
        });
    });
}

// Product cards functionality
function initProductCards() {
    const productCards = document.querySelectorAll('.product-card');
    
    productCards.forEach(card => {
        // Create quick view button if it doesn't exist
        if (!card.querySelector('.quick-view')) {
            const quickViewBtn = document.createElement('button');
            quickViewBtn.className = 'quick-view';
            quickViewBtn.textContent = 'Quick View';
            card.querySelector('.product-image').appendChild(quickViewBtn);
            
            quickViewBtn.addEventListener('click', function() {
                const productName = card.querySelector('h3').textContent;
                const productPrice = card.querySelector('.price').textContent;
                const productImage = card.querySelector('img').src;
                
                openQuickView(productName, productPrice, productImage);
            });
        }
    });
}

// Show notification
function showNotification(message, type = 'success') {
    // Create notification container if it doesn't exist
    if (!document.querySelector('.notification-container')) {
        const notificationContainer = document.createElement('div');
        notificationContainer.className = 'notification-container';
        document.body.appendChild(notificationContainer);
    }
    
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    document.querySelector('.notification-container').appendChild(notification);
    
    // Remove notification after animation
    setTimeout(() => {
        notification.classList.add('fade-out');
        
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 2500);
}

// Add core CSS styles 
function addCoreStyles() {
    if (!document.getElementById('zyra-core-styles')) {
        const styleElement = document.createElement('style');
        styleElement.id = 'zyra-core-styles';
        styleElement.textContent = `
            /* Mobile menu toggle */
            .mobile-menu-toggle {
                display: none;
                cursor: pointer;
                font-size: 1.5rem;
            }
            
            /* Search overlay */
            .search-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(0, 0, 0, 0.8);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 1000;
                opacity: 0;
                visibility: hidden;
                transition: all 0.3s ease;
            }
            
            .search-overlay.active {
                opacity: 1;
                visibility: visible;
            }
            
            .search-container {
                width: 80%;
                max-width: 600px;
                position: relative;
            }
            
            .search-input {
                width: 100%;
                padding: 15px 50px 15px 20px;
                border: none;
                border-radius: 5px;
                font-size: 1.1rem;
            }
            
            .search-button {
                position: absolute;
                right: 10px;
                top: 50%;
                transform: translateY(-50%);
                background: none;
                border: none;
                font-size: 1.2rem;
                cursor: pointer;
            }
            
            .close-search {
                position: absolute;
                top: -40px;
                right: 0;
                color: white;
                font-size: 1.5rem;
                cursor: pointer;
            }
            
            /* Cart sidebar */
            .cart-sidebar {
                position: fixed;
                top: 0;
                right: -400px;
                width: 350px;
                height: 100%;
                background-color: white;
                box-shadow: -2px 0 10px rgba(0, 0, 0, 0.1);
                z-index: 1000;
                transition: right 0.3s ease;
                overflow-y: auto;
            }
            
            .cart-sidebar.active {
                right: 0;
            }
            
            .cart-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 20px;
                border-bottom: 1px solid #eee;
            }
            
            .close-cart {
                cursor: pointer;
                font-size: 1.2rem;
            }
            
            .cart-items {
                padding: 20px;
                max-height: calc(100% - 200px);
                overflow-y: auto;
            }
            
            .cart-item {
                display: flex;
                margin-bottom: 20px;
                padding-bottom: 20px;
                border-bottom: 1px solid #eee;
                position: relative;
            }
            
            .cart-item-image {
                width: 80px;
                height: 80px;
                overflow: hidden;
            }
            
            .cart-item-image img {
                width: 100%;
                height: 100%;
                object-fit: cover;
            }
            
            .cart-item-details {
                flex: 1;
                padding-left: 15px;
            }
            
            .item-quantity {
                display: flex;
                align-items: center;
                margin-top: 10px;
            }
            
            .quantity-btn {
                width: 25px;
                height: 25px;
                border: 1px solid #ddd;
                background: none;
                cursor: pointer;
            }
            
            .item-quantity span {
                padding: 0 10px;
            }
            
            .remove-item {
                position: absolute;
                top: 0;
                right: 0;
                background: none;
                border: none;
                color: #999;
                cursor: pointer;
            }
            
            .cart-total {
                display: flex;
                justify-content: space-between;
                padding: 20px;
                border-top: 1px solid #eee;
                font-weight: bold;
            }
            
            .checkout-btn {
                display: block;
                width: calc(100% - 40px);
                margin: 0 20px 20px;
                padding: 12px;
                background-color: #000;
                color: white;
                border: none;
                cursor: pointer;
                font-weight: bold;
                text-transform: uppercase;
            }
            
            .empty-cart-message {
                text-align: center;
                padding: 20px 0;
                color: #999;
            }
            
            /* Cart count badge */
            .cart-count {
                position: absolute;
                top: -8px;
                right: -8px;
                background-color: #e74c3c;
                color: white;
                width: 18px;
                height: 18px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 0.7rem;
                font-weight: bold;
            }
            
            /* Favorite button */
            .favorite-btn {
                position: absolute;
                top: 10px;
                right: 10px;
                background: white;
                width: 30px;
                height: 30px;
                border-radius: 50%;
                border: none;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                z-index: 1;
            }
            
            /* Quick view */
            .quick-view {
                position: absolute;
                bottom: 10px;
                left: 50%;
                transform: translateX(-50%);
                background-color: white;
                color: black;
                border: none;
                padding: 8px 15px;
                cursor: pointer;
                font-weight: bold;
                opacity: 0;
                transition: opacity 0.3s ease;
            }
            
            .product-image {
                position: relative;
                overflow: hidden;
            }
            
            .product-card:hover .quick-view {
                opacity: 1;
            }
            
            /* Notification */
            .notification-container {
                position: fixed;
                bottom: 20px;
                right: 20px;
                z-index: 1002;
            }
            
            .notification {
                background-color: #2ecc71;
                color: white;
                padding: 12px 20px;
                margin-top: 10px;
                border-radius: 4px;
                box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
                transition: all 0.3s ease;
            }
            
            .notification.error {
                background-color: #e74c3c;
            }
            
            .notification.fade-out {
                opacity: 0;
                transform: translateY(10px);
            }
        `;
        document.head.appendChild(styleElement);
    }
}

// Extended JavaScript for ZYRA Fashion Website - Part 2: Enhanced Features

document.addEventListener('DOMContentLoaded', function() {
    // Initialize enhanced components
    initSaleBanner();
    initNewsletterSubscription();
    initQuickViewModel();
    initProductFilters();
    initImageSlider();
    initResponsiveLayout();
    
    // Add enhanced CSS styles
    addEnhancedStyles();
});

// Quick view modal initialization
function initQuickViewModel() {
    // Create modal if it doesn't exist
    if (!document.querySelector('.quick-view-modal')) {
        const modal = document.createElement('div');
        modal.className = 'quick-view-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <span class="close-modal"><i class="fas fa-times"></i></span>
                <div class="modal-body">
                    <div class="product-image">
                        <img src="" alt="">
                    </div>
                    <div class="product-details">
                        <h2></h2>
                        <div class="price"></div>
                        <div class="product-description">
                            <p>This stylish piece from our latest collection features premium quality fabric for maximum comfort and durability. Perfect for any occasion.</p>
                        </div>
                        <div class="product-sizes">
                            <h4>Select Size:</h4>
                            <div class="size-options">
                                <button class="size-btn">XS</button>
                                <button class="size-btn">S</button>
                                <button class="size-btn">M</button>
                                <button class="size-btn">L</button>
                                <button class="size-btn">XL</button>
                            </div>
                        </div>
                        <div class="product-actions">
                            <div class="quantity-selector">
                                <button class="quantity-btn decrease">-</button>
                                <input type="number" value="1" min="1" class="quantity-input">
                                <button class="quantity-btn increase">+</button>
                            </div>
                            <button class="add-to-cart-modal">
                                <i class="fas fa-shopping-cart"></i> Add to Cart
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
        
        // Set up event listeners
        setupQuickViewEvents();
    }
}

// Set up quick view event listeners
function setupQuickViewEvents() {
    // Size button functionality
    const sizeButtons = document.querySelectorAll('.size-btn');
    sizeButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            sizeButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    // Quantity buttons functionality
    document.querySelector('.quantity-btn.decrease').addEventListener('click', function() {
        const input = document.querySelector('.quantity-input');
        input.value = Math.max(1, parseInt(input.value) - 1);
    });
    
    document.querySelector('.quantity-btn.increase').addEventListener('click', function() {
        const input = document.querySelector('.quantity-input');
        input.value = parseInt(input.value) + 1;
    });
    
    // Add to cart functionality
    document.querySelector('.add-to-cart-modal').addEventListener('click', function() {
        const quantity = parseInt(document.querySelector('.quantity-input').value);
        const selectedSize = document.querySelector('.size-btn.active')?.textContent || 'M';
        const productName = document.querySelector('.modal-body .product-details h2').textContent;
        const productPrice = document.querySelector('.modal-body .price').textContent.replace('Rs. ', '');
        const productImage = document.querySelector('.modal-body .product-image img').src;
        
        addToCart({
            name: productName,
            price: parseInt(productPrice),
            image: productImage,
            quantity: quantity,
            size: selectedSize
        });
        
        showNotification(`${productName} (Size: ${selectedSize}) added to cart!`);
        document.querySelector('.quick-view-modal').style.display = 'none';
    });
    
    // Close modal on click
    document.querySelector('.close-modal').addEventListener('click', function() {
        document.querySelector('.quick-view-modal').style.display = 'none';
    });
    
    // Close modal on outside click
    window.addEventListener('click', function(event) {
        if (event.target === document.querySelector('.quick-view-modal')) {
            document.querySelector('.quick-view-modal').style.display = 'none';
        }
    });
}

// Open quick view modal with product details
function openQuickView(name, price, image) {
    const modal = document.querySelector('.quick-view-modal');
    modal.querySelector('.product-image img').src = image;
    modal.querySelector('.product-image img').alt = name;
    modal.querySelector('.product-details h2').textContent = name;
    modal.querySelector('.price').textContent = price;
    modal.querySelector('.quantity-input').value = 1;
    
    const sizeButtons = modal.querySelectorAll('.size-btn');
    sizeButtons.forEach(btn => btn.classList.remove('active'));
    sizeButtons[2].classList.add('active'); // Default to Medium
    
    modal.style.display = 'block';
}

// Sale banner functionality
function initSaleBanner() {
    const saleBanner = document.querySelector('.sale-banner');
    const shopSaleBtn = document.querySelector('.shop-sale-btn');
    
    if (shopSaleBtn) {
        shopSaleBtn.addEventListener('click', function() {
            // In a real application, this would navigate to the sale page
            alert('Exploring the new season collection...');
        });
    }
    
    // Add animation to sale banner
    if (saleBanner) {
        // Add animation class when banner comes into view
        window.addEventListener('scroll', function() {
            const bannerPosition = saleBanner.getBoundingClientRect().top;
            const screenPosition = window.innerHeight / 1.2;
            
            if (bannerPosition < screenPosition) {
                saleBanner.classList.add('animated');
            }
        });
    }
}

// Newsletter subscription functionality
function initNewsletterSubscription() {
    const subscribeForm = document.querySelector('.subscribe-form');
    const subscribeInput = document.querySelector('.subscribe-input');
    const subscribeBtn = document.querySelector('.subscribe-btn');
    
    if (subscribeBtn) {
        subscribeBtn.addEventListener('click', function() {
            const email = subscribeInput.value.trim();
            
            if (email && isValidEmail(email)) {
                // In a real application, this would submit the email to a backend service
                showNotification('Thank you for subscribing!');
                subscribeInput.value = '';
            } else {
                showNotification('Please enter a valid email address!', 'error');
            }
        });
    }
}

// Helper function to validate email
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Product filters functionality
function initProductFilters() {
    // Create filter section if it doesn't exist
    if (document.querySelector('.featured-section') && !document.querySelector('.product-filters')) {
        const filtersSection = document.createElement('div');
        filtersSection.className = 'product-filters';
        filtersSection.innerHTML = `
            <div class="filter-group">
                <label>Sort By:</label>
                <select class="sort-select">
                    <option value="featured">Featured</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="newest">Newest First</option>
                </select>
            </div>
            <div class="filter-group">
                <label>Filter:</label>
                <div class="filter-tags">
                    <span class="filter-tag" data-filter="all">All</span>
                    <span class="filter-tag" data-filter="new">New Arrivals</span>
                    <span class="filter-tag" data-filter="sale">Sale</span>
                    <span class="filter-tag" data-filter="trending">Trending</span>
                </div>
            </div>
        `;
        
        // Insert before featured products
        const featuredSection = document.querySelector('.featured-section');
        featuredSection.insertBefore(filtersSection, featuredSection.querySelector('.featured-products'));
        
        // Add event listeners to sort and filter
        document.querySelector('.sort-select').addEventListener('change', function() {
            sortProducts(this.value);
        });
        
        document.querySelectorAll('.filter-tag').forEach(tag => {
            tag.addEventListener('click', function() {
                document.querySelectorAll('.filter-tag').forEach(t => t.classList.remove('active'));
                this.classList.add('active');
                filterProducts(this.dataset.filter);
            });
        });
        
        // Activate "All" by default
        document.querySelector('.filter-tag[data-filter="all"]').classList.add('active');
        
        // Add data attributes to products for demo
        const products = document.querySelectorAll('.product-card');
        products.forEach((product, index) => {
            // Demo: Assign random attributes for filtering
            const tags = ['new', 'sale', 'trending'];
            const randomTag = tags[Math.floor(Math.random() * tags.length)];
            product.dataset.tags = `all ${randomTag}`;
            
            // Set price data attribute for sorting
            const price = parseInt(product.querySelector('.price').textContent.replace('Rs. ', ''));
            product.dataset.price = price;
            
            // Set date for "newest" sorting (just for demo)
            const daysAgo = Math.floor(Math.random() * 30);
            product.dataset.date = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000).toISOString();
    });