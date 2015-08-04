<?php

include '../dao/ContinuidadDao.php';

$postdata = file_get_contents("php://input");
$request = json_decode($postdata);
$accion = $request->accion;

$continuidadDao = new ContinuidadDao();

switch ($accion) {
    case 'registrar':
        $data = $request->data;
        $mensaje = $continuidadDao->sp_register($data);
        echo json_encode($mensaje);
        break;
    case 'actualizar':
        $data = $request->data;
        $mensaje = $continuidadDao->sp_update($data);
        echo json_encode($mensaje);
        break;
    case 'remove_item':
        $data = $request->data;
        $mensaje = $continuidadDao->sp_delete_item($data->idDetOperatividad);
        echo json_encode($mensaje);
        break;
}
