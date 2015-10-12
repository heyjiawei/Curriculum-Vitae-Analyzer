'use strict';

angular.module('myApp.factories')

.factory('cvTokenizer', function() {
    var tokenizeCv = function(allTextFromPdf) {
      // parse name
      // name is usually either big header, or has the word "name" near it

      // parse education
      var educationIdentifierKeywords = ["education", "educational", "qualification"];
      var educationToken = lookForHeading(educationIdentifierKeywords, allTextFromPdf);
      console.log(educationToken);
    };

    function lookForHeading(keywords, sourceText) {
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
    }

    function isHeading(text) {
      // determine how likely it is to be a heading
      // it's likely a heading, if
      // if it's all caps
      // it contains a ":" at the end
      // it's the only word in the line provided

      if(text === text.toUpperCase() || text.trim().slice(-1) == ":") {
        return true;
      } else if(isEmptyOrWhiteSpace(text) || hasDisallowedPunctuation(text) || hasTooManyWords(text)) {
        return false;
      }
      // FIXME: text === text.toUpperCase() is true for strings with only numbers
    }

    function hasTooManyWords(str) {
      return str.split(' ').length > 5;
    }

    function hasDisallowedPunctuation(str) {
      return str.match(/[,.!?;:]|\b[A-Za-z' &]+\b/);
    }

    function isEmptyOrWhiteSpace(str) {
      return str === null || str.match(/^\s*$/) !== null;
    }

    return {
      tokenizeCv: tokenizeCv
    };
});