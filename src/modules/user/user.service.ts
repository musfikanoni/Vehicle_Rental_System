import bcrypt from "bcryptjs";
import { pool } from "../../config/db";

const createUserIntoDB = async (payload: Record<string, unknown>) => {
  const { name, email, password, role, phone } = payload;
  const hashPassword = await bcrypt.hash(password as string, 12);
  const result = await pool.query(
    `
      INSERT INTO users(name, email, password, role, phone) VALUES($1, $2, $3, $4, $5) RETURNING id, name, email, role, phone, created_at, updated_at
    `,
    [name, email, hashPassword, role, phone],
  );

  delete result.rows[0].password;
  return result;
};

const getAllUserFromDB = async () => {

  const result = await pool.query(
    `
      SELECT id, name, email, phone, role, created_at, updated_at FROM users
    `,

  );

  delete result.rows[0].password;
  return result;
};

export const userServices = {
  createUserIntoDB,
  getAllUserFromDB
};
