var hueRouter = require('./routes/hue.js')

var express = require('express');
var cors = require('cors');
const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());
app.set('port', port);

app.use('/hue', hueRouter)

app.get('/', (req, res) => {
    res.send('Hello world!');
});

app.listen(port, () => {
    console.log('Open the nExt');
});