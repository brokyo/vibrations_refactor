var hueRouter = require('./routes/hue.js')

var express = require('express');
const app = express();
const port = 3000;

app.use(express.json());
app.set('port', port);

app.use('/hue', hueRouter)

app.get('/', (req, res) => {
    res.send('Hello world!');
});

app.listen(port, () => {
    console.log('Open the nExt');
});