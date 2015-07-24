angular.module('odisea.intervencion.registrar',
        ['ui.router', 'ngAnimate', 'ngResource', 'ui.bootstrap', 'dialogs.main'])
        .config(function config5($stateProvider) {
            $stateProvider.state('intervencion', {
                url: '/intervencion',
                views: {
                    main: {
                        templateUrl: 'view/intervencion/registrar/registrar_intervencion.html',
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
        .controller('intervencionController', function ($rootScope, $window, $scope, $log, $http, $modal, $timeout, dialogs) {

            $scope.mirandom = Math.random();

            $scope.image = 'view/imagen_tendero/default.jpg';

            $scope.isUpload = false;

            $scope.isWorkingDni = false;

            $scope.dni = '';

            $scope.intervencion = {
                fecha: getDateActual(),
                derivacion: 'Comisaria',
                lugarDerivacion: '',
                prevencionista: {
                    dni: '',
                    nombre: ''
                },
                tienda: undefined,
                puesto: '1',
                tipoHurto: '1',
                modalidadEmpleada: '',
                detalleIntevencion: ''
            };

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

            $scope.isRegisterDniDataBase = false;

            //buscar el tendero en base al dni incertado
            $scope.buscarTendero = function () {
                $http.get('php/controller/TenderoControllerGet.php', {
                    params: {
                        accion: 'buscar',
                        dni: $scope.dni
                    }
                }).success(function (data, status, headers, config) {
                    $log.log(data);

                    if (data.msj == 'OK') {

                        var dlg = dialogs.confirm('Búsqueda', 'Tendero Encontrado. ¿Continuar registrando la Intervención?');

                        dlg.result.then(function (btn) {

                            $scope.isWorkingDni = true;
                            $scope.isRegisterDniDataBase = true;

                            $scope.tendero = data.tendero;
                            $scope.tendero.nacimientoTendero = convertStringToDate(data.tendero.nacimientoTendero);

                        }, function (btn) {
                            $scope.tendero.dniTendero = '';
                        });

                    } else {
                        //NUEVO TENDERO
                        var dlg = dialogs.confirm('Confirmar', 'Tendero No Registrado. ¿Registrar Nuevo Tendero?');
                        dlg.result.then(
                                function (btn) {
                                    $scope.isWorkingDni = true;
                                    $scope.tendero.foto = 'resources/img/avatar_default.jpg';
                                    $scope.tendero.dni = $scope.dni;
                                },
                                function (btn) {
                                    $scope.tendero.dni = '';
                                });
                    }
                }).error(function (data, status, headers, config) {

                    console.log("Error");

                });
            };

            $scope.saveIntervencion = function () {
                //solo lo guarda localmente
            };

            $scope.saveNewTendero = function () {

            };

            //Visibilidad de los tabs
            $scope.tab = {tab1: true, tab2: false, tab3: false
            };

            $scope.irPaso1 = function () {
                $scope.tab = {tab1: true, tab2: false, tab3: false};
            };

            $scope.irPaso2 = function () {
                $scope.tab = {tab1: false, tab2: true, tab3: false
                };
            };

            $scope.irPaso3 = function () {
                $scope.tab = {tab1: false, tab2: false, tab3: true
                };
            };


            //PASO 2 PASO 2 PASO 2
            //PASO 2 PASO 2 PASO 2
            //PASO 2 PASO 2 PASO 2
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
                //ES CONVENIENTE QUITAR LOS VALORES
                $scope.producto = {codigo: '', descripcion: '', marca: '', cantidad: 0, precio: 0.0
                };
            };

            $scope.removeProduct = function (indice) {
                $scope.productos.splice(indice, 1);
            };


            function saveTendero() {
                var postData = {
                    accion: 'registrar',
                    tendero: $scope.tendero
                };

                $http.post('php/controller/TenderoControllerPost.php', postData)
                        .success(function (data, status, headers, config) {

                            $log.log("ON SAVED ", data);
                            if (data.msj == 'OK') {
                                saveIncidente();
                                var dlg = dialogs.wait(undefined, undefined, _progress);
                                _fakeWaitProgress();
                            } else {
                                alert("El Dni ya se encuentra registrado con otro tendero");
                            }
                        })
                        .error(function (data, status, headers, config) {

                            $log.info("que paso aca");
                        });
            }

            function updateTendero() {
                var postData = {
                    accion: 'actualizar',
                    tendero: $scope.tendero
                };

                $http.post('php/controller/TenderoControllerPost.php', postData)
                        .success(function (data, status, headers, config) {

                            $log.log("ON UPDATED", data);
                            if (data.msj == 'OK') {
                                saveIncidente();
                                var dlg = dialogs.wait(undefined, undefined, _progress);
                                _fakeWaitProgress();
                            } else {
                                alert("El Dni ya se encuentra registrado con otro tendero");
                            }
//                            

                        })
                        .error(function (data, status, headers, config) {

                            $log.info("que paso aca");
                        });
            }

            //save cab_incidente
            //enviamos el dni del tendero y buscamos en php el id del tendero en base al DNI
            //antes de guardar la incidencia
            function saveIncidente() {
                var postData = {
                    accion: 'registrar',
                    data: {
                        dni: $scope.tendero.dni,
                        incidente: $scope.intervencion,
                        productos: JSON.stringify($scope.productos)
                    }
                };

                //se esta subiendo la info -- desactivar el boton
                $scope.isUpload = true;

                $http.post('php/controller/IntervencionControllerPost.php', postData)
                        .success(function (data, status, headers, config) {
                            $log.log(data);
                            //subir la imagen si esta registrado y quiero actualizarlo
                            //o subir la imagen si no esta registrado

                            if ($scope.isRegisterDniDataBase) {
                                console.log("11111");
                                loadImagen();
                            } else if (!$scope.isRegisterDniDataBase) {
                                console.log("22222");
                                loadImagen();
                            } else {
                                console.log("33333");
                                $window.location.reload();
                            }

                        })
                        .error(function (data, status, headers, config) {

                            $log.info("que paso aca");
                        });
            }


            function loadImagen() {

                var file = $scope.myFile;
                var fd = new FormData();
                fd.append('file', file);
                fd.append('nombre', $scope.tendero.dni);

                $log.log(fd);

                $http.post('php/controller/TenderoControllerLoad.php', fd, {
                    headers: {'Content-Type': undefined}
                }).success(function (data, status, headers, config) {
                    $log.log("IMAGES RESPONSE ", data);
                    $window.location.reload();
                }).error(function (data, status, headers, config) {

                    $log.log("que paso acacacaca");
                });
            }

            var _progress = 33;

            $scope.SaveAll = function () {

                $log.log("tendero", $scope.tendero);
                $log.log("incidente: ", $scope.intervencion);
                $log.log("productos: ", $scope.productos);

                if (!$scope.isRegisterDniDataBase) {

                    saveTendero();
                } else {
                    updateTendero();
                }

            };

            //otras utilidades

            function getDateActual() {

                var today = new Date();
                var dia = (today.getDate() < 10) ? '0' + today.getDate() : today.getDate();
                var m = today.getMonth();
                var mes = (m < 10) ? '0' + m : m;

                var p_hora = today.getHours();
                var hora = (p_hora < 10) ? '0' + p_hora : p_hora;

                var p_minuto = today.getMinutes();
                var minuto = (p_minuto < 10) ? '0' + p_minuto : p_minuto;

                return new Date(today.getFullYear(), mes, dia, hora, minuto);
            }

            function convertStringToDate(fecha) {
                var separate = fecha.split('-');
                return new Date(separate[0], separate[1] - 1, separate[2]);
            }

            ////funciones para el dialogo
            var _fakeWaitProgress = function () {
                $timeout(function () {
                    if (_progress < 100) {
                        _progress += 33;
                        $rootScope.$broadcast('dialogs.wait.progress', {'progress': _progress});
                        _fakeWaitProgress();
                    } else {
                        $rootScope.$broadcast('dialogs.wait.complete');
                        _progress = 0;

                    }
                }, 1000);
            };

        });
        