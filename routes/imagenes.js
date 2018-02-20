var express = require("express");
var app = express();
var fs = require("fs");
// rutas
app.get("/:tipo/:img", (req, res, next) => {
  var tipo = req.params.tipo;
  var img = req.params.img;

  var path = `C:\\Users\\desap\\Desktop\\angular ndv\\backend-server\\uploads\\${tipo}\\${img}`;
  console.log(path);
  fs.open(path, "r", function(err, file) {
    if (err){
      path=`C:\\Users\\desap\\Desktop\\angular ndv\\backend-server\\assets\\no-img.jpg`;
    };
    console.log("funciona!");

    res.sendFile(path);

  });
 
});

module.exports = app;
