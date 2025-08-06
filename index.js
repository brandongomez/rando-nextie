const express = require("express");
const { Pool } = require("pg");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000;


// Connect to Heroku Postgres
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false } // Required by Heroku Postgres
});

app.get("/api/random-user", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM users ORDER BY RANDOM() LIMIT 1");
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "No users found" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

app.listen(port, () => {
  console.log(`API running on port ${port}`);
});
