angular.module('odisea.sensomatizado.listar',
    ['ui.router', 'ngAnimate', 'ngResource', 'ui.bootstrap', 'dialogs.main'])
    .config(function config7($stateProvider) {
        $stateProvider.state('nosensomatizados', {
            url: '/nosensomatizados',
            views: {
                main: {
                    templateUrl: 'odisea/sensomatizado/listar/listar_sensomatizado.html',
                    controller: 'nosensomatizadosController'
                }
            },
            data: {
                pageTitle: 'Productos No Sensomatizados'
            }
        });
    })
    .service('sensorService', function ($http, $q) {

        function get(params) {
            var defered = $q.defer();
            var promise = defered.promise;

            $http.get('php/controller/SensomatizadoControllerGet.php', {
                params: params
            }).success(function (data, status, headers, config) {
                defered.resolve(data);
            }).error(function (err) {
                defered.reject(err);
            });

            return promise;
        }

        function post(postData) {
            var defered = $q.defer();
            var promise = defered.promise;
            $http.post('php/controller/SensomatizadoControllerPost.php', postData)
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
    .controller('nosensomatizadosController', function (utilFactory, $state, $rootScope, $scope, $log,
                                                        $http, $modal, $timeout, sensorService) {

        $scope.pagination = {maxSize: 10, totalItems: 0, currentPage: 1};
        $scope.isCollapsed = false;
        $scope.sensomatizados = [];

        //Cual es el valor de cada termino de búsqueda
        $scope.termSearch = {
            tienda:undefined,
            nombre: '',
            dni: '',
            fechaInicial: utilFactory.dateDefault.ini,
            fechaFinal: new Date(),
            horario: '00:00:00 23:59:59'
        };

        $scope.listar = function () {
            $scope.pagination.currentPage = 1;

            if (!$scope.termSearch.tienda) {
                $scope.termSearch.tienda = '0';
            }
            $scope.pageChanged();
        };

        $scope.pageChanged = function () {
            sensorService.get({
                accion: 'multiple',
                pagina: $scope.pagination.currentPage,
                terminos: JSON.stringify($scope.termSearch)
            }).then(function (data) {
                $log.info("SERVICE - MULTIPLE => ", data);
                $scope.pagination.totalItems = data.size;
                $scope.sensomatizados = data.sensomatizados;
            }).catch(function (err) {
                $log.error("SERVICE - MULTIPLE =>", err);
            });
        };

        $scope.consultar = function () {
            $log.info("Termino de Búsqueda: ");
            $log.info($scope.termSearch);
            $scope.listar();
        };

        $scope.actualizar = function (sensor) {

            $log.log(sensor);

            var producto = {
                idSensor:sensor.idSensor,
                dniPrevencionista:sensor.dniPrevencionista,
                nombrePrevencionista: sensor.nombrePrevencionista,
                tienda: {
                    idTienda: sensor.idTienda,
                    nombreTienda: sensor.nombreTienda
                },
                fecha:utilFactory.getDateTimeFromString(sensor.fechaCompleta),
                observaciones : sensor.observaciones,
                total: sensor.total
            };

            sensorService.get({
                accion: 'detalle',
                id: sensor.idSensor
            }).then(function (data) {
                $log.log(data);
                if(data.msj == 'OK'){
                    $rootScope.sensorSeleccionado = {
                        sensomatizado: producto,
                        productos: data.detalle
                    };
                    $log.log("FROM LISTA ACTUALIZAR ",$rootScope.sensorSeleccionado);
                    $state.go('nosensomatizadoup');
                }else{
                    $log.error("ERROR SENSORSERVICE - DETALLE",data.error);
                }

            }).catch(function (err) {
                $log.err("SERVICE DETALLE");
            });

        };


        $scope.eliminar = function (id) {
            var a = confirm("¿Desea Eliminar El Registro y Detalle?");
            if (a) {
                sensorService.post({
                    accion: 'eliminar',
                    data: {
                        id: id
                    }
                }).then(function (data) {
                    if (data.msj == 'OK') {
                        alert("Producto No Sensomatizado Eliminado");
                        $scope.listar();
                    } else {
                        alert("No se pudo Eliminar el Producto");
                        $log.log("ADMIN ", data);
                    }
                }).catch(function (err) {
                    alert("SERVICE eliminar");
                });
            }
        };

        $scope.listar();

        $scope.showModalVer = function (sensorSelect) {
            var modalInstance = $modal.open({
                templateUrl: 'odisea/sensomatizado/listar/detalle_sensomatizado.html',
                controller: 'VerSensomatizadoController',
                size: 'sm',
                resolve: {
                    sensorSelect: function () {
                        return sensorSelect;
                    }
                }
            });
        };

    })
    .controller('VerSensomatizadoController', function ($log, $http, $scope, $modalInstance, sensorSelect, sensorService) {

        $scope.sensor = sensorSelect;
        $scope.mirandom = Math.random();
        $scope.productos = [];

        sensorService.get({
            accion: 'detalle',
            id: $scope.sensor.idSensor
        }).then(function (data) {
            $log.log(data);
            if(data.msj == 'OK'){
                $scope.productos = data.detalle;
            }else{
                $log.error("ERROR SENSORSERVICE - DETALLE",data.error);
            }

        }).catch(function (err) {
            $log.err("SERVICE DETALLE");
        });

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };

    });
