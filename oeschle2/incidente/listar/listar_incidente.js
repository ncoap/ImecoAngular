angular.module('odisea.incidente.listar',
    ['ui.router', 'ngAnimate', 'ngResource', 'ui.bootstrap', 'dialogs.main'])
    .config(function config7($stateProvider) {
        $stateProvider.state('incidentes', {
            url: '/incidentes',
            views: {
                main: {
                    templateUrl: 'oeschle2/incidente/listar/listar_incidente.html',
                    controller: 'incidentesController'
                }
            },
            data: {
                pageTitle: 'Incidentes'
            }
        });
    })
    .service('incidentService', function ($http, $q) {
        function get(params) {
            var defered = $q.defer();
            var promise = defered.promise;

            $http.get('php/controller/IncidenteControllerGet.php', {
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
            $http.post('php/controller/IncidenteControllerPost.php', postData)
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
    .controller('incidentesController', function (utilFactory, $state, $rootScope, $scope, $log,
                                                        $http, $modal, $timeout, incidentService) {
        $scope.pagination = {maxSize: 10, totalItems: 0, currentPage: 1};
        $scope.isCollapsed = false;
        $scope.incidentes = [];

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
            incidentService.get({
                accion: 'multiple',
                pagina: $scope.pagination.currentPage,
                terminos: JSON.stringify($scope.termSearch)
            }).then(function (data) {
                $log.info("SERVICE - MULTIPLE => ", data);
                $scope.pagination.totalItems = data.size;
                $scope.incidentes = data.incidentes;
            }).catch(function (err) {
                $log.error("SERVICE - MULTIPLE =>", err);
            });
        };

        $scope.consultar = function () {
            $log.info("Termino de Búsqueda: ");
            $log.info($scope.termSearch);
            $scope.listar();
        };

        $scope.actualizar = function (incidente) {
            $log.log(incidente);
            var incidente = {
                idIncidente:incidente.idIncidente,
                tienda: {
                    idTienda:incidente.idTienda,
                    nombreTienda : incidente.nombreTienda
                },
                nombreInvolucrado: incidente.nombreInvolucrado,
                dniInvolucrado: incidente.dniInvolucrado,
                actoCondicionInsegura:incidente.actoCondicionInsegura,
                nombreAccidentado: incidente.nombreAccidentado,
                dniAccidentado: incidente.dniAccidentado,
                edadAccidentado:incidente.edadAccidentado,
                sexoAccidentado:incidente.sexoAccidentado,
                fechaAccidenteCompleta: utilFactory.getDateTimeFromString(incidente.fechaAccidenteCompleta),
                nivelGravedad:incidente.nivelGravedad,
                diagnostico:incidente.diagnostico,
                descansoMedico:incidente.descansoMedico,
                cantidadDias:incidente.cantidadDias,
                descripcionCausas:incidente.descripcionCausas,
                lesion: incidente.lesion,
                accionesCorrectivasRealizadas:incidente.accionesCorrectivasRealizadas,
                total: incidente.total
            };

            incidentService.get({
                accion: 'detalle',
                id: incidente.idIncidente
            }).then(function (data) {
                $log.log(data);
                if(data.msj == 'OK'){
                    $rootScope.incidenteSeleccionado = {
                        incidente: incidente,
                        productos: data.detalle
                    };
                    $log.log("FROM LISTA ACTUALIZAR ",$rootScope.incidenteSeleccionado);
                    $state.go('incidenteup');
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
                incidentService.post({
                    accion: 'eliminar',
                    data: {
                        id: id
                    }
                }).then(function (data) {
                    if (data.msj == 'OK') {
                        alert("Incidente Eliminado");
                        $scope.listar();
                    } else {
                        alert("No se pudo Eliminar el Incidente");
                        $log.log("ADMIN ", data);
                    }
                }).catch(function (err) {
                    alert("SERVICE eliminar");
                });
            }
        };

        $scope.listar();

        $scope.showModalVer = function (incidentSelect) {
            var modalInstance = $modal.open({
                templateUrl: 'oeschle2/incidente/listar/detalle_incidente.html',
                controller: 'VerIncidenteController',
                size: 'lg',
                resolve: {
                    incidentSelect: function () {
                        return incidentSelect;
                    }
                }
            });
        };

    })
    .controller('VerIncidenteController', function ($log, $http, $scope, $modalInstance, incidentSelect, incidentService) {

        $scope.incidente = incidentSelect;
        $scope.mirandom = Math.random();
        $scope.productos = [];
        $scope.isViewOtros = true;

        incidentService.get({
            accion: 'detalle',
            id: $scope.incidente.idIncidente
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
