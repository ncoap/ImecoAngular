<?php
include '../mysql/Conexion.php';
//$tildes = $cn->query("SET NAMES 'utf8'");
class IncidenteDao {

    private $pdo;

    public function __CONSTRUCT() {
        $db_cone = new Conexion();
        $this->pdo = $db_cone->getConexion();
    }

    public function listar($pagina,$terminos) {
        $response = array('size'=>0,'incidentes'=>array());
        $col_busqueda = $this->get_terminos_de_busqueda($terminos);
        $response['size'] = $this->get_row_count_cab_interven($col_busqueda);
        $stm = $this->pdo->prepare("CALL sp_incidente(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)");
        $stm->execute(array(
            1,$col_busqueda,$pagina,0,0,
            '','','','','',
            0,'',date('Y-m-d H:i:s'),'','',
            '',0,'','','',
            0,'','','',0,0,
            0));
        $response['incidentes'] = $stm->fetchAll(PDO::FETCH_OBJ);
        return $response;
    }

    public function get_terminos_de_busqueda($terminos){

        date_default_timezone_set('America/Lima');
        $col_fecha_desde = date('Y-m-d', strtotime(urldecode($terminos->fechaInicial)));
        $col_fecha_hasta = date('Y-m-d', strtotime(urldecode($terminos->fechaFinal)));
        $col_fecha = "(DATE(c.fecha_accidente) BETWEEN '".$col_fecha_desde."' AND '".$col_fecha_hasta."')";
        $col_horario =explode(" ", $terminos->horario);
        $col_hora_desde = $col_horario[0];
        $col_hora_hasta = $col_horario[1];
        $col_hora = " AND (TIME(c.fecha_accidente) BETWEEN '".$col_hora_desde."' AND '".$col_hora_hasta."')";
        if($col_hora_desde == '22:00:00'){
            //22:00:00 09:00:00
            $col_hora = " AND (TIME(c.fecha_accidente) NOT BETWEEN '09:01:00' AND '21:59:59')";
        }
        $col_nombre = "";
        if ($terminos->nombre != '') {
            $col_nombre = " AND c.nombre_involucrado LIKE '%" . $terminos->nombre."%'";
        }
        $col_dni = "";
        if ($terminos->dni != '') {
            $col_dni = " AND c.dni_involucrado LIKE '%" . $terminos->dni."%'";
        }
        $col_tienda = "";
        if ($terminos->tienda != '0') {
            $col_tienda = " AND t.id_tien = " . $terminos->tienda->idTienda;
        }

        $col_busqueda = $col_fecha.$col_hora.$col_dni.$col_nombre.$col_tienda;
        return $col_busqueda;

    }

    public function get_row_count_cab_interven($col_busqueda){
        $db_conect = new Conexion();
        $pdo = $db_conect->getConexion();
        $stm = $pdo->prepare("CALL sp_incidente(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)");
        $stm->execute(array(
            2,$col_busqueda,0,0,0,
            '','','','','',
            0,'',date('Y-m-d H:i:s'),'','',
            '',0,'','','',
            0,'','','',0,0,
            0));
        $rs = $stm->fetch(PDO::FETCH_OBJ);
        return $rs->num;
    }

    public function get_detalle_by_id($id) {
        $response = array('msj'=>'OK','detalle'=>array(),'error'=>'');
        try {
            $stm = $this->pdo->prepare("CALL sp_incidente(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)");
            $stm->execute(array(
                3,'',0,$id,0,
                '','','','','',
                0,'',date('Y-m-d H:i:s'),'','',
                '',0,'','','',
                0,'','','',0,0,
                0));
            $response['detalle'] = $stm->fetchAll(PDO::FETCH_OBJ);
        } catch (PDOException $e) {
            $response['msj'] = 'KO';
            $response['error'] = $e->getMessage();
        }
        return $response;
    }

    public function sp_register($data) {
        $respuesta = array('msj' => 'OK', 'error' => '','id' =>'','tipo'=>'from sp_register');
        try {
            $stm = $this->pdo->prepare("CALL sp_incidente(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)");
            $inci = $data->incidente;
            date_default_timezone_set('America/Lima');
            $fechaAccidenteCompleta = date('Y-m-d H:i:s', strtotime(urldecode($inci->fechaAccidenteCompleta)));
            $stm->execute(array(
                4,'',0,0,$inci->tienda->idTienda,
                $inci->nombreInvolucrado,$inci->dniInvolucrado,$inci->actoCondicionInsegura,
                $inci->nombreAccidentado,$inci->dniAccidentado,
                $inci->edadAccidentado,$inci->sexoAccidentado,$fechaAccidenteCompleta,
                $inci->nivelGravedad,$inci->diagnostico,
                $inci->descansoMedico,$inci->cantidadDias,$inci->descripcionCausas,$inci->lesion,
                $inci->accionesCorrectivasRealizadas,$inci->total,
                '','','',0,0,0));
            $res = $stm->fetch(PDO::FETCH_OBJ);
            $respuesta['id'] = $res->newid;
            $msj_req = $this->sp_register_detalle($res->newid, $data->productos);
            if($msj_req['msj'] == 'KO'){
                return $msj_req;
            }
        } catch (PDOException $e) {
            $respuesta['msj'] = 'KO';
            $respuesta['error'] = $e->getMessage();
        }
        return $respuesta;
    }

