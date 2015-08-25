<?php

include '../mysql/Conexion.php';

//$tildes = $cn->query("SET NAMES 'utf8'");

class InformeDao {

    private $pdo;

    public function __CONSTRUCT() {
        $db_cone = new Conexion();
        $this->pdo = $db_cone->getConexion();
    }

    public function listar($terminos) {

        $response = array('size'=>0,'informes'=>array(),'busqueda'=>'');
        $col_busqueda = $this->get_terminos_de_busqueda($terminos);
        $response['busqueda']= $col_busqueda;
        $stm = $this->pdo->prepare("CALL sp_informe(?,?,?,?,?,?,?,?)");
        $stm->execute(array(1,$col_busqueda,0,'','','','',''));
        $response['informes'] = $stm->fetchAll(PDO::FETCH_OBJ);
        return $response;

    }

    public function get_terminos_de_busqueda($terminos){

        $col_dni = "dni LIKE '%" . $terminos->dni."%'";

        $col_nombre = "";
        if ($terminos->nombres != '') {
            $col_nombre = " AND nombres LIKE '%" . $terminos->nombres."%'";
        }

        $col_cargo = "";
        if ($terminos->cargo != '') {
            $col_cargo = " AND cargo LIKE '%" . $terminos->cargo."%'";
        }

        $col_asunto = "";
        if ($terminos->asunto != '') {
            $col_asunto = " AND asunto LIKE '%" . $terminos->asunto."%'";
        }

        $col_busqueda = $col_dni.$col_nombre.$col_cargo.$col_asunto;
        return $col_busqueda;
    }

    public function sp_register($data) {

        $respuesta = array('msj' => 'OK','id'=>1, 'error' => '');
        try {
            $stm = $this->pdo->prepare("CALL sp_informe(?,?,?,?,?,?,?,?)");
            $informe = $data->informe;
            $stm->execute(array(2,'',0,$informe->dni,$informe->nombres,$informe->cargo,$informe->asunto,$informe->redaccion));
            $res = $stm->fetch(PDO::FETCH_OBJ);
            $respuesta['id'] = $res->newid;

        } catch (PDOException $e) {
            $respuesta['msj'] = 'KO';
            $respuesta['error'] = $e->getMessage();
        }
        return $respuesta;

    }

    public function get_name($dni) {
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
    
    public function sp_actualizar($data) {
        $respuesta = array('msj' => 'OK', 'error' => '');
        try {
            $stm = $this->pdo->prepare("CALL sp_informe(?,?,?,?,?,?,?,?)");
            $informe = $data->informe;
            $stm->execute(array(3,'',$informe->id,$informe->dni,$informe->nombres,$informe->cargo,$informe->asunto,$informe->redaccion));

        } catch (PDOException $e) {
            $respuesta['msj'] = 'KO';
            $respuesta['error'] = $e->getMessage();
        }
        return $respuesta;
    }


    function sp_delete($id) {

       $respuesta = array('msj' => 'OK', 'error' => '');
        try {
            $stm = $this->pdo->prepare("CALL sp_informe(?,?,?,?,?,?,?,?)");
            $stm->execute(array(4,0,$id,'','','','',''));
        } catch (PDOException $e) {
            $respuesta['msj'] = 'KO';
            $respuesta['error'] = $e->getMessage();
        }

        return $respuesta;
    }

}
