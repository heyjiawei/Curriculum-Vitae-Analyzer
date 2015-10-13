'use strict';

angular.module('myApp.factories')

.factory('jobDescTokenizer', function() {
    // education “bachelor”, min req, skill
    // (preferred qualifications. responsibilities comes under skills),
    // location, work experience (time), languages

    var responsibilityKeywords = ["responsibilities", "job scope"];
    var minimumRequirementKeywords = ["minimum requirements"];
    var preferredQualificationsKeywords = ["preferred qualifications"];
    var locationKeywords = ["location"];

    var tokenizeJobDesc = function(jobDesc) {

    };

    return {
      tokenizeJobDesc: tokenizeJobDesc
    };
});