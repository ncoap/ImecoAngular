angular.module('odisea.intervencion.ejecutivo',
    ['ui.router', 'ngAnimate', 'ngResource', 'ui.bootstrap', 'dialogs.main', 'chart.js', 'checklist-model'])
    .config(function config8($stateProvider) {
        $stateProvider.state('ejecutivo', {
            url: '/ejecutivo',
            views: {
                'main': {
                    templateUrl: 'view/intervencion/reporte/ejecutivo.html',
                    controller: 'ejecutivoController'
                }
            },
            data: {
                pageTitle: 'Reporte Ejecutivo'
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
            $scope.$on('export-excel', function (e, d) {elm.tableExport({type: 'excel', escape: false});});
        };
        return {restrict: 'C', link: link}
    })
    .directive('exportTable1', function () {
        var link = function ($scope, elm, attr) {
            $scope.$on('export-excel-1', function (e, d) {elm.tableExport({type: 'excel', escape: false});});
        };
        return {restrict: 'C', link: link}
    })
    .directive('exportTable2', function () {
        var link = function ($scope, elm, attr) {
            $scope.$on('export-excel-2', function (e, d) {elm.tableExport({type: 'excel', escape: false});});
        };
        return {restrict: 'C', link: link}
    })
    .controller('ejecutivoController', function ($rootScope, $scope, $log, $http, dialogs) {

        $scope.pormeses = false;

        $scope.tienda = {
            idTienda: 1,
            nombreTienda: '(OECHSLE) Salaverry'
        };

        $scope.busqueda = {
            fecha: new Date(),
            opcion: '1',
            tipoFecha: 'ANUAL',
            horario: '00:00:00 23:59:59',
            sexo: ''
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
            $scope.recuperadoPorPrevencionista();
        };


        $scope.totalIntervenciones = 0;
        $scope.totalRecuperado = 0.0;

        $scope.allData = [];
        $scope.allData2 = [];
        $scope.tituloMes = "";
        $scope.tituloAnio = "";


        $scope.meses = [
            {id: 1, text: 'ENERO'},
            {id: 2, text: 'FEBRERO'},
            {id: 3, text: 'MARZO'},
            {id: 4, text: 'ABRIL'},
            {id: 5, text: 'MAYO'},
            {id: 6, text: 'JUNIO'},
            {id: 7, text: 'JULIO'},
            {id: 8, text: 'AGOSTO'},
            {id: 9, text: 'SEPTIEMBRE'},
            {id: 10, text: 'OCTUBRE'},
            {id: 11, text: 'NOVIEMBRE'},
            {id: 12, text: 'DICIEMBRE'}
        ];

        $scope.selectMeses = {
            meses: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
        };

        $scope.checkAll = function () {
            $scope.selectMeses.meses = $scope.meses.map(function (item) {
                return item.id;
            });
        };
        $scope.uncheckAll = function () {
            $scope.selectMeses.meses = [];
        };
        $scope.checkFirst = function () {
            var currentMonth = new Date().getMonth() + 1;
            $scope.selectMeses.meses.splice(0, $scope.selectMeses.meses.length);
            $scope.selectMeses.meses.push(currentMonth);
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

            if ($scope.busqueda.tipoFecha == 'ANUAL') {
                $scope.busqueda.opcion = '2';
                $scope.tituloMes = 'REPORTE EJECUTIVO ANUAL : AÑO';
                $scope.tituloAnio = $scope.busqueda.fecha.getFullYear();
                buscarDataAnual();

            } else if ($scope.busqueda.tipoFecha == 'POR MES') {
                $scope.busqueda.opcion = '1';
                $scope.tituloMes = 'REPORTE EJECUTIVO MENSUAL : ' + nombreMeses[$scope.busqueda.fecha.getMonth()];
                $scope.tituloAnio = $scope.busqueda.fecha.getFullYear();
                buscarDataAnual();
            } else {
                //POR MESES
                buscarDataMensual();
            }


        };


        function buscarDataAnual() {
            $http.get('php/controller/GraficasControllerGet.php', {
                params: {
                    accion: 'ejecutivo',
                    opcion: $scope.busqueda.opcion,
                    fecha: $scope.busqueda.fecha,
                    horaInicial: $scope.busqueda.horario.split(' ')[0],
                    horaFinal: $scope.busqueda.horario.split(' ')[1],
                    sexo: $scope.busqueda.sexo
                }
            })
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
        }


        $scope.superData = [];

        function buscarDataMensual() {

            if ($scope.selectMeses.meses.length > 0) {
                $scope.busqueda.opcion = '1';
                $scope.tituloMes = 'REPORTE EJECUTIVO POR MESES';
                $scope.tituloAnio = $scope.busqueda.fecha.getFullYear();

                dialogs.wait('Procesando...', '', 100);
                $rootScope.$broadcast('dialogs.wait.progress', {'progress': 08});

                $http.get('php/controller/GraficasControllerGet.php', {
                    params: {
                        accion: 'ejecutivo2',
                        opcion: $scope.busqueda.opcion,
                        fecha: $scope.busqueda.fecha,
                        horaInicial: $scope.busqueda.horario.split(' ')[0],
                        horaFinal: $scope.busqueda.horario.split(' ')[1],
                        sexo: $scope.busqueda.sexo,
                        meses: JSON.stringify($scope.selectMeses.meses)
                    }
                })
                    .success(function (data, status, headers, config) {
                        $rootScope.$broadcast('dialogs.wait.complete');
                        $log.info("DATA ALL MESES");
                        $log.info(data);
                        $scope.superData = data;

                    })
                    .error(function (data, status, headers, config) {
                        console.log("Error");
                    });
            } else {
                dialogs.notify("Selección", "Elija al Menos un Mes");
            }
        }


        function calcularTotales(data3) {
            var total1 = 0;
            var total2 = 0.0;

            angular.forEach(data3, function (item) {
                total1 = total1 + parseInt(item.intervenciones);
                total2 = total2 + parseFloat(item.recuperado);
            });

            $scope.totalIntervenciones = total1;
            $scope.totalRecuperado = total2;

        }


        //SEGUNDA BUSQUEDA
        //SEGUNDA BUSQUEDA
        //SEGUNDA BUSQUEDA
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
                        idtienda: idtienda,
                        opcion: $scope.busqueda.opcion,
                        fecha: $scope.busqueda.fecha,
                        horaInicial: $scope.busqueda.horario.split(' ')[0],
                        horaFinal: $scope.busqueda.horario.split(' ')[1],
                        sexo: $scope.busqueda.sexo
                    }
                }
            ).success(
                function (data, status, headers, config) {

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
                }
            ).error(
                function (data, status, headers, config) {
                    console.log("Error");
                }
            );

        };


        function calcularResumenPorHurtos(data) {

            var cant1 = 0;
            var cant2 = 0;
            var total1 = 0.0;
            var total2 = 0.0;
            $scope.data3 = [cant1, cant2];
            angular.forEach(data, function (detalle) {
                if (detalle.tipoHurto == 'INTERNO') {
                    cant1 = cant1 + parseInt(detalle.cantidadProducto);
                    total1 = total1 + parseFloat(detalle.totalProducto);
                } else {
                    //EXTERNO
                    cant2 = cant2 + parseInt(detalle.cantidadProducto);
                    total2 = total2 + parseFloat(detalle.totalProducto);
                }
            });
            total1 = Math.round(total1 * 100) / 100;
            total2 = Math.round(total2 * 100) / 100;
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


        $scope.exportAction = function(){
            $scope.$broadcast('export-excel', {});
        };

        $scope.exportAction1 = function(){
            $scope.$broadcast('export-excel-1', {});
        };

        $scope.exportAction2 = function(){
            $scope.$broadcast('export-excel-2', {});
        };

        $scope.buscarData();

    });
