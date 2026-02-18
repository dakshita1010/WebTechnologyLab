let inventory = [];

function loadInventory() {
    fetch('inventory.json')
        .then(response => response.json())
        .then(data => {
            inventory = data;
            displayProducts(inventory);
        })
        .catch(error => {
            console.error("Error loading JSON:", error);
        });
}

function displayProducts(products) {
    const table = document.getElementById("inventoryTable");
    table.innerHTML = "";

    let totalValue = 0;

    products.forEach(product => {
        totalValue += product.price * product.stock;

        const row = document.createElement("tr");

        if (product.stock < 5) {
            row.classList.add("low-stock");
        }

        row.innerHTML = `
            <td>${product.id}</td>
            <td>${product.name}</td>
            <td>${product.category}</td>
            <td>₹ ${product.price}</td>
            <td>${product.stock}</td>
            <td>
                <button onclick="editProduct(${product.id})">Edit</button>
                <button onclick="deleteProduct(${product.id})">Delete</button>
            </td>
        `;

        table.appendChild(row);
    });

    document.getElementById("totalValue").innerText = totalValue;
}

function addProduct() {
    const name = document.getElementById("name").value.trim();
    const category = document.getElementById("category").value.trim();
    const price = parseFloat(document.getElementById("price").value);
    const stock = parseInt(document.getElementById("stock").value);

    if (!name || !category || price <= 0 || stock < 0 || isNaN(price) || isNaN(stock)) {
        document.getElementById("error").innerText = "Invalid input! Please enter valid data.";
        return;
    }

    document.getElementById("error").innerText = "";

    const newProduct = {
        id: inventory.length ? inventory[inventory.length - 1].id + 1 : 1,
        name,
        category,
        price,
        stock
    };

    inventory.push(newProduct);
    displayProducts(inventory);
}

function editProduct(id) {
    const product = inventory.find(p => p.id === id);
    const newPrice = prompt("Enter new price:", product.price);
    const newStock = prompt("Enter new stock:", product.stock);

    if (newPrice <= 0 || newStock < 0 || isNaN(newPrice) || isNaN(newStock)) {
        alert("Invalid input!");
        return;
    }

    product.price = parseFloat(newPrice);
    product.stock = parseInt(newStock);

    displayProducts(inventory);
}

function deleteProduct(id) {
    inventory = inventory.filter(product => product.id !== id);
    displayProducts(inventory);
}

function searchByCategory() {
    const category = document.getElementById("searchCategory").value.trim().toLowerCase();
    const filtered = inventory.filter(product =>
        product.category.toLowerCase() === category
    );
    displayProducts(filtered);
}

window.onload = loadInventory;
