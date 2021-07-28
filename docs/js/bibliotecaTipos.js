// Bibliotecas de tipos (tipos moviles de imprenta, no tipos de datos)

// Clase abstracta para crear una biblioteca de tipos
class Biblioteca {
    canvas = document.createElement('canvas');    //Canvas de la biblioteca
    ctx = this.canvas.getContext("2d");
    swidth = 10;         //Ancho de cada imagen de la biblioteca
    sheight = 10;        //Alto de cada imagen de la biblioteca
    ntonos = 10;        //Numero de tonos en la biblioteca

    //El constructor debe generar la biblioteca de filtros
    //Las imagenes deben de acomodarse de oscuro a claro
    constructor() {
        this.canvas.width = this.swidth*this.ntonos;
        this.canvas.height = this.sheight;
    }

    //Dado un tono de gris (0 - 255) regresa la metadata del tono que corresponde.
    getSemitono(gris) { 
        let lugar = Math.floor(gris / (255 / this.ntonos));
        return this.ctx.getImageData(lugar*this.swidth, 0, this.swidth, this.sheight);
    }
}

//Biblioteca hecha con circulos
export class BibliotecaCirculo extends Biblioteca {
    swidth = 9;         //Ancho de cada imagen de la biblioteca
    sheight = 9;        //Alto de cada imagen de la biblioteca
    ntonos = 12;        //Numero de tonos en la biblioteca

    constructor() {
        super();
        let place = 0;
        for(let i = this.ntonos; i > 0; i -= 1) { 
            this.ctx.beginPath();
            this.ctx.arc(place+this.swidth/2, this.sheight/2, i/4, 0, 2 * Math.PI);
            this.ctx.fill();
            this.ctx.stroke();
            place += this.swidth;
        }
    }
}

//Biblioteca hecha con puntos en una cuadricula
export class BibliotecaPuntos extends Biblioteca {

    //Construye una biblioteca de tipos dependiendo del numero de puntos necesarios.
    //@puntos - numero de puntos a ser usados por la biblioteca, una biblioteca de n puntos
    //genera una cuadricula de n^2 tonos.
    //@dims - dimensiones en pixeles de la cuadricula.
    //@rpunto - radio de los puntos para la biblioteca.
    constructor(puntos, dims, rpunto=1) {
        super();
        this.swidth = dims;
        this.sheight = dims;
        this.ntonos = puntos ** 2;
        // this.canvas.width = this.swidth*this.ntonos;
        // this.canvas.height = this.sheight;
        let place = 0;
        let pptDim = this.swidth/puntos;
        //Para cada tono, se agrega un punto a su respectiva imagen.
        for(let i = this.ntonos; i > 0; i -= 1) { 
            let level = 0;
            let col = 0;
            //Esto calcula donde va cada punto
            for(let np = 0; np < i; np += 1) {
                level = Math.floor(np/puntos);
                col = np%puntos;
                this.ctx.beginPath();
                this.ctx.arc(place+(pptDim*col)+pptDim/2, level*pptDim+pptDim/2, rpunto, 0, 2 * Math.PI);
                this.ctx.fill();
                this.ctx.stroke();
            } 
            place += this.swidth;
        }
    }
}

