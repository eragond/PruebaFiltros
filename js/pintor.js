import * as filtros from "./filtro.js"

export default class Pintor {
    constructor(img) {
        this.nombre = "Carlos"                      //El pintor merece identidad.
        this.listaFiltros = {}                      //Creamos la lista de filtros.
        for (let clase in filtros)                  //Llenamos la lista de filtros.
            this.listaFiltros[clase] = new filtros[clase]();
        this.canvas = document.createElement('canvas'); //Creamos un canvas y su contexto.
        this.ctx = this.canvas.getContext("2d");
        this.img = img;                                 //Guardamos la imagen.
    }

    pinta(filtro) {
        this.canvas.width = this.img.naturalWidth;
        this.canvas.height = this.img.naturalHeight;
        this.ctx.drawImage(this.img, 0, 0, this.img.naturalWidth, this.img.naturalHeight);
        var imgData = this.ctx.getImageData(0, 0, this.img.naturalWidth, this.img.naturalWidth);
        var ini = performance.now()
        this.listaFiltros[filtro].procesa(imgData.data);
        var fin = performance.now()
        console.log("Perfomance global " + (fin - ini));
        this.ctx.putImageData(imgData, 0, 0);
        this.salvaImagen();
    }

    salvaImagen(){
        this.img.src = this.canvas.toDataURL("image/png");
    }

    getListaFiltros(){
        var lista = [];
        for (let name in this.listaFiltros)
            lista.push(name);
        return lista;
    }
}
