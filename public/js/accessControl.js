// visualização de permissões de acesso
document.addEventListener("DOMContentLoaded", () => {
  const user = JSON.parse(localStorage.getItem("usuario"));

  if (!user) {
    // Se não estiver logado, volta para login
    window.location.href = "/html/login.html";
    return;
  }

  // Exemplo de controle de módulos por permissão
  if (!user.permissions.access_stock) {
    document.getElementById("menu-estoque").style.display = "none";
  }

  if (!user.permissions.access_production) {
    document.getElementById("menu-producao").style.display = "none";
  }

  if (!user.permissions.access_feedback) {
    document.getElementById("menu-feedback").style.display = "none";
  }

  // Mostra nome do usuário
  document.getElementById("user-name").innerText = user.nome_usuario;
});


// ADMINISTRAÇÃO - PERMISSÕES
// Função para buscar todas as permissões do backend
async function loadPermissions() {
  try {
    const response = await fetch("http://localhost:3000/admin/access");
    const data = await response.json();

    const tbody = document.querySelector("#permissionsTable tbody");
    tbody.innerHTML = "";

    data.forEach(user => {
      const row = document.createElement("tr");

      row.innerHTML = `
        <td>${user.user_name}</td>
        <td>${user.email}</td>
        <td><input type="checkbox" ${user.access_stock ? "checked" : ""}></td>
        <td><input type="checkbox" ${user.access_production ? "checked" : ""}></td>
        <td><input type="checkbox" ${user.access_reports ? "checked" : ""}></td>
        <td><button class="save-btn">Salvar</button></td>
      `;

      // Evento de salvar permissões
      const saveBtn = row.querySelector(".save-btn");
      saveBtn.addEventListener("click", async () => {
        const updatedPermissions = {
          access_stock: row.children[2].querySelector("input").checked,
          access_production: row.children[3].querySelector("input").checked,
          access_reports: row.children[4].querySelector("input").checked,
        };

        await savePermissions(user.id_user, updatedPermissions);
      });

      tbody.appendChild(row);
    });
  } catch (error) {
    console.error("Erro ao carregar permissões:", error);
  }
}

// Função para enviar atualização ao backend
async function savePermissions(id_user, updatedPermissions) {
  try {
    const response = await fetch(`http://localhost:3000/admin/access/${id_user}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedPermissions),
    });

    if (!response.ok) throw new Error("Falha ao atualizar permissões");

    alert("✅ Permissões atualizadas com sucesso!");
  } catch (error) {
    console.error("Erro ao salvar permissões:", error);
    alert("❌ Erro ao salvar permissões.");
  }
}

// Chama o carregamento automático ao abrir a aba Administração
document.addEventListener("DOMContentLoaded", () => {
  loadPermissions();
});

// navegação
function showTab(event, secao) {
  event.preventDefault();

  // Atualiza visual das abas
  document.querySelectorAll(".access-control2 a").forEach(function (tab) {
    tab.classList.remove("selected");
  });
  event.target.classList.add("selected");

  // Esconde todas as seções (menos a barra de abas)
  document.querySelectorAll(".tab-section").forEach(function (section) {
    if (!section.classList.contains("access-control2")) {
      section.style.display = "none";
    }
  });

  // Mostra a barra de abas e a seção desejada
  document.querySelector(".access-control2").style.display = "flex";
  const secaoEl = document.getElementById(secao);
  if (secaoEl) secaoEl.style.display = "block";
}

function togglePerms(btn) {
  const content = btn.parentElement.querySelector(".perms-content");
  const arrow = btn.querySelector(".arrow");
  content.classList.toggle("active");
  arrow.classList.toggle("down");
}

function irParaSecao(secao) {
  // Esconde o bloco de módulos
  const modulosSection = document.getElementById("modulos-section");
  if (modulosSection) modulosSection.style.display = "none";

  // Mostra a barra de abas e a seção selecionada
  const accessControl2 = document.querySelector(".access-control2");
  if (accessControl2) accessControl2.style.display = "flex";

  document.querySelectorAll(".tab-section").forEach((el) => {
    if (!el.classList.contains("access-control2")) {
      el.style.display = "none";
    }
  });

  const secaoEl = document.getElementById(secao);
  if (secaoEl) secaoEl.style.display = "block";

  // Atualiza dados do backend
  fetch("/studentAccess/today")
    .then((res) => res.json())
    .then((data) => {
      const { total_today, total_students, lunch_count, dinner_count } = data;
      const percentage =
        total_students > 0
          ? Math.round((total_today / total_students) * 100)
          : 0;

      document.querySelector(".percentage span").textContent = `${percentage}%`;

      const infoDivs = document.querySelectorAll(".info > div");
      if (infoDivs.length >= 2) {
        infoDivs[0].querySelector("p").textContent = `Qtd: ${lunch_count}`;
        infoDivs[1].querySelector("p").textContent = `Qtd: ${dinner_count}`;
      }
      
      // Abre o relatório no navegador para download
      document
        .querySelector(".buttons button").addEventListener("click", () => {
          window.open("/studentAccess/report", "_blank");
        });

      // Destaca aba correta
      document
        .querySelectorAll(".access-control2 a")
        .forEach((a) => a.classList.remove("selected"));
      const tab = Array.from(
        document.querySelectorAll(".access-control2 a")
      ).find((a) => a.getAttribute("onclick")?.includes(secao));
      if (tab) tab.classList.add("selected");
    })
    .catch((error) => {
      console.error("Failed to load student access data:", error);
    });
}

// Ao carregar a página: mostrar só o bloco de módulos e esconder as abas
window.addEventListener("DOMContentLoaded", () => {
  const modulosSection = document.getElementById("modulos-section");
  if (modulosSection) modulosSection.style.display = "";

  document
    .querySelectorAll(".tab-section")
    .forEach((el) => (el.style.display = "none"));
  document.querySelector(".access-control2").style.display = "none";
});
