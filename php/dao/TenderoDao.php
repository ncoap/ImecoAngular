<?php

include '../conexion/Conexion.php';

//$tildes = $cn->query("SET NAMES 'utf8'");

class TenderoDao {
    
    private $pdo;

    public function __CONSTRUCT() {
        $db_cone = new Conexion();
        $this->pdo = $db_cone->getConexion2();
    }

    public function exist_tendero_by_dni($dni) {

        //return object {exist:0} {exist:1}
        $stm = $this->pdo->prepare("CALL exist_tendero_by_dni(?)");
        $stm->execute(array($dni));
        return $stm->fetch(PDO::FETCH_OBJ);
    }
    
    public function sp_registrar_tendero($tendero){
        $stm = $this->pdo->prepare("CALL sp_registrar_tendero(?,?,?,?,?,?,?,?)");
        $stm->execute(array($tendero));
        return "OK";
    }

}
