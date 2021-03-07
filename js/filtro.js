import Pintor from "./pintor.js"

var pintor;                 //Pintor a usar
var img;                    //Imagen original.
var procImg;                //Imagen para procesar.

//Esto se ejecutara, una vez que la pagina haya cargado.
window.onload = function() {
    //Inicializacion de variables
    img = $("#imgOrig")[0];                     //Imagen original.
    procImg = $("#imgProc")[0];                 //Imagen para procesar.
    pintor = new Pintor(procImg);               //Pintor a usar
}

// EVENTOS
// Subir imagen
$("#fileUpload").change(readImage);

//Procesar imagen.
$("#procesame").click(() => {
    pintor.pinta();
    guardaImagenADescargar();
});

// Guarda lo que esta en el canvas natural y lo deja disponible para descargar.
 function guardaImagenADescargar() {
    $("#bajarImagen").attr("href", pintor.img.src);
    $("#bajarImagen").removeClass("disabled");
}

// Lee una imagen y la guarda.
function readImage() {
  if (!this.files || !this.files[0]) return;

  const FR = new FileReader();
  FR.addEventListener("load", (evt) => {
    img.src = evt.target.result;
    pintor.img.src = evt.target.result;
    img.addEventListener("load", () => {
        guardaImagenADescargar();
    });
  });
  FR.readAsDataURL(this.files[0]);
}
