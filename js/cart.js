// cart.js

let cart = [];

// Function to add item to cart
function addToCart(item) {
    const existingItem = cart.find(cartItem => cartItem.id === item.id);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...item, quantity: 1 });
    }
    updateCartDisplay();
}

// Function to remove item from cart
function removeFromCart(itemId) {
    cart = cart.filter(cartItem => cartItem.id !== itemId);
    updateCartDisplay();
}

// Function to update item quantity in cart
function updateItemQuantity(itemId, quantity) {
    const cartItem = cart.find(cartItem => cartItem.id === itemId);
    if (cartItem) {
        cartItem.quantity = quantity;
        if (cartItem.quantity <= 0) {
            removeFromCart(itemId);
        }
    }
    updateCartDisplay();
}

// Function to calculate total price
function calculateTotal() {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}

// Function to update cart display
function updateCartDisplay() {
    const cartContainer = document.getElementById('cart-container');
    cartContainer.innerHTML = ''; // Clear current cart display
    cart.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.innerHTML = `
            <p>${item.name} - $${item.price} x ${item.quantity}</p>
            <button onclick="removeFromCart(${item.id})">Remove</button>
        `;
        cartContainer.appendChild(itemElement);
    });
    const totalElement = document.createElement('div');
    totalElement.innerHTML = `<strong>Total: $${calculateTotal()}</strong>`;
    cartContainer.appendChild(totalElement);
}

// Function to clear the cart
function clearCart() {
    cart = [];
    updateCartDisplay();
}