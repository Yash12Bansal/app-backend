const express = require('express')
const router = express.Router()
const Profile = require('../model/profile')
const User = require('../model/user')
const {ensureAuth} = require('../middleware/auth')


const imageMimeTypes = ['image/jpg','image/jpeg','image/png','gif']

router.get('/:id',ensureAuth,async(req,res)=>{
    const profile = await Profile.findOne({userid:req.params.id}).populate('user').exec()
    if(profile){
        res.render('profiles/index',{profile})
    }else{
        const user = await User.findById(req.params.id).exec()
        res.redirect(`/profile/${user.id}/add`)
    }
    // res.send('Hi')
})
router.get('/:id/add',ensureAuth,async(req,res)=>{
    const users = await User.findById(req.params.id).exec()
    if(req.params.id==req.user.id){
        res.render('profiles/add',{users})
    }else{
        res.redirect('/dashboard')
    }
})
router.post('/:id',ensureAuth,async(req,res)=>{
    try{
        const user = await User.findById(req.params.id).exec()
        req.body.user = req.user.id
        await Profile.create(req.body)
        res.redirect(`/profile/${user.id}`)
    }catch(error){
        console.log(error)
        // res.redirect('/dashboard')
    }
})
// router.put('/:id',ensureAuth,async(req,res)=>{
//     try {
//         req.body.user = req.user.id                  POST ROUTER NEEDED
//         await Profile.create(req.body)
//         res.redirect(`/profile/${profile.id}`)
//     } catch (error) {
//         res.render('profiles/add')
//     }
// })

function saveCover(profile,coverEncoded){
    if(coverEncoded==null) return
    const cover = JSON.parse(coverEncoded)
    if(cover != null && imageMimeTypes.includes(cover.type)){
        profile.profileImage = new Buffer.from(cover.data,'base64')
        profile.profileImageType = cover.type
        console.log(cover.type)
    }
}


module.exports = router