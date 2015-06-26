<?php

include '../dao/dao.php';
$objDAO = new dao();
$enlaces_interes = $objDAO->enlaces_interes();
echo json_encode($enlaces_interes);