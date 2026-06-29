import "dotenv/config";
import mysql from "mysql2/promise";

const dbUrl = process.env.DATABASE_URL;
if (!dbUrl && process.env.NODE_ENV !== "production") {
  console.warn("DATABASE_URL not found, some features may not work");
}

const url = new URL(dbUrl || "mysql://localhost/placeholder");
const pool = mysql.createPool({
  host: url.hostname,
  user: url.username,
  password: url.password,
  database: url.pathname.slice(1),
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export async function query(sql: string, values?: any[]) {
  const connection = await pool.getConnection();
  try {
    const [results] = await connection.execute(sql, values);
    return results;
  } finally {
    connection.release();
  }
}

export async function execute(sql: string, values?: any[]) {
  const connection = await pool.getConnection();
  try {
    const result = await connection.execute(sql, values);
    return result;
  } finally {
    connection.release();
  }
}
