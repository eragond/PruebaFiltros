import {Filtro} from "./filtro.js"

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
                    this.mosaicoSeccion(x, y, width, height);
    }

    //Obtiene el color promedio de una seccion y lo aplica a cada pixel en esta.
    mosaicoSeccion(x, y, wd, ht){
        let sumaTotal = [0,0,0];  //Auxiliar para guardar los colores promedio.
        let total = 0;            //Auxiliar para obtener el total de pixeles en la seccion.

        for (let round = 0; round < 2; round++){    //Dos rondas
            for (let j = 0; j < ht; j++){           //Recorremos la seccion de anchura x altura.
                for (let i = 0; i < wd; i++){
                    let place = ((x+i) + (y+j)*this.imgWidth)*4;    //Posicion del pixel en el arreglo data.
                    if (i + x < this.imgWidth && j + y < this.imgHeight) { //Verificamos fronteras.
                        if (round == 0) {           //Primera ronda, leer info de los pixeles.
                            total += 1;             //Contador para promediar.
                            sumaTotal[0] += this.data[place];
                            sumaTotal[1] += this.data[place+1];
                            sumaTotal[2] += this.data[place+2];
                        } else {                    //Segunda ronda, escribir sobre los pixeles.
                            this.data[place] = sumaTotal[0];
                            this.data[place+1] = sumaTotal[1];
                            this.data[place+2] = sumaTotal[2];
                        }
                    }
                }
            }
            sumaTotal = sumaTotal.map(t => t/total); //Procesar el promedio entre rondas.
        }

    }
}
