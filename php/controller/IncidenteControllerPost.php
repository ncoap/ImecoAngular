<?php

include '../dao/IncidenteDao.php';

$postdata = file_get_contents("php://input");
$request = json_decode($postdata);
$accion = $request->accion;
$incidenteDao = new IncidenteDao();

switch ($accion) {
    case 'registrar':
        $data = $request->data;
        /*
        data: {
            dni: $scope.tendero.dni,
            incidente: $scope.incidente,
            productos: JSON.stringify($scope.productos)
        }
         */
        $mensaje = $incidenteDao->sp_register_incidente($data);
        echo json_encode($mensaje);
        break;
    case 'actualizar':

        break;
    case 'eliminar':
        break;
}