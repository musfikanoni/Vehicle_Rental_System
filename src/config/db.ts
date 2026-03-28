import { Pool } from "pg";
import config from ".";

export const pool = new Pool({
  connectionString: `${config.connection_str}`,
});

export const initDB = async () => {
  await pool.query(`
        CREATE TABLE IF NOT EXISTS users(
        id SERIAL PRIMARY KEY,
        name VARCHAR(250) NOT NULL,
        email VARCHAR(150) UNIQUE NOT NULL,
        password TEXT NOT NULL,
        role VARCHAR(100) NOT NULL,
        phone VARCHAR(15) NOT NULL,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
        )
        `);

  await pool.query(`
        CREATE TABLE IF NOT EXISTS vehicles(
        id SERIAL PRIMARY KEY,
        vehicle_name VARCHAR(250) NOT NULL,
        type VARCHAR(150) NOT NULL,
        registration_number VARCHAR(20) UNIQUE NOT NULL,
        daily_rent_price VARCHAR(20) NOT NULL,
        availability_status VARCHAR(50) NOT NULL,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
        )
    `);

  await pool.query(`
        CREATE TABLE IF NOT EXISTS Bookings(
          id SERIAL PRIMARY KEY,
          customer_id INT REFERENCES users(id) ON DELETE CASCADE,
          vehicle_id INT REFERENCES vehicles(id) ON DELETE CASCADE,
          rent_start_date DATE NOT NULL,
          rent_end_date DATE NOT NULL,
          total_price NUMERIC(10,2) NOT NULL CHECK (total_price > 0),
          status VARCHAR(20) NOT NULL CHECK (status IN ('active', 'cancelled', 'returned')),
          created_at TIMESTAMP DEFAULT NOW(),
          updated_at TIMESTAMP DEFAULT NOW(),

          CHECK (rent_end_date > rent_start_date)
        )
      `);
  console.log("Database connected");
};
