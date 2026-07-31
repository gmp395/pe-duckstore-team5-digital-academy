import { patitos } from "../db/patitosdb.js";

const cartList = document.querySelector(".cart__list");
const checkoutContainer = document.querySelector(
  ".cart__checkout_container"
);

function getCart() {
  try {
    return JSON.parse(localStorage.getItem("cart")) || {};
  } catch (error) {
    console.error("No se pudo leer el carrito:", error);
    return {};
  }
}

function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function getCartItems(cart) {
  const selectedIds = Object.keys(cart).map(Number);

  return patitos.filter((patito) =>
    selectedIds.includes(patito.id)
  );
}

function calculateTotal(cart, cartItems) {
  return cartItems.reduce((total, patito) => {
    const quantity = cart[String(patito.id)] || 0;

    return total + Number(patito.price) * quantity;
  }, 0);
}

function renderCart() {
  const cart = getCart();
  const cartItems = getCartItems(cart);

  cartList.innerHTML = "";

  if (cartItems.length === 0) {
    cartList.innerHTML = `
      <div class="cart__empty">
        <h2>Tu carrito está vacío</h2>
        <p>Añade algún patito desde el catálogo.</p>
        <a class="cart__empty_link" href="./catalog.html">
          Ir al catálogo
        </a>
      </div>
    `;

    renderCheckout(cart, cartItems);
    return;
  }

  cartItems.forEach((patito) => {
    const productId = String(patito.id);
    const quantity = cart[productId];

    cartList.innerHTML += `
      <div class="cart__card" data-id="${patito.id}">
        <img
          class="cart__image"
          src="${patito.image}"
          alt="${patito.name}"
        />

        <div class="cart_card__content">
          <h3 class="cart__title">${patito.name}</h3>

          <span class="cart__price">
            €${Number(patito.price).toFixed(2)}
          </span>
        </div>

        <div class="cart_item__counter">
          <button
            class="cart_item__menos"
            type="button"
            data-action="decrease"
            aria-label="Disminuir cantidad de ${patito.name}"
          >
            <img
              src="../assets/icons/menos.svg"
              alt=""
            />
          </button>

          <span class="cart__quantity">
            ${quantity}
          </span>

          <button
            class="cart_item__plus"
            type="button"
            data-action="increase"
            aria-label="Aumentar cantidad de ${patito.name}"
          >
            <img
              src="../assets/icons/plus.svg"
              alt=""
            />
          </button>
        </div>
      </div>
    `;
  });

  renderCheckout(cart, cartItems);
}

function renderCheckout(cart, cartItems) {
  const totalPrice = calculateTotal(
    cart,
    cartItems
  ).toFixed(2);

  const isCartEmpty = cartItems.length === 0;

  checkoutContainer.innerHTML = `
    <h2>Resumen</h2>

    <div class="cart__checkout_row">
      <span>Subtotal:</span>
      <span>€${totalPrice}</span>
    </div>

    <div class="cart__checkout_row">
      <span>Envío:</span>
      <span style="color: green;">Gratis</span>
    </div>

    <div class="cart__checkout_separator"></div>

    <div class="cart__checkout_row cart__checkout_total">
      <span>Total:</span>
      <span>€${totalPrice}</span>
    </div>

    <div class="cart__checkout_buttons">
      <a
        class="cart__back_button"
        href="./catalog.html"
      >
        <div class="button_checkout_back">
          Seguir comprando
        </div>
      </a>

      ${
        isCartEmpty
          ? `
            <button
              class="button_checkout"
              type="button"
              disabled
            >
              Comprar
            </button>
          `
          : `
            <a
              class="cart__checkout_button"
              href="./compra_realizada.html"
            >
              <div class="button_checkout">
                Comprar
              </div>
            </a>
          `
      }
    </div>
  `;
}

cartList.addEventListener("click", (event) => {
  const button = event.target.closest(
    "button[data-action]"
  );

  if (!button) {
    return;
  }

  const card = button.closest(".cart__card");

  if (!card) {
    return;
  }

  const productId = card.dataset.id;
  const action = button.dataset.action;
  const cart = getCart();

  if (!cart[productId]) {
    return;
  }

  if (action === "increase") {
    cart[productId] += 1;
  }

  if (action === "decrease") {
    cart[productId] -= 1;

    if (cart[productId] <= 0) {
      delete cart[productId];
    }
  }

  saveCart(cart);
  renderCart();
});

renderCart();