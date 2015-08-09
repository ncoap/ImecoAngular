angular.module('odisea.incidente.actualizar',
    ['ui.router', 'ngAnimate', 'ngResource', 'ui.bootstrap', 'dialogs.main'])
    .config(function config10($stateProvider) {
        $stateProvider.state('incidenteup', {
            url: '/incidenteup',
            views: {
                'main': {
                    templateUrl: 'view/incidente/actualizar/actualizar_incidente.html',
                    controller: 'incidenteupController'
                }
            },
            data: {
                pageTitle: 'Actualizar Accidente/Incidente'
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

    .controller('incidenteupController', function (utilFactory, $state, $rootScope, $window, $scope, $log, $http, $modal, $timeout, dialogs) {

        if ($rootScope.incidenteSeleccionado) {

            $scope.image = "view/imagen_incidente/default.png";

            $scope.isNewImage = false;
            $scope.mirandom = Math.random();

            $scope.tab = {tab1: true, tab2: false, tab3: false};

            $scope.producto = {
                codigo: '',
                descripcion: '',
                marca: '',
                cantidad: 0,
                precio: 0.0,
                esActivo:'NO'
            };


            $scope.incidente = $rootScope.incidenteSeleccionado.incidente;
            $scope.productos = $rootScope.incidenteSeleccionado.productos;

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

            $scope.addProduct = function () {
                var producto = angular.copy($scope.producto);
                $scope.productos.push(producto);
                calcularTotalRecuperado();
                $scope.producto = {codigo: '', descripcion: '', marca: '', cantidad: 0, precio: 0.0,esActivo:'NO'};
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
                $scope.incidente.total = total;
            }


            $scope.buscarNombreInvolucrado = function () {
                $http.get('php/controller/IncidenteControllerGet.php', {
                    params: {
                        accion: 'get_name_involucrado_by_dni',
                        dni: $scope.incidente.dniInvolucrado
                    }
                }).success(function (data) {
                    $log.log("147", data);
                    if (data.msj == 'OK') {
                        $scope.incidente.nombreInvolucrado = data.nombre;
                    }
                }).error(function (data) {
                    $log.error("152", data);
                });
            };

            $scope.SaveAll = function () {
                if ($scope.isNewImage) {
                    if (!$scope.myFile) {
                        alert("Cargue una foto o deseleccione la opción");
                    } else {
                        $scope.update();
                    }
                } else {
                    $scope.update();
                }
            };

            $scope.update = function () {

                $log.log("UPDATE PRODUCTOS ", $scope.productos);
                $scope.isUpload = true;
                var postData = {
                    accion: 'actualizar',
                    data: {
                        incidente: $scope.incidente,
                        productos: JSON.stringify($scope.productos)
                    }
                };
                dialogs.wait("Procesando...", "Actualizando Inicidente", 100);
                $rootScope.$broadcast('dialogs.wait.progress', {'progress': 100});

                $http.post('php/controller/IncidenteControllerPost.php', postData)
                    .success(function (data) {
                        if (data.msj == 'OK') {
                            if ($scope.isNewImage) {
                                $scope.loadImage($scope.incidente.idIncidente);
                            } else {
                                var noty = dialogs.error("ACTUALIZAR", "Se actualizó el incidente");
                                noty.result.then(function () {
                                    $window.location.reload();
                                });
                            }
                        }
                    })
                    .error(function (err) {
                        $log.info("ERROR REGISTRAR", err);
                    });
            };

            $scope.loadImage = function (id) {
                var file = $scope.myFile;
                var fd = new FormData();
                fd.append('file', file);
                fd.append('nombre', id);

                $http.post('php/controller/IncidenteControllerLoad.php', fd, {
                    headers: {'Content-Type': undefined}
                }).success(function (data) {
                    if (data.msj == 'OK') {
                        $rootScope.$broadcast('dialogs.wait.complete');
                        var noty = dialogs.error("ACTUALIZAR", "Se actualizó el incidente");
                        noty.result.then(function () {
                            $window.location.reload();
                        });
                    } else {
                        var noty = dialogs.error("IMAGEN", "Se actualizó el incidente, pero no la imagen");
                        noty.result.then(function () {
                            $window.location.reload();
                        });
                    }
                }).error(function (err) {
                    $log.log("ERROR AJAX UPLOAD = >", err);
                });
            };
        }else{
            $state.go('home');
        }
    });

