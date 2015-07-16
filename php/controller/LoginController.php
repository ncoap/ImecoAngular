<?php

session_start();
include '../dao/LoginDao.php';
$model = new LoginDao();

if (isset($_REQUEST['op'])) {
    $op = $_REQUEST['op'];
} else {
    header('Location: ../../admin.php');
}

switch ($op) {
    case 1:
        unset($_SESSION['acceso']);
        unset($_SESSION['rol']);
        unset($_SESSION['usuario']);

        $usu = $_REQUEST['user'];
        $pass = $_REQUEST['pass'];
        $respuesta = $model->logeUsu($usu, $pass);
        if ($respuesta == false) {
            $_SESSION['acceso'] = false;
            header('Location: ../../index.php');
        } else {
            $_SESSION['acceso'] = true;
            $_SESSION['usuario'] = $respuesta->usuario;
            $_SESSION['rol'] = $respuesta->rol;

            if ($respuesta->rol == 'ADMINISTRADOR') {
                header('Location: ../../admin.php');
            } else {
//                JEFE DE TIENDA
                header('Location: ../../jefe.php');
            }
        }
        break;
    case 2:
        session_unset($_SESSION['acceso']);
        session_unset($_SESSION['rol']);
        session_unset($_SESSION['usuario']);
        header('Location: ../../index.php');
        break;
    default :
        header('Location: ../../index.php');
        break;
}