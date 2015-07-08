<?php

include '../dao/EnlaceDao.php';

$postdata = file_get_contents("php://input");
$request = json_decode($postdata);
$accion = $request->accion;
$enlaceDao = new EnlaceDao();

switch ($accion) {
    case 'registrar':
        $titulo = $request->data->titulo;
        $url = $request->data->url;
        $mensaje = $enlaceDao->registrar_enlaces_interes($titulo, $url);
        echo json_encode($mensaje);
        break;
    case 'actualizar':

        break;
    case 'eliminar':
        $id = $request->data->id;
        $mensaje = $enlaceDao->eliminar_enlaces_interes($id);
        echo json_encode($mensaje);
        break;
}
