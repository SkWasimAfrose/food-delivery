// This file manages order-related functions, such as viewing order history and status updates.

document.addEventListener('DOMContentLoaded', function() {
    const userId = getCurrentUserId(); // Function to get the current user's ID
    const ordersContainer = document.getElementById('orders-container');

    // Fetch and display user's order history
    function fetchOrderHistory() {
        const ordersRef = firebase.firestore().collection('orders');
        ordersRef.where('userId', '==', userId).get().then(snapshot => {
            snapshot.forEach(doc => {
                const order = doc.data();
                displayOrder(order);
            });
        }).catch(error => {
            console.error("Error fetching order history: ", error);
        });
    }

    // Display a single order
    function displayOrder(order) {
        const orderElement = document.createElement('div');
        orderElement.classList.add('order');
        orderElement.innerHTML = `
            <h3>Order ID: ${order.id}</h3>
            <p>Total Amount: $${order.totalAmount}</p>
            <p>Status: ${order.status}</p>
            <p>Delivery Address: ${order.deliveryAddress}</p>
            <p>Order Date: ${new Date(order.orderDate).toLocaleDateString()}</p>
        `;
        ordersContainer.appendChild(orderElement);
    }

    // Initialize order history fetch
    fetchOrderHistory();
});