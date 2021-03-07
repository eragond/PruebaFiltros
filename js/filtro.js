
// const EL = (sel) => document.querySelector(sel);
var canv = null;
var ctx = null;
var img = null;

window.onload = function() {
    //Indicar que cargó.
    console.log("Listo");

    //Cargar canvas e imagen.
    canv = $("#canv")[0];
    ctx = canv.getContext("2d");
    img = $("#imagen")[0];
    loadCanvasImage();

    //Cargar tooltips
    $('[data-toggle="tooltip"]').tooltip();
    $('[data-toggle-second="tooltip"]').tooltip();
}

// EVENTOS
// Cambiar tamaño de canvas cuando se actualiza el tamaño de imagen.
$(window).on("resize", () => {
    loadCanvasImage();
});

$("#wrapper").on(
    "toggledImage", () => {
    setTimeout(() => {
    loadCanvasImage();
},350);
});

// Subir imagen
$("#fileUpload").change(readImage);



function loadCanvasImage() {
    canv.width = img.width;
    canv.height = img.height;
    var scale = 1;
    // Escala POR SI SE OCUPA
    // var scale = Math.max(canv.width / img.width, canv.height / img.height);
    // Superior izquierda.
    // var x = (canv.width / 2) - (img.width / 2) * scale;
    // var y = (canv.height / 2) - (img.height / 2) * scale;
    ctx.drawImage(img, 0, 0, img.width * scale, img.height * scale);
}

function readImage() {
  if (!this.files || !this.files[0]) return;

  const FR = new FileReader();
  FR.addEventListener("load", (evt) => {
    img.addEventListener("load", () => {
      loadCanvasImage();
    });
    img.src = evt.target.result;
  });
  FR.readAsDataURL(this.files[0]);
}

function cargaCanvas() {
    // canv = document.getElementById("canv");
    // var img = document.getElementById("blah");
    // img.crossOrigin = "Anonymous";
    // ctx = canv.getContext("2d");
    // canv.width = img.width;
    // canv.height = img.height;
    // canv.width = 100;
    // canv.height = 100;
    ctx.drawImage(img,0,0);

    var imgData = ctx.getImageData(0, 0, canv.width, canv.height);
    var data = imgData.data;

    grayscale();

    function grayscale() {
      for (var i = 0; i < data.length; i += 4) {
        var avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
        data[i]     = avg; // red
        data[i + 1] = avg; // green
        data[i + 2] = avg; // blue
      }
    ctx.putImageData(imgData, 0, 0);
    }
}

// grayscale = function(ctx) {
//     var imgData = ctx.getImageData(0, 0, canv.width, canv.height);
//     var data = imgData.data;
//     for (var i = 0; i < data.length; i += 4) {
//       var avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
//       data[i]     = avg; // red
//       data[i + 1] = avg; // green
//       data[i + 2] = avg; // blue
//     }
//   ctx.putImageData(imgData, 0, 0);
//   }
// }
