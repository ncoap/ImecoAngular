<?php

$accion = $_GET['accion'];

include '../dao/GraficaDao.php';
$graficaDao = new GraficaDao();

switch ($accion) {
    case 'consolidados':

        $fecha = $_GET['fecha'];

        echo json_encode($graficaDao->chart_num_intervenciones_vs_total_recuperado_por_tienda($fecha));
        break;

    case 'ejecutivo':

        $opcion = $_GET['opcion'];
        $fecha = $_GET['fecha'];
        $hora_inicial = $_GET['horaInicial'];
        $hora_final = $_GET['horaFinal'];
        $sexo = $_GET['sexo'];

        echo json_encode($graficaDao->chart_ejecutivo($opcion, $fecha, $hora_inicial, $hora_final, $sexo));
        break;
    
    case 'ejecutivo2':

        $opcion = $_GET['opcion'];
        $fecha = $_GET['fecha'];
        $hora_inicial = $_GET['horaInicial'];
        $hora_final = $_GET['horaFinal'];
        $sexo = $_GET['sexo'];

        echo json_encode($graficaDao->chart_ejecutivo_2($opcion, $fecha, $hora_inicial, $hora_final, $sexo));
        break;

    case 'recuperos_por_prevencionista':

        $idtienda = $_GET['idtienda'];
        $fecha = $_GET['fecha'];

        echo json_encode($graficaDao->chart_recuperos_por_prevencionista($idtienda, $fecha));
        break;
}
