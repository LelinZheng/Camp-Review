const express = require('express');
const app = express();
const morgan = require('morgan');

const AppError = require('./AppError');

// app.use( () => {
//     console.log('HEYYY');
// }) // this runs on every single request!

app.use(morgan('tiny')) // it logs every request

// app.use(morgan('common'))

app.use((req, res, next) => {
    //console.log(req.method.toUpperCase(), req.path) // printing "GET" and the path
    req.requestTime = Date.now();
    console.log(req.method, req.path);
    next();
})

app.use((req, res, next) => {
    console.log("I love Dogs!");
    next();
})
app.use((req, res, next) => {
    console.log("MY FIRST MIDDLEWARE!");
    next(); // need to call next, otherwises it will stop here
    console.log("MY MIDDLEWARE AFTER CALLING!"); // goes after second 
})

const verifyPassword = ((req, res, next) => { // if we do app.use, we have to put in password for every route
    const {password} = req.query;
    if(password === 'cocacola'){
        next();
    }
    throw new AppError('Password required!', 401);
    // http://localhost:3000/?password=cocacola need to write password as such
})

app.use((req, res, next) => {
    console.log("MY SECOND MIDDLEWARE!");
    return next(); // make sure nothing happens after 
    console.log("nothing!")
})


app.get('/', (req, res) => {
    console.log(`REQUEST DATE: ${req.requestTime}`);
    res.send('HOME PAGE!');
})

app.get('/admin', (req, res) => {
    throw new AppError('You are not an admin', 403);
})
app.get('/dogs', (req, res) => {
    console.log(`REQUEST DATE: ${req.requestTime}`);
    res.send('WOOF WOOF!');
})

app.get('/secrets', verifyPassword, (req, res) => { // it will run verifyPassword first
    res.send('THIS IS A TOP SECRET!');
})

app.get('/error', (req, res) => { 
    chicken; // this will trigger default error message to be 'chicken is not defined'
})

app.use((req, res) => { // to catch all other ones
    res.status(404).send("NOT FOUND!")
})


// app.use((err, req, res, next) => { // catch errors
//     console.log("****************************");
//     res.status(500).send("OH BOYYY, THERE IS AN ERROR!");
//     console.log(err)
//     next(err); // we need to pass in the error to pass into the next error handling
// })
app.use((err, req, res, next) => {
    const { status=500, message = 'Something Went Wrong' } = err; // default to 500 so any other error (not AppError) would be catched and handled
    res.status(status).send(message); 
})
app.listen(3000, () => {
    console.log('App is running on localhost:3000')
})