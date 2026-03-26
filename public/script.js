// Simple script for Foodie App

const API_URL = '/api';

// Check if user is logged in
function checkAuth() {
    const user = JSON.parse(localStorage.getItem('user'));
    const token = localStorage.getItem('token');

    if (user && token) {
        if (document.getElementById('login-link')) document.getElementById('login-link').style.display = 'none';
        if (document.getElementById('register-link')) document.getElementById('register-link').style.display = 'none';
        if (document.getElementById('logout-link')) document.getElementById('logout-link').style.display = 'block';
        if (document.getElementById('orders-link')) document.getElementById('orders-link').style.display = 'block';
        
        if (user.role === 'admin' && document.getElementById('admin-controls')) {
            document.getElementById('admin-controls').style.display = 'block';
        }
    }
}

// Logout function
function logout() {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    window.location.href = 'index.html';
}

// Register
if (document.getElementById('register-form')) {
    document.getElementById('register-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = document.getElementById('register-name').value;
        const email = document.getElementById('register-email').value;
        const password = document.getElementById('register-password').value;
        const role = document.getElementById('register-role').value;

        try {
            const res = await fetch(`${API_URL}/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password, role })
            });
            const data = await res.json();
            if (res.ok) {
                alert('Registration successful! Please login.');
                window.location.href = 'login.html';
            } else {
                alert(data.message || 'Registration failed');
            }
        } catch (err) {
            alert('Server error. Is the database connected?');
            console.error(err);
        }
    });
}

// Login
if (document.getElementById('login-form')) {
    document.getElementById('login-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;

        try {
            const res = await fetch(`${API_URL}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            const data = await res.json();
            if (res.ok) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
                window.location.href = 'index.html';
            } else {
                alert(data.message || 'Login failed');
            }
        } catch (err) {
            alert('Server error. Is the database connected?');
            console.error(err);
        }
    });
}

// Load Foods
async function loadFoods() {
    const foodList = document.getElementById('food-list');
    if (!foodList) return;

    foodList.innerHTML = '<p>Loading menu...</p>';

    try {
        const res = await fetch(`${API_URL}/foods`);
        if (!res.ok) throw new Error('Failed to fetch');
        const foods = await res.json();
        if (foods.length === 0) {
            foodList.innerHTML = '<p>No items found in the menu.</p>';
        } else {
            displayFoods(foods);
        }
    } catch (err) {
        foodList.innerHTML = '<p style="color:red;">Error loading menu. Please check your database connection.</p>';
        console.error(err);
    }
}

function displayFoods(foods) {
    const foodList = document.getElementById('food-list');
    foodList.innerHTML = '';
    const user = JSON.parse(localStorage.getItem('user'));

    foods.forEach(food => {
        const card = document.createElement('div');
        card.className = 'food-card';
        card.innerHTML = `
            <img src="${food.image}" alt="${food.name}">
            <h3>${food.name}</h3>
            <p>${food.description}</p>
            <p><strong>$${food.price}</strong></p>
            <button onclick="addToCart('${food._id}', '${food.name}', ${food.price})">Add to Cart</button>
            ${user && user.role === 'admin' ? `
                <div style="margin-top:10px;">
                    <button onclick="editFood('${food._id}')">Edit</button>
                    <button onclick="deleteFood('${food._id}')">Delete</button>
                </div>
            ` : ''}
        `;
        foodList.appendChild(card);
    });
}

// Search Food
function searchFood() {
    const query = document.getElementById('search-input').value.toLowerCase();
    const cards = document.querySelectorAll('.food-card');
    cards.forEach(card => {
        const name = card.querySelector('h3').innerText.toLowerCase();
        if (name.includes(query)) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

// Cart Logic
function addToCart(id, name, price) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existing = cart.find(item => item.foodId === id);
    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({ foodId: id, name, price, quantity: 1 });
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    alert('Added to cart!');
}

function loadCart() {
    if (!document.getElementById('cart-items')) return;
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartItems = document.getElementById('cart-items');
    const cartSummary = document.getElementById('cart-summary');
    const emptyCart = document.getElementById('empty-cart');
    
    if (cart.length === 0) {
        cartItems.innerHTML = '';
        cartSummary.style.display = 'none';
        emptyCart.style.display = 'block';
        return;
    }

    cartItems.innerHTML = '';
    let total = 0;
    cart.forEach((item, index) => {
        total += item.price * item.quantity;
        const div = document.createElement('div');
        div.className = 'cart-item';
        div.innerHTML = `
            <span>${item.name} (x${item.quantity})</span>
            <span>$${item.price * item.quantity}</span>
            <button onclick="removeFromCart(${index})">Remove</button>
        `;
        cartItems.appendChild(div);
    });

    document.getElementById('cart-total').innerText = total;
    cartSummary.style.display = 'block';
    emptyCart.style.display = 'none';
}

function removeFromCart(index) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    loadCart();
}

// Place Order
if (document.getElementById('order-form')) {
    document.getElementById('order-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        if (!token) {
            alert('Please login to place order');
            window.location.href = 'login.html';
            return;
        }

        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const totalAmount = parseFloat(document.getElementById('cart-total').innerText);
        const address = document.getElementById('order-address').value;
        const phone = document.getElementById('order-phone').value;

        try {
            const res = await fetch(`${API_URL}/order`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ items: cart, totalAmount, address, phone })
            });
            if (res.ok) {
                alert('Order placed successfully!');
                localStorage.removeItem('cart');
                window.location.href = 'orders.html';
            } else {
                alert('Failed to place order');
            }
        } catch (err) {
            console.error(err);
        }
    });
}

