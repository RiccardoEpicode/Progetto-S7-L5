const apiUrl = "https://striveschool-api.herokuapp.com/api/product/";
const token =
  "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2OGNkMGUzYjZmMzAyMjAwMTUxMDgwY2MiLCJpYXQiOjE3NTgyNjg5ODcsImV4cCI6MTc1OTQ3ODU4N30.x2qaMNiihZCAgtIrFCwkbgCyiwr2c-Gbxlu1btfsgnQ";

const productList = document.getElementById("product-list");
const createForm = document.getElementById("create-form");

// ========== RENDER LIST ==========
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
          <p class="text-muted"><strong>Brand:</strong> ${p.brand}</p>
          <p><span class="badge bg-success">${p.price} €</span></p>
          <div class="mt-auto">
            <a href="./backoffice.html?id=${p._id}" class="btn btn-warning w-100">✏️ Modifica</a>
          </div>
        </div>
      </div>
    `;
    productList.appendChild(col);
  });
};

// ========== GET ==========
const getProducts = () => {
  console.log("🔄 GET avviata...");
  fetch(apiUrl, {
    headers: { Authorization: token },
  })
    .then((res) => {
      console.log("🌍 Response GET:", res);
      if (!res.ok) throw new Error("Errore nel recupero prodotti");
      return res.json();
    })
    .then((data) => {
      console.log("✅ Prodotti ricevuti:", data);
      renderProducts(data);
    })
    .catch((err) => console.error("❌ Errore GET:", err));
};

// ========== CREATE ==========
createForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const newProduct = {
    name: document.getElementById("c-name").value,
    description: document.getElementById("c-description").value,
    brand: document.getElementById("c-brand").value,
    imageUrl: document.getElementById("c-imageUrl").value,
    price: Number(document.getElementById("c-price").value),
  };

  console.log("📦 Payload POST:", newProduct);

  fetch(apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: token,
    },
    body: JSON.stringify(newProduct),
  })
    .then((res) => {
      console.log("🌍 Response POST:", res);
      if (!res.ok) throw new Error("Errore nel salvataggio");
      return res.json();
    })
    .then((savedProduct) => {
      console.log("✅ Prodotto salvato:", savedProduct);
      getProducts();
      createForm.reset();
    })
    .catch((err) => console.error("❌ Errore POST:", err));
});

// ========== EDIT ==========
const params = new URLSearchParams(window.location.search);
const productId = params.get("id");

if (productId) {
  const editSection = document.getElementById("edit-section");
  editSection.classList.remove("d-none");

  const editForm = document.getElementById("edit-form");
  const deleteBtn = document.getElementById("delete-btn");

  // CARICO I DATI SUBITO
  fetch(apiUrl + productId, {
    headers: { Authorization: token },
  })
    .then((res) => {
      if (!res.ok) throw new Error("Errore nel recupero prodotto");
      return res.json();
    })
    .then((data) => {
      console.log("✏️ Prodotto da modificare:", data);
      document.getElementById("e-name").value = data.name;
      document.getElementById("e-description").value = data.description;
      document.getElementById("e-brand").value = data.brand;
      document.getElementById("e-imageUrl").value = data.imageUrl;
      document.getElementById("e-price").value = data.price;
    })
    .catch((err) => console.error("❌ Errore caricamento prodotto:", err));

  // AGGIORNA PRODOTTO
  editForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const updatedProduct = {
      name: document.getElementById("e-name").value,
      description: document.getElementById("e-description").value,
      brand: document.getElementById("e-brand").value,
      imageUrl: document.getElementById("e-imageUrl").value,
      price: Number(document.getElementById("e-price").value),
    };

    console.log("📦 Payload PUT:", updatedProduct);

    fetch(apiUrl + productId, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify(updatedProduct),
    })
      .then((res) => {
        console.log("🌍 Response PUT:", res);
        if (!res.ok) throw new Error("Errore aggiornamento prodotto");
        return res.json();
      })
      .then((data) => {
        console.log("✅ Prodotto aggiornato:", data);
        alert("✅ Prodotto aggiornato con successo!");
        location.reload();
      })
      .catch((err) => console.error("❌ Errore PUT:", err));
  });

  // ELIMINA PRODOTTO
  deleteBtn.addEventListener("click", () => {
    if (confirm("Sei sicuro di voler eliminare questo prodotto?")) {
      fetch(apiUrl + productId, {
        method: "DELETE",
        headers: { Authorization: token },
      })
        .then((res) => {
          console.log("🌍 Response DELETE:", res);
          if (!res.ok) throw new Error("Errore nell'eliminazione");
          alert("🗑️ Prodotto eliminato con successo!");
          setTimeout(() => (window.location.href = "./home.html"), 1000);
        })
        .catch((err) => console.error("❌ Errore DELETE:", err));
    }
  });
}

// ========== AVVIO ==========
getProducts();
