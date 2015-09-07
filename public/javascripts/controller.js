var oakwoodApp = angular.module('oakwood', []);

oakwoodApp.controller('TestCtrl', function ($scope, $http) {
    $http.get('/api').success(function(data) {
        $scope.vals = data;
    });
});

oakwoodApp.controller('RacersCtrl', function ($scope, $http) {
    $http.get('/api/racers').success(function(data) {
        $scope.racers = data;
    });
});