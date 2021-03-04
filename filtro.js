
window.onload = function() {
    console.log("Listo");
    var canv = document.getElementById("canv");
    var img = document.getElementById("imagen");
    // img.crossOrigin = "Anonymous";
    var ctx = canv.getContext("2d");
    canv.width = img.width;
    canv.height = img.height;
    // canv.width = 100;
    // canv.height = 100;
    ctx.drawImage(img,0,0);

    var imgData = ctx.getImageData(0, 0, canv.width, canv.height);
    var data = imgData.data;

    grayscale();

    function grayscale() {
      for (var i = 0; i < data.length; i += 4) {
        var avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
        data[i]     = avg; // red
        data[i + 1] = avg; // green
        data[i + 2] = avg; // blue
      }
      ctx.putImageData(imgData, 0, 0);
    }


}
