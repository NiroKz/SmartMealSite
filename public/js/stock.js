document.addEventListener("DOMContentLoaded", () => {
  const tbody = document.querySelector(".estoque-table tbody");
  const modal = document.getElementById("productModal");
  const openModal = document.getElementById("openModal");
  const closeModal = document.getElementById("closeModal");

  // -----------------------------
  // 🔹 Função para carregar e popular a tabela
  // -----------------------------
  async function loadStockTable() {
    try {
      const response = await fetch(`/stock`);
      const stockData = await response.json();

      tbody.innerHTML = ""; // limpa tabela antes de renderizar

      stockData.forEach((item) => {
        const row = document.createElement("tr");

        const quantity_movement_formated = Number(item.quantity_movement);
        row.innerHTML = `
          <td>${item.batch}</td>
          <td>${item.date_movement}</td>
          <td>${quantity_movement_formated.toLocaleString("pt-BR", { minimumFractionDigits: 2 })} ${item.unit}</td>
          <td>${item.validity}</td>
          <td>${item.product_name}</td>
          <td>${Number(item.price).toLocaleString("pt-BR", {style: "currency", currency: "BRL"})}</td>
          <td>${item.origin}</td>
        `;

        tbody.appendChild(row);
      });
    } catch (error) {
      console.error("Erro ao carregar estoque:", error);
    }
  }

  // -----------------------------
  // 🔹 Modal (abrir/fechar)
  // -----------------------------
  openModal.addEventListener("click", () => {
    modal.style.display = "block";
  });

  closeModal.addEventListener("click", () => {
    modal.style.display = "none";
  });

  // -----------------------------
  // 🔹 Salvar novo produto
  // -----------------------------
  document.getElementById("productForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const productName = document.getElementById("productName").value;
    const productQuantity = parseFloat(document.getElementById("productQuantity").value);
    const productUnit = document.getElementById("productUnit").value;
    const productBatch = document.getElementById("productBatch").value;
    const productValidity = document.getElementById("productValidity").value;
    const productDestination = document.getElementById("productDestination").value;
    const productOrigin = document.getElementById("productOrigin").value;
    const productPrice = document.getElementById("productPrice").value;

    try {
      const res = await fetch("/stock/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productName,
          productQuantity,
          productUnit,
          batch: productBatch,
          validity: productValidity,
          destination: productDestination,
          origin: productOrigin,
          price: productPrice,
        }),
      });

      if (res.ok) {
        showPopup("Sucesso!", "Produto atualizado com sucesso!");
        modal.style.display = "none";

        // 🔄 Atualiza tabela automaticamente após salvar
        loadStockTable();
      } else {
        showPopup("Erro", "Erro ao salvar produto.");
      }
    } catch (err) {
      console.error("Erro ao salvar produto:", err);
    }
  });

  // -----------------------------
  // 🔹 Carregamento inicial da tabela
  // -----------------------------
  loadStockTable();
});
