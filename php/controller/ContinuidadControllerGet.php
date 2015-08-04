<?php


$accion = $_GET['accion'];

include '../dao/ContinuidadDao.php';
$continuidadDao = new ContinuidadDao();

switch ($accion) {
    case 'listar':
        $idProducto = $_GET['idProducto'];
        echo json_encode($continuidadDao->listar($idProducto));
        break;
}
