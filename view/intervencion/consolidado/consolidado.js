angular.module('odisea.intervencion.consolidado',
        ['ui.router', 'ngAnimate', 'ngResource', 'ui.bootstrap', 'chart.js'])
        .config(function config8($stateProvider) {
            $stateProvider.state('consolidado', {
                url: '/consolidado',
                views: {
                    'main': {
                        templateUrl: 'view/intervencion/consolidado/consolidado.html',
                        controller: 'consolidadoController'
                    }
                },
                data: {
                    pageTitle: 'Consolidado Intervenciones'
                }
            });
        })
        .config(['ChartJsProvider', function (ChartJsProvider) {
                // Configure all charts
                ChartJsProvider.setOptions({
                    colours: ['#dc3912', '#3366cc'],
                    responsive: true
                });
                // Configure all line charts
                ChartJsProvider.setOptions('Bar', {
                    datasetFill: false
                });
            }])
        .controller('consolidadoController', function ($scope, $log, $http) {

            $scope.total = {
                cantidadInternos: 0,
                cantidadExternos: 0,
                totalInternos: 0,
                totalExternos: 0
            };

            $scope.tab = {
                tab1: true,
                tab2: false,
                tab3: false,
                tab4: false
            };

            $scope.showTab1 = function () {

                $scope.tab = {tab1: true, tab2: false, tab3: false, tab4: false};
                $scope.buscarData();
            };
            $scope.showTab2 = function () {
                
                $scope.tab = {tab1: false, tab2: true, tab3: false, tab4: false};
            };
            $scope.showTab3 = function () {

                $scope.tab = {tab1: false, tab2: false, tab3: true, tab4: false};
                $scope.recuperadoPorPrevencionista();
            };
            $scope.showTab4 = function () {
                $scope.tab = {tab1: false, tab2: false, tab3: false, tab4: true};
            };


            $scope.totalIntervenciones = 0;
            $scope.totalRecuperado = 0.0;

            $scope.allData = [];
            $scope.allData2 = [];
            $scope.fechaBusqueda = new Date();
            $scope.tituloMes = "";
            $scope.tituloAnio = "";
            $scope.tienda = {
                idTienda: 1,
                nombreTienda: '(OECHSLE) Salaverry'
            };


            var nombreMeses = ["ENERO", "FEBRERO", "MARZO", "ABRIL", "MAYO", "JUNIO",
                "JULIO", "AGOSTO", "SEPTIEMBRE", "OCTUBRE", "NOVIEMBRE", "DICIEMBRE"
            ];


            $scope.series = ['n° Intervenciones', 'Total Recuperado S/'];
            $scope.labels = [];
            $scope.data = [
                [],
                []
            ];


            $scope.series2 = ['Cantidades', 'Total S/'];
            $scope.labels2 = [];
            $scope.data2 = [
                [],
                []
            ];

            $scope.series3 = ['CANTIDAD', 'TOTAL'];
            $scope.labels3 = [];
            $scope.data3 = [
                [],
                []
            ];

            //PETICION AL SERVER
            $scope.buscarData = function () {

                $scope.tituloMes = nombreMeses[$scope.fechaBusqueda.getMonth()];
                $scope.tituloAnio = $scope.fechaBusqueda.getFullYear();

                $http.get('php/controller/GraficasControllerGet.php', {
                    params: {
                        accion: 'consolidados',
                        fecha: $scope.fechaBusqueda
                    }})
                        .success(function (data, status, headers, config) {

                            $log.info("HOLDA", data);
                            $scope.allData = data[3];
                            $scope.labels = data[0];
                            $scope.data[0] = data[1];
                            $scope.data[1] = data[2];

                            calcularTotales(data[3]);

                        })
                        .error(function (data, status, headers, config) {
                            console.log("Error");
                        });
            };



            //SEGUNTA BUSUQUEDA
            $scope.recuperadoPorPrevencionista = function () {
                var idtienda = 1;

                if (!$scope.tienda) {

                    //sino esta definido
                    idtienda = 0;

                } else {

                    idtienda = $scope.tienda.idTienda;

                }

                $http.get('php/controller/GraficasControllerGet.php',
                        {
                            params: {
                                accion: 'recuperos_por_prevencionista',
                                fecha: $scope.fechaBusqueda,
                                idtienda: idtienda
                            }
                        }
                ).success(function (data, status, headers, config) {

                    $log.info("RECUPEROS ", data);

                    if (data[0].length === 0) {
                        $scope.labels2 = ['1'];
                        $scope.data2[0] = data[1];
                        $scope.data2[1] = data[2];
                        $scope.allData2 = data[3];
                    } else {

                        $scope.labels2 = data[0];
                        $scope.data2[0] = data[1];
                        $scope.data2[1] = data[2];
                        $scope.allData2 = data[3];
                    }

                    calcularResumenPorHurtos($scope.allData2);


                }).error(function (data, status, headers, config) {
                    console.log("Error");
                });

            };

            function calcularTotales(data3) {
                var total1 = 0;
                var total2 = 0.0;

                angular.forEach(data3, function (item) {
                    total1 = total1 + item.intervenciones;
                    total2 = total2 + item.recuperado;
                });

                $scope.totalIntervenciones = total1;
                $scope.totalRecuperado = total2;

            }

            /*
             $scope.total = {
             cantidadInternos: 0,
             cantidadExternos: 0,
             totalInternos: 0,
             totalExternos: 0
             };
             */

            function calcularResumenPorHurtos(data) {

                var cant1 = 0;
                var cant2 = 0;
                var total1 = 0.0;
                var total2 = 0.0;

                $scope.data3 = [cant1, cant2];

                angular.forEach(data, function (detalle) {

                    if (detalle.tipoHurto == 'INTERNO') {
                        cant1 = cant1 + detalle.cantidadProducto;
                        total1 = total1 + detalle.totalProducto;
                    } else {
                        //EXTERNO
                        cant2 = cant2 + detalle.cantidadProducto;
                        total2 = total2 + detalle.totalProducto;
                    }
                });

                $scope.total = {
                    cantidadInternos: cant1,
                    cantidadExternos: cant2,
                    totalInternos: total1,
                    totalExternos: total2
                };

                $scope.labels3 = ['INTERNO', 'EXTERNO'];
                $scope.data3[0] = [cant1, cant2];
                $scope.data3[1] = [total1, total2];

            }

            $scope.buscarData();

        });
