var User = require('../models/users');
var jwt = require('jsonwebtoken');
var config = require('../../config');

var superSecret = config.secret;

module.exports = function(app, express) {

// get instance of router
// ----------------------------------------------------
var apiRouter = express.Router();


// route for authenticating users
// ----------------------------------------------------

apiRouter.post('/authenticate', function(req,res){
	// find user
	// select the name, username and password explicitly

	User.findOne({
		username: req.body.username
	}).select('name username password').exec(function(err, user){

		if (err) throw err;

		if(!user){
			res.json({success:false, message: 'auth failed, user not found'});
		} else if(user){
			var validPassword = user.comparePassword(req.body.password);
			if (!validPassword){
				res.json({success: false, message: 'auth failed, wrong password'});
			} else {
				var token = jwt.sign({
					name: user.name,
					username: user.username
				},	superSecret, {
					expiresInMinutes:1440 //expires in 24hrs
				});

				res.json({
					success: true,
					message: 'Enjoy your token',
					token: token
				});

			}
			}
		
	});

});



// middleware to use for all requests
apiRouter.use(function(req, res, next) {
	// do logging
		console.log('Somebody just came to our app!');

	// this is where we will authenticate users
	// route middleware to verify a token

	var token = req.body.token || req.param('token') || req.headers['x-access-token'];
	// check header or url parameters or post parameters for token

	if (token){

		jwt.verify(token, superSecret, function(err,decoded){
			if (err){
				return res.status(403).send({success: false, message: 'Failed to auth token'});
			} else {
				req.decoded = decoded;

				next();
			}
		});

	} else {
		
		// if there is no token
		// return an HTTP response of 403 (access forbidden) and an error message
return res.status(403).send({success: false, message: 'No token provided.'});


	}

		// next(); // make sure we go to the next routes and don't stop here

});

// test route to test if router is working
apiRouter.get('/',function(req,res){
	res.json({ message: 'yay welcome to our api!'});
});

 // create a user (accessed at POST http://localhost:8080/api/users)

apiRouter.route('/users')
		.post(function(req,res){

				var user = new User();

			// set the users information (comes from the request)
   				user.name = req.body.name;
    			user.username = req.body.username;
    			user.password = req.body.password;

    		// save the user and check for errors
    			user.save(function(err){
    				if(err){
    				//duplicate entry error catching
    					if (err.code == 11000)
							return res.json({ success: false, message: 'A user with that username already exists. '}); 
						else
							return res.send(err);
						

    			}
    	
    			res.json({ message: 'User created!' });

    	});

    }).get(function(req,res){
    	User.find(function(err,users){
    		if(err) res.send(err);

    		//return the users
    		res.json(users);

    	});

    });

// on routes that end in /users/:user_id
// ----------------------------------------------------
apiRouter.route('/users/:user_id')
// get the user with that id
// (accessed at GET http://localhost:1337/api/users/:user_id)
	.get(function(req, res) {
		User.findById(req.params.user_id, function(err, user) { 
			
			if (err) res.send(err);

			res.json(user);
		})
	})
	.put(function(req,res){
		User.findById(req.params.user_id, function(err,user){
			
			if (err) res.send(err);

			// update the users info only if its new
			if (req.body.name) user.name = req.body.name; // if the request body exists, update the object
			if (req.body.username) user.username = req.body.username; 
			if (req.body.password) user.password = req.body.password;

			user.save(function(err){
				if (err) res.send(err);
			
				// return a message
				res.json({ message: 'User updated!' });

			});



		});

	})
	.delete(function(req, res) {
                User.remove({
                  			_id: req.params.user_id
				}, function(err, user) {
							if (err) res.send(err);
                        	res.json({ message: 'Successfully deleted' });
					}); 
            });

	return apiRouter;

};