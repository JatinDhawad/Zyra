// DOM Elements
const productContainer = document.querySelector('.product-container');
const loadingSpinner = document.getElementById('loading-spinner');

// Wait for DOM to load
document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = parseInt(urlParams.get('id'));

    if (productId && productContainer) {
        showLoadingSpinner();
        fetchProductData(productId);
    } else {
        productContainer.innerHTML = '<p class="error-message">Invalid product ID.</p>';
    }
});

// Show spinner
function showLoadingSpinner() {
    if (loadingSpinner) loadingSpinner.style.display = 'block';
}

// Hide spinner
function hideLoadingSpinner() {
    if (loadingSpinner) loadingSpinner.style.display = 'none';
}

// Fetch product JSON and match by ID
function fetchProductData(productId) {
    fetch('products.json')
        .then(res => {
            if (!res.ok) throw new Error('Failed to fetch product data.');
            return res.json();
        })
        .then(products => {
            const product = products.find(p => p.id === productId);
            product ? populateProductPage(product) : showError('Product not found.');
        })
        .catch(err => {
            console.error('Error:', err);
            showError('Failed to load product data.');
        })
        .finally(hideLoadingSpinner);
}

// Display error message
function showError(message) {
    productContainer.innerHTML = `
        <p class="error-message">${message}</p>
        <a href="index.html" class="back-link">Go back to the homepage</a>
    `;
}

// Populate product details dynamically
function populateProductPage(product) {
    document.title = `${product.name} - ZYRA`;

    document.querySelector('.product-title').textContent = product.name;
    document.querySelector('.product-price').textContent = `₹${product.price}`;

    // Image or video
    const media = document.querySelector('.product-gallery');
    media.innerHTML = product.videoUrl
        ? `<video class="product-video" src="${product.videoUrl}" autoplay loop muted playsinline></video>`
        : `<img src="${product.image}" alt="${product.name}" class="product-image">`;

    // Description + Features
    document.querySelector('.product-description').innerHTML = `
        <p>${product.description}</p>
        <p><strong>Features:</strong></p>
        <ul>${product.features.map(f => `<li>${f}</li>`).join('')}</ul>
    `;

    // Sizes
    const sizeGrid = document.querySelector('.size-grid');
    sizeGrid.innerHTML = '';
    product.sizes.forEach(size => {
        const box = document.createElement('div');
        box.className = 'size-box';
        box.textContent = size;
        box.addEventListener('click', () => {
            document.querySelectorAll('.size-box').forEach(b => b.classList.remove('selected'));
            box.classList.add('selected');
        });
        sizeGrid.appendChild(box);
    });

    // Reviews
    const reviews = document.querySelector('.reviews-section');
    reviews.innerHTML = product.reviews?.length
        ? `<h2 class="reviews-title">Customer Reviews</h2>` +
          product.reviews.map(r => `
            <div class="review">
                <div class="review-header">
                    <span class="reviewer-name">${r.name}</span>
                    <span class="review-date">${r.date}</span>
                </div>
                <div class="review-rating">${'★'.repeat(r.rating)}${'☆'.repeat(5 - r.rating)}</div>
                <p class="review-content">${r.comment}</p>
            </div>`).join('')
        : '<p>No reviews yet.</p>';

    // Add to Cart Logic
    const addBtn = document.querySelector('.add-cart-btn');
    if (addBtn) {
        addBtn.addEventListener('click', () => {
            const selectedSize = document.querySelector('.size-box.selected');
            const quantity = parseInt(document.querySelector('.quantity-input').value);

            if (!selectedSize) {
                alert('Please select a size.');
                return;
            }

            if (isNaN(quantity) || quantity < 1 || quantity > 10) {
                alert('Please enter a valid quantity (1–10).');
                return;
            }

            addToCart(product.id, product.name, product.price, selectedSize.textContent, quantity);
            showCartPopup();
        });
    }

    // Quantity Setup
    setupQuantityControls();
}

// Quantity button logic
function setupQuantityControls() {
    const qtyInput = document.querySelector('.quantity-input');
    const minusButton = document.querySelector('.quantity-btn.minus');
    const plusButton = document.querySelector('.quantity-btn.plus');

    if (qtyInput && minusButton && plusButton) {
        // Remove existing event listeners by replacing the input element
        const newQtyInput = qtyInput.cloneNode(true);
        qtyInput.parentNode.replaceChild(newQtyInput, qtyInput);

        // Decrease quantity
        minusButton.addEventListener('click', () => {
            let value = parseInt(newQtyInput.value) || 1; // Default to 1 if value is invalid
            if (value > 1) {
                newQtyInput.value = value - 1;
            }
        });

        // Increase quantity
        plusButton.addEventListener('click', () => {
            let value = parseInt(newQtyInput.value) || 1; // Default to 1 if value is invalid
            newQtyInput.value = value + 1;
        });

        // Validate input on manual entry
        newQtyInput.addEventListener('input', () => {
            let value = parseInt(newQtyInput.value);
            if (isNaN(value) || value < 1) {
                newQtyInput.value = 1; // Set to minimum value if invalid
            } else if (value > 10) {
                newQtyInput.value = 10; // Set to maximum value if invalid
            }
        });
    }
}

// Store in localStorage
function addToCart(id, name, price, size, quantity) {
    let cart = JSON.parse(localStorage.getItem('zyraCart')) || [];

    const productImage = document.querySelector('.product-image')?.src || ''; // Get the product image URL

    const index = cart.findIndex(item => item.id === id && item.size === size);
    if (index !== -1) {
        cart[index].quantity += quantity;
    } else {
        cart.push({ id, name, price, size, quantity, image: productImage });
    }

    localStorage.setItem('zyraCart', JSON.stringify(cart));
}

// Popup after adding to cart
function showCartPopup() {
    const popup = document.getElementById('cart-popup');
    if (popup) {
        popup.style.display = 'block';
        setTimeout(() => popup.style.display = 'none', 2000);
    }
}