(function() {
    const styles = `
        body { font-family: system-ui, sans-serif; background: #f4f4f9; padding: 20px; display: flex; gap: 20px; }
        .container { background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); flex: 1; }
        .product-item { display: flex; justify-content: space-between; align-items: center; padding: 10px; border-bottom: 1px solid #eee; }
        .cart-item { display: flex; justify-content: space-between; margin-bottom: 10px; background: #fafafa; padding: 10px; border-radius: 4px; }
        .btn { cursor: pointer; padding: 5px 10px; border: none; border-radius: 4px; transition: 0.2s; }
        .btn-add { background: #28a745; color: white; }
        .btn-remove { background: #dc3545; color: white; }
        .discount-badge { font-size: 0.8em; color: #e67e22; font-weight: bold; }
        #coupon-input { padding: 8px; width: 60%; margin-top: 10px; }
        .summary { margin-top: 20px; border-top: 2px solid #333; pt: 10px; }
    `;

    const styleSheet = document.createElement("style");
    styleSheet.innerText = styles;
    document.head.appendChild(styleSheet);

    const products = [
        { id: 1, name: "Laptop", price: 1000, category: "Tech" },
        { id: 2, name: "Headphones", price: 200, category: "Tech" },
        { id: 3, name: "Coffee Mug", price: 15, category: "Home" },
        { id: 4, name: "Desk Lamp", price: 45, category: "Home" }
    ];

    let cart = [];
    let appliedCoupon = null;

    const app = document.createElement("div");
    app.style.display = "flex";
    app.style.width = "100%";
    app.innerHTML = `
        <div class="container">
            <h2>Products</h2>
            <div id="product-list"></div>
        </div>
        <div class="container">
            <h2>Shopping Cart</h2>
            <div id="cart-list"></div>
            <input type="text" id="coupon-input" placeholder="Enter Coupon (e.g., SAVE10)">
            <button class="btn btn-add" onclick="applyCoupon()">Apply</button>
            <div id="cart-summary" class="summary"></div>
        </div>
    `;
    document.body.appendChild(app);

    window.addToCart = (productId) => {
        const product = products.find(p => p.id === productId);
        const cartItem = cart.find(item => item.id === productId);

        if (cartItem) {
            cartItem.quantity++;
        } else {
            cart.push({ ...product, quantity: 1 });
        }
        render();
    };

    window.removeFromCart = (productId) => {
        cart = cart.filter(item => item.id !== productId);
        render();
    };

    window.updateQty = (productId, delta) => {
        const item = cart.find(i => i.id === productId);
        if (item) {
            item.quantity += delta;
            if (item.quantity <= 0) return removeFromCart(productId);
        }
        render();
    };

    window.applyCoupon = () => {
        const code = document.getElementById('coupon-input').value.trim().toUpperCase();
        if (code.startsWith("SAVE") && !isNaN(code.substring(4))) {
            appliedCoupon = parseInt(code.substring(4));
            alert(`Coupon Applied: ${appliedCoupon}% off!`);
        } else {
            alert("Invalid Coupon Format (Try: SAVE10)");
            appliedCoupon = null;
        }
        render();
    };

    function calculateTotals() {
        let subtotal = 0;
        let discounts = 0;

        cart.forEach(item => {
            let itemTotal = item.price * item.quantity;
            subtotal += itemTotal;

            if (item.quantity >= 3) {
                discounts += itemTotal * 0.10; 
            }

            if (item.category === "Tech" && itemTotal > 500) {
                discounts += itemTotal * 0.05;
            }
        });

        const hour = new Date().getHours();
        if (hour >= 17 && hour <= 21) {
            discounts += (subtotal - discounts) * 0.05; 
        }

        if (appliedCoupon) {
            discounts += (subtotal - discounts) * (appliedCoupon / 100);
        }

        return { subtotal, discounts, total: subtotal - discounts };
    }

    function render() {
        const productList = document.getElementById('product-list');
        productList.innerHTML = products.map(p => `
            <div class="product-item">
                <span>${p.name} - $${p.price} (${p.category})</span>
                <button class="btn btn-add" onclick="addToCart(${p.id})">Add</button>
            </div>
        `).join('');

        const cartList = document.getElementById('cart-list');
        if (cart.length === 0) {
            cartList.innerHTML = "<p>Cart is empty</p>";
        } else {
            cartList.innerHTML = cart.map(item => `
                <div class="cart-item">
                    <div>
                        <strong>${item.name}</strong><br>
                        $${item.price} x ${item.quantity}
                        ${item.quantity >= 3 ? '<br><span class="discount-badge">Bulk 10% applied</span>' : ''}
                    </div>
                    <div>
                        <button class="btn" onclick="updateQty(${item.id}, -1)">-</button>
                        <button class="btn" onclick="updateQty(${item.id}, 1)">+</button>
                        <button class="btn btn-remove" onclick="removeFromCart(${item.id})">Delete</button>
                    </div>
                </div>
            `).join('');
        }

        const totals = calculateTotals();
        const summary = document.getElementById('cart-summary');
        summary.innerHTML = `
            <p>Subtotal: $${totals.subtotal.toFixed(2)}</p>
            <p style="color: red;">Total Savings: -$${totals.discounts.toFixed(2)}</p>
            <h3>Final Total: $${totals.total.toFixed(2)}</h3>
            <small>*Happy Hour 5% applies automatically (5 PM - 9 PM)</small>
        `;
    }

    render();
})();