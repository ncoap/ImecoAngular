<?php

include '../mysql/Conexion.php';

class TiendaDao {

    private $pdo;

    public function __CONSTRUCT() {
        $db_cone = new Conexion();
        $this->pdo = $db_cone->getConexion();
    }

    public function sp_get_tiendas() {
        $db_conec = new Conexion();
        $pdo = $db_conec->getConexion();
        $stm = $pdo->prepare("CALL sp_get_tiendas()");
        $stm->execute();
        return $stm->fetchAll(PDO::FETCH_OBJ);
    }

}
