'use strict';

angular.module('myApp.view1', ['ngRoute', 'ngFileUpload'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/view1', {
    templateUrl: 'view1/view1.html',
    controller: 'View1Ctrl'
  });
}])

.controller('View1Ctrl', function($scope, fileReader, lemma) {
      var test = ["(Phd.) Neuroscience, Nanyang Technological University, Singapore Jan 2014- Nov 2014 \
        MSc Biomedical Engineering, Nanyang Technological University, Singapore Aug 2010- July 2012 \
        BE Biomedical Engineering, Anna University, India Aug 2006 - May 2010"];
      $scope.testString = lemma.lemma_string(test);
      console.log($scope.testString);
  $scope.$watch('file', function () {
    if ($scope.file != null) {
      $scope.files = [$scope.file];
    }
  });

  $scope.$on("fileProgress", function(e, progress) {
    $scope.progress = (progress.loaded / progress.total) * 100;
  });

  $scope.processFiles = function (files) {
    if (files && files.length) {
      for (var i = 0; i < files.length; i++) {
        console.log(files[i]);
        $scope.showProgressBar = true;
        fileReader.readAsDataUrl(files[i], $scope)
          .then(function(result) {
            console.log(result);
            PDFJS.getDocument(result).then(function(pdf) {
              console.log(pdf);
              pdf.getPage(1).then(function(page) { //FIXME: temporary hardcode pg1 for testing
                page.getTextContent().then(function(textContent) {
                  // TODO: Figure out how to chain promises properly, this is ugly as heck
                  var strings = textContent.items.map(function (item) {
                    return item.str;
                  });
                  console.log('## Text Content ##');
                  console.log(strings.join(' '));
                })
              })
            });
          });
      }
    }
  };

  $scope.doProcess = function () {
    $scope.processFiles($scope.files);
  };
});