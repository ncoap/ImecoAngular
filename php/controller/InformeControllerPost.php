<?php

include '../dao/InformeDao.php';

$postdata = file_get_contents("php://input");
$request = json_decode($postdata);
$accion = $request->accion;
$informeDao = new InformeDao();

switch ($accion) {
    case 'registrar':
        $data = $request->data;
        $mensaje = $informeDao->sp_register($data);
        echo json_encode($mensaje);
        break;

    case 'actualizar':
        $data = $request->data;
        $mensaje = $informeDao->sp_actualizar($data);
        echo json_encode($mensaje);
        break;

    case 'eliminar':
        $data = $request->data;
        $mensaje = $informeDao->sp_delete($data->id);
        echo json_encode($mensaje);
        break;
}
