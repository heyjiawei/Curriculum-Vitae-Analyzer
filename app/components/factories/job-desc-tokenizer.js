'use strict';

angular.module('myApp.factories')
  // TODO: REFACTOR INTO A GENERIC TOKENIZER CLASS, USED BY BOTH CV AND JOB DESC
.factory('jobDescTokenizer', function() {
    // education “bachelor”, min req, skill
    // (preferred qualifications. responsibilities comes under preferredSkills),
    // location, work experience (time), languages

    var responsibilityKeywords = ["responsibilities", "job scope"];
    var minimumRequirementKeywords = ["minimum requirements"];
    var preferredQualificationKeywords = ["preferred qualifications"];
    var locationKeywords = ["location"];

    var allHeadingKeywords = [].concat(responsibilityKeywords, minimumRequirementKeywords,
      preferredQualificationKeywords, locationKeywords);

    var tokenizeJobDesc = function(jobDesc) {
      // Split into lines
      var jobDescLines = jobDesc.split("\n");

      var responsibilityToken = findToken(responsibilityKeywords, jobDescLines);
      var minimumRequirementToken = findToken(minimumRequirementKeywords, jobDescLines);
      var preferredQualificationToken = findToken(preferredQualificationKeywords, jobDescLines);
      var locationToken = findToken(locationKeywords, jobDescLines);

      return {
        responsibility: responsibilityToken,
        minimumRequirement: minimumRequirementToken,
        preferredQualification: preferredQualificationToken,
        location: locationToken
      }
    };

    function findToken(keywords, sourceText) {
      var results = [];
      var isHeaderFound = false;

      for (var i = 0; i < sourceText.length; i++) {
        var line = sourceText[i];
        if (!isHeaderFound) {
          var hasKeyWord = function (keyWord) {
            return line.toLowerCase().indexOf(keyWord) >= 0;
          };

//          if(isHeading(line) && keywords.some(hasKeyWord)) {
          if(keywords.some(hasKeyWord)) { // found the heading?
            results.push(line);
            isHeaderFound = true;
          }
        } else { // look for next heading, return
          if(!isHeading(line)) {
            results.push(line);
          } else {
            return results;
          }
        }
      }
      return results;
    }

    function isHeading(text) {
      // determine how likely it is to be a heading
      // it's likely a heading, if
      // it matches the heading keywords defined above
      // if it's all caps
      // it contains a ":" at the end
      // it's the only word in the line provided (?)

      var hasKeyWord = function (keyWord) {
        var matchExactWordRegex = new RegExp("(?:^|\\s)" + keyWord.toLowerCase() + "(?=\\s|$)", "g");
        return text.toLowerCase().match(matchExactWordRegex);
      };

      return allHeadingKeywords.some(hasKeyWord);
    }

    return {
      tokenizeJobDesc: tokenizeJobDesc
    };
});