var express = require('express');
var bcrypt = require('bcrypt');
var app = express();
var mdAutenticacion = require('../middlewares/autenticacion');
var Hospital = require('../models/hospital');

// obtener todos los hospitales.
app.get('/', (req, res, next) => {

    Hospital.find({})
        .populate('usuario', 'nombre email')
        .exec( // campos que se recuperan
            (error, coleccionHospital) => {
                if (error) {
                    res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando Hospitals.',
                        errors: error
                    });

                }

                res.status(200).json({
                    ok: true,
                    mensaje: 'Hospitales encontrados.',
                    hospitales: coleccionHospital
                });

            });

});

// =======================
// Actualizar un  Hospital
// =======================
app.put('/:id', mdAutenticacion.verificarToken, (req, res) => {
    var id = req.params.id;
    var body = req.body;

    Hospital.findById(id, (error, hospital) => {
        if (error) {
            res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar hospital.',
                errors: error
            });

        }
        if (!hospital) {
            res.status(400).json({
                ok: false,
                mensaje: 'El hospital no existe.',
                errors: error
            });

        }
        // se actualizado
        hospital.nombre = body.nombre;

        hospital.save((error, hospitalGuardado) => {
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
                hospital: hospitalGuardado
            });


        });

    });

});

// =======================
// Crear un nuevo hospital
// =======================

app.post('/', mdAutenticacion.verificarToken, (req, res) => {
    var body = req.body;
    var hospital = new Hospital({
        nombre: body.nombre,
        usuario: req.usuario._id
    });

    hospital.save((error, hospitalGuardado) => {
        if (error) {
            res.status(400).json({
                ok: false,
                mensaje: 'Error al crear hospital.',
                errors: error
            });

        }

        res.status(201).json({
            ok: true,
            mensaje: 'Recurso creado.',
            hospital: hospitalGuardado
        });


    });

});
// =======================
// Eliminar un  usuario
// =======================
app.delete('/:id', mdAutenticacion.verificarToken, (req, res) => {
    var id = req.params.id;
    console.log(id);
    Hospital.findByIdAndRemove(id, (error, hospitalBorrado) => {

        if (error) {
            res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar hospital.',
                errors: error
            });

        }
        if (!hospitalBorrado) {
            res.status(400).json({
                ok: false,
                mensaje: 'No existe el hospital con ese id.',
                errors: error
            });

        }

        res.status(200).json({
            ok: true,
            mensaje: 'Recurso borrado.',
            hospital: hospitalBorrado
        });


    });
});
module.exports = app;