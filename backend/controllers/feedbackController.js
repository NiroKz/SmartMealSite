const db = require('../config/db'); // Conexão MySQL

// Função para salvar feedback
const submitFeedback = async (req, res) => {
    try {
        const { id_rm, date_feedback, rating, comment } = req.body;

        // Log no terminal para debugar
        console.log('=== Feedback recebido ===');
        console.log('RM:', id_rm);
        console.log('Data:', date_feedback);
        console.log('Rating:', rating);
        console.log('Comentário:', comment);
        console.log('========================');

        // Verifica se algum campo veio undefined ou vazio
        if (!id_rm || !date_feedback || !rating || !comment) {
            console.log('❌ Algum campo está vazio ou undefined');
            return res.status(400).json({ message: 'Preencha todos os campos corretamente!' });
        }

        const sql = `
            INSERT INTO feedback (id_rm, date_feedback, rating, comment)
            VALUES (?, ?, ?, ?)
        `;

        await db.execute(sql, [id_rm, date_feedback, rating, comment]);

        console.log('✅ Feedback salvo com sucesso!');
        res.status(200).json({ message: 'Feedback enviado com sucesso!' });
    } catch (error) {
        console.error('❌ Erro ao salvar feedback:', error);
        res.status(500).json({ message: 'Erro ao enviar feedback.' });
    }
};

// Função para listar todos os feedbacks (usada futuramente)
const getAllFeedbacks = async (req, res) => {
    try {
        const [rows] = await db.execute(`
            SELECT f.id_feedback, s.student_name, f.date_feedback, f.rating, f.comment
            FROM feedback f
            JOIN student s ON f.id_rm = s.id_rm
            ORDER BY f.date_feedback DESC
        `);
        res.status(200).json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao buscar feedbacks.' });
    }
};

module.exports = { submitFeedback, getAllFeedbacks };
