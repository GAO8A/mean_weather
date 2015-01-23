var express = require('express');
var app = express();
var adminRouter = express.Router();

adminRouter.get('/',function(req,res){
	res.send('root');
});

adminRouter.get('/users',function(req,res){
	res.send('this is for users');
});


adminRouter.get('/posts',function(req,res){
	res.send('this is for posts');
});

app.use('/admin', adminRouter);
//server
app.listen(1337);
console.log('listening on port 1337');
