const express = require('express')
const router = express.Router()
const Fav = require('../models/fav')
const User = require('../models/user')

const middleware = require('../middleware')

router.post('/fav', middleware.verify, (req, res) => {
    const newFav = Fav({ email: req.user.email, favId: req.body.favId, category: req.body.category})
    console.debug(req.user.email, " favourited ", req.body.favId)
    newFav.save(function (err) {
        if (err) return res.status(500).json(err)
    })
    res.status(200).json({ email: req.user.email, favId: req.body.favId, status: 'added to db' })
})

router.get('/favourites', middleware.verify, function (req, res) {
    const currentUser = User(req.user)
    const email = currentUser.email
    console.debug(email)
    Fav.find({email}, 'favId category -_id').then(function (favourites) {
        res.send(favourites);
    });
});

module.exports = router