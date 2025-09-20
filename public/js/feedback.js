document.getElementById('feedbackForm').addEventListener('submit', async (e) => {
    e.preventDefault(); // evita o submit padrão

    const id_rm = document.getElementById('rm').value;
    const date_feedback = document.getElementById('date').value;
    const comment = document.getElementById('comentary').value;

    const ratingSlider = document.getElementById('rating');
    let ratingValue;

    switch (ratingSlider.value) {
        case '1':
            ratingValue = 'bad';   // 😡
            break;
        case '2':
            ratingValue = 'mid';   // 😐
            break;
        case '3':
            ratingValue = 'good';  // 😍
            break;
        default:
            ratingValue = 'mid';
    }

    console.log('Enviando feedback:', { id_rm, date_feedback, rating: ratingValue, comment });

    try {
        const response = await fetch('http://localhost:3000/feedback/submitFeedback', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id_rm, date_feedback, rating: ratingValue, comment })
        });

        const data = await response.json();
        console.log('Resposta do servidor:', data);
        //alert(data.message);
        showPopup("Sucesso!", "Feedback enviado com sucesso!");

        document.getElementById('feedbackForm').reset();
    } catch (error) {
        console.error('Erro ao enviar feedback:', error);
        //alert('Erro ao enviar feedback.');
        showPopup("Erro", "Erro ao enviar feedback.");
    }
});
