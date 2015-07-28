<?php

$accion = $_GET['accion'];

include '../dao/TiendaDao.php';
$tiendaDao = new TiendaDao();

switch ($accion) {
    case 'listar':
        echo json_encode($tiendaDao->sp_get_tiendas());
        break;
}
