const express = require('express')
const app = express();
const path = require('path')
const ejs = require('ejs')
// const passport = require('passport');
// const LocalStrategy = require('passport-local').Strategy;

//Database
const database = require('./db/database.js');

//Routes
const routes = require('../routes/routes.js')

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
// app.use(passport.initialize());
// app.use(passport.session());
app.use(express.static('public'));


app.set('view engine', 'ejs');

app.use(routes)


//Server
const port = 9898;
app.listen(port, () => {
    console.log(`App running on port ${port}...`);
});