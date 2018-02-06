// Requires => librerias necesarias
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

var appRoutes = require('./routes/app_routes');
var appRoutesUsuario = require('./routes/usuario');
var appRoutesLogin = require('./routes/login');
// inicializar variables.

var app = express();
// body parse


// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

// rutas

app.use('/', appRoutes);
app.use('/usuario', appRoutesUsuario);
app.use('/login', appRoutesLogin);

// conexion a la DB

mongoose.connect('mongodb://localhost:27017/hospitalDB', (error, resp) => {
    if (error) throw error;
    console.log('BD: \x1b[32m%s\x1b[0m', 'online');
});


// escuchar peticiones.
app.listen(3000, () => {
    console.log('Express server en el puerto 3000: \x1b[32m%s\x1b[0m', 'online');
});