<?php

require_once '../util/util.php';

class IntervencionModel {

    private $pdo;

    public function __CONSTRUCT() {
        $db_cone = new util();
        $this->pdo = $db_cone->getConexion();
    }

    public function logeUsu($usu, $pass) {
        $result = array();

        $stm = $this->pdo->prepare("call sp_login (?,?)");
        $stm->execute(array($usu, $pass));
        
        return $stm->fetchAll(PDO::FETCH_OBJ);
    }

    public function listarIntervenciones($col_tienda, $col_tendero, $col_dni, $col_sexo, $col_tipoTendero, $col_fecha_desde, $col_fecha_hasta) {

        $stm = $this->pdo->prepare("CALL listado_intervenciones_multiple(?,?,?,?,?,?,?)");
        $stm->execute(array($col_tienda, $col_tendero, $col_dni, $col_sexo, $col_tipoTendero, $col_fecha_desde, $col_fecha_hasta));
        return $stm->fetchAll(PDO::FETCH_OBJ);
    }
    
    public function get_datalle_by_id($id) {

        $stm = $this->pdo->prepare("CALL get_datalle_by_id(?)");
        $stm->execute(array($id));
        return $stm->fetchAll(PDO::FETCH_OBJ);
    }
    
    public function get_tendero_by_dni($dni) {
        $stm = $this->pdo->prepare("CALL get_tendero_by_dni(?)");
        $stm->execute(array($dni));
        return $stm->fetchAll(PDO::FETCH_OBJ);
    }
    
    

}
