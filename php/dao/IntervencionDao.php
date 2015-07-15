<?php

include '../conexion/Conexion.php';

//$tildes = $cn->query("SET NAMES 'utf8'");

class IntervencionDao {

    private $pdo;

    public function __CONSTRUCT() {
        $db_cone = new Conexion();
        $this->pdo = $db_cone->getConexion2();
    }

    public function listarIntervenciones($terminos) {

        $col_tienda = "ti.id_tien like '%%'";
        $col_tipoTendero = "tipo.id_tip_ten like '%%'";

        if ($terminos->tienda != '0') {
            $col_tienda = "ti.id_tien = " . $terminos->tienda;
        }

        if ($terminos->tipo != '0') {
            $col_tipoTendero = "tipo.id_tip_ten = " . $terminos->tipo;
        }

        $col_tendero = $terminos->nombre;
        $col_dni = $terminos->dni;
        $col_sexo = $terminos->sexo;

        date_default_timezone_set('America/Lima');
        $col_fecha_desde = date('Y-m-d H:i:s', strtotime(urldecode($terminos->fechaInicial)));
        $col_fecha_hasta = date('Y-m-d H:i:s', strtotime(urldecode($terminos->fechaFinal)));

        $stm = $this->pdo->prepare("CALL listado_intervenciones_multiple(?,?,?,?,?,?,?)");
        $stm->execute(array($col_tienda, $col_tendero, $col_dni, $col_sexo, $col_tipoTendero, $col_fecha_desde, $col_fecha_hasta));
        return $stm->fetchAll(PDO::FETCH_OBJ);
    }

    public function sp_listar_intervenciones() {

        $stm = $this->pdo->prepare("CALL sp_listar_intervenciones()");
        $stm->execute();
        return $stm->fetchAll(PDO::FETCH_OBJ);
    }

    public function get_detalle_intervencion_by_id($id) {

        $stm = $this->pdo->prepare("CALL get_detalle_intervencion_by_id(?)");
        $stm->execute(array($id));
        return $stm->fetchAll(PDO::FETCH_OBJ);
    }

    public function sp_get_ultimos_tenderos() {
        $stm = $this->pdo->prepare("CALL sp_get_ultimos_tenderos()");
        $stm->execute();
        return $stm->fetchAll(PDO::FETCH_OBJ);
    }

}
