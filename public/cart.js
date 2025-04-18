document.addEventListener('DOMContentLoaded', function () {
    const addCartBtn = document.querySelector('.add-cart-btn'); // Ensure this matches your product page button
    const cartPopup = document.getElementById('cart-popup'); // Popup for "Item added to cart"
    const cartWithItems = document.getElementById('cart-with-items');
    const emptyCart = document.getElementById('empty-cart');
    const minusButton = document.getElementById('quantity-minus');
    const plusButton = document.getElementById('quantity-plus');
    const quantityInput = document.querySelector('.quantity-input');

    if (minusButton && plusButton && quantityInput) {
        minusButton.addEventListener('click', () => {
            let value = parseInt(quantityInput.value);
            if (isNaN(value)) value = 1;
            if (value > 1) quantityInput.value = value - 1;
        });

        plusButton.addEventListener('click', () => {
            let value = parseInt(quantityInput.value);
            if (isNaN(value)) value = 1;
            quantityInput.value = value + 1;
        });
    } else {
        console.warn('Quantity buttons or input not found');
    }
});

// ✅ Size selection logic
const sizeBoxes = document.querySelectorAll('.size-box');
sizeBoxes.forEach(box => {
    box.addEventListener('click', function () {
        sizeBoxes.forEach(b => b.classList.remove('selected'));
        this.classList.add('selected');
    });
});

// ✅ Render cart if needed
renderCartItems();

// Render cart items on the cart page
renderCartItems();

if (addCartBtn) {

    addCartBtn.addEventListener('click', function () {
        const productName = document.querySelector('.product-title')?.textContent || '';
        const productPrice = parseFloat(document.querySelector('.product-price')?.textContent.replace('Rs. ', '')) || 0;
        const productImage = document.querySelector('.product-video')?.getAttribute('src') || '';
        const selectedSize = document.querySelector('.size-box.selected');
        const quantity = parseInt(quantityInput?.value || '1');

        // Debugging: Log the values
        console.log('Product Name:', productName);
        console.log('Product Price:', productPrice);
        console.log('Product Image:', productImage);
        console.log('Selected Size:', selectedSize?.textContent);
        console.log('Quantity:', quantity);

        // Validate required fields
        if (!productName || productPrice <= 0 || !selectedSize) {
            alert('Please select a valid product, size, and quantity before adding to the cart!');
            return;
        }

        // Retrieve the cart from localStorage or initialize an empty array
        let cart = JSON.parse(localStorage.getItem('cart')) || [];

        // Check if the product with the same size already exists
        const existingItemIndex = cart.findIndex(item => item.name === productName && item.size === selectedSize.textContent);
        if (existingItemIndex !== -1) {
            // Update the quantity of the existing item
            cart[existingItemIndex].quantity += quantity;
        } else {
            // Add the product to the cart
            cart.push({
                name: productName,
                price: productPrice, // Store price as a number
                image: productImage,
                size: selectedSize.textContent,
                quantity: quantity,
            });
        }

        // Save the updated cart back to localStorage
        localStorage.setItem('cart', JSON.stringify(cart));

        // Debugging: Log the updated cart
        console.log('Updated Cart:', cart);

        // Show the popup
        if (cartPopup) {
            cartPopup.style.display = 'block';
            setTimeout(() => cartPopup.style.display = 'none', 2300);
        }

        updateCartTotals(); // Call this if you want to update totals dynamically
    });
}

function addToCart(id, name, price, size, quantity) {
    let cart = JSON.parse(localStorage.getItem('zyraCart')) || [];

    // Get the product image URL
    const productImage = document.querySelector('.product-image')?.src || '';

    // Check if the product with the same size already exists in the cart
    const index = cart.findIndex(item => item.id === id && item.size === size);
    if (index !== -1) {
        // Update the quantity of the existing item
        cart[index].quantity += quantity;
    } else {
        // Add the new product to the cart
        cart.push({ id, name, price, size, quantity, image: productImage });
    }

    // Save the updated cart back to localStorage
    localStorage.setItem('zyraCart', JSON.stringify(cart));
}

function updateCartItemQuantity(itemName, newQuantity) {
    let cart = JSON.parse(localStorage.getItem('zyraCart')) || []; // Use 'zyraCart'

    // Find the item and update its quantity
    cart = cart.map(item => {
        if (item.name === itemName) {
            item.quantity = newQuantity;
        }
        return item;
    });

    // Save the updated cart back to localStorage
    localStorage.setItem('zyraCart', JSON.stringify(cart));
}

