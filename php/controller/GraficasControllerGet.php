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
        $meses = $_GET['meses'];
        echo json_encode($graficaDao->chart_ejecutivo_2($opcion, $fecha, $hora_inicial, $hora_final, $sexo,$meses));
        break;

    case 'recuperos_por_prevencionista':
        $idtienda = $_GET['idtienda'];
        $opcion = $_GET['opcion'];
        $fecha = $_GET['fecha'];
        $hora_inicial = $_GET['horaInicial'];
        $hora_final = $_GET['horaFinal'];
        $sexo = $_GET['sexo'];

        echo json_encode($graficaDao->chart_recuperos_por_prevencionista($idtienda, $opcion, $fecha, $hora_inicial, $hora_final, $sexo));
        break;

    case 'reporte_incidente':
        $opcion = $_GET['opcion'];
        $fecha = $_GET['fecha'];
        $hora_inicial = $_GET['horaInicial'];
        $hora_final = $_GET['horaFinal'];

        echo json_encode($graficaDao->chart_incidente(1,0,$opcion, $fecha, $hora_inicial, $hora_final));
        break;

    case 'reporte_det_incidente':
        $idTienda = $_GET['idtienda'];
        $opcion = $_GET['opcion'];
        $fecha = $_GET['fecha'];
        $hora_inicial = $_GET['horaInicial'];
        $hora_final = $_GET['horaFinal'];
        // num reporte 2 para el detalle
        echo json_encode($graficaDao->chart_incidente_2(2,$idTienda,$opcion, $fecha, $hora_inicial, $hora_final));
        break;

    case 'reporte_main_sensomatizado':
        $opcion = $_GET['opcion'];
        $fecha = $_GET['fecha'];
        $hora_inicial = $_GET['horaInicial'];
        $hora_final = $_GET['horaFinal'];
        // num reporte 2 para el detalle
        echo json_encode($graficaDao->reporte_main_sensomatizado(1,0,$opcion, $fecha, $hora_inicial, $hora_final));
        break;

    case 'reporte_det_sensomatizado':
        $idTienda = $_GET['idtienda'];
        $opcion = $_GET['opcion'];
        $fecha = $_GET['fecha'];
        $hora_inicial = $_GET['horaInicial'];
        $hora_final = $_GET['horaFinal'];
        // num reporte 2 para el detalle
        echo json_encode($graficaDao->reporte_det_sensomatizado(2,$idTienda,$opcion, $fecha, $hora_inicial, $hora_final));
        break;

}
