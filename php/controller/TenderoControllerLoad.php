<?php

$formatos = array('.jpg', '.png');
$nombreArchivo = $_FILES['file']['name'];
$nombreTmpArchivo = $_FILES['file']['tmp_name'];
$nombresito = $_REQUEST['nombre'];

$directorio = '../../view/imagen_tendero';
$ext = substr($nombreArchivo, strrpos($nombreArchivo, '.'));

if (in_array($ext, $formatos)) {
    try {
        if (move_uploaded_file($nombreTmpArchivo, "$directorio/$nombresito" . '.jpg')) {
            echo json_encode(array("msj" => "OK","mensaje"=>''));
        } else {
            echo json_encode(array("msj" => "KO","mensaje"=>'No se pudo Subir la Imagen'));
        }
    } catch (Exception $e) {
        echo json_encode($e->getMessage());
    }
} else {
    echo json_encode(array("msj" => "KO",'mensaje'=>'Solo Formatos JPG Y PNG'));
}

