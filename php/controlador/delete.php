<?php

include '../util/util.php';
$cnx = new util();
$cn = $cnx->getConexion();

$tildes = $cn->query("SET NAMES 'utf8'");

$postdata = file_get_contents("php://input");
$request = json_decode($postdata);
$id_enlace = $request->id;
$res = $cn->prepare("CALL sp_eliminar_enlace_interes(:p_id_enlace)");
$res->bindParam(":p_id_enlace", $id_enlace);
$res->execute();
echo json_encode("OK");

