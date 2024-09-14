// Función de búsqueda de productos
function searchProducts() {
  const query = document.getElementById('search').value;
  window.location.href = `/results.html?search=${encodeURIComponent(query)}`;
}

// Función para obtener productos (limitado a 4)
async function fetchProducts() {
  try {
    const response = await fetch('http://localhost:3001/api/products');
    const products = await response.json();
    const productsGrid = document.getElementById('products-grid');

    if (!productsGrid) {
      console.error('El elemento "products-grid" no existe en el DOM.');
      return;
    }

    productsGrid.innerHTML = '';  // Limpiar el contenedor
    const limitedProducts = products.slice(0, 4);  // Limitar a 4 productos

    limitedProducts.forEach(product => {
      const productHTML = `
        <div class="feature-item">
          <img src="${product.thumbnail}" alt="${product.title}">
          <h4>${product.title}</h4>
          <p>${product.description}</p>
          <p><strong>Precio:</strong> $${product.price}</p>
          <p><strong>Stock:</strong> ${product.stock}</p>
          <a href="/detail.html?id=${product._id}" class="product-link">Ver detalle</a>
          <button onclick="addToCart('${product._id}')">Agregar al carrito</button>
        </div>
      `;
      productsGrid.innerHTML += productHTML;
    });
  } catch (error) {
    console.error('Error al obtener los productos:', error);
  }
}

// Función para agregar al carrito
function addToCart(productId) {
  // Obtener el carrito del localStorage (si no existe, crear un array vacío)
  let cart = JSON.parse(localStorage.getItem('cart')) || [];

  // Buscar si el producto ya está en el carrito
  const productIndex = cart.findIndex(item => item._id === productId);

  if (productIndex !== -1) {
    // Si el producto ya está en el carrito, aumentar la cantidad
    cart[productIndex].quantity += 1;
    localStorage.setItem('cart', JSON.stringify(cart));
    displayCartMessage(`La cantidad de ${cart[productIndex].title} ha sido actualizada.`);
  } else {
    // Si el producto no está en el carrito, buscarlo en la API y agregarlo al carrito
    fetch(`/api/items/${productId}`)
      .then(response => response.json())
      .then(product => {
        cart.push({ _id: product._id, title: product.title, price: product.price, quantity: 1 });
        localStorage.setItem('cart', JSON.stringify(cart));
        displayCartMessage(`${product.title} ha sido agregado al carrito.`);
      })
      .catch(error => {
        console.error('Error al agregar producto al carrito:', error);
      });
  }
}

// Mensaje cuando se agrega al carrito
function displayCartMessage(message) {
  const messageDiv = document.createElement('div');
  messageDiv.className = 'cart-message';
  messageDiv.innerText = message;
  document.body.appendChild(messageDiv);
  setTimeout(() => messageDiv.remove(), 3000);
}

// Cargar productos cuando la página cargue
window.onload = fetchProducts;
