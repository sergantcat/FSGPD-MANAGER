const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
     ssl: { rejectUnauthorized: false } 
});

async function getTrainingChoices(focusedValue) {
    try {
        const query = `SELECT id, name FROM trainings WHERE status = 'hosted' AND name ILIKE $1 LIMIT 25;`;
        const res = await pool.query(query, [`%${focusedValue}%`]);
        return res.rows.map(row => ({ name: row.name, value: String(row.id) }));
    } catch (err) {
        console.error(err);
        return [];
    }
}

module.exports = { getTrainingChoices };
