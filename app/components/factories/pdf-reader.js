'use strict';

angular.module('myApp.factories')

.factory('pdfReader', function($q) {
    var getAllTextFromPdf = function(pdfDataUrl) {
      // http://stackoverflow.com/questions/12092633/pdf-js-rendering-a-pdf-file-using-a-base64-file-source-instead-of-url
      var BASE64_MARKER = ';base64,';
      function convertDataURIToBinary(dataURI) {
        var base64Index = dataURI.indexOf(BASE64_MARKER) + BASE64_MARKER.length;
        var base64 = dataURI.substring(base64Index);
        var raw = window.atob(base64);
        var rawLength = raw.length;
        var array = new Uint8Array(new ArrayBuffer(rawLength));

        for(var i = 0; i < rawLength; i++) {
          array[i] = raw.charCodeAt(i);
        }
        return array;
      }
      var pdfAsArray = convertDataURIToBinary(pdfDataUrl);

      return PDFJS.getDocument(pdfAsArray).then(function(pdf) {
        var allTextFromPdf = [];
        var numPages = pdf.pdfInfo.numPages;
        var promises = [];
        for (var i = 1; i <= numPages; i++) {
          promises.push(getTextFromPdfPage(i, pdf).then(function(textFromPdfPage) {
            return textFromPdfPage;
          })); // push the Promises to our array
        }
        return $q.all(promises).then(function(allPromiseResults) {
          allPromiseResults.forEach(function(textFromPdfPage) {
            Array.prototype.push.apply(allTextFromPdf, textFromPdfPage);
          });
          return allTextFromPdf;
        });
      });
    };

    var getTextFromPdfPage = function(pageNumber, pdf) {
      return pdf.getPage(pageNumber).then(function(page) {
        return page.getTextContent().then(function(textContent) {
          function isFirstCharLowerCase(str) {
            var firstChar = str.slice(0, 1);
            return (firstChar !== firstChar.toUpperCase() && firstChar === firstChar.toLowerCase());
          }

          function isNbsp(str) {
            // Non-breakable space is char 160. Fixes PDFs exported from Google Docs
            return str == String.fromCharCode(160);
          }

          function isPageNumber(str) {
            return str.match(/[pP]age\d/g);
          }

          function repairPdfTextFormatting(textContent) {
            var repairedTextContent = [];
            for(var i = 0; i < textContent.items.length; i++) {
              var currentElement = textContent.items[i].str;
              var nextElement = textContent.items[i+1] ? textContent.items[i+1].str : "";
              if (isNbsp(currentElement)) {
                currentElement = " ";
                repairedTextContent.push(currentElement);
              } else if (isFirstCharLowerCase(currentElement)) {
                // If it starts with lowercase letter, append it to the end of the previous line
                // Fixes things like ["Work experi", "e", "n", "ce"]
                repairedTextContent[repairedTextContent.length - 1] += currentElement;
              } else if (isPageNumber(currentElement + nextElement)) {
                // don't add "page" to the text content
                // increase index by 1 so that we don't add the number as well
                i++;
              } else {
                repairedTextContent.push(currentElement);
              }
            }
            return repairedTextContent;
          }
          return repairPdfTextFormatting(textContent);
        });
      });
    };

    return {
      getAllTextFromPdf: getAllTextFromPdf
    };
});