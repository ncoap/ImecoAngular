angular.module('odisea.incidente.registrar',
    ['ui.router', 'ngAnimate', 'ngResource', 'ui.bootstrap', 'dialogs.main'])
    .config(function config8($stateProvider) {
        $stateProvider.state('incidente', {
            url: '/incidente',
            views: {
                'main': {
                    templateUrl: 'view/incidente/registrar/registrar_incidente.html',
                    controller: 'incidenteController'
                }
            },
            data: {
                pageTitle: 'Registro Accidente/Incidente'
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

    .controller('incidenteController', function (utilFactory,$state, $rootScope, $window, $scope, $log, $http, $modal, $timeout, dialogs) {

        $scope.image = "view/imagen_incidente/default.png";

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

        $scope.incidente = {
            idIncidente:0,
            tienda: undefined,
            nombreInvolucrado: '',
            dniInvolucrado: '',
            actoCondicionInsegura:'sin condicion',
            nombreAccidentado: '',
            dniAccidentado: '',
            edadAccidentado:20,
            sexoAccidentado:'M',
            fechaAccidenteCompleta: utilFactory.getDateActual(),
            nivelGravedad:'BAJO',
            diagnostico:'sin diagnostico',
            descansoMedico:'NO',
            cantidadDias:0,
            descripcionCausas:'sin descripcion',
            lesion:'INCAPACIDAD TEMPORAL',
            accionesCorrectivasRealizadas:'sin acciones correctivas',
            total: 0.0
        };

        $scope.producto = {
            codigo: '',
            descripcion: '',
            marca: '',
            cantidad: 0,
            precio: 0.0,
            esActivo:'NO'
        };

        $scope.productos = [];

        $scope.addProduct = function () {
            var producto = angular.copy($scope.producto);
            $scope.productos.push(producto);
            calcularTotalRecuperado();
            $scope.producto = {codigo: '', descripcion: '', marca: '', cantidad: 0, precio: 0.0, esActivo:'NO'};
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

        // BUSCAR INVOLUCRADO
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
                $log.error("152",data);
            });
        };

        $scope.SaveAll = function () {
            $scope.isUpload = true;
            console.log($scope.myFile.name);
            var postData = {
                accion: 'registrar',
                data: {
                    incidente: $scope.incidente,
                    productos: JSON.stringify($scope.productos)
                }
            };
            dialogs.wait("Procesando...", "Regsitrando Incidente", 100);
            $rootScope.$broadcast('dialogs.wait.progress', {'progress': 100});

            $http.post('php/controller/IncidenteControllerPost.php', postData)
                .success(function (data, status, headers, config) {
                    $log.log(data);
                    if (data.msj == 'OK') {
                        $scope.loadImage(data.id);
                    }
                })
                .error(function (err, status, headers, config) {
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
            }).success(function (data, status, headers, config) {
                $rootScope.$broadcast('dialogs.wait.complete');
                if(data.msj == 'OK'){
                    var noty = dialogs.notify("Mensaje", "INCIDENTE REGISTRADO CON EXITO");
                    noty.result.then(function () {
                        $window.location.reload();
                    });
                }else{
                    var noty = dialogs.error("IMAGEN", "Se registro el incidente pero no la Imagen");
                    noty.result.then(function () {
                        $window.location.reload();
                    });
                }
            }).error(function (err, status, headers, config) {
                $log.log("ERROR AJAX UPLOAD = >",err);
            });
        };
    });
