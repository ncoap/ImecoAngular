<?php

include '../mysql/Conexion.php';

//$tildes = $cn->query("SET NAMES 'utf8'");

class IntervencionDao {

    private $pdo;

    public function __CONSTRUCT() {
        $db_cone = new Conexion();
        $this->pdo = $db_cone->getConexion();
    }

    public function listarIntervenciones($terminos) {

        $col_tienda = "ti.id_tien like '%%'";
        $col_tipoTendero = "tipo.id_tip_ten like '%%'";

        if ($terminos->tienda != '0') {
            $col_tienda = "ti.id_tien = " . $terminos->tienda->idTienda;
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

    public function sp_register_intervencion($data) {

        $respuesta = array('msj' => 'OK', 'error' => '');
        try {
            $stm = $this->pdo->prepare("CALL sp_register_cab_interven(?,?,?,?,?,?,?,?,?,?,?,?)");

            $intervencion = $data->intervencion;
            date_default_timezone_set('America/Lima');
            $fechaCompletaIntervencion = date('Y-m-d H:i:s', strtotime(urldecode($intervencion->fechaCompletaIntervencion)));

            $stm->execute(array(
                $fechaCompletaIntervencion, $intervencion->idTendero, $intervencion->derivacionIntervencion, 
                $intervencion->lugarDerivacion,$intervencion->dniPrevencionista, $intervencion->nombrePrevencionista, 
                $intervencion->idPuesto,$intervencion->modalidadEmpleada, $intervencion->detalleIntervencion, 
                $intervencion->tienda->idTienda, $intervencion->totalRecuperado, $intervencion->tipoHurto));

            $res = $stm->fetch(PDO::FETCH_OBJ);

            $this->sp_register_detalle($res->newid, $data->productos);
            
        } catch (PDOException $e) {

            $respuesta['msj'] = 'KO';
            $respuesta['error'] = $e->getMessage();
        }

        return $respuesta;
    }

    public function sp_update_intervencion($data) {

        $respuesta = array('msj' => 'OK', 'error' => '');
        try {
            $stm = $this->pdo->prepare("CALL sp_update_cab_interven(?,?,?,?,?,?,?,?,?,?,?,?,?)");

            $intervencion = $data->intervencion;
            date_default_timezone_set('America/Lima');

            $fechita = date('Y-m-d H:i:s', strtotime(urldecode($intervencion->fechaCompletaIntervencion)));

            $stm->execute(array($intervencion->idIntervencion, $fechita, $data->idTendero, $intervencion->derivacionIntervencion, $intervencion->lugarDerivacion,
                $intervencion->dniPrevencionista, $intervencion->nombrePrevencionista, $intervencion->idPuesto,
                $intervencion->modalidadEmpleada, $intervencion->detalleIntervencion, $intervencion->tienda->idTienda,
                $intervencion->totalRecuperado,$intervencion->tipoHurto));

            $this->sp_delete_det_interven_by_num_inte($intervencion->idIntervencion);

            $this->sp_register_detalle($intervencion->idIntervencion, $data->productos);
        } catch (PDOException $e) {

            $respuesta['msj'] = 'KO';
            $respuesta['error'] = $e->getMessage();
        }

        return $respuesta;
    }

    public function sp_delete_det_interven_by_num_inte($idIntervencion) {

        $msj = array('msj' => 'OK', 'error' => '');

        //EL PDO COMINT ISRVE EN MOTORES INNODB
        try {
            $db_conect_det = new Conexion();
            $pdo_det = $db_conect_det->getConexion();
            $stm_det = $pdo_det->prepare("CALL sp_delete_det_interven_by_num_inte(?)");
            $stm_det->execute(array($idIntervencion));
        } catch (PDOException $e) {
            $msj['msj'] = 'KO';
            $msj['error'] = $e->getMessage();
        }
    }

    //INCIDENTE DAO 
    public function sp_get_id_tendero_by_dni($dni) {

        $respuesta = array('res' => false, 'id' => 0);
        try {
            $db_conec = new Conexion();
            $pdo = $db_conec->getConexion();
            $stm = $pdo->prepare("CALL sp_get_id_tendero_by_dni(?)");
            $stm->execute(array($dni));
            $res = $stm->fetch(PDO::FETCH_OBJ);
            if ($res == false) {
                
            } else {
                $respuesta['id'] = $res->id_ten;
                $respuesta['res'] = true;
            }
        } catch (PDOException $e) {
            
        }

        return $respuesta;
    }

    //SI GRABO LA CABECERA DEBEMOS DE GUARDAR EN ESE MOMENTO EL DETALLE
    public function sp_register_detalle($id_intervencion, $productos_json) {

        $productos = json_decode($productos_json);

        $msj = array('msj' => 'OK', 'error' => '');

        //EL PDO COMINT SIRVE EN MOTORES INNODB
        try {

            $db_conect_det = new Conexion();
            $pdo_det = $db_conect_det->getConexion();

            $stm_det = $pdo_det->prepare("CALL sp_register_det_interven(?,?,?,?,?,?)");
            $pdo_det->beginTransaction();
            foreach ($productos as $pro) {
                $stm_det->execute(array($id_intervencion, $pro->codigo, $pro->descripcion, $pro->marca, $pro->cantidad, $pro->precio));
            }
            $pdo_det->commit();
        } catch (PDOException $e) {
            $msj['msj'] = 'KO';
            $msj['error'] = $e->getMessage();
        }

        return $msj;
    }

    function sp_delete_intervencion($id_intervencion) {

        $respuesta = array('msj' => 'OK', 'error' => '');

        try {

            $stm = $this->pdo->prepare("CALL sp_delete_intervencion(?)");

            $stm->execute(array($id_intervencion));
        } catch (PDOException $e) {

            $respuesta['msj'] = 'KO';
            $respuesta['error'] = $e->getMessage();
        }

        return $respuesta;
    }

}
