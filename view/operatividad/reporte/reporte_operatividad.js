angular.module('odisea.operatividad.grafoperatividad',
    ['ui.router', 'ngAnimate', 'ngResource', 'ui.bootstrap', 'dialogs.main', 'chart.js', 'checklist-model'])
    .config(function config80($stateProvider) {
        $stateProvider.state('grafoperatividad', {
            url: '/grafoperatividad',
            views: {
                'main': {
                    templateUrl: 'view/operatividad/reporte/reporte_operatividad.html',
                    controller: 'grafoperatividadController'
                }
            },
            data: {
                pageTitle: 'Graficas Operatividad'
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
    .controller('grafoperatividadController', function ($rootScope, $scope, $log, $http, dialogs) {

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

        $scope.producto = {
            idProducto: 1,
            nombreProducto: 'ANTENAS AM'
        };


        $scope.dataAllReuIno = [];
        $scope.seriesReuIno = ['# Reubicacion','# Inoperativos'];
        $scope.labelsReuIno = [];
        $scope.dataReuIno = [
            [],
            []
        ];

        $scope.total={
            reubicados:0,
            inoperativos:0
        };

        $scope.dataAll = [];

        $scope.buscarData = function () {
            $http.get('php/controller/GraficasControllerGet.php', {
                params: {
                    accion: 'chart_operatividad',
                    idproducto : $scope.producto.idProducto
                }
            })
                .success(function (data) {
                    $log.info("GRAFICAS CONTROLLER", data);
                    $scope.labelsReuIno = data[0];
                    $scope.dataReuIno[0] = data[1];
                    $scope.dataReuIno[1] = data[2];
                    $scope.dataAllReuIno = data[3];

                    calcularTotales(data[3]);
                })
                .error(function (data) {
                    console.log("Error");
                });
        };

        function calcularTotales(data) {
            var total1 = 0;
            var total2 = 0.0;
            angular.forEach(data, function (item) {
                total1 = total1 + parseInt(item.reubicados);
                total2 = total2 + parseInt(item.inoperativo);
            });
            $scope.total.reubicados = total1;
            $scope.total.inoperativos = total2;
        }


        $scope.buscarDataDetalle = function () {
            $http.get('php/controller/GraficasControllerGet.php', {
                    params: {
                        accion: 'chart_det_operatividad'
                    }
                }
            ).success(function (data) {
                   $log.log(data);
                    $scope.dataAll = data;
                }).error(function (data) {
                    console.log("Error");
                }
            );
        };
        $scope.buscarData();
    });
