var express = require('express');
var app = express();
var path = require('path');
const port = 3000;

app.use(express.static(__dirname + '/docs/'));

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/docs/index.html'));
});

app.listen(port, () => {
  console.log(`Servidor corriendo en puerto: ${port}`)
})
