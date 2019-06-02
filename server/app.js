const path = require('path');
const routerApi = require('./route');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

app.use(bodyParser.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static(path.join(__dirname, '/public')));

app.use('/', routerApi);
app.listen(3000);
console.log('listen at port:3000...');
