import { patitos } from "../db/patitosdb.js";

const patitoSeleccionado = localStorage.getItem("patitoSeleccionado");
const patito = patitos[patitoSeleccionado];

const detailContainer = document.querySelector(".detail__container");

if (!detailContainer) {
  console.error("No se encontró el contenedor .detail__container");
} else if (!patito) {
  detailContainer.innerHTML = `
    <div class="detail__error">
      <h1>Producto no encontrado</h1>
      <p>No hemos podido cargar la información del producto.</p>
      <a href="./catalog.html">Volver al catálogo</a>
    </div>
  `;
} else {
  detailContainer.innerHTML = `
    <img
      class="detail__image"
      src="${patito.image}"
      alt="${patito.name}"
    />

    <div class="detail__content">
      <div class="detail__special">
        Edición especial
      </div>

      <h1>${patito.name}</h1>

      <h3>€${Number(patito.price).toFixed(2)}</h3>

      <div class="detail__description_container">
        <p>${patito.description}</p>
      </div>

      <p class="detail__in_stock_info">
        <i>¡Solo quedan ${patito.stock} en stock!</i>
      </p>

      <div class="detail__characteristics">
        <div class="charasteristics__item">
          <span
            class="material-symbols-outlined charasteristics__icon"
            data-icon="tsunami"
          >
            tsunami
          </span>
          <span class="charasteristics__text">
            100% sumergible
          </span>
        </div>

        <div class="charasteristics__item">
          <span
            class="material-symbols-outlined charasteristics__icon"
            data-icon="eco"
          >
            eco
          </span>
          <span class="charasteristics__text">
            Material ecológico
          </span>
        </div>

        <div class="charasteristics__item">
          <span
            class="material-symbols-outlined charasteristics__icon"
            data-icon="local_shipping"
          >
            local_shipping
          </span>
          <span class="charasteristics__text">
            Envío en 24/48 h
          </span>
        </div>

        <div class="charasteristics__item">
          <span
            class="material-symbols-outlined charasteristics__icon"
            data-icon="verified"
          >
            verified
          </span>
          <span class="charasteristics__text">
            Garantía Duck
          </span>
        </div>
      </div>

      <button
  id="addToCart"
  class="detail__button"
  type="button"
>
  <span class="material-symbols-outlined">
    add_shopping_cart
  </span>

  <span>Añadir al carrito</span>
</button>

        <p
          id="cartMessage"
          class="detail__cart_message"
          aria-live="polite"
        ></p>
      </div>
    </div>
  `;

  const addToCartButton = document.getElementById("addToCart");
  const cartMessage = document.getElementById("cartMessage");

  addToCartButton.addEventListener("click", () => {
    const cart = JSON.parse(localStorage.getItem("cart")) || {};
    const productId = String(patito.id);

    if (cart[productId]) {
      cart[productId] += 1;
    } else {
      cart[productId] = 1;
    }

    localStorage.setItem("cart", JSON.stringify(cart));

    cartMessage.textContent = "Producto añadido al carrito.";

    setTimeout(() => {
      cartMessage.textContent = "";
    }, 2500);
  });
}