import {Filtro} from "./filtro.js"

export class GrisPromedio extends Filtro {
    nombre = "Gris promedio";
    info = "Obtiene el gris promedio \nGy = (R + G + B)/3";
    procPixel(i){
        var gris = (this.data[i] + this.data[i + 1] + this.data[i + 2]) / 3;
        this.data[i] = gris;
        this.data[i+1] = gris;
        this.data[i+2] = gris;
    }
}

export class GrisOjo extends Filtro {
    nombre = "Gris ojo";
    info = "Gy = 0.3 R + 0.59 G + 0.11 B";
    procPixel(i){
        var gris = this.data[i] * 0.3 + this.data[i + 1] * 0.59 + this.data[i + 2] * 0.11;
        this.data[i] = gris;
        this.data[i+1] = gris;
        this.data[i+2] = gris;
    }
}

export class GrisLuma extends Filtro {
    nombre = "Gris luma";
    info = "Gy = 0.2126 R + 0.7152 G + 0.0722 B";
    procPixel(i){
        var gris = this.data[i] * 0.2126 + this.data[i + 1] * 0.7152 + this.data[i + 2] * 0.0722;
        this.data[i] = gris;
        this.data[i+1] = gris;
        this.data[i+2] = gris;
    }
}

export class GrisMinMax extends Filtro {
    nombre = "Gris min-max";
    info = "Gy = (Min(R,G,B) + Max(R,G,B)) / 2";
    procPixel(i){
        var gris = (Math.max(this.data[i], this.data[i + 1], this.data[i + 2]) +
                    Math.min(this.data[i], this.data[i + 1], this.data[i + 2])) / 2;
        this.data[i] = gris;
        this.data[i+1] = gris;
        this.data[i+2] = gris;
    }
}

export class GrisMax extends Filtro {
    nombre = "Gris max";
    info = "Gy = Max(R,G,B)";
    procPixel(i){
        var gris = Math.max(this.data[i], this.data[i + 1], this.data[i + 2]);
        this.data[i] = gris;
        this.data[i+1] = gris;
        this.data[i+2] = gris;
    }
}

export class GrisMin extends Filtro {
    nombre = "Gris min";
    info = "Gy = Min(R,G,B)";
    procPixel(i){
        var gris = Math.min(this.data[i], this.data[i + 1], this.data[i + 2]);
        this.data[i] = gris;
        this.data[i+1] = gris;
        this.data[i+2] = gris;
    }
}

export class GrisRojo extends Filtro {
    nombre = "Gris rojo";
    info = "Gy = R";
    procPixel(i){
        var gris = this.data[i];
        this.data[i+1] = gris;
        this.data[i+2] = gris;
    }
}

export class GrisVerde extends Filtro {
    nombre = "Gris verde";
    info = "Gy = G";
    procPixel(i){
        var gris = this.data[i+1];
        this.data[i] = gris;
        this.data[i+2] = gris;
    }
}

export class GrisAzul extends Filtro {
    nombre = "Gris azul";
    info = "Gy = B";
    procPixel(i){
        var gris = this.data[i+2];
        this.data[i] = gris;
        this.data[i+1] = gris;
    }
}

export class Enverdecer extends Filtro {
    nombre = "Enverdecer";
    info = "Solo mantiene la componente verde";
    procPixel(i){
        this.data[i] = 0;
        this.data[i+2] = 0;
    }
}

export class Azulecer extends Filtro {
    nombre = "Azulecer";
    info = "Solo mantiene la componente azul";
    procPixel(i){
        this.data[i] = 0;
        this.data[i+1] = 0;
    }
}

export class Enrojecer extends Filtro {
    nombre = "Enrojecer";
    info = "Solo mantiene la componente roja";
    procPixel(i){
        this.data[i+1] = 0;
        this.data[i+2] = 0;
    }
}

export class AltoContraste extends Filtro {
    nombre = "Alto Contraste";
    info = "Blanco y negro al extremo";
    procPixel(i){
        var gris = (this.data[i] + this.data[i + 1] + this.data[i + 2]) / 3;
        gris = (gris > 127) ? 255 : 0;
        this.data[i] = gris;
        this.data[i+1] = gris;
        this.data[i+2] = gris;
    }
}

export class Inverso extends Filtro {
    nombre = "Inverso";
    info = "Inverso a alto contraste";
    procPixel(i){
        var gris = (this.data[i] + this.data[i + 1] + this.data[i + 2]) / 3;
        gris = (gris > 127) ? 0 : 255;
        this.data[i] = gris;
        this.data[i+1] = gris;
        this.data[i+2] = gris;
    }
}

export class Brillo extends Filtro {
    nombre = "Brillo";
    info = "Suma una constante [-255,255] a cada pixel \n(R,G,B) -> (R+c,G+c,B+c)";
    constructor(){
        super();
        this.cte = 0;
    }

    procesa() {
        //Obtener informacion sobre la constante a utilizar.
        let ccte;
        while (isNaN(ccte))
            ccte = prompt("Escribe un numero valido", 0);
        this.cte = parseInt(ccte);
        if (!isNaN(this.cte))
            super.procesa()
    }

    procPixel(i){
        this.data[i] += this.cte;
        this.data[i+1] += this.cte;
        this.data[i+2] += this.cte;
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

    procesa() {
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
        super.procesa();
    }

    procPixel(i){
        this.data[i] &= this.r;
        this.data[i+1] &= this.g;
        this.data[i+2] &= this.b;
    }
}
