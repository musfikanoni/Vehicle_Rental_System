
import { pool } from "../../config/db";

const createVehicleIntoDB = async (payload: Record<string, unknown>) => {
  const { vehicle_name, type, registration_number, daily_rent_price, availability_status } = payload;

  const vehicle = await pool.query(
    `
      INSERT INTO vehicles(vehicle_name, type, registration_number, daily_rent_price, availability_status) VALUES($1, $2, $3, $4, $5) RETURNING vehicle_name, type, registration_number, daily_rent_price, availability_status, created_at, updated_at
    `,
    [vehicle_name, type, registration_number, daily_rent_price, availability_status],
  );

  return vehicle;
};

const getAllVehiclesFromDB = async () => {

  const vehicles = await pool.query(
    `
      SELECT id, vehicle_name, type, registration_number, daily_rent_price, availability_status FROM vehicles
    `,

  );

    if (vehicles.rows.length === 0) {
    throw new Error("Vehicles not found!");
  }

  return vehicles;
};

export const vehicleServices = {
  createVehicleIntoDB,
  getAllVehiclesFromDB
};
