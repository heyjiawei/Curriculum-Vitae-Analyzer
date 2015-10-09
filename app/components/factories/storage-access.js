/**
 * Created by jchiam on 9/10/2015.
 */
'use strict';

angular.module('myApp.factories')

.factory('storageAccess', function() {
	var jobDescription = ""
	var parsedCVs = []

	/** ----- STORAGE WRITING ----- **/

	var setJobDescription = function(input) {
		jobDescription = input
	}

	// storing one by one or all at once?
	var storeParsedCV = function(parsedCV) {
		var cv = JSON.parse(parsedCV)
		parsedCVs.push({cv.name:cv})
		console.log(parsedCVs[name])
	}


	/** ----- STORAGE RETRIEVAL ----- */

	var getJobDescription = function() {
		return jobDecription
	}

	var getAllCV = function() {
		return parsedCVs
	}

	var getCV = function(name) {
		return parsedCVs[name]
	}

	return {
		setJobDescription: setJobDescription,
		storeParsedCV: storeParsedCV
		getJobDescription: getJobDescription
		getAllCV: getAllCV
		getCV: getCV
	}
});