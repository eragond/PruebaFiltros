import {Filtro} from "./filtro.js"

class FiltroArea extends Filtro {
    nombre = "Mosaico";
    info = "Cuadricula la imagen en secciones del tamaño indicado";
    tipo = "Areas";

    // cb - Callback de preprocesamiento.
    // width, height  - Dimensiones predefinidas.
    procesa(cb, width, height) {
        //Obtener informacion sobre las dimensiones del area.
        while (isNaN(width))
            width = prompt("Escribe un ancho valido", 10);
        while (isNaN(height))
            height = prompt("Escribe un alto valido", 10);
        width = Math.max(1, Math.abs(parseInt(width)));
        height = Math.max(1, Math.abs(parseInt(height)));

        if(cb && typeof(cb) === "function")
            cb(width, height);

        // Procesamiento, recorremos secciones del tamaño indicado.
        if (!isNaN(width) && !isNaN(height))
            for (let y = 0; y < this.imgHeight; y += height)
                for (let x = 0; x < this.imgWidth; x += width)
                    this.mosaicoSeccion(x, y, width, height);
    }

    //Obtiene el color promedio de una seccion y lo aplica a cada pixel en esta.
    mosaicoSeccion(x, y, wd, ht){
        throw new Error("Metodo no implementado en clase abstracta");
    }

}

export class Mosaico extends FiltroArea {
    nombre = "Mosaico";
    info = "Secciona la imagen y colorea la seccion con el color promedio";

    //Obtiene el color promedio de una seccion y lo aplica a cada pixel en esta.
    mosaicoSeccion(x, y, wd, ht){
        let colorPromedio = this.colorPromedio(x, y, wd, ht); //Obtenemos el color promedio
        this.colorSeccion(x, y, wd, ht, colorPromedio); //Aplicamos este color a la seccion
    }

    // Aplica un color a una seccion
    colorSeccion(x, y, wd, ht, color){               //Pintamos los pixeles, de una seccion.
        for (let j = 0; j < ht; j++){           //Recorremos la seccion de anchura x altura.
            for (let i = 0; i < wd; i++){
                let place = ((x+i) + (y+j)*this.imgWidth)*4;    //Posicion del pixel en el arreglo data.
                if (i + x < this.imgWidth && j + y < this.imgHeight) { //Verificamos fronteras.
                    this.data[place] = color[0];
                    this.data[place+1] = color[1];
                    this.data[place+2] = color[2];
                }
            }
        }
    }

    //Regresa el color promedio de una seccion.
    colorPromedio(x, y, wd, ht){
        let sumaTotal = [0,0,0];  //Auxiliar para guardar los colores promedio.
        let total = 0;            //Auxiliar para obtener el total de pixeles en la seccion.
        for (let j = 0; j < ht; j++)           //Recorremos la seccion de anchura x altura.
            for (let i = 0; i < wd; i++){
                let place = ((x+i) + (y+j)*this.imgWidth)*4;    //Posicion del pixel en el arreglo data.
                if (i + x < this.imgWidth && j + y < this.imgHeight) { //Verificamos fronteras.
                    total += 1;             //Contador para promediar.
                    sumaTotal[0] += this.data[place];
                    sumaTotal[1] += this.data[place+1];
                    sumaTotal[2] += this.data[place+2];
                }
            }
        sumaTotal = sumaTotal.map(t => t/total);
        return sumaTotal;
    }

}

export class FiltroLetras extends Mosaico {
    nombre = "Letras Frase";
    info = "Hace una imagen con frase";
    frase = "M";            //Frase a ser usada
    pFse = 0;               //Apuntador al caracter actual de la frase
    colorSec = [0,0,0];     //Color de la seccion actual
    colorG = false;         //Para tomar tonos de grises
    setFrase = false;       //Frase variable o fija.

    procesa() {
        if (!this.setFrase) //Si la frase es variable
            this.frase = prompt("Escribe una frase", "Hola").toUpperCase();

        this.tempData = this.data.slice(); //Necesitamos una copia, dado que el fondo es blanco.
        this.limpiaCanvas();               // Limpiamos el fondo
        super.procesa((w, h) => {
            this.ctx.font = h+"px Arial";  //Asignamos el tamaño de letra a la altura de la seccion.
        });
    }

    //Obtiene el color promedio de una seccion y lo aplica a cada pixel en esta.
    mosaicoSeccion(x, y, wd, ht){
        this.selectColor(x, y, wd, ht);
        this.ctx.fillText(this.selectChar(),x,y);
    }

    //  Seleccional el color a usar en la seccion.
    selectColor(x, y, wd, ht){
        this.colorSec = this.colorPromedio(x, y, wd, ht);
        if (this.colorG){
            let tempG = this.colorSec.reduce((a, b) => a+b);
            this.colorSec = this.colorSec.map(t => tempG/3);
        }
        this.ctx.fillStyle = 'rgb('+this.colorSec[0]+
                               ','+ this.colorSec[1]+
                               ','+ this.colorSec[2]+')';
    }

