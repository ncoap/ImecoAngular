<?php

$accion = $_GET['accion'];

include '../dao/TenderoDao.php';
$tenderoDao = new TenderoDao();

switch ($accion) {
    case 'isExist':
        $dni = $_GET['dni'];
        echo json_encode($tenderoDao->exist_tendero_by_dni($dni));
        break;
}
