const express = require('express');

const app = express();
const { Router } = express;
const router = Router();

app.use(express.json());
app.use(express.urlencoded({ extended: true }))

app.set('view engine', 'ejs');
app.use(express.static('./public'))

const PORT = 8080;

app.use('/static', express.static((__dirname + 'public')));
app.use(express.static('./public'))

const mongoStore = require('connect-mongo')
const session = require('express-session');

app.use(session({
    store: mongoStore.create({ mongoUrl: 'mongodb://localhost/sesiones' }),
    secret: 'san',
    resave: false,
    saveUninitialized: false
}))


function login(user, pass, req, res) {


    if (user == 'userAdmin' && pass == '0000') {

        req.session.user = user;
        req.session.admin = true;
        req.session.logged = true;
        req.session.cookie.maxAge = 30000;
        res.redirect('/index')
    } else if (user == 'user' && pass == '1111') {
        req.session.user = user;
        req.session.admin = false;
        req.session.logged = true;
        req.session.cookie.maxAge = 30000;
        res.redirect('/index');
    } else {

        res.redirect('/login')
    }
}



app.get('/login', function (req, res) {
    if (req.session.logged == false) {
        res.render('pages/login', {

        });
    } else {
        res.redirect('/index');
    }

})

app.post('/login', function (req, res) {

    let user = req.body.user;
    let pass = req.body.pass;
    login(user, pass, req, res);

})

app.get('/index', function (req, res) {
    let user = req.session.user;

    if (req.session.admin == true) {
        req.session.cookie.maxAge = 30000;
        res.render('pages/indexAdm', {
            user: user,
        });
    } else if (req.session.logged == true) {
        req.session.cookie.maxAge = 30000;
        res.render('pages/index', {
            user: user,
        });
    } else {
        res.redirect('/login')

    }

})




app.post('/logout', (req, res) => {
    let user = req.session.user;
    res.render('pages/despedida', {
        user: user,
    });
    req.session.destroy(err => {
        if (err) {
            return res.json({ status: 'error de log out ', body: err })
        }
    })
});







app.listen(PORT, () => console.log('SERVER ON'))
