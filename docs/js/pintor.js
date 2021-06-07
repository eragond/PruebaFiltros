import * as filtrosPixeles from "./filtroPixeles.js"
import * as filtrosConvolutivos from "./filtroConvolutivo.js"
import * as filtrosAreas from "./filtroAreas.js"

export default class Pintor {
    constructor(img) {
        this.nombre = "Carlos"                          //El pintor merece identidad.
        this.listaFiltros = {}                          //Creamos la lista de filtros.
        this.canvas = document.createElement('canvas'); //Creamos un canvas y su contexto.
        this.ctx = this.canvas.getContext("2d");
        this.img = img;                                 //Guardamos la imagen.
        this.oImg = new Image();
        this.oImg.src = img.src;
        this.superpon = false;
        for (let clase in filtrosPixeles)                           //Llenamos la lista de filtros sobre pixeles.
            this.listaFiltros[clase] = new filtrosPixeles[clase]();
        for (let clase in filtrosConvolutivos)                      //Llenamos la lista de filtros convolutivos.
            this.listaFiltros[clase] = new filtrosConvolutivos[clase]();
        for (let clase in filtrosAreas)                             //Llenamos la lista de filtros sobre areas.
            this.listaFiltros[clase] = new filtrosAreas[clase]();
    }

    //Actualiza la imagen con la que trabaja el pintor.
    updateImgSrc(imgSrc) {
        this.img.src = imgSrc;
        this.oImg.src = this.img.src;
    }

    //Dependiendo del filtro, lo aplica a la imagen.
    pinta(filtro) {
        let tempImg = new Image();
        tempImg.src = this.superpon ? this.img.src : this.oImg.src
        this.canvas.width = this.img.naturalWidth;
        this.canvas.height = this.img.naturalHeight;
        this.ctx.drawImage(tempImg, 0, 0);
        // this.ctx.drawImage(tempImg, 0, 0, this.img.naturalWidth, this.img.naturalHeight);
        // let imgData = this.ctx.getImageData(0, 0, this.img.naturalWidth, this.img.naturalHeight);
        // let ini = performance.now()
        let fActual = this.listaFiltros[filtro];
        fActual.setConfig(this.ctx, this.img.naturalWidth, this.img.naturalHeight);
        // this.listaFiltros[filtro].procesa(imgData.data);
        fActual.procesa();
        fActual.cocina();
        // let fin = performance.now()
        // console.log("Perfomance global " + (fin - ini));
        // this.ctx.putImageData(this.listaFiltros[filtro].imgMetadata, 0, 0);
        // this.ctx.putImageData(imgData, 0, 0);
        this.salvaImagen();
    }

    //Guarda una imagen.
    salvaImagen(){
        this.img.src = this.canvas.toDataURL("image/png");
    }

    //Regresa la lista de los filtros con los que cuenta el pintor.
    getListaFiltros(){  // TODO: Mejorar esta madre.
        var lista = [];
        for (let d in this.listaFiltros)
            lista.push({'fnom': d,
                        'nombre': this.listaFiltros[d].nombre,
                        'info': this.listaFiltros[d].info,
                        'tipo': this.listaFiltros[d].tipo
                        });
        return lista;
    }
}
