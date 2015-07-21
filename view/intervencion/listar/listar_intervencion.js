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
            $scope.listarIntervenciones = function () {
                $scope.isLoadData = true;
                $scope.bigCurrentPage = 1;
                $http.get('php/controller/IntervencionControllerGet.php', {
                    params: {
                        accion: 'multiple',
                        terminos: JSON.stringify($scope.termSearch)
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
                tienda: '0',
                nombre: '',
                tipo: '0',
                dni: '',
                sexo: '',
                fechaInicial: fechaDefault().ini,
                fechaFinal: fechaDefault().fin
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

                $log.info(inter);
                
                var tendero = {
                    idTendero: inter.idTendero,
                    dniTendero: inter.dniTendero,
                    nombreTendero: inter.nombreTendero,
                    apellidoTendero: inter.apellidoTendero,
                    idTipoTendero: inter.idTipoTendero,
                    direccionTendero: inter.direccionTendero,
                    nacimientoTendero: inter.nacimientoTendero, //FORMAT DATEDATEDATE
                    sexoTendero: inter.sexoTendero,
                    fotoTendero: inter.fotoTendero
                };


                var intervencion = {
                    fechaCompletaIntervencion: inter.fechaCompletaIntervencion, //FORMAT FECHA
                    derivacionIntervencion: inter.derivacionIntervencion,
                    lugarDerivacion: inter.lugarDerivacion,
                    dniPrevencionista: inter.dniPrevencionista,
                    nombrePrevencionista: inter.nombrePrevencionista,
                    tienda: {//TIENDA COMO OBJETO POR QUE TRABAJAMOS CON ng-options en los combos
                        idTienda: inter.idTienda,
                        nombreTienda: inter.nombreTienda
                    },
                    idPuesto: inter.idPuesto,
                    modalidadEmpleada: inter.modalidadEmpleada,
                    detalleIntervencion: inter.detalleIntervencion
                };

                $rootScope.intervencionSeleccionda = {
                    tendero: tendero,
                    intervencion: intervencion
                };

                $state.go('intervencionup');

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

            $scope.listarIntervenciones();

        })
        .controller('VerIntervencionController', function ($log, $http, $scope, $modalInstance, intervencionSelect) {

            $scope.intervencion = intervencionSelect;

            $log.log($scope.intervencion);

            $scope.detalleIntervencion = [];

            $scope.total = 0.0;

            $scope.getDetailIntervencion = function (id) {

                $http.get('php/controller/IntervencionControllerGet.php?accion=detalle&id=' + id)
                        .success(function (data, status, headers, config) {
                            $log.log("detalle ", data);
                            $scope.detalleIntervencion = data;
                            $scope.calcularTotal(data);
                        })
                        .error(function (data, status, headers, config) {
                            console.log("Error");
                        });
            };

            $scope.calcularTotal = function (data) {

                var total = 0.0;

                angular.forEach(data, function (item) {
                    total = total + item.precio * item.cantidad;
                });

                $scope.total = total;
            };

            $scope.getDetailIntervencion($scope.intervencion.id);

            $scope.cancel = function () {
                $modalInstance.dismiss('cancel');
            };

        });
