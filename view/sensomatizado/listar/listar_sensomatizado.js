angular.module('odisea.sensomatizado.listar',
        ['ui.router', 'ngAnimate', 'ngResource', 'ui.bootstrap', 'dialogs.main'])
        .config(function config7($stateProvider) {
            $stateProvider.state('nosensomatizados', {
                url: '/nosensomatizados',
                views: {
                    main: {
                        templateUrl: 'view/sensomatizado/listar/listar_sensomatizado.html',
                        controller: 'nosensomatizadosController'
                    }
                },
                data: {
                    pageTitle: 'Productos No Sensomatizados'
                }
            });
        })
        .controller('nosensomatizadosController', function ($state, $rootScope, $scope, $log, $window, $http, $modal, $timeout, dialogs) {

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

                var termBusqueda = $scope.termSearch;
                if (!$scope.termSearch.tienda) {
                    termBusqueda.tienda = '0';
                }

                $http.get('php/controller/SensomatizadoControllerGet.php', {
                    params: {
                        accion: 'multiple',
                        terminos: JSON.stringify(termBusqueda)
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


            $scope.showModalDetalle = function (productoSelect) {
                var modalInstance = $modal.open({
                    templateUrl: 'view/sensomatizado/listar/detalle_sensomatizado.html',
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

            $scope.itemSelected = 'tienda';

            $scope.termSearch = {
                tienda: undefined,
                nombre: '',
                dni: '',
                fechaInicial: fechaDefault().ini,
                fechaFinal: fechaDefault().fin
            };


            $scope.toggleItemSearch = function () {

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
                    case "tienda":
                        $scope.termSearch.tienda = undefined;
                        break;
                    default:
                        $scope.termSearch[$scope.itemSelected] = '';
                }
            };

            $scope.eliminarProducto = function (id_producto) {

                var dlg = dialogs.confirm('Eliminar', '¿Desea eliminar el Producto Seleccionado?', {size: 'sm'});


                dlg.result.then(
                        function (btn) {

                            var deleteData = {
                                accion: 'eliminar',
                                data: {
                                    id: id_producto
                                }
                            };

                            $http.post('php/controller/SensomatizadoControllerPost.php', deleteData)
                                    .success(function (data, status, headers, config) {
                                        if (data.msj == 'OK') {
                                            $scope.listarProdcutosNoSensomatizados();
                                        } else {
                                            alert("No se pudo Eliminar");
                                        }
                                    })
                                    .error(function (data, status, headers, config) {

                                        $log.info("que paso aca");
                                    });

                        },
                        function (btn) {
                        }
                );

            };

            $scope.actualizarProducto = function (producto) {



                $rootScope.producto = producto;
                //la propiedad tienda tiene que ser un objeto con id y tienda 
                //por eso lo transformo de la lista
                $rootScope.producto.tienda = {
                    id: producto.idtienda,
                    tienda: producto.tienda
                };

                //cambio la fecha string por fecha DATE
                $log.log("Fechita ", getDateFromString($rootScope.producto.fechasin));
                $rootScope.producto.fecha = getDateFromString($rootScope.producto.fechasin);

                $state.go('nosensomatizadoup');
            };

            //Cual es el valor de cada termino de búsqueda
            $scope.consultar = function () {
                console.log($scope.termSearch);
                $scope.listarProdcutosNoSensomatizados();
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


            function getDateFromString(fechahora) {

                //separa el string 2015-07-05 00:00:00
                var anio = parseInt(fechahora.substr(0, 4));
                var mes = parseInt(fechahora.substr(5, 2)) - 1;
                var dia = parseInt(fechahora.substr(8, 2));

                var hora = parseInt(fechahora.substr(11, 2));
                var minuto = parseInt(fechahora.substr(14, 2));



                return new Date(anio, mes, dia, hora, minuto);

            }


            $scope.listarProdcutosNoSensomatizados();
        })
        .controller('verSensomatizadosController', function ($scope, $modalInstance, productoSelect) {

            $scope.productoSelect = productoSelect;

            $scope.cancel = function () {
                $modalInstance.dismiss('cancel');
            };

        });
