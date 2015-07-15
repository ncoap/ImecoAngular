<?php

//include '../dao/TenderoDao.php';
//
//$tenderoDao = new TenderoDao();
//
//
//$tenderoDao->sp_get_id_tendero_by_dni('46435523');

include '../conexion/Conexion.php';

$db_cone = new Conexion();
$pdo = $db_cone->getConexion2();
$stm = $pdo->prepare("call test(15)");
$stm->execute();
$res = $stm->fetch(PDO::FETCH_OBJ);
//retorna el nuevo id de la funcoin
echo $res->newid;
