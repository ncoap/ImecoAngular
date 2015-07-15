<?php
session_start();
require_once '../dao/LoginDao.php';
$model = new LoginDao();

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
        if ($logeusu[0]->resp == 'success') {
            $_SESSION['acceso'] = true;
            header('Location: ../../admin2.php');
        } else {
            $_SESSION['msg'] = 'Error de Usuario';
            header('Location: ../../index.php');
        }
        break;
    default :
        header('Location: ../../index.php');
        break;
}