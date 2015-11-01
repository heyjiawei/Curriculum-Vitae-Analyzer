'use strict';

angular.module('myApp.view2', ['md.data.table'])

.controller('View2Ctrl', function($scope) {
    $scope.selected = [];
    $scope.query = {
      filter: '',
      order: 'name',
      limit: 5,
      page: 1
    };

    $scope.cvList = cvList;

    $scope.onpagechange = function(page, limit) {

      console.log('Scope Page: ' + $scope.query.page + ' Scope Limit: ' + $scope.query.limit);
      console.log('Page: ' + page + ' Limit: ' + limit);

      var deferred = $q.defer();

      $timeout(function () {
        deferred.resolve();
      }, 2000);

      return deferred.promise;
    };

    $scope.loadStuff = function () {
      var deferred = $q.defer();

      $timeout(function () {
        deferred.reject();
      }, 2000);

      $scope.deferred = deferred.promise;
    };

    $scope.onorderchange = function(order) {

      console.log('Scope Order: ' + $scope.query.order);
      console.log('Order: ' + order);

      var deferred = $q.defer();

      $timeout(function () {
        deferred.resolve();
      }, 2000);

      return deferred.promise;
    };

  });