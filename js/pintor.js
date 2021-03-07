export default class Pintor {
    constructor(img) {
        this.nombre = "Carlos"
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext("2d");
        this.img = img;
    }

    pinta(filtro) {
        this.canvas.width = this.img.naturalWidth;
        this.canvas.height = this.img.naturalHeight;
        this.ctx.drawImage(this.img, 0, 0, this.img.naturalWidth, this.img.naturalHeight);
        var imgData = this.ctx.getImageData(0, 0, this.img.naturalWidth, this.img.naturalWidth);
        this.grayscale(imgData.data);
        this.ctx.putImageData(imgData, 0, 0);
        this.salvaImagen();
    }

    salvaImagen(){
        this.img.src = this.canvas.toDataURL("image/png");
    }

    grayscale(data) {
      for (var i = 0; i < data.length; i += 4) {
        var avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
        data[i]     = avg; // red
        data[i + 1] = avg; // green
        data[i + 2] = avg; // blue
      }
      console.log(data.length / 4);
    }
}
