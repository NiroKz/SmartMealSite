//TODO: CONSERTAR O ACCESS CONTROL NA PARTE PÓS SELEÇÃO DE MODULO (VOLTAR PARA OQ ERA ANTES), COM O MENU VERTICAL SE TORNANDO HORIZONTAL
// MAS MANTENDO A LÓGICA DE PERMISSÕES

// ACCESS CONTROL - FRONTEND
document.addEventListener("DOMContentLoaded", async () => {
  const user = JSON.parse(localStorage.getItem("usuario"));
  if (!user) return window.location.href = "/html/login.html";

  if (user.is_usuario_admin) {
    console.log("Usuário admin — acesso total concedido.");
    await loadPermissions(); // tabela de permissões
    showAllButtons();
  } else {
    await applyUserAccess(user.id_user);
  }

  initTabs();
});

// APLICA PERMISSÕES DO USUÁRIO
async function applyUserAccess(id_user) {
  try {
    const response = await fetch(`http://localhost:3000/admin/access/${id_user}`);
    if (!response.ok) throw new Error("Erro ao buscar permissões");

    const access = await response.json();
    console.log("Permissões do usuário:", access);

    const buttonMap = {
      "btn-stock": access.access_stock,
      "btn-production": access.access_production,
      "btn-accesses": access.access_accesses,
      "btn-student-register": access.access_student_register,
      "btn-feedback": access.access_reports,
      "btn-foodmenu": access.access_student_perm,
      "btn-admin": access.access_class_register
    };

    // 🔹 Mostrar ou esconder botões sem mexer no CSS existente
    Object.entries(buttonMap).forEach(([id, hasAccess]) => {
      const btn = document.getElementById(id);
      if (btn) btn.style.display = hasAccess ? "" : "none"; // "" mantém o estilo padrão
    });

    // 🔹 Se não for admin, esconder seção de admin
    const adminTab = document.getElementById("admin-section");
    if (adminTab) adminTab.style.display = "none";

  } catch (err) {
    console.error("Erro ao aplicar permissões:", err);
  }
}

// MOSTRAR TODOS OS BOTÕES (ADMIN)
function showAllButtons() {
  const allButtonIds = [
    "btn-stock",
    "btn-production",
    "btn-accesses",
    "btn-student-register",
    "btn-feedback",
    "btn-foodmenu",
    "btn-admin"
  ];

  // 🔹 Mostra todos os botões sem alterar o estilo original
  allButtonIds.forEach(id => {
    const btn = document.getElementById(id);
    if (btn) btn.style.display = "";
  });

  const adminTab = document.getElementById("admin-section");
  if (adminTab) adminTab.style.display = "";
}


// TABELA DE PERMISSÕES (ADMIN)
async function loadPermissions() {
  try {
    const response = await fetch("http://localhost:3000/admin/access");
    if (!response.ok) throw new Error("Falha ao buscar permissões");

    const data = await response.json();
    const tbody = document.querySelector("#permissionsTable tbody");
    if (!tbody) return;
    tbody.innerHTML = "";

    data.forEach(user => {
      const row = document.createElement("tr");

      row.innerHTML = `
        <td>${user.user_name}</td>
        <td>${user.email}</td>
        <td><input type="checkbox" ${user.access_stock ? "checked" : ""}></td>
        <td><input type="checkbox" ${user.access_production ? "checked" : ""}></td>
        <td><input type="checkbox" ${user.access_reports ? "checked" : ""}></td>
        <td><input type="checkbox" ${user.access_student_register ? "checked" : ""}></td>
        <td><input type="checkbox" ${user.access_student_perm ? "checked" : ""}></td>
        <td><input type="checkbox" ${user.access_class_register ? "checked" : ""}></td>
        <td><button class="save-btn">Salvar</button></td>
      `;

      row.querySelector(".save-btn").addEventListener("click", async () => {
        const inputs = row.querySelectorAll("input[type='checkbox']");
        const updatedPermissions = {
          access_stock: inputs[0].checked,
          access_production: inputs[1].checked,
          access_reports: inputs[2].checked,
          access_student_register: inputs[3].checked,
          access_student_perm: inputs[4].checked,
          access_class_register: inputs[5].checked
        };
        await savePermissions(user.id_user, updatedPermissions);
      });

      tbody.appendChild(row);
    });

    const thead = document.querySelector("#permissionsTable thead tr");
    if (thead) {
      thead.innerHTML = `
        <th>Nome</th>
        <th>Email</th>
        <th>Estoque</th>
        <th>Produção</th>
        <th>Relatórios</th>
        <th>Cadastro Aluno</th>
        <th>Cardápio</th>
        <th>Administração</th>
        <th>Salvar</th>
      `;
    }

  } catch (error) {
    console.error("Erro ao carregar permissões:", error);
  }
}

async function savePermissions(id_user, updatedPermissions) {
  try {
    const response = await fetch(`http://localhost:3000/admin/access/${id_user}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedPermissions),
    });
    if (!response.ok) throw new Error("Erro ao atualizar permissões");
    alert("✅ Permissões atualizadas com sucesso!");
  } catch (error) {
    console.error("Erro ao salvar permissões:", error);
    alert("❌ Erro ao salvar permissões.");
  }
}

// NAVEGAÇÃO ENTRE SEÇÕES
function initTabs() {
  const tabSections = document.querySelectorAll(".tab-section");
  
  // Inicializa: mostra apenas a seção de módulos
  tabSections.forEach(s => s.style.display = "none");
  const modulosSection = document.getElementById("modulos-section");
  if (modulosSection) modulosSection.style.display = "block";

  // Define função global para os botões
  window.irParaSecao = function(secaoId) {
    tabSections.forEach(s => s.style.display = "none");
    const secaoEl = document.getElementById(secaoId);
    if (secaoEl) secaoEl.style.display = "block";
  };
}
