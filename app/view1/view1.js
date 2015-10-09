'use strict';

angular.module('myApp.view1', ['ngRoute', 'ngFileUpload'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/view1', {
    templateUrl: 'view1/view1.html',
    controller: 'View1Ctrl'
  });
}])

.controller('View1Ctrl', function($scope, fileReader) {
    $scope.page1content = "No file opened.";
    $scope.fileNames = "";

  $scope.$watch('file', function () {
    if ($scope.file != null) {
      $scope.files = [$scope.file];
    }
  });

  $scope.$on("fileProgress", function(e, progress) {
    $scope.progress = (progress.loaded / progress.total) * 100;
  });

  $scope.processFiles = function (files) {
    $scope.fileNames = "";
    if (files && files.length) {
      for (var i = 0; i < files.length; i++) {
        console.log(files[i]);
        $scope.fileNames += files[i].name + "\n";
        $scope.showProgressBar = true;
        fileReader.readAsDataUrl(files[i], $scope)
          .then(function(result) {
            console.log(result);
            getTextFromPdf(result);
          });
      }
    }
  };

  $scope.doProcess = function () {
    $scope.processFiles($scope.files);
  };

  function getTextFromPdf(result) {
    PDFJS.getDocument(result).then(function(pdf) {
      var numPages = pdf.pdfInfo.numPages;
      console.log(pdf);
      getTextFromPdfPage(1, pdf);
    });
  }

  function getTextFromPdfPage(pageNumber, pdf) {
    pdf.getPage(pageNumber).then(function(page) {
      page.getTextContent().then(function(textContent) {
        // TODO: Figure out how to chain promises properly, this is ugly as heck
        var strings = textContent.items.map(function (item) {
          return item.str;
        });
        console.log('## Text Content ##');

        $scope.$apply(function() {
          $scope.page1content = trimSpaces(strings.join(' '));
        });
        console.log($scope.page1content);
      })
    })
  }

  function trimSpaces(text){
    // http://www.mediacollege.com/internet/javascript/text/remove-extra-spaces.html
    text = text.replace(/(^\s*)|(\s*$)/gi,"");
    text = text.replace(/[ ]{2,}/gi," ");
    text = text.replace(/\n /,"\n");
    return text;
  }
});