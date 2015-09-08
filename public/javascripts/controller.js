var oakwoodApp = angular.module('oakwood', []);

oakwoodApp.controller('TestCtrl', function ($scope, $http) {
    $http.get('/api').success(function(data) {
        $scope.vals = data;
    });
});

oakwoodApp.controller('RacersCtrl', function ($scope, $http) {
    $http.get('/api/racers').then(function(response) {
        $scope.racers = response.data;
    });
});

oakwoodApp.controller('NewRacersCtrl', function ($scope, $http, $location) {
    $scope.submit = function() {
        if ($scope.racer.$valid) {
            $http.post('/api/racers/create', {
                'racer_name': $scope.racer_name,
                'car_name': $scope.car_name
            }).then(function(response) {
                debugger;
                window.location = '/racers';
            });
        }
    }
});