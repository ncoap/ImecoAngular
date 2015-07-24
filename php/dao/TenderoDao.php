<?php

include '../mysql/Conexion.php';

//$tildes = $cn->query("SET NAMES 'utf8'");

class TenderoDao {

    private $pdo;

    public function __CONSTRUCT() {
        $db_cone = new Conexion();
        $this->pdo = $db_cone->getConexion();
    }

    public function exist_tendero_by_dni($dni) {

        //return object {exist:0} {exist:1}
        $stm = $this->pdo->prepare("CALL exist_tendero_by_dni(?)");
        $stm->execute(array($dni));
        return $stm->fetch(PDO::FETCH_OBJ);
    }

    public function get_tendero_by_dni($dni) {
        $respuesta = array('msj' => 'KO', 'tendero' => null);
        try {
            $stm = $this->pdo->prepare("CALL get_tendero_by_dni(?)");

            $stm->execute(array($dni));

            $res = $stm->fetch(PDO::FETCH_OBJ);
            if ($res == false) {
                
            } else {
                $respuesta['msj'] = 'OK';
                $respuesta['tendero'] = $res;
            }
        } catch (PDOException $e) {

            $respuesta['msj'] = 'KO' . $e->getMessage();
        }

        return $respuesta;
    }

    public function sp_registrar_tendero($tendero) {
        $respuesta = array('msj' => 'OK', 'error' => '','newid'=>'');
        try {
            $stm = $this->pdo->prepare("CALL sp_register_tendero(?,?,?,?,?,?,?)");

            date_default_timezone_set('America/Lima');
            $nacimientoTendero = date('Y-m-d', strtotime(urldecode($tendero->nacimientoTendero)));

            $stm->execute(array($tendero->nombreTendero, $tendero->apellidoTendero,$tendero->direccionTendero, $tendero->dniTendero, $tendero->idTipoTendero, $nacimientoTendero, $tendero->sexoTendero));
        
            $res = $stm->fetch(PDO::FETCH_OBJ); 
            
            $respuesta['newid'] = $res->newid;
            
        } catch (PDOException $e) {

            //EXCEPTION SI EL DNI NO LO VA A USAR
            $respuesta['msj'] = 'KO';
            $respuesta['error'] = $e->getMessage();
        }

        return $respuesta;
    }

    public function sp_update_tendero($tendero) {
        $respuesta = array('msj' => 'OK', 'error' => '');
        try {
            $stm = $this->pdo->prepare("CALL sp_update_tendero(?,?,?,?,?,?,?,?)");

            date_default_timezone_set('America/Lima');
            $nacimientoTendero = date('Y-m-d', strtotime(urldecode($tendero->nacimientoTendero)));

            $stm->execute(array($tendero->idTendero, $tendero->nombreTendero, $tendero->apellidoTendero,
                $tendero->direccionTendero, $tendero->dniTendero, $tendero->idTipoTendero, $nacimientoTendero, $tendero->sexoTendero));
        } catch (PDOException $e) {

            $respuesta['msj'] = 'KO';
            $respuesta['error'] = $e->getMessage();
        }

        return $respuesta;
    }
    
     public function get_name_prevencionista_by_dni($dni) {
        $respuesta = array('msj' => 'KO', 'nombre' => null);
        try {
            $stm = $this->pdo->prepare("CALL get_name_prevencionista_by_dni(?)");

            $stm->execute(array($dni));

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
