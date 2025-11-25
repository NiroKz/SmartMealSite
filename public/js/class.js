console.log("classList.js carregado!");

function formatDate(dateString) {
  if (!dateString) return "—";
  const date = new Date(dateString);
  return date.toLocaleDateString("pt-BR", { timeZone: "UTC" });
}


// ELEMENTOS
const classContainer = document.getElementById("classContainer");
const modal = document.getElementById("classModal");
const openModalBtn = document.getElementById("openModal");
const closeModalBtn = document.getElementById("closeModal");
const form = document.getElementById("classForm");

// CAMPOS DO FORM
const inputId = document.getElementById("classId");
const inputNome = document.getElementById("nome");
const inputPeriod = document.getElementById("period");
const inputGrade = document.getElementById("grade");

// ----------------------
// 🔹 **CARREGAR LISTA**
// ----------------------
async function loadClasses() {
  const response = await fetch(`/class/list`);
  const classes = await response.json();

  classContainer.innerHTML = "";

  classes.forEach((item) => {
    const card = document.createElement("div");
    card.className = "class-card";

    card.innerHTML = `
      <h3>${item.course}-${item.grade}${item.period}</h3>
      <p><b>Registrado em:</b> ${formatDate(item.date_registration)}</p>

      <div class="card-actions">
        <button class="btn-edit" onclick="editClass(${item.id_class})">Editar</button>
        <button class="btn-delete" onclick="deleteClass(${item.id_class})">Excluir</button>
      </div>
    `;

    classContainer.appendChild(card);
  });
}

// ----------------------
// 🔹 ABRIR MODAL
// ----------------------
openModalBtn.onclick = () => {
  form.reset();
  inputId.value = "";
  document.getElementById("modalTitle").textContent = "Cadastrar Turma";
  modal.classList.remove("hidden");
};

closeModalBtn.onclick = () => modal.classList.add("hidden");

// ----------------------
// 🔹 EDITAR TURMA
// ----------------------
async function editClass(id) {
  const response = await fetch(`/class/get/${id}`);
  const data = await response.json();

  // Preenche o modal
  inputId.value = data.id_class;
  inputNome.value = data.course;
  inputPeriod.value = data.period;
  inputGrade.value = data.grade;

  document.getElementById("modalTitle").textContent = "Editar Turma";

  modal.classList.remove("hidden");
}

window.editClass = editClass;

// ----------------------
// 🔹 SALVAR (CREATE/UPDATE)
// ----------------------
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const payload = {
    course: inputNome.value,
    period: inputPeriod.value,
    grade: inputGrade.value,
  };

  let url = "/class/register";
  let method = "POST";

  if (inputId.value) {
    url = `/class/update/${inputId.value}`;
    method = "PUT";
  }

  const response = await fetch(url, {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const result = await response.json();
  showPopup("Aviso", result.message);

  modal.classList.add("hidden");
  loadClasses();
});

// ----------------------
// 🔹 EXCLUIR TURMA
// ----------------------
async function deleteClass(id) {
  const response = await fetch(`/class/delete/${id}`, {
    method: "DELETE",
  });

  const result = await response.json();
  showPopup("Aviso", result.message);

  loadClasses();
}

window.deleteClass = deleteClass;

// Inicializa
loadClasses();
