<?php

include '../util/util.php';

class dao {

    public function logeUsu() {
        $cnx = new util();
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

    public function lista() {
        $cnx = new util();
        $cn = $cnx->getConexion();
        $res = $cn->prepare('call listacat');
        $res->execute();
        foreach ($res as $row) {
            $lista[] = $row;
        }
        return $lista;
    }

    public function lista2() {
        $cnx = new util();
        $cn = $cnx->getConexion();
        $res = $cn->prepare('call listainsti');
        $res->execute();
        foreach ($res as $row) {
            $lista2[] = $row;
        }
        return $lista2;
    }

    public function enlaces_interes() {
        $cnx = new util();
        $cn = $cnx->getConexion();
        $res = $cn->prepare('CALL sp_listar_enlace_interes');
        $res->execute();
        return $res->fetchAll();
    }

    public function lista4() {
        $cnx = new util();
        $cn = $cnx->getConexion();
        $res = $cn->prepare('call listacontac');
        $res->execute();
        foreach ($res as $row) {
            $lista4[] = $row;
        }
        return $lista4;
    }

    public function lista5() {
        $cnx = new util();
        $cn = $cnx->getConexion();
        $res = $cn->prepare('call listacat');
        $res->execute();
        foreach ($res as $row) {
            $lista5[] = $row;
        }
        return $lista5;
    }

    public function lista6() {
        $cnx = new util();
        $cn = $cnx->getConexion();
        $res = $cn->prepare('call allcursos');
        $res->execute();
        foreach ($res as $row) {
            $lista6[] = $row;
        }
        return $lista6;
    }

}

?>