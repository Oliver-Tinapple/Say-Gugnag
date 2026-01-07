// SHARED DISCOUNT SYSTEM - Same discount across all pages per user
// Stored in localStorage so it persists across page loads

const SALE_PRICE = 25;
const DISCOUNT_KEY = 'gugnag_discount';
const DISCOUNT_TIMESTAMP_KEY = 'gugnag_discount_timestamp';
const DISCOUNT_REFRESH_INTERVAL = 3000; // Change every 3 seconds

// Get or create user's discount
function getDiscount() {
    let discount = localStorage.getItem(DISCOUNT_KEY);
    let timestamp = localStorage.getItem(DISCOUNT_TIMESTAMP_KEY);
    const now = Date.now();

    // If no discount exists, or it's time to refresh, generate a new one
    if (!discount || !timestamp || (now - parseInt(timestamp)) > DISCOUNT_REFRESH_INTERVAL) {
        discount = generateRandomDiscount();
        localStorage.setItem(DISCOUNT_KEY, discount);
        localStorage.setItem(DISCOUNT_TIMESTAMP_KEY, now.toString());
    }

    return parseInt(discount);
}

// Generate random discount between 99% and 999%
function generateRandomDiscount() {
    return Math.floor(Math.random() * 901) + 99;
}

// Calculate original price based on discount
function getOriginalPrice(discountPercent) {
    if (discountPercent < 100) {
        return SALE_PRICE / ((100 - discountPercent) / 100);
    } else {
        // For "impossible" discounts over 100%, just make it funny
        return SALE_PRICE * (discountPercent / 10);
    }
}

// Format price with commas and 2 decimal places
function formatPrice(price) {
    return '$' + price.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2});
}

// Update all discount displays on the page
function updateDiscountDisplays() {
    const discountPercent = getDiscount();
    const originalPrice = getOriginalPrice(discountPercent);

    // Update original price elements
    document.querySelectorAll('.original-price').forEach(el => {
        el.textContent = formatPrice(originalPrice);
    });

    // Update discount badge elements
    document.querySelectorAll('.discount-badge').forEach(el => {
        el.textContent = `${discountPercent}% OFF!!!`;
    });

    // Update sale price elements
    document.querySelectorAll('.sale-price').forEach(el => {
        el.textContent = '$25.00';
    });

    // Also update the main page shop button if it exists
    const shopButton = document.querySelector('a[href="/shop"]');
    if (shopButton && shopButton.textContent.includes('OFF')) {
        shopButton.innerHTML = `🛒 SHOP NOW - ${discountPercent}% OFF!!! 🛒`;
    }
}

// Start the discount rotation
function initDiscountSystem() {
    // Update immediately
    updateDiscountDisplays();

    // Then update every 3 seconds (synced across pages via localStorage)
    setInterval(() => {
        // Clear the timestamp to force a refresh
        localStorage.removeItem(DISCOUNT_TIMESTAMP_KEY);
        updateDiscountDisplays();
    }, DISCOUNT_REFRESH_INTERVAL);
}

// Auto-init when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initDiscountSystem);
} else {
    initDiscountSystem();
}
