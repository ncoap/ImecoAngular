<?php

$postdata = file_get_contents("php://input");
$request = json_decode($postdata);
$accion = $request->accion;

switch ($accion) {
    case 'listar':
        
        break;
    case 'registrar':
        
        break;
    case 'actualizar':
        
        break;
    case 'eliminar':
        
        break;
}
