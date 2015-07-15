<?php

include '../conexion/Conexion.php';

//$tildes = $cn->query("SET NAMES 'utf8'");

class SensomatizadoDao {

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

    public function sp_listar_productos_no_sensomatizados() {

        $stm = $this->pdo->prepare("CALL sp_listar_productos_no_sensomatizados()");
        $stm->execute();
        return $stm->fetchAll(PDO::FETCH_OBJ);
    }

    public function sp_register_producto_no_sensomatizado($pro) {

        $respuesta = array('msj' => 'OK', 'error' => '');
        try {
            
            $stm = $this->pdo->prepare("CALL sp_register_producto_no_sensomatizado(?,?,?,?,?,?,?,?,?,?,?,?)");

            date_default_timezone_set('America/Lima');
            $fechita = date('Y-m-d H:i:s', strtotime(urldecode($pro->fecha)));
            $stm->execute(array($pro->dni,$pro->intervencionista,$fechita,$pro->codigo,$pro->descripcion,$pro->marca,$pro->cantidad,$pro->precio,$pro->total,$pro->observaciones,$pro->foto,$pro->tienda));
            
        } catch (PDOException $e) {
            $respuesta['msj'] = 'KO';
            $respuesta['error'] = $e->getMessage();
        }

        return $respuesta;
    }

}
