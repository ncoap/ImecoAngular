<?php

$accion = $_GET['accion'];

include '../dao/GraficaDao.php';
$graficaDao = new GraficaDao();

switch ($accion) { 
    case 'consolidados':
        
        $fecha = $_GET['fecha'];
        
        echo json_encode($graficaDao->chart_num_intervenciones_vs_total_recuperado_por_tienda($fecha));
        break;
    
    case 'recuperos_por_prevencionista':
        
        $idtienda = $_GET['idtienda'];
        $fecha = $_GET['fecha'];
        
        echo json_encode($graficaDao->chart_recuperos_por_prevencionista($idtienda,$fecha));
        break;
}
