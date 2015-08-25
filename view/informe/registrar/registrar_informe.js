angular.module('odisea.informe.registrar',
    ['ui.router', 'ngAnimate', 'ngResource', 'ui.bootstrap', 'dialogs.main','textAngular'])
    .config(function config58($stateProvider) {
        $stateProvider.state('informe', {
            url: '/informe',
            views: {
                'main': {
                    templateUrl: 'view/informe/registrar/registrar_informe.html',
                    controller: 'informeController'
                }
            },
            data: {
                pageTitle: 'Registrar Informe'
            }
        });
    })
    .directive('validFile', function (){
        return {
            require: 'ngModel',
            link: function (scope, el, attrs, ngModel) {
                ngModel.$render = function () {
                    ngModel.$setViewValue(el.val());
                };

                el.bind('change', function () {
                    scope.$apply(function () {
                        ngModel.$render();
                    });
                });
            }
        };
    })
    .directive('fileModel', ['$parse', function ($parse) {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                var model = $parse(attrs.fileModel);
                var modelSetter = model.assign;

                element.bind('change', function () {
                    scope.$apply(function () {
                        modelSetter(scope, element[0].files[0]);
                    });
                });
            }
        };
    }])
    .directive('myUpload', [function () {
        return {
            restrict: 'A',
            link: function (scope, elem, attrs) {

                var reader = new FileReader();

                reader.onload = function (e) {
                    scope.image = e.target.result;
                    scope.$apply();
                };

                elem.on('change', function () {
                    reader.readAsDataURL(elem[0].files[0]);
                });
            }
        };
    }])

    .controller('informeController', function (utilFactory,$state, $rootScope, $window, $scope, $log, $http, $modal, $timeout, dialogs) {

        $scope.image = "view/imagen_no_sensomatizados/default.png";

        $scope.tab = {tab1: true, tab2: false, tab3: false};

        $scope.irPaso1 = function () {
            $scope.tab = {tab1: true, tab2: false, tab3: false};
        };

        $scope.irPaso2 = function () {
            $scope.tab = {tab1: false, tab2: true, tab3: false};
        };

        $scope.irPaso3 = function () {
            $scope.tab = {tab1: false, tab2: false, tab3: true};
        };

        $scope.isUpload = false;

        $scope.informe = {
            dni: '',
            nombres: '',
            cargo: '',
            asunto: '',
            redaccion: ''
        };

        $scope.buscarNombre = function () {
           /* $http.get('php/controller/SensomatizadoControllerGet.php', {
                params: {
                    accion: 'get_name_prevencionista_by_dni',
                    dni: $scope.sensomatizado.dniPrevencionista
                }
            }).success(function (data, status, headers, config) {
                $log.log(data);
                if (data.msj == 'OK') {
                    $scope.sensomatizado.nombrePrevencionista = data.nombre;
                } else {
                    $scope.sensomatizado.nombrePrevencionista = '';
                }
            }).error(function (data, status, headers, config) {
                console.log("Error");
            });*/
        };

        $scope.SaveAll = function () {

            var dlg = dialogs.confirm('Confirmar', 'DESEA REGISTRAR EL INFORME?');
            dlg.result.then(
                function (btn) {

                    $scope.isUpload = true;
                    var postData = {
                        accion: 'registrar',
                        data: {
                            informe: $scope.informe
                        }
                    };

                    dialogs.wait("Procesando...", "Registrando Informe", 100);
                    $rootScope.$broadcast('dialogs.wait.progress', {'progress': 100});

                    $http.post('php/controller/InformeControllerPost.php', postData)
                        .success(function (data) {
                            $log.log(data);
                            if (data.msj == 'OK') {
                                $scope.loadImage(data.id);
                            }else{
                                $rootScope.$broadcast('dialogs.wait.complete');
                                dialogs.error("Registro", "No se registro el Informe, " +
                                    "Verifique sus Datos o Conexion:");
                                $scope.isUpload = false;
                            }
                        })
                        .error(function (err) {
                            $rootScope.$broadcast('dialogs.wait.complete');
                            dialogs.error("ERROR SERVIDOR InformeControllerPost", data);
                        });
                },
                function (btn) {
                }
            );
        };

        $scope.loadImage = function (id) {
            var file = $scope.myFile;
            var fd = new FormData();
            fd.append('file', file);
            fd.append('nombre', id);

            $http.post('php/controller/InformeControllerLoad.php', fd, {
                headers: {'Content-Type': undefined}
            }).success(function (data) {
                $rootScope.$broadcast('dialogs.wait.complete');
                if(data.msj == 'OK'){
                    var noty = dialogs.notify("Mensaje", "INFORME REGISTRADO CON EXITO");
                    noty.result.then(function () {
                        $window.location.reload();
                    });
                }else{
                    var d_error = dialogs.error("Error Subir Imagen", "Informe Registrado pero no la Imagen:" +
                        data.info);
                    d_error.result.then(function () {
                        $window.location.reload();
                    });
                }
            }).error(function (data) {
                $rootScope.$broadcast('dialogs.wait.complete');
                dialogs.error("ERROR SERVIDOR InformeControllerLoad", data);
            });
        };

    });
