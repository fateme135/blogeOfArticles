const express = require('express')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const app = express()
const mongoose = require('mongoose')
const User = require('./model/user-for-hw8')
const Article = require('./model/article-for-hw8')
const passport = require('passport');
const session = require('express-session');
const LocalStrategy = require('passport-local').Strategy;
// const path = require("path")
// const multer = require('multer')
var db = mongoose.connect('mongodb://localhost:27017/homework8fatemehmohamadi', { useCreateIndex: true, useNewUrlParser: true }, function (err, res) {
    if (err) { console.log('Failed to connect to ' + db); }
    else { console.log('Connected to ' + db); }
});
app.set('view engine', 'ejs');
app.use(morgan('dev'))
app.use(express.static('public'))


app.use(session({
    secret: '@l!',
    resave: true,
    saveUninitialized: true,
    cookie: {
        maxAge: 6000000
    }
}));

app.use(passport.initialize());
app.use(passport.session());


app.use(bodyParser.json()) // parse application/json
app.use(bodyParser.urlencoded({ // parse application/x-www-form-urlencoded
    extended: false
}))
//////////////////////////////////////////////////////////////////////////////////


app.post('/create-user', function (req, res) {
    const REQ_BODY1 = req.body;
    if (!req.body) return res.sendStatus(400)
    console.log(REQ_BODY1)


    let user = new User({
        firstname: REQ_BODY1.fname,
        lastname: REQ_BODY1.lname,
        username:REQ_BODY1.uname,
        password: REQ_BODY1.psw,
    })

    user.save(function (err, user) {
        if (err)
            return console.log(err)

        //     res.json(user) //ye safheye json miare.....
        // });


        res.render("sabtename.ejs", { //bagasht b safheye sabtename....
            msg: "Seccess"
        });
    })
})
/////////////////////////////////////////////////////////////////////////////////

app.get('/', function (req, res) {
    res.render('sabtename.ejs')
})


passport.use('local-login', new LocalStrategy(function (username, password, done) { //for log in

    User.findOne({
        username: username
    }, function (err, user) {

        if (err) {
            console.log('erorr');
            return done(err);
        }

        if (!user) {
            console.log('user is false');
            return done(null, false, {})
        }

        if (user.password !== password) {
            console.log('password is false');
            return done(null, false, {})
        }

        console.log('Okey you are login....');
        return done(null, user)
    })
}));

passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
        done(err, user);
    });
});


function isLogedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } else {
        // return res.send('نمیتونی بیای');
        return res.redirect("/login");
    }
}
app.get('/login', function (req, res) {
    res.render("sabtename.ejs")
})

app.post('/authentication', passport.authenticate('local-login', {
    failureRedirect: '/worth'
}), function (req, res) {
    console.log(req.body);
    res.redirect('/dashboard');
});

app.get('/worth', function (req, res) {
    res.render("sabtename.ejs")
})
app.get('/dashboard', isLogedIn, function (req, res) {
    Article.find({}, function (err, articles) {
        if (err)
        
            res.send(err);

        articles.forEach(function (article, index) {
            User.findById(article.author, function (err, user) {
                if (err)
                    res.send(err);

                article.author = user.firstname;
                if (index == articles.length - 1) {
                    res.render("article.ejs", {
                        articles
                    })
                }
            })
        })

    })
})




///////////////////////////////////////////////////////////////////////////////



app.post("/save-article", isLogedIn, function (req, res) {
    
    const REQ_BODY = req.body;

    if (!req.body) return res.sendStatus(400)
    let article = new Article({
        name: REQ_BODY.name,
        author: req.user._id,
        //  author: req.body.author,
        shortTxt:REQ_BODY.abstract,
        longTxt: REQ_BODY.article,
        date: REQ_BODY.date,
        link:REQ_BODY.name,
    });

    article.save(function (err, article) {
        if (err)
            return console.log(err)


        //    res.json(article)
        
        res.redirect('/dashboard') ;//bagasht b safheye sabtename....

       
    })


})
//////////////////////////////////////////////////////////////////////
app.get("/article/:cont", isLogedIn, function (req, res) {

    let news;
    Article.findOne({
        name: req.params.cont
    }, function (err, article) {
        if (err)
            res.send(err);


        User.findById(article.author, function (err, user) {
            if (err)
                res.send(err);
            res.render("read-article.ejs", {
                name: article.name,
                author: user.firstname,
                shortTxt: article.shortTxt,
                longTxt: article.longTxt,
                date: article.date,
               

            })

        })

    })

})


app.listen(3030)