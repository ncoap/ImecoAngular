<?php

include '../dao/SlideDao.php';

$postdata = file_get_contents("php://input");
$request = json_decode($postdata);
$accion = $request->accion;
$slideDao = new SlideDao();

switch ($accion) {
    case 'registrar':
        $url = $request->data->url;
        $mensaje = $slideDao->registrar_slide_principal($url);
        echo json_encode($mensaje);
        break;
    case 'eliminar':
        $id = $request->data->id;
        $mensaje = $slideDao->eliminar_slide_principal($id);
        echo json_encode($mensaje);
        break;
}
