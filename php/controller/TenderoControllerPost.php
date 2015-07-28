<?php

include '../dao/TenderoDao.php';

$postdata = file_get_contents("php://input");
$request = json_decode($postdata);
$accion = $request->accion;
$tenderoDao = new TenderoDao();

switch ($accion) {
    case 'registrar':
        $tendero = $request->tendero;
        $respuesta = $tenderoDao->sp_registrar_tendero($tendero);
        echo json_encode($respuesta);
        break;
    case 'actualizar':
        $tendero = $request->tendero;
        $respuesta = $tenderoDao->sp_update_tendero($tendero);
        echo json_encode($respuesta);
        break;
    case 'eliminar':
        break;
}
