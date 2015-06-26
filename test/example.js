angular.module('ui.bootstrap.demo', ['ui.bootstrap'])
.controller('PaginationDemoCtrl', function ($scope, $log, $http) {
    
    $scope.maxSize = 10;
    $scope.datanames = [];
    $scope.selectiondata = [];
    $scope.bigTotalItems = 0;
    $scope.fila = 300;
    $scope.bigCurrentPage = 1;
    $scope.nextelement = 0;
    
    $http.get('/angular/app/largeLoad.json').
      success(function(data, status, headers, config) {
        $log.info(data);
        $scope.datanames=data;
        $scope.bigTotalItems = (data.length * 10) / $scope.fila;
        $scope.pageChanged();

      }).
      error(function(data, status, headers, config) {
        $log.error("hubo un error")
      });

    $scope.pageChanged = function() {
        $log.log('Page changed to: ' + $scope.bigCurrentPage);
        //$log.info($scope.names.slice(1,3));
        $scope.nextelement = ($scope.bigCurrentPage -1 )*$scope.fila + 1 ;
        $log.info($scope.nextelement);
        $scope.selectiondata = $scope.datanames.slice($scope.nextelement - 1 ,$scope.nextelement + $scope.fila - 1)

    };

});
