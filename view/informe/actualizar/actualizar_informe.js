angular.module('odisea.informe.actualizar',
    ['ui.router', 'ngAnimate', 'ngResource', 'ui.bootstrap', 'dialogs.main'])
    .config(function config56($stateProvider) {
        $stateProvider.state('informeup', {
            url: '/informeup',
            views: {
                'main': {
                    templateUrl: 'view/informe/actualizar/actualizar_informe.html',
                    controller: 'informeupController'
                }
            },
            data: {
                pageTitle: 'Actualizar Informe'
            }
        });
    }).directive('validFile', function () {
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

    .controller('informeupController', function (utilFactory, $state, $rootScope, $window, $scope, $log, $http, $modal, $timeout, dialogs) {

        if ($rootScope.informeSeleccionado) {

            $scope.image = "view/imagen_informe/default.png";

            $scope.isNewImage = false;
            $scope.mirandom = Math.random();

            $scope.tab = {tab1: true, tab2: false, tab3: false};


            $scope.informe = $rootScope.informeSeleccionado.informe;

            $scope.irPaso1 = function () {
                $scope.tab = {tab1: true, tab2: false, tab3: false};
            };

            $scope.irPaso2 = function () {
                $scope.tab = {tab1: false, tab2: true, tab3: false};
            };

            $scope.irPaso3 = function () {
                $scope.tab = {tab1: false, tab2: false, tab3: true};
            };

            $scope.isSaved = false;

            $scope.buscarNombre = function () {
                $http.get('php/controller/InformeControllerGet.php', {
                    params: {
                        accion: 'get_name',
                        dni: $scope.informe.dni
                    }
                }).success(function (data) {
                    $log.log(data);
                    if (data.msj == 'OK') {
                        $scope.informe.nombres = data.nombre;
                    } else {
                        $scope.informe.nombres = '';
                    }
                }).error(function (data) {
                    console.log("Error buscar nombres");
                });
            };

            $scope.SaveAll = function () {

                var dlg = dialogs.confirm('Confirmar', 'DESEA ACTUALIZAR EL INFORME?');
                dlg.result.then(
                    function (btn) {
                        if ($scope.isNewImage) {
                            if (!$scope.myFile) {
                                alert("Cargue una foto o deseleccione la opción");
                            } else {
                                $scope.update();
                            }
                        } else {
                            $scope.update();
                        }
                    },
                    function (btn) {
                    }
                );
            };

            $scope.update = function(){
                $scope.isUpload = true;

                var postData = {
                    accion: 'actualizar',
                    data: {
                        informe: $scope.informe
                    }
                };
                dialogs.wait("Procesando...", "Actualizando Informe", 100);
                $rootScope.$broadcast('dialogs.wait.progress', {'progress': 100});
                $http.post('php/controller/InformeControllerPost.php', postData)
                    .success(function (data) {
                        $rootScope.$broadcast('dialogs.wait.complete');
                        if (data.msj == 'OK') {
                            if ($scope.isNewImage) {
                                $scope.loadImage($scope.informe.id);
                            } else {
                                var noty = dialogs.notify("Mensaje", "INFORME ACTUALIZADO CON EXITO");
                                noty.result.then(function () {
                                    $window.location.reload();
                                });
                            }
                        }else{
                            dialogs.error("Actualizacion", "No se actualizo el Informe, " +
                                "Verifique sus Datos:");
                            $log.log(data.error);
                            $scope.isUpload = false;
                        }
                    })
                    .error(function (data) {
                        $rootScope.$broadcast('dialogs.wait.complete');
                        dialogs.error("ERROR SERVIDOR InformeControllerPost", data);
                    });
            };

            $scope.loadImage = function (id) {

                var file = $scope.myFile;
                var fd = new FormData();
                fd.append('file', file);
                fd.append('nombre', id);

                $http.post('php/controller/InformeControllerLoad.php', fd, {
                    headers: {'Content-Type': undefined}
                }).success(function (data, status, headers, config) {
                    $rootScope.$broadcast('dialogs.wait.complete');
                    if (data.msj == 'OK') {
                        var noty = dialogs.notify("Mensaje", "INFORME ACTUALIZADO CON EXITO");
                        noty.result.then(function () {

                            $window.location.reload();

                        });
                    } else {
                        var d_error = dialogs.error("Error Subir Imagen", "Informe Actualizado, pero no la Imagen:" +
                            data.info);
                        d_error.result.then(function () {

                            $window.location.reload();

                        });
                    }
                }).error(function (err, status, headers, config) {
                    $rootScope.$broadcast('dialogs.wait.complete');
                    dialogs.error("ERROR SERVIDOR", data);
                });
            };
        }else{
            $state.go('informes');
        }
    });

