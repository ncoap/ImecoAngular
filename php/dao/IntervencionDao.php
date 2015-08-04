<?php
include '../mysql/Conexion.php';
//$tildes = $cn->query("SET NAMES 'utf8'");

class IntervencionDao {

    private $pdo;

    public function __CONSTRUCT() {
        $db_cone = new Conexion();
        $this->pdo = $db_cone->getConexion();
    }

    public function listarIntervenciones($pagina,$terminos) {
        $response = array('size'=>0,'interventions'=>array());
        $col_busqueda = $this->get_terminos_de_busqueda($terminos);
        $response['size'] = $this->get_row_count_cab_interven($col_busqueda);
        $stm = $this->pdo->prepare("CALL sp_intervencion(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)");
        $stm->execute(array(1,$col_busqueda,$pagina,0,date('Y-m-d H:i:s'),0,'','',0,'',0,'','',0,0,'','','','',0,0));
        $rs = $stm->fetchAll(PDO::FETCH_OBJ);
        $response['interventions'] = $rs;

        return $response;
    }

    public function get_terminos_de_busqueda($terminos){
        date_default_timezone_set('America/Lima');
        $col_fecha_desde = date('Y-m-d', strtotime(urldecode($terminos->fechaInicial)));
        $col_fecha_hasta = date('Y-m-d', strtotime(urldecode($terminos->fechaFinal)));
        $col_fecha = "(DATE(inter.fec_inte) BETWEEN '".$col_fecha_desde."' AND '".$col_fecha_hasta."')";

        $col_horario =explode(" ", $terminos->horario);

        $col_hora_desde = $col_horario[0];
        $col_hora_hasta = $col_horario[1];
        $col_hora = " AND (TIME(inter.fec_inte) BETWEEN '".$col_hora_desde."' AND '".$col_hora_hasta."')";
        if($col_hora_desde == '22:00:00'){
            //22:00:00 09:00:00
            $col_hora = " AND (TIME(inter.fec_inte) NOT BETWEEN '09:01:00' AND '21:59:59')";
        }

        $col_nombre = "";
        if ($terminos->nombre != '') {
            $col_nombre = " AND CONCAT(ten.nom_ten,', ',ten.ape_ten) LIKE '%" . $terminos->nombre."%'";
        }

        $col_dni = "";
        if ($terminos->dni != '') {
            $col_dni = " AND ten.doc_ten LIKE '%" . $terminos->dni."%'";
        }

        $col_sexo = "";
        if ($terminos->sexo != '') {
            $col_sexo = " AND ten.sexo = '" . $terminos->sexo."'";
        }

        $col_tienda = "";
        if ($terminos->tienda != '0') {
            $col_tienda = " AND ti.id_tien = " . $terminos->tienda->idTienda;
        }

        $col_tipo = "";
        if ($terminos->tipo != '') {
            $col_tipo = " AND tipo.id_tip_ten = " . $terminos->tipo;
        }

        $col_busqueda = $col_fecha.$col_hora.$col_nombre.$col_dni.$col_sexo.$col_tienda.$col_tipo;
        return $col_busqueda;
    }


    public function get_row_count_cab_interven($col_busqueda){
        $db_conect = new Conexion();
        $pdo = $db_conect->getConexion();
        $stm = $pdo->prepare("CALL sp_intervencion(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)");
        $stm->execute(array(2,$col_busqueda,0,0,date('Y-m-d H:i:s'),0,'','',0,'',0,'','',0,0,'','','','',0,0));
        $rs = $stm->fetch(PDO::FETCH_OBJ);
        return $rs->numIntervenciones;
    }

    public function get_detalle_intervencion_by_id($id) {
        $stm = $this->pdo->prepare("CALL sp_intervencion(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)");
        $stm->execute(array(3,'',0,$id,date('Y-m-d H:i:s'),0,'','',0,'',0,'','',0,0,'','','','',0,0));
        return $stm->fetchAll(PDO::FETCH_OBJ);
    }

    public function sp_get_ultimos_intervenciones() {
        $stm = $this->pdo->prepare("CALL sp_intervencion(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)");
        $stm->execute(array(10,'',0,0,date('Y-m-d H:i:s'),0,'','',0,'',0,'','',0,0,'','','','',0,0));
        return $stm->fetchAll(PDO::FETCH_OBJ);
    }

