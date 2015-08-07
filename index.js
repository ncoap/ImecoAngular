angular.module('ngLogin', [
    'ngCookies'
])
    .factory('factoryLogin', function ($cookieStore) {
        function getRol() {
            return $cookieStore.get('rol') || false;
        }
        function saveRol(rol) {
            $cookieStore.put("rol", rol);
        }
        function removeRol() {
            $cookieStore.remove('rol');
        }
        return {
            getRol: getRol,
            saveRol: saveRol,
            removeRol: removeRol
        }
    })
    .service('loginService', function ($http, $q) {
        function login(postData) {
            var defered = $q.defer();
            var promise = defered.promise;
            $http.post('php/controller/LoginController.php', postData)
                .success(function (data) {
                    defered.resolve(data);
                })
                .error(function (err) {
                    defered.reject(err);
                }
            );
            return promise;
        }

        return {
            login: login
        }
    })
    .controller('loginController', function ($window, $log, $scope, factoryLogin, loginService, $location) {
        factoryLogin.removeRol();
        $scope.usuario = {
            username: '',
            password: ''
        };
        $scope.login = function () {
            loginService.login({
                usuario: $scope.usuario
            }).then(function (data) {
                if (data.msj == 'OK') {
                    factoryLogin.saveRol(data.rol);
                    window.location.href = "admin.html";
                } else {
                    alert(data.mensaje);
                }
            }).catch(function (err) {
                alert("Error en el Server");
            });
        }
    });