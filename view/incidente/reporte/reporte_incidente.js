angular.module('odisea.incidente.grafincidente',
    ['ui.router', 'ngAnimate', 'ngResource', 'ui.bootstrap', 'dialogs.main', 'chart.js', 'checklist-model'])
    .config(function config8($stateProvider) {
        $stateProvider.state('grafincidente', {
            url: '/grafincidente',
            views: {
                'main': {
                    templateUrl: 'view/incidente/reporte/reporte_incidente.html',
                    controller: 'grafincidenteController'
                }
            },
            data: {
                pageTitle: 'Graficas Incidente/Accidente'
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
    .directive('exportTable', function () {
        var link = function ($scope, elm, attr) {
            $scope.$on('export-excel', function (e, d) {elm.tableExport({type: 'excel', escape: false});});};
        return {restrict: 'C', link: link}
    })
    .directive('exportTable1', function () {
        var link = function ($scope, elm, attr) {
            $scope.$on('export-excel-1', function (e, d) {elm.tableExport({type: 'excel', escape: false});});};
        return {restrict: 'C', link: link}
    })
    .directive('exportTable2', function () {
        var link = function ($scope, elm, attr) {
            $scope.$on('export-excel-2', function (e, d) {elm.tableExport({type: 'excel', escape: false});});};
        return {restrict: 'C', link: link}
    })
    .directive('exportTable3', function () {
        var link = function ($scope, elm, attr) {
            $scope.$on('export-excel-3', function (e, d) {elm.tableExport({type: 'excel', escape: false});});};
        return {restrict: 'C', link: link}
    })
    .directive('exportTable4', function () {
        var link = function ($scope, elm, attr) {
            $scope.$on('export-excel-4', function (e, d) {elm.tableExport({type: 'excel', escape: false});});};
        return {restrict: 'C', link: link}
    })
    .controller('grafincidenteController', function ($rootScope, $scope, $log, $http, dialogs) {
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

        $scope.seriesConsolidado = ['n° Accidentes', 'n° Incidentes'];
        $scope.labelsConsolidado = [];
        $scope.dataConsolidado = [
            [],
            []
        ];

        $scope.data = {
            cabaccidente : [],
            detaccidente : [],
            cabincidente : [],
            detincidente : []
        };

        $scope.dataCabecera = [];
        $scope.dataDetalle = [];

        $scope.buscarData = function () {
            if ($scope.busqueda.tipoFecha == 'ANUAL') {
                $scope.busqueda.opcion = '2';
                $scope.tituloMes = 'REPORTE ANUAL : AÑO';
                $scope.tituloAnio = $scope.busqueda.fecha.getFullYear();
                buscarDataAnual();

            } else {
                $scope.busqueda.opcion = '1';
                $scope.tituloMes = 'REPORTE MENSUAL : ' + nombreMeses[$scope.busqueda.fecha.getMonth()];
                $scope.tituloAnio = $scope.busqueda.fecha.getFullYear();
                buscarDataAnual();
            }
        };

        function buscarDataAnual() {
            $http.get('php/controller/GraficasControllerGet.php', {
                params: {
                    accion: 'reporte_incidente',
                    opcion: $scope.busqueda.opcion,
                    fecha: $scope.busqueda.fecha,
                    horaInicial: $scope.busqueda.horario.split(' ')[0],
                    horaFinal: $scope.busqueda.horario.split(' ')[1]
                }
            })
                .success(function (data) {
                    $log.info("HOLDA", data);
                    $scope.dataAllConsolidado = data[3];
                    $scope.labelsConsolidado = data[0];
                    $scope.dataConsolidado[0] = data[1];
                    $scope.dataConsolidado[1] = data[2];
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
                total1 = total1 + parseInt(item.accidentes);
                total2 = total2 + parseInt(item.incidentes);
            });

            $scope.totalAccidentes = total1;
            $scope.totalIncidentes = total2;
        }

        //SEGUNDA BUSQUEDA
        $scope.buscarDataDetalle = function () {

            $http.get('php/controller/GraficasControllerGet.php', {
                params: {
                    accion: 'reporte_det_incidente',
                    idtienda: $scope.tienda.idTienda,
                    opcion: $scope.busqueda.opcion,
                    fecha: $scope.busqueda.fecha,
                    horaInicial: $scope.busqueda.horario.split(' ')[0],
                    horaFinal: $scope.busqueda.horario.split(' ')[1]
                }
            }).success(function (data) {
                $log.info("RECUPEROS ", data);
                $scope.data.cabaccidente = data[0];
                $scope.data.detaccidente = data[1];
                $scope.data.cabincidente = data[2];
                $scope.data.detincidente = data[3];
            }).error(
                function (data) {
                    console.log("Error");
                }
            );
        };


        $scope.exportAction = function(){
            $scope.$broadcast('export-excel', {});
        };

        $scope.exportAction1 = function(){
            $scope.$broadcast('export-excel-1', {});
        };

        $scope.exportAction2 = function(){
            $scope.$broadcast('export-excel-2', {});
        };

        $scope.exportAction3 = function(){
            $scope.$broadcast('export-excel-3', {});
        };

        $scope.exportAction4 = function(){
            $scope.$broadcast('export-excel-4', {});
        };

        $scope.buscarData();
    });
