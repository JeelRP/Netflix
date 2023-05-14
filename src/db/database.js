const mongoose = require('mongoose')
const validator = require('validator');
const bcryptjs = require('bcryptjs');
mongoose.set("strictQuery", true);

mongoose.connect('mongodb://127.0.0.1:27017/NetflixLatest', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Connected!');
    })
    .catch((err) => {
        console.log(err);
    })

// const netflixSignupSchema = new mongoose.Schema({

//     name: {
//         type: String,
//         required: true,
//     },
//     email: {
//         type: String,
//         required: true,
//     },
//     password: {
//         type: String,
//         required: true,
//     },
//     cpassword: {
//         type: String,
//         required: true,
//     }
// })

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
        required: true
    },
    password: {
        type: String,
        required: true,
    },
    cpassword: {
        type: String,
        required: true,
    }
})

netflixSignupSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        this.password = await bcryptjs.hash(this.password, 10);
        this.cpassword = undefined;
    }
    next();
})
const netflixSignupCollection = new mongoose.model('netflixSignupCollection', netflixSignupSchema)

module.exports = netflixSignupCollection;