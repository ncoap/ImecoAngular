angular.module('odisea.operatividad',
    ['ui.router', 'ngAnimate', 'ngResource', 'ui.bootstrap', 'xeditable'])
    .config(function config50($stateProvider) {
        $stateProvider.state('operatividad', {
            url: '/operatividad',
            views: {
                main: {
                    templateUrl: 'view/operatividad/operatividad.html',
                    controller: 'operatividadController'
                }
            },
            data: {
                pageTitle: 'Operatividad'
            }
        });
    })
    .service('operatividadService', function ($http, $q) {

        function get(params) {
            var defered = $q.defer();
            var promise = defered.promise;
            $http.get('php/controller/ContinuidadControllerGet.php', {
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
            $http.post('php/controller/ContinuidadControllerPost.php', postData)
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
    .controller('operatividadController', function ($log, $scope, $filter, operatividadService) {
        var orderBy = $filter('orderBy');
        $scope.reverse = true;
        $scope.predicate = 'cantidadInoperativo';

        $scope.isAdd = false;


        $scope.order = function (predicate, reverse) {
            $scope.operatividad = orderBy($scope.operatividad, predicate, reverse);
            $scope.predicate = predicate;
        };

        $scope.producto = undefined;

        $scope.operatividad = [];

        $scope.removeOper = function (id) {
            $log.log(id);
            var res = confirm('¿Eliminar el Item?');
            if (res) {
                operatividadService.post({
                    accion: 'remove_item',
                    data: {
                        idDetOperatividad: id
                    }
                }).then(function (data) {
                    $log.info("SERVICE - REMOVE => ", data);
                    if (data.msj == 'OK') {
                        $scope.listado();
                    } else {
                        alert("Error al Eliminar el Item ");
                    }
                }).catch(function (err) {
                    $log.error("SERVICE - REMOVE ITEM =>", err);
                });
            }
        };

        $scope.cancelOper = function (id) {
            if (id == 0) {
                $scope.isAdd = false;
                $scope.operatividad.splice($scope.operatividad.length - 1, 1);
            }
        };

        $scope.saveOper = function (data, id, index) {
            $log.log("SAVE USER");
            $log.log(data);
            //VALIDACION DE LAS CANTIDADES PARA QUE SUMEN TOTAL
            var respuesta = validate_total(data);
            if (respuesta.msj == 'OK') {
                data.idDetOperatividad = id;
                //POR MIENTRAS LA UNO
                data.idOperatividad = 1;
                data.idProducto =  $scope.producto.idProducto;
                data.total = respuesta.total;
                data.otros = '';
                data.observaciones = '';
                operatividadService.post({
                    accion: 'actualizar',
                    data: {
                        item: data
                    }
                }).then(function (data) {
                    if (data.msj == 'OK') {
                        //SOLO ACTUALIZAMOS EL ID NUEVO
                        //$scope.operatividad[index].idDetOperatividad = data.id;
                        $scope.listado();
                    } else {
                        $log.log(data);
                        alert("Error al guardar el Item");
                        return "";
                    }
                }).catch(function (err) {
                    $log.error("SERVICE - MULTIPLE =>", err);
                });

            } else {
                alert(respuesta.mensaje);
                return respuesta.mensaje;
            }
        };

        function validate_total(data) {
            var respuesta = {msj: 'OK', mensaje: '', total: 0};

            var sum = data.cantidadExterna + data.cantidadInterna;
            var sum2 = data.cantidadOperativo + data.cantidadInoperativo;

            var reub = data.cantidadReubicacion;

            if (sum != sum2) {
                respuesta.msj = 'KO';
                respuesta.mensaje = 'LA SUMA TOTAL NO COINCIDE';
            } else {
                respuesta.total = sum;
                if (reub > respuesta.total) {
                    respuesta.msj = 'KO';
                    respuesta.mensaje = 'LA CANTIDAD DE REUBICADOS EXCEDE AL TOTAL';
                }
            }
            return respuesta;
        }


        $scope.changeProduct = function () {
            $log.log($scope.producto);
            $scope.listado();
        };

        $scope.addOperatividad = function () {
            if (!$scope.isAdd) {
                if ($scope.producto) {
                    $scope.inserted = {
                        idDetOperatividad: 0,
                        idOperatividad: 1,
                        idTienda: 1,
                        marcaEquipo: '',
                        modeloEquipo: '',
                        capacidadEquipo: '',
                        cantidadTotal: 0,
                        cantidadInterna: 0,
                        cantidadExterna: 0,
                        cantidadInoperativo: 0,
                        cantidadOperativo: 0,
                        cantidadReubicacion: 0
                    };
                    $scope.operatividad.push($scope.inserted);
                    $scope.isAdd = true;
                } else {
                    alert("Seleccione un producto");
                }
            }
        };

        $scope.listado = function () {
            if ($scope.producto) {
                operatividadService.get({
                    accion: 'listar',
                    idProducto: $scope.producto.idProducto
                }).then(function (data) {
                    $log.info("SERVICE - LISTAR => ", data);
                    $scope.operatividad = data.operatividad;
                }).catch(function (err) {
                    $log.error("SERVICE - MULTIPLE =>", err);
                });
            } else {
                $scope.operatividad = [];
            }
        };

        $scope.listado();
    });