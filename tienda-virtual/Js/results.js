// Función para cargar resultados de búsqueda al cargar la página
async function loadResults() {
  const urlParams = new URLSearchParams(window.location.search);
  const query = urlParams.get('search');
  const response = await fetch(`/api/items?q=${query}`);
  const products = await response.json();
  const resultsDiv = document.getElementById('results-grid');

  // Agrupar productos por categoría
  const productsByCategory = products.reduce((acc, product) => {
    if (!acc[product.category]) {
      acc[product.category] = [];
    }
    acc[product.category].push(product);
    return acc;
  }, {});

  // Generar HTML para cada categoría y sus productos
  resultsDiv.innerHTML = Object.keys(productsByCategory).map(category => `
    <div class="category-section">
      <h3 class="category-title">${category}</h3>
      <div class="category-grid">
        ${productsByCategory[category].map(product => `
          <div class="product-card">
            <img src="${product.thumbnail}" alt="${product.title}" class="product-image">
            <h2 class="product-title">${product.title}</h2>
            <p class="product-description">${product.description}</p>
            <p class="product-price">Precio: $${product.price}</p>
            <a href="/detail.html?id=${product._id}" class="product-link">Ver detalle</a>
          </div>
        `).join('')}
      </div>
    </div>
  `).join('');
}

// Función para realizar la búsqueda
function searchProducts() {
  const query = document.getElementById('search').value;
  window.location.href = `/results.html?search=${query}`;
}

// Cargar los resultados cuando la página se cargue
window.onload = loadResults;
