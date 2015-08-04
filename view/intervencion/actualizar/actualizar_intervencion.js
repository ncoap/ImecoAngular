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
                $http.post('php/controller/TenderoControllerPost.php', postData)
                    .success(function (data, status, headers, config) {
                        console.log(data);
                        if (data.msj == 'OK') {
                            var dlg = dialogs.wait(undefined, undefined, 100);
                            $rootScope.$broadcast('dialogs.wait.progress', {'progress': 100});
                            updateIntervencion();
                        } else {
                            alert("No se pudo actualizar al tendero");
                            console.log(data);
                        }
                    })
                    .error(function (data, status, headers, config) {
                        $log.info("que paso aca");
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
                        $log.log("RESPONSE UPDATE INTERVENCION", data);
                        if ($scope.isNewImage) {
                            loadImagen();
                        } else {
                            $rootScope.$broadcast('dialogs.wait.complete');
                            alert("Intervencion Actualizada");
                            $state.go('intervenciones');
                        }
                    })
                    .error(function (data) {
                        $log.info("que paso aca");
                    });
            }

            function loadImagen(){
                var file = $scope.myFile;
                var fd = new FormData();
                fd.append('file', file);
                fd.append('nombre', $scope.tendero.idTendero);
                $log.log(fd);
                $http.post('php/controller/TenderoControllerLoad.php', fd, {
                    headers: {'Content-Type': undefined}
                }).success(function (data) {
                    if (data.msj == 'OK') {
                        $rootScope.$broadcast('dialogs.wait.complete');
                        alert("Intervencion Actualizada");
                        $state.go('intervenciones');
                    } else {
                        alert("Datos Actualizados, NO se Cargo la Imagen:" + data.mensaje);
                        $log.log("Load", data);
                    }
                }).error(function (data) {
                    $log.log("que paso acacacaca");
                });
            }

            $scope.SaveAll = function () {
                $log.log("tendero", $scope.tendero);
                $log.log("incidente: ", $scope.intervencion);
                $log.log("productos: ", $scope.productos);
                if ($scope.isNewImage) {
                    if (!$scope.myFile) {
                        alert("Cargue una foto o deseleccione la opción");
                    } else {
                        updateTendero();
                    }
                } else {
                    updateTendero();
                }
            };

            $scope.verificarDni = function () {
                var dniActual = $scope.tendero.dniTendero;

                if (dni_inicial != dniActual) {
                    $http.get('php/controller/TenderoControllerGet.php', {
                        params: {
                            accion: 'buscar',
                            dni: dniActual
                        }
                    }).success(function (data, status, headers, config) {
                        if (data.msj == 'OK') {
                            var opt = confirm("El DNI ingresado se encuentra registrado con OTRO TENDERO. " +
                                "Desea Cargar los datos del Tendero Encontrado(S) o cambie el DNI (N)?");

                            if (opt) {
                                $scope.tendero = data.tendero;
                                var fecha = convertStringToDate();
                                $scope.tendero.nacimientoTendero = utilFactory.getDateFromString(data.tendero.nacimientoTendero);

                            } else {
                                $scope.tendero.dniTendero = dni_inicial;
                            }
                        }
                    }).error(function (data, status, headers, config) {
                        console.log("Error");
                    });
                }
            };
        }
    });
