document.addEventListener("DOMContentLoaded", () => {
  const tbody = document.querySelector(".estoque-table tbody");
  const modal = document.getElementById("productModal");
  const openModal = document.getElementById("openModal");
  const closeModal = document.getElementById("closeModal");

  // -----------------------------
  // 🔹 Carregar tabela de estoque
  // -----------------------------
  async function loadStockTable() {
    try {
      const response = await fetch(`/stock`);
      const stockData = await response.json();

      tbody.innerHTML = ""; // limpa tabela

      stockData.forEach((item) => {
        const row = document.createElement("tr");

        // BADGES
        let badges = "";

        if (item.low_stock == 1) {
          badges += ` <span class="badge-stock badge-low-stock">⚠ Baixa quantidade</span>`;
        }

        if (item.near_expiration == 1) {
          badges += ` <span class="badge-stock badge-expiration">⏳ Vencendo</span>`;
        }

        // CORES NA LINHA
        if (item.low_stock == 1) {
          row.classList.add("low-stock-row");
        }

        if (item.near_expiration == 1) {
          row.classList.add("near-expiration-row");
        }

        const qty = Number(item.quantity_movement);

        row.innerHTML = `
        <td>${item.product_name} ${badges}</td>
    <td>${item.batch || "-"}</td>
    <td>${qty.toLocaleString("pt-BR")} ${item.unit}</td>
    <td>${item.date_movement}</td>
    <td>${item.validity || "-"}</td>
    <td>${item.origin}</td>
    <td>${Number(item.price).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    })}</td>
    <td>
    <button class="delete-btn" data-id="${item.id_stock}">
       Excluir
    </button>
    </td>
  `;

        tbody.appendChild(row);
        // Ativar botões de excluir
        const deleteButton = row.querySelector(".delete-btn");

        deleteButton.addEventListener("click", async () => {
          const id = deleteButton.dataset.id; // sempre o id do próprio botão
          console.log("ID recebido do banco:", item.id_stock);
            try {
            const res = await fetch(`/stock/${id}`, { method: "DELETE" });
            const result = await res.json();

            if (res.ok) {
              showPopup("Sucesso", "Registro excluído com sucesso!");
              loadStockTable();
            } else {
              showPopup("Erro", result.error || "Erro ao excluir.");
            }
          } catch (err) {
            console.error(err);
            showPopup("Erro", "Erro de comunicação com o servidor.");
          }
        });
      });
    } catch (error) {
      console.error("Erro ao carregar estoque:", error);
    }
  }

  // -----------------------------
  // 🔹 Abrir / fechar modal
  // -----------------------------
  openModal.addEventListener("click", () => {
    modal.style.display = "block";
  });

  closeModal.addEventListener("click", () => {
    modal.style.display = "none";
  });

  // -----------------------------
  // 🔹 Salvar movimentação de estoque
  // -----------------------------
  document
    .getElementById("productForm")
    .addEventListener("submit", async (e) => {
      e.preventDefault();

      const name = document.getElementById("productName").value;
      const quantity = parseFloat(
        document.getElementById("productQuantity").value
      );
      const unit = document.getElementById("productUnit").value;

      const batch = document.getElementById("productBatch").value;
      const validity = document.getElementById("productValidity").value;
      const destination = document.getElementById("productDestination").value;
      const origin = document.getElementById("productOrigin").value;
      const price = parseFloat(document.getElementById("productPrice").value);

      // Validação simples
      if (isNaN(quantity)) {
        showPopup("Erro", "Quantidade inválida!");
        return;
      }

      try {
        const res = await fetch("/stock", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name,
            quantity,
            unit,
            batch,
            validity,
            destination,
            origin,
            price,
          }),
        });

        const result = await res.json();

        if (res.ok) {
          showPopup("Sucesso!", result.message || "Movimentação registrada!");
          modal.style.display = "none";
          loadStockTable();
        } else {
          showPopup("Erro", result.error || "Erro ao registrar movimentação.");
        }
      } catch (err) {
        console.error("Erro ao salvar produto:", err);
        showPopup("Erro", "Erro ao se comunicar com o servidor.");
      }
    });

  // -----------------------------
  // 🔹 Inicializa tabela ao carregar página
  // -----------------------------
  loadStockTable();
});
