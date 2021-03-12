import * as filtros from "./filtro.js"

export default class Pintor {
    constructor(img) {
        this.nombre = "Carlos"                      //El pintor merece identidad.
        this.listaFiltros = {}                      //Creamos la lista de filtros.
        this.canvas = document.createElement('canvas'); //Creamos un canvas y su contexto.
        this.ctx = this.canvas.getContext("2d");
        this.img = img;                                 //Guardamos la imagen.
        this.oImg = new Image();
        this.oImg.src = img.src;
        this.superpon = false;
        for (let clase in filtros)                  //Llenamos la lista de filtros.
            this.listaFiltros[clase] = new filtros[clase]();
    }

    updateImgSrc(imgSrc) {
        this.img.src = imgSrc;
        this.oImg.src = this.img.src;
    }

    pinta(filtro) {
        let tempImg = new Image();
        tempImg.src = this.superpon ? this.img.src : this.oImg.src
        this.canvas.width = this.img.naturalWidth;
        this.canvas.height = this.img.naturalHeight;
        this.ctx.drawImage(tempImg, 0, 0, this.img.naturalWidth, this.img.naturalHeight);
        let imgData = this.ctx.getImageData(0, 0, this.img.naturalWidth, this.img.naturalWidth);
        // let ini = performance.now()
        this.listaFiltros[filtro].setWidthHeight(this.img.naturalWidth, this.img.naturalHeight);
        this.listaFiltros[filtro].procesa(imgData.data);
        // let fin = performance.now()
        // console.log("Perfomance global " + (fin - ini));
        this.ctx.putImageData(imgData, 0, 0);
        this.salvaImagen();
    }

    salvaImagen(){
        this.img.src = this.canvas.toDataURL("image/png");
    }

    getListaFiltros(){
        var lista = [];
        for (let d in this.listaFiltros)
            lista.push({'fnom':d ,
                        'nom': this.listaFiltros[d].nombre,
                        'info': this.listaFiltros[d].info}
                      );

        return lista;
    }
}
