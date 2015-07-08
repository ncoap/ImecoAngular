<?php

//$postdata = file_get_contents("php://input");
//$request = json_decode($postdata);
//$accion = $request->accion;

$accion = $_GET['accion'];

include '../dao/IntervencionDao.php';
$intervencionDao = new IntervencionDao();

switch ($accion) {
    case 'listar':
        echo json_encode($intervencionDao->sp_listar_intervenciones());
        break;
    case 'registrar':

        break;
    case 'actualizar':

        break;
    case 'eliminar':

        break;
    case 'detalle':
        $id = $_GET['id'];
        echo json_encode($intervencionDao->get_datalle_intervencion_by_id($id));
        break;
}
