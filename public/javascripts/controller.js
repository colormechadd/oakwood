var myApp = angular.module('app', []);

myApp.controller('TestCtrl', function ($scope, $http) {
    $http.get('/api').success(function(data) {
        $scope.vals = data;
    });
});