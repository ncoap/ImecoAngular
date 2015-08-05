angular.module('ngOdisea', [
    'ui.router',
    'ui.bootstrap',
    'ngAnimate',
    'checklist-model',
    'odisea.home',
    'odisea.operatividad',
    'odisea.intervencion.registrar',
    'odisea.sensomatizado.registrar',
    'odisea.incidente.registrar'
])
    .config(function myAppConfig($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise('/home');
    })
    .factory("utilFactory", function () {
        return {
            nombreApp: 'Variables Globales',
            getDateTimeFromString: function (dateTimeString) {
                //2015-07-05 17:24:32
                var anio = parseInt(dateTimeString.substr(0, 4));
                var mes = parseInt(dateTimeString.substr(5, 2)) - 1;
                var dia = parseInt(dateTimeString.substr(8, 2));
                var hora = parseInt(dateTimeString.substr(11, 2));
                var minuto = parseInt(dateTimeString.substr(14, 2));
                return new Date(anio, mes, dia, hora, minuto);
            },
            getDateFromString: function (dateString) {
                //2015-05-02
                var separate = dateString.split('-');
                return new Date(separate[0], separate[1] - 1, separate[2]);
            },
            getDateActual: function () {
                //para el correcto formato de input type datime-local
                var today = new Date();
                var dia = (today.getDate() < 10) ? '0' + today.getDate() : today.getDate();
                var m = today.getMonth();
                var mes = (m < 10) ? '0' + m : m;
                var p_hora = today.getHours();
                var hora = (p_hora < 10) ? '0' + p_hora : p_hora;
                var p_minuto = today.getMinutes();
                var minuto = (p_minuto < 10) ? '0' + p_minuto : p_minuto;
                return new Date(today.getFullYear(), mes, dia, hora, minuto);
            },
            dateDefault :  {
                ini: new Date(2015, 0, 1)
            }
        }
    })
    .run(function run(editableOptions) {
        editableOptions.theme = 'bs3';
    })

    .controller('OdiseaController', function AppCtrl($state, $http, $log, $scope, $rootScope) {

        $http.get('php/controller/TiendaControllerGet.php', {
            params: {
                accion: 'listar'
            }
        }).success(function (data) {
            if(data.msj != 'KK'){
                $scope.tiendas = data.tiendas;
                $scope.productos = data.productos;
            }else{
                alert("ERROR DE CONEXION A LA BASE DE DATOS");
            }
        }).error(function (data) {
            console.log("Error");
        });

        $scope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {

            if (angular.isDefined(toState.data.pageTitle)) {
                $scope.pageTitle = toState.data.pageTitle + ' | Odisea';
            }
        });
    });
