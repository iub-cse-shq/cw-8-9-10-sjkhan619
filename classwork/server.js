var http = require('http')
var express = require('express')
const { response } = require('express')
var bodyParser = require('body-parser')
var app = express()
var server  = http.Server(app)
var Article = require('./article.model')
//DB Connection
var mongoose = require('mongoose')
mongoose.Promise = global.Promise
var dbURL = 'mongodb://localhost:27017/cw10' //change this if you are using Atlas
mongoose.connect(dbURL, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.connection.on('error', function (err) {
 console.log(err)
})


app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))

//Server routes from here
app.get('/', function(request, response){
    //console.log(request)
    response.sendFile(__dirname+'/index.html')
})

app.get('/second', function(request, response){
    //console.log(request)
    response.sendFile(__dirname+'/second.html')
})

app.get('/article/form', function(request, response){
    //console.log(request)
    response.sendFile(__dirname+'/form.html')
})

let articles = [{title: "Test1", content: "Testing"},
{title: "Test2", content: "Testing2"},
{title: "Test3", content: "Testing3"}]

app.post('/article/new', function(request, response){
    //console.log('form data api called')
    //console.log(request.body)
    /*if(request.body.title){
        articles.push(request.body)
        console.log(articles)
        response.json({msg: 'Article Submitted'})
    }
    else{
        response.status(400).json({error: 'Title is Missiong'})
    }*/
    var newArticle = new Article(request.body)
    newArticle.save(function (err, data) {
      if (err)
        return response.status(400).json({
          error: 'Title is missing'
        })
      return response.status(200).json({
        message: 'Article created successfully'
      })
    })   
})

/*app.get('/article/:id', function(request,response){
    console.log(request.params.id)
    response.render('article.ejs',{
        article: articles[request.params.id]
    })
})*/
app.get('/article/:id', function (request, response) {
    Article.findById(request.params.id, function (err, data) {
      response.render('article.ejs', {
        article: data
      })
    })
   })   

/*app.get('/articles/all', function(request,response){
    console.log(request.params.id)
    response.render('allArticles.ejs',{
        articles: articles
    })  
})*/

app.get('/articles/all', function (request, response) {
    Article.find({}, function (err, data) {
      response.render('allArticles.ejs', {
        articles: data
      })
    })
   })   

server.listen(process.env.PORT || 3000,
    process.env.IP || 'localhost', function(){
        console.log('Server Running');
    })

module.exports = {app, server, mongoose}