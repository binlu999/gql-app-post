const mongoose = require('mongoose');
const MSchema = mongoose.Schema;

const UserSchema = new MSchema({
    name: String,
    age: Number,
    profession: String,
});

module.exports = mongoose.model('User',UserSchema);