// Load Orders
async function loadOrders() {
    if (!document.getElementById('orders-list')) return;
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
        const res = await fetch(`${API_URL}/myOrders`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const orders = await res.json();
        const ordersList = document.getElementById('orders-list');
        ordersList.innerHTML = '';

        orders.forEach(order => {
            const div = document.createElement('div');
            div.className = 'order-card';
            div.innerHTML = `
                <p><strong>Order ID:</strong> ${order._id}</p>
                <p><strong>Status:</strong> ${order.status}</p>
                <p><strong>Total:</strong> $${order.totalAmount}</p>
                <p><strong>Date:</strong> ${new Date(order.createdAt).toLocaleDateString()}</p>
                <ul>
                    ${order.items.map(item => `<li>${item.name} x ${item.quantity}</li>`).join('')}
                </ul>
            `;
            ordersList.appendChild(div);
        });
    } catch (err) {
        console.error(err);
    }
}

// Contact Form
if (document.getElementById('contact-form')) {
    document.getElementById('contact-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = document.getElementById('contact-name').value;
        const email = document.getElementById('contact-email').value;
        const message = document.getElementById('contact-message').value;

        try {
            const res = await fetch(`${API_URL}/contact`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, message })
            });
            if (res.ok) {
                alert('Message sent successfully!');
                document.getElementById('contact-form').reset();
            }
        } catch (err) {
            console.error(err);
        }
    });
}

// Admin Food Management
function showAddFoodForm() {
    document.getElementById('food-modal').style.display = 'block';
    document.getElementById('modal-title').innerText = 'Add Food';
    document.getElementById('food-form').reset();
    document.getElementById('food-id').value = '';
}

function closeModal() {
    document.getElementById('food-modal').style.display = 'none';
}

if (document.getElementById('food-form')) {
    document.getElementById('food-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        const id = document.getElementById('food-id').value;
        const name = document.getElementById('food-name').value;
        const description = document.getElementById('food-description').value;
        const price = document.getElementById('food-price').value;
        const image = document.getElementById('food-image').value;
        const category = document.getElementById('food-category').value;

        const url = id ? `${API_URL}/editFood/${id}` : `${API_URL}/addFood`;
        const method = id ? 'PUT' : 'POST';

        try {
            const res = await fetch(url, {
                method: method,
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ name, description, price, image, category })
            });
            if (res.ok) {
                alert('Food saved!');
                closeModal();
                loadFoods();
            } else {
                alert('Error saving food');
            }
        } catch (err) {
            console.error(err);
        }
    });
}

async function editFood(id) {
    // For simplicity, we fetch all foods and find the one to edit
    const res = await fetch(`${API_URL}/foods`);
    const foods = await res.json();
    const food = foods.find(f => f._id === id);
    
    if (food) {
        document.getElementById('food-modal').style.display = 'block';
        document.getElementById('modal-title').innerText = 'Edit Food';
        document.getElementById('food-id').value = food._id;
        document.getElementById('food-name').value = food.name;
        document.getElementById('food-description').value = food.description;
        document.getElementById('food-price').value = food.price;
        document.getElementById('food-image').value = food.image;
        document.getElementById('food-category').value = food.category;
    }
}

async function deleteFood(id) {
    if (!confirm('Are you sure you want to delete this food?')) return;
    const token = localStorage.getItem('token');
    try {
        const res = await fetch(`${API_URL}/deleteFood/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
            alert('Food deleted');
            loadFoods();
        }
    } catch (err) {
        console.error(err);
    }
}

// Initialize
window.onload = () => {
    checkAuth();
    loadFoods();
    loadCart();
    loadOrders();
};
