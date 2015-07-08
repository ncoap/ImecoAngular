<?php

include '../conexion/Conexion.php';

//$tildes = $cn->query("SET NAMES 'utf8'");

class IntervencionDao {
    
    private $pdo;

    public function __CONSTRUCT() {
        $db_cone = new Conexion();
        $this->pdo = $db_cone->getConexion2();
    }

    public function listarIntervenciones($col_tienda, $col_tendero, $col_dni, $col_sexo, $col_tipoTendero, $col_fecha_desde, $col_fecha_hasta) {

        $stm = $this->pdo->prepare("CALL listado_intervenciones_multiple(?,?,?,?,?,?,?)");
        $stm->execute(array($col_tienda, $col_tendero, $col_dni, $col_sexo, $col_tipoTendero, $col_fecha_desde, $col_fecha_hasta));
        return $stm->fetchAll(PDO::FETCH_OBJ);
    }
    
    public function sp_listar_intervenciones() {

        $stm = $this->pdo->prepare("CALL sp_listar_intervenciones()");
        $stm->execute();
        return $stm->fetchAll(PDO::FETCH_OBJ);
    }
    
    public function get_datalle_intervencion_by_id($id) {

        $stm = $this->pdo->prepare("CALL get_datalle_intervencion_by_id(?)");
        $stm->execute(array($id));
        return $stm->fetchAll(PDO::FETCH_OBJ);
    }

}