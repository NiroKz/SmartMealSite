const form = document.getElementById("formBox");
const telefoneInput = document.getElementById("schoolPhone");

// Funções de formatação de telefone e CPF (mantidas do seu código)
telefoneInput.addEventListener("input", function (e) {
  let input = e.target.value.replace(/\D/g, "").slice(0, 11);
  let formatted = "";
  if (input.length > 0) formatted += "(" + input.substring(0, 2);
  if (input.length >= 3) formatted += ") " + input.substring(2, 7);
  if (input.length >= 8) formatted += "-" + input.substring(7, 11);
  e.target.value = formatted;
});

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

  const nome_escola = document.getElementById("schoolName").value.trim();
  const rua_endereco = document.getElementById("schoolAddress").value.trim();
  const fone = document.getElementById("schoolPhone").value.trim();
  const token = localStorage.getItem("token");

  if (!nome_escola || !rua_endereco || !fone) {
    //alert("Por favor, preencha todos os campos!");
    showPopup("Por favor, preencha todos os campos!");
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
      // Adiciona o card na tela
      createSchoolCard({
        school_name: nome_escola,
        address_road: rua_endereco,
        phone: fone,
      });

      // Limpa inputs
      document.getElementById("schoolName").value = "";
      document.getElementById("schoolAddress").value = "";
      document.getElementById("schoolPhone").value = "";

      // Fecha o formulário
      formBox.style.display = "none";
    } else {
      //alert(data.erro || "Erro ao cadastrar escola.");
      showPopup("Erro",data.erro || "Erro ao cadastrar escola.");
    }
  } catch (err) {
    console.error(err);
    //alert("Erro na conexão com o servidor.");
    showPopup("Erro","Erro na conexão com o servidor.");
  }
});

// Criar o card da escola
function createSchoolCard(school) {
  const card = document.createElement("div");
  card.className = "school-card";

  card.innerHTML = `
    <div class="info">
      <b>${school.school_name}</b>
      <span>${school.address_road}</span>
      <span>${school.phone}</span>
    </div>
    <a class="play" href="accessControl.html">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="24" height="24">
        <polygon points="30,20 80,50 30,80" fill="#333" />
      </svg>
    </a>
  `;

  schoolList.appendChild(card);
}

// Ao carregar, mostrar escolas já salvas
window.addEventListener("DOMContentLoaded", async () => {
  const is_user_admin = localStorage.getItem("is_user_admin");

  if (is_user_admin === "1") {
    // Admin → pode cadastrar escola
    addSchoolBtn.style.display = "flex";
    formBox.style.display = "none";
  } else {
    // Funcionário → não pode cadastrar escola
    addSchoolBtn.style.display = "none";
    formBox.style.display = "none";
  }

  carregarEscolas();
});

// Carregar escolas já cadastradas
async function carregarEscolas() {
  const token = localStorage.getItem("token");

  try {
    const response = await fetch("/school/listSchool", {
      headers: { Authorization: "Bearer " + token },
    });

    if (!response.ok) {
      console.error("Erro ao buscar escolas.");
      return;
    }

    const escolas = await response.json();

    if (!Array.isArray(escolas)) {
      console.error("Formato inválido recebido do servidor:", escolas);
      return;
    }

    escolas.forEach((e) => createSchoolCard(e));
  } catch (err) {
    console.error("Erro ao carregar escolas:", err);
  }
}
