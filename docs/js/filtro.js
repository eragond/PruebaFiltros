
class Filtro {
    nombre = "";
    info = "";
    tipo = "Pixeles"

    setWidthHeight(width, height){
        this.imgWidth = width;
        this.imgHeight = height;
    }


    procesa(data) {
        for (var i = 0; i < data.length; i += 4)
          this.procPixel(data, i);

        // Otro recorrido
        // for (let j = 0; j < this.imgHeight; j++)
        //      for (let i = 0; i < this.imgWidth; i++)
        //          this.procPixel(data, (i + j*this.imgWidth)*4);
    }

    procPixel(data, i){
        var avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
        data[i] = avg;
        data[i+1] = avg;
        data[i+2] = avg;
    }
}

export class GrisPromedio extends Filtro {
    nombre = "Gris promedio";
    info = "Obtiene el gris promedio \nGy = (R + G + B)/3";
    procPixel(data, i){
        var gris = (data[i] + data[i + 1] + data[i + 2]) / 3;
        data[i] = gris;
        data[i+1] = gris;
        data[i+2] = gris;
    }
}

export class GrisOjo extends Filtro {
    nombre = "Gris ojo";
    info = "Gy = 0.3 R + 0.59 G + 0.11 B";
    procPixel(data, i){
        var gris = data[i] * 0.3 + data[i + 1] * 0.59 + data[i + 2] * 0.11;
        data[i] = gris;
        data[i+1] = gris;
        data[i+2] = gris;
    }
}

export class GrisLuma extends Filtro {
    nombre = "Gris luma";
    info = "Gy = 0.2126 R + 0.7152 G + 0.0722 B";
    procPixel(data, i){
        var gris = data[i] * 0.2126 + data[i + 1] * 0.7152 + data[i + 2] * 0.0722;
        data[i] = gris;
        data[i+1] = gris;
        data[i+2] = gris;
    }
}

export class GrisMinMax extends Filtro {
    nombre = "Gris min-max";
    info = "Gy = (Min(R,G,B) + Max(R,G,B)) / 2";
    procPixel(data, i){
        var gris = (Math.max(data[i], data[i + 1], data[i + 2]) +
                    Math.min(data[i], data[i + 1], data[i + 2])) / 2;
        data[i] = gris;
        data[i+1] = gris;
        data[i+2] = gris;
    }
}

export class GrisMax extends Filtro {
    nombre = "Gris max";
    info = "Gy = Max(R,G,B)";
    procPixel(data, i){
        var gris = Math.max(data[i], data[i + 1], data[i + 2]);
        data[i] = gris;
        data[i+1] = gris;
        data[i+2] = gris;
    }
}

export class GrisMin extends Filtro {
    nombre = "Gris min";
    info = "Gy = Min(R,G,B)";
    procPixel(data, i){
        var gris = Math.min(data[i], data[i + 1], data[i + 2]);
        data[i] = gris;
        data[i+1] = gris;
        data[i+2] = gris;
    }
}

export class GrisRojo extends Filtro {
    nombre = "Gris rojo";
    info = "Gy = R";
    procPixel(data, i){
        var gris = data[i];
        data[i+1] = gris;
        data[i+2] = gris;
    }
}

export class GrisVerde extends Filtro {
    nombre = "Gris verde";
    info = "Gy = G";
    procPixel(data, i){
        var gris = data[i+1];
        data[i] = gris;
        data[i+2] = gris;
    }
}

export class GrisAzul extends Filtro {
    nombre = "Gris azul";
    info = "Gy = B";
    procPixel(data, i){
        var gris = data[i+2];
        data[i] = gris;
        data[i+1] = gris;
    }
}

export class Enverdecer extends Filtro {
    nombre = "Enverdecer";
    info = "Solo mantiene la componente verde";
    procPixel(data, i){
        data[i] = 0;
        data[i+2] = 0;
    }
}

export class Azulecer extends Filtro {
    nombre = "Azulecer";
    info = "Solo mantiene la componente azul";
    procPixel(data, i){
        data[i] = 0;
        data[i+1] = 0;
    }
}

