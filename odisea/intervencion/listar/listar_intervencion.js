angular.module('odisea.intervencion.listar',
    ['ui.router', 'ngAnimate', 'ngResource', 'ui.bootstrap'])
    .config(function config4($stateProvider) {
        $stateProvider.state('intervenciones', {
            url: '/intervenciones',
            views: {
                main: {
                    templateUrl: 'odisea/intervencion/listar/listar_intervencion.html',
                    controller: 'intervencionesController'
                }
            },
            data: {
                pageTitle: 'Intervenciones'
            }
        });
    })
    .service('interventionService', function ($http, $q) {

        function get(params) {
            var defered = $q.defer();
            var promise = defered.promise;

            $http.get('php/controller/IntervencionControllerGet.php', {
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
            $http.post('php/controller/IntervencionControllerPost.php', postData)
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
    .controller('intervencionesController', function (utilFactory, $state, $rootScope, $scope, $log, $http, $modal, $timeout, interventionService) {

        $scope.pagination = {maxSize: 10, totalItems: 0, currentPage: 1};
        $scope.isCollapsed = false;
        $scope.intervenciones = [];

        //Cual es el valor de cada termino de búsqueda
        $scope.termSearch = {
            tienda:undefined,
            nombre: '',
            tipo: '',
            dni: '',
            sexo: '',
            fechaInicial: utilFactory.dateDefault.ini,
            fechaFinal: new Date(),
            horario: '00:00:00 23:59:59'
        };

        $scope.listarIntervenciones = function () {
            $scope.pagination.currentPage = 1;

            if (!$scope.termSearch.tienda) {
                $scope.termSearch.tienda = '0';
            }
            $scope.pageChanged();
        };

        $scope.pageChanged = function () {
            interventionService.get({
                accion: 'multiple',
                pagina: $scope.pagination.currentPage,
                terminos: JSON.stringify($scope.termSearch)
            }).then(function (data) {
                $log.info("SERVICE - MULTIPLE => ", data);
                $scope.pagination.totalItems = data.size;
                $scope.intervenciones = data.interventions;
            }).catch(function (err) {
                $log.error("SERVICE - MULTIPLE =>", err);
            });
        };

        $scope.consultar = function () {
            $log.info("Termino de Búsqueda: ");
            $log.info($scope.termSearch);
            $scope.listarIntervenciones();
        };

        $scope.actualizarIntervencion = function (inter) {

            //SETEAMOS LA INFORMACION Y BUSCAMOS EL DETALLE DE LOS PRODUCTO
            var tendero = {
                idTendero: inter.idTendero,
                dniTendero: inter.dniTendero,
                nombreTendero: inter.nombreTendero,
                apellidoTendero: inter.apellidoTendero,
                idTipoTendero: inter.idTipoTendero,
                direccionTendero: inter.direccionTendero,
                nacimientoTendero: utilFactory.getDateFromString(inter.nacimientoTendero),
                sexoTendero: inter.sexoTendero,
                fotoTendero: inter.fotoTendero
            };


            var intervencion = {
                idIntervencion: inter.idIntervencion,
                fechaCompletaIntervencion: utilFactory.getDateTimeFromString(inter.fechaCompletaIntervencion),
                derivacionIntervencion: inter.derivacionIntervencion,
                lugarDerivacion: inter.lugarDerivacion,
                dniPrevencionista: inter.dniPrevencionista,
                nombrePrevencionista: inter.nombrePrevencionista,
                idTendero: inter.idTendero,
                tienda: {
                    idTienda: inter.idTienda,
                    nombreTienda: inter.nombreTienda
                },
                idPuesto: inter.idPuesto,
                modalidadEmpleada: inter.modalidadEmpleada,
                detalleIntervencion: inter.detalleIntervencion,
                totalRecuperado: inter.totalRecuperado,
                tipoHurto: inter.tipoHurto
            };

            //CARGAMOS EL DETALLE PARA ENVIAR A LA ACTUALIZACION
            interventionService.get({
                accion: 'detalle',
                id: inter.idIntervencion
            }).then(function (data) {
                $rootScope.intervencionSeleccionada = {
                    tendero: tendero,
                    intervencion: intervencion,
                    productos: data
                };
                $state.go('intervencionup')

            }).catch(function (err) {
                alert("SERVICE DETALLE");
            });

        };


        $scope.eliminarIntervencion = function (id) {
            var a = confirm("¿Desea Eliminar La Intervención y Detalle?");
            if (a) {
                interventionService.post({
                    accion: 'eliminar',
                    data: {
                        id: id
                    }
                }).then(function (data) {
                        if (data.msj == 'OK') {
                            alert("Intervención Eliminada");
                            $scope.listarIntervenciones();
                        } else {
                            alert("No se pudo Eliminar la Intervención");
                            $log.log("ADMIN ", data);
                        }
                    }).catch(function (err) {
                        alert("SERVICE eliminar");
                    });
            }
        };

        $scope.listarIntervenciones();

        $scope.showModalVerIntervencion = function (intervencionSelect) {
            var modalInstance = $modal.open({
                templateUrl: 'odisea/intervencion/listar/detalle_intervencion.html',
                controller: 'VerIntervencionController',
                size: 'lg',
                resolve: {
                    intervencionSelect: function () {
                        return intervencionSelect;
                    }
                }
            });
        };

    })
    .controller('VerIntervencionController', function ($log, $http, $scope, $modalInstance, intervencionSelect, interventionService) {

        $scope.intervencionSelect = intervencionSelect;
        $scope.mirandom = Math.random();
        $scope.detalleIntervencion = [];

        interventionService.get({
            accion: 'detalle',
            id: $scope.intervencionSelect.idIntervencion
        }).then(function (data) {
            $scope.detalleIntervencion = data;
        }).catch(function (err) {
            alert("ERR SERVICE DETALLE");
        });

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };

    });
