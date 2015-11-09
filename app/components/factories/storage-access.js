/**
 * Created by jchiam on 9/10/2015.
 */
'use strict';

angular.module('myApp.factories')

.factory('storageAccess', function() {
	var jobDescription = "";
	var parsedCVs = [];
	var rawEvaluationResults = [];
	var evaluationResults = [];

	/** ----- STORAGE WRITING ----- **/

	var setJobDescription = function(input) {
		jobDescription = input;
	};

	var storeParsedCV = function(parsedCV) {
		//var cv = JSON.parse(parsedCV);
		parsedCVs.push(parsedCV);
	};

	var storeRawEvaluationResults = function(results) {
		rawEvaluationResults = results;
	};

	var storeResults = function(results) {
		evaluationResults = results;
	};


	/** ----- STORAGE RETRIEVAL ----- */

	var getJobDescription = function() {
		return jobDescription;
	};

	var getAllCV = function() {
		return parsedCVs;
	};

	var getCV = function(name) {
		return parsedCVs[name];
	};

	var getAllRawEvaluationResults = function() {
		return rawEvaluationResults;
	};

	var getAllResults = function() {
		return evaluationResults;
	};

	return {
		setJobDescription: setJobDescription,
		storeParsedCV: storeParsedCV,
		storeRawEvaluationResults: storeRawEvaluationResults,
		storeResults: storeResults,
		getJobDescription: getJobDescription,
		getAllCV: getAllCV,
		getCV: getCV,
		getAllRawEvaluationResults: getAllRawEvaluationResults,
		getAllResults: getAllResults
	};
});