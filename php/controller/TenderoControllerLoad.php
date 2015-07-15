<?php

//ini_set('upload-max-filesize', '10M');
//ini_set('post_max_size', '10M');
$formatos = array('.jpg', '.png');
$nombreArchivo = $_FILES['file']['name'];
$nombreTmpArchivo = $_FILES['file']['tmp_name'];
$nombresito = $_REQUEST['nombre'];

//echo json_encode($nombresito);
//$nombresito = $_FILES['nombre']['nombre'];
//echo $nombresito;

$directorio = '../../view/imagen_tendero';
$ext = substr($nombreArchivo, strrpos($nombreArchivo, '.'));

if (in_array($ext, $formatos)) {
//    date_default_timezone_set('America/Lima');
//    $rename = str_replace(' ', '', $nombreArchivo);
//    $filename = date("dmYhis") . $rename;
    try {
        if (move_uploaded_file($nombreTmpArchivo, "$directorio/$nombresito" . '.jpg')) {
            echo json_encode("OK");
        } else {
            echo json_encode("KO");
        }
    } catch (Exception $e) {
        echo json_encode($e->getMessage());
    }
} else {
    echo "Solo cargue imagenes JPG o PNG";
}

