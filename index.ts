import express from "express";
import cors from "cors";
import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: Number(process.env.DB_PORT) || 5432,
});

// Test DB Connection
pool.query("SELECT NOW()", (err, res) => {
  if (err) {
    console.error("Connection Error:", err.message);
  } else {
    console.log("Postgres Connected at:", res.rows[0].now);
  }
});

// Test Route
app.get("/", (req, res) => {
  res.send("Finance Tracker API is running!");
});

// Get all transactions
app.get("/transactions", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT t.id, t.date, t.description, t.amount, c.name AS category_name FROM transactions t JOIN categories c ON t.category_id = c.id ORDER BY t.date DESC",
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
