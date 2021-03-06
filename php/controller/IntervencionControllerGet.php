<?php

//$postdata = file_get_contents("php://input");
//$request = json_decode($postdata);
//$accion = $request->accion;

$accion = $_GET['accion'];

include '../dao/IntervencionDao.php';
$intervencionDao = new IntervencionDao();

switch ($accion) {
    case 'multiple':
        $pagina = $_GET['pagina'];
        $terminos = json_decode($_REQUEST['terminos']);
        echo json_encode($intervencionDao->listarIntervenciones($pagina,$terminos));
        break;
    case 'ultimos':
        echo json_encode($intervencionDao->sp_get_ultimos_intervenciones());
        break;
    case 'detalle':
        $id = $_GET['id'];
        echo json_encode($intervencionDao->get_detalle_intervencion_by_id($id));
        break;
    case 'get_name_prevencionista_by_dni':
        $dni = $_GET['dni'];
        echo json_encode($intervencionDao->get_name_prevencionista_by_dni($dni));
        break;
}
