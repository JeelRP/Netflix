require('dotenv').config();
const express = require('express')
const router = express.Router();
const app = express();
const bcryptjs = require('bcryptjs')
const nodemailer = require("nodemailer");
const { body, validationResult } = require('express-validator');
const accountSid = process.env.SECRET_ID;
const authToken = process.env.SECRET_TOKEN;
const client = require('twilio')(accountSid, authToken);
const speakeasy = require('speakeasy');

const netflixSignupCollection = require('../src/db/database.js');

router.get('/', (req, res) => {
    res.render('index');
});

router.get('/home', (req, res) => {
    res.render('home');
});

router.get('/login', (req, res) => {
    res.render('login')
});
router.get('/contactus', (req, res) => {
    res.render('contactus')
});

router.get('/signup', (req, res) => {
    res.render('signup')
});

router.get('/step-1', (req, res) => {
    res.render('step-1');
})
router.get('/step-2', (req, res) => {
    res.render('step-2');
})

// validation
const validateRegistrationForm = [
    body('name').notEmpty().withMessage('Username is required'),
    body('email').isEmail().withMessage('Invalid email address'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    },
];

var otpsend = 0;
router.post('/signup', validateRegistrationForm, async (req, res) => {

    const name = req.body.name;
    const email = req.body.email;
    const mobile = req.body.mobile;
    const password = req.body.password;
    const cpassword = req.body.cpassword;

    const signup = new netflixSignupCollection({

        name: name,
        email: email,
        mobile: mobile,
        password: password,
        cpassword: cpassword
    })

    if (password != cpassword) {
        res.send("Password didnt match!")
    }
    
    // Send OTP via SMS
    const secret = speakeasy.generateSecret({ length: 20 });
    otpsend = speakeasy.totp({
        secret: secret.base32,
        encoding: 'base32'
    });

    client.messages
        .create({
            body: `Your OTP is: ${otpsend}`,
            from: process.env.TWILIO_NUMBER,
            to: "+91" + mobile
        })
        .then(message => console.log(message.sid));

    console.log(otpsend);
    signup.save()
        .then(() => {
            console.log('Data inserted');
            res.redirect('/step-1');
        })
        .catch((err) => {
            console.log(err);
            res.send("Something wrong with data")
        })
})

router.post('/step-1', async (req, res) => {

    const otp = req.body.otp;

    // console.log(otpsend);
    // console.log(otp);
    if (otpsend === otp) {
        console.log("OTP is same");
        res.redirect('/step-2')
    }
    else {
        res.send("OTP is invalid");
    }

})

router.post('/login', async (req, res) => {

    try {
        const email = req.body.email;
        const password = req.body.password;

        const useremail = await netflixSignupCollection.findOne({ email: email })

        const ismatch = bcryptjs.compare(password, useremail.password)
        const token = await useremail.generateAuthToken();
        if (ismatch) {
            res.redirect('/home')
            console.log('Loged in!')
        }
        else {
            res.send("Wrong pass")
        }
    }
    catch (err) {
        console.log(err)
    }

})

module.exports = router
