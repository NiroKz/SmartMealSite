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

  document
    .querySelectorAll(".access-control2 a")
    .forEach((a) => a.classList.remove("selected"));

  const activeLink = document.querySelector(
    `.access-control2 a[data-target='${secaoId}'], 
   .access-control2 a[data-btn='btn-${secaoId}']`
  );

  if (activeLink) {
    activeLink.classList.add("selected");
    console.log(`🔹 Link ativo: ${activeLink.textContent}`);
  } else {
    console.warn(`⚠️ Nenhum link correspondente encontrado para ${secaoId}`);
  }

  const user = JSON.parse(localStorage.getItem("usuario"));
  if (user) {
    if (user.is_usuario_admin) showAllButtons();
    else applyUserAccess(user.id_user, true);
  }

  // 🔹 Se o admin abriu a aba de administração
  if (secaoId === "admin" || secaoId === "admin-section") {
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
// ===============================
// INICIALIZAÇÃO AO CARREGAR PÁGINA
// ===============================
document.addEventListener("DOMContentLoaded", async () => {
  console.log("✅ accessControl.js inicializado!");

  const user = JSON.parse(localStorage.getItem("usuario"));
  if (!user) {
    console.warn("⚠️ Nenhum usuário logado encontrado!");
    return;
  }

  // 🔹 Inicializa layout padrão
  initTabs();

  // 🔹 Se for admin, mostra tudo
  if (user.is_usuario_admin) {
    console.log("👑 Usuário admin — mostrando todos os botões");
    showAllButtons();
  }
  // 🔹 Caso contrário, aplica permissões do banco
  else {
    console.log("🔒 Aplicando permissões para o usuário comum...");
    await applyUserAccess(user.id_user);
  }
});
