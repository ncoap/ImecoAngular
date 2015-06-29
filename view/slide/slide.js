angular.module('ngImeco.slide', ['ui.router', 'ngAnimate', 'ngResource', 'ui.bootstrap'])
        .config(function config3($stateProvider) {
            $stateProvider.state('slides', {
                url: '/slides',
                views: {
                    'main': {
                        templateUrl: 'view/slide/slide.tpl.html',
                        controller: 'slideControler'
                    }
                },
                data: {
                    pageTitle: 'Slide Principal'
                }
            });
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
        .controller('slideControler', function ($scope, $log, $http, $modal, $timeout) {

            $scope.maxSize = 5;
            $scope.bigTotalItems = 0;
            $scope.bigCurrentPage = 1;
            $scope.pageSize = 5;

            $scope.enlaces = [];
            $scope.currentEnlaces = [];

            $scope.alert = {
                type: '',
                msg: ''
            };

            $scope.isRegister = false;

            $scope.fromPc = false;

            $scope.myInterval = 4000;

            $scope.togglePc = function () {
                $scope.fromPc = !$scope.fromPc;
            };

            $scope.isClickLoad = false;

            $scope.pageChanged = function () {
                $scope.currentEnlaces = $scope.enlaces.slice(($scope.bigCurrentPage - 1) * $scope.pageSize, $scope.bigCurrentPage * $scope.pageSize);
            };

            $scope.listarSlides = function () {



                $http.get('php/controller/SlideControllerGet.php?accion=listar')
                        .success(function (data, status, headers, config) {
                            $log.info(data);
                            $scope.bigCurrentPage = 1;
                            $scope.bigTotalItems = data.length;
                            $scope.enlaces = data;
                            $scope.pageChanged();
                        })
                        .error(function (data, status, headers, config) {
                            console.log("Error");
                        });
            };

            $scope.listarSlides();


            $scope.deleteEnlace = function (id_imagen) {
                var option = confirm("¿Desea Eliminar la imagen?");
                var info = {
                    accion: 'eliminar',
                    data: {
                        id: id_imagen
                    }
                };
                if (option) {
                    $http.post('php/controller/SlideControllerPost.php', info).
                            success(function (data, status, headers, config) {

                                $log.info("DELETE SLIDE");
                                $log.info(data);

                                $scope.alert = {
                                    type: 'danger',
                                    msg: 'Imagen Eliminada'
                                };

                                $scope.isRegister = true;

                                $timeout(function () {
                                    $scope.isRegister = false;
                                }, 4000);

                                $scope.listarSlides();

                            }).
                            error(function (data, status, headers, config) {
                                $log.info("que paso aca");
                            });
                }
            };


            $scope.showModalNuevoSlide = function () {

                var modalInstance = $modal.open({
                    templateUrl: 'view/slide/newSlide.html',
                    controller: 'NuevoSlideController'
                });

                modalInstance.result.then(function (selectedItem) {

                    $scope.alert = {
                        type: 'success',
                        msg: 'Imagen Registrada Correctamente'
                    };

                    $scope.isRegister = true;

                    $timeout(function () {
                        $scope.isRegister = false;
                    }, 3000);

                    $scope.listarSlides();
                });
            };

            $scope.uploadFile = function () {
                $scope.isClickLoad = true;
                $scope.alert = {
                    type: 'info',
                    msg: 'Cargando Imagen...'
                };

                $scope.isRegister = true;
                var file = $scope.myFile;
                var fd = new FormData();
                fd.append('file', file);
                $http.post('php/controller/SlideControllerLoad.php', fd, {
//                    transformRequest: angular.identity,
                    headers: {'Content-Type': undefined}
                }).success(function (data, status, headers, config) {
                    $log.info("ADMIN");
                    $log.info(data);
                    $scope.isRegister = false;
                    $scope.togglePc();
                    $scope.isClickLoad = false;
                    $scope.listarSlides();
                }).error(function (data, status, headers, config) {
                });
            };

        })
        .controller('NuevoSlideController', function ($scope, $modalInstance, $http, $log) {

            $scope.nuevoSlide = {};

            $scope.cancel = function () {
                $modalInstance.dismiss('cancel');
            };

            $scope.registerForm = function () {
                //cerrar el modal
                //
                var info = {
                    accion: 'registrar',
                    data: $scope.nuevoSlide
                };

                $log.info("INFO ");
                $log.info(info);

                $http.post('php/controller/SlideControllerPost.php', info)
                        .success(function (data, status, headers, config) {
                            console.log(data);
                            $modalInstance.close($scope.nuevoSlide);
                        })
                        .error(function (data, status, headers, config) {
                            //me quedo en el formulario
                            $log.info("que paso aca");
                        });

            };
        });

