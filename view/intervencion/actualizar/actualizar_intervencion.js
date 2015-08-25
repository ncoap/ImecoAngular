angular.module('odisea.intervencion.actualizar',
    ['ui.router', 'ngAnimate', 'ngResource', 'ui.bootstrap', 'dialogs.main'])
    .config(function config11($stateProvider) {
        $stateProvider.state('intervencionup', {
            url: '/intervencionup',
            views: {
                main: {
                    templateUrl: 'view/intervencion/actualizar/actualizar_intervencion.html',
                    controller: 'intervencionupController'
                }
            },
            data: {
                pageTitle: 'Actualizar Intervención'
            }
        });
    })
    .directive('errSrc', function () {
        return {
            link: function (scope, element, attrs) {
                scope.$watch(function () {
                    return attrs['ngSrc'];
                }, function (value) {
                    if (!value) {
                        element.attr('src', attrs.errSrc);
                    }
                });

                element.bind('error', function () {
                    element.attr('src', attrs.errSrc);
                });
            }
        };
    })
    .directive('validFile', function () {
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
    .controller('intervencionupController', function (utilFactory, $rootScope, $state, $window, $scope, $log, $http, $modal, $timeout, dialogs) {

        if ($rootScope.intervencionSeleccionada) {

            $scope.image = 'view/imagen_tendero/default.jpg';

            $scope.mirandom = Math.random();

            $scope.isUpload = false;
            $scope.isNewImage = false;

            $log.log($rootScope.intervencionSeleccionada);

            //guardamos el dni inicial para saber si modificamos el DNI
            //SI LO MODIFICO LO VALIDAMOS
            var dni_inicial = $rootScope.intervencionSeleccionada.tendero.dniTendero;
            $scope.tendero = $rootScope.intervencionSeleccionada.tendero;
            $scope.intervencion = $rootScope.intervencionSeleccionada.intervencion;
            $scope.productos = $rootScope.intervencionSeleccionada.productos;


            //Visibilidad de los tabs
            $scope.showTab = {
                tab1: true,
                tab2: false,
                tab3: false
            };

            $scope.irPaso1 = function () {
                $scope.showTab = {
                    tab1: true,
                    tab2: false,
                    tab3: false
                };
            };

            $scope.irPaso2 = function () {
                $scope.showTab = {
                    tab1: false,
                    tab2: true,
                    tab3: false
                };
            };

            $scope.irPaso3 = function () {
                $scope.showTab = {
                    tab1: false,
                    tab2: false,
                    tab3: true
                };
            };


            $scope.producto = {
                codigo: '',
                descripcion: '',
                marca: '',
                cantidad: 0,
                precio: 0.0
            };

            $scope.addProduct = function () {

                var producto = angular.copy($scope.producto);
                $scope.productos.push(producto);
                calcularTotalRecuperado();
                $scope.producto = {
                    codigo: '', descripcion: '', marca: '', cantidad: 0, precio: 0.0
                };
            };

            $scope.removeProduct = function (indice) {
                $scope.productos.splice(indice, 1);
                calcularTotalRecuperado();
            };

            function calcularTotalRecuperado() {
                var total = 0.0;

                angular.forEach($scope.productos, function (item) {
                    total = total + item.cantidad * item.precio;
                });

                $scope.intervencion.totalRecuperado = total;
            }

            function updateTendero() {
                var postData = {
                    accion: 'actualizar',
                    tendero: $scope.tendero
                };
                var dlg = dialogs.wait(undefined, undefined, 100);
                $rootScope.$broadcast('dialogs.wait.progress', {'progress': 100});

                $http.post('php/controller/TenderoControllerPost.php', postData)
                    .success(function (data) {
                        if (data.msj == 'OK') {
                            updateIntervencion();
                        } else {
                            $rootScope.$broadcast('dialogs.wait.complete');
                            dialogs.error("Actualizar Intervención", "No se actualizó la Intervención, " +
                                "Verifique sus datos: '");
                        }
                    })
                    .error(function (data) {
                        $rootScope.$broadcast('dialogs.wait.complete');
                        dialogs.error("ERROR SERVIDOR", data);
                    });
            }

            function updateIntervencion() {
                var postData = {
                    accion: 'actualizar',
                    data: {
                        idTendero: $scope.tendero.idTendero,
                        intervencion: $scope.intervencion,
                        productos: JSON.stringify($scope.productos)
                    }
                };

                $scope.isUpload = true;

                $http.post('php/controller/IntervencionControllerPost.php', postData)
                    .success(function (data) {
                        if (data.msj == 'OK') {
                            if ($scope.isNewImage) {
                                loadImagen();
                            } else {
                                $rootScope.$broadcast('dialogs.wait.complete');
                                var noty = dialogs.notify("Mensaje", "INTERVENCION ACTUALIZADA CON EXITO");
                                noty.result.then(function () {
                                    $state.go('intervenciones');
                                });
                            }
                        } else {
                            dialogs.error("Actualizar Intervención", "No se actualizó la Intervención, " +
                                "Verifique sus Datos:");
                            $scope.isUpload = false;
                            $state.go('intervenciones');
                        }
                    })
                    .error(function (data) {
                        $rootScope.$broadcast('dialogs.wait.complete');
                        dialogs.error("ERROR SERVIDOR", data);
                    });
            }

            function loadImagen() {
                var file = $scope.myFile;
                var fd = new FormData();
                fd.append('file', file);
                fd.append('nombre', $scope.tendero.idTendero);
                $log.log(fd);
                $http.post('php/controller/TenderoControllerLoad.php', fd, {
                    headers: {'Content-Type': undefined}
                }).success(function (data) {
                    $rootScope.$broadcast('dialogs.wait.complete');
                    if (data.msj == 'OK') {
                        var noty = dialogs.notify("Mensaje", "INTERVENCION ACTUALIZADA CON EXITO");
                        noty.result.then(function () {
                            $state.go('intervenciones');
                        });
                    } else {
                        var noty = dialogs.notify("Imagen", "Datos Actualizados, pero NO se Cargo la Imagen " + data.mensaje);
                        noty.result.then(function () {
                            $scope.isUpload = false;
                            $state.go('intervenciones');
                        });
                    }
                }).error(function (data) {
                    $rootScope.$broadcast('dialogs.wait.complete');
                    dialogs.error("ERROR SERVIDOR", data);
                });
            }

            $scope.SaveAll = function () {
                var dlg = dialogs.confirm('Confirmar', 'DESEAS ACTUALIZAR LA INTERVENCION?');
                dlg.result.then(
                    function (btn) {
                        if ($scope.isNewImage) {
                            if (!$scope.myFile) {
                                var noty = dialogs.notify("Imagen", "Cargue una foto o deseleccione la opción");
                            } else {
                                updateTendero();
                            }
                        } else {
                            updateTendero();
                        }
                    },
                    function (btn) {
                    }
                );
            };

            $scope.verificarDni = function () {
                var dniActual = $scope.tendero.dniTendero;
                if (dni_inicial != dniActual) {
                    $http.get('php/controller/TenderoControllerGet.php', {
                        params: {
                            accion: 'buscar',
                            dni: dniActual
                        }
                    }).success(function (data) {
                        if (data.msj == 'OK') {
                            var dlg = dialogs.confirm('DNI', "El DNI ingresado se encuentra registrado con OTRO TENDERO. " +
                            "Desea Cargar los datos del Tendero Encontrado(SI) o cambie el DNI (NO)?");
                            dlg.result.then(
                                function (btn) {
                                    $scope.mirandom = Math.random();
                                    $scope.tendero = data.tendero;
                                    $scope.intervencion.idTendero = data.tendero.idTendero;
                                    $scope.tendero.nacimientoTendero = utilFactory.getDateFromString(data.tendero.nacimientoTendero);
                                },
                                function (btn) {
                                    $scope.tendero.dniTendero = dni_inicial;
                                }
                            );
                        }else{
                            dialogs.error("ERROR","No se pudo verificar el DNI");
                        }
                    }).error(function (data) {
                        dialogs.error("ERROR SERVIDOR- verificarDni", data);
                    });
                }
            };
        }else{
            $state.go('intervenciones');
        }
    });
