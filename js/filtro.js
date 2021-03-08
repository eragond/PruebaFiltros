
class Filtro {
    // constructor() {
    //     this.nombre = "Vacio"
    // }
    //
    procesa(data) {
        for (var i = 0; i < data.length; i += 4) {
          this.procPixel(data, i);
        }
    }

    // Se ve feo, pero es mucho mas eficiente.
    procPixel(data, i){
        var avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
        data[i] = avg;
        data[i+1] = avg;
        data[i+2] = avg;
    }
}

export class GrisPromedio extends Filtro {
    procPixel(data, i){
        var gris = (data[i] + data[i + 1] + data[i + 2]) / 3;
        data[i] = gris;
        data[i+1] = gris;
        data[i+2] = gris;
    }
}

export class GrisOjo extends Filtro {
    procPixel(data, i){
        var gris = (data[i] * 0.3 + data[i + 1] * 0.59 + data[i + 2] * 0.11) / 3;
        data[i] = gris;
        data[i+1] = gris;
        data[i+2] = gris;
    }
}

export class GrisLuma extends Filtro {
    procPixel(data, i){
        var gris = (data[i] * 0.2126 + data[i + 1] * 0.7152 + data[i + 2] * 0.0722) / 3;
        data[i] = gris;
        data[i+1] = gris;
        data[i+2] = gris;
    }
}

export class GrisMinMax extends Filtro {
    procPixel(data, i){
        var gris = (Math.max(data[i], data[i + 1], data[i + 2]) +
                    Math.min(data[i], data[i + 1], data[i + 2])) / 2;
        data[i] = gris;
        data[i+1] = gris;
        data[i+2] = gris;
    }
}

export class GrisMax extends Filtro {
    procPixel(data, i){
        var gris = Math.max(data[i], data[i + 1], data[i + 2]);
        data[i] = gris;
        data[i+1] = gris;
        data[i+2] = gris;
    }
}

export class GrisMin extends Filtro {
    procPixel(data, i){
        var gris = Math.min(data[i], data[i + 1], data[i + 2]);
        data[i] = gris;
        data[i+1] = gris;
        data[i+2] = gris;
    }
}

export class GrisRojo extends Filtro {
    procPixel(data, i){
        var gris = data[i];
        data[i+1] = gris;
        data[i+2] = gris;
    }
}

export class GrisVerde extends Filtro {
    procPixel(data, i){
        var gris = data[i+1];
        data[i] = gris;
        data[i+2] = gris;
    }
}

export class GrisAzul extends Filtro {
    procPixel(data, i){
        var gris = data[i+2];
        data[i] = gris;
        data[i+1] = gris;
    }
}

export class Mosaico extends Filtro {
    procesa(data) {
        let width = prompt("Ancho");
        let height = prompt("Alto");
    }
    procPixel(data, i){
        var gris = data[i+2];
        data[i] = gris;
        data[i+1] = gris;
    }
}
