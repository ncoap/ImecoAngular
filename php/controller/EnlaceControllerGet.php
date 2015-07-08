<?php

$accion = $_GET['accion'];

include '../dao/EnlaceDao.php';

//$postdata = file_get_contents("php://input");
//$request = json_decode($postdata);
//$accion = $request->accion;
//echo json_encode($request);
//
//
switch ($accion) {
    case 'listar':
        $enlaceDao = new EnlaceDao();
        echo json_encode($enlaceDao->listar_enlaces_interes());
        break;
    case 'registrar':

        break;
    case 'actualizar':

        break;
    case 'eliminar':

        break;
}
