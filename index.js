///////////////////////
//Initializing Environment Variables and other middleware
//npm i dotenv
//npm i koa-methodoverride
//npm i koa-bodyparser
///////////////////////
require('dotenv').config();
const override = require('koa-methodoverride');
const parser = require('koa-bodyparser');


////////////////////////
//Connecting the DB
//npm i mongoose
////////////////////////
const mongoose = require('mongoose');
const db = mongoose.connection;
const host = `mongodb+srv://${process.env.host}:${process.env.host}@sei-fprzs.mongodb.net/gaprojects?retryWrites=true&w=majority`;
const dbupdate = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false};
mongoose.connect(host, dbupdate);

db.on('error', (err) => console.log('Error, DB Not connected'));
db.on('connected', () => console.log ('connected to mongo'));
db.on('diconnected', () => console.log ('Mongo is disconnected'));
db.on('open', () =>console.log ('Connection Made!'));

////////////////////////////
//Model Schema
///////////////////////////
const Blog = require('./model/blog.js');


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
//npm i koa-nunjucks-2
////////////////////////////////;
// const views = require('koa-views');
// const nunj = require('nunjucks');
// nunj.configure('./views', {autoescape: true});
const koaNunjucks = require('koa-nunjucks-2');


///////////////////////////
//routes
// route.get - route.post - route.patch - post.put - route.delete
///////////////////////////

//root route
route.get('/', (ctx, next) => {
    console.log('connected to root route');
    console.log(ctx);
    return Blog.find({}, (error, results) => {
        console.log(results)
        ctx.render('index', {
            posts: results
        });
        console.log('the view was rendered')
    });
});

//show route
route.get('/view/:id', (ctx, next) => {
    console.log('connected to show route');
    return Blog.findById(ctx.params.id, (error, results) => {
        console.log(results)
        ctx.render('show', {
            post: results
        });
        console.log('the view was rendered')
    });
});

//admin route
route.get('/admin', (ctx, next) => {
    console.log('connected to admin route');
    return Blog.find({}, (error, results) => {
        console.log(results)
        ctx.render('admin', {
            posts: results
        });
    });
});

//delete route
route.delete('/delete/:id', (ctx, next) => {
    console.log('connected to delete route');
    console.log(ctx.request.body)
    if (ctx.request.body.pw === process.env.pw){
        Blog.findByIdAndRemove(ctx.params.id, (err, result) => {
         
       })
    }else{
        console.log('wrong password')
        
    }
    return ctx.render('complete');
});

//edit route
route.get('/edit/:id', (ctx, next) => {
    console.log('connected to edit route');
    return Blog.findById(ctx.params.id, (err, results) => {
        console.log(results);
        ctx.render('edit', {
        post: results
        });
    });
});

route.put('/edit/:id', (ctx, next) => {
    console.log('editing a post');
    console.log(ctx.request.body)
    if (ctx.request.body.pw === process.env.pw){
        Blog.findByIdAndUpdate(ctx.params.id, ctx.request.body, {new:true}, (err, result) => {
         console.log(result); 
        })
     }else{
         console.log('wrong password');
        }
    return ctx.render('complete');
});



//create route
route.get('/create', (ctx, next) => {
    console.log('connected to create route');
    return ctx.render('create');
});

route.post('/create', (ctx, next) => {
    console.log('creating a post');
    console.log(ctx.request.body)
    if (ctx.request.body.pw === process.env.pw){
        Blog.create(ctx.request.body, (err, result) => {
         console.log(result); 
        })
     }else{
         console.log('wrong password');
        ;
     }
     return ctx.render('complete');
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
server.use(override('_method'))
server.use(parser());
// server.use(views('./views', {map: {html: 'nunjucks'}}));
server.use(koaNunjucks({
    ext: 'njk',
    path: './views',
    nunjucksConfig: {
      trimBlocks: true
    }
  }));
server.use(route.routes());
server.use(static('./public'));




/////////////////////
//Our Listener on Port 1985
/////////////////////
server.listen(process.env.PORT || 5000);