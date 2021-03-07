
// Variables globales
var canvas;                 //Canvas para dibujado.
var nCanvas;                //Canvas con imagen natural, para procesado.
var ctx;                    //Contexto de canvas para dibujado.
var nCtx;                   //Contexto de canvas natural.
var img;                    //Imagen original.
var procImg = new Image;    //Imagen para procesar.


//Esto se ejecutara, una vez que la pagina haya cargado.
window.onload = function() {
    //Indicar que cargó.
    console.log("Listo");

    //Inicializar todas las variables.
    canvas = $("#canv")[0]; //Objeto en la pagina.
    nCanvas = document.createElement('canvas'); //Objeto natural para procesado.
    ctx = canvas.getContext("2d"); //Contexto de canvas para pagina.
    nCtx = nCanvas.getContext("2d"); //Contexto de canvas natural.
    img = $("#imagen")[0]; //Imagen original.

    //Creamos una copia de la imagen en procImg.
    nCanvas.width = img.naturalWidth;
    nCanvas.height = img.naturalHeight;
    nCtx.drawImage(img, 0, 0, img.naturalWidth, img.naturalHeight);
    guardaImagenADescargar();

    //Carga el preview del canvas de dibujado.
    cargaPreviewCanvas();

    //Cargar tooltips
    $('[data-toggle="tooltip"]').tooltip();
    $('[data-toggle-second="tooltip"]').tooltip();
}

// EVENTOS
// Cambiar tamaño de canvas cuando se actualiza el tamaño de imagen.
$(window).on("resize", () => {
    cargaPreviewCanvas();
});

$("#wrapper").on(
    "toggledImage", () => {
    setTimeout(() => {
    cargaPreviewCanvas();
},350);
});

$("#procesame").click(() => {
    // console.log("Hola");
    cargaCanvas();
});

// Subir imagen
$("#fileUpload").change(readImage);

// Guarda lo que esta en el canvas natural y lo deja disponible para descargar.
 function guardaImagenADescargar(redibuja = true) {
    if (redibuja)
        procImg.src = nCanvas.toDataURL("image/png");
    // ctx.drawImage(procImg, 0, 0, procImg.naturalWidth, procImg.naturalHeight);
    // $("#bajarImagen").attr("download", "img.png");
    $("#bajarImagen").attr("href", procImg.src);
}

// Dibuja el preview con el canvas para preview y la imagen generada.
function cargaPreviewCanvas() {
    canvas.width = img.width;
    canvas.height = img.width;
    ctx.drawImage(procImg, 0, 0, procImg.naturalWidth, procImg.naturalHeight, 0, 0, canvas.width, canvas.height);
}

// Lee una imagen y la guarda.
function readImage() {
  if (!this.files || !this.files[0]) return;

  const FR = new FileReader();
  FR.addEventListener("load", (evt) => {
    img.src = evt.target.result;
    procImg.src = evt.target.result;
    img.addEventListener("load", () => {
        cargaPreviewCanvas();
        guardaImagenADescargar(false);
    });
  });
  FR.readAsDataURL(this.files[0]);
}

function cargaCanvas() {
    nCanvas.width = procImg.naturalWidth;
    nCanvas.height = procImg.naturalHeight;
    nCtx.drawImage(procImg, 0, 0, procImg.naturalWidth, procImg.naturalHeight);
    var imgData = nCtx.getImageData(0, 0, procImg.naturalWidth, procImg.naturalWidth);
    grayscale(imgData.data);
    nCtx.putImageData(imgData, 0, 0);
    guardaImagenADescargar();
    cargaPreviewCanvas();
}

function grayscale(data) {
  for (var i = 0; i < data.length; i += 4) {
    var avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
    data[i]     = avg; // red
    data[i + 1] = avg; // green
    data[i + 2] = avg; // blue
  }
  console.log(data.length / 4);
}
