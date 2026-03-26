
import { pool } from "../../config/db";

const createVehicleIntoDB = async (payload: Record<string, unknown>) => {
  const { vehicle_name, type, registration_number, daily_rent_price, availability_status } = payload;

  const result = await pool.query(
    `
      INSERT INTO vehicles(vehicle_name, type, registration_number, daily_rent_price, availability_status) VALUES($1, $2, $3, $4, $5) RETURNING vehicle_name, type, registration_number, daily_rent_price, availability_status, created_at, updated_at
    `,
    [vehicle_name, type, registration_number, daily_rent_price, availability_status],
  );

  return result;
};

// const getAllUserFromDB = async () => {

//   const result = await pool.query(
//     `
//       SELECT id, name, email, phone, role, created_at, updated_at FROM users
//     `,

//   );

//   delete result.rows[0].password;
//   return result;
// };

export const vehicleServices = {
  createVehicleIntoDB,
//   getAllUserFromDB
};
