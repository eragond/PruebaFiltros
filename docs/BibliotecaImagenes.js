// Bibliotecas de imagenes
export class Biblioteca {
    canvas = document.createElement('canvas');    //Canvas de la biblioteca
    ctx = this.canvas.getContext("2d");
    swidth = 10;         //Ancho de cada imagen de la biblioteca
    sheight = 10;        //Alto de cada imagen de la biblioteca
    ntonos = 10;        //Numero de tonos en la biblioteca

    //El constructor debe generar la biblioteca de filtros
    //De oscuro a mas claro
    constructor() {
    }

    //Dado un tono de gris (0 - 255) regresa la metadata del tono que corresponde.
    getSemitono(gris) { 
        let lugar = Math.floor(gris / (255 / this.ntonos));
        return this.ctx.getImageData(lugar*this.swidth, 0, this.swidth, this.sheight);
    }
}

export class BibliotecaCirculo extends Biblioteca {
    swidth = 10;         //Ancho de cada imagen de la biblioteca
    sheight = 10;        //Alto de cada imagen de la biblioteca
    ntonos = 12;        //Numero de tonos en la biblioteca

    constructor() {
        super();
        let place = 0;
        for(let i = this.ntonos; i > 0; i -= 1) { 
            place += this.swidth;
            this.ctx.beginPath();
            this.ctx.arc(place/2, this.sheight/2, i/4, 0, 2 * Math.PI);
            this.ctx.fill();
            this.ctx.stroke();
        }
    }
}

export class BibliotecaPuntos extends Biblioteca {
    swidth = 10;         //Ancho de cada imagen de la biblioteca
    sheight = 10;        //Alto de cada imagen de la biblioteca
    ntonos = 9;        //Numero de tonos en la biblioteca

    constructor() {
        super();
        let place = 0;
        let pptDim = swidth/3;
        for(let i = this.ntonos; i > 0; i -= 1) { 
            place += this.swidth;
            let level = 0;
            for(let np = 0; np < i; np += 1) {
                this.ctx.beginPath();
                this.ctx.arc(place+(pptDim*np), /2, i/4, 0, 2 * Math.PI);
                this.ctx.fill();
                this.ctx.stroke();
            } 
        }
    }
}

