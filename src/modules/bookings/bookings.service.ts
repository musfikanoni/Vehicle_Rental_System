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

const getAllBookingsFromDB = async (user: any) => {
  let query = "";
  let values: any[] = [];

  if (user.role === "admin") {
    query = `
      SELECT 
        b.id,
        b.customer_id,
        b.vehicle_id,
        b.rent_start_date,
        b.rent_end_date,
        b.total_price,
        b.status,

        u.name AS customer_name,
        u.email AS customer_email,

        v.vehicle_name,
        v.registration_number

      FROM bookings b
      JOIN users u ON b.customer_id = u.id
      JOIN vehicles v ON b.vehicle_id = v.id
    `;
  } else {
    query = `
      SELECT 
        b.id,
        b.vehicle_id,
        b.rent_start_date,
        b.rent_end_date,
        b.total_price,
        b.status,

        v.vehicle_name,
        v.registration_number,
        v.type

      FROM bookings b
      JOIN vehicles v ON b.vehicle_id = v.id
      WHERE b.customer_id = $1
    `;
    values = [user.id];
  }

  const result = await pool.query(query, values);

  if (result.rows.length === 0) {
    throw new Error("Bookings not found!");
  }

  return result.rows;
};



const updateBookingFromDB = async (
  bookingId: string,
  status: string,
  user: any
) => {
  const bookingRes = await pool.query(
    `SELECT * FROM bookings WHERE id = $1`,
    [bookingId]
  );

  if (bookingRes.rows.length === 0) {
    throw new Error("Booking not found!");
  }

  const booking = bookingRes.rows[0];


  if (user.role === "customer") {
    if (booking.customer_id !== user.id) {
      throw new Error("You are not authorized to cancel this booking");
    }

    if (status !== "cancelled") {
      throw new Error("Customers can only cancel bookings");
    }
  }

  if (user.role === "admin") {
    if (status !== "returned") {
      throw new Error("Admin can only mark as returned");
    }
  }


  const updatedBooking = await pool.query(
    `UPDATE bookings 
     SET status = $1, updated_at = NOW() 
     WHERE id = $2 
     RETURNING *`,
    [status, bookingId]
  );

  if (status === "returned") {
    await pool.query(
      `UPDATE vehicles 
       SET availability_status = 'available' 
       WHERE id = $1`,
      [booking.vehicle_id]
    );
  }


  if (status === "returned") {
    return {
      ...updatedBooking.rows[0],
      vehicle: {
        availability_status: "available",
      },
    };
  }

  return updatedBooking.rows[0];
};



export const bookingServices = {
  createBookingIntoDB,
  getAllBookingsFromDB,
  updateBookingFromDB,
};
