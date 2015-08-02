<?php


$accion = $_GET['accion'];

include '../dao/ContinuidadDao.php';
$continuidadDao = new ContinuidadDao();

switch ($accion) {
    case 'listar':
        echo json_encode($continuidadDao->listar());
        break;
}
