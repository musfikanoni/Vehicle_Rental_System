import { Pool } from "pg";
import config from ".";



export const pool = new Pool({
  connectionString: `${config.connection_str}`
});

export const initDB = async () => {
  await pool.query(`
        CREATE TABLE IF NOT EXISTS users(
        id SERIAL PRIMARY KEY,
        name VARCHAR(250) NOT NULL,
        email VARCHAR(150) UNIQUE NOT NULL,
        password TEXT NOT NULL,
        role VARCHAR(100) NOT NULL,
        phone VARCHAR(15),
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
        )
        `)
        console.log("Database connected");
};