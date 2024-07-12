const express = require('express');
const morgan =  require('morgan');
const cors = require('cors');
const app = express();
const config = require('./config');
//Cors
app.use(morgan('dev'));
app.use(cors());
app.use(express.json());
app.disable('x-powered-by');

//Routes
app.use(require('./src/routes/route.evento'))
//Servidor
port = process.env.PORT || 3000
app.listen(port, () => {
       console.log(`Server running on port ${port}`);
});
