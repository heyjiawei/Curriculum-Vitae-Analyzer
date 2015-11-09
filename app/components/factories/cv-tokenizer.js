'use strict';

angular.module('myApp.factories')

.factory('cvTokenizer', function() {
    var summaryKeywords = ["summary", "introduction"];
    var skillKeywords = ["skills & expertise", "skill set", "skillset", "preferredSkills", "skills"];
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
      var nameToken = allTextFromPdf[0]; //naive, works for linkedin.

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
        name: nameToken,
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
      var potentialHeadingsIndexes = [];
      var token = [];
      for (var i = 0; i < sourceText.length; i++) {
        // look through entire text
        // save every time you see a potential header
        // decide on the best header using isHeading

        var hasKeyWord = function (keyWord) {
          return sourceText[i].toLowerCase().indexOf(keyWord) >= 0;
        };

        if(keywords.some(hasKeyWord)) {
          potentialHeadingsIndexes.push(i);
          console.log("findtoken:", sourceText[i], potentialHeadingsIndexes);
        }
      }

      var headingIndex = guessHeadingIndex(potentialHeadingsIndexes, sourceText, keywords);
      console.log("headingindex", headingIndex);

      if(headingIndex < 0){return token;}

      for(var j = headingIndex+1; j < sourceText.length; j++) {
        var line = sourceText[j];
        console.log("finding next heading", line, j);
        console.log("is heading?", line, isHeading(line, allHeadingKeywords));
//        if(!isHeading(line)) {
        if(isHeading(line, allHeadingKeywords) < 0.5) {
          token.push(sourceText[j]);
        } else { // found next heading, end of this token
          return token;
        }
      }
      return token;
    }

    function guessHeadingIndex(potentialHeadingsIndexes, sourceText, keywords) {
      var headingScores = [];
      potentialHeadingsIndexes.forEach(function(potentialHeadingIndex) {
        var potentialHeading = sourceText[potentialHeadingIndex];
        var score = isHeading(potentialHeading, keywords);
        headingScores.push({potentialHeadingIndex: potentialHeadingIndex, score: score});
      });

      var highestScore = {potentialHeadingIndex: Number.NEGATIVE_INFINITY, score: 0};
      headingScores.forEach(function(headingScore) {
        console.log("headingscore: ", headingScore);
        if(headingScore.score > highestScore.score) {
          highestScore.potentialHeadingIndex = headingScore.potentialHeadingIndex;
          highestScore.score = headingScore.score;
        }
      });
      return highestScore.potentialHeadingIndex;
    }

    function isHeading(potentialHeading, keywords) {
      // determine how likely it is to be a heading
      // it's likely a heading, if
      // it matches the heading keywords defined above
      // if it's all caps
      // it contains a ":" at the end
      // it's the only word in the line provided (?)

      var score = 0;

      var hasKeyWord = function (keyWord) {
        var matchExactWordRegex = new RegExp("(?:^|\\s)" + keyWord.toLowerCase() + "(?=\\s|$)", "g");
        return potentialHeading.toLowerCase().match(matchExactWordRegex);
      };

      if(keywords.some(hasKeyWord)) {
        score += 0.9;
      }

      if(isUpperCase(potentialHeading)) {
        score += 0.4;
      }

      if(potentialHeading.trim().slice(-1) == ":") {
        score += 0.4;
      }

      if(isEmptyOrWhiteSpace(potentialHeading) || hasTooManyWords(potentialHeading)) {
        score -= 1;
      }
//      console.log("isheading", potentialHeading, score);
      return score;
    }

    function isUpperCase(str) {
      return (str === str.toUpperCase() && str !== str.toLowerCase());
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