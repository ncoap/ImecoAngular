<?php

include '../conexion/Conexion.php';

class LoginDao {

    public function logeUsu() {
        $cnx = new Conexion();
        $cn = $cnx->getConexion();
        $usu = $_SESSION['usu'];
        $pass = $_SESSION['pass'];
        $res = $cn->prepare("call sp_login_usuario (:p_username, :p_password)");
        $res->bindParam(":p_username", $usu);
        $res->bindParam(":p_password", $pass);
        $res->execute();

        foreach ($res as $row) {
            $logeusu[] = $row;
        }
        return $logeusu;
    }

}
