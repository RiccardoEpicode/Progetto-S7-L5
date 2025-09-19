const apiUrl = "https://striveschool-api.herokuapp.com/api/product/";
const token =
  "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2OGNkMGUzYjZmMzAyMjAwMTUxMDgwY2MiLCJpYXQiOjE3NTgyNjg5ODcsImV4cCI6MTc1OTQ3ODU4N30.x2qaMNiihZCAgtIrFCwkbgCyiwr2c-Gbxlu1btfsgnQ";

const productDetail = document.getElementById("product-detail");

// FUNZIONE PER OTTENERE L'ID DALL'URL
const getProductId = () => {
  const params = new URLSearchParams(window.location.search);
  return params.get("id");
};

// FUNZIONE PER MOSTRARE DETTAGLIO
const renderProduct = (p) => {
  productDetail.innerHTML = `
    <div class="col-md-6 text-center">
      <img src="${p.imageUrl}" alt="${p.name}" class="img-fluid rounded shadow" />
    </div>
    <div class="col-md-6">
      <h2>${p.name}</h2>
      <p class="lead">${p.description}</p>
      <h4 class="text-success mb-4">${p.price} €</h4>
      <button id="add-to-cart" class="btn btn-lg btn-primary">Aggiungi al carrello</button>
    </div>
  `;

  // EVENTO AGGIUNGI AL CARRELLO
  document.getElementById("add-to-cart").addEventListener("click", () => {
    addToCart(p);
  });
};

// FUNZIONE PER SALVARE NEL CARRELLO
const addToCart = (product) => {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  cart.push(product);
  localStorage.setItem("cart", JSON.stringify(cart));

  window.location.href = "./home.html";
};

// GET SINGOLO PRODOTTO
const loadProduct = () => {
  const id = getProductId();
  if (!id) {
    productDetail.innerHTML = `<p class="text-danger">Errore: prodotto non trovato</p>`;
    return;
  }

  fetch(apiUrl + id, {
    headers: { Authorization: token },
  })
    .then((res) => {
      if (!res.ok) throw new Error("Errore nel recupero dettaglio prodotto");
      return res.json();
    })
    .then((data) => renderProduct(data))
    .catch((err) => {
      console.error(err);
      productDetail.innerHTML = `<p class="text-danger">Impossibile caricare il prodotto</p>`;
    });
};

// CARICO I PRODOTTI SUBITO
loadProduct();
