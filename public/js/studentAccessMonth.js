document.addEventListener("DOMContentLoaded", () => {
  let currentDate = new Date();

  function updateCalendar() {
    const month = currentDate.getMonth() + 1;
    const year = currentDate.getFullYear();

    document.getElementById("currentMonth").textContent = currentDate
      .toLocaleDateString("pt-BR", { month: "long", year: "numeric" })
      .toUpperCase();

    loadMonthAccess(month, year);
  }

  document.getElementById("prevMonth").addEventListener("click", () => {
    currentDate.setMonth(currentDate.getMonth() - 1);
    updateCalendar();
  });

  document.getElementById("nextMonth").addEventListener("click", () => {
    currentDate.setMonth(currentDate.getMonth() + 1);
    updateCalendar();
  });

  async function loadMonthAccess(month, year) {
    try {
      const response = await fetch(
        `/studentAccess/month?year=${year}&month=${month}`
      );
      const accessData = await response.json();

      renderCalendar(month, year, accessData);
    } catch (error) {
      console.error("Erro ao carregar dados mensais:", error);
    }
  }

  function renderCalendar(month, year, accessData) {
    const calendarGrid = document.getElementById("calendarGrid");
    calendarGrid.innerHTML = "";

    const firstDay = new Date(year, month - 1, 1).getDay();
    const daysInMonth = new Date(year, month, 0).getDate();

    for (let i = 0; i < firstDay; i++) {
      calendarGrid.innerHTML += `<div></div>`;
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${year}-${String(month).padStart(2, "0")}-${String(
        day
      ).padStart(2, "0")}`;

      const dayData = accessData.find((item) => {
        const formatted = item.day.split("T")[0];
        return formatted === dateStr;
      });

      const html = `
                <div class="calendar-day">
                    <div class="calendar-day-number">${day}</div>

                    ${
                      dayData
                        ? `
                        <div class="menu-item"><b>Total:</b> ${dayData.total}</div>
                        <div class="menu-item"><b>Almoço:</b> ${dayData.lunch_count}</div>
                        <div class="menu-item"><b>Jantar:</b> ${dayData.dinner_count}</div>
                    `
                        : `
                        <div class="menu-item" style="background:#eee; opacity:0.6;">
                            Sem registros
                        </div>
                    `
                    }
                </div>
            `;

      calendarGrid.innerHTML += html;
    }
  }

  updateCalendar();
});
