const express = require('express');
const hbs = require('hbs');
const fs = require('fs');

const app = express();

// Register partials folder -- PLACE BEFORE SETTING VIEW ENGINE
hbs.registerPartials(__dirname + '/views/partials');

// HBS helper (1-funcName, 2-funcBody)
hbs.registerHelper('getCurrentYear', ()=> new Date().getFullYear());

// HBS helper with parameters
// Args passing -- funcNameWithoutParenthesis <space> arg
hbs.registerHelper('toCapital', (text)=> text.toUpperCase());

// Setting view engine
app.set('view engine', 'hbs');

// Custom middleware -- DON'T FORGET TO CALL NEXT()
app.use((req, res, next)=>{
    // logger middleware custom made
    let curTime = new Date().toLocaleString();
    let logText = `${curTime} : ${req.method} - ${req.url}\n`;
    fs.appendFile('logger.log', logText, (err)=>{
        if (err) {
            console.log(err);
        }
    });
    next();
});

// Middleware to re-route to maintenance page
// app.use((req, res, next)=>{
//     res.render('maintenance');
// });



// Middleware for static pages
app.use(express.static(__dirname + '/public'));
// http://localhost:3000/help.html


app.get('/', (req, res)=>{
    res.send('Hello Express!');
});

app.get('/about', (req, res)=>{
    let msg = {
        text: "This is a test message rendered by view engine - hbs"
    };
    res.render('about', {
        msg,
        pageTitle : "About",
        currentYear : new Date().getFullYear()
    });
});



app.listen(3000, ()=>{
    console.log('Server started');    
});