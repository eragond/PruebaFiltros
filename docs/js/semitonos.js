import { BibliotecaCirculo, BibliotecaPuntos } from "./bibliotecaTipos.js";
//Permite crear una imagen con puntos, al estilo del periodico.

//VARIABLES GENERALES
let img = null;         //Imagen a procesar
let imgFin = null;      //Imagen final
let regWidth = 5;      //Ancho de las regiones
let regHeight = 5;     //Alto de las regiones

let ntilex = 0;         //Numero de tejas a ser usadas por lo ancho
let ntiley = 0;         //Numero de tejas a ser usadas por lo alto
//Rangos dinamicos [-255, 255], no deben sobrelaparse
let tipo = new BibliotecaCirculo();               //La biblioteca que sera usada

//Canvas
const canvas = document.createElement('canvas');    //Canvas de imagen original
const ctx = canvas.getContext("2d");
const finCanvas = document.createElement('canvas'); //Canvas de imagen final
const finCtx = finCanvas.getContext("2d");

//EVENTOS
//Al subir imagen
$("#fileUpload").change(readImage);

//Al cambiar texto de marca
$('#regWidth').keyup(function() {
    regWidth = Math.abs(parseInt(this.value));
});

$('#regHeight').keyup(function() {
    regHeight = Math.abs(parseInt(this.value));
});

//Bajar imagen
$("#bajarImagen").click(guardaImagenADescargar);

//Tipo de bilioteca a utilizar 
$('.tipo').click(function() {
    $('#dropdownMenuLink').text(this.text);
    if(this.id == "bcirculo"){ 
        tipo = new BibliotecaCirculo();
    } else if (this.id == "b4pts") {
        tipo = new BibliotecaPuntos(2, 8);
    } else if (this.id == "b9pts") {
        tipo = new BibliotecaPuntos(3, 10);
    }
    $("#biblioteca").empty();
    $("#biblioteca").append(tipo.canvas);
});

//Procesar imagen
$("#grid").click(function(){    
    let spiner = $('#loadingSpiner');
    spiner.show('fast', () => {
        preprocImgRaiz();           //Preprocesar la imagen original
        try { 
            generaImagen();         //Genera imagen con la biblioteca seleccionada
        } catch (err) { 
            window.alert("Excediste las dimensiones del programa, intenta otra configuracion");
        }
        guardaImagenADescargar();   //Guarda imagen para que sea descargable
        imgFin.width = img.width;   //Ajusta el tamaño en vista de imgFin para 
        imgFin.height = img.height; //que parezca del mismo tamaño que la original.
    });
    spiner.promise().done(() => {$('#loadingSpiner').hide()});
});

//Al cargar la pagina
window.onload = () =>{
    img = $('#imgProc')[0];
    imgFin = $('#imgFin')[0];
    $('#loadingSpiner').hide();
    $('#biblioteca').append(tipo.canvas);
}

// Preprocesar imagen original
function preprocImgRaiz() {
    //Canvas con la imagen original
    //Obtenemos el numero de tejas verticales y horizontales.
    ntiley = (img.naturalHeight / regHeight); 
    ntilex = (img.naturalWidth / regWidth); 

    //Configuramos el canvas de la imagen raiz
    canvas.height = img.naturalHeight;
    canvas.width = img.naturalWidth;
    ctx.drawImage(img, 0, 0);

    //Configuramos el canvas de la imagen final
    finCanvas.height = ntiley * tipo.sheight;
    finCanvas.width = ntilex * tipo.swidth;
}

// Procesa la imagen final
function generaImagen() {
    //Obtenemos la metadata de la imagen original para trabajar sobre sus regiones
    let metadata = ctx.getImageData(0,0, img.naturalWidth, img.naturalHeight);
    let data = metadata.data;
    //Por cada region de la imagen original
    for (let y = 0; y < ntiley; y += 1) {
        for (let x = 0; x < ntilex; x += 1) {
            //Obtenemos el gris promedio de cada region
            let color = colorPromedio(x * regWidth, y * regHeight, regWidth, regHeight,
                img.naturalWidth, img.naturalHeight, data);
            let gris = (color[0] + color[1] + color[2])/3;
            // Seleccionamos el gris que mas se parezca a nuestros tonos
            let bibdata = tipo.getSemitono(gris);
            // Escribimos la info en la imagen final
            finCtx.putImageData(bibdata, x*tipo.swidth, y*tipo.sheight);
        }
    }
}

// FUNCIONES AUXILIARES
// Regresa el color promedio de una region
function colorPromedio(x, y, wd, ht, wborder, hborder, data){
    let sumaTotal = [0,0,0];  //Auxiliar para guardar los colores promedio.
    let total = 0;            //Auxiliar para obtener el total de pixeles en la seccion.
    for (let j = 0; j < ht; j++)           //Recorremos la seccion de anchura x altura.
        for (let i = 0; i < wd; i++){
            let place = ((x+i) + (y+j)*wborder)*4;    //Posicion del pixel en el arreglo data.
            if (i + x < wborder && j + y < hborder) { //Verificamos fronteras.
                total += 1;             //Contador para promediar.
                sumaTotal[0] += data[place];
                sumaTotal[1] += data[place+1];
                sumaTotal[2] += data[place+2];
            }
        }
    sumaTotal = sumaTotal.map(t => t/total);
    return sumaTotal;
}

// Pasa el contenido de un canvas a tonos de gris
function aTonosDeGris(data) {
    for (let i = 0; i < data.length; i += 4) {
        let gris = (data[i] + data[i + 1] + data[i + 2]) / 3;
        data[i] = gris;
        data[i+1] = gris;
        data[i+2] = gris;
    }
}

// Lee una imagen y la asigna a la principal
function readImage() {
    if (!this.files || !this.files[0]) return;
    const FR = new FileReader();
    FR.addEventListener("load", (evt) => {
        img.addEventListener("load", () => {
            // drawImgCanvas();
        });
        img.src = evt.target.result;
    });
    FR.readAsDataURL(this.files[0]);
}

// Guarda la imagen para que sea descargable
function guardaImagenADescargar() {
    imgFin.src = finCanvas.toDataURL("image/png");
    $("#bajarImagen").attr("href", imgFin.src);
}

