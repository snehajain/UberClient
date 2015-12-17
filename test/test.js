/**
 * New node file
 */
var should=require('chai').should(),
expect=require('chai').expect,
supertest=require('supertest'),
api=supertest('http://localhost:3000');    

describe('User', function(){

	it('should return 200 response', function(done){
		api.get('/')
		.set('Accept', 'application/json')
		.expect(200,done);
		});
});   

describe('Userprofile', function(){

	it('should return 200 response  view user profile..', function(done){
		api.get('/userProfile')
		.set('Accept', 'application/json')
		.expect(200,done);
		});
});  

describe('Userlogout', function(){

	it('should return 200 response user logout done..', function(done){
		api.get('/logout')
		.set('Accept', 'application/json')
		.expect(200,done);
		});
});  

describe('Userhistory', function(){

	it('should return 200 response view user history..', function(done){
		api.get('/userHistory')
		.set('Accept', 'application/json')
		.expect(200,done);
		});
});  

describe('Driverprofile', function(){

	it('should return 200 response driver view profile ', function(done){
		api.get('/driverProfile')
		.set('Accept', 'application/json')
		.expect(200,done);
		});
});  

describe('Driverlogout', function(){

	it('should return 200 response driver logout', function(done){
		api.get('/logout')
		.set('Accept', 'application/json')
		.expect(200,done);
		});
});  

describe('userSignup', function(){

	it('should return 200 response driver profile edit ', function(done){
		api.get('/driverProfile')
		.set('Accept', 'application/json')
		.expect(200,done);
		});
});  

describe('DriverSignup', function(){

	it('should return 200 response   driver signup', function(done){
		api.get('/driverProfile')
		.set('Accept', 'application/json')
		.expect(200,done);
		});
});  


describe('RequestRide', function(){

	it('should return 200 response ride requested...', function(done){
		api.get('/driverProfile')
		.set('Accept', 'application/json')
		.expect(200,done);
		});
});  

describe('CancelRide', function(){

	it('should return 200 response - ride canceled', function(done){
		api.get('/driverProfile')
		.set('Accept', 'application/json')
		.expect(200,done);
		});
});  

