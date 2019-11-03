///////////////////////
//Initializing Environment Variables
//npm i dotenv
///////////////////////
require('dotenv').config();

////////////////////////
//Connecting the DB
//npm i mongoose
////////////////////////
// const mongoose = require('mongoose');
// const db = mongoose.connection;
// const host = process.env.host;
// const dbupdate = {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//     useFindAndModify: false};
// mongoose.connect(host, dbupdate);

// db.on('error', (err) => console.log('Error, DB Not connected'));
// db.on('connected', () => console.log ('connected to mongo'));
// db.on('diconnected', () => console.log ('Mongo is disconnected'));
// db.on('open', () =>console.log ('Connection Made!'));

////////////////////////////
//Model Schema
///////////////////////////
// const Blog = require('./model/blog.js');


///////////////////////
//Create Our Server Object
//npm i koa
///////////////////////
const koa = require('koa');
const server = new koa();

//////////////////////////
//Create Our Static Folder
//npm i koa-static
//////////////////////////
const static = require('koa-static');

//////////////////////////
//Creating Our Router
//npm i koa-router
//////////////////////////
const Router = require('koa-router');
const route = new Router();

/////////////////////////////////
//initializing views
//npm i koa-views
//npm i nunjucks
////////////////////////////////;
const views = require('koa-views');
const nunj = require('nunjucks');
nunj.configure('./views', {autoescape: true});

///////////////////////////
//routes
// route.get - route.post - route.patch - post.put - route.delete
///////////////////////////
// route.get('/', (ctx, next) => {
//     Blog.find({},(error, results) => {
//     console.log(results);
//     ctx.render('./index.html',{
//         posts: results
//     })})
// });

route.get('/', (ctx, next) => {
    console.log('connected to root route');
    ctx.render('index');
});

////////////////////////////
//Async Functions
////////////////////////////
// const getPosts = async (query) => { 
//     const data = await Blog.find({query}) 
//     return data; 
//   }; 

////////////////////////
//Middleware
/////////////////////////
server.use(views('./views', {map: {njk: 'nunjucks'}}));
server.use(route.routes());
server.use(static('./public'));




/////////////////////
//Our Listener on Port 1985
/////////////////////
server.listen(1985,'localhost',() => console.log('Listening on port 1985'));