<?php

//include '../dao/TenderoDao.php';
//
//$tenderoDao = new TenderoDao();
//
//
//$tenderoDao->sp_get_id_tendero_by_dni('46435523');

include '../dao/LoginDao.php';

$loginDao = new LoginDao();

$res = $loginDao->logeUsu('admin', '1234');

//json_encode .... print false
if ($res == false) {
    echo '00000';
} else {
    echo $res->usuario;
}

//echo json_encode($res[0]);
