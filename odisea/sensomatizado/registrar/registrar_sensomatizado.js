angular.module('odisea.sensomatizado.registrar',
    ['ui.router', 'ngAnimate', 'ngResource', 'ui.bootstrap', 'dialogs.main'])
    .config(function config8($stateProvider) {
        $stateProvider.state('nosensomatizado', {
            url: '/nosensomatizado',
            views: {
                'main': {
                    templateUrl: 'odisea/sensomatizado/registrar/registrar_sensomatizado.html',
                    controller: 'nosensomatizadoController'
                }
            },
            data: {
                pageTitle: 'Producto No Sensomatizado'
            }
        });
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

    .controller('nosensomatizadoController', function (utilFactory,$state, $rootScope, $window, $scope, $log, $http, $modal, $timeout, dialogs) {


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

        $scope.isSaved = false;

        $scope.sensomatizado = {
            dniPrevencionista: '',
            nombrePrevencionista: '',
            tienda: undefined,
            fecha: utilFactory.getDateActual(),
            observaciones: 'SIN OBSERVACIONES',
            total: 0.0
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
            $scope.sensomatizado.total = total;
        }


        $scope.buscarNombrePrevencionista = function () {
            $http.get('php/controller/SensomatizadoControllerGet.php', {
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
            });
        };

        $scope.SaveAll = function () {

            var dlg = dialogs.confirm('Confirmar', 'DESEA REGISTRAR EL PRODUCTO?');
            dlg.result.then(
                function (btn) {
                    $scope.isUpload = true;
                    var postData = {
                        accion: 'registrar',
                        data: {
                            sensomatizado: $scope.sensomatizado,
                            productos: JSON.stringify($scope.productos)
                        }
                    };
                    dialogs.wait("Procesando...", "Registrando Intervencion", 100);
                    $rootScope.$broadcast('dialogs.wait.progress', {'progress': 100});

                    $http.post('php/controller/SensomatizadoControllerPost.php', postData)
                        .success(function (data) {
                            $log.log(data);
                            if (data.msj == 'OK') {
                                $scope.loadImage(data.id);
                            }else{
                                $rootScope.$broadcast('dialogs.wait.complete');
                                dialogs.error("Registro", "No se registro el Producto, " +
                                    "Verifique sus Datos o Conexion:");
                                $scope.isUpload = false;
                            }
                        })
                        .error(function (err) {
                            $rootScope.$broadcast('dialogs.wait.complete');
                            dialogs.error("ERROR SERVIDOR", data);
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

            $http.post('php/controller/SensomatizadoControllerLoad.php', fd, {
                headers: {'Content-Type': undefined}
            }).success(function (data) {
                $rootScope.$broadcast('dialogs.wait.complete');
                if(data.msj == 'OK'){
                    var noty = dialogs.notify("Mensaje", "PRODUCTO REGISTRADO CON EXITO");
                    noty.result.then(function () {
                        $window.location.reload();
                    });
                }else{
                    var d_error = dialogs.error("Error Subir Imagen", "Producto Registrado pero no la Imagen:" +
                        data.info);
                    d_error.result.then(function () {
                        $window.location.reload();
                    });
                }
            }).error(function (data) {
                $rootScope.$broadcast('dialogs.wait.complete');
                dialogs.error("ERROR SERVIDOR", data);
            });
        };

    });