    // Que caracter de la frase hay que procesar.
    selectChar(){
        this.pFse = (this.pFse + 1) % this.frase.length;
        return this.frase[this.pFse];
    }

    // En estos filtros no se aplican procesos a pixeles.
    cocina(){}
}

export class FiltroMColor extends FiltroLetras {
    nombre = "LetraM-Color";
    info = "Hace una imagen a color con la letra M";
    frase = "M"
    colorG = false;
    setFrase = true;

}

export class FiltroMBN extends FiltroLetras {
    nombre = "LetraM-BN";
    frase = "M"
    info = "Hace una imagen en tonos de grises con la letra M";
    colorG = true;
    setFrase = true;
}

export class LetrasTonos extends FiltroLetras {
    nombre = "Letras Tonos Caracteres";
    info = "Asigna a cada seccion un caracter dependiendo de su tono";
    //Tonos a considerar como tonos. Del mas fuerte al mas debil.
    tonos = ['M','N','H','#','Q','U','A','D','0','Y','2','$','%','+','.'," "];
    colorG = true;
    setFrase = true;
    noColor = true;

    mosaicoSeccion(x, y, wd, ht){
        this.selectColor(x, y, wd, ht);
        if(this.noColor)
            this.ctx.fillStyle = 'rgb(0,0,0)';
        this.ctx.fillText(this.selectChar(), x, y);
    }

    selectChar(){
        let color = this.colorSec;
        let tempG = color.reduce((a, b) => a+b);
        color = color.map(t => tempG/3);
        return this.tonos[Math.floor(color[0]/(255/this.tonos.length))];
    }
}

export class LetrasTonosGris extends LetrasTonos {
    nombre = "Letras TonosC Gris";
    info = "Lo mismo que Letras Tonos Caracteres, pero coloreando la letra a grises";
    colorG = true;
    noColor = false;
}

export class LetrasTonosColor extends LetrasTonos {
    nombre = "Letras TonosC Color";
    info = "Lo mismo que Letras Tonos Caracteres, pero coloreando la letra";
    colorG = false;
    noColor = false;
}


export class Dados extends LetrasTonos {
    nombre = "Dados";
    info = "Cuadricula la imagen con dados";
    tonos = ['\u2685', '\u2684', '\u2683', '\u2682', '\u2681', '\u2680'];
    noColor = true;
}

export class DadosColor extends Dados {
    nombre = "Dados Color";
    info = "Cuadricula la imagen con dados a color";
    colorG = false;
    noColor = false;
}

export class Naipes extends LetrasTonos {
    nombre = "Naipes";
    info = "Cuadricula la imagen con naipes";
    tonos = ["\uD83C\uDCA0", "\uD83C\uDCAE", "\uD83C\uDCAD", "\uD83C\uDCAC",
             "\uD83C\uDCAB", "\uD83C\uDCAA", "\uD83C\uDCA9", "\uD83C\uDCA8",
             "\uD83C\uDCA7", "\uD83C\uDCA6", "\uD83C\uDCA5", "\uD83C\uDCA4",
             "\uD83C\uDCA3", "\uD83C\uDCA2", "\uD83C\uDCA1"];
    noColor = true;
}

export class NaipesColor extends Naipes {
    nombre = "Naipes Color";
    info = "Cuadricula la imagen con naipes a color";
    colorG = false;
    noColor = false;
}

export class Dominos extends LetrasTonos {
    nombre = "Dominos";
    info = "Cuadricula la imagen con dominos";
    tonos = ["\uD83C\uDC62", "\uD83C\uDC93", "\uD83C\uDC8B",
             "\uD83C\uDC83", "\uD83C\uDC7B", "\uD83C\uDC73",
             "\uD83C\uDC6B", "\uD83C\uDC63"];
    noColor = true;
}

export class DominosColor extends Dominos  {
    nombre = "Dominos Color";
    info = "Cuadricula la imagen con dominos a color";
    colorG = false;
    noColor = false;
}

export class GoPieces extends LetrasTonos {
    nombre = "Marcadores de Go";
    info = "Cuadricula la imagen con marcadores de Go";
    tonos = ["\u2689", "\u2688", "\u25CF", "\u2687", "\u2686", "\u25CB"];
    noColor = true;
}

export class ChessPieces extends LetrasTonos {
    nombre = "Piezas de Ajedrez";
    info = "Cuadricula la imagen con piezas de Ajedrez";
    tonos = ["\u265A", "\u265B", "\u265C", "\u265D", "\u265E", "\u265F",
             "\u2654", "\u2655", "\u2656", "\u2657", "\u2658", "\u2659"];
    noColor = true;
}
