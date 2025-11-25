document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.getElementById("searchInput");
  const searchBtn = document.getElementById("searchBtn");
  const resultsContainer = document.getElementById("resultsContainer");

  const modal = document.getElementById("studentModal");
  const closeModal = document.getElementById("closeModal");
  const addBtn = document.getElementById("addBtn");
  const form = document.getElementById("studentForm");

  const courseSelect = document.getElementById("Course");
  const yearSelect = document.getElementById("Year");
  const periodSelect = document.getElementById("Period");

  let classes = [];
  let editMode = false; // false = adicionar, true = editar

  // -------------------------------------------------------------
  // 🔹 1) Carregar TODAS as turmas do backend
  // -------------------------------------------------------------
  fetch("/student/classes")
    .then((res) => res.json())
    .then((data) => {
      classes = data;

      // Preenche cursos únicos
      const courses = [...new Set(classes.map((c) => c.course))];
      courses.forEach((course) => {
        const option = document.createElement("option");
        option.value = course;
        option.textContent = course;
        courseSelect.appendChild(option);
      });
    })
    .catch((err) => console.error("Erro ao carregar turmas:", err));

  // Quando escolher curso → carregar anos
  courseSelect.addEventListener("change", () => {
    const selectedCourse = courseSelect.value;
    const grades = [
      ...new Set(
        classes.filter((c) => c.course === selectedCourse).map((c) => c.grade)
      ),
    ];

    yearSelect.innerHTML = '<option value="">Selecione o ano</option>';
    grades.forEach((grade) => {
      const option = document.createElement("option");
      option.value = grade;
      option.textContent = grade;
      yearSelect.appendChild(option);
    });

    periodSelect.innerHTML = '<option value="">Selecione o período</option>';
  });

  // Quando escolher ano → carregar períodos
  yearSelect.addEventListener("change", () => {
    const selectedCourse = courseSelect.value;
    const selectedGrade = yearSelect.value;

    const periods = [
      ...new Set(
        classes
          .filter(
            (c) => c.course === selectedCourse && c.grade === selectedGrade
          )
          .map((c) => c.period)
      ),
    ];

    periodSelect.innerHTML = '<option value="">Selecione o período</option>';
    periods.forEach((period) => {
      const option = document.createElement("option");
      option.value = period;
      option.textContent = period;
      periodSelect.appendChild(option);
    });
  });

  // -------------------------------------------------------------
  // 🔍 2) Buscar alunos
  // -------------------------------------------------------------
  async function searchStudents() {
    const query = searchInput.value.trim();
    if (!query) {
      resultsContainer.innerHTML =
        "<p class='empty'>Digite algo para buscar...</p>";
      return;
    }

    try {
      const res = await fetch(`/student/search?query=${query}`);
      const alunos = await res.json();

      renderCards(alunos);
    } catch (err) {
      console.error("Erro ao buscar alunos:", err);
    }
  }

  searchBtn.addEventListener("click", searchStudents);
  searchInput.addEventListener("keyup", (e) => {
    if (e.key === "Enter") searchStudents();
  });

  // -------------------------------------------------------------
  // 🟦 3) Exibir os cards dos alunos
  // -------------------------------------------------------------
  function renderCards(alunos) {
    resultsContainer.innerHTML = "";

    if (!alunos || alunos.length === 0) {
      resultsContainer.innerHTML =
        "<p class='empty'>Nenhum aluno encontrado.</p>";
      return;
    }

    alunos.forEach((aluno) => {
      const card = document.createElement("div");
      card.className = "student-card";

      card.innerHTML = `
        <h3>${aluno.student_name}</h3>
        <p><strong>RM:</strong> ${aluno.id_rm}</p>
        <p><strong>Curso:</strong> ${aluno.course} - ${aluno.grade}º - ${aluno.period}</p>
        <p><strong>Responsável:</strong> ${aluno.student_legal_guardian}</p>
        <p><strong>Resrição Alimentar:</strong> ${aluno.food_restriction}</p>

        <button class="editBtn" data-id="${aluno.id_student}">Editar</button>
        <button class="deleteBtn" data-id="${aluno.id_student}">Excluir</button>
      `;

      resultsContainer.appendChild(card);
    });

    document.querySelectorAll(".editBtn").forEach((btn) => {
      btn.addEventListener("click", openEditModal);
    });

    document.querySelectorAll(".deleteBtn").forEach((btn) => {
      btn.addEventListener("click", deleteStudent);
    });
  }

  // -------------------------------------------------------------
  // ✏️ 4) Abrir modal para EDITAR aluno
  // -------------------------------------------------------------
  function openEditModal(e) {
    editMode = true;
    const id = e.target.dataset.id;

    // Dados do card
    const card = e.target.closest(".student-card");
    const infos = card.querySelectorAll("p");

    document.getElementById("modalTitle").textContent = "Editar Aluno";

    document.getElementById("edit_id_student").value = id;
    document.getElementById("nome").value = card.querySelector("h3").textContent;
    document.getElementById("RM").value = infos[0].textContent.replace("RM: ", "");
    document.getElementById("student_legal_guardian").value =
      infos[2].textContent.replace("Responsável: ", "");
    document.getElementById("food_restriction").value = "";

    modal.classList.remove("hidden");
  }

  // -------------------------------------------------------------
  // ➕ 5) Abrir modal para ADICIONAR aluno
  // -------------------------------------------------------------
  addBtn.addEventListener("click", () => {
    editMode = false;
    form.reset();

    document.getElementById("modalTitle").textContent = "Adicionar Aluno";

    modal.classList.remove("hidden");
  });

  // -------------------------------------------------------------
  // ❌ 6) Fechar modal
  // -------------------------------------------------------------
  closeModal.addEventListener("click", () => modal.classList.add("hidden"));

  // -------------------------------------------------------------
  // 💾 7) SALVAR (adicionar ou editar)
  // -------------------------------------------------------------
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const selectedClass = classes.find(
      (c) =>
        c.course === courseSelect.value &&
        c.grade === yearSelect.value &&
        c.period === periodSelect.value
    );

    if (!selectedClass) {
      alert("Selecione curso/ano/período.");
      return;
    }

    const data = {
      nome: document.getElementById("nome").value,
      RM: document.getElementById("RM").value,
      id_class: selectedClass.id_class,
      student_legal_guardian: document.getElementById("student_legal_guardian")
        .value,
      food_restriction: document.getElementById("food_restriction").value,
    };

    let url = "/student/register";
    let method = "POST";

    if (editMode) {
      const id = document.getElementById("edit_id_student").value;
      url = `/student/update/${id}`;
      method = "PUT";
    }

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        alert(editMode ? "Aluno atualizado!" : "Aluno cadastrado!");
        modal.classList.add("hidden");
        searchStudents();
      } else {
        alert("Erro ao salvar aluno.");
      }
    } catch (err) {
      console.error(err);
    }
  });

  // -------------------------------------------------------------
  // 🗑️ 8) Excluir aluno
  // -------------------------------------------------------------
  async function deleteStudent(e) {
    const id = e.target.dataset.id;

    if (!confirm("Tem certeza que deseja excluir este aluno?")) return;

    try {
      const res = await fetch(`/student/delete/${id}`, { method: "DELETE" });

      if (res.ok) {
        alert("Aluno excluído!");
        searchStudents();
      } else {
        alert("Erro ao excluir aluno.");
      }
    } catch (err) {
      console.error(err);
    }
  }
});
