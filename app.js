angular.module('ngImeco', [
    'ui.router',
    'ui.bootstrap',
    'ngAnimate',
    'ngImeco.enlace',
    'ngImeco.slide',
    'ngImeco.intervenciones',
    'ngImeco.incidente'
])
        .config(function myAppConfig($stateProvider, $urlRouterProvider) {
            $urlRouterProvider.otherwise('/home');
        })

        .run(function run() {
        })

        .controller('ImecoController', function AppCtrl($scope, $location) {
            $scope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
                if (angular.isDefined(toState.data.pageTitle)) {
//                    console.info(toState);
                    $scope.estado = toState.name;
                    $scope.pageTitle = toState.data.pageTitle + ' | Odisea';
                }
            });
        })

