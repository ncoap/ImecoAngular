<?php

include '../util/util.php';
$cnx = new util();
$cn = $cnx->getConexion();

$tildes = $cn->query("SET NAMES 'utf8'");

$postdata = file_get_contents("php://input");
$request = json_decode($postdata);
$titulo = $request->titulo;
$enlace = $request->enlace;
$res = $cn->prepare("CALL sp_registrar_enlace_interes(:p_titulo, :p_enlace)");
$res->bindParam(":p_titulo", $titulo);
$res->bindParam(":p_enlace", $enlace);
$res->execute();
echo json_encode("OK");

