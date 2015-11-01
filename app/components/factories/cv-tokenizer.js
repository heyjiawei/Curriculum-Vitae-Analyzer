'use strict';

angular.module('myApp.factories')

.factory('cvTokenizer', function() {
    var summaryKeywords = ["summary", "introduction"];
    var skillKeywords = ["skills & expertise", "skill set", "skillset", "preferredSkills"];
    var experienceKeywords = ["experience", "employment", "work", "history"];
    var projectKeywords = ["projects"];
    var educationKeywords = ["education", "educational"];
    var languageKeywords = ["languages"];
    var interestKeywords = ["interests"];
    var refereeKeywords = ["referees", "references", "reference"];

    var allHeadingKeywords = [].concat(summaryKeywords, skillKeywords, experienceKeywords,
      projectKeywords, educationKeywords, languageKeywords, interestKeywords, refereeKeywords);

    var tokenizeCv = function(allTextFromPdf) {
      // parse name
      // name is usually either big header, or has the word "name" near it

      var summaryToken = findToken(summaryKeywords, allTextFromPdf);

      var skillToken = findToken(skillKeywords, allTextFromPdf);

      var experienceToken = findToken(experienceKeywords, allTextFromPdf);

      var projectToken = findToken(projectKeywords, allTextFromPdf);

      // parse education
      var educationToken = findToken(educationKeywords, allTextFromPdf);

      var languageToken = findToken(languageKeywords, allTextFromPdf);

      var interestToken = findToken(interestKeywords, allTextFromPdf);

      var refereeToken = findToken(refereeKeywords, allTextFromPdf);

      return {
        summary: summaryToken,
        skill: skillToken,
        experience: experienceToken,
        project: projectToken,
        education: educationToken,
        language: languageToken,
        interest: interestToken,
        referee: refereeToken
      };
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
      
      if(allHeadingKeywords.some(hasKeyWord)) {
        return true;
      }

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