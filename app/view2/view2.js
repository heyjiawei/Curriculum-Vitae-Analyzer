'use strict';

angular.module('myApp.view2', [])

.controller('View2Ctrl', function($scope, $q, $timeout) {
    $scope.selected = []; // selecting a row will bring us to the selected cv
    $scope.query = {
      order: 'name',
      limit: 5,
      page: 1
    };

    $scope.columns = [{
      name: 'Name / filename',
      orderBy: 'name'
    }, {
      name: 'Match',
      numeric: true,
      orderBy: 'match.value',
      descendFirst: true,
      unit: '%'
    }, {
      name: 'Education',
      numeric: true,
      orderBy: 'education.value',
      unit: '%'
    }, {
      name: 'Preferred Skills',
      numeric: true,
      orderBy: 'preferredSkills.value',
      unit: '%'
    }, {
      name: 'Essential Skills',
      numeric: true,
      orderBy: 'essentialSkills.value',
      unit: '%'
    }, {
      name: 'Location',
      numeric: true,
      orderBy: 'location.value',
      unit: '%'
    }, {
      name: 'Work Exp',
      numeric: true,
      orderBy: 'workExp.value',
      unit: '%'
    }, {
      name: 'Languages',
      numeric: true,
      orderBy: 'languages.value',
      unit: '%'
    }];

    $scope.cvMatch = cvMatch;

    $scope.onPaginationChange = function(page, limit) {

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

    $scope.onOrderChange = function(order) {

      console.log('Scope Order: ' + $scope.query.order);
      console.log('Order: ' + order);

      var deferred = $q.defer();

      $timeout(function () {
        deferred.resolve();
      }, 2000);

      return deferred.promise;
    };

  });