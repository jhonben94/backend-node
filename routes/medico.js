var express = require('express');
var bcrypt = require('bcrypt');
var app = express();
var mdAutenticacion = require('../middlewares/autenticacion');
var Medico = require('../models/medico');

// =======================
// Obtener medicos
// =======================
app.get('/', (req, res, next) => {

    Medico.find({}) // condiciones para filtrar
        // campos que se recuperan
        .populate('usuario', 'nombre email')
        .populate('hospital')
        .exec(
            (error, coleccionMedicos) => {
                if (error) {
                    res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando medicos.',
                        errors: error
                    });

                }
                res.status(200).json({
                    ok: true,
                    mensaje: 'Medicos encontrados.',
                    medicos: coleccionMedicos
                });

            });

});
app.post('/', mdAutenticacion.verificarToken, (req, res) => {
    var body = req.body;
    var medico = new Medico({
        nombre: body.nombre,
        usuario: body.usuario,
        hospital: body.hospital
    });
    medico.save((error, medicoGuardado) => {
        if (error) {
            res.status(400).json({
                ok: false,
                mensaje: 'Error al crear medico.',
                errors: error
            });

        }

        res.status(201).json({
            ok: true,
            mensaje: 'Medico creado.',
            medico: medicoGuardado
        });


    });
});
app.put('/:id', mdAutenticacion.verificarToken, (req, res) => {
    var id = req.params.id;
    var body = req.body;
    Medico.findById(id, (error, medico) => {
        if (error) {
            res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar hospital.',
                errors: error
            });

        }
        if (!medico) {
            res.status(400).json({
                ok: false,
                mensaje: 'El hospital no existe.',
                errors: error
            });

        }
        // se actualizan los cambios
        medico.nombre = body.nombre;

        medico.save((error, medicoBorrado) => {
            if (error) {
                res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar Hospital.',
                    errors: error
                });

            }
            res.status(200).json({
                ok: true,
                mensaje: 'Recurso actualizado.',
                medico: medicoBorrado
            });


        });
    });

});
// =======================
// Eliminar un  usuario
// =======================
app.delete('/:id', mdAutenticacion.verificarToken, (req, res) => {
    var id = req.params.id;

    Medico.findByIdAndRemove(id, (error, medicoBorrado) => {

        if (error) {
            res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar hospital.',
                errors: error
            });

        }
        if (!medicoBorrado) {
            res.status(400).json({
                ok: false,
                mensaje: 'No existe el hospital con ese id.',
                errors: error
            });

        }

        res.status(200).json({
            ok: true,
            mensaje: 'Recurso borrado.',
            meidco: medicoBorrado
        });


    });
});
module.exports = app;