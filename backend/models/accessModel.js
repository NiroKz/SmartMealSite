// models/accessModel.js
const db = require("../config/db"); // conexão com o banco

const AccessModel = {
  // 🔹 Busca todos os usuários e suas permissões
  getAllAccessWithUsers: async () => {
    const [rows] = await db.execute(`
      SELECT 
        u.id_user,
        u.user_name,
        u.email,
        a.access_stock,
        a.access_production,
        a.access_accesses,
        a.access_student_register,
        a.access_reports,
        a.access_student_perm,
        a.access_class_register
      FROM school_user u
      LEFT JOIN access a ON u.id_user = a.id_user
      ORDER BY u.user_name;
    `);
    return rows;
  },

  // 🔹 Atualiza as permissões de um usuário
  // models/accessModel.js
  updateUserAccess: async (id_user, permissions) => {
    const [result] = await db.execute(
      `
    UPDATE access
    SET 
      access_stock = ?,
      access_production = ?,
      access_accesses = ?,
      access_student_register = ?,
      access_reports = ?,
      access_student_perm = ?,
      access_class_register = ?
    WHERE id_user = ?;
  `,
      [
        permissions.access_stock,
        permissions.access_production,
        permissions.access_accesses,
        permissions.access_student_register,
        permissions.access_reports,
        permissions.access_student_perm,
        permissions.access_class_register,
        id_user,
      ]
    );

    return result; 
  },

  getAccessByUser: async (id_user) => {
  const [rows] = await db.execute(`
    SELECT 
      u.id_user,
      u.user_name,
      u.email,
      a.access_stock,
      a.access_production,
      a.access_accesses,
      a.access_student_register,
      a.access_reports,
      a.access_student_perm,
      a.access_class_register
    FROM school_user u
    LEFT JOIN access a ON u.id_user = a.id_user
    WHERE u.id_user = ?;
  `, [id_user]);

  return rows[0]; // retorna só 1 objeto ou undefined
}

};

module.exports = AccessModel;
