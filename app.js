const express = require('express');
const bodyParser = require('body-parser');
const Account = require('./teste');

const app = express();

app.set('view engine', 'pug');
//app.set(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', (req, res, next) => {
    res.render('index.pug');
});

app.post('/do-tutorial', (req, res, next) => {
    const username = req.body.username;
    const password = req.body.password;
    const server = req.body.server;
    const proxy = req.body.proxy;

    const a = new Account(username, null, password, server);

    a.makeTutorial();
    res.redirect('/feito');
});

app.get('/feito', (req, res, next) => {
    res.render('feito.pug');
})




app.listen(3001);