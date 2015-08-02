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
    .controller('operatividadController', function ($log, $scope, operatividadService) {

        $scope.item = {
            idDetOperatividad:0,
            idOperatividad:0,
            tienda:undefined,
            producto:undefined,
            equipo: '',
            marca: '',
            modelo: '',
            capacidad: '',
            total:0,
            interno: 0,
            externo: 0,
            inoperativo: 0,
            operativo: 0,
            reubicacion: 0,
            otros:'',
            observaciones:''
        };

        $scope.operatividad = [];

        $scope.listado = function () {
            operatividadService.get({
                accion: 'listar'
            }).then(function (data) {
                $log.info("SERVICE - LISTAR => ", data);
                $scope.operatividad = data.operatividad;
            }).catch(function (err) {
                $log.error("SERVICE - MULTIPLE =>", err);
            });
        };


        $scope.actualizar = function (item) {
            $scope.item = {
                id: item.idDetOperatividad,
                equipo: item.nombreEquipo,
                marca: item.marcaEquipo,
                modelo: item.modeloEquipo,
                capacidad: item.capacidadEquipo,
                interno: item.cantidadInterna,
                externo: item.cantidadExterna,
                inoperativo: item.cantidadInoperativo,
                operativo: item.cantidadOperativo,
                reubicacion: item.cantidadReubicacion
            };
        };


        $scope.update = function () {
            operatividadService.post({
                accion: 'registrar',
                data: {
                    item: $scope.item
                }
            }).then(function (data) {
                if (data.msj == 'OK') {
                    $scope.listado();
                }
            }).catch(function (err) {
                $log.error("SERVICE - MULTIPLE =>", err);
            });
        };

        $scope.listado();

    });