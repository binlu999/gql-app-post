const mongoose=require('mongoose');
const MSchema=mongoose.Schema;

const HobbySchema=new MSchema({
    title: String,
    description: String,
    userid:String
});

module.exports=mongoose.model('Hobby',HobbySchema);