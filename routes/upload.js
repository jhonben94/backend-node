var express = require("express");
var fileUpload = require("express-fileupload");
var app = express();
var Usuario = require("../models/usuario");
var Medico = require("../models/medico");
var Hospital = require("../models/hospital");
var fs = require("fs");
// default options
app.use(fileUpload());

// rutas
app.put("/:tipo/:id", (req, res, next) => {
  var tipo = req.params.tipo;
  var id = req.params.id;
  var tiposValidos = ["medicos", "usuarios", "hospitales"];

  if (tiposValidos.indexOf(tipo) < 0) {
    res.status(500).json({
      ok: false,
      mensaje: "Tipo de coleccion no es valida.",
      errors: "Tipo de coleccion no es valida."
    });
  }

  if (!req.files) {
    res.status(500).json({
      ok: false,
      mensaje: "No se ha seleccionado ningun archivo."
    });
  }
  // obtener nombre del archivo
  var archivo = req.files.imagen;
  // solo extas extensiones aceptaremos
  var extencionesValidas = ["png", "jpg", "jpeg", "gif"];
  var nombreCortado = req.files.imagen.name.split(".");
  var extensionArchivo = nombreCortado[nombreCortado.length - 1];
  if (extencionesValidas.indexOf(extensionArchivo) < 0) {
    res.status(400).json({
      ok: false,
      mensaje: "La extension del archivp, no es valida.",
      errors: "Las extenciones validas son: " + extencionesValidas.join(", ")
    });
  }
  // crear nombre de archivo personalizado
  var nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extensionArchivo}`;
  var path = `./uploads/${tipo}/${nombreArchivo}`;

  archivo.mv(path, error => {
    if (error) {
      res.status(500).json({
        ok: false,
        mensaje: "Error al mover el archivo.",
        errors: error
      });
    }
    subirPorTipo(tipo, id, res, nombreArchivo);
  });
});

function subirPorTipo(tipo, id, res, nombreArchivo) {
  switch (tipo) {
    case "usuarios":
      Usuario.findById(id, (error, usuario) => {
        if (error) {
          res.status(500).json({
            ok: true,
            mensaje: "No se ha podido actualizar la imagen del usuario.",
            errors: errir
          });
        }

        var pathViejo =
          `C:\\Users\\desap\\Desktop\\angular ndv\\backend-server\\uploads\\usuarios\\` +
          usuario.img;
        // si existe elimina la imagen
        if (typeof usuario.img != "undefined") {
          fs.open(pathViejo, "r", function(err, file) {
            if (err) throw err;
            console.log("Saved!");

            fs.unlink(pathViejo, err => {
              if (err) throw err;
              console.log("successfully deleted: " + pathViejo);
            });
          });
        }
        usuario.img = nombreArchivo;
        usuario.save((error, usuarioActualizado) => {
          if (error) {
            res.status(500).json({
              ok: true,
              mensaje: "No se ha podido actualizar la imagen del usuario.",
              errors: errir
            });
          }
          usuarioActualizado.password = "";
          res.status(200).json({
            ok: true,
            mensaje: "Archivo movido.",
            usuario: usuarioActualizado
          });
        });
      });
      break;
    case "hospitales":
      Hospital.findById(id, (error, hospital) => {
        if (error) {
          res.status(500).json({
            ok: true,
            mensaje: "No se pudo obtener el hospital.",
            errors: error
          });
        }
        var pathViejo =
          `C:\\Users\\desap\\Desktop\\angular ndv\\backend-server\\uploads\\hospitales\\` +
          hospital.img;
        // si existe elimina la imagen
        console.log("if : " + pathViejo);

        if (typeof hospital.img != "undefined") {
          fs.open(pathViejo, "r", function(err, file) {
            if (err) throw err;
            fs.unlink(pathViejo, err => {
              if (err) throw err;
              console.log("Hospital borrado: " + pathViejo);
            });
          });
        }

        hospital.img = nombreArchivo;
        hospital.save((error, hospitalModificado) => {
          if (error) {
            res.status(500).json({
              ok: true,
              mensaje: "No se ha podido actualizar la imagen del hospital.",
              errors: error
            });
          }
          res.status(200).json({
            ok: true,
            mensaje: "Archivo movido.",
            hospital: hospitalModificado
          });
        });
      });
      break;
    case "medicos":
      Medico.findById(id, (error, medico) => {
        if (error) {
          res.status(500).json({
            ok: true,
            mensaje: "No se pudo obtener el medico.",
            errors: error
          });
        }

        var pathViejo =
          `C:\\Users\\desap\\Desktop\\angular ndv\\backend-server\\uploads\\medicos\\` +
          medico.img;
        // si existe elimina la imagen
        console.log("if : " + pathViejo);
        if (typeof medico.img != "undefined") {
          fs.open(pathViejo, "r", function(err, file) {
            if (err) throw err;
            fs.unlink(pathViejo, err => {
              if (err) throw err;
              console.log("successfully deleted: " + pathViejo);
            });
          });
        }
        medico.img = nombreArchivo;
        medico.save((error, medicoActualizado) => {
          if (error) {
            res.status(500).json({
              ok: true,
              mensaje: "No se ha podido actualizar la imagen del medico.",
              errors: error
            });
          }
          res.status(200).json({
            ok: true,
            mensaje: "Archivo movido.",
            medico: medicoActualizado
          });
        });
      });
      break;
  }
}

module.exports = app;
