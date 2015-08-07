<?php

class Conexion {

    //CONEXTION LOCAL
    public function getConexion() {
        $pdo = new PDO("mysql:host=localhost;dbname=prevevbl_odiseamysql", "root", "10200092", array(PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES  \"UTF8\"", PDO::ATTR_EMULATE_PREPARES => false));
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        return $pdo;
    }

    //CONEXION http://prevencionenlinea.com/index.php
   /* public function getConexion() {
       $pdo = new PDO("mysql:host=localhost;dbname=preve88h_odisea", "preve88h_victor", "F1l3serve", array(PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES  \"UTF8\""));
       $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        return $pdo;
    }*/
}
