<?php

$accion = $_GET['accion'];

include '../dao/TenderoDao.php';
$tenderoDao = new TenderoDao();

switch ($accion) {
    case 'buscar':
        $dni = $_GET['dni'];
        echo json_encode($tenderoDao->get_tendero_by_dni($dni));
        break;
}
