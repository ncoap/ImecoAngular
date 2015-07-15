angular.module('ngImeco.nosensomatizados',
        ['ui.router', 'ngAnimate', 'ngResource', 'ui.bootstrap'])
        .config(function config7($stateProvider) {
            $stateProvider.state('nosensomatizados', {
                url: '/nosensomatizados',
                views: {
                    main: {
                        templateUrl: 'view/nosensomatizados/template.html',
                        controller: 'sensomatizadosController'
                    }
                },
                data: {
                    pageTitle: 'Productos No Sensomatizado'
                }
            });
        })
        .controller('sensomatizadosController', function ($scope, $log, $http, $modal, $timeout) {

            $scope.maxSize = 10;
            $scope.bigTotalItems = 0;
            $scope.bigCurrentPage = 1;
            $scope.pageSize = 10;

            $scope.currentProductosNoSensomatizados = [];

            $scope.productosNoSensomatizados = [];

            $scope.pageChanged = function () {
                $scope.currentProductosNoSensomatizados =
                        $scope.productosNoSensomatizados.slice(
                                ($scope.bigCurrentPage - 1) * $scope.pageSize,
                                $scope.bigCurrentPage * $scope.pageSize);
            };

            $scope.isLoadData = false;

            $scope.listarProdcutosNoSensomatizados = function () {
                $scope.isLoadData = true;
                $scope.bigCurrentPage = 1;
                $http.get('php/controller/SensomatizadoControllerGet.php', {
                    params: {
                        accion: 'listar'
                    }
                }).success(function (data, status, headers, config) {
                    $log.info(data);
                    $scope.bigTotalItems = data.length;
                    $scope.productosNoSensomatizados = data;
                    $scope.pageChanged();
                    $scope.isLoadData = false;

                }).error(function (data, status, headers, config) {
                    console.log("Error");
                });

            };

            $scope.listarProdcutosNoSensomatizados();


            $scope.showModalDetalle = function (productoSelect) {
                var modalInstance = $modal.open({
                    templateUrl: 'view/nosensomatizados/detalle.html',
                    controller: 'verSensomatizadosController',
                    resolve: {
                        productoSelect: function () {
                            return productoSelect;
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

                //return true false si esta visible o no
                $log.log($scope.itemSearch[$scope.itemSelected]);


            };

            //Cual es el valor de cada termino de búsqueda
            $scope.termSearch = {
                tienda: '',
                nombre: '',
                tipo: '',
                dni: '',
                sexo: '',
                fechaInicial: getDateActual(),
                fechaFinal: getDateActual()
            };

            $scope.consultar = function () {
                $log.info("Termino de Búsqueda: ", $scope.termSearch);
                alert('Busqueda en implementación');
                $log.info(fechaDefault().ini);
            };

            //FUNCION GET RANGO DE FECHAS POR DEFAULT INICIO A FIN
            function fechaDefault() {
                return {
                    ini: new Date(1990, 0, 1),
                    fin: new Date()
                };
            }

            function getDateActual() {
                //sumarle uno al mes si quiero mostrarle como string
                //debemos de enviarle 
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

        })
        .controller('verSensomatizadosController', function ($scope, $modalInstance, productoSelect) {

            $scope.productoSelect = productoSelect;

            $scope.cancel = function () {
                $modalInstance.dismiss('cancel');
            };

        });
