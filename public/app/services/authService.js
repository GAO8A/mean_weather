augular.module('authService',[])

// ===================================================
// auth factory to login and get information
// inject $http for communicating with the API
// inject $q to return promise objects
// inject AuthToken to manage tokens
// ===================================================
	.factory('Auth', function($http,$q,AuthToken){
		// create auth factory object
		var authFactory = {};

		//log in a user
		authFactory.login = function(username,password){
			// return promise object and its data

			return $http.post('/api/authenticate',{
				username: username,
				password: password
			})
				.success(function(data){
					AuthToken.setToken(data.token);
					return data;
				});
		};

		//log a user out by clearing the token
		authFactory.logout = function(){
			//clear the token
			AuthToken.setToken();
		};

		//checks if user is logged in
		// check if there is a local token

		authFactory.isLoggedIn = function(){
			if (AuthToken.getToken())
				return true;
			else
				return false;

		};

		//get the logged in user

		authFactory.getUser = function(){
			if(AuthToken.getToken())
				return $http.get('/api/me');
			else
				return $q.reject({message: 'User has no token'});
		};

		//returns the authfactory object
		return authFactory;

	})

// ===================================================
// factory for handling tokens
// inject $window to store token client-side
// ===================================================
	.factory('AuthToken',function($window){
		var authTokenFactory = {};

		//get token out of local storage.
		authTokenFactory.getToken = function(){
			return $window.localStorage.getItem('token');
		};

		// function to set token or clear token
		// if a token is passed set the token
		// if there is no token, clear it from localstorage.

		authTokenFactory.setToken = function(){
			if (token)
				$window.localStorage.setItem('token',token);
			else
				$window.localStorage.removeItem('token');

		};



		return authTokenFactory;


	})

// ===================================================
// application configuration to integrate token into requests 
// ===================================================
	.factory('AuthInterceptor', function($q, $location, AuthToken) {
		var interceptorFactory = {};
		// attach the token to every request
		// redirect if a token doesnt authenticate return interceptorFactory;

		// this will happen on all http requests
		interceptorFactory.request = function(config){

		// grabs the token
		var token = AuthToken.getToken();
		//if the token exists, add it to the header as x-access-token
		if(token)
			config.headers['x-access-token'] = token;

		return config;

	};

	//happens on response errors

	interceptorFactory.responseError = function(response){
		// if our server returns 403 forbidden response
		if (response.status == 403)
			//sends us to login page if response is 403
			$location.path('/login');
		// returns the error from server as a promise.
		return $q.reject(response);
	};

	return interceptorFactory;

	});
