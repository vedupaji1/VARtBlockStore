const express = require('express');
const passport = require('passport');
const router = express.Router();

router.get('/google', passport.authenticate('google', {
    scope: ['profile', 'email']
}))

router.get(
    '/google/callback',
    passport.authenticate('google', {
        failureRedirect: '/auth/google/failure'
    }), (req, res) => {
        res.cookie(`ses`, { // Creating Cookie, Visit "https://www.section.io/engineering-education/what-are-cookies-nodejs/" For More Info.
            token: req.user
        }, {
            expires: new Date(Date.now() + (1000 * 60 * 60 * 24 * 30)),
            httpOnly: true
        })
        console.log(req.user)
        res.redirect("/");
    }
)

module.exports = router;