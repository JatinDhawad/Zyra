// JavaScript for Kids Collection Page
document.addEventListener('DOMContentLoaded', function() {
    // Add to cart animation
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Animation effect
            this.innerHTML = '<i class="fas fa-check"></i> Added';
            this.style.backgroundColor = '#4caf50';
            
            // Reset after 2 seconds
            setTimeout(() => {
                this.innerHTML = '<i class="fas fa-shopping-cart"></i> Add to Cart';
                this.style.backgroundColor = '#8a2be2';
            }, 2000);
        });
    });

    // Shop now button hover effect with playful animation
    const shopButtons = document.querySelectorAll('.shop-btn');
    shopButtons.forEach(button => {
        button.addEventListener('mouseover', function() {
            this.parentElement.parentElement.previousElementSibling.querySelector('img').style.transform = 'scale(1.1)';
        });
        
        button.addEventListener('mouseout', function() {
            this.parentElement.parentElement.previousElementSibling.querySelector('img').style.transform = 'scale(1)';
        });
    });

    // Main navigation active state
    const navItems = document.querySelectorAll('.main-nav ul li');
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            navItems.forEach(nav => nav.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // Smooth scroll for featured products
    document.querySelector('.featured-products').addEventListener('wheel', function(e) {
        if (e.deltaY !== 0) {
            e.preventDefault();
            this.scrollLeft += e.deltaY;
        }
    }, { passive: false });

    // Age group hover animations
    const ageGroups = document.querySelectorAll('.age-group');
    ageGroups.forEach(group => {
        group.addEventListener('mouseover', function() {
            this.querySelector('.age-image').style.borderColor = '#8a2be2';
        });
        
        group.addEventListener('mouseout', function() {
            this.querySelector('.age-image').style.borderColor = '#ff4081';
        });
    });

    // Fun zone button effect
    const funBtn = document.querySelector('.fun-btn');
    if (funBtn) {
        funBtn.addEventListener('click', function() {
            // Create confetti effect
            createConfetti();
            
            // Show a fun message
            alert('Fun games are coming soon! 🎮 🎯 🎪');
        });
    }

    // Confetti animation function
    function createConfetti() {
        const confettiCount = 100;
        const container = document.querySelector('.fun-section');
        
        for (let i = 0; i < confettiCount; i++) {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            
            // Random position, color, and animation duration
            const colors = ['#ff4081', '#8a2be2', '#ffc107', '#4caf50', '#00bcd4'];
            const size = Math.random() * 10 + 5;
            
            confetti.style.width = `${size}px`;
            confetti.style.height = `${size}px`;
            confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.left = `${Math.random() * 100}%`;
            confetti.style.top = '0';
            confetti.style.position = 'absolute';
            confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
            confetti.style.zIndex = '5';
            
            // Animation
            confetti.style.animation = `confettiFall ${Math.random() * 3 + 2}s linear forwards`;
            
            container.appendChild(confetti);
            
            // Remove confetti after animation
            setTimeout(() => {
                confetti.remove();
            }, 5000);
        }
    }
    
    // Add the confetti keyframes to the document
    const style = document.createElement('style');
    style.innerHTML = `
        @keyframes confettiFall {
            0% {
                transform: translateY(0) rotate(0deg);
                opacity: 1;
            }
            100% {
                transform: translateY(500px) rotate(360deg);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
    
    // Animate floating elements
    animateFloatingElements();
    
    function animateFloatingElements() {
        const floatItems = document.querySelectorAll('.float-item');
        
        floatItems.forEach(item => {
            // Set random initial positions for each item
            const randomX = Math.random() * 80 + 10; // 10% to 90% of container width
            const randomY = Math.random() * 80 + 10; // 10% to 90% of container height
            
            item.style.left = `${randomX}%`;
            item.style.top = `${randomY}%`;
        });
    }
    
    // Sale banner balloon animation
    const balloons = document.querySelectorAll('.balloon-decoration');
    balloons.forEach(balloon => {
        // Add slight floating animation
        balloon.style.animation = `float ${Math.random() * 2 + 3}s ease-in-out infinite`;
    });
});