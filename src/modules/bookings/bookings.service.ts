import { pool } from "../../config/db";

const createBookingIntoDB = async (payload: Record<string, unknown>) => {
  const { customer_id, vehicle_id, rent_start_date, rent_end_date } = payload;

  const vehicleRes = await pool.query(
    `
        SELECT id, vehicle_name, daily_rent_price, availability_status FROM vehicles WHERE id = $1
    `,
    [vehicle_id],
  );

  if (vehicleRes.rowCount === 0) {
    throw new Error("Vehicle not found");
  }

  const vehicle = vehicleRes.rows[0];

  if (vehicle.availability_status !== "available") {
    throw new Error("Vehicle is not available");
  }

  const start = new Date(rent_start_date as number);
  const end = new Date(rent_end_date as number);

  const totalDays = end.getTime() - start.getTime();
  const number_of_days = totalDays / (1000 * 60 * 60 * 24);

  if (number_of_days <= 0) {
    throw new Error("Invalid booking dates");
  }
  const total_price = number_of_days * Number(vehicle.daily_rent_price);

  const booking = await pool.query(
    `
        INSERT INTO bookings (customer_id, vehicle_id, rent_start_date, rent_end_date, total_price, status) 
        VALUES($1, $2, $3, $4, $5, $6) 
        RETURNING * 
        `,
    [
      customer_id,
      vehicle_id,
      rent_start_date,
      rent_end_date,
      total_price,
      "active",
    ],
  );

  await pool.query(
    `UPDATE vehicles SET availability_status = 'unavailable' WHERE id = $1`,
    [vehicle_id],
  );

  return {
    booking: booking.rows[0],
    vehicle: {
      vehicle_name: vehicle.vehicle_name,
      daily_rent_price: vehicle.daily_rent_price,
    },
  };
};

// const getAllVehiclesFromDB = async () => {
//   const vehicles = await pool.query(
//     `
//       SELECT id, vehicle_name, type, registration_number, daily_rent_price, availability_status FROM vehicles
//     `,
//   );

//   if (vehicles.rows.length === 0) {
//     throw new Error("Vehicles not found!");
//   }

//   return vehicles;
// };

// const getVehicleByIdFromDB = async (vehicleId: string) => {
//   const vehicle = await pool.query(`SELECT * FROM vehicles WHERE id = $1`, [
//     vehicleId,
//   ]);

//   if (vehicle.rows.length === 0) {
//     throw new Error("Vehicle not found!");
//   }

//   return vehicle;
// };

// const updateVehicleFromDB = async (
//   vehicleId: string,
//   payload: Record<string, unknown>,
// ) => {
//   let {
//     vehicle_name,
//     type,
//     registration_number,
//     daily_rent_price,
//     availability_status,
//   } = payload;

//   const vehicle = await pool.query(
//     `UPDATE vehicles SET vehicle_name=$1, type=$2, registration_number=$3, daily_rent_price=$4, availability_status=$5 WHERE id=$6 RETURNING *`,
//     [
//       vehicle_name,
//       type,
//       registration_number,
//       daily_rent_price,
//       availability_status,
//       vehicleId,
//     ],
//   );

//   if (vehicle.rows.length === 0) {
//     throw new Error("Vehicle not found!");
//   }

//   return vehicle;
// };

// const deleteVehicleFromDB = async (vehicleId: string) => {
//   const vehicle = await pool.query(`DELETE FROM vehicles WHERE id = $1`, [
//     vehicleId,
//   ]);

//   return vehicle;
// };

export const bookingServices = {
  createBookingIntoDB,
  //   getAllVehiclesFromDB,
  //   getVehicleByIdFromDB,
  //   updateVehicleFromDB,
  //   deleteVehicleFromDB
};
