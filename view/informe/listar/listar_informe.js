angular.module('odisea.informe.listar',
    ['ui.router', 'ngAnimate', 'ngResource', 'ui.bootstrap', 'dialogs.main'])
    .config(function config57($stateProvider) {
        $stateProvider.state('informes', {
            url: '/informes',
            views: {
                main: {
                    templateUrl: 'view/informe/listar/listar_informe.html',
                    controller: 'informesController'
                }
            },
            data: {
                pageTitle: 'Informes'
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
    .directive('exportTable', function () {
        var link = function ($scope, elm, attr) {
            $scope.$on('export-excel', function (e, d) {
                elm.tableExport({type: 'excel', escape: false});
            });
        };
        return {
            restrict: 'C',
            link: link
        }
    })
    .service('informeService', function ($http, $q) {

        function get(params) {
            var defered = $q.defer();
            var promise = defered.promise;

            $http.get('php/controller/InformeControllerGet.php', {
                params: params
            }).success(function (data) {
                defered.resolve(data);
            }).error(function (err) {
                defered.reject(err);
            });

            return promise;
        }

        function post(postData) {
            var defered = $q.defer();
            var promise = defered.promise;
            $http.post('php/controller/InformeControllerPost.php', postData)
                .success(function (data) {
                    defered.resolve(data);
                })
                .error(function (err) {
                    defered.reject(err);
                }
            );

            return promise;
        }

        return {
            get: get,
            post: post
        }

    })
    .controller('informesController', function (utilFactory, $state, $rootScope, $scope, $log,
                                                        $http, $modal, informeService) {

        $scope.isCollapsed = false;
        $scope.informes = [];

        //Cual es el valor de cada termino de búsqueda
        $scope.termSearch = {
            nombres: '',
            dni: '',
            cargo:'',
            asunto:''
        };

        $scope.listar = function () {
            informeService.get({
                accion: 'multiple',
                terminos: JSON.stringify($scope.termSearch)
            }).then(function (data) {
                $log.info("SERVICE - MULTIPLE => ", data);
                $scope.informes = data.informes;
            }).catch(function (err) {
                $log.error("SERVICE - MULTIPLE =>", err);
            });
        };

        $scope.actualizar = function (informe) {

            $log.log(informe);
            $state.go('informeup');

        };

        $scope.eliminar = function (id) {
            var a = confirm("¿Desea Eliminar El Registro?");
            if (a) {
                informeService.post({
                    accion: 'eliminar',
                    data: {
                        id: id
                    }
                }).then(function (data) {
                    if (data.msj == 'OK') {
                        alert("Informe Eliminado");
                        $scope.listar();
                    } else {
                        alert("No se pudo Eliminar el Informe");
                        $log.log("ADMIN ", data);
                    }
                }).catch(function (err) {
                    alert("SERVICE eliminar");
                });
            }
        };

        $scope.listar();

        $scope.showModalVer = function (informeSelect) {
            var modalInstance = $modal.open({
                templateUrl: 'view/informe/listar/detalle_informe.html',
                controller: 'VerInformeController',
                size: 'lg',
                resolve: {
                    informeSelect: function () {
                        return informeSelect;
                    }
                }
            });
        };

        $scope.exportAction = function(){
            $scope.$broadcast('export-excel', {});
        };

    })
    .controller('VerInformeController', function ($log, $http, $scope, $modalInstance, informeSelect) {

        $scope.informe = informeSelect;
        $scope.mirandom = Math.random();

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    });
