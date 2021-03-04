
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
    // console.log(imgData);
};
