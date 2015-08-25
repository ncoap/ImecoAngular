<?php
//$postdata = file_get_contents("php://input");
//$request = json_decode($postdata);
//$accion = $request->accion;

$accion = $_GET['accion'];

include '../dao/InformeDao.php';
$informeDao = new InformeDao();

switch ($accion) {
    case 'multiple':
        $terminos = json_decode($_REQUEST['terminos']);
        echo json_encode($informeDao->listar($terminos));
        break;
    case 'get_name_prevencionista_by_dni':
        $dni = $_GET['dni'];
        echo json_encode($informeDao->get_name_by_dni($dni));
        break;
}
