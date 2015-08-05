angular.module('odisea.intervencion.registrar',
    ['ui.router', 'ngAnimate', 'ngResource', 'ui.bootstrap', 'dialogs.main'])
    .config(function config5($stateProvider) {
        $stateProvider.state('intervencion', {
            url: '/intervencion',
            views: {
                main: {
                    templateUrl: 'oeschle2/intervencion/registrar/registrar_intervencion.html',
                    controller: 'intervencionController'
                }
            },
            data: {
                pageTitle: 'Registrar Intervención'
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
        //el input file como un modelo
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
        //relacionar un modelo de datos con una imagen (img)
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
    .controller('intervencionController', function (utilFactory, $rootScope, $state, $window, $scope, $log, $http, $modal, $timeout, dialogs) {

        $scope.mirandom = Math.random();

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

        $scope.image = 'view/imagen_tendero/default.jpg';

        $scope.isUpload = false;

        $scope.isWorkingDni = false;

        $scope.dni = '';

        $scope.tendero = {
            idTendero: '',
            dniTendero: '',
            nombreTendero: '',
            apellidoTendero: '',
            idTipoTendero: 1,
            direccionTendero: '',
            nacimientoTendero: new Date(),
            sexoTendero: 'M'
        };

        $scope.intervencion = {
            idTendero: '',
            fechaCompletaIntervencion: utilFactory.getDateActual(),
            derivacionIntervencion: 'Comisaria',
            lugarDerivacion: '',
            dniPrevencionista: '',
            nombrePrevencionista: '',
            tienda: undefined,
            idPuesto: '1',
            tipoHurto: '1',
            modalidadEmpleada: '',
            detalleIntervencion: '',
            totalRecuperado: 0.0
        };

        $scope.buscarNombrePrevencionista = function () {
            $http.get('php/controller/IntervencionControllerGet.php', {
                params: {
                    accion: 'get_name_prevencionista_by_dni',
                    dni: $scope.intervencion.dniPrevencionista
                }
            }).success(function (data) {
                $log.log(data);
                if (data.msj == 'OK') {
                    $scope.intervencion.nombrePrevencionista = data.nombre;
                } else {
                    $scope.intervencion.nombrePrevencionista = '';
                }
            }).error(function (data) {
                console.log("Error");
            });
        };

        $scope.isRegisterDniDataBase = false;
        //buscar el tendero en base al dni insertado
        $scope.buscarTendero = function () {
            $http.get('php/controller/TenderoControllerGet.php', {
                params: {
                    accion: 'buscar',
                    dni: $scope.dni
                }
            }).success(function (data, status, headers, config) {
                if (data.msj == 'OK') {
                    var dlg = dialogs.confirm('Búsqueda', 'Tendero Encontrado. ¿Continuar registrando la Intervención?');
                    dlg.result.then(
                        function (btn) {
                            $scope.isWorkingDni = true;
                            $scope.isRegisterDniDataBase = true;
                            $scope.tendero = data.tendero;
                            $scope.intervencion.idTendero = data.tendero.idTendero;
                            $scope.tendero.nacimientoTendero = utilFactory.getDateFromString(data.tendero.nacimientoTendero);
                        },
                        function (btn) {
                            $scope.dni = '';
                        }
                    );
                } else {
                    //NUEVO TENDERO
                    var dlg = dialogs.confirm('Confirmar', 'Tendero No Registrado. ¿Registrar Nuevo Tendero?');
                    dlg.result.then(
                        function (btn) {
                            $scope.isWorkingDni = true;
                            $scope.tendero.dniTendero = $scope.dni;
                        },
                        function (btn) {
                            $scope.dni = '';
                        }
                    );
                }
            }).error(function (data, status, headers, config) {
                console.log("Error");
            });
        };

        $scope.producto = {
            codigo: '',
            descripcion: '',
            marca: '',
            cantidad: 0,
            precio: 0.0
        };

        $scope.productos = [];

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

            $scope.intervencion.totalRecuperado = total;
        }

        function saveTendero() {
            var postData = {
                accion: 'registrar',
                tendero: $scope.tendero
            };

            dialogs.wait("Procesando...", "Registrando Intervención", 100);
            $rootScope.$broadcast('dialogs.wait.progress', {'progress': 100});

            $http.post('php/controller/TenderoControllerPost.php', postData)
                .success(function (data) {
                    if (data.msj == 'OK') {
                        $scope.tendero.idTendero = data.newid;
                        $scope.intervencion.idTendero = data.newid;
                        saveIntervencion();
                    } else {
                        $rootScope.$broadcast('dialogs.wait.complete');
                        dialogs.error("DNI", 'El Dni ya se encuentra registrado con otro Tendero, Verifique');
                    }
                })
                .error(function (data) {
                    $rootScope.$broadcast('dialogs.wait.complete');
                    dialogs.error("ERROR SERVIDOR", data);
                });
        }

        function updateTendero() {
            var postData = {
                accion: 'actualizar',
                tendero: $scope.tendero
            };

            dialogs.wait("Procesando...", "Regsitrando Intervención", 100);
            $rootScope.$broadcast('dialogs.wait.progress', {'progress': 100});

            $http.post('php/controller/TenderoControllerPost.php', postData)
                .success(function (data) {
                    if (data.msj == 'OK') {
                        saveIntervencion();
                    } else {
                        $rootScope.$broadcast('dialogs.wait.complete');
                        dialogs.error("Imagen", "El Dni ya se encuentra registrado con otro tendero. Verifique DNI");
                    }
                })
                .error(function (data) {
                    $rootScope.$broadcast('dialogs.wait.complete');
                    dialogs.error("ERROR SERVIDOR- function updateTendero", data);
                });
        }

        function saveIntervencion() {
            var postData = {
                accion: 'registrar',
                data: {
                    intervencion: $scope.intervencion,
                    productos: JSON.stringify($scope.productos)
                }
            };
            $scope.isUpload = true;

            $http.post('php/controller/IntervencionControllerPost.php', postData)
                .success(function (data) {
                    if (data.msj == 'OK') {
                        loadImagen();
                    } else {
                        $rootScope.$broadcast('dialogs.wait.complete');
                        dialogs.error("Registrar Intervención", "No se registró la Intervención, " +
                            "Verifique sus Datos:");
                        $scope.isUpload = false;
                    }
                })
                .error(function (data) {
                    $rootScope.$broadcast('dialogs.wait.complete');
                    dialogs.error("ERROR SERVIDOR->", data);
                });
        }

        function loadImagen() {

            var file = $scope.myFile;
            var fd = new FormData();
            fd.append('file', file);
            fd.append('nombre', $scope.tendero.idTendero);

            $http.post('php/controller/TenderoControllerLoad.php', fd, {
                headers: {'Content-Type': undefined}
            }).success(function (data) {
                $rootScope.$broadcast('dialogs.wait.complete');
                if (data.msj == 'OK') {
                    var noty = dialogs.notify("Mensaje", "INTERVENCION REGISTRADA CON EXITO");
                    noty.result.then(function () {
                        $window.location.reload();
                    });
                } else {
                    var d_error = dialogs.error("Error Subir Imagen", "Intervencion Registrada pero no la Imagen:" +
                        data.mensaje);
                    d_error.result.then(function () {
                        $window.location.reload();
                    });
                }
            }).error(function (data) {
                $rootScope.$broadcast('dialogs.wait.complete');
                dialogs.error("ERROR SERVIDOR", data);
            });
        }

        $scope.SaveAll = function () {
            var dlg = dialogs.confirm('Confirmar', 'DESEA REGISTRAR LA INTERVENCION?');
            dlg.result.then(
                function (btn) {
                    if (!$scope.isRegisterDniDataBase) {
                        saveTendero();
                    } else {
                        updateTendero();
                    }
                },
                function (btn) {
                }
            );
        };
    });
