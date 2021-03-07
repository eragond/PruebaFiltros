
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

$("#subirImagen").click(() => {
    console.log("Me picaste");
});

function loadCanvasImage() {
    canv.width = img.width;
    canv.height = img.height;
    var scale = 1;
    // Escala
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
    const img = new Image();
    img.addEventListener("load", () => {
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      canv.width = img.width;
      canv.height = img.height;
      ctx.drawImage(img, 0, 0);
    });
    img.src = evt.target.result;
    $("#imagen").attr("src", evt.target.result);
  });
  FR.readAsDataURL(this.files[0]);
}

// EL("#fileUpload").addEventListener("change", readImage);
//
// EL("#actua").addEventListener("click", cargaCanvas);

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
