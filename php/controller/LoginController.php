<?php
session_start();
require_once '../model/intervencion.model.php';
$model = new IntervencionModel();

if (isset($_REQUEST['op'])) {
    $op = $_REQUEST['op'];
} else {
    header('Location: ../../admin2.php');
}

switch ($op) {
    case 1:
        unset($_SESSION['logeusu']);
        $usu = $_REQUEST['user'];
        $pass = $_REQUEST['pass'];
        $logeusu = $model->logeUsu($usu, $pass);
        // foreach ($logeusu as $raw) {
        //     $nomusu = $raw[1];
        //     $codusu = $raw[0];
        //     $rol = $raw[2];
        // }
        if ($logeusu[0]->resp == 'success') {
            // $_SESSION['nomusu'] = $nomusu;
            // $_SESSION['codusu'] = $codusu;
            // $_SESSION['rol'] = $rol;
            $_SESSION['acceso'] = true;
            header('Location: ../../admin2.php');
        } else {
            $_SESSION['msg'] = 'Error de Usuario';
            header('Location: ../../index.php');
        }
        break;
    case 2:
        session_unset($_SESSION['acceso']);
        session_unset($_SESSION['codusu']);
        session_unset($_SESSION['rol']);
        session_unset($_SESSION['nomusu']);
        session_unset($_SESSION['msg']);
        header('Location: ../../index.php');
        break;
    default :
        header('Location: ../../index.php');
        break;
}