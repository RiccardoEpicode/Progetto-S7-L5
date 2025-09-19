const apiUrl = "https://striveschool-api.herokuapp.com/api/product/";
const token =
  "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2OGNkMGUzYjZmMzAyMjAwMTUxMDgwY2MiLCJpYXQiOjE3NTgyNjg5ODcsImV4cCI6MTc1OTQ3ODU4N30.x2qaMNiihZCAgtIrFCwkbgCyiwr2c-Gbxlu1btfsgnQ";

const productList = document.getElementById("product-list");
const cartItems = document.getElementById("cart-items");

// FUNZIONE PER MOSTRARE I PRODOTTI
const renderProducts = (products) => {
  productList.innerHTML = "";
  products.forEach((p) => {
    const col = document.createElement("div");
    col.classList.add("col-md-4");

    col.innerHTML = `
      <div class="card h-100 shadow-sm">
        <img src="${p.imageUrl}" class="card-img-top product-img" alt="${p.name}">
        <div class="card-body d-flex flex-column">
          <h5 class="card-title">${p.name}</h5>
          <p class="card-text">${p.description}</p>
          <p><span class="badge bg-success">${p.price} €</span></p>
          <div class="mt-auto">
            <a href="./dettaglio.html?id=${p._id}" class="btn btn-primary w-100 mb-2">Vai al prodotto</a>
            <a href="./backoffice.html?id=${p._id}" class="btn btn-warning w-100">Modifica</a>
          </div>
        </div>
      </div>
    `;
    productList.appendChild(col);
  });
};

// FUNZIONE PER MOSTRARE CARRELLO NELLA MODAL
const renderCart = () => {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  if (cart.length === 0) {
    cartItems.innerHTML = `<p class="text-muted">Nessun prodotto nel carrello</p>`;
    return;
  }

  cartItems.innerHTML = "";
  cart.forEach((item, index) => {
    const div = document.createElement("div");
    div.classList.add(
      "d-flex",
      "justify-content-between",
      "align-items-center",
      "mb-2"
    );
    div.innerHTML = `
      <span>${item.name} - <strong>${item.price} €</strong></span>
      <button class="btn btn-sm btn-danger" onclick="removeFromCart(${index})">X</button>
    `;
    cartItems.appendChild(div);
  });
};

// FUNZIONE PER RIMUOVERE PRODOTTO DAL CARRELLO
const removeFromCart = (index) => {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  cart.splice(index, 1);
  localStorage.setItem("cart", JSON.stringify(cart));
  renderCart();
};

// GET PRODOTTI
fetch(apiUrl, {
  headers: { Authorization: token },
})
  .then((res) => {
    if (!res.ok) throw new Error("Errore nel recupero prodotti");
    return res.json();
  })
  .then((data) => {
    renderProducts(data);
    renderCart();
  })
  .catch((err) => console.error("Errore GET:", err));
