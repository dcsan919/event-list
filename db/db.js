const mysql = require('mysql');
const config = require('../config');

let connection;
try {
       connection = mysql.createConnection({
              host: config.mysql.host,
              user: config.mysql.user,
              password: config.mysql.password,
              database: config.mysql.database,
              port: config.mysql.port
       })
        connection.connect((err) => {
            if (err) {
              console.error("Error al conectar a la base de datos:", err);
            } else {
              console.log(`Database connection succeful`);
            }
          });
} catch (error) {
       
}
module.exports = connection;
