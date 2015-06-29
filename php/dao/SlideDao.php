<?php

include '../conexion/Conexion.php';

//$tildes = $cn->query("SET NAMES 'utf8'");

class SlideDao {

    public function listar_slide_principal() {
        $cnx = new Conexion();
        $cn = $cnx->getConexion();
        $res = $cn->prepare('CALL sp_listar_slide_principal');
        $res->execute();
        return $res->fetchAll();
    }

    public function registrar_slide_principal($url) {
        $cnx = new Conexion();
        $cn = $cnx->getConexion();
        $res = $cn->prepare('CALL sp_registrar_slide_principal(:p_url_imagen)');
        $res->bindParam(":p_url_imagen", $url);
        $res->execute();
        return "OK";
    }

    public function eliminar_slide_principal($id) {
        $cnx = new Conexion();
        $cn = $cnx->getConexion();
        $mensaje = "";

        $res = $cn->prepare('CALL sp_imagen_is_local(:p_id_slide)');
        $res->bindParam(":p_id_slide", $id);
        $res->execute();
        $respuesta = $res->fetch();

        if ($respuesta <> NULL) {
            $url = $respuesta["url"];
            $url_valid = substr($url, 0, 7);

            //Al hacer execute se cierra la conexion se abre de nuevo
            $cn = $cnx->getConexion();
            $res2 = $cn->prepare('CALL sp_eliminar_slide_principal(:p_id)');
            $res2->bindParam(":p_id", $id);
            $res2->execute();

            if ($url_valid == 'http://') {
                
            } else {
                unlink("../../$url");
            }
            $mensaje = "OK";
        } else {
            $mensaje = "KO";
        }

        return $mensaje;
    }

}
