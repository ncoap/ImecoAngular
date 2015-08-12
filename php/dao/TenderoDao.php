<?php

include '../mysql/Conexion.php';
//$tildes = $cn->query("SET NAMES 'utf8'");
class TenderoDao {

    private $pdo;

    public function __CONSTRUCT() {
        $db_cone = new Conexion();
        $this->pdo = $db_cone->getConexion();
    }

    public function get_tendero_by_dni($dni) {
        $respuesta = array('msj' => 'KO', 'tendero' => null);
        try {
            $stm = $this->pdo->prepare("CALL sp_tendero(?,?,?,?,?,?,?,?,?)");
            $stm->execute(array(4,0,'','','',$dni,0,date('Y-m-d'),''));
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
            date_default_timezone_set('America/Lima');
            $nacimientoTendero = date('Y-m-d', strtotime(urldecode($tendero->nacimientoTendero)));
            $stm = $this->pdo->prepare("CALL sp_tendero(?,?,?,?,?,?,?,?,?)");
            $stm->execute(array(1,0,$tendero->nombreTendero, $tendero->apellidoTendero,$tendero->direccionTendero,
                $tendero->dniTendero, $tendero->idTipoTendero, $nacimientoTendero, $tendero->sexoTendero));
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
            date_default_timezone_set('America/Lima');
            $nacimientoTendero = date('Y-m-d', strtotime(urldecode($tendero->nacimientoTendero)));
            $stm = $this->pdo->prepare("CALL sp_tendero(?,?,?,?,?,?,?,?,?)");
            $stm->execute(array(2,$tendero->idTendero,$tendero->nombreTendero, $tendero->apellidoTendero,$tendero->direccionTendero,
                $tendero->dniTendero, $tendero->idTipoTendero, $nacimientoTendero, $tendero->sexoTendero));
        } catch (PDOException $e) {
            $respuesta['msj'] = 'KO';
            $respuesta['error'] = $e->getMessage();
        }
        return $respuesta;
    }
}