export class Enrojecer extends Filtro {
    nombre = "Enrojecer";
    info = "Solo mantiene la componente roja";
    procPixel(data, i){
        data[i+1] = 0;
        data[i+2] = 0;
    }
}

export class AltoContraste extends Filtro {
    nombre = "Alto Contraste";
    info = "Blanco y negro al extremo";
    procPixel(data, i){
        var gris = (data[i] + data[i + 1] + data[i + 2]) / 3;
        gris = (gris > 127) ? 255 : 0;
        data[i] = gris;
        data[i+1] = gris;
        data[i+2] = gris;
    }
}

export class Inverso extends Filtro {
    nombre = "Inverso";
    info = "Inverso a alto contraste";
    procPixel(data, i){
        var gris = (data[i] + data[i + 1] + data[i + 2]) / 3;
        gris = (gris > 127) ? 0 : 255;
        data[i] = gris;
        data[i+1] = gris;
        data[i+2] = gris;
    }
}

export class Mosaico extends Filtro {
    nombre = "Mosaico";
    info = "Cuadricula la imagen en secciones del tamaño indicado";
    tipo = "Areas"
    procesa(data) {
        //Obtener informacion sobre las dimensiones del mosaico.
        let width, height;
        while (isNaN(width))
            width = prompt("Escribe un ancho valido", 10);
        while (isNaN(height))
            height = prompt("Escribe un alto valido", 10);
        width = Math.abs(parseInt(width));
        height = Math.abs(parseInt(height));

        // Procesamiento, recorremos secciones del tamaño indicado.
        if (!isNaN(width) && !isNaN(height))
            for (let y = 0; y < this.imgHeight; y += height)
                for (let x = 0; x < this.imgWidth; x += width)
                    this.mosaicoSeccion(data, x, y, width, height);
    }

    //Obtiene el color promedio de una seccion y lo aplica a cada pixel en esta.
    mosaicoSeccion(data, x, y, wd, ht){
        let sumaTotal = [0,0,0];  //Auxiliar para guardar los colores promedio.
        let total = 0;            //Auxiliar para obtener el total de pixeles en la seccion.

        for (let round = 0; round < 2; round++){    //Dos rondas
            for (let j = 0; j < ht; j++){           //Recorremos la seccion de anchura x altura.
                for (let i = 0; i < wd; i++){
                    let place = ((x+i) + (y+j)*this.imgWidth)*4;    //Posicion del pixel en el arreglo data.
                    if (i + x < this.imgWidth && j + y < this.imgHeight) { //Verificamos fronteras.
                        if (round == 0) {           //Primera ronda, leer info de los pixeles.
                            total += 1;             //Contador para promediar.
                            sumaTotal[0] += data[place];
                            sumaTotal[1] += data[place+1];
                            sumaTotal[2] += data[place+2];
                        } else {                    //Segunda ronda, escribir sobre los pixeles.
                            data[place] = sumaTotal[0];
                            data[place+1] = sumaTotal[1];
                            data[place+2] = sumaTotal[2];
                        }
                    }
                }
            }
            sumaTotal = sumaTotal.map(t => t/total); //Procesar el promedio entre rondas.
        }

    }
}

export class Brillo extends Filtro {
    nombre = "Brillo";
    info = "Suma una constante [-255,255] a cada pixel \n(R,G,B) -> (R+c,G+c,B+c)";
    constructor(){
        super();
        this.cte = 0;
    }

    procesa(data) {
        //Obtener informacion sobre la constante a utilizar.
        let ccte;
        while (isNaN(ccte))
            ccte = prompt("Escribe un numero valido", 0);
        this.cte = parseInt(ccte);
        if (!isNaN(this.cte))
            super.procesa(data)
    }

    procPixel(data, i){
        data[i] += this.cte;
        data[i+1] += this.cte;
        data[i+2] += this.cte;
    }
}

export class ValoresRGB extends Filtro {
    nombre = "ValoresRGB";
    info = "Pone una mica sobre la imagen";
    constructor(){
        super();
        this.r = 0;
        this.g = 0;
        this.b = 0;
    }

