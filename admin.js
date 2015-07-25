angular.module('ngOdisea', [
    'ui.router',
    'ui.bootstrap',
    'ngAnimate',
    'odisea.home',
    'odisea.intervencion.registrar',
    'odisea.intervencion.listar',
    'odisea.intervencion.actualizar',
    'odisea.intervencion.consolidado',
    'odisea.intervencion.ejecutivo',
    'odisea.sensomatizado.registrar',
    'odisea.sensomatizado.listar',
    'odisea.sensomatizado.actualizar'
])
        .config(function myAppConfig($stateProvider, $urlRouterProvider) {
            $urlRouterProvider.otherwise('/home');
        })

        .run(function run() {
        })

        .controller('OdiseaController', function AppCtrl($state, $http, $log, $scope, $rootScope, $location) {

            $http.get('php/controller/TiendaControllerGet.php', {
                params: {
                    accion: 'listar'
                }
            }).success(function (data, status, headers, config) {
                $scope.tiendas = data;

            }).error(function (data, status, headers, config) {
                console.log("Error");
            });

            $scope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {

                if (toState.name === 'nosensomatizadoup') {

                    if ($rootScope.producto) {
                        
                    } else {
                        event.preventDefault();
                        $state.go('nosensomatizados');
                    }

                }
                
                if (toState.name === 'intervencionup') {

                    if ($rootScope.intervencionSeleccionada) {
                        
                    } else {
                        event.preventDefault();
                        $state.go('intervenciones');
                    }

                }

                if (angular.isDefined(toState.data.pageTitle)) {
                    $scope.pageTitle = toState.data.pageTitle + ' | Odisea';
                }

            });

        });
