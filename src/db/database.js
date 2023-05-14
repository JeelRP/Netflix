require('dotenv').config();
const mongoose = require('mongoose')
const validator = require('validator');
const bcryptjs = require('bcryptjs');
const jwt = require("jsonwebtoken");
mongoose.set("strictQuery", true);

mongoose.connect('mongodb://127.0.0.1:27017/NetflixLatest', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Connected!');
    })
    .catch((err) => {
        console.log(err);
    })

const netflixSignupSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    mobile: {
        type: String,
        required: true,
        minLength: 10,
        maxLength: 10
    },
    password: {
        type: String,
        required: true,
        
    },
    cpassword: {
        type: String,
        required: true,
        
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
})

netflixSignupSchema.methods.generateAuthToken = async function () {
    const token = await jwt.sign({ id: this._id.toString() }, process.env.SECRET_KEY);
    this.tokens = this.tokens.concat({ token: token });
    await this.save();
    return token;
}

netflixSignupSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        this.password = await bcryptjs.hash(this.password, 10);
        this.cpassword = await bcryptjs.hash(this.password, 10);
    }
    next();
})
const netflixSignupCollection = new mongoose.model('netflixSignupCollection', netflixSignupSchema)

module.exports = netflixSignupCollection;
