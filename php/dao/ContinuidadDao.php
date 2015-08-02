<?php
include '../mysql/Conexion.php';

class ContinuidadDao {
    private $pdo;

    public function __CONSTRUCT(){
        $db = new Conexion();
        $this->pdo = $db->getConexion();
    }

    public function listar() {
        //en los listados tambien try ctach
        $response = array('operatividad'=>array());
        $stm = $this->pdo->prepare("CALL get_operatividad()");
        $stm->execute(array());
        $response['operatividad'] = $stm->fetchAll(PDO::FETCH_OBJ);
        return $response;
    }


    public function sp_update($data){
        $respuesta = array('msj' => 'OK', 'error' => '');
        $item = $data->item;
        try {
            $stm = $this->pdo->prepare("CALL update_operatividad(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)");
            $stm->execute(array(
                $item->idDetOperatividad,
                $item->idOperatividad,
                $item->tienda->idTienda,
                $item->producto->idProducto,
                $item->equipo,
                $item->marca,
                $item->modelo,
                $item->capacidad,
                $item->total,
                $item->interno,
                $item->externo,
                $item->inoperativo,
                $item->operativo,
                $item->reubicacion,
                $item->otros,
                $item->observaciones));
        } catch (PDOException $e) {
            $respuesta['msj'] = 'KO';
            $respuesta['error'] = $e->getMessage();
        }
        return $respuesta;
    }
}