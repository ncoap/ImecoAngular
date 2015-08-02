<?php

//$postdata = file_get_contents("php://input");
//$request = json_decode($postdata);
//$accion = $request->accion;

$accion = $_GET['accion'];

include '../dao/SensomatizadoDao.php';
$sensomatizadoDao = new SensomatizadoDao();

switch ($accion) {
    case 'multiple':
        $pagina = $_GET['pagina'];
        $terminos = json_decode($_REQUEST['terminos']);
        echo json_encode($sensomatizadoDao->listarNoSensomatizados($pagina,$terminos));
        break;
    case 'detalle':
        $id = $_GET['id'];
        echo json_encode($sensomatizadoDao->get_detalle_sensor_by_id($id));
        break;
    case 'get_name_prevencionista_by_dni':
        $dni = $_GET['dni'];
        echo json_encode($sensomatizadoDao->get_name_prevencionista_by_dni($dni));
        break;
}
