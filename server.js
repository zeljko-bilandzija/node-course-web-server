const express = require('express');
const hbs = require('hbs');
const fs = require('fs');

// Ovo je postavka za heroku jer on čita port iz env
const port = process.env.PORT || 3000;

const app = express();

hbs.registerPartials(__dirname + '/views/partials');
hbs.registerHelper('getCurrentYear', () => {
    return new Date().getFullYear();
});
hbs.registerHelper('capitalizeWord', (word) => {
    return word.toUpperCase();
});
// nodemon server -e js,hbs treba pokrenuti server sa ovim postavkama
app.set('view engine', 'hbs');

app.use((request, response, next) => {
    const now = new Date().toString();
    const log = `${now}: ${request.method} ${request.url}`;
    console.log(log);
    fs.appendFile('server.log', log + '\n', (err) => {
        console.log("Error writing to log file.");
    });
    next();
});

/* app.use((request, response, next) => {
    response.render('maintenance.hbs');
}); */

app.use(express.static(__dirname + '/public'));

app.get('/', (request, response) => {
    response.render("home.hbs", {
        pageTitle: 'Home Page',
        welcomeMessage: 'Welcome to home page!'
    });
});

app.get('/about', (request, response) => {
    response.render("about.hbs", {
        pageTitle: 'About Page'
    });
});

app.get('/bad', (request, response) => {
    response.send({
        errorMessage: "Some Bad Thing"
    });
});

app.listen(port, () => {
    console.log(`server started on port ${port}`);
});