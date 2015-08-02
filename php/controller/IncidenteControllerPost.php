<?php

include '../dao/IncidenteDao.php';

$postdata = file_get_contents("php://input");
$request = json_decode($postdata);
$accion = $request->accion;
$incidenteDao = new IncidenteDao();

switch ($accion) {
    case 'registrar':
        $data = $request->data;
        $mensaje = $incidenteDao->sp_register($data);
        echo json_encode($mensaje);
        break;
    case 'actualizar':
        $data = $request->data;
        $mensaje = $incidenteDao->sp_update($data);
        echo json_encode($mensaje);
        break;

    case 'eliminar':
        $data = $request->data;
        $mensaje = $incidenteDao->sp_delete($data->id);
        echo json_encode($mensaje);
        break;
}
