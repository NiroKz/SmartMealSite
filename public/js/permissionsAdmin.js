console.log("✅ permissionsAdmin.js carregado!");

// Deixa a função acessível globalmente
window.loadPermissions = async function () {
  console.log("🔹 loadPermissions() foi chamado!");
  try {
    const response = await fetch("http://localhost:3000/admin/access");
    console.log("🔹 Requisição feita para /admin/access");

    if (!response.ok) throw new Error("Falha ao buscar permissões");
    const data = await response.json();

    const tbody = document.querySelector("#permissionsTable tbody");
    if (!tbody) return;
    tbody.innerHTML = "";

    data.forEach((user) => {
        console.log("🔹 Dados recebidos:", data);
      const row = document.createElement("tr");

      row.innerHTML = `
        <td>${user.user_name}</td>
        <td>${user.email}</td>
        <td><input type="checkbox" ${user.access_stock ? "checked" : ""}></td>
        <td><input type="checkbox" ${user.access_production ? "checked" : ""}></td>
        <td><input type="checkbox" ${user.access_accesses ? "checked" : ""}></td>
        <td><input type="checkbox" ${user.access_student_register ? "checked" : ""}></td>
        <td><input type="checkbox" ${user.access_reports ? "checked" : ""}></td>
        <td><input type="checkbox" ${user.access_student_perm ? "checked" : ""}></td>
        <td><input type="checkbox" ${user.access_class_register ? "checked" : ""}></td>
        <td><button class="save-btn">Salvar</button></td>
      `;

      // Botão "Salvar"
      row.querySelector(".save-btn").addEventListener("click", async () => {
        const inputs = row.querySelectorAll("input[type='checkbox']");
        const updatedPermissions = {
          access_stock: inputs[0].checked,
          access_production: inputs[1].checked,
          access_accesses: inputs[2].checked,
          access_student_register: inputs[3].checked,
          access_reports: inputs[4].checked,
          access_student_perm: inputs[5].checked,
          access_class_register: inputs[6].checked,
        };
        await savePermissions(user.id_user, updatedPermissions);
      });

      tbody.appendChild(row);
    });

    // Cabeçalho
    const thead = document.querySelector("#permissionsTable thead tr");
    if (thead) {
      thead.innerHTML = `
        <th>Nome</th>
        <th>Email</th>
        <th>Estoque</th>
        <th>Produção</th>
        <th>Acessos</th>
        <th>Cadastro Aluno</th>
        <th>Relatórios</th>
        <th>Cardápio</th>
        <th>Administração</th>
        <th>Salvar</th>
      `;
    }
  } catch (error) {
    console.error("Erro ao carregar permissões:", error);
  }
};

async function savePermissions(id_user, updatedPermissions) {
  try {
    const response = await fetch(
      `http://localhost:3000/admin/access/${id_user}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedPermissions),
      }
    );
    if (!response.ok) throw new Error("Erro ao atualizar permissões");
    alert("✅ Permissões atualizadas com sucesso!");
  } catch (error) {
    console.error("Erro ao salvar permissões:", error);
    alert("❌ Erro ao salvar permissões.");
  }
}
