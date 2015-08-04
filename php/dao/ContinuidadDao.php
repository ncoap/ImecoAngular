<?php
include '../mysql/Conexion.php';

class ContinuidadDao {
    private $pdo;

    public function __CONSTRUCT(){
        $db = new Conexion();
        $this->pdo = $db->getConexion();
    }

    public function listar($idProducto) {
        //en los listados tambien try ctach
        $response = array('operatividad'=>array());
        $stm = $this->pdo->prepare("CALL sp_operatividad(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)");
        $stm->execute(array(1,
            0, 0, 0, $idProducto,
            '', '', '','',
            0, 0, 0, 0,
           0, 0, '', ''));
        $response['operatividad'] = $stm->fetchAll(PDO::FETCH_OBJ);
        return $response;
    }

    public function sp_update($data){
        $respuesta = array('msj' => 'OK', 'error' => '','id'=>'');
        $item = $data->item;
        try {

            $opcion = 2;
            if($item->idDetOperatividad == 0){
                //ID 0 ES UN REGISTRO NUEVO
                $opcion = 4;
            }

            $stm = $this->pdo->prepare("CALL sp_operatividad(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)");
            $stm->execute(array(
                $opcion,
                $item->idDetOperatividad, $item->idOperatividad, $item->idTienda, $item->idProducto,
                $item->nombreEquipo, $item->marcaEquipo, $item->modeloEquipo, $item->capacidadEquipo,
                $item->total, $item->cantidadInterna, $item->cantidadExterna, $item->cantidadInoperativo,
                $item->cantidadOperativo, $item->cantidadReubicacion, $item->otros, $item->observaciones));

            if($opcion == 4){
                $res = $stm->fetch(PDO::FETCH_OBJ);
                $respuesta['id'] = $res->newid;
            }

        } catch (PDOException $e) {
            $respuesta['msj'] = 'KO';
            $respuesta['error'] = $e->getMessage();
        }
        return $respuesta;
    }

    public function sp_delete_item($idDetOperatividad){
        $respuesta = array('msj' => 'OK', 'error' => '');
        try {
            $stm = $this->pdo->prepare("CALL sp_operatividad(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)");
            $stm->execute(array(3,
                $idDetOperatividad, 0, 0, 0,
                '', '', '','',
                0, 0, 0, 0,
                0, 0, '', ''));
        } catch (PDOException $e) {
            $respuesta['msj'] = 'KO';
            $respuesta['error'] = $e->getMessage();
        }
        return $respuesta;
    }
}