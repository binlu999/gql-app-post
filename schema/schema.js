const graphql = require("graphql");
const _ = require('lodash')
const { GraphQLObjectType, GraphQLID, GraphQLString, GraphQLInt, GraphQLSchema, GraphQLList,GraphQLNonNull } = graphql;
const User = require('../models/user');
const Hobby = require('../models/hobby');
const Post=require('../models/post');


//Dummy data
/*
const users = [
  { id: "11", name: "name 11", age: 11, profession: "profession 11" },
  { id: "1", name: "name 1", age: 1, profession: "profession 1" },
  { id: "111", name: "name 111", age: 111, profession: "profession 111" },
  { id: "1111", name: "name 1111", age: 1111, profession: "profession 1111" }
];
*/
//Dummy Hobby data
/*
const hobbies = [
  { id: "1", title: "Hobby 1", description: "hobby dews 1", userid: "11" },
  { id: "2", title: "Hobby 2", description: "hobby dews 2", userid: "11" },
  { id: "3", title: "Hobby 3", description: "hobby dews 3", userid: "111" },
  { id: "4", title: "Hobby 4", description: "hobby dews 4", userid: "11" }
]
*/
//Post dummy data
/*
const posts = [
  { id: "1", comment: "post comment 1", userid: "11" },
  { id: "2", comment: "post comment 2", userid: "11" },
  { id: "3", comment: "post comment 3", userid: "111" },
  { id: "4", comment: "post comment 4", userid: "11" },
];
*/
//Types
const UserType = new GraphQLObjectType({
  name: "User",
  description: "Documentation for user ...",
  fields: () => ({
    id: { type: GraphQLString },
    name: { type: GraphQLString },
    age: { type: GraphQLInt },
    profession: { type: GraphQLString },
    posts: {
      type: new GraphQLList(PostType),
      resolve(parent, args) {
        //return _.filter(posts, { userid: parent.id })
        return Post.find({userid:parent.id});
      }
    },
    hobbies: {
      type: new GraphQLList(HobbyType),
      resolve(parent, args) {
        //return _.filter(hobbies, { userid: parent.id })
        return Hobby.find({userid:parent.id});
      }
    }
  }),
});

//Hobby type
const HobbyType = new GraphQLObjectType({
  name: "Hobby",
  description: "Hobby type",
  fields: () => ({
    id: { type: GraphQLID },
    title: { type: GraphQLString },
    description: { type: GraphQLString },
    user: {
      type: UserType,
      resolve(parent, args) {
        //return _.find(users, { id: parent.userid })
        return User.findById(parent.userid);
      }
    }
  })
});
//Post type
const PostType = new GraphQLObjectType({
  name: "Post",
  description: "Post type",
  fields: () => ({
    id: { type: GraphQLID },
    comment: { type: GraphQLString },
    user: {
      type: UserType,
      resolve(parent, args) {
        //return _.find(users, { id: parent.userid })
        return User.findById(parent.userid);
      }
    }
  })
});

//Root query
const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  description: 'Root Query Type',
  fields: {
    user: {
      type: UserType,
      args: { id: { type: GraphQLString } },
      resolve(parent, args) {
        //return _.find(users, { id: args.id });
        return User.findById(args.id);
      }
    },
    users:{
      type:new GraphQLList(UserType),
      resolve(parent,args){
        //return users;
        return User.find({});
      }
    },
    hobby: {
      type: HobbyType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        //return _.find(hobbies, { id: args.id });
        return Hobby.findById(args.id);
      }
    },
    hobbies:{
      type:new GraphQLList(HobbyType),
      resolve(parent,args){
        //return hobbies;
        return Hobby.find({});
      }
    },
    post: {
      type: PostType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        //return _.find(posts, { id: args.id });
        return Post.findById(args.id);
      }
    },
    posts:{
      type:new GraphQLList(PostType),
      resolve(parent,args){
        //return posts;
        return Post.find({});
      }
    }
  }
});


/*Sample graphQL
{
  user(id:"1"){
  id
  name
  age
}
,
hobby(id:"1"){
  id
  title
  description
},
post(id:"1"){
  id
  comment
}
}
*/

//Mutations
const Mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    createUser: {
      type: UserType,
      args: {
        //id
        name: { type: new GraphQLNonNull( GraphQLString) },
        age: { type: new GraphQLNonNull(GraphQLInt) },
        profession: { type: GraphQLString }
      },
      resolve(parent, args) {
        let user = new User( {
          name: args.name,
          age: args.age,
          profession: args.profession
        });
        user.save();
        return user;
      }
    },
    updateUser:{
      type:UserType,
      args:{
        id:{type: new GraphQLNonNull(GraphQLID)},
        name: { type: new GraphQLNonNull( GraphQLString) },
        age: { type: GraphQLInt},
        profession: { type: GraphQLString }
      },
      resolve(parent,args){
        return User.findByIdAndUpdate(
          args.id,
          {
            $set:{
              name:args.name,
              age:args.age,
              profession:args.profession
            }
          },
          {
            new:false //
          }
        );
      }
    },
    removeUser:{
      type:UserType,
      args:{
        id:{type: new GraphQLNonNull(GraphQLID)}
      },
      resolve(parent,args){
        let removed=User.findByIdAndRemove(args.id).exec();
        if(!removed){
          throw new ("Not removed");
        }
        return removed;
      }
    },
    createHobby:{
      type:HobbyType,
      args:{
        //id
        title:{type:GraphQLString},
        description:{type:GraphQLString},
        userid:{type:GraphQLString}
      },
      resolve(parent,args){
        let hobby= new Hobby({
          title:args.title,
          description:args.description,
          userid:args.userid
        });
        hobby.save();
        return hobby;
      }
    },
    updateHobby:{
      type:HobbyType,
      args:{
        id:{type: new GraphQLNonNull( GraphQLID)},
        title:{type:GraphQLString},
        description:{type:GraphQLString},
        userid:{type:GraphQLString}
      },
      resolve(parent,args){
        return Hobby.findByIdAndUpdate(
          args.id,
          {
            $set:{
              title:args.title,
              description:args.description,
              userid:args.userid
            }
          },
          {
            new:true
          }
        )
      }

    },
    removeHobby:{
      type:HobbyType,
      args:{
        id:{type: new GraphQLNonNull(GraphQLID)}
      },
      resolve(parent,args){
        let removed=Hobby.findByIdAndRemove(args.id).exec();
        if(!removed){
          throw new ("Not removed");
        }
        return removed;
      }
    },
    createPost:{
      type:PostType,
      args:{
        //id
        comment:{type:GraphQLString},
        userid:{type:GraphQLID}
      },
      resolve(parent,args){
        let post=new Post({
          //id
          comment:args.comment,
          userid:args.userid
        });
        post.save();
        return post;
      }
    },
    updatePost:{
      type:PostType,
      args:{
        id:{type: new GraphQLNonNull( GraphQLID)},
        comment:{type:GraphQLString},
        userid:{type:GraphQLID}
      },
      resolve(parent,args){
        return Post.findByIdAndUpdate(
          args.id,
          {
            $set:{
              comment:args.comment,
              userid:args.userid
            }
          },
          {
            new:true
          }
        )
      }
    },
    removePost:{
      type:PostType,
      args:{
        id:{type: new GraphQLNonNull(GraphQLID)}
      },
      resolve(parent,args){
        let removed=Post.findByIdAndRemove(args.id).exec();
        if(!removed){
          throw new ("Not removed");
        }
        return removed;
      }
    }
  }
}
)
module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation
});