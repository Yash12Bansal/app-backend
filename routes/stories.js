const express = require('express')
const router = express.Router()
const { ensureAuth } = require('../middleware/auth')
const Story = require('../model/story')
const User = require('../model/user')

router.get('/',ensureAuth,async(req,res)=>{
    try {
        const stories = await Story.find({status:'public'}).populate('user').sort({createdAt: 'desc'}).exec()
        // stories.map((story) => {
        //     if(story.user.id === req.user.id) {
        //         console.log("por que maria", story.user.title);
        //     } else {
        //         console.log("por que no maria")
        //     }
        // })
        res.render('stories/index',{stories})
    } catch (error) {
        console.log(error)
    }
})
router.get('/:id',ensureAuth,async(req,res)=>{
    try {
        const story = await Story.findById(req.params.id).populate('user').lean()
        res.render('stories/show',{story})
    } catch (error) {
        console.log(error)
    }
})
router.get('/:id/add',ensureAuth,async(req,res)=>{
    const user = await User.findById(req.params.id).exec()
    if(req.params.id==req.user.id){
        res.render('stories/add',{user})
    }else{
        res.json({message:"You are not authorized"})
        // res.redirect('/dashboard')
    }
})

router.post('/:id',ensureAuth,async(req,res)=>{
    try {        
        req.body.user = req.user.id
        await Story.create(req.body)
        res.redirect('/dashboard')
    } catch (error) {
        console.log(error)
    }
})

router.get('/:id/edit',ensureAuth,async(req,res)=>{
    const story = await Story.findOne({_id:req.params.id}).exec()
    if(story.user != req.user.id){
        // console.log(req.user.id)
        // console.log(story.user)
        res.redirect('/stories')
    }else{
        // console.log(req.user.id)
        // console.log(story.user)
        res.render('stories/edit',{story})
    }
})
router.put('/:id',ensureAuth,async(req,res)=>{
    const story = await Story.findOne({_id:req.params.id}).exec()
    // console.log(story.title)
    try {
        if(story.user != req.user.id){
            res.redirect('/stories')
        }else{
            story.title=req.body.title
            story.body=req.body.body
            story.status=req.body.status
            await story.save()
            res.redirect('/stories')
        }
    } catch (error) {
        console.log(error)
    }
})
router.delete('/:id', async (req,res)=>{
    let story
    try {
        story = await Story.findById(req.params.id)
        await story.remove()
        res.redirect('/dashboard')
    } catch{
        res.redirect('/dashboard')
    }
})
module.exports = router