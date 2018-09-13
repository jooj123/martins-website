let express = require('express');
let app = express();
let path = require('path');

app.use(express.static('public'))

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname + '/index.html'));
});

app.listen(3000);