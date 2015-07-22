<?php

include '../dao/IntervencionDao.php';

$postdata = file_get_contents("php://input");
$request = json_decode($postdata);
$accion = $request->accion;
$intervencionDao = new IntervencionDao();

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
        $mensaje = $intervencionDao->sp_register_incidente($data);
        echo json_encode($mensaje);
        break;
    case 'actualizar':
        $data = $request->data;
        /*
          data: {
            idTendero: $scope.tendero.idTendero,
            intervencion: $scope.intervencion,
            productos: JSON.stringify($scope.productos)
          }
         */
        $mensaje = $intervencionDao->sp_update_intervencion($data);
        echo json_encode($mensaje);
        break;
    case 'eliminar':
        $data = $request->data;
        $mensaje = $intervencionDao->sp_delete_intervencion($data->id);
        echo json_encode($mensaje);

        break;
}
