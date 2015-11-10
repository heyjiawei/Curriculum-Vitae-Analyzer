'use strict';

angular.module('cvia.factories')

.factory('cvTokenizer', function() {
    var summaryKeywords = ["summary", "introduction"];
    var skillKeywords = ["skills & expertise", "skill set", "skillset", "preferredSkills", "skills"];
    var experienceKeywords = ["experience", "employment", "work", "history"];
    var projectKeywords = ["projects"];
    var educationKeywords = ["education", "educational"];
    var languageKeywords = ["languages"];
    var interestKeywords = ["interests"];
    var refereeKeywords = ["referees", "references", "reference"];
    var publicationKeywords = ["publications"];

    var allHeadingKeywords = [].concat(summaryKeywords, skillKeywords, experienceKeywords,
      projectKeywords, educationKeywords, languageKeywords, interestKeywords, refereeKeywords,
      publicationKeywords);

    var tokenizeCv = function(allTextFromPdf) {
      var nameToken = findName(allTextFromPdf);

      var summaryToken = findToken(summaryKeywords, allTextFromPdf);

      var skillToken = findToken(skillKeywords, allTextFromPdf);

      var experienceToken = findToken(experienceKeywords, allTextFromPdf);

      var projectToken = findToken(projectKeywords, allTextFromPdf);

      var educationToken = findToken(educationKeywords, allTextFromPdf);

      var languageToken = findToken(languageKeywords, allTextFromPdf);

      var interestToken = findToken(interestKeywords, allTextFromPdf);

      var refereeToken = findToken(refereeKeywords, allTextFromPdf);

      var publicationToken = findToken(publicationKeywords, allTextFromPdf);

      return {
        name: nameToken,
        summary: summaryToken,
        skill: skillToken,
        experience: experienceToken,
        project: projectToken,
        education: educationToken,
        language: languageToken,
        interest: interestToken,
        referee: refereeToken,
        publication: publicationToken
      };
    };

    function findName(sourceText) {
      // find "name:" and get the text after it. if it doesn't exist,
      // assume the first words are the name.
      var firstWordsOfText = "";
      var nameHeadingText = "";
      for (var i = 0; i < sourceText.length; i++) {
        if (!isEmptyOrWhiteSpace(sourceText[i]) && firstWordsOfText === "") {
          firstWordsOfText = sourceText[i];
        }
        if (sourceText[i].toLowerCase().trim() === "name:") {
          nameHeadingText = findNextNonEmptyElement(i, sourceText);
        }
      }
      return nameHeadingText === "" ? firstWordsOfText : nameHeadingText;
    }

    function findNextNonEmptyElement(index, sourceText) {
      for (var i = index + 1; i < sourceText.length; i++) {
        if (!isEmptyOrWhiteSpace(sourceText[i])) {
          return sourceText[i];
        }
      }
    }

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
        }
      }

      var headingIndex = guessHeadingIndex(potentialHeadingsIndexes, sourceText, keywords);

      if(headingIndex < 0){
        return token;
      }

      for(var j = headingIndex+1; j < sourceText.length; j++) {
        var line = sourceText[j];
        if(isHeading(line, allHeadingKeywords) < 0.5) { //TODO: factor out magic number
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