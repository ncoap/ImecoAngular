<?php
$accion = $_GET['accion'];

include '../dao/IncidenteDao.php';
$incidenteDao = new IncidenteDao();

switch ($accion) {
    case 'multiple':
        $pagina = $_GET['pagina'];
        $terminos = json_decode($_REQUEST['terminos']);
        echo json_encode($incidenteDao->listar($pagina,$terminos));
        break;
    case 'detalle':
        $id = $_GET['id'];
        echo json_encode($incidenteDao->get_detalle_by_id($id));
        break;
    case 'get_name_involucrado_by_dni':
        $dni = $_GET['dni'];
        echo json_encode($incidenteDao->get_name_involucrado_by_dni($dni));
        break;
}
