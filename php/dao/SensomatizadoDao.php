<?php

include '../mysql/Conexion.php';

//$tildes = $cn->query("SET NAMES 'utf8'");

class SensomatizadoDao {

    private $pdo;

    public function __CONSTRUCT() {
        $db_cone = new Conexion();
        $this->pdo = $db_cone->getConexion();
    }

    public function listarNoSensomtizados($terminos) {

        $col_tienda = "t.id_tien like '%%'";

        if ($terminos->tienda != '0') {
            $col_tienda = "t.id_tien = " . $terminos->tienda->id;
        }

        $col_nombre = $terminos->nombre;
        $col_dni = $terminos->dni;

        date_default_timezone_set('America/Lima');
        $col_fecha_desde = date('Y-m-d H:i:s', strtotime(urldecode($terminos->fechaInicial)));
        $col_fecha_hasta = date('Y-m-d H:i:s', strtotime(urldecode($terminos->fechaFinal)));

        $stm = $this->pdo->prepare("CALL listado_productos_no_sensomatizados_multiple(?,?,?,?,?)");
        $stm->execute(array($col_tienda, $col_nombre, $col_dni, $col_fecha_desde, $col_fecha_hasta));
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
            $stm->execute(array($pro->dni, $pro->prevencionista, $fechita, $pro->codigo, $pro->descripcion, $pro->marca, $pro->cantidad, $pro->precio, $pro->total, $pro->observaciones, $pro->foto, $pro->tienda->id));
        } catch (PDOException $e) {
            $respuesta['msj'] = 'KO';
            $respuesta['error'] = $e->getMessage();
        }

        return $respuesta;
    }
    
    public function sp_actualizar_producto_no_sensomatizado($pro) {

        $respuesta = array('msj' => 'OK', 'error' => '');
        try {

            $stm = $this->pdo->prepare("CALL sp_update_producto_no_sensomatizado(?,?,?,?,?,?,?,?,?,?,?,?,?)");

            date_default_timezone_set('America/Lima');
            $fechita = date('Y-m-d H:i:s', strtotime(urldecode($pro->fecha)));
            $stm->execute(array($pro->id,$pro->dni, $pro->prevencionista, $fechita, $pro->codigo, $pro->descripcion, $pro->marca, $pro->cantidad, $pro->precio, $pro->total, $pro->observaciones, $pro->foto, $pro->tienda->id));
        } catch (PDOException $e) {
            $respuesta['msj'] = 'KO';
            $respuesta['error'] = $e->getMessage();
        }

        return $respuesta;
    }

    function sp_delete_producto_no_sensomatizado($id_producto) {

        $respuesta = array('msj' => 'OK', 'error' => '');
        try {

            $stm = $this->pdo->prepare("CALL sp_delete_producto_no_sensomatizado(?)");
            $stm->execute(array($id_producto));
        } catch (PDOException $e) {
            $respuesta['msj'] = 'KO';
            $respuesta['error'] = $e->getMessage();
        }

        return $respuesta;
    }

}