    public function sp_register_intervencion($data) {
        $respuesta = array('msj' => 'OK', 'error' => '');
        try {
            $stm = $this->pdo->prepare("CALL sp_intervencion(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)");
            $inter = $data->intervencion;
            date_default_timezone_set('America/Lima');
            $fechaCompletaIntervencion = date('Y-m-d H:i:s', strtotime(urldecode($inter->fechaCompletaIntervencion)));
            $stm->execute(array(4,'',0,0,$fechaCompletaIntervencion, $inter->idTendero, $inter->derivacionIntervencion,
                $inter->lugarDerivacion,$inter->dniPrevencionista, $inter->nombrePrevencionista,
                $inter->idPuesto,$inter->modalidadEmpleada, $inter->detalleIntervencion,
                $inter->tienda->idTienda, $inter->totalRecuperado, $inter->tipoHurto,'','','',0,0));

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
            $stm = $this->pdo->prepare("CALL sp_intervencion(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)");
            $inter = $data->intervencion;
            date_default_timezone_set('America/Lima');
            $fechaCompletaIntervencion = date('Y-m-d H:i:s', strtotime(urldecode($inter->fechaCompletaIntervencion)));

            $stm->execute(array(5,'',0,$inter->idIntervencion,$fechaCompletaIntervencion, $inter->idTendero, $inter->derivacionIntervencion,
                $inter->lugarDerivacion,$inter->dniPrevencionista, $inter->nombrePrevencionista,
                $inter->idPuesto,$inter->modalidadEmpleada, $inter->detalleIntervencion,
                $inter->tienda->idTienda, $inter->totalRecuperado, $inter->tipoHurto,'','','',0,0));

            $this->sp_delete_det_interven_by_num_inte($inter->idIntervencion);
            $this->sp_register_detalle($inter->idIntervencion, $data->productos);

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
            $db_conect = new Conexion();
            $pdo = $db_conect->getConexion();
            $stm = $pdo->prepare("CALL sp_intervencion(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)");
            $stm->execute(array(9,'',0,$idIntervencion,date('Y-m-d H:i:s'),0,'','',0,'',0,'','',0,0,'','','','',0,0));

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
            $stm = $pdo->prepare("CALL sp_tendero(?,?,?,?,?,?,?,?,?)");
            $stm->execute(array(3,0,'','','',$dni,0,date('Y-m-d'),''));

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
    public function sp_register_detalle($idIntervencion, $productos_json) {
        $msj = array('msj' => 'OK', 'error' => '');
        $productos = json_decode($productos_json);
        try {
            $db_conect = new Conexion();
            $pdo = $db_conect->getConexion();
            $stm = $pdo->prepare("CALL sp_intervencion(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)");
            $pdo->beginTransaction();
            foreach ($productos as $pro) {
                $stm->execute(array(7,'',0,$idIntervencion,date('Y-m-d H:i:s'),0,'','',0,'',0,'','',0,0,'',$pro->codigo, $pro->descripcion, $pro->marca, $pro->cantidad, $pro->precio));
            }
            $pdo->commit();

        } catch (PDOException $e) {
            $msj['msj'] = 'KO';
            $msj['error'] = $e->getMessage();
        }
        return $msj;
    }

    function sp_delete_intervencion($idIntervencion) {
        $respuesta = array('msj' => 'OK', 'error' => '');
        try {
            $stm = $this->pdo->prepare("CALL sp_intervencion(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)");
            $stm->execute(array(6,'',0,$idIntervencion,date('Y-m-d H:i:s'),0,'','',0,'',0,'','',0,0,'','','','',0,0));
        } catch (PDOException $e) {
            $respuesta['msj'] = 'KO';
            $respuesta['error'] = $e->getMessage();
        }
        return $respuesta;
    }

    public function get_name_prevencionista_by_dni($dni) {
        $respuesta = array('msj' => 'KO', 'nombre' => null);
        try {
            $stm = $this->pdo->prepare("CALL sp_intervencion(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)");
            $stm->execute(array(8,'',0,0,date('Y-m-d H:i:s'),0,'','',$dni,'',0,'','',0,0,'','','','',0,0));
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
}
