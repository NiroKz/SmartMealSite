document.addEventListener("DOMContentLoaded", () => {
  const courseSelect = document.getElementById("Course");
  const yearSelect = document.getElementById("Year"); // continua "Year" no HTML
  const periodSelect = document.getElementById("Period");
  const form = document.getElementById("studentForm");

  let classes = [];

  // 1️⃣ Busca todas as turmas do backend
  fetch("https://smartmealsite-backend.up.railway.app/student/classes")
    .then((res) => res.json())
    .then((data) => {
      classes = data;

      // popula cursos únicos
      const courses = [...new Set(classes.map((c) => c.course))];
      courses.forEach((course) => {
        const option = document.createElement("option");
        option.value = course;
        option.textContent = course;
        courseSelect.appendChild(option);
      });
    })
    .catch((err) => console.error("Erro ao carregar turmas:", err));

  // 2️⃣ Quando selecionar curso, popula anos disponíveis (grade)
  courseSelect.addEventListener("change", () => {
    const selectedCourse = courseSelect.value;
    const grades = [
      ...new Set(
        classes
          .filter((c) => c.course === selectedCourse)
          .map((c) => c.grade) // agora usando grade
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

  // 3️⃣ Quando selecionar ano (grade), popula períodos disponíveis
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

  // 4️⃣ Envio do formulário
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const selectedClass = classes.find(
      (c) =>
        c.course === courseSelect.value &&
        c.grade === yearSelect.value &&
        c.period === periodSelect.value
    );

    if (!selectedClass) {
      //messageDiv.style.color = "red";
      //messageDiv.textContent = "Selecione um curso, ano e período válidos.";
      showPopup("Erro.", "Selecione um curso, ano e período válidos.");
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

    try {
      const response = await fetch("https://smartmealsite-backend.up.railway.app/student/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.text();

      if (response.ok) {
        //messageDiv.style.color = "green";
        //messageDiv.textContent = result;
        showPopup("Sucesso!", "Aluno cadastrado com sucesso.");
        form.reset();
        yearSelect.innerHTML = '<option value="">Selecione o ano</option>';
        periodSelect.innerHTML = '<option value="">Selecione o período</option>';
      } else {
        //messageDiv.style.color = "red";
        //messageDiv.textContent = result;
        showPopup("Erro.", result);
      }
    } catch (err) {
      console.error(err);
      //messageDiv.style.color = "red";
      //messageDiv.textContent = "Erro ao cadastrar aluno.";
      showPopup("Erro.", "Erro ao cadastrar aluno.");
    }
  });
});
