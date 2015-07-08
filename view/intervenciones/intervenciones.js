angular.module('ngImeco.intervenciones', ['ui.router', 'ngAnimate', 'ngResource', 'ui.bootstrap'])
        .config(function config4($stateProvider) {
            $stateProvider.state('intervenciones', {
                url: '/intervenciones',
                views: {
                    'main': {
                        templateUrl: 'view/intervenciones/intervenciones.tpl.html',
                        controller: 'intervencionesController'
                    }
                },
                data: {
                    pageTitle: 'Intervenciones'
                }
            });
        })
        .controller('intervencionesController', function ($scope, $log, $http, $modal, $timeout) {

            $scope.intervenciones = [];

            $scope.isLoadData = false;

            $scope.listarIntervenciones = function () {

                $scope.isLoadData = true;
                
                $http.get('php/controller/IntervencionControllerGet.php', {
                    params: {
                        accion: 'listar'
                    }
                }).success(function (data, status, headers, config) {
                    $log.info(data);
                    $scope.intervenciones = data;
                    $scope.isLoadData = false;
                }).error(function (data, status, headers, config) {
                    console.log("Error");
                });

            };

            $scope.listarIntervenciones();


            $scope.showModalVerIntervencion = function (intervencionSelect) {
                var modalInstance = $modal.open({
                    templateUrl: 'view/intervenciones/verIntervencion.html',
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

            $scope.itemSelected = 'nombre';

            $scope.toggleItemSearch = function () {
                $scope.itemSearch[$scope.itemSelected] = !$scope.itemSearch[$scope.itemSelected];
                //limpiarmos el modelo
                $scope.termSearch[$scope.itemSelected] = '';
            };

            //Cual es el valor de cada termino de búsqueda
            $scope.termSearch = {
                tienda: '',
                nombre: '',
                tipo: '',
                dni: '',
                sexo: '',
                fechaInicial: '',
                fechaFinal: ''
            };

            $scope.consultar = function () {
                $log.info($scope.termSearch);

            };

        })
        .controller('VerIntervencionController', function ($http, $scope, $modalInstance, intervencionSelect) {

            $scope.intervencion = intervencionSelect;

            $scope.detalleIntervencion = [];

            $scope.total = 0.0;

            $scope.getDetailIntervencion = function (id) {

                $http.get('php/controller/IntervencionControllerGet.php?accion=detalle&id=' + id)
                        .success(function (data, status, headers, config) {
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
                    var precio = parseFloat(item.precio);
                    var cantidad = parseInt(item.cantidad);
                    total = total + precio * cantidad;
                });

                $scope.total = total;
            };

            $scope.getDetailIntervencion($scope.intervencion.id);


            $scope.cancel = function () {

                $modalInstance.dismiss('cancel');

            };
        });
