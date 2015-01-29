var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var morgan = require('morgan');
var mongoose = require('mongoose');
var adminRouter = express.Router();
var path 	   = require('path');
// var port = process.env.PORT || 1337;




var config = require('./config');



/// App config
// ----------------------------------------------------
// use body parser so we can grab info from POST request
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

// CORS stuff

// configure our app to handle CORS requests
app.use(function(req, res, next) {
res.setHeader('Access-Control-Allow-Origin', '*');
res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, \
Authorization');
next();
});

app.use(morgan('dev'))
// allows us to log all requests to the console 
// so we can see exactly what is going on.


/// mongo stuff
// ----------------------------------------------------

mongoose.connect(config.database);



/// middleware
// ----------------------------------------------------


// adminRouter.use(function(req,res,next){
// 	console.log(req.method,req.url);
// 	next();

// });

// adminRouter.param('name', function(req,res,next,name){
// 	console.log('doing name validation on ' + name);

// 	req.name = name;

// 	next();

// });


// app.get('/',function(req,res){
// 	res.send('HomePage')
// });




/// more routes


app.use(express.static(__dirname + '/public'));




/// routes

var apiRoutes = require('./app/routes/api')(app, express);
app.use('/api',apiRoutes)

app.get('*', function(req, res) {
		res.sendFile(path.join(__dirname + '/public/app/views/index.html'));
	});
// adminRouter.get('/',function(req,res){
// 	res.send('root');
// });

// adminRouter.get('/users',function(req,res){
// 	res.send('this is for users');
// });

// adminRouter.get('/users/:name',function(req,res){
// 	res.send('hello ' + req.params.name + '!');
// });

// // for params middleware
// adminRouter.get('/hello/:name',function(req,res){
// 	res.send('hello ' + req.name + '!');
// });

// adminRouter.get('/posts',function(req,res){
// 	res.send('this is for posts');
// });

// app.use('/admin', adminRouter);


/// server
app.listen(config.port);
console.log('listening on port '+ config.port);
