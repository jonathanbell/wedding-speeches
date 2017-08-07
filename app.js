const express = require('express');
const app = express();
app.set('port', (6969));
app.use(express.static(__dirname + '/public'));

const pug = require('pug');
const fs = require('fs');

const showdown = require('showdown');
const converter = new showdown.Converter();

var files = [];

fs.readdirSync('./speeches').forEach(file => {
	files.push(file);
})

app.get('/', function(request, response) {
	var html = pug.renderFile('./templates/main.pug', { f: files });
	response.send(html);
});

app.get('/:speechID', function(request, response) {

	if (fs.existsSync('./speeches/' + request.params.speechID)) {
	    var markdown = fs.readFileSync('./speeches/' + request.params.speechID, 'utf8');
	    html = pug.renderFile('./templates/speech.pug', { title: request.params.speechID, speech: converter.makeHtml(markdown) });
		response.send(html);
	} else {
		response.status(404).send('speech not found :(');
	}

});

app.listen(app.get('port'), function() {
	console.log('Wedding speeches are listed at: http://localhost:6969');
});
