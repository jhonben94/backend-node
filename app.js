// Requires => librerias necesarias
var express = require('express');
var mongoose = require('mongoose');

// inicializar variables.

var app = express();
// conexion a la DB
mongoose.connect('mongodb://localhost:27017/hospitalDB', (error, resp) => {
    if (error) throw error;
    console.log('BD: \x1b[32m%s\x1b[0m', 'online');
});
// rutas
app.get('/', (req, res, next) => {
    res.status(403).json({
        ok: true,
        mensaje: 'Peticion realizada correctamente.'
    });
});

// escuchar peticiones.
app.listen(3000, () => {
    console.log('Express server en el puerto 3000: \x1b[32m%s\x1b[0m', 'online');
});