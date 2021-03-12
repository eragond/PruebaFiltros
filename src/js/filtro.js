
class Filtro {
    nombre = "";
    info = "";

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

export class Mosaico extends Filtro {
    nombre = "Mosaico";
    info = "Cuadricula la imagen en secciones del tamaño indicado";
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
