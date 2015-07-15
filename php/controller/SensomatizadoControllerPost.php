<?php

include '../dao/SensomatizadoDao.php';

$postdata = file_get_contents("php://input");
$request = json_decode($postdata);
$accion = $request->accion;
$sensomatizadoDao = new SensomatizadoDao();

switch ($accion) {
    case 'registrar':
        $data = $request->data;
        $mensaje = $sensomatizadoDao->sp_register_producto_no_sensomatizado($data->producto);
        echo json_encode($mensaje);
        break;
    case 'actualizar':

        break;
    case 'eliminar':
        break;
}
