<?php

$accion = $_GET['accion'];

include '../dao/TenderoDao.php';
$tenderoDao = new TenderoDao();

switch ($accion) {
    case 'isExist':
        $dni = $_GET['dni'];
        echo json_encode($tenderoDao->exist_tendero_by_dni($dni));
        break;
    case 'buscar':
        $dni = $_GET['dni'];
        echo json_encode($tenderoDao->get_tendero_by_dni($dni));
        break;
}
