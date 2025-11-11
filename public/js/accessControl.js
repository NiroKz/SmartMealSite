console.log("✅ accessControl.js carregado!");

// FUNÇÃO DE TROCA DE SEÇÃO
window.irParaSecao = function (secaoId) {
  const tabSections = document.querySelectorAll(".tab-section");
  tabSections.forEach((s) => (s.style.display = "none"));

  const secaoEl = document.getElementById(secaoId);
  if (secaoEl) secaoEl.style.display = "block";

  const modulosSection = document.getElementById("modulos-section");
  const menuHorizontal = document.querySelector(".access-control2");
  if (modulosSection) modulosSection.style.display = "none";
  if (menuHorizontal) menuHorizontal.style.display = "flex";

  document.querySelectorAll(".access-control2 a")
    .forEach((a) => a.classList.remove("selected"));

  const activeLink = document.querySelector(
    `.access-control2 a[data-target='${secaoId}']`
  );
  if (activeLink) activeLink.classList.add("selected");

  const user = JSON.parse(localStorage.getItem("usuario"));
  if (user) {
    if (user.is_usuario_admin) showAllButtons();
    else applyUserAccess(user.id_user, true);
  }

  // 🔹 Se o admin abriu a aba de administração
  if (secaoId === "admin" && user?.is_usuario_admin) {
    console.log("🟢 Admin abriu aba de permissões.");
    if (window.loadPermissions) {
      window.loadPermissions(); // Chama função global do outro arquivo
    } else {
      console.warn("⚠️ loadPermissions ainda não foi carregada!");
    }
  }
};

// APLICA PERMISSÕES DO USUÁRIO
async function applyUserAccess(id_user, isHorizontal = false) {
  try {
    const response = await fetch(
      `http://localhost:3000/admin/access/${id_user}`
    );
    if (!response.ok) throw new Error("Erro ao buscar permissões");

    const access = await response.json();
    console.log("Permissões do usuário:", access);

    // Mapeia os IDs de botões e links
    const buttonMap = {
      "btn-stock": access.access_stock,
      "btn-production": access.access_production,
      "btn-accesses": access.access_accesses,
      "btn-student-register": access.access_student_register,
      "btn-feedback": access.access_reports,
      "btn-foodmenu": access.access_student_perm,
      "btn-admin": access.access_class_register,
    };

    // 🔹 Aplica restrição tanto nos botões verticais quanto nos links horizontais
    Object.entries(buttonMap).forEach(([id, hasAccess]) => {
      const verticalEl = document.getElementById(id);
      const horizontalEl = document.querySelector(
        `.access-control2 a[data-btn='${id}']`
      );
      if (verticalEl) verticalEl.style.display = hasAccess ? "" : "none";
      if (horizontalEl) horizontalEl.style.display = hasAccess ? "" : "none";
    });

    // 🔹 Esconde aba de admin se não for admin
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
    "btn-admin",
  ];

  allButtonIds.forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.style.display = "";
    const horizontalEl = document.querySelector(
      `.access-control2 a[data-btn='${id}']`
    );
    if (horizontalEl) horizontalEl.style.display = "";
  });

  const adminTab = document.getElementById("admin");
  if (adminTab) adminTab.style.display = "";
}

// TABELA DE PERMISSÕES (ADMIN)
async function loadPermissions() {
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
      const row = document.createElement("tr");

      row.innerHTML = `
        <td>${user.user_name}</td>
        <td>${user.email}</td>
        <td><input type="checkbox" ${user.access_stock ? "checked" : ""}></td>
        <td><input type="checkbox" ${
          user.access_production ? "checked" : ""
        }></td>
        <td><input type="checkbox" ${
          user.access_accesses ? "checked" : ""
        }></td>
        <td><input type="checkbox" ${
          user.access_student_register ? "checked" : ""
        }></td>
        <td><input type="checkbox" ${user.access_reports ? "checked" : ""}></td>
        <td><input type="checkbox" ${
          user.access_student_perm ? "checked" : ""
        }></td>
        <td><input type="checkbox" ${
          user.access_class_register ? "checked" : ""
        }></td>
        <td><button class="save-btn">Salvar</button></td>
      `;

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

    // Atualiza o cabeçalho
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
}

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

// INICIALIZAÇÃO DE ABAS E LAYOUT
function initTabs() {
  const tabSections = document.querySelectorAll(".tab-section");
  const modulosSection = document.getElementById("modulos-section");
  const menuHorizontal = document.querySelector(".access-control2");

  // Mostra só os botões verticais no início
  tabSections.forEach((s) => (s.style.display = "none"));
  if (modulosSection) modulosSection.style.display = "block";
  if (menuHorizontal) menuHorizontal.style.display = "none";
}

// VOLTAR AO MENU INICIAL
function voltarParaInicio() {
  const modulosSection = document.getElementById("modulos-section");
  const menuHorizontal = document.querySelector(".access-control2");
  const tabSections = document.querySelectorAll(".tab-section");

  if (modulosSection) modulosSection.style.display = "block";
  if (menuHorizontal) menuHorizontal.style.display = "none";
  tabSections.forEach((s) => {
    if (!s.classList.contains("access-control2")) s.style.display = "none";
  });

  // Remove destaque ativo no menu horizontal
  document
    .querySelectorAll(".access-control2 a")
    .forEach((a) => a.classList.remove("selected"));
}