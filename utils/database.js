const Pool = require('neo4j-driver');

const pool = Pool.driver('bolt://localhost:7687', Pool.auth.basic('neo4j', '12345'));

db_session = pool.session();


module.exports = db_session;