// CONFIGURACIÓN: Ingresa tu número de WhatsApp aquí
const WHATSAPP_NUMBER = "523312732983"; 

// ESTADO DEL CARRITO
let cart = JSON.parse(localStorage.getItem('malakai_cart')) || [];

// ELEMENTOS DEL DOM
const openCartBtn = document.getElementById('open-cart-btn');
const closeCartBtn = document.getElementById('close-cart-btn');
const cartOverlay = document.getElementById('cart-overlay');
const cartSidebar = document.getElementById('cart-sidebar');
const cartItemsContainer = document.getElementById('cart-items');
const cartCountSpan = document.getElementById('cart-count');
const cartTotalPriceSpan = document.getElementById('cart-total-price');
const checkoutBtn = document.getElementById('checkout-btn');
const toast = document.getElementById('toast');

// EVENT LISTENERS
openCartBtn.addEventListener('click', toggleCart);
closeCartBtn.addEventListener('click', toggleCart);
cartOverlay.addEventListener('click', toggleCart);
checkoutBtn.addEventListener('click', sendOrderToWhatsApp);

document.querySelectorAll('.add-to-cart-btn').forEach(button => {
    button.addEventListener('click', (e) => {
        const id = e.target.dataset.id;
        const name = e.target.dataset.name;
        const price = parseFloat(e.target.dataset.price);
        addToCart(id, name, price);
    });
});

// FUNCIONES DEL CARRITO
function toggleCart() {
    cartSidebar.classList.toggle('open');
    cartOverlay.classList.toggle('active');
}

function addToCart(id, name, price) {
    const existingItem = cart.find(item => item.id === id);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ id, name, price, quantity: 1 });
    }

    updateCartUI();
    saveCartToStorage();
    showToast();
}

function updateQuantity(id, change) {
    const item = cart.find(item => item.id === id);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            cart = cart.filter(item => item.id !== id);
        }
    }
    updateCartUI();
    saveCartToStorage();
}

function saveCartToStorage() {
    localStorage.setItem('malakai_cart', JSON.stringify(cart));
}

function updateCartUI() {
    cartItemsContainer.innerHTML = '';
    let total = 0;
    let itemCount = 0;

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p style="text-align:center; color:#888; margin-top:20px;">Tu carrito está vacío 🐾</p>';
    } else {
        cart.forEach(item => {
            const itemTotal = item.price * item.quantity;
            total += itemTotal;
            itemCount += item.quantity;

            const itemElement = document.createElement('div');
            itemElement.classList.add('cart-item');
            itemElement.innerHTML = `
                <div class="cart-item-details">
                    <h4>${item.name}</h4>
                    <p>$${item.price.toFixed(2)} x ${item.quantity} = $${itemTotal.toFixed(2)}</p>
                </div>
                <div class="cart-item-controls">
                    <button class="qty-btn" onclick="updateQuantity('${item.id}', -1)">-</button>
                    <span>${item.quantity}</span>
                    <button class="qty-btn" onclick="updateQuantity('${item.id}', 1)">+</button>
                </div>
            `;
            cartItemsContainer.appendChild(itemElement);
        });
    }

    cartCountSpan.textContent = itemCount;
    cartTotalPriceSpan.textContent = `$${total.toFixed(2)} MXN`;
}

// ENVÍO DE PEDIDO A WHATSAPP
function sendOrderToWhatsApp() {
    if (cart.length === 0) {
        alert("Tu carrito está vacío. Agrega productos antes de realizar el pedido.");
        return;
    }

    let message = "🐾 *NUEVO PEDIDO - MALAKAI* 🐾\n\n";
    message += "Hola, me gustaría realizar el siguiente pedido:\n\n";

    let total = 0;
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        message += `• *${item.name}* x${item.quantity} - $${itemTotal.toFixed(2)} MXN\n`;
    });

    message += `\n*TOTAL A PAGAR:* $${total.toFixed(2)} MXN\n\n`;
    message += "Quedo a la espera de la confirmación para acordar entrega o envío. ¡Gracias!";

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;

    // Limpiar carrito después de enviar
    cart = [];
    saveCartToStorage();
    updateCartUI();
    toggleCart();

    // Abrir WhatsApp
    window.open(whatsappUrl, '_blank');
}

// FUNCIÓN EXTRA: MOSTRAR NOTIFICACIÓN TIPO TOAST
function showToast() {
    toast.classList.add('show');
    setTimeout(() => {
        toast.classList.remove('show');
    }, 2000);
}

// Cargar la UI al iniciar
updateCartUI();