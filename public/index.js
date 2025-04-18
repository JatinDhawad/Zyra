// Wait till the page is fully loaded
document.addEventListener("DOMContentLoaded", function () {
    // Handle Add to Cart functionality
    const addToCartButtons = document.querySelectorAll(".product-card button");

    addToCartButtons.forEach((button) => {
        button.addEventListener("click", function () {
            const productCard = this.parentElement;
            const productName = productCard.querySelector("h3").innerText;
            const productPrice = productCard.querySelector("p").innerText;

            // Add item to localStorage cart
            let cart = JSON.parse(localStorage.getItem("cart")) || [];
            cart.push({
                name: productName,
                price: productPrice,
            });
            localStorage.setItem("cart", JSON.stringify(cart));

            // Alert user
            alert(`${productName} has been added to your cart!`);
        });
    });

    // Handle cart popup
    document.querySelectorAll(".fa-shopping-cart").forEach((cartBtn) => {
        cartBtn.addEventListener("click", function () {
            const popup = document.getElementById("cart-popup");
            popup.style.display = "block";

            setTimeout(() => {
                popup.style.display = "none";
            }, 2000);
        });
    });
});

addToCartButtons.forEach((button) => {
    button.addEventListener("click", function () {
        const productCard = this.parentElement;
        const productName = productCard.querySelector("h3").innerText;
        const productPrice = productCard.querySelector("p").innerText;
        const productImage = productCard.querySelector("img").src;

        // Add item to localStorage cart
        let cart = JSON.parse(localStorage.getItem("cart")) || [];
        cart.push({
            name: productName,
            price: productPrice,
            image: productImage,
        });
        localStorage.setItem("cart", JSON.stringify(cart));

        alert(`${productName} has been added to your cart!`);
    });
});