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
        $respuesta = array('msj' => 'OK', 'error' => '');
        try {
            $stm = $this->pdo->prepare("CALL sp_register_tendero(?,?,?,?,?,?,?,?)");

            $foto = "view/imagen_tendero/" . $tendero->dni . ".jpg";
            date_default_timezone_set('America/Lima');
            $fechita = date('Y-m-d', strtotime(urldecode($tendero->nacimiento)));

            $stm->execute(array($tendero->nombre, $tendero->apellido, $tendero->direccion, $tendero->dni, $tendero->tipo, $fechita, $tendero->sexo, $foto));
        } catch (PDOException $e) {

            $respuesta['msj'] = 'KO';
            $respuesta['error'] = $e->getMessage();
        }

        return $respuesta;
    }

    public function sp_update_tendero($tendero) {
        $respuesta = array('msj' => 'OK', 'error' => '');
        try {
            $stm = $this->pdo->prepare("CALL sp_update_tendero(?,?,?,?,?,?,?,?,?)");

            $foto = "view/imagen_tendero/" . $tendero->dni . ".jpg";
            date_default_timezone_set('America/Lima');
            $fechita = date('Y-m-d', strtotime(urldecode($tendero->nacimiento)));

            $stm->execute(array($tendero->id, $tendero->nombre, $tendero->apellido, $tendero->direccion, $tendero->dni, $tendero->tipo, $fechita, $tendero->sexo, $foto));
        } catch (PDOException $e) {

            $respuesta['msj'] = 'KO';
            $respuesta['error'] = $e->getMessage();
        }

        return $respuesta;
    }

}
