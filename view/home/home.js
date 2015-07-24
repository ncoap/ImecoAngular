angular.module('odisea.home',
        ['ui.router', 'ngAnimate', 'ngResource', 'ui.bootstrap'])
        .config(function config7($stateProvider) {
            $stateProvider.state('home', {
                url: '/home',
                views: {
                    main: {
                        templateUrl: 'view/home/template.html',
                        controller: 'homeController'
                    }
                },
                data: {
                    pageTitle: 'Últimos Tenderos'
                }
            });
        })
        .directive('errSrc', function () {
            return {
                link: function (scope, element, attrs) {

                    scope.$watch(function () {
                        return attrs['ngSrc'];
                    }, function (value) {
                        if (!value) {
                            element.attr('src', attrs.errSrc);
                        }
                    });

                    element.bind('error', function () {
                        element.attr('src', attrs.errSrc);
                    });
                }
            };
        })
        .controller('homeController', function ($scope, $log, $http, $modal, $timeout) {
            
            $scope.mirandom = Math.random();

            $scope.ultimasintervenciones = [];

            $scope.isLoadData = false;

            $scope.listarUltimosTenderos = function () {
                $scope.isLoadData = true;
                $scope.bigCurrentPage = 1;
                $http.get('php/controller/IntervencionControllerGet.php', {
                    params: {
                        accion: 'ultimos'
                    }
                }).success(function (data, status, headers, config) {
                    $log.info(data);
                    $scope.ultimasintervenciones = data;
                    $scope.isLoadData = false;

                }).error(function (data, status, headers, config) {
                    console.log("Error");
                });
            };

            $scope.listarUltimosTenderos();

            $scope.showModalDetalle = function (tenderoSelect) {
                var modalInstance = $modal.open({
                    templateUrl: 'view/home/detalle.html',
                    controller: 'verFotoController',
                    resolve: {
                        tenderoSelect: function () {
                            return tenderoSelect;
                        }
                    }
                });
            };

        })
        .controller('verFotoController', function ($scope, $modalInstance, tenderoSelect) {

            $scope.tenderoSelect = tenderoSelect;

            $scope.cancel = function () {
                $modalInstance.dismiss('cancel');
            };

        });

