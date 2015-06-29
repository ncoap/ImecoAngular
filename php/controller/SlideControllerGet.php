<?php

$accion = $_GET['accion'];

include '../dao/SlideDao.php';

switch ($accion) {
    case 'listar':
        $slideDao = new SlideDao();
        echo json_encode($slideDao->listar_slide_principal());
        break;
}