    public function sp_update($data) {
        $respuesta = array('msj' => 'OK', 'error' => '','tipo'=>'from sp_update');
        try {
            $stm = $this->pdo->prepare("CALL sp_incidente(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)");
            $inci = $data->incidente;
            date_default_timezone_set('America/Lima');
            $fechaAccidenteCompleta = date('Y-m-d H:i:s', strtotime(urldecode($inci->fechaAccidenteCompleta)));

            $stm->execute(array(5,'',0,$inci->idIncidente,$inci->tienda->idTienda,
                $inci->nombreInvolucrado,$inci->dniInvolucrado,$inci->actoCondicionInsegura,
                $inci->nombreAccidentado,$inci->dniAccidentado,
                $inci->edadAccidentado,$inci->sexoAccidentado,$fechaAccidenteCompleta,
                $inci->nivelGravedad,$inci->diagnostico,
                $inci->descansoMedico,$inci->cantidadDias,$inci->descripcionCausas,$inci->lesion,
                $inci->accionesCorrectivasRealizadas,$inci->total,
                '','','',0,0,0));

            $msj_del = $this->sp_delete_det_by_num_inte($inci->idIncidente);
            if($msj_del['msj'] == 'KO'){
                return $msj_del;
            }

            $msj_register = $this->sp_register_detalle($inci->idIncidente, $data->productos);
            if($msj_register['msj'] == 'KO'){
                return $msj_register;
            }
        } catch (PDOException $e) {
            $respuesta['msj'] = 'KO';
            $respuesta['error'] = $e->getMessage();
        }
        return $respuesta;
    }

    public function sp_delete_det_by_num_inte($idIncidente) {

        $msj = array('msj' => 'OK', 'error' => '','tipo'=>'from sp_delete_det_by_num_inte');
        //EL PDO COMINT ISRVE EN MOTORES INNODB
        try {
            $db = new Conexion();
            $pdo = $db->getConexion();
            $stm = $pdo->prepare("CALL sp_incidente(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)");
            $stm->execute(array(
                9,'',0,$idIncidente,0,
                '','','','','',
                0,'',date('Y-m-d H:i:s'),'','',
                '',0,'','','',
                0,'','','',0,0,
                0));
        } catch (PDOException $e) {
            $msj['msj'] = 'KO';
            $msj['error'] = $e->getMessage();
        }

        return $msj;
    }

    //SI GRABO LA CABECERA DEBEMOS DE GUARDAR EN ESE MOMENTO EL DETALLE
    public function sp_register_detalle($idIncidente, $productos_json) {
        $msj = array('msj' => 'OK', 'error' => '','tipo'=>'from sp_register_detalle');
        $productos = json_decode($productos_json);
        try {
            $db = new Conexion();
            $pdo = $db->getConexion();
            $stm = $pdo->prepare("CALL sp_incidente(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)");
            $pdo->beginTransaction();
            foreach ($productos as $pro) {
                $stm->execute(array(
                    7,'',0,$idIncidente,0,
                    '','','','','',
                    0,'',date('Y-m-d H:i:s'),'','',
                    '',0,'','','',
                    0,$pro->codigo, $pro->descripcion, $pro->marca, $pro->cantidad, $pro->precio,
                    $pro->esActivo));
            }
            $pdo->commit();
        } catch (PDOException $e) {
            $msj['msj'] = 'KO';
            $msj['error'] = $e->getMessage();
        }
        return $msj;
    }

    function sp_delete($id) {
        $respuesta = array('msj' => 'OK', 'error' => '');
        try {
            $stm = $this->pdo->prepare("CALL sp_incidente(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)");
            $stm->execute(array(
                6,'',0,$id,0,
                '','','','','',
                0,'',date('Y-m-d H:i:s'),'','',
                '',0,'','','',
                0,'','','',0,0,
                0));
        } catch (PDOException $e) {
            $respuesta['msj'] = 'KO';
            $respuesta['error'] = $e->getMessage();
        }
        return $respuesta;
    }

    public function get_name_involucrado_by_dni($dni) {
        $respuesta = array('msj' => 'KO','error'=>'' ,'nombre' => '');
        try {
            $stm = $this->pdo->prepare("CALL sp_incidente(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)");
            $stm->execute(array(
                8,'',0,0,0,
                '',$dni,'','','',
                0,'',date('Y-m-d H:i:s'),'','',
                '',0,'','','',
                0,'','','',0,0,
                0));
            $res = $stm->fetch(PDO::FETCH_OBJ);
            if ($res == false) {
            } else {
                $respuesta['nombre'] = $res->nombre;
            }
        } catch (PDOException $e) {
            $respuesta['msj'] = 'KO';
            $respuesta['error'] = $e->getMessage();
        }
        return $respuesta;
    }
}
