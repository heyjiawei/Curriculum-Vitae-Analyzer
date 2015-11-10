'use strict';

angular.module('cvia.factories')
.factory('jobDescriptionTokenizer', function() {
    var allHeadingKeywords = [].concat(responsibilityKeywords, minimumRequirementKeywords,
      preferredQualificationKeywords, locationKeywords);

    var tokenizeJobDesc = function(jobDesc) {
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

          if(keywords.some(hasKeyWord)) { // found the heading?
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
      // must match exactly to be a keyword, unlike for CVs
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