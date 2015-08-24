<?php

include '../mysql/Conexion.php';

//$tildes = $cn->query("SET NAMES 'utf8'");

class SensomatizadoDao {

    private $pdo;

    public function __CONSTRUCT() {
        $db_cone = new Conexion();
        $this->pdo = $db_cone->getConexion();
    }

    public function listarNoSensomatizados($pagina,$terminos) {

        $response = array('size'=>0,'sensomatizados'=>array(),'busqueda'=>'');
        $col_busqueda = $this->get_terminos_de_busqueda($terminos);
        $response['busqueda']= $col_busqueda;
//        $response['size'] = $this->get_row_count_cab($col_busqueda);
        $stm = $this->pdo->prepare("CALL sp_sensomatizado(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)");
        $stm->execute(array(1,$col_busqueda,$pagina,0,'','',date('Y-m-d H:i:s'),0,'',0,'','','',0,0));
        $response['sensomatizados'] = $stm->fetchAll(PDO::FETCH_OBJ);
        return $response;

    }

    public function get_terminos_de_busqueda($terminos){
        date_default_timezone_set('America/Lima');
        $col_fecha_desde = date('Y-m-d', strtotime(urldecode($terminos->fechaInicial)));
        $col_fecha_hasta = date('Y-m-d', strtotime(urldecode($terminos->fechaFinal)));
        $col_fecha = "(DATE(c.fecha_registro) BETWEEN '".$col_fecha_desde."' AND '".$col_fecha_hasta."')";

        $col_horario =explode(" ", $terminos->horario);

        $col_hora_desde = $col_horario[0];
        $col_hora_hasta = $col_horario[1];
        $col_hora = " AND (TIME(c.fecha_registro) BETWEEN '".$col_hora_desde."' AND '".$col_hora_hasta."')";
        if($col_hora_desde == '22:00:00'){
            //22:00:00 09:00:00
            $col_hora = " AND (TIME(c.fecha_registro) NOT BETWEEN '09:01:00' AND '21:59:59')";
        }

        $col_nombre = "";
        if ($terminos->nombre != '') {
            $col_nombre = " AND c.nom_prev LIKE '%" . $terminos->nombre."%'";
        }

        $col_dni = "";
        if ($terminos->dni != '') {
            $col_dni = " AND c.dni_prev LIKE '%" . $terminos->dni."%'";
        }

        $col_tienda = "";
        if ($terminos->tienda != '0') {
            $col_tienda = " AND t.id_tien = " . $terminos->tienda->idTienda;
        }

        $col_busqueda = $col_fecha.$col_hora.$col_dni.$col_nombre.$col_tienda;
        return $col_busqueda;
    }


    public function get_row_count_cab($col_busqueda){
        $db_conect = new Conexion();
        $pdo = $db_conect->getConexion();
        $stm = $pdo->prepare("CALL sp_sensomatizado(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)");
        $stm->execute(array(2,$col_busqueda,0,0,'','',date('Y-m-d H:i:s'),0,'',0,'','','',0,0));
        $rs = $stm->fetch(PDO::FETCH_OBJ);
        return $rs->numSensores;
    }

    public function sp_register_producto_no_sensomatizado($data) {

        $respuesta = array('msj' => 'OK','id'=>1, 'error' => '');
        try {
            $stm = $this->pdo->prepare("CALL sp_sensomatizado(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)");
            date_default_timezone_set('America/Lima');
            $senso = $data->sensomatizado;
            $fecha = date('Y-m-d H:i:s', strtotime(urldecode($senso->fecha)));

            $stm->execute(array(4,'',1,1,$senso->dniPrevencionista,$senso->nombrePrevencionista,$fecha,$senso->total,$senso->observaciones, $senso->tienda->idTienda,'','','',0,0));
            $res = $stm->fetch(PDO::FETCH_OBJ);
            $respuesta['id'] = $res->newid;
            $this->sp_register_detalle($res->newid, $data->productos);

        } catch (PDOException $e) {
            $respuesta['msj'] = 'KO';
            $respuesta['error'] = $e->getMessage();
        }
        return $respuesta;
    }

    public function sp_register_detalle($id_sensor, $productos_json) {
        $productos = json_decode($productos_json);
        $msj = array('msj' => 'OK', 'error' => '');
        //EL PDO COMINT SIRVE EN MOTORES INNODB
        try {
            $db_conect_det = new Conexion();
            $pdo_det = $db_conect_det->getConexion();
            $stm_det = $pdo_det->prepare("CALL sp_sensomatizado(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)");
            $pdo_det->beginTransaction();
            foreach ($productos as $pro) {
                $stm_det->execute(array(7,'',1,$id_sensor,'','',date('Y-m-d H:i:s'),0,'',0,$pro->codigo, $pro->descripcion, $pro->marca, $pro->cantidad, $pro->precio));
            }
            $pdo_det->commit();
        } catch (PDOException $e) {
            $msj['msj'] = 'KO';
            $msj['error'] = $e->getMessage();
        }
        return $msj;
    }

    public function get_name_prevencionista_by_dni($dni) {
        $respuesta = array('msj' => 'KO', 'nombre' => null);
        try {
            $stm = $this->pdo->prepare("CALL sp_sensomatizado(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)");
            $stm->execute(array(8,'',1,1,$dni,'',date('Y-m-d H:i:s'),0,'',0,'', '', '', 0, 0));
            $res = $stm->fetch(PDO::FETCH_OBJ);
            if ($res == false) {
            } else {
                $respuesta['msj'] = 'OK';
                $respuesta['nombre'] = $res->nombre;
            }
        } catch (PDOException $e) {
            $respuesta['msj'] = 'KO' . $e->getMessage();
        }
        return $respuesta;
    }
    
    public function sp_actualizar_cab_sensor($data) {
        $respuesta = array('msj' => 'OK', 'error' => '');
        try {
            $stm = $this->pdo->prepare("CALL sp_sensomatizado(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)");
            date_default_timezone_set('America/Lima');
            $senso = $data->sensomatizado;
            $fecha = date('Y-m-d H:i:s', strtotime(urldecode($senso->fecha)));
            $stm->execute(array(5,'',1,$senso->idSensor,$senso->dniPrevencionista,$senso->nombrePrevencionista,$fecha,$senso->total,$senso->observaciones, $senso->tienda->idTienda,'','','',0,0));
            $this->sp_delete_det_sensor_by_id_sensor($senso->idSensor);
            $this->sp_register_detalle($senso->idSensor, $data->productos);
        } catch (PDOException $e) {
            $respuesta['msj'] = 'KO';
            $respuesta['error'] = $e->getMessage();
        }
        return $respuesta;
    }

    public function sp_delete_det_sensor_by_id_sensor($idSensor) {

        $respuesta = array('msj' => 'OK', 'error' => '');
        try {
            $db_conect = new Conexion();
            $pdo = $db_conect->getConexion();
            $stm = $pdo->prepare("CALL sp_sensomatizado(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)");
            $stm->execute(array(9,'',1,$idSensor,'','',date('Y-m-d H:i:s'),0,'',0,'', '', '', 0, 0));
        } catch (PDOException $e) {
            $respuesta['msj'] = 'KO';
            $respuesta['error'] = $e->getMessage();
        }

        return $respuesta;
    }


    function sp_delete_producto_no_sensomatizado($id_producto) {

       $respuesta = array('msj' => 'OK', 'error' => '');
        try {
            $stm = $this->pdo->prepare("CALL sp_sensomatizado(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)");
            $stm->execute(array(6,'',1,$id_producto,'','',date('Y-m-d H:i:s'),0,'',0,'', '', '', 0, 0));
        } catch (PDOException $e) {
            $respuesta['msj'] = 'KO';
            $respuesta['error'] = $e->getMessage();
        }

        return $respuesta;
    }

    public function get_detalle_sensor_by_id($id) {

        $response = array('msj'=>'OK','detalle'=>array(),'error'=>'');

        try {
            $stm = $this->pdo->prepare("CALL sp_sensomatizado(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)");
            $stm->execute(array(3,'',0,$id,'','',date('Y-m-d H:i:s'),0,'',0,'','','',0,0));
            $response['detalle'] = $stm->fetchAll(PDO::FETCH_OBJ);
        } catch (PDOException $e) {
            $response['msj'] = 'KO';
            $response['error'] = $e->getMessage();
        }
        return $response;
    }

}
