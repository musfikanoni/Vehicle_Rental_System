import bcrypt from "bcryptjs";
import { pool } from "../../config/db";

const createUserIntoDB = async (payload: Record<string, unknown>) => {
  const { name, email, password, role, phone } = payload;

  if ((password as string).length < 6) {
    throw new Error("Password must be at least 6 characters");
  }
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

const updateUserFromDB = async (
  userId: string,
  payload: Record<string, unknown>,
) => {
  let {
    name,
    email,
    phone,
    role
  } = payload;


  const user = await pool.query(
    `UPDATE users SET name=$1, email=$2, phone=$3, role=$4 WHERE id=$5 RETURNING id, name, email, phone, role`,
    [
      name,
      email,
      phone,
      role,
      userId,
    ],
  );

  if (user.rows.length === 0) {
    throw new Error("User not found!");
  }

  return user;
};

const deleteUserFromDB = async (userId: string) => {
  const user = await pool.query(`DELETE FROM users WHERE id = $1`, [
    userId,
  ]);

  return user;
};

export const userServices = {
  createUserIntoDB,
  getAllUserFromDB,
  updateUserFromDB,
  deleteUserFromDB
};
