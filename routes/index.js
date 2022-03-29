const express = require('express')
const passport = require('passport')
const router = express.Router()
const { ensureAuth , ensureGuest } = require('../middleware/auth')
const Story = require('../model/story')

router.get('/',(req,res)=>{
    res.render('index')
})
router.get('/about',(req,res)=>{
    res.render('about')
})
router.get('/services',(req,res)=>{
    res.render('services')
})

router.get('/login',ensureGuest, (req,res)=>{
    res.render('signup');
})

router.get('/dashboard',ensureAuth,async (req,res)=>{
    // console.log(req.user)
    try {
        const stories = await Story.find({user:req.user.id}).populate('user').exec()
        res.render('dashboard1',{
            id:req.user.id,
            name: req.user.firstName,
            profimage: req.user.image,
            email: req.user.email,
            stories
        });
    } catch (error) {
        console.log(error)
    }
})

module.exports = router