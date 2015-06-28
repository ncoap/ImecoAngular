<?php

include '../conexion/Conexion.php';

//$tildes = $cn->query("SET NAMES 'utf8'");

class EnlaceDao {

    public function listar_enlaces_interes() {
        $cnx = new Conexion();
        $cn = $cnx->getConexion();
        $res = $cn->prepare('CALL sp_listar_enlace_interes');
        $res->execute();
        return $res->fetchAll();
    }
    
    public function registrar_enlaces_interes($titulo, $url) {
        $cnx = new Conexion();
        $cn = $cnx->getConexion();
        $res = $cn->prepare('CALL sp_registrar_enlace_interes(:p_titulo, :p_url)');
        $res->bindParam(":p_titulo", $titulo);
        $res->bindParam(":p_url", $url);
        $res->execute();
        return "OK";
    }

    public function actualizar_enlaces_interes($id, $titulo, $url) {
        $cnx = new Conexion();
        $cn = $cnx->getConexion();
        $res = $cn->prepare('CALL sp_actualizar_enlace_interes(:p_id, :p_titulo, :p_url)');
        $res->bindParam(":p_id", $id);
        $res->bindParam(":p_titulo", $titulo);
        $res->bindParam(":p_url", $url);
        $res->execute();
        return $res->fetchAll();
    }

    public function eliminar_enlaces_interes($id) {
        $cnx = new Conexion();
        $cn = $cnx->getConexion();
        $res = $cn->prepare('CALL sp_eliminar_enlace_interes(:p_id)');
        $res->bindParam(":p_id", $id);
        $res->execute();
        return json_encode("OK");
    }

}