function updateCartTotals() {
    let subtotal = 0;

    // Retrieve cart items from localStorage
    const cart = JSON.parse(localStorage.getItem('zyraCart')) || []; // Use 'zyraCart'

    // Calculate subtotal
    cart.forEach(item => {
        const price = parseFloat(item.price); // Ensure price is a number
        const quantity = parseInt(item.quantity); // Ensure quantity is a number
        if (!isNaN(price) && !isNaN(quantity)) {
            subtotal += price * quantity;
        }
    });

    // Calculate shipping, tax, and total
    const shipping = subtotal > 0 ? 99 : 0; // Example: Rs. 99 shipping for non-empty cart
    const tax = Math.round(subtotal * 0.08); // Example: 8% tax
    const total = subtotal + shipping + tax;

    // Update summary section
    document.getElementById('subtotal').textContent = `Rs. ${subtotal}`;
    document.getElementById('shipping').textContent = `Rs. ${shipping}`;
    document.getElementById('tax').textContent = `Rs. ${tax}`;
    document.getElementById('total').textContent = `Rs. ${total}`;
}

function renderCartItems() {
    const cartItemsContainer = document.querySelector('.cart-items');
    const cartWithItems = document.getElementById('cart-with-items');
    const emptyCart = document.getElementById('empty-cart');

    // Ensure the required elements exist
    if (!cartWithItems || !emptyCart || !cartItemsContainer) {
        console.error('Required elements for rendering the cart are missing.');
        return;
    }

    // Retrieve cart items from localStorage
    const cart = JSON.parse(localStorage.getItem('zyraCart')) || []; // Use 'zyraCart'

    if (cart.length === 0) {
        // Show the "empty cart" message and hide the cart items container
        cartWithItems.style.display = 'none';
        emptyCart.style.display = 'block';
    } else {
        // Show the cart items container and hide the "empty cart" message
        cartWithItems.style.display = 'block';
        emptyCart.style.display = 'none';

        // Clear existing items in the container
        cartItemsContainer.innerHTML = '';

        // Render each item in the cart
        cart.forEach(item => {
            const cartItem = document.createElement('div');
            cartItem.classList.add('cart-item');
            cartItem.innerHTML = `
                <img src="${item.image}" alt="${item.name}" class="item-image">
                <div class="item-details">
                    <h3 class="item-name">${item.name}</h3>
                    <p class="item-price">Rs. ${item.price}</p>
                    <p class="item-size">Size: ${item.size}</p>
                    <div class="quantity-controls">
                        <button class="quantity-btn minus">-</button>
                        <input type="number" class="quantity-input" value="${item.quantity}" min="1" max="10">
                        <button class="quantity-btn plus">+</button>
                    </div>
                    <button class="remove-item">Remove</button>
                </div>
            `;
            cartItemsContainer.appendChild(cartItem);
        });

        // Add functionality for quantity controls and item removal
        setupCartFunctionality();
    }
}

function setupCartFunctionality() {
    const minusButtons = document.querySelectorAll('.minus');
    const plusButtons = document.querySelectorAll('.plus');
    const removeButtons = document.querySelectorAll('.remove-item');

    // Handle quantity decrease
    minusButtons.forEach(button => {
        button.addEventListener('click', function () {
            const input = this.nextElementSibling;
            let value = parseInt(input.value);
            if (value > 1) {
                input.value = value - 1;

                // Update localStorage
                const itemName = this.closest('.cart-item').querySelector('.item-name').textContent;
                updateCartItemQuantity(itemName, parseInt(input.value));

                updateCartTotals();
            }
        });
    });

    // Handle quantity increase
    plusButtons.forEach(button => {
        button.addEventListener('click', function () {
            const input = this.previousElementSibling;
            let value = parseInt(input.value);
            if (value < 10) {
                input.value = value + 1;

                // Update localStorage
                const itemName = this.closest('.cart-item').querySelector('.item-name').textContent;
                updateCartItemQuantity(itemName, parseInt(input.value));

                updateCartTotals();
            }
        });
    });

    // Handle item removal
    removeButtons.forEach(button => {
        button.addEventListener('click', function () {
            const cartItem = this.closest('.cart-item');
            const itemName = cartItem.querySelector('.item-name').textContent;

            // Remove item from localStorage
            let cart = JSON.parse(localStorage.getItem('zyraCart')) || []; // Use 'zyraCart'
            cart = cart.filter(item => item.name !== itemName);
            localStorage.setItem('zyraCart', JSON.stringify(cart));

            // Remove item from DOM
            cartItem.remove();

            // Check if cart is empty
            const remainingItems = document.querySelectorAll('.cart-item');
            if (remainingItems.length === 0) {
                document.getElementById('cart-with-items').style.display = 'none';
                document.getElementById('empty-cart').style.display = 'block';
            }

            updateCartTotals();
        });
    });

    updateCartTotals();
}