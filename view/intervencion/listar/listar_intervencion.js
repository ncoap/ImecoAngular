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
        .controller('intervencionesController', function ($state, $rootScope, $scope, $log, $http, $modal, $timeout) {


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
                fechaInicial: fechaDefault().ini,
                fechaFinal: fechaDefault().fin
            };


            $scope.listarIntervenciones = function () {
                $scope.isLoadData = true;
                $scope.bigCurrentPage = 1;

                var termBusqueda = $scope.termSearch;

                if (!$scope.termSearch.tienda) {
                    termBusqueda.tienda = '0';
                }

                $http.get('php/controller/IntervencionControllerGet.php', {
                    params: {
                        accion: 'multiple',
                        terminos: JSON.stringify(termBusqueda)
                    }
                }).success(function (data, status, headers, config) {
                    $log.info(data);
                    $scope.bigTotalItems = data.length;
                    $scope.intervenciones = data;
                    $scope.pageChanged();
                    $scope.isLoadData = false;

                }).error(function (data, status, headers, config) {
                    console.log("Error");
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
                $scope.itemSearch[$scope.itemSelected] =
                        !$scope.itemSearch[$scope.itemSelected];

                //////////////////////////////

                switch ($scope.itemSelected) {
                    case "fecha":
                        if ($scope.itemSearch.fecha) {
                            $scope.termSearch.fechaInicial = getDateActual();
                            $scope.termSearch.fechaFinal = getDateActual();
                        } else {
                            $scope.termSearch.fechaInicial = fechaDefault().ini;
                            $scope.termSearch.fechaFinal = fechaDefault().fin;
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
                    nacimientoTendero: getDateFromString2(inter.nacimientoTendero),
                    sexoTendero: inter.sexoTendero,
                    fotoTendero: inter.fotoTendero
                };


                var intervencion = {
                    idIntervencion: inter.idIntervencion,
                    fechaCompletaIntervencion: getDateFromString(inter.fechaCompletaIntervencion),
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

                            });
                }

            };


            function getDateFromString(fechahora) {
                //separa el string 2015-07-05 00:00:00
                var anio = parseInt(fechahora.substr(0, 4));
                var mes = parseInt(fechahora.substr(5, 2)) - 1;
                var dia = parseInt(fechahora.substr(8, 2));
                var hora = parseInt(fechahora.substr(11, 2));
                var minuto = parseInt(fechahora.substr(14, 2));
                return new Date(anio, mes, dia, hora, minuto);
            }

            function getDateFromString2(fechahora) {
                //separa el string 2015-07-05
                var anio = parseInt(fechahora.substr(0, 4));
                var mes = parseInt(fechahora.substr(5, 2)) - 1;
                var dia = parseInt(fechahora.substr(8, 2));
                return new Date(anio, mes, dia);
            }


            //FUNCION GET RANGO DE FECHAS POR DEFAULT INICIO A FIN
            function fechaDefault() {
                return {
                    ini: new Date(1990, 0, 1),
                    fin: new Date()
                };
            }

            function getDateActual() {
                var today = new Date();
                var dia = (today.getDate() < 10) ? '0' + today.getDate() : today.getDate();
                var m = today.getMonth();
                var mes = (m < 10) ? '0' + m : m;
                var p_hora = today.getHours();
                var hora = (p_hora < 10) ? '0' + p_hora : p_hora;
                var p_minuto = today.getMinutes();
                var minuto = (p_minuto < 10) ? '0' + p_minuto : p_minuto;
                return new Date(today.getFullYear(), mes, dia, hora, minuto);
            }

            function getDateFromString(fechahora) {

                //separa el string 2015-07-05 00:00:00
                var anio = parseInt(fechahora.substr(0, 4));
                var mes = parseInt(fechahora.substr(5, 2)) - 1;
                var dia = parseInt(fechahora.substr(8, 2));
                var hora = parseInt(fechahora.substr(11, 2));
                var minuto = parseInt(fechahora.substr(14, 2));
                return new Date(anio, mes, dia, hora, minuto);
            }

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
