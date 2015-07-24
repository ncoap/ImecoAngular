<?php

include '../mysql/Conexion.php';

//$tildes = $cn->query("SET NAMES 'utf8'");

class GraficaDao {

    private $pdo;

    public function __CONSTRUCT() {
        $db_cone = new Conexion();
        $this->pdo = $db_cone->getConexion();
    }

    public function chart_num_intervenciones_vs_total_recuperado_por_tienda($fecha) {
        date_default_timezone_set('America/Lima');
        $fechaActual = date('Y-m-d', strtotime(urldecode($fecha)));
//        $col_fecha_hasta = date('Y-m-d H:i:s', strtotime(urldecode($terminos->fechaFinal)));

        $stm = $this->pdo->prepare("CALL chart_num_intervenciones_vs_total_recuperado_por_tienda(?)");
        $stm->execute(array($fechaActual));

        $rs = $stm->fetchAll(PDO::FETCH_OBJ);

        $total = array();
        $tiendas = array();
        $intervenciones = array();
        $recuperado = array();
        
        foreach ($rs as $inter) {
            array_push($tiendas,$inter->tienda);
            array_push($intervenciones,$inter->intervenciones);
            array_push($recuperado,$inter->recuperado);
        }
        
        array_push($total, $tiendas,$intervenciones,$recuperado,$rs);

        return $total;
    }
    
    public function chart_recuperos_por_prevencionista($idtienda, $fecha) {
        date_default_timezone_set('America/Lima');
        $fechaActual = date('Y-m-d', strtotime(urldecode($fecha)));
        $stm = $this->pdo->prepare("CALL chart_recuperos_por_prevencionista(?,?)");
        $stm->execute(array($idtienda , $fechaActual));

        $rs = $stm->fetchAll(PDO::FETCH_OBJ);

        $total = array();
        $label = array();
        $cantidades = array();
        $montos = array();
        
        //falta concatener
        
        foreach ($rs as $key=>$inter) {
//            array_push($label,$inter->nombrePrevencionista . $inter->descripcionProducto);
//            array_push($label,$inter->descripcionProducto.' - '.$inter->nombrePrevencionista);
            array_push($label,$key+1);
            array_push($cantidades,$inter->cantidadProducto);
            array_push($montos,$inter->totalProducto);
        }
        
        array_push($total, $label,$cantidades,$montos,$rs);

        return $total;
    }

}
