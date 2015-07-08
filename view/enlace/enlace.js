angular.module('ngImeco.enlace', ['ui.router', 'ngAnimate', 'ngResource', 'ui.bootstrap'])
        .config(function config3($stateProvider) {
            $stateProvider.state('enlaces', {
                url: '/enlaces',
                views: {
                    'main': {
                        templateUrl: 'view/enlace/enlace.tpl.html',
                        controller: 'enlaceControler'
                    }
                },
                data: {
                    pageTitle: 'Enlaces de Interes'
                }
            });
        })
        .controller('enlaceControler', function ($scope, $log, $http, $modal, $timeout) {

            $scope.maxSize = 10;
            $scope.bigTotalItems = 0;
            $scope.bigCurrentPage = 1;
            $scope.pageSize = 10;

            $scope.enlaces = [];
            // $scope.enlaces = data.slice((1 - 1) * $scope.pageSize, 1 * $scope.pageSize);
            $scope.currentEnlaces = [];

            $scope.alert = {
                type: '',
                msg: ''
            };

            $scope.isRegister = false;

            $scope.pageChanged = function () {
                $scope.currentEnlaces = $scope.enlaces.slice(($scope.bigCurrentPage - 1) * $scope.pageSize, $scope.bigCurrentPage * $scope.pageSize);
            };

            $scope.listarEnlaceInteres = function () {

                $scope.bigCurrentPage = 1;

                $http.get('php/controller/EnlaceControllerGet.php?accion=listar')
                        .success(function (data, status, headers, config) {
                            $log.info(data);
                            $scope.bigTotalItems = data.length;
                            $scope.enlaces = data;
                            $scope.pageChanged();
                        })
                        .error(function (data, status, headers, config) {
                            console.log("Error");
                        });


            };

            $scope.listarEnlaceInteres();


            $scope.deleteEnlace = function (id_enlace) {
                var option = confirm("¿Desea Eliminar el enlace?");
                var info = {
                    accion: 'eliminar',
                    data: {
                        id: id_enlace
                    }
                };
                if (option) {
                    $http.post('php/controller/EnlaceControllerPost.php', info).
                            success(function (data, status, headers, config) {

                                //VALIDAR LA DATA EL OK???

                                $scope.alert = {
                                    type: 'danger',
                                    msg: 'Enlace Eliminado'
                                };

                                $scope.isRegister = true;

                                $timeout(function () {
                                    $scope.isRegister = false;
                                }, 3000);

                                $scope.listarEnlaceInteres();

                            }).
                            error(function (data, status, headers, config) {
                                $log.info("que paso aca");
                            });
                }
            };


            $scope.showModalNuevoEnlace = function () {

                var modalInstance = $modal.open({
                    templateUrl: 'view/enlace/newEnlace.html',
                    controller: 'NuevoEnlaceController'
                });

                modalInstance.result.then(function (selectedItem) {

                    $scope.alert = {
                        type: 'success',
                        msg: 'Enlace Registrado Correctamente'
                    };
                    $scope.isRegister = true;

                    $timeout(function () {
                        $scope.isRegister = false;
                    }, 3000);

                    $scope.listarEnlaceInteres();
                });
            };

            $scope.showModalVerEnlace = function (enlaceSeleccionado) {
                var modalInstance = $modal.open({
                    templateUrl: 'view/enlace/viewEnlace.html',
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
                    templateUrl: 'view/enlace/updateEnlace.html',
                    controller: 'ActualizarEnlaceController',
                    resolve: {
                        enlaceSeleccionado: function () {
                            return enlaceSeleccionado;
                        }
                    }
                });

                modalInstance.result.then(function (selectedItem) {


                    $scope.alert = {
                        type: 'info',
                        msg: 'Enlace actualizado Correctamente'
                    };
                    $scope.isRegister = true;

                    $timeout(function () {
                        $scope.isRegister = false;
                    }, 3000);

                    $scope.listarEnlaceInteres();
                });
            };
        })
        .controller('NuevoEnlaceController', function ($scope, $modalInstance, $http, $log) {

            $scope.nuevoEnlace = {};

            $scope.cancel = function () {
                $modalInstance.dismiss('cancel');
            };

            $scope.registerForm = function () {
                //cerrar el modal
                //
                var info = {
                    accion: 'registrar',
                    data: $scope.nuevoEnlace
                };

                $http.post('php/controller/EnlaceControllerPost.php', info)
                        .success(function (data, status, headers, config) {
                            $modalInstance.close($scope.nuevoEnlace);
                        })
                        .error(function (data, status, headers, config) {
                            //me quedo en el formulario
                            $log.info("que paso aca");
                        });

            };
        })
        .controller('ActualizarEnlaceController', function ($scope, $modalInstance, $http, $log, enlaceSeleccionado) {

            $scope.enlaceSeleccionado = enlaceSeleccionado;

            $scope.updateForm = function () {

                var info = {
                    accion: 'actualizar',
                    data: $scope.enlaceSeleccionado
                };

                $http.post('php/controller/EnlaceControllerPost.php', info)
                        .success(function (data, status, headers, config) {

                            //validacion de data
                            $modalInstance.close($scope.enlaceSeleccionado);
                        })
                        .error(function (data, status, headers, config) {
                            //me quedo en el formulario
                            $log.info("que paso aca");
                        });
            };

            $scope.cancel = function () {

                $modalInstance.dismiss('cancel');

            };


        })
        .controller('VerEnlaceController', function ($scope, $modalInstance, enlaceSeleccionado) {

            $scope.enlaceSeleccionado = enlaceSeleccionado;
            $scope.cancel = function () {

                $modalInstance.dismiss('cancel');

            };
        });
