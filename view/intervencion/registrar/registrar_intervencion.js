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
            }).success(function (data, status, headers, config) {
                if (data.msj == 'OK') {
                    $log.log(data);
                    $scope.intervencion.nombrePrevencionista = data.nombre;
                } else {
                    $scope.intervencion.nombrePrevencionista = '';
                }
            }).error(function (data, status, headers, config) {
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

            $http.post('php/controller/TenderoControllerPost.php', postData)
                .success(function (data, status, headers, config) {

                    $log.log("ON SAVED ", data);

                    if (data.msj == 'OK') {
                        $scope.tendero.idTendero = data.newid;
                        $scope.intervencion.idTendero = data.newid;
                        dialogs.wait("Procesando...", "Regsitrando Intervención", 100);
                        $rootScope.$broadcast('dialogs.wait.progress', {'progress': 100});
                        saveIntervencion();
                    } else {
                        alert("El Dni ya se encuentra registrado con otro Tendero, Verifique");
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
                        dialogs.wait("Procesando...", "Regsitrando Intervención", 100);
                        $rootScope.$broadcast('dialogs.wait.progress', {'progress': 100});
                        saveIntervencion();
                    } else {
                        alert("El Dni ya se encuentra registrado con otro tendero. Verifique DNI");
                    }

                })
                .error(function (data, status, headers, config) {

                    $log.info("que paso aca");
                });
        }

        //save cab_incidente
        //enviamos el dni del tendero y buscamos en php el id del tendero en base al DNI
        //antes de guardar la incidencia
        function saveIntervencion() {
            var postData = {
                accion: 'registrar',
                data: {
                    intervencion: $scope.intervencion,
                    productos: JSON.stringify($scope.productos)
                }
            };
            //se esta subiendo la info -- desactivar el boton
            $scope.isUpload = true;
            $http.post('php/controller/IntervencionControllerPost.php', postData)
                .success(function (data, status, headers, config) {
                    $log.log(data);
                    loadImagen();
                })
                .error(function (data, status, headers, config) {

                    $log.info("que paso aca");
                });
        }

        function loadImagen() {
            var file = $scope.myFile;
            var fd = new FormData();
            fd.append('file', file);
            fd.append('nombre', $scope.tendero.idTendero);
            $log.log("FILE ZISE", file);

            $http.post('php/controller/TenderoControllerLoad.php', fd, {
                headers: {'Content-Type': undefined}
            }).success(function (data, status, headers, config) {
                $log.log("IMAGES RESPONSE ", data);
                $rootScope.$broadcast('dialogs.wait.complete');
                var dlg = dialogs.confirm('Confirmación', 'Intervención Registrada con Éxito. ¿Ver Registros?');
                dlg.result.then(
                    function (btn) {
                        $state.go("intervenciones");
                    },
                    function (btn) {
                        $window.location.reload();
                    }
                );

            }).error(function (data, status, headers, config) {
                $log.log("que paso acacacaca");
            });
        }

        $scope.SaveAll = function () {
            $log.log("tendero", $scope.tendero, "intervención: ", $scope.intervencion, "productos: ", $scope.productos);
            if (!$scope.isRegisterDniDataBase) {
                saveTendero();
            } else {
                updateTendero();
            }
        };

    });
        