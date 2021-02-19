const { Pool } = require("pg");
// 이 Pool 클래스로 pool instance를 만들 수 있다.

const { user, host, database, password, port } = require("../config").DB;

const pool = new Pool({ user, host, database, password, port });

module.exports = pool;
