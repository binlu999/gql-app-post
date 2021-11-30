const express = require('express');
const {graphqlHTTP} = require('express-graphql');
const schema = require('./schema/schema');
const mongoose = require('mongoose');
const cors = require('cors');
const port = process.env.PORT || 4000;

const app=express();

//Mongodb str
//mongodb+srv://blu:<password>@cluster0.27b0r.mongodb.net/myFirstDatabase?retryWrites=true&w=majority

const mongodb_user=process.env.MONGODB_USER;
const mongodb_pwd=process.env.MONGODB_PWD
mongodb_str=`mongodb+srv://${mongodb_user}:${mongodb_pwd}@cluster0.27b0r.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`

console.log(`mongodb_user is ${mongodb_user} mongodb_pwd is ${mongodb_pwd}`);
console.log(`mhondb_str is ${mongodb_str}`);

mongoose.connect(mongodb_str);
mongoose.connection.once('open',()=>{
    console.log('Yes! we are connected!');
})

app.use(cors());

app.use('/graphql',graphqlHTTP({
    graphiql:true,
    schema:schema
}));

app.listen(port, ()=>{
    console.log('Listing on '+port);
});