    procesa(data) {
        //Obtener informacion sobre la constante a utilizar.
        let r, g, b;
        while (isNaN(r))
            r = prompt("Escribe un numero rojo", 0);
        while (isNaN(g))
            g = prompt("Escribe un numero verde", 0);
        while (isNaN(b))
            b = prompt("Escribe un numero azul", 0);
        this.r = parseInt(r);
        this.g = parseInt(g);
        this.b = parseInt(b);
        // if (!isNaN(this.cte))
        super.procesa(data);
    }

    procPixel(data, i){
        data[i] &= this.r;
        data[i+1] &= this.g;
        data[i+2] &= this.b;
    }
}

class FiltroConvolutivo extends Filtro {
    nombre = "Template convolutivo";
    info = "Procesa la cuadricula";
    tipo = "Convolutivos"
    constructor(){
        super();
        this.factor = 1;
        this.bias = 0;
        this.malla =
        [[0,0,0],
         [0,1,0],
         [0,0,0]]
    }

    procesa(data) {
        let tempData = data.slice(); //Copia del arreglo de datos.
        let offsetY = Math.floor(this.malla.length / 2); //El extra de la malla
        let offsetX = Math.floor(this.malla[0].length / 2);

        function modulo(a, n) { //Js no tiene modulo, sino resto.
            return ((a % n ) + n ) % n;
        }

        for (let j = 0; j < this.imgHeight; j++) //Recorre imagen
            for (let i = 0; i < this.imgWidth; i++){
                let red = 0, green = 0, blue = 0, pixPos = (i + j*this.imgWidth)*4;
                for (let dy = 0; dy < this.malla.length; dy++)  //Recorre malla
                    for (let dx = 0; dx < this.malla[0].length; dx++) {
                        let curx = modulo((i-offsetX+dx), this.imgWidth),
                            cury = modulo((j-offsetY+dy), this.imgHeight),
                            meshPixPos = (curx + cury*this.imgWidth) * 4; //Posicion de malla en imagen
                        red += tempData[meshPixPos] * this.malla[dy][dx];
                        green += tempData[meshPixPos+1] * this.malla[dy][dx];
                        blue += tempData[meshPixPos+2] * this.malla[dy][dx];
                    }
                data[pixPos] = red * this.factor + this.bias;
                data[pixPos+1] = green * this.factor + this.bias;
                data[pixPos+2] = blue * this.factor + this.bias;
            }
        console.log("Fin");
    }

}

export class Blur extends FiltroConvolutivo {
    nombre = "Blur Basico";
    info = "Procesa la cuadricula";
    constructor() {
        super();
        this.factor = 1;
        this.malla =
        [[0,0.2,0],
         [0.2,0.2,0.2],
         [0,0.2,0]]
    }
}

export class GausianBlur3x3 extends FiltroConvolutivo {
    nombre = "Blur Gausiano 3x3";
    info = "Procesa la cuadricula";
    constructor() {
        super();
        this.factor = 1 / 16;
        this.malla =
        [[1, 2, 1],
        [2, 4, 2],
        [1, 2, 1]]
    }
}

export class GausianBlur5x5 extends FiltroConvolutivo {
    nombre = "Blur Gausiano 5x5";
    info = "Procesa la cuadricula";
    constructor() {
        super();
        this.factor = 1 / 256;
        this.malla =
        [[1,  4,  6,  4,  1],
        [4, 16, 24, 16,  4],
        [6, 24, 36, 24,  6],
        [4, 16, 24, 16,  4],
        [1,  4,  6,  4,  1]]
    }
}

export class HardBlur extends FiltroConvolutivo {
    nombre = "Blur Fuerte";
    info = "Procesa la cuadricula";
    constructor() {
        super();
        this.factor = 1 / 13;
        this.malla =
        [[0, 0, 1, 0, 0],
        [0, 1, 1, 1, 0],
        [1, 1, 1, 1, 1],
        [0, 1, 1, 1, 0],
        [0, 0, 1, 0, 0]]
    }
}

export class MotionBlur extends FiltroConvolutivo {
    nombre = "Motion Blur";
    info = "Procesa la cuadricula";
    constructor() {
        super();
        this.factor = 1 / 9;
        this.malla =
        [[1, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 1, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 1, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 1, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 1, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 1, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 1, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 1, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 1,]]
    }
}

