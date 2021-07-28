//Permite hacer una imagen hecha de si misma, ya sea a color con color verdadero
//o a blanco y negro

//VARIABLES GENERALES
let img = null;         //Imagen a procesar
let imgFin = null;      //Imagen final
let mosPos = {};        //Posiciones de tonos en el mosaico
let props = {           //Proporciones de las imagenes a usar
    regXPix : 10,       //Proporciones de la imagen teja, llamada pixel
    regYPix : 10,
    regXImg : 10,       //Proporciones de las regiones a considerar en la imagen original
    regYImg : 10
}
let ntilex = 0;         //Numero de tejas a ser usadas por lo ancho
let ntiley = 0;         //Numero de tejas a ser usadas por lo alto
                        //Rangos dinamicos [-255, 255], no deben sobrelaparse
let rangoMin = -255;    //Rango dinamico minimo (determina que tan oscuro es el mas oscuro)
let rangoMax = 255;     //Rango dinamico maximo (determina que tan claro es el mas claro)
let ntonos = 60;        //Numero de tonos a ser usados, (divide el rango dinamico)
let color = true;       //Si se trabaja a color o blanco y negro.
          
//Canvas
const canvas = document.createElement('canvas');    //Canvas de imagen original
const ctx = canvas.getContext("2d");
const pixCanvas = document.createElement('canvas'); //Canvas de imagen pixel
const pixCtx = pixCanvas.getContext("2d");
const mosCanvas = document.createElement('canvas'); //Canvas de mosaico de tonos
const mosCtx = mosCanvas.getContext("2d");
const finCanvas = document.createElement('canvas'); //Canvas de imagen final
const finCtx = finCanvas.getContext("2d");

//EVENTOS
//Al subir imagen
$("#fileUpload").change(readImage);

//Al cambiar texto de marca
$('.region').keyup(function() {
    props[this.id] = Math.abs(parseInt(this.value));
});

//Bajar imagen
$("#bajarImagen").click(guardaImagenADescargar);

//Tipo 
$('.tipo').click(function() {
    $('#dropdownMenuLink').text(this.text);
    if (this.text == 'Tonos de gris') 
        color = false;
    else 
        color = true;
});

//Procesar imagen
$("#grid").click(function(){    
    let spiner = $('#loadingSpiner');
    spiner.show('fast', () => {
        preprocImgRaiz();       //Preprocesa la imagen original
        generaPix();            //Genera imagen pixel
        try {
            if (color) {
                generaImgColor();
            } else {
                generaMosaico();        //Genera mosaico de tonos
                generaImagen();         //Genera imagen final
            }
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
}

// Preprocesar imagen original
function preprocImgRaiz() {
    //Canvas con la imagen original
    //Obtenemos el numero de tejas verticales y horizontales.
    ntiley = (img.naturalHeight / props['regYImg']); 
    ntilex = (img.naturalWidth / props['regXImg']); 

    //Configuramos el canvas de la imagen raiz
    canvas.height = img.naturalHeight;
    canvas.width = img.naturalWidth;
    ctx.drawImage(img, 0, 0);

    //Configuramos el canvas de la imagen final
    finCanvas.height = ntiley * props['regYPix'];
    finCanvas.width = ntilex * props['regXPix'];
}

// Genera la imagen teja, llamada pixel (a veces tambien le llamo teja)
function generaPix() {
    //Canvas con la imagen-pixel ajustando el tamaño.
    pixCanvas.height = props['regYPix'];
    pixCanvas.width = props['regXPix'];
    pixCtx.drawImage(img, 0, 0, props['regXPix'], props['regYPix']);
}

// Genera el canvas mosaico
function generaMosaico() { 
    //Obtenemos el intervalo entre tono y tono
    let step = (rangoMax - rangoMin)/ ntonos;
    //Es como un arreglo de imagenes tipo teja
    mosCanvas.height = props['regYPix'];
    mosCanvas.width = props['regXPix'] * ntonos;
    let metadataMos = mosCtx.getImageData(0,0, props['regXPix'] * ntonos, props['regYPix']);
    let dataMos = metadataMos.data;

    //Por cada tono, agregamos una teja del tono respectivo al mosaico
    for (let tono = 0; tono < ntonos; tono += 1) { 
        let metadataPix = pixCtx.getImageData(0,0, props['regXPix'], props['regYPix']);
        let dataPix = metadataPix.data;
        for (let i = 0; i < dataPix.length; i += 4) {
            let gris = ((dataPix[i] + dataPix[i + 1] + dataPix[i + 2]) / 3) + rangoMin + tono * step;
            dataPix[i] = gris;
            dataPix[i+1] = gris;
            dataPix[i+2] = gris;
        }
        mosPos[tono] = tono*props['regXPix']; //Guardamos la posicion de cada tono
        mosCtx.putImageData(metadataPix, tono*props['regXPix'], 0);
    }
}

// Procesa la imagen final a blanco y negro
function generaImagen() {
    //Obtenemos la metadata de la imagen original para trabajar sobre sus regiones
    let metadata = ctx.getImageData(0,0, img.naturalWidth, img.naturalHeight);
    let data = metadata.data;
    let width = props['regXImg'];
    let height = props['regYImg'];
    //Por cada region de la imagen original
    for (let y = 0; y < ntiley; y += 1) {
        for (let x = 0; x < ntilex; x += 1) {
            //Obtenemos el gris promedio de cada region
            let color = colorPromedio(x * width, y * height, width, height,
                                      img.naturalWidth, img.naturalHeight, data);
            let gris = (color[0] + color[1] + color[2])/3;
            // Seleccionamos el gris que mas se parezca a nuestros tonos
            let imgEnMos = selecCercano(gris);
            // Obtenemos la informacion del mosaico
            let mosdata = mosCtx.getImageData(imgEnMos, 0, props['regXPix'], props['regYPix']);
            // Escribimos la info en la imagen final
            finCtx.putImageData(mosdata, x*props['regXPix'], y*props['regYPix']);
        }
    }
}

// Procesa la imagen final a color
function generaImgColor() { 
    let metadata = ctx.getImageData(0,0, img.naturalWidth, img.naturalHeight);
    let data = metadata.data;

    let width = props['regXImg'];
    let height = props['regYImg'];
    //Por cada region de la imagen original
    for (let y = 0; y < ntiley; y += 1) {
        for (let x = 0; x < ntilex; x += 1) {
            //Obtenemos el color promedio de la region
            let color = colorPromedio(x * width, y * height, width, height,
                                      img.naturalWidth, img.naturalHeight, data);
            let metadataPix = pixCtx.getImageData(0,0, props['regXPix'], props['regYPix']);
            let dataPix = metadataPix.data;
            //Procesamos la mica sobre la imagen teja
            for (let i = 0; i < dataPix.length; i += 4) {
                dataPix[i] &= color[0];
                dataPix[i+1] &= color[1];
                dataPix[i+2] &= color[2];
            }
            let newMosPos = mosCanvas.width;
            // Escribimos la info en la imagen final
            finCtx.putImageData(metadataPix, x*props['regXPix'], y*props['regYPix']);
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

// Regresa el tono de gris mas cercano al valor dado
function selecCercano(gris) { 
    let intervalo = 255 / ntonos; 
    let lugar = gris / intervalo;
    return mosPos[Math.floor(lugar)];
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

