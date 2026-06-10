import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

export const query = (text, params) => pool.query(text, params);
export default pool;

pool.connect((err, client, release) => {
  if (err) {
    console.error('❌ Erreur PostgreSQL:', err.message);
  } else {
    console.log('✅ PostgreSQL connecté');
    release();
  }
});