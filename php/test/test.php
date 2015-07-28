<?php

include '../conexion/Conexion.php';

$cnx = new Conexion();
$cn = $cnx->getConexion();

$res = $cn->prepare('CALL sp_imagen_is_local(:p_id_slide)');
$param = 13;
$res->bindParam(":p_id_slide", $param);
$res->execute();
$respuesta = $res->fetch();

if($respuesta <> NULL){
    $url = $respuesta["url"];
    echo $url;
    echo '<br>';
    $url_valid = substr($url, 0, 7);
    if($url_valid == 'http://'){
        echo "internet";
        //eliminar de la base de datos
    }
    else{
        echo "local";
        //eliminar localmente
        unlink("../../$url");
    }
    
//    echo "asdasd";
}else{
    echo "sin resultados";
}


