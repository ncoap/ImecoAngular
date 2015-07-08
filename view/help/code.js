//REGISTRO DE NUEVO TENDERO
var postData = {
    accion: 'registrar',
    tendero: $scope.tendero
};

$http.post('php/controller/IncidenteControllerPost.php', postData).
        success(function (data, status, headers, config) {

            console.log(data);

        }).
        error(function (data, status, headers, config) {
            $log.info("que paso aca");
        });
        
        
//tiene que registrar por lo menos un producto o puede dejarse vacio