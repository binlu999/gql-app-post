const mongoose=require('mongoose');
const MSchema=mongoose.Schema;

const PostSchema=new MSchema({
    comment: String,
    userid:String
});

module.exports=mongoose.model('Post',PostSchema);