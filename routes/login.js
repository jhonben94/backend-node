var express = require('express');
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
var app = express();
var Usuario = require('../models/usuario');
var SEED = require('../config/config');


app.post('/', (req, res) => {

    var body = req.body;

    Usuario.findOne({ email: body.email },
        (error, usuarioDB) => {
            console.log(usuarioDB);
            if (error) {
                res.status(500).json({
                    ok: false,
                    mensaje: 'Error al buscar usuarios.',
                    errors: error
                });

            }
            if (!usuarioDB) {
                res.status(400).json({
                    ok: false,
                    mensaje: 'Credenciales incorrectas. - mail',
                    errors: error
                });

            }

            if (bcrypt.compareSync(body.password, usuarioDB.password)) {
                res.status(400).json({
                    ok: false,
                    mensaje: 'Credenciales incorrectas. - password',
                    errors: error
                });

            }
            // crear un token
            usuarioDB.password = '';
            var token = jwt.sign({ usuario: usuarioDB }, SEED.SEED, { expiresIn: 14400 }); // 4 horas
            res.status(200).json({
                ok: true,
                mensaje: 'Usuario logueado.',
                usuario: usuarioDB,
                token: token,
                id: usuarioDB._id
            });

        });

});

module.exports = app;