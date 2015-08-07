<?php

include '../dao/LoginDao.php';

$postdata = file_get_contents("php://input");
$request = json_decode($postdata);
$loginDao = new LoginDao();

$username = $request->usuario->username;
$password = $request->usuario->password;

echo json_encode($loginDao->logeUsu($username, $password));
