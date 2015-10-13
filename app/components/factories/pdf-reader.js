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
        console.log("pages", numPages);
        for (var i = 1; i <= numPages; i++) {
          promises.push(getTextFromPdfPage(i, pdf).then(function(result) {
            return result;
          })); // push the Promises to our array
        }
        return $q.all(promises).then(function(allPromiseResults) {
          allPromiseResults.forEach(function(result) {
            Array.prototype.push.apply(allTextFromPdf, result);
          });
          return allTextFromPdf;
        });
      });
    };

    var getTextFromPdfPage = function(pageNumber, pdf) {
      return pdf.getPage(pageNumber).then(function(page) {
        return page.getTextContent().then(function(textContent) {
          var strings = textContent.items.map(function (item) {
            if (item.str == String.fromCharCode(160)) { // TODO: factor as global const
              // Non-breakable space is char 160. Fixes PDFs exported from Google Docs
              item.str = " ";
            }
            return item.str;
          });
          return strings;
        });
      });
    };

    return {
      getAllTextFromPdf: getAllTextFromPdf
    };
});