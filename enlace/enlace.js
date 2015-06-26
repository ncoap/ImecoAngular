angular.module('ngBoilerplate.client', ['ui.router', 'ngResource', 'ui.bootstrap'])
        .config(function config3($stateProvider) {
            $stateProvider.state('client', {
                url: '/enlaces',
                views: {
                    'main': {
                        templateUrl: 'enlace/enlace.tpl.html',
                        controller: 'itemControler'
                    }
                },
                data: {
                    pageTitle: 'Enlaces de Interes'
                }
            });
        })
        .factory('clientService', function ($resource) {
            var service = {
                getClients: function (success, failure) {
                    var Clients = $resource('/angular/rest/client');
                    var data = Clients.get(
                            {},
                            function () {
                                var clients = data.clients;
                                if (clients.length !== 0) {
                                    success(clients);
                                } else {
                                    failure();
                                }
                            },
                            failure
                            );
                },
                registerClient: function (client, success, failure) {
                    var Client = $resource('/basic-web-app/rest/client');
                    Client.save({}, client, success, failure);
                }
            };
            return service;
        })
        .controller('itemControler', function ($scope, clientService, $log, $http, $modal) {

            $scope.maxSize = 10;
            $scope.bigTotalItems = 0;
            $scope.bigCurrentPage = 1;
            $scope.pageSize = 10; //8 por registro

            $scope.enlaces = [];
            // $scope.enlaces = data.slice((1 - 1) * $scope.pageSize, 1 * $scope.pageSize);
            $scope.currentEnlaces = [];

            $scope.pageChanged = function () {
                $scope.currentEnlaces = $scope.enlaces.slice(($scope.bigCurrentPage - 1) * $scope.pageSize, $scope.bigCurrentPage * $scope.pageSize);
            };

            $scope.deleteEnlace = function (id_enlace) {
                var a = confirm("¿Desea Eliminar el enlace?");
                var objeto = {id: id_enlace};
                if (a) {
                    $http.post('php/controlador/delete.php', objeto).
                            success(function (data, status, headers, config) {
                                console.log(data);
                                //validar el mensajes del data es "OK" no solo OK 
                                $scope.listarEnlaceInteres();
                            }).
                            error(function (data, status, headers, config) {
                                $log.info("que paso aca");
                            });
                }
            };

            $scope.listarEnlaceInteres = function () {

                $scope.bigCurrentPage = 1;

                $http.get('php/controlador/controlador.php').
                        success(function (data, status, headers, config) {

                            $log.log("Registros " + data);
                            $scope.bigTotalItems = data.length;
                            $scope.enlaces = data;
                            $scope.pageChanged();

                        }).
                        error(function (data, status, headers, config) {
                            console.log("Error");
                        });
            };

            $scope.listarEnlaceInteres();

            $scope.showModalNuevoEnlace = function () {

                var modalInstance = $modal.open({
                    templateUrl: 'client/newEnlace.html',
                    controller: 'NuevoEnlaceController'
                });

                modalInstance.result.then(function (selectedItem) {

                    $http.post('php/controlador/services.php', selectedItem)
                            .success(function (data, status, headers, config) {
                                console.info(data);
                                $scope.listarEnlaceInteres();
                            })
                            .error(function (data, status, headers, config) {
                                $log.info("que paso aca");
                            });
                });
            };

            $scope.showModalVerEnlace = function (enlaceSeleccionado) {
                var modalInstance = $modal.open({
                    templateUrl: 'client/viewEnlace.html',
                    controller: 'VerEnlaceController',
                    resolve: {
                        enlaceSeleccionado: function () {
                            return enlaceSeleccionado;
                        }
                    }
                });

            };

            $scope.showModalActualizarEnlace = function (enlaceSeleccionado) {

                var modalInstance = $modal.open({
                    templateUrl: 'client/updateEnlace.html',
                    controller: 'ActualizarEnlaceController',
                    resolve: {
                        enlaceSeleccionado: function () {
                            return enlaceSeleccionado;
                        }
                    }
                });

                modalInstance.result.then(function (selectedItem) {
                    $http.post('php/controlador/services.php', selectedItem)
                            .success(function (data, status, headers, config) {
                                console.info(data);
                                $scope.listarEnlaceInteres();
                            })
                            .error(function (data, status, headers, config) {
                                $log.info("que paso aca");
                            });
                });
            };
        })
        .controller('NuevoEnlaceController', function ($scope, $modalInstance) {

            $scope.nuevoEnlace = {};

            $scope.cancel = function () {
                $modalInstance.dismiss('cancel');
            };

            $scope.registerForm = function () {
                $modalInstance.close($scope.nuevoEnlace);

//                $http.post('php/controlador/services.php', $scope.en)
//                        .success(function (data, status, headers, config) {
//                            console.info(data);
//                        })
//                        .error(function (data, status, headers, config) {
//                            $log.info("que paso aca");
//                        });

            };
        })
        .controller('ActualizarEnlaceController', function ($scope, $modalInstance, enlaceSeleccionado) {

            $scope.enlaceSeleccionado = enlaceSeleccionado;

            $scope.updateForm = function () {
                $modalInstance.close($scope.enlaceSeleccionado);
            };

            $scope.cancel = function () {

                $modalInstance.dismiss('cancel');

            };


        }).controller('VerEnlaceController', function ($scope, $modalInstance, enlaceSeleccionado) {

    $scope.enlaceSeleccionado = enlaceSeleccionado;
    $scope.cancel = function () {

        $modalInstance.dismiss('cancel');

    };
});
