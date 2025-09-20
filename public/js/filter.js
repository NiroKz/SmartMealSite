// Carregar cursos dinâmicos ao abrir a página
document.addEventListener("DOMContentLoaded", async () => {
  try {
    const response = await fetch("/filter/courses");
    const data = await response.json();

    const courseSelect = document.getElementById("course");
    courseSelect.innerHTML = `<option value="">Selecione</option>`; // reset

    data.forEach((item) => {
      const option = document.createElement("option");
      option.value = item.course; // valor do banco (ex: INFO, ADM, MECA)
      option.textContent = item.course; // texto exibido
      courseSelect.appendChild(option);
    });
  } catch (error) {
    console.error("Erro ao carregar cursos:", error);
    alert("Erro ao carregar cursos do servidor.");
  }
});

// Botão de aplicar filtro
document.getElementById("filterBtn").addEventListener("click", async () => {

  const course = document.getElementById("course").value;
  const period = document.getElementById("period").value;
  const grade = document.getElementById("grade").value;
  const date = document.getElementById("filterDate").value;

  if (!course || !period || !grade || !date) {
    alert("Selecione todos os filtros!");
    return;
  }


  try {
    const response = await fetch(
      `/filter/students?course=${course}&period=${period}&grade=${grade}&date=${date}`
    );
    const data = await response.json();

    // Exibir data escolhida acima da tabela
    const selectedDateDisplay = document.getElementById("selectedDateDisplay");
    const [ano, mes, dia] = date.split("-");
    selectedDateDisplay.textContent = `Data selecionada: ${dia}/${mes}/${ano}`;

    const tbody = document.getElementById("studentsTableBody");
    tbody.innerHTML = "";

    if (data.length === 0) {
      tbody.innerHTML = `<tr><td colspan="6" style="text-align:center;">Nenhum aluno encontrado</td></tr>`;
      return;
    }

    // Função para formatar hora ou deixar "--/--"
    const formatTime = (time, status) => {
      if (status === "green" && time) {
        const date = new Date(time);
        return date.toLocaleTimeString("pt-BR", {
          hour: "2-digit",
          minute: "2-digit",
        });
      }
      return "--/--";
    };

    // Preenche a tabela
    data.forEach((student) => {
      const tr = document.createElement("tr");

      tr.innerHTML = `
        <td>${student.id_rm}</td>
        <td>${student.student_name}</td>
        <td class="${student.lunch.status}">${formatTime(student.lunch.time, student.lunch.status)}</td>
        <td class="${student.dinner.status}">${formatTime(student.dinner.time, student.dinner.status)}</td>
      `;
      tbody.appendChild(tr);
    });
  } catch (error) {
    console.error("Erro ao carregar alunos:", error);
    alert("Erro ao buscar dados do servidor.");
  }
});
