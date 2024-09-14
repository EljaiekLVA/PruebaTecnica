// Función para mostrar los ítems del carrito en la página
function displayCart() {
  // Obtener el carrito almacenado en localStorage o un arreglo vacío si no existe
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  
  // Seleccionar el contenedor donde se mostrarán los ítems del carrito
  const cartItemsDiv = document.getElementById('cart-items');
  
  // Mapear los ítems del carrito y construir el HTML dinámico para cada uno
  cartItemsDiv.innerHTML = cart.map(item => `
    <div class="cart-item">
      <h2 class="cart-item-title">${item.title}</h2>
      <p class="cart-item-price">Precio: $${item.price}</p>
      <p class="cart-item-quantity">Cantidad: ${item.quantity}</p>
    </div>
  `).join('');
}

// Función para finalizar la compra y vaciar el carrito
function checkout() {
  // Eliminar el carrito de localStorage
  localStorage.removeItem('cart');
  
  // Mostrar un mensaje de confirmación
  displayCheckoutMessage('Compra finalizada. ¡Gracias por tu compra!');
  
  // Actualizar la vista del carrito
  displayCart();
}

// Función para mostrar un mensaje flotante después de finalizar la compra
function displayCheckoutMessage(message) {
  const messageDiv = document.createElement('div');
  messageDiv.className = 'checkout-message';  // Aplicar la clase de estilo para el mensaje
  messageDiv.innerText = message;
  
  // Añadir el mensaje flotante al cuerpo del documento
  document.body.appendChild(messageDiv);
  
  // Eliminar el mensaje después de 3 segundos
  setTimeout(() => messageDiv.remove(), 3000);
}

// Ejecutar la función de mostrar el carrito al cargar la página
window.onload = displayCart;
