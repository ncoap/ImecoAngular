angular.module('odisea.sensomatizado.actualizar',
        ['ui.router', 'ngAnimate', 'ngResource', 'ui.bootstrap', 'dialogs.main'])
        .config(function config10($stateProvider) {
            $stateProvider.state('nosensomatizadoup', {
                url: '/nosensomatizadoup',
                views: {
                    'main': {
                        templateUrl: 'view/sensomatizado/actualizar/actualizar_sensomatizado.html',
                        controller: 'nosensomatizadoupController'
                    }
                },
                data: {
                    pageTitle: 'Actualizar Producto'
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

        .controller('nosensomatizadoupController', function ($rootScope, $window, $scope, $log, $http, $modal, $timeout, dialogs) {

            $scope.image;
            $log.info("PRODUCTO FROM ROOT", $rootScope.producto);

            $scope.sensomatizado = $rootScope.producto;



            $scope.isNewImage = false;

            $scope.isSaved = false;

            $scope.loadImage = function () {

                var file = $scope.myFile;
                var fd = new FormData();
                fd.append('file', file);

                $http.post('php/controller/SensomatizadoControllerLoad.php', fd, {
                    headers: {'Content-Type': undefined}
                }).success(function (data, status, headers, config) {

                    $rootScope.$broadcast('dialogs.wait.complete');
                    var dlg = dialogs.notify('Actualización', 'Producto Actualizado');
                    dlg.result.then(function (btn) {
                        $window.location.reload();
                    });


                }).error(function (data, status, headers, config) {
                    $log.log("que paso acacacaca");
                });

            };

            $scope.actualizarProducto = function () {
                if ($scope.isNewImage) {

                    if (!$scope.myFile) {
                        alert("Cargue un nueva Foto");

                    } else {
                        var dlg = dialogs.wait(undefined, undefined, 100);
                        $scope.isSaved = true;
                        $scope.sensomatizado.foto = 'view/imagen_no_sensomatizados/' + $scope.myFile.name;

                        var postData = {
                            accion: 'actualizar',
                            data: {
                                producto: $scope.sensomatizado
                            }
                        };


                        $http.post('php/controller/SensomatizadoControllerPost.php', postData)
                                .success(function (data, status, headers, config) {
                                    $log.log(data);
                                    if (data.msj == 'OK') {
                                        $scope.loadImage();
                                    }
                                })
                                .error(function (data, status, headers, config) {
                                    $log.info("que paso aca");
                                });

                    }

                } else {
                    var dlg = dialogs.wait(undefined, undefined, 100);

                    $scope.isSaved = true;
                    $scope.sensomatizado.total = $scope.sensomatizado.cantidad * $scope.sensomatizado.precio;

                    var postData = {
                        accion: 'actualizar',
                        data: {
                            producto: $scope.sensomatizado
                        }
                    };

                    $log.info($scope.sensomatizado);

                    $http.post('php/controller/SensomatizadoControllerPost.php', postData)
                            .success(function (data, status, headers, config) {
                                $log.log(data);
                                if (data.msj == 'OK') {

                                    $rootScope.$broadcast('dialogs.wait.complete');

                                }
                            })
                            .error(function (data, status, headers, config) {
                                $log.info("que paso aca");
                            });


                }

            };

//            $scope.watt = function () {
//                var dlg = dialogs.wait('Procesando', 'Actu', 100);
//                
//            };


        });
