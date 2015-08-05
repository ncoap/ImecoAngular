<?php

$accion = $_GET['accion'];

include '../dao/TiendaDao.php';

try {
    $tiendaDao = new TiendaDao();
} catch (PDOException $e) {
    $accion = "KK";
}

switch ($accion) {
    case 'listar':
        echo json_encode($tiendaDao->sp_get_tiendas());
        break;
    case 'KK':
        echo json_encode(array('msj'=>'KK'));
        break;
}
