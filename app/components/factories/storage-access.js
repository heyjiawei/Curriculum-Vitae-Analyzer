/**
 * Created by jchiam on 9/10/2015.
 */
'use strict';

angular.module('cvia.factories')

    .factory('storageAccess', function () {
        var jobDescription = "";
        var parsedCVs = [];
        var rawEvaluationResults = [];

        /** ----- STORAGE WRITING ----- **/

        var setJobDescription = function (input) {
            jobDescription = input;
        };

        var storeParsedCV = function (parsedCV) {
            //var cv = JSON.parse(parsedCV);
            parsedCVs.push(parsedCV);
        };

        var storeRawEvaluationResults = function (results) {
            rawEvaluationResults = results;
        };


        /** ----- STORAGE RETRIEVAL ----- */

        var getJobDescription = function () {
            return jobDescription;
        };

        var getAllCV = function () {
            return parsedCVs;
        };

        var getCV = function (name) {
            for (var i = 0; i < parsedCVs.length; i++) {
                if (parsedCVs[i].name === name) {
                    return parsedCVs[i];
                }
            }
            return false;
        };

        var getAllRawEvaluationResults = function () {
            return rawEvaluationResults;
        };

        /** ----- STORAGE RESET ----- */
        var resetJobDescription = function () {
            jobDescription = "";
        };

        var resetAllCVs = function () {
           parsedCVs = [];
        };

        var resetRawResults = function () {
            rawEvaluationResults = [];
        };


        return {
            setJobDescription: setJobDescription,
            storeParsedCV: storeParsedCV,
            storeRawEvaluationResults: storeRawEvaluationResults,
            getJobDescription: getJobDescription,
            getAllCV: getAllCV,
            getCV: getCV,
            getAllRawEvaluationResults: getAllRawEvaluationResults,
            resetJobDescription: resetJobDescription,
            resetAllCVs: resetAllCVs,
            resetRawResults: resetRawResults,
        };
    });