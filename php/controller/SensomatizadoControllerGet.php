<?php

//$postdata = file_get_contents("php://input");
//$request = json_decode($postdata);
//$accion = $request->accion;

$accion = $_GET['accion'];

include '../dao/SensomatizadoDao.php';
$sensomatizadoDao = new SensomatizadoDao();

switch ($accion) {
    case 'listar':
        echo json_encode($sensomatizadoDao->sp_listar_productos_no_sensomatizados());
        break;
    case 'multiple':
        $terminos = json_decode($_REQUEST['terminos']);
        echo json_encode($sensomatizadoDao->listarNoSensomtizados($terminos));
        break;
    case 'registrar':

        break;
    case 'actualizar':

        break;
    case 'eliminar':

        break;
    case 'detalle':
        $id = $_GET['id'];
        echo json_encode($intervencionDao->get_detalle_intervencion_by_id($id));
        break;
}
