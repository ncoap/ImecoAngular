<?php

class Conexion {

    public function getConexion() {
        $cnx = new PDO("mysql:host=localhost;dbname=imeco", "root", "1234", array(PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES  \"UTF8\""));
        return $cnx;
    }
}