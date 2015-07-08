<?php

include '../dao/TenderoDao.php';

$postdata = file_get_contents("php://input");
$request = json_decode($postdata);
$accion = $request->accion;
$tenderoDao = new TenderoDao();

switch ($accion) {
    case 'registrar':
        $tendero = $request->tendero;
        $mensaje = $enlaceDao->registrar_enlaces_interes($titulo, $url);
        echo json_encode($mensaje);
        break;
    case 'actualizar':

        break;
    case 'eliminar':
        break;
}
