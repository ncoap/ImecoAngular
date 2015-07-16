<?php

include '../mysql/Conexion.php';

class LoginDao {

    private $pdo;

    public function __CONSTRUCT() {
        $db_cone = new Conexion();
        $this->pdo = $db_cone->getConexion();
    }

    public function logeUsu($usu, $pass) {
        
        $stm = $this->pdo->prepare("call sp_login (?,?)");
        $stm->execute(array($usu, $pass));
        return $stm->fetch(PDO::FETCH_OBJ);        
    }

}
