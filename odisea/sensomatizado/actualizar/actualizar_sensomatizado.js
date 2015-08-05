angular.module('odisea.sensomatizado.actualizar',
    ['ui.router', 'ngAnimate', 'ngResource', 'ui.bootstrap', 'dialogs.main'])
    .config(function config10($stateProvider) {
        $stateProvider.state('nosensomatizadoup', {
            url: '/nosensomatizadoup',
            views: {
                'main': {
                    templateUrl: 'odisea/sensomatizado/actualizar/actualizar_sensomatizado.html',
                    controller: 'nosensomatizadoupController'
                }
            },
            data: {
                pageTitle: 'Actualizar Producto'
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

    .controller('nosensomatizadoupController', function (utilFactory, $state, $rootScope, $window, $scope, $log, $http, $modal, $timeout, dialogs) {

        if ($rootScope.sensorSeleccionado) {

            $scope.image = "view/imagen_no_sensomatizados/default.png";

            $scope.isNewImage = false;
            $scope.mirandom = Math.random();

            $scope.tab = {tab1: true, tab2: false, tab3: false};

            $scope.producto = {
                codigo: '',
                descripcion: '',
                marca: '',
                cantidad: 0,
                precio: 0.0
            };

            $scope.sensomatizado = $rootScope.sensorSeleccionado.sensomatizado;
            $scope.productos = $rootScope.sensorSeleccionado.productos;

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

            $scope.addProduct = function () {
                var producto = angular.copy($scope.producto);
                $scope.productos.push(producto);
                calcularTotalRecuperado();
                $scope.producto = {codigo: '', descripcion: '', marca: '', cantidad: 0, precio: 0.0};
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
                $scope.sensomatizado.total = total;
            }


            $scope.buscarNombrePrevencionista = function () {
                $http.get('php/controller/SensomatizadoControllerGet.php', {
                    params: {
                        accion: 'get_name_prevencionista_by_dni',
                        dni: $scope.sensomatizado.dniPrevencionista
                    }
                }).success(function (data, status, headers, config) {
                    if (data.msj == 'OK') {
                        $log.log(data);
                        $scope.sensomatizado.nombrePrevencionista = data.nombre;
                    } else {
                        $scope.sensomatizado.nombrePrevencionista = '';
                    }
                }).error(function (data, status, headers, config) {
                    console.log("Error");
                });
            };

            $scope.SaveAll = function () {

                var dlg = dialogs.confirm('Confirmar', 'DESEA REGISTRAR EL PRODUCTO?');
                dlg.result.then(
                    function (btn) {
                        if ($scope.isNewImage) {
                            if (!$scope.myFile) {
                                alert("Cargue una foto o deseleccione la opción");
                            } else {
                                $scope.updateProductos();
                            }
                        } else {
                            $scope.updateProductos();
                        }
                    },
                    function (btn) {
                    }
                );
            };

            $scope.updateProductos = function(){

                $scope.isUpload = true;
                var postData = {
                    accion: 'actualizar',
                    data: {
                        sensomatizado: $scope.sensomatizado,
                        productos: JSON.stringify($scope.productos)
                    }
                };
                dialogs.wait("Procesando...", "Actualizando Productos", 100);
                $rootScope.$broadcast('dialogs.wait.progress', {'progress': 100});
                $http.post('php/controller/SensomatizadoControllerPost.php', postData)
                    .success(function (data) {
                        $rootScope.$broadcast('dialogs.wait.complete');
                        if (data.msj == 'OK') {
                            if ($scope.isNewImage) {
                                $scope.loadImage($scope.sensomatizado.idSensor);
                            } else {
                                var noty = dialogs.notify("Mensaje", "PRODUCTO ACTUALIZADO CON EXITO");
                                noty.result.then(function () {
                                    $window.location.reload();
                                });
                            }
                        }else{

                            dialogs.error("Registro", "No se actualizo el Producto, " +
                                "Verifique sus Datos:");
                            $scope.isUpload = false;
                        }
                    })
                    .error(function (data) {
                        $rootScope.$broadcast('dialogs.wait.complete');
                        dialogs.error("ERROR SERVIDOR", data);
                    });
            };

            $scope.loadImage = function (id) {
                var file = $scope.myFile;
                var fd = new FormData();
                fd.append('file', file);
                fd.append('nombre', id);

                $http.post('php/controller/SensomatizadoControllerLoad.php', fd, {
                    headers: {'Content-Type': undefined}
                }).success(function (data, status, headers, config) {
                    $rootScope.$broadcast('dialogs.wait.complete');
                    if (data.msj == 'OK') {
                        var noty = dialogs.notify("Mensaje", "PRODUCTO ACTUALIZADO CON EXITO");
                        noty.result.then(function () {
                            $window.location.reload();
                        });
                    } else {
                        var d_error = dialogs.error("Error Subir Imagen", "Producto Actualizado, pero no la Imagen:" +
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
        }
    });

