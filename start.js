var express = require('express');
var app = express();
var fs = require('fs');

app.set('port', (process.env.PORT || 5000));

function testFunc() {
  fs.writeFile('result.json', JSON.stringify({}, null, 4), (err, data) => {
    console.log(err, data);
});
}

app.use(express.static(__dirname));

// views is directory for all template files
app.set('views', __dirname + '/html');
app.set('view engine', 'ejs');

app.get('/', function(request, response) {
  response.render('index.html');
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});

