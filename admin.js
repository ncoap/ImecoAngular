angular.module('ngOdisea', [
    'ui.router',
    'ui.bootstrap',
    'ngAnimate',
    'checklist-model',
    'ngCookies',
    'odisea.home',
    'odisea.operatividad',
    'odisea.operatividad.grafoperatividad',
    'odisea.intervencion.registrar',
    'odisea.intervencion.listar',
    'odisea.intervencion.actualizar',
    'odisea.intervencion.consolidado',
    'odisea.intervencion.ejecutivo',
    'odisea.sensomatizado.registrar',
    'odisea.sensomatizado.listar',
    'odisea.sensomatizado.actualizar',
    'odisea.sensomatizado.grafsensomatizado',
    'odisea.informe.registrar',
    'odisea.informe.listar',
    'odisea.informe.actualizar',
    'odisea.incidente.listar',
    'odisea.incidente.registrar',
    'odisea.incidente.actualizar',
    'odisea.incidente.grafincidente'
])
    .config(function myAppConfig($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise('/home');
    })
    .factory("utilFactory", function ($cookieStore) {
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
            },
            getRol : function () {
                return $cookieStore.get('rol') || false;
            },
            removeRol : function() {
                $cookieStore.remove('rol');
            }
        }
    })
    .run(function run(editableOptions) {
        editableOptions.theme = 'bs3';
    })

    .controller('OdiseaController', function AppCtrl($state, $http, $log, $scope, $rootScope,utilFactory) {

        if(utilFactory.getRol()) {

            $scope.rol = utilFactory.getRol();
            //acceso total
            //solo registro
            //visualizacion y reportes
            //solo visualizacion
            $scope.urls = {
                'ADMINISTRADOR' : ['home','intervencion', 'intervencionup', 'intervenciones', 'consolidado', 'ejecutivo', 'incidente', 'incidenteup', 'incidentes', 'grafincidente', 'operatividad', 'grafoperatividad', 'nosensomatizado', 'nosensomatizadoup', 'nosensomatizados', 'grafsensomatizado','informe','informes','informeup'],
                'JEFE DE ODISEA' : ['home','intervencion', 'incidente', 'nosensomatizado','informe'],
                'GERENTE DE PREVENCION' : ['home','intervenciones', 'consolidado', 'ejecutivo', 'incidentes', 'grafincidente', 'grafoperatividad', 'nosensomatizados', 'grafsensomatizado','informes'],
                'JEFE DE PREVENCION' : ['home','intervenciones', 'incidentes', 'nosensomatizados','informes']
            };

            $scope.permisos = {
                admin : function(){
                    return ['ADMINISTRADOR'].indexOf($scope.rol)!=-1;
                },
                odisea : function(){
                    return ['JEFE DE ODISEA'].indexOf($scope.rol)!=-1;
                },
                admin_odisea : function(){
                    return  ['ADMINISTRADOR','JEFE DE ODISEA'].indexOf($scope.rol)!=-1;
                },
                gerente : function(){
                    return ['GERENTE DE PREVENCION'].indexOf($scope.rol)!=-1;
                },
                admin_gerente : function(){
                    return  ['ADMINISTRADOR','GERENTE DE PREVENCION'].indexOf($scope.rol)!=-1;
                },
                jefe : function(){
                    return ['JEFE DE PREVENCION'].indexOf($scope.rol)!=-1;
                }
            };

            $scope.logout = function(){
                utilFactory.removeRol();
                window.location.href = "index.html";
            };

            $http.get('php/controller/TiendaControllerGet.php', {
                params: {
                    accion: 'listar'
                }
            }).success(function (data) {
                if (data.msj != 'KK') {
                    $scope.tiendas = data.tiendas;
                    $scope.productos = data.productos;
                } else {
                    alert("ERROR DE CONEXION A LA BASE DE DATOS");
                }
            }).error(function (data) {
                console.log("Error al cargar las tiendas y productos");
            });

            $scope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
                if($scope.urls[$scope.rol].indexOf(toState.name)!=-1){
                    //si tiene los permisos que continue
                }else{
                    //si no los tiene que los redirija al HOME
                    event.preventDefault();
                    $state.go('home');
                }

                if (angular.isDefined(toState.data.pageTitle)) {
                    $scope.pageTitle = toState.data.pageTitle + ' | Odisea';
                }
            });
        }else{
            window.location.href = "index.html";
        }
    });