export class FindAllEdges extends FiltroConvolutivo {
    nombre = "Bordes Omnidireccionales";
    info = "Procesa la cuadricula";
    constructor() {
        super();
        this.factor = 1;
        this.malla =
        [[-1, -1, -1],
        [-1,  8, -1],
        [-1, -1, -1]]
    }
}

export class FindHorizontalEdges extends FiltroConvolutivo {
    nombre = "Bordes Horizontales";
    info = "Procesa la cuadricula";
    constructor() {
        super();
        this.factor = 1;
        this.malla =
        [[0,  0, -1,  0,  0],
        [0,  0, -1,  0,  0],
        [0,  0,  2,  0,  0],
        [0,  0,  0,  0,  0],
        [0,  0,  0,  0,  0]]
    }
}

export class FindVerticalEdges extends FiltroConvolutivo {
    nombre = "Bordes Verticales";
    info = "Procesa la cuadricula";
    constructor() {
        super();
        this.factor = 1;
        this.malla =
        [[0,  0, -1,  0,  0],
        [0,  0, -1,  0,  0],
        [0,  0,  4,  0,  0],
        [0,  0, -1,  0,  0],
        [0,  0, -1,  0,  0]]
    }
}

export class FindDiagonalEdges extends FiltroConvolutivo {
    nombre = "Bordes Diagonales";
    info = "Procesa la cuadricula";
    constructor() {
        super();
        this.factor = 1;
        this.malla =
        [[-1,  0,  0,  0,  0],
         [0, -2,  0,  0,  0],
         [0,  0,  6,  0,  0],
         [0,  0,  0, -2,  0],
         [0,  0,  0,  0, -1]]
    }
}

export class Sharpen extends FiltroConvolutivo {
    nombre = "Sharpen";
    info = "Procesa la cuadricula";
    constructor() {
        super();
        this.factor = 1;
        this.malla =
        [[-1,-1,-1],
         [-1,9,-1],
         [-1,-1,-1]]
    }
}

export class SoftSharpen extends FiltroConvolutivo {
    nombre = "Sharpen Suavizado";
    info = "Procesa la cuadricula";
    constructor() {
        super();
        this.factor = 1 / 8;
        this.malla =
        [[-1, -1, -1, -1, -1],
        [-1,  2,  2,  2, -1],
        [-1,  2,  8,  2, -1],
        [-1,  2,  2,  2, -1],
        [-1, -1, -1, -1, -1]]
    }
}

export class ExcesiveEdges extends FiltroConvolutivo {
    nombre = "Bordes Excesivos";
    info = "Procesa la cuadricula";
    constructor() {
        super();
        this.factor = 1;
        this.malla =
        [[1,1,1],
         [1,-7,1],
         [1,1,1]]
    }
}

export class HardEmboss extends FiltroConvolutivo {
    nombre = "Emboss Fuerte";
    info = "Procesa la cuadricula";
    constructor() {
        super();
        this.factor = 1;
        this.bias = 128;
        this.malla =
        [[-1, -1, -1, -1,  0],
        [-1, -1, -1,  0,  1],
        [-1, -1,  0,  1,  1],
        [-1,  0,  1,  1,  1],
        [0,  1,  1,  1,  1]]
    }
}

export class SoftEmboss extends FiltroConvolutivo {
    nombre = "Emboss Suave";
    info = "Procesa la cuadricula";
    constructor() {
        super();
        this.factor = 1;
        this.bias = 128;
        this.malla =
        [[-1, -1,  0],
        [-1,  0,  1],
        [0,  1,  1]]
    }
}

export class Mean extends FiltroConvolutivo {
    nombre = "Promedio";
    info = "Suaviza la imagen, quitando ruido";
    constructor() {
        super();
        this.factor = 1 / 9;
        this.malla =
        [[1, 1,  1],
        [1,  1,  1],
        [1,  1,  1]]
    }
}

export class StrongMean extends FiltroConvolutivo {
    nombre = "Promedio Fuerte";
    info = "Suaviza la imagen, quitando ruido";
    constructor() {
        super();
        this.factor = 1 / 25;
        this.malla =
        [[1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1]]
    }
}
