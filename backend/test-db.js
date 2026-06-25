const db = require('./src/config/db');

async function test() {
  try {
    const result = await db.query('SELECT NOW()');
    console.log(result.rows);
  } catch (err) {
    console.error(err);
  }
}

test();
