<?php

include '../dao/IncidenteDao.php';

$postdata = file_get_contents("php://input");
$request = json_decode($postdata);
$accion = $request->accion;
$incidenteDao = new IncidenteDao();

switch ($accion) {
    case 'registrar':
        $tendero = $request->tendero;
        $mensaje = $incidenteDao->registrar_enlaces_interes($titulo, $url);
        echo json_encode($mensaje);
        break;
    case 'actualizar':

        break;
    case 'eliminar':
        break;
}
