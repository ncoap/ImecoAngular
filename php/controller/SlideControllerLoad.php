<?php

include '../dao/SlideDao.php';
$slideDao = new SlideDao();

$formatos = array('.jpg', '.png');
$nombreArchivo = $_FILES['file']['name'];
$nombreTmpArchivo = $_FILES['file']['tmp_name'];
$directorio = '../../view/slide/imagenes';
$ext = substr($nombreArchivo, strrpos($nombreArchivo, '.'));

if (in_array($ext, $formatos)) {
    date_default_timezone_set('America/Lima');
    $rename = str_replace(' ', '', $nombreArchivo);
    $filename = date("dmYhis").$rename;
    if (move_uploaded_file($nombreTmpArchivo, "$directorio/$filename")) {
        $mensaje = $slideDao->registrar_slide_principal("view/slide/imagenes/$filename");
        echo json_encode("OK");
    } else {
        echo json_encode("KO");
    }
} else {
    echo "Solo cargue imagenes JPG o PNG";
}

