angular.module('odisea.sensomatizado.grafsensomatizado',
    ['ui.router', 'ngAnimate', 'ngResource', 'ui.bootstrap', 'dialogs.main', 'chart.js', 'checklist-model'])
    .config(function config8($stateProvider) {
        $stateProvider.state('grafsensomatizado', {
            url: '/grafsensomatizado',
            views: {
                'main': {
                    templateUrl: 'view/sensomatizado/reporte/reporte_sensomatizado.html',
                    controller: 'grafsensomatizadoController'
                }
            },
            data: {
                pageTitle: 'Graficas No Sensomatizados'
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
    .controller('grafsensomatizadoController', function ($rootScope, $scope, $log, $http, dialogs) {

        $scope.busqueda = {
            fecha: new Date(),
            opcion: '1',
            tipoFecha: 'ANUAL',
            horario: '00:00:00 23:59:59'
        };

        $scope.total = {
            cantidadInternos: 0,
            cantidadExternos: 0,
            totalInternos: 0,
            totalExternos: 0
        };

        $scope.tab = {
            tab1: true,
            tab2: false
        };

        $scope.showTab1 = function () {

            $scope.tab = {tab1: true, tab2: false};
            $scope.buscarData();
        };
        $scope.showTab2 = function () {

            $scope.tab = {tab1: false, tab2: true};
            $scope.buscarDataDetalle();
        };


        $scope.totalAccidentes = 0;
        $scope.totalIncidentes = 0.0;

        $scope.dataAllConsolidado = [];
        $scope.dataAllDetalle = [];

        $scope.tituloMes = "";
        $scope.tituloAnio = "";

        $scope.tienda = {
            idTienda: 1,
            nombreTienda: '(OECHSLE) Salaverry'
        };


        var nombreMeses = ["ENERO", "FEBRERO", "MARZO", "ABRIL", "MAYO", "JUNIO",
            "JULIO", "AGOSTO", "SEPTIEMBRE", "OCTUBRE", "NOVIEMBRE", "DICIEMBRE"
        ];
        
        $scope.seriesConsolidadoCantidad = ['CANTIDADES'];
        $scope.labelsConsolidadoCantidad = [];
        $scope.coloursConsolidadoCantidad = ['#3366cc','#dc3912'];
        $scope.dataConsolidadoCantidad = [
            []
        ];
        $scope.seriesConsolidadoMonto = ['MONTO TOTAL'];
        $scope.labelsConsolidadoMonto = [];
        $scope.dataConsolidadoMonto = [
            []
        ];



        $scope.seriesDetalle = ['Cantidades', 'Total S/'];
        $scope.labelsDetalle = [];
        $scope.dataDetalle = [
            [],
            []
        ];

        $scope.seriesPorTipo = ['ACCIDENTE', 'INCIDENTE'];
        $scope.labelsPorTipo = [];
        $scope.dataPorTipo = [
            [],
            []
        ];

        //PETICION AL SERVER
        $scope.buscarData = function () {
            if ($scope.busqueda.tipoFecha == 'ANUAL') {
                $scope.busqueda.opcion = '2';
                $scope.tituloMes = 'REPORTE ANUAL : AÑO';
                $scope.tituloAnio = $scope.busqueda.fecha.getFullYear();
                buscarDataAnual();

            } else if ($scope.busqueda.tipoFecha == 'POR MES'){

                $scope.busqueda.opcion = '1';
                $scope.tituloMes = 'REPORTE MENSUAL : ' + nombreMeses[$scope.busqueda.fecha.getMonth()];
                $scope.tituloAnio = $scope.busqueda.fecha.getFullYear();
                buscarDataAnual();
            } 
        };

        function buscarDataAnual() {
            $http.get('php/controller/GraficasControllerGet.php', {
                params: {
                    accion: 'reporte_main_sensomatizado',
                    opcion: $scope.busqueda.opcion,
                    fecha: $scope.busqueda.fecha,
                    horaInicial: $scope.busqueda.horario.split(' ')[0],
                    horaFinal: $scope.busqueda.horario.split(' ')[1]
                }
            })
                .success(function (data) {
                    $log.info("HOLDA", data);

                    $scope.dataAllConsolidado = data[3];
                    $scope.labelsConsolidadoMonto = data[0];
                    $scope.labelsConsolidadoCantidad = data[0];
                    $scope.dataConsolidadoCantidad[0] = data[1];
                    $scope.dataConsolidadoMonto[0] = data[2];

                    calcularTotales(data[3]);
                })
                .error(function (data) {
                    console.log("Error");
                });
        }

        function calcularTotales(dataPorTipo) {

            var total1 = 0;
            var total2 = 0.0;
            angular.forEach(dataPorTipo, function (item) {
                total1 = total1 + parseInt(item.sensomatizado);
                total2 = total2 + parseFloat(item.total);
            });
            $scope.totalAccidentes = total1;
            $scope.totalIncidentes = total2;
        }

        //SEGUNDA BUSQUEDA
        $scope.buscarDataDetalle = function () {
            var idtienda = 1;
            if (!$scope.tienda) {
                //sino esta definido
                idtienda = 0;
            } else {
                idtienda = $scope.tienda.idTienda;
            }
            $http.get('php/controller/GraficasControllerGet.php', {
                    params: {
                        accion: 'reporte_det_sensomatizado',
                        idtienda: idtienda,
                        opcion: $scope.busqueda.opcion,
                        fecha: $scope.busqueda.fecha,
                        horaInicial: $scope.busqueda.horario.split(' ')[0],
                        horaFinal: $scope.busqueda.horario.split(' ')[1]
                    }
                }
            ).success(function (data) {

                    $log.log("DETALLE",data);

                    if (data[0].length === 0) {
                        $scope.labelsDetalle= ['1'];
                        $scope.dataDetalle[0] = data[1];
                        $scope.dataDetalle[1] = data[2];
                        $scope.dataAllDetalle = data[3];
                    } else {
                        $scope.labelsDetalle = data[0];
                        $scope.dataDetalle[0] = data[1];
                        $scope.dataDetalle[1] = data[2];
                        $scope.dataAllDetalle = data[3];
                    }
                    calcularResumenDetalle(data[3]);
                }
            ).error(function (data) {
                    console.log("Error");
                }
            );
        };

        function calcularResumenDetalle(data) {

            $log.log("calcularResumenDetalle ",data);
            var cant1 = 0;
            var cant2 = 0;

            angular.forEach(data, function(item) {
                cant1 = cant1 + parseInt(item.cantidadProducto);
                cant2 = cant2 + parseFloat(item.totalProducto);
            });

            $scope.total = {
                cantidadAccidentes: cant1,
                cantidadIncidentes: cant2
            };
        }

        $scope.buscarData();
    });
