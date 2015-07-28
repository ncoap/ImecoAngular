<?php

$formatos = array('.jpg', '.png');
$nombreArchivo = $_FILES['file']['name'];
$nombreTmpArchivo = $_FILES['file']['tmp_name'];
//$producto = $_REQUEST['producto'];
//$postdata = file_get_contents("php://input");
//$request = json_decode($postdata);
//$producto = $request['producto'];

$directorio = '../../view/imagen_no_sensomatizados';
$ext = substr($nombreArchivo, strrpos($nombreArchivo, '.'));

if (in_array($ext, $formatos)) {
    try {
        if (move_uploaded_file($nombreTmpArchivo, "$directorio/$nombreArchivo")) {

            //si la imagen subio entonces registramos el producto
            echo json_encode(array("msj" => "OK"));
        } else {
            echo json_encode("KO");
        }
    } catch (Exception $e) {
        echo json_encode($e->getMessage());
    }
} else {
    echo "Solo cargue imagenes JPG o PNG";
}

