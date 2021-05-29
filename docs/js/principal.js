import Pintor from "./pintor.js"
// import * as filtros from "./filtro.js"

var pintor;                 //Pintor a usar
var img;                    //Imagen original.
var procImg;                //Imagen para procesar.

//Esto se ejecutara, una vez que la pagina haya cargado.
window.onload = function() {
    //Inicializacion de variables
    img = $("#imgOrig")[0];                     //Imagen original.
    procImg = $("#imgProc")[0];                 //Imagen para procesar.
    pintor = new Pintor(procImg);               //Pintor a usar
    creaListaFiltros();
}

// EVENTOS
// Subir imagen
$("#fileUpload").change(readImage);

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
    pintor.updateImgSrc(evt.target.result);
    img.addEventListener("load", () => {
        guardaImagenADescargar();
    });
  });
  FR.readAsDataURL(this.files[0]);
}

//Crea la lista de filtros en el html y sus respectivos eventos de activacion.
function creaListaFiltros(){
    let l = pintor.getListaFiltros();
    let tipos = {};
    for (let fil of l) {
        if (!(fil.tipo in tipos)) { //Si el tipo de filtro no existe, lo crea.
            let newTipo = $("#listaFiltrosTemplate").clone();
            let listaNewTipo = newTipo.find('#listaFiltros');
            listaNewTipo.attr("id", "lista" + fil.tipo);
            newTipo.attr("id", "listaFiltros" + fil.tipo);
            newTipo.removeAttr("hidden");
            newTipo.find(".btn").html(fil.tipo);
            newTipo.find(".btn").attr("data-target", "#lista" + fil.tipo);
            tipos[fil.tipo] = listaNewTipo;
            $("#accordionFiltros").append(newTipo);

        }
        let elemento = document.createElement('button'); //Agrega el filtro deacuerdo a su categoria.
        elemento.setAttribute("class","list-group-item list-group-item-action bg-default");
        elemento.setAttribute("title",fil.info);
        elemento.append(fil.nombre)
        elemento.onclick = () => {
            pintor.pinta(fil.fnom);
            guardaImagenADescargar();
        };
        tipos[fil.tipo].append(elemento);
    }
}
