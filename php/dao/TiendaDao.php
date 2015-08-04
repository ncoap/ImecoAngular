<?php

include '../mysql/Conexion.php';

class TiendaDao {

    private $pdo;

    public function __CONSTRUCT() {
        $db_cone = new Conexion();
        $this->pdo = $db_cone->getConexion();
    }

    public function sp_get_tiendas() {
        $respuesta =  array('productos'=>'','tiendas'=>'');
        $db_conec = new Conexion();
        $pdo = $db_conec->getConexion();
        $stm = $pdo->prepare("CALL sp_get_tiendas()");
        $stm->execute();
        $respuesta['tiendas'] = $stm->fetchAll(PDO::FETCH_OBJ);
        $respuesta['productos'] = $this->sp_get_productos();
        return $respuesta;
    }


    public function sp_get_productos() {
        $db = new Conexion();
        $pdo = $db->getConexion();
        $stm = $pdo->prepare("CALL sp_get_productos()");
        $stm->execute();
        return $stm->fetchAll(PDO::FETCH_OBJ);
    }


}
