const searchInput = document.getElementById('searchInput');
const resultsDiv = document.getElementById('results');

let debounceTimeout = null;

searchInput.addEventListener('input', () => {
  clearTimeout(debounceTimeout);
  debounceTimeout = setTimeout(fetchProducts, 300); // 300ms debounce
});

function fetchProducts() {
  const query = searchInput.value.trim().toLowerCase();

  if (!query) {
    resultsDiv.innerHTML = '';
    return;
  }

  fetch('products.json')
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(products => {
      // Filter products based on query
      const matchedProducts = products.filter(product =>
        product.name.toLowerCase().includes(query)
      );

      displayResults(matchedProducts);
    })
    .catch(error => {
      console.error('Fetch error:', error);
      resultsDiv.innerHTML = '<div class="no-results">Error fetching products. Please try again later.</div>';
    });
}

function displayResults(products) {
  if (products.length === 0) {
    resultsDiv.innerHTML = '<div class="no-results">No results found.</div>';
    return;
  }

  resultsDiv.innerHTML = '';
  products.forEach(product => {
    const productDiv = document.createElement('div');
    productDiv.className = 'product';
    productDiv.innerHTML = `
      <strong>${product.name}</strong><br>
      Price: $${product.price.toFixed(2)}<br>
      Category: ${product.category}
    `;
    resultsDiv.appendChild(productDiv);
  });
}