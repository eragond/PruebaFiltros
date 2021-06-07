export class Filtro {
    nombre = "Imagen";
    info = "Restablecer";
    tipo = "Pixeles"
    ctx = undefined;
    data = undefined;

    setConfig(ctx, width, height){
        this.ctx = ctx;
        this.imgWidth = width;
        this.imgHeight = height;
        this.imgMetadata = this.ctx.getImageData(0, 0, width, height);
        this.data = this.imgMetadata.data;
    }

    procesa(){
        for (var i = 0; i < this.data.length; i += 4)
            this.procPixel(i);
    }

    cocina(){
        this.ctx.putImageData(this.imgMetadata, 0,0);
    }

    procPixel(i){} //No definido

    limpiaCanvas(){
        this.ctx.clearRect(0, 0, this.imgWidth, this.imgHeight);
    }
}
