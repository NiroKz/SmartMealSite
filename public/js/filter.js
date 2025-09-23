// filter.js
document.addEventListener("DOMContentLoaded", () => {
  const courseSelect = document.getElementById("course");
  const periodSelect = document.getElementById("period");
  const gradeSelect = document.getElementById("grade");
  const dateInput = document.getElementById("filterDate");
  const filterBtn = document.getElementById("filterBtn");
  const tableBody = document.getElementById("studentsTableBody");
  const selectedDateDisplay = document.getElementById("selectedDateDisplay");

  dateInput.value = new Date().toISOString().split("T")[0];

  // Carrega cursos
  async function loadCourses() {
    try {
      const response = await fetch("https://smartmealsite-backend.up.railway.app/filter/courses");
      if (!response.ok) throw new Error("Erro ao buscar cursos");
      const courses = await response.json();
      courseSelect.innerHTML = '<option value="">Selecione</option>';
      courses.forEach((item) => {
        const option = document.createElement("option");
        option.value = item.course;
        option.textContent = item.course;
        courseSelect.appendChild(option);
      });
    } catch (error) {
      console.error("Falha ao carregar cursos:", error);
    }
  }

  // Função de cor
  function getStatusColor(status) {
    switch (status) {
      case "green":
        return "#4CAF50";
      case "yellow":
        return "#FFC107";
      case "red":
        return "#F44336";
      default:
        return "#fff";
    }
  }

  // Busca e exibe alunos
  async function fetchAndDisplayStudents() {
    const course = courseSelect.value;
    const period = periodSelect.value;
    const grade = gradeSelect.value;
    const date = dateInput.value;

    if (!course || !period || !grade || !date) {
      alert("Preencha todos os filtros.");
      return;
    }

    const url = `https://smartmealsite-backend.up.railway.app/filter/students?${new URLSearchParams({
      course,
      period,
      grade,
      date,
    }).toString()}`;

    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error("Erro ao buscar dados dos alunos");
      const students = await response.json();
      tableBody.innerHTML = "";

      selectedDateDisplay.textContent = `Exibindo resultados para: ${new Date(
        date
      ).toLocaleDateString("pt-BR")}`;

      if (!students.length) {
        tableBody.innerHTML = `<tr><td colspan="6">Nenhum aluno encontrado.</td></tr>`;
        return;
      }

      students.forEach((student) => {
        const formatTime = (t) =>
          t
            ? new Date(t).toLocaleTimeString("pt-BR", {
                hour: "2-digit",
                minute: "2-digit",
              })
            : "--/--";

        const lunchCell = `<td style="background-color:${getStatusColor(
          student.lunch.status
        )}; color:${
          student.lunch.status === "yellow" ? "black" : "white"
        }; text-align:center;">${formatTime(student.lunch.time)}</td>`;
        const dinnerCell = `<td style="background-color:${getStatusColor(
          student.dinner.status
        )}; color:${
          student.dinner.status === "yellow" ? "black" : "white"
        }; text-align:center;">${formatTime(student.dinner.time)}</td>`;

        const lunchRepeatCell = `<td style="background-color:${
          student.lunch.repeat_times !== "--/--" ? "#4CAF50" : "red"
        }; text-align:center;">${student.lunch.repeat_times}</td>`;
        const dinnerRepeatCell = `<td style="background-color:${
          student.dinner.repeat_times !== "--/--" ? "#4CAF50" : "red"
        }; text-align:center;">${student.dinner.repeat_times}</td>`;

        const row = `
  <tr>
    <td>${student.id_rm}</td>
    <td>${student.student_name}</td>
    ${lunchCell}
    ${dinnerCell}
  </tr>`;

        tableBody.innerHTML += row;
      });
    } catch (error) {
      console.error("Erro ao aplicar filtro:", error);
      tableBody.innerHTML = `<tr><td colspan="6">Erro ao carregar dados.</td></tr>`;
    }
  }

  filterBtn.addEventListener("click", fetchAndDisplayStudents);
  loadCourses();
});
