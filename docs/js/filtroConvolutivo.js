import {Filtro} from "./filtro.js"

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

    procesa() {
        let tempData = this.data.slice(); //Copia del arreglo de datos.
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
                this.data[pixPos] = red * this.factor + this.bias;
                this.data[pixPos+1] = green * this.factor + this.bias;
                this.data[pixPos+2] = blue * this.factor + this.bias;
            }
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
