angular.module('ngImeco.incidente', ['ui.router', 'ngAnimate', 'ngResource', 'ui.bootstrap',
    'dialogs.main'])
        .config(function config5($stateProvider) {
            $stateProvider.state('incidente', {
                url: '/incidente',
                views: {
                    'main': {
                        templateUrl: 'view/incidente/incidente.tpl.html',
                        controller: 'incidenteController'
                    }
                },
                data: {
                    pageTitle: 'Incidentes'
                }
            });
        })
        .controller('incidenteController', function ($scope, $log, $http, $modal, $timeout, dialogs) {

            $scope.isWorkingDni = false;
            //modal idiama español
            //Cabecera de incidente
            $scope.incidente = {
                fecha: new Date(),
                derivacion: 'Comisaria',
                lugarDerivacion: '',
                prevencionista: {
                    dni: '',
                    nombre: ''
                },
                puesto: '1',
                modalidadEmpleada: '',
                detalleIntevencion: ''
            };

            $scope.tendero = {
                dni: '',
                nombre: '',
                apellido: '',
                direccion: '',
                nacimiento: new Date(),
                sexo: 'M'
            };

            // Si tenemos un DNI registrado en el modelo tendero.dni
            $scope.isDniRegistrado = false;

            // condicion para registrar nuevo tendero
            $scope.isNewTendero = false;

            //buscar el tendero en base al dni incertado
            $scope.buscarTendero = function () {
                $http.get('php/controller/TenderoControllerGet.php', {
                    params: {
                        accion: 'isExist',
                        dni: $scope.tendero.dni
                    }
                }).success(function (data, status, headers, config) {
                    //si el tendero existe
                    if (data.exist == '1') {

                        var dlg = dialogs.confirm('Búsqueda', 'Dni Encontrado!!!. ¿Continuar Con la Incidencia?');
                        dlg.result.then(function (btn) {

                            $scope.isDniRegistrado = true;
                            $scope.isWorkingDni = true;

                        }, function (btn) {

                            $scope.tendero.dni = '';
                        });

                    } else {
                        // si el tendero no existe
                        var dlg = dialogs.confirm('Confirmar', 'Dni no registrado. ¿Registrar Nuevo Tendero?');
                        dlg.result.then(function (btn) {
                            //mostrar formulario nuevo tendero
                            $scope.isNewTendero = true;

                            //inbalitar el campor dni por que estoy trabajando con el
                            $scope.isWorkingDni = true;

                        }, function (btn) {
                            $scope.tendero.dni = '';
                        });

                    }
                }).error(function (data, status, headers, config) {
                    console.log("Error");
                });
            };

            $scope.saveIntervencion = function () {

            };


            $scope.cancelNewTendero = function () {

                $scope.isNewTendero = false;
                //reseteamos los datos del tendero
                $scope.tendero = {dni: '', nombre: '', apellido: '', direccion: '', nacimiento: new Date(), sexo: 'M'};
                //no se trabaja con el dni  lo habilitamos otra vez
                $scope.isWorkingDni = false;

            };

            $scope.cancelIncidente = function () {

                $scope.isDniRegistrado = false;

                //PODEMOS validar de que no exista dato del Tendero
                //Borramos la data del tendero ingresado anteriormente 
                $scope.tendero = {dni: '', nombre: '', apellido: '', direccion: '', nacimiento: new Date(), sexo: 'M'};
                //no se trabaja con el dni
                $scope.isWorkingDni = false;

            };

            $scope.saveNewTendero = function () {

                $log.log($scope.tendero);

                //LOGICA NUEVO TENDERO
                $scope.isNewTendero = false;
                //mostramos el formulario
                $scope.isDniRegistrado = true;
            };

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

            $scope.SaveAll = function () {
                $log.info("Se Guardo Todo: ", $scope.incidente, $scope.tendero, $scope.producto, $scope.productos);
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


        });
