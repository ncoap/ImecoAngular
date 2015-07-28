angular.module('odisea.intervencion.listar',
    ['ui.router', 'ngAnimate', 'ngResource', 'ui.bootstrap'])
    .config(function config4($stateProvider) {
        $stateProvider.state('intervenciones', {
            url: '/intervenciones',
            views: {
                main: {
                    templateUrl: 'view/intervencion/listar/listar_intervencion.html',
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

        return {
            get: get
        }

    })
    .controller('intervencionesController', function (utilFactory, $state, $rootScope, $scope, $log, $http, $modal, $timeout, interventionService) {

        $scope.maxSize = 10;
        $scope.bigTotalItems = 0;
        $scope.bigCurrentPage = 1;
        $scope.pageSize = 10;

        $scope.currentIntervenciones = [];

        $scope.intervenciones = [];

        $scope.pageChanged = function () {
            $scope.currentIntervenciones = $scope.intervenciones.slice(($scope.bigCurrentPage - 1) * $scope.pageSize, $scope.bigCurrentPage * $scope.pageSize);
        };

        $scope.isLoadData = false;

        $scope.itemSearch = {
            tienda: false,
            nombre: false,
            tipo: false,
            dni: false,
            sexo: false,
            fecha: false
        };

        $scope.itemSelected = 'tienda';

        //Cual es el valor de cada termino de búsqueda
        $scope.termSearch = {
            tienda: undefined,
            nombre: '',
            tipo: '0',
            dni: '',
            sexo: '',
            fechaInicial: utilFactory.dateDefault.ini,
            fechaFinal: utilFactory.dateDefault.fin
        };


        $scope.listarIntervenciones = function () {
            $scope.isLoadData = true;
            $scope.bigCurrentPage = 1;

            var termBusqueda = $scope.termSearch;

            if (!$scope.termSearch.tienda) {
                termBusqueda.tienda = '0';
            }

            interventionService.get({
                accion: 'multiple',
                terminos: JSON.stringify(termBusqueda)
            }).then(function (data) {
                $log.info("SERVICE - MULTIPLE => ",data);
                $scope.bigTotalItems = data.length;
                $scope.intervenciones = data;
                $scope.pageChanged();
                $scope.isLoadData = false;
            }).catch(function (err) {
                $log.error("SERVICE - MULTIPLE =>", err);
            });

        };

        $scope.showModalVerIntervencion = function (intervencionSelect) {
            var modalInstance = $modal.open({
                templateUrl: 'view/intervencion/listar/detalle_intervencion.html',
                controller: 'VerIntervencionController',
                size: 'lg',
                resolve: {
                    intervencionSelect: function () {
                        return intervencionSelect;
                    }
                }
            });
        };


        $scope.toggleItemSearch = function () {

            //Cambiamos de visibilidad de true a false y viceversa
            $scope.itemSearch[$scope.itemSelected] = !$scope.itemSearch[$scope.itemSelected];

            //////////////////////////////

            switch ($scope.itemSelected) {
                case "fecha":
                    if ($scope.itemSearch.fecha) {
                        $scope.termSearch.fechaInicial = utilFactory.getDateActual();
                        $scope.termSearch.fechaFinal = utilFactory.getDateActual();
                    } else {
                        $scope.termSearch.fechaInicial = utilFactory.dateDefault.ini;
                        $scope.termSearch.fechaFinal = utilFactory.dateDefault.fin;
                    }
                    break;
                case "tipo":
                    $scope.termSearch.tipo = '0';
                    break;
                case "tienda":
                    $scope.termSearch.tienda = '0';
                    break;
                default:
                    $scope.termSearch[$scope.itemSelected] = '';
            }
        };

        $scope.consultar = function () {

            $log.info("Termino de Búsqueda: ");
            $log.info($scope.termSearch);
            $scope.listarIntervenciones();

        };


        $scope.actualizarIntervencion = function (inter) {

            //SETEAMOS LA INFORMACION Y BUSCAMOS EL DETALLE DE LOS PRODUCTOS

            $log.info(inter);

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

            $http.get('php/controller/IntervencionControllerGet.php?accion=detalle&id=' + inter.idIntervencion)
                .success(function (data, status, headers, config) {

                    $rootScope.intervencionSeleccionada = {
                        tendero: tendero,
                        intervencion: intervencion,
                        productos: data
                    };

                    $state.go('intervencionup');

                })
                .error(function (data, status, headers, config) {
                    console.log("Error");
                });

        };


        $scope.eliminarIntervencion = function (id) {

            var a = confirm("¿Desea Eliminar La Intervención y Detalle?");
            if (a) {

                var postData = {
                    accion: 'eliminar',
                    data: {
                        id: id
                    }
                };

                $http.post('php/controller/IntervencionControllerPost.php', postData)
                    .success(function (data, status, headers, config) {

                        if (data.msj == 'OK') {

                            alert("Intervención Eliminada");
                            $scope.listarIntervenciones();

                        } else {

                            alert("No se pudo Eliminar la Intervención");
                            $log.log("ADMIN ", data);

                        }
                    })
                    .error(function (data, status, headers, config) {

                        $log.info("que paso aca");

                    }
                );
            }
        };

        $scope.listarIntervenciones();

    })
    .controller('VerIntervencionController', function ($log, $http, $scope, $modalInstance, intervencionSelect) {

        $log.log("SELLECCIONADAD", intervencionSelect);
        $scope.intervencionSelect = intervencionSelect;

        $scope.mirandom = Math.random();

        $scope.detalleIntervencion = [];

        $http.get('php/controller/IntervencionControllerGet.php?accion=detalle&id=' + $scope.intervencionSelect.idIntervencion)
            .success(function (data, status, headers, config) {
                $log.log("detalle ", data);
                $scope.detalleIntervencion = data;
            })
            .error(function (data, status, headers, config) {
                console.log("Error");
            });

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };

    });
