const modal = document.getElementById("productModal");
const openModal = document.getElementById("openModal");
const closeModal = document.getElementById("closeModal");

// abrir
openModal.addEventListener("click", () => {
  modal.style.display = "block";
});

// fechar
closeModal.addEventListener("click", () => {
  modal.style.display = "none";
});

// salvar
document.getElementById("productForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const productName = document.getElementById("productName").value;
  const productQuantity = parseFloat(
    document.getElementById("productQuantity").value
  );
  const productUnit = document.getElementById("productUnit").value;
  const productBatch = document.getElementById("productBatch").value;
  const productValidity = document.getElementById("productValidity").value;
  const productDestination = document.getElementById("productDestination").value;

  try {
    const res = await fetch("https://smart-meal-backend.vercel.app/stock/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        productName,
        productQuantity,
        productUnit,
        batch: productBatch,
        validity: productValidity,
        destination: productDestination,
      }),
    });

    if (res.ok) {
      //alert("Produto atualizado com sucesso!");
      showPopup("Sucesso!", "Produto atualizado com sucesso!");
      modal.style.display = "none";
    } else {
      //alert("Erro ao salvar produto");
      showPopup("Erro", "Erro ao salvar produto.");
    }
  } catch (err) {
    console.error(err);
  }
});
