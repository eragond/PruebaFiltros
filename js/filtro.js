
// Variables globales
var nCanvas;                //Canvas con imagen natural, para procesado.
var nCtx;                   //Contexto de canvas natural.
var img;                    //Imagen original.
var procImg;                //Imagen para procesar.

//Esto se ejecutara, una vez que la pagina haya cargado.
window.onload = function() {
    //Indicar que cargó.
    console.log("Listo");

    //Inicializar todas las variables.
    nCanvas = document.createElement('canvas'); //Objeto natural para procesado.
    nCtx = nCanvas.getContext("2d");            //Contexto de canvas natural.
    img = $("#imgOrig")[0];                     //Imagen original.
    procImg = $("#imgProc")[0];                 //Imagen para procesar.

    guardaImagenADescargar(false);

    //Cargar tooltips
    $('[data-toggle="tooltip"]').tooltip();
    $('[data-toggle-second="tooltip"]').tooltip();
}

// EVENTOS

$("#procesame").on("click", () => {
    cargaCanvas();
});

// Subir imagen
$("#fileUpload").change(readImage);

// Guarda lo que esta en el canvas natural y lo deja disponible para descargar.
 function guardaImagenADescargar(redibuja = true) {
    if (redibuja)
        procImg.src = nCanvas.toDataURL("image/png");
    $("#bajarImagen").attr("href", procImg.src);
}

// Lee una imagen y la guarda.
function readImage() {
  if (!this.files || !this.files[0]) return;

  const FR = new FileReader();
  FR.addEventListener("load", (evt) => {
    img.src = evt.target.result;
    procImg.src = evt.target.result;
    img.addEventListener("load", () => {
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
