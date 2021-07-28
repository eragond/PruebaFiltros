import {Filtro} from "./filtro.js"

//Clase abstracta que permite crear filtros convolutivos
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

    //Procesa cada pixel en la imagen con una malla
    procesa() {
        let tempData = this.data.slice(); //Copia del arreglo de datos.
        let offsetY = Math.floor(this.malla.length / 2); //El extra de la malla
        let offsetX = Math.floor(this.malla[0].length / 2);

        for (let j = 0; j < this.imgHeight; j++) //Recorre imagen
            for (let i = 0; i < this.imgWidth; i++){
                let pixPos = (i + j*this.imgWidth)*4;
                let res = this.seccion(i, j, offsetX, offsetY, tempData);
                this.data[pixPos] = res[0];
                this.data[pixPos+1] = res[1];
                this.data[pixPos+2] = res[2];
            }
    }
    
    //Determina que se realiza en cada seccion de la imagen delimitada por la malla
    seccion(i, j, offsetX, offsetY, tempData) {
        let red = 0, green = 0, blue = 0, res = [];
        for (let dy = 0; dy < this.malla.length; dy++)  //Recorre malla
            for (let dx = 0; dx < this.malla[0].length; dx++) {
                let curx = this.modulo((i-offsetX+dx), this.imgWidth),
                    cury = this.modulo((j-offsetY+dy), this.imgHeight),
                    meshPixPos = (curx + cury*this.imgWidth) * 4; //Posicion de malla en imagen
                red += tempData[meshPixPos] * this.malla[dy][dx];
                green += tempData[meshPixPos+1] * this.malla[dy][dx];
                blue += tempData[meshPixPos+2] * this.malla[dy][dx];
            }

        res[0] = red * this.factor + this.bias;
        res[1] = green * this.factor + this.bias;
        res[2] = blue * this.factor + this.bias;
        return res;
    }

    modulo(a, n) { //Js no tiene modulo, sino resto.
        return ((a % n ) + n ) % n;
    }

}

//Clase abstracta derivada de los filtros convolutivos en la cual no se procesa
//directamente la malla sobre la imagen, sino que permite aplicar operaciones 
//especificas sobre los pixeles de la malla.
class FiltroConvolutivoSeccional extends FiltroConvolutivo {
    nombre = "Template convolutivo seccional";
    info = "Es como un filtro convolutivo normal pero permite aplicar " + 
           "operaciones sobre el area de la malla antes de aplicarlas a un pixel";

    //Ahora cuando se procesa una seccion, esta es procesada por pixeles por el metodo
    //operaSecPixeles.
    seccion(i, j, offsetX, offsetY, tempData) {
        let pixMalla = [];
        let red = 0, green = 0, blue = 0, res = [];
        for (let dy = 0; dy < this.malla.length; dy++)  //Recorre malla
            for (let dx = 0; dx < this.malla[0].length; dx++) {
                let curx = this.modulo((i-offsetX+dx), this.imgWidth),
                    cury = this.modulo((j-offsetY+dy), this.imgHeight),
                    meshPixPos = (curx + cury*this.imgWidth) * 4; //Posicion de malla en imagen
                let pix = [];
                pix[0] = tempData[meshPixPos] * this.malla[dy][dx];
                pix[1] = tempData[meshPixPos+1] * this.malla[dy][dx];
                pix[2] = tempData[meshPixPos+2] * this.malla[dy][dx];
                pixMalla.push(pix);
            }
        res = this.operaSecPixeles(pixMalla);
        return res;
    }
    
    //Este metodo debe ser implementado por las clases concretas.
    //Se debe definir que operacion realizar sobre la seccion de pixeles acotada
    //por la malla.
    //Al agarrar el pixel mediana este metodo no hace nada sobre la imagen.
    operaSecPixeles(pixMalla) { 
        let med = Math.floor(pixMalla.length/2);
        return pixMalla[med];
    }
}

export class FiltroMaximo extends FiltroConvolutivoSeccional { 
    nombre = "Filtro Maximo";
    info = "Aplica el filtro maximo con una malla de 5x5";
    constructor() {
        super();
        this.malla =
        [[1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1]]
    }

    //Encuenta el pixel de mayor intensidad.
    operaSecPixeles(pixMalla) { 
        let max = 0, gris = 0;
        for (let pixel of pixMalla) { 
            gris = Math.floor((pixel[0] + pixel[1] + pixel[2])/3);
            if (gris > max) 
                max = gris;
        }
        return [max, max, max];
    }
}

export class FiltroMinimo extends FiltroConvolutivoSeccional { 
    nombre = "Filtro Minimo";
    info = "Aplica el filtro minimo con una malla de 5x5";
    constructor() {
        super();
        this.malla =
        [[1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1]]
    }

    //Encuentra el pixel de menor intensidad.
    operaSecPixeles(pixMalla) { 
        let min = 255, gris = 255;
        for (let pixel of pixMalla) { 
            gris = Math.floor((pixel[0] + pixel[1] + pixel[2])/3);
            if (gris < min) 
                min = gris;
        }
        return [min, min, min];
    }
}

export class FiltroMaximo3x3 extends FiltroMaximo { 
    nombre = "Filtro Maximo 3x3";
    info = "Aplica el filtro maximo con una malla de 3x3";
    constructor() {
        super();
        this.malla =
        [[1,1,1],
         [1,1,1],
         [1,1,1]]
    }
}

export class FiltroMinimo3x3 extends FiltroMinimo { 
    nombre = "Filtro Minimo 3x3";
    info = "Aplica el filtro minimo con una malla de 3x3";
    constructor() {
        super();
        this.malla =
        [[1,1,1],
         [1,1,1],
         [1,1,1]]
    }
}

export class Blur extends FiltroConvolutivo {
    nombre = "Blur Basico";
    info = "Añade un blur suave a la imagen";
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
    info = "Añade un blur Gausiano a la imagen (3x3)";
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
    info = "Añade un blur Gausiano a la imagen (5x5)";
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
    info = "Añade un blur fuerte a la imagen";
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
    info = "Añade un blur de movimiento a la imagen";
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
    info = "Resalta bordes en cualquier direccion de la imagen";
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
    info = "Resalta bordes horizontales de la imagen";
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
    info = "Resalta bordes verticales de la imagen";
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
    info = "Resalta bordes diagonales de la imagen";
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
    info = "Afina la imagen";
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
    info = "Afina la imagen suavemente";
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
    info = "Afina la imagen excesivamente";
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
    info = "Realza caracteristicas de la imagen fuertemente";
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
    info = "Realza caracteristicas de la imagen suavemente";
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
