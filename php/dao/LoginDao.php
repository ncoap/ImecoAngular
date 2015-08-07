<?php

include '../mysql/Conexion.php';

class LoginDao
{

    private $pdo;

    public function __CONSTRUCT()
    {
        $db_cone = new Conexion();
        $this->pdo = $db_cone->getConexion();
    }

    public function logeUsu($usu, $pass){
        $respuesta = array('msj' => 'OK','rol' => 'Ninguno','mensaje'=>'');
        try {
            $stm = $this->pdo->prepare("call sp_login (?,?)");
            $stm->execute(array($usu, $pass));
            $rs = $stm->fetch(PDO::FETCH_OBJ);

            if ($rs == false) {
                $respuesta['msj'] = 'KO';
                $respuesta['mensaje'] = 'USUARIO NO REGISTRADO';
            } else {
                $respuesta['rol'] = $rs->rol;
            }
        } catch (PDOException $e) {
            $respuesta['msj'] = 'KO';
            $respuesta['mensaje'] = $e->getMessage();
        }
        return $respuesta;
    }
}
