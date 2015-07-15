angular.module('ngImeco.nosensomatizado',
        ['ui.router', 'ngAnimate', 'ngResource', 'ui.bootstrap', 'dialogs.main'])
        .config(function config8($stateProvider) {
            $stateProvider.state('nosensomatizado', {
                url: '/nosensomatizado',
                views: {
                    'main': {
                        templateUrl: 'view/nosensomatizado/template.html',
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

        .controller('nosensomatizadoController', function ($rootScope, $window, $scope, $log, $http, $modal, $timeout, dialogs) {

            $scope.image;

            $scope.isSaved = false;

            $scope.sensomatizado = {
                dni: '',
                intervencionista: '',
                tienda: 1,
                fecha: getDateActual(),
                codigo: '',
                descripcion: '',
                marca: '',
                cantidad: 0,
                precio: 0,
                total: 0,
                foto: '',
                observaciones: ''
            };

            $scope.loadImage = function () {

                var file = $scope.myFile;
                var fd = new FormData();
                fd.append('file', file);

                $http.post('php/controller/SensomatizadoControllerLoad.php', fd, {
                    headers: {'Content-Type': undefined}
                }).success(function (data, status, headers, config) {

                    $log.log("IMAGES RESPONSE ", data);

                    //Dialogs
                    //locacion de anotaciones
                    $window.location.reload();

                }).error(function (data, status, headers, config) {
                    $log.log("que paso acacacaca");
                });

            };

            $scope.registrarProducto = function () {

                //ya Hizo Click
                $scope.isSaved = true;

                $scope.sensomatizado.foto = 'view/imagen_no_sensomatizados/' + $scope.myFile.name;
                $scope.sensomatizado.total = $scope.sensomatizado.cantidad * $scope.sensomatizado.precio;

                var postData = {
                    accion: 'registrar',
                    data: {
                        producto: $scope.sensomatizado
                    }
                };

                $log.info($scope.sensomatizado);

                $http.post('php/controller/SensomatizadoControllerPost.php', postData)
                        .success(function (data, status, headers, config) {
                            $log.log(data);
                            if (data.msj == 'OK') {
                                //ksajndanslkfdnaklsdklasdkljaklsjdklasj
                                //cargamos la imagen
                                $scope.loadImage();
                            }
                        })
                        .error(function (data, status, headers, config) {
                            $log.info("que paso aca");
                        });
            };

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

        });
