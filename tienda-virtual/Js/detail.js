async function loadProductDetail() {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');
    const response = await fetch(`/api/items/${productId}`);
    const product = await response.json();
    const productDetailDiv = document.getElementById('product-detail');

    const productUrl = window.location.href;


    // Mostrar los detalles del producto
    productDetailDiv.innerHTML = `
      <div class="product-card">
        <div class="product-image-container">
          <img src="${product.thumbnail}" alt="${product.title}" class="product-image">
        </div>
        <div class="product-info">
          <h2 class="product-title">${product.title}</h2>
          <p class="product-description">${product.description}</p>
          <p class="product-price">Precio: $${product.price}</p>
          <p class="product-stock">Stock disponible: ${product.stock}</p>
          <div class="product-rating">
            <span>Calificación:</span>
            ${generateStars(product.rating)}
            <span id="average-rating">${product.rating}</span>
          </div>
          <div class="product-images">
            ${product.images.map(img => `<img src="${img}" alt="${product.title}" class="product-image-thumb">`).join('')}
          </div>
          <button class="add-to-cart-button" onclick="addToCart('${product._id}')">Agregar al carrito</button>
          <button class= "view-cart" onclick="viewCart()">Ver carrito</button>
        </div>
      </div>
    `;

    // Funcionalidad para compartir
    const shareData = {
      title: product.title,
      text: product.description,
      url: productUrl
    };

    const shareButton = document.getElementById('shareButton');
    shareButton.addEventListener('click', async () => {
      if (navigator.share) {
        try {
          await navigator.share(shareData);
          console.log('Producto compartido correctamente');
        } catch (err) {
          console.error('Error al compartir:', err);
        }
      } else {
        alert('La funcionalidad de compartir no está soportada en este navegador.');
      }
    });

    // Compartir en redes sociales
    document.getElementById('shareFacebook').href = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(productUrl)}`;
    document.getElementById('shareTwitter').href = `https://twitter.com/share?url=${encodeURIComponent(productUrl)}&text=${encodeURIComponent(product.title)}`;
    document.getElementById('shareWhatsapp').href = `https://api.whatsapp.com/send?text=${encodeURIComponent(product.title + " - " + productUrl)}`;
  }

  window.onload = loadProductDetail;




  function viewCart() {
    window.location.href = '/cart.html';
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

function generateStars(rating) {
    let stars = '';
    for (let i = 0; i < 5; i++) {
      if (rating >= i + 1) {
        stars += '<i class="fas fa-star"></i>';
      } else if (rating > i && rating < i + 1) {
        stars += '<i class="fas fa-star-half-alt"></i>';
      } else {
        stars += '<i class="far fa-star"></i>';
      }
    }
    return stars;
  }



  // Mensaje cuando se agrega al carrito
  function displayCartMessage(message) {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'cart-message';
    messageDiv.innerText = message;
    document.body.appendChild(messageDiv);
    setTimeout(() => messageDiv.remove(), 3000);
  }


    // Eliminar el mensaje después de 3 segundos
    setTimeout(() => {
      messageDiv.remove();
    }, 3000);



  function searchProducts(event) {
    event.preventDefault();
    const query = document.getElementById('search').value;
    window.location.href = `/results.html?search=${query}`;
  }