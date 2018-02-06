var jwt = require('jsonwebtoken');
var SEED = require('../config/config');

// =======================
//  Verificar token
// =======================
exports.verificarToken = function(req, res, next) {
    var token = req.query.token;
    jwt.verify(token, SEED.SEED, (error, decoded) => {
        if (error) {
            res.status(401).json({
                ok: false,
                mensaje: 'Token no valido.',
                errors: error
            });
        }
        req.usuario = decoded.usuario;
        next();
        /* res.status(200).json({
             ok: true,
             decoded: decoded
         }); */
    });
};