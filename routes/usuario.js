var express = require('express');
var bcrypt = require('bcrypt');
var app = express();
var mdAutenticacion = require('../middlewares/autenticacion');
var Usuario = require('../models/usuario');
var jwt = require('jsonwebtoken');
// var SEED = require('../config/config');

// obtener todos los usuarios.
app.get('/', (req, res, next) => {

    Usuario.find({}, // condiciones para filtrar
            'nombre email role img')
        .exec( // campos que se recuperan
            (error, coleccionUsuario) => {
                if (error) {
                    res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando usuarios.',
                        errors: error
                    });

                }

                res.status(200).json({
                    ok: true,
                    mensaje: 'Usuarios encontrados.',
                    usuarios: coleccionUsuario
                });

            });

});

// =======================
// Actualizar un  usuario
// =======================
app.put('/:id', mdAutenticacion.verificarToken, (req, res) => {
    var id = req.params.id;
    var body = req.body;

    Usuario.findById(id, (error, usuario) => {
        if (error) {
            res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar usuarios.',
                errors: error
            });

        }
        if (!usuario) {
            res.status(400).json({
                ok: false,
                mensaje: 'El usuario con no existe.',
                errors: error
            });

        }
        usuario.nombre = body.nombre;
        usuario.email = body.email;
        usuario.role = body.role;

        usuario.save((error, usuarioGuardado) => {
            if (error) {
                res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar usuarios.',
                    errors: error
                });

            }

            res.status(200).json({
                ok: true,
                mensaje: 'Recurso actualizado.',
                usuario: usuarioGuardado
            });


        });

    });

});

// =======================
// Crear un nuevo usuario
// =======================

app.post('/', mdAutenticacion.verificarToken, (req, res) => {
    var body = req.body;
    var usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role,
        img: body.img
    });

    usuario.save((error, usuarioGuardado) => {
        if (error) {
            res.status(400).json({
                ok: false,
                mensaje: 'Error al crear usuarios.',
                errors: error
            });

        }

        res.status(201).json({
            ok: true,
            mensaje: 'Recurso creado.',
            usuario: usuarioGuardado
        });


    });

});
// =======================
// Eliminar un  usuario
// =======================
app.delete('/:id', mdAutenticacion.verificarToken, (req, res) => {
    var id = req.params.id;
    Usuario.findByIdAndRemove(id, (error, usuarioBorrado) => {

        if (error) {
            res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar usuarios.',
                errors: error
            });

        }
        if (!usuarioBorrado) {
            res.status(400).json({
                ok: false,
                mensaje: 'No existe el usuario con ese id.',
                errors: error
            });

        }

        res.status(200).json({
            ok: true,
            mensaje: 'Recurso borrado.',
            usuario: usuarioBorrado
        });


    });
});
module.exports = app;