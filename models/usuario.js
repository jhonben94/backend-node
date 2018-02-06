var mongoose = require('mongoose');
var rolesValidos = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{PATH} no es un rol permitido'
}
var uniqueValidator = require('mongoose-unique-validator');
var Schema = mongoose.Schema;
// esquema del usuario
var usuarioSchema = new Schema({
    nombre: { type: String, required: [true, 'El nombre es un campo requerido.'] },
    email: { type: String, unique: true, required: [true, 'El correo es necesario.'] },
    password: { type: String, required: [true, 'La contrasenha es un campo requerido.'] },
    img: { type: String, required: false },
    role: { type: String, required: false, default: 'USER_ROLE', enum: rolesValidos }
});
usuarioSchema.plugin(uniqueValidator, { message: '{PATH} debe ser unico' });
module.exports = mongoose.model('Usuario', usuarioSchema);