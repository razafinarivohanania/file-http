const express = require('express');
const app = express();
const list = require('./src/list');
const parseArgs = require('./src/args');

const args = parseArgs();

app.set('view engine', 'ejs');
app.use(express.static('public'));

app.get('/', async (req, res) => await list(req, res, args));

app.get('/empty', (req, res) => res.render('empty'));

app.listen(args.port, args.host, () => {
    console.log(`Server running on host [${args.host}] and port [${args.port}]`);
    console.log(`Go to http://${args.host}:${args.port} to list contents folder`);
});