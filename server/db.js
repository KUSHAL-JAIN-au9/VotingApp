const Pool = require("pg").Pool;

const pool = new Pool({
  host: "localhost",
  user: "postgres",
  password: "963255",
  port: 5432,
  database: "reactapp"
});

module.exports = pool;
