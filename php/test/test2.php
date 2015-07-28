<?php
$hoy = getdate();
print_r($hoy);
echo "<br>";
date_default_timezone_set('America/Lima');
echo date("dmYhis");
echo "<br>"; 
$nombre ="100 20 300";
echo $nombre;
echo "<br>";
echo str_replace(' ', '', $nombre);