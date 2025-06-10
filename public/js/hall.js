const addSchoolBtn = document.getElementById("addSchoolBtn");
const formBox = document.getElementById("formBox");
const saveSchoolBtn = document.getElementById("saveSchoolBtn");
const schoolList = document.getElementById("schoolList");

// Botão para mostrar/esconder o formulário
addSchoolBtn.addEventListener("click", () => {
  formBox.style.display = formBox.style.display === "flex" ? "none" : "flex";
});

// Botão para salvar escola
saveSchoolBtn.addEventListener("click", async (e) => {
  e.preventDefault();

  const nome_escola = document.getElementById("schoolName").value;
  const rua_endereco = document.getElementById("schoolAddress").value;
  const fone = document.getElementById("schoolPhone").value;
  const token = sessionStorage.getItem("token");

  if (!nome_escola || !rua_endereco || !fone) {
    alert("Por favor, preencha todos os campos!");
    return;
  }

  try {
    const response = await fetch("/school/addSchools", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({ nome_escola, rua_endereco, fone }),
    });

    const data = await response.json();

    if (response.ok) {
      createSchoolCard({ nome_escola, rua_endereco, fone });

      document.getElementById("schoolName").value = "";
      document.getElementById("schoolAddress").value = "";
      document.getElementById("schoolPhone").value = "";

      formBox.style.display = "none";
    } else {
      alert(data.erro || "Erro ao cadastrar escola.");
    }
  } catch (err) {
    console.error(err);
    alert("Erro na conexão com o servidor.");
  }
});

// Criar o card da escola
function createSchoolCard(school) {
  const card = document.createElement("div");
  card.className = "school-card";

  card.innerHTML = `
    <div class="info">
      <b>${school.nome_escola}</b>
      <span>${school.rua_endereco}</span>
      <span>${school.fone}</span>
    </div>
    <div class="icon">▶</div>
  `;

  schoolList.appendChild(card);
}

// Ao carregar, mostrar escolas já salvas
window.addEventListener("DOMContentLoaded", async () => {
  const token = sessionStorage.getItem("token");

  try {
    const response = await fetch("/school/listSchool", {
      headers: {
        Authorization: "Bearer " + token,
      },
    });

    const escolas = await response.json();

    if (!response.ok) {
      alert(escolas.erro || "Erro ao carregar escolas.");
      return;
    }

    escolas.forEach(createSchoolCard);
  } catch (err) {
    console.error("Erro ao carregar escolas:", err);
    alert("Erro ao conectar com o servidor.");
  }
});
