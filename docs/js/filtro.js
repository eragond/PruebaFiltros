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

        // Otro recorrido
        // for (let j = 0; j < this.imgHeight; j++)
        //      for (let i = 0; i < this.imgWidth; i++)
        //          this.procPixel((i + j*this.imgWidth)*4);
    }

    cocina(){
        this.ctx.putImageData(this.imgMetadata, 0,0);
    }

    procPixel(i){} //No definido
}
