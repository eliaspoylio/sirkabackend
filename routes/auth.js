const express = require('express')
const router = express.Router()
const User = require('../models/user')
const bcrypt = require('bcrypt')
const rounds = 10
require('dotenv').config();

const jwt = require('jsonwebtoken')
const tokenSecret = process.env.TOKEN_SECRET

const middleware = require('../middleware')

router.post('/login', (req, res) => {
    User.findOne({email: req.body.email})
    .then(user => {
        if(!user) res.status(404).json({error: 'User not found'})
        else {
            bcrypt.compare(req.body.password, user.password, (error, match) => {
                if (error) res.status(500).json(error)
                else if (match) res.status(200).json({token: generateToken(user)})
                else res.status(403).json({error: 'Passwords do not match'})
            })
        }
    })
})

router.post('/signup', (req, res) => {
    bcrypt.hash(req.body.password, rounds, (error, hash) => {
        if (error) res.status(500).json(error)
        else {
            const newUser = User({name: req.body.name, email: req.body.email, password: hash})
            newUser.save()
            .then(user => {
                res.status(200).json({token: generateToken(user)})
            })
            .catch(error => {
                res.status(500).json(error)
            })
        }
    })
})

router.get('/jwt-test', middleware.verify, (req, res) => {
    res.status(200).json(req.user)
})

function generateToken(user){
    return jwt.sign({data: user}, tokenSecret, {expiresIn: '1h'})
}

module.exports = router