const mongoose = require('mongoose');

const ProfileSchema = mongoose.Schema({

    title:{
        type: String,
        required: true
    },
    description:{
        type: String,
        required: true
    },
    // profileImage:{
    //     type: Buffer,
    //     required: true
    // },
    // profileImageType:{
    //     type: String,
    //     required: true
    // },
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    createdAt:{
        type: Date,
        required: true,
        default: Date.now
    }
})

// ProfileSchema.virtual('profileImagePath').get(function(){
//     if(this.profileImage !=null && this.profileImageType != null){
//         return `data:${this.profileImageType};charset=utf-8;base64,${this.profileImage.toString('base64')}`
//     }
// })

module.exports = mongoose.model('Profile',ProfileSchema)