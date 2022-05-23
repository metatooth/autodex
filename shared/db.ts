import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 30,
  ssl: { rejectUnauthorized: false },
});

export async function query<T>(text: string, params: Array<string>): Promise<pkg.QueryResult<T>> {
  // const start = Date.now();
  const res = await pool.query<T>(text, params);
  // const duration = Date.now() - start;
  // console.log("executed query", { text, duration, rows: res.rowCount });
  return res;
}
