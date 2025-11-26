document.addEventListener("DOMContentLoaded", loadTodayAccessData);

async function loadTodayAccessData() {
    try {
        const response = await fetch("/studentAccess/today");

        if (!response.ok) {
            console.error("Erro ao buscar dados do dia");
            return;
        }

        const data = await response.json();
        console.log("Dados do dia:", data);

        // ------------ Atualiza % de alunos que comeram hoje ------------
        const percentElement = document.querySelector(".percentage span");
        let percentage = 0;

        if (data.total_students > 0) {
            percentage = ((data.total_today / data.total_students) * 100).toFixed(1);
        }

        percentElement.textContent = `${percentage}%`;

        // ------------ Atualiza quantidade de almoço ------------
        const lunchText = document.querySelector(".info div:nth-child(1) p:nth-child(2)");
        lunchText.textContent = `Qtd: ${data.lunch_count}`;

        // ------------ Atualiza quantidade de janta ------------
        const dinnerText = document.querySelector(".info div:nth-child(2) p:nth-child(2)");
        dinnerText.textContent = `Qtd: ${data.dinner_count}`;

    } catch (err) {
        console.error("Erro ao carregar dados do dia:", err);
    }
}
