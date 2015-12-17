/**
 * Module dependencies.
 */

var express = require('express'), 
	routes = require('./routes'), 
	user = require('./routes/user'), 
	bill = require('./routes/bill'), 
	signup = require('./routes/signup'), 
	expressSession = require("express-session"), 
	http = require('http'), 
	profile = require('./routes/profile'), 
	path = require('path');
var driver = require('./routes/driver');
var mongo = require("./routes/mongodb");
var ride = require("./routes/ride");

// URL for the sessions collections in mongoDB
var mongoSessionConnectURL = "mongodb://localhost:27017/ubersession";
var session = require("express-session");
var MongoStore = require("connect-mongo")(session);

var app = express();

app.configure(function()
{
	app.set('port', process.env.PORT || 3005);
	app.set('views', __dirname + '/views');
	app.set('view engine', 'ejs');
	app.use(express.favicon());
	app.use(express.logger('dev'));
	app.use(express.bodyParser());
	app.use(express.methodOverride());
});

app.use(session({
	secret : 'cmpe273_uber',
	resave : false, // don't save session if unmodified
	saveUninitialized : false, // don't create session until something stored
	duration : 30 * 60 * 1000,
	activeDuration : 5 * 60 * 1000,
	store : new MongoStore({
		url : mongoSessionConnectURL
	})
}));

app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

app.configure('development', function()
{
	app.use(express.errorHandler());
});

// function to check if user session is present before accessing any api
function restrictUser(req, res, next) {
	  if (req.session.userId) {
		  if(req.session.isUser) {
			  next();  
		  } else {
			  res.render('driverProfile', { title: 'Please login to use the application' });
		  }	    
	  } else {
		  res.render('index', { title: 'Please login to use the application' });
	  }
}

function restrict(req, res, next) {
	  if (req.session.userId) {
		  if(!req.session.isUser) {
			  next();  
		  } else {
			  res.render('userHomepage', { title: 'Please login to use the application' });
		  }	    
	  } else {
		  res.render('index', { title: 'Please login to use the application' });
	  }
}

function commonRestrict(req, res, next) {
	  if (req.session.userId) {
		  next();   
	  } else {
		  res.render('index', { title: 'Please login to use the application' });
	  }
}

function restrictAdmin(req, res, next){
	if (req.session.isAdmin) {
		  next();   
	  } else {
		  res.render('index', { title: 'Please login to use the application' });
	  }
}

app.get('/', routes.index);
app.get('/users', user.list);

app.post('/driverSignUp', signup.driverSignUp);
app.post('/driverLogin', signup.driverLogin);
app.post('/userSignUp', signup.userSignUp);
app.post('/userLogin', signup.userLogin);
app.post('/updateUserProfile', restrictUser, profile.updateUserProfile);
app.post('/updateDriverProfile', restrict, profile.updateDriverProfile);
app.post('/startRide', restrict, driver.startRide);
app.post('/endRide', restrict, driver.endRide);
app.post('/generateBill', restrict, bill.generateBill);
app.post('/rateDriver', user.rateDriver);
app.post('/rateUser', driver.rateUser);
app.post('/adminLogin', signup.adminLogin);

app.put('/cancelRide',restrictUser, ride.cancelRide);
app.put('/changeDestination',restrictUser, ride.changeDestination);

app.get('/checkRideStatus',restrictUser, ride.checkRideStatus);
app.get('/viewUserBill', restrictUser, bill.viewUserBill);
app.get('/userHistory', restrictUser, signup.showUserHistory);
app.get('/driverHistory', restrict, signup.showDriverHistory);
app.get('/getUserBillList', commonRestrict, bill.userBillList);
app.get('/getUserProfile', restrictUser, profile.getUserProfile);
app.get('/getDriverProfile', restrict, profile.getDriverProfile);
app.post('/selectDriver', restrictUser, user.selectDriver);
app.get('/rideRequested', restrictUser, ride.getRideRequestedPage);
app.get('/userHomepage', restrictUser, routes.index);
app.get('/driverHomepage', restrict, signup.getDriverHomepage);
app.get('/userProfile', restrictUser, user.getProfile);
app.get('/driverProfile', restrict, signup.showDriverProfile);
app.get('/getNearbyDrivers', restrictUser, driver.getNearbyDrivers);
app.get('/getDriverStatus', restrict, driver.getDriverStatus);
app.get('/adminHomepage', restrictAdmin, signup.getAdminHomepage);
// app.get('/getProfiles', restrictAdmin, function(req,res){
// 	res.render('admingetProfile');
// });
app.get('/adminViewBill', restrictAdmin, function(req,res){
	res.render('adminViewBill');
});

app.post('/deleteDriver', restrict, driver.deleteDriver);
app.post('/deleteUser', restrictUser, user.deleteUser);

app.get('/logout', function(req, res)
{
	req.session.destroy();
	res.render('index', {
		title : 'Thanks for stopping by'
	});
});
app.get('/getPromotion', function(req,res){
	res.render('freerides');
});
app.get('/getHelp', function(req,res){
	res.render('uberhelp');
});

//admin apis
app.post('/getRidesByDate', ride.getRidesByDate);//

//app.get('/viewBill', bill.viewBill);
app.get('/driverChart', ride.driverChart);//
app.get('/userChart', ride.userChart);//
app.get('/areaChart', ride.areaChart);//
app.post('/getRevenue', ride.getRevenue);//
app.post('/getProfiles', ride.getProfiles);//
app.post('/adminViewBill', bill.adminViewBill);
app.get('/getProfiles', function(req, res){
	
	 res.render('getProfiles');
});
app.get('/adminViewBill', function(req, res){
	
	 res.render('adminViewBill');
});
app.get('/adminHomepage', function(req, res){
	
	 res.render('adminHomepage');
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
	console.log(res.toString());
	console.log(req.toString());
	var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

if (app.get('env') === 'development') {
	  app.use(function(err, req, res, next) {
	    //res.status(err.status || 500);
	    res.render('error', {
	      message: err.message,
	      error: err
	    });
	  });
	}

	// production error handler
	// no stacktraces leaked to user
	app.use(function(err, req, res, next) {
	  res.status(err.status || 500);
	  res.render('error', {
	    message: err.message,
	    error: {}
	  });
	});


mongo.connect(mongoSessionConnectURL, function()
{
	console.log('Connected to mongo at: ' + mongoSessionConnectURL);
	http.createServer(app).listen(app.get('port'), function()
	{
		console.log('Express server listening on port ' + app.get('port'));
	});
});
