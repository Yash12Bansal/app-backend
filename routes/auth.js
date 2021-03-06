const express = require('express')
const passport = require('passport')
const router = express.Router()

router.get('/google',passport.authenticate('google',{ scope: ['profile','email'] }))


router.get('/google/callback',passport.authenticate('google', { failureRedirect: '/signup' }),(req,res)=>{
    res.redirect('/dashboard');
})


router.get('/logout',(req,res)=>{
    req.logOut()
    res.redirect('/login')
})

module.exports = router