require('dotenv').config();

module.exports = {
   mysql:{
      host: process.env.MYSQL_HOST,
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_NAME,
      port: process.env.MYSQL_PORT 
}
}