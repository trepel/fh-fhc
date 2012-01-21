var assert 		= require('assert'),
	fhc 		= require("../lib/fhc.js"),
	alias 		= require('../lib/alias.js'),
	conf 		= require("../lib/fhcfg.js"),
	apps		= require("../lib/apps.js"),
    request 	= require('../lib/utils/request.js'),
	mockrequest	= require("../lib/utils/mockrequest.js");


//test the appid

var testAppId = "c0TPJtvFbztuS2p7NhZN3oZz", theAlias = "analias";



module.exports =  {
	

	

	"test alias" : function () {
		fhc.load(function (er){

			request.requestFunc = mockrequest.mockRequest;

			alias([theAlias+"="+testAppId],function(er,data){
				assert.equal(er,undefined);
				assert.equal(data,"ok");
				console.log(fhc.appId(theAlias));
				assert.equal(testAppId,fhc.appId(theAlias));
				
			});

			

			//test 24 character alias arn't accepted
			alias(["Hw1ahBfiT2KEBVq9bxz4Qc8Q="+testAppId], function(err,data){
				
				assert.isDefined(err);
				assert.isUndefined(data);
			});


		});
	},



	"test reserved words" : function () {
		fhc.load(function (er){

			request.requestFunc = mockrequest.mockRequest;
			alias(["feedhenry="+testAppId],function (err, data) {
				assert.isDefined(err);
				assert.isUndefined(data);
			});
			var reserved =  ["feedhenry","_password","cookie","username"];
			for(i = 0; i < reserved.length; i++){
				alias([reserved[i]+"="+testAppId],function (err, data) {
					assert.isDefined(err);
					assert.isUndefined(data);
				});
			}
		});
	},

	"test only works when logged in" : function () {
			fhc.load(function (er){
				alias([theAlias+"="+"Hw1ahBfiT2KEBVq9bxz4Qc8Q"], function (err,data){
					assert.isDefined(err);
					assert.isUndefined(data);
				});
			});
	},

	"test fh appid" : function () {
		
		assert.equal(fhc.appId(undefined),undefined);
		//shouldn't change valid appid
		assert.equal(fhc.appId("Hw1ahBfiT2KEBVq9bxz8Qc8H"),"Hw1ahBfiT2KEBVq9bxz8Qc8H");
		
		
	}
};