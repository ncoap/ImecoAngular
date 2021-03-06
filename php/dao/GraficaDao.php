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
            array_push($tiendas, $inter->tienda);
            array_push($intervenciones, $inter->intervenciones);
            array_push($recuperado, $inter->recuperado);
        }

        array_push($total, $tiendas, $intervenciones, $recuperado, $rs);

        return $total;
    }

    public function chart_recuperos_por_prevencionista($idtienda, $opcion, $fecha, $hora_inicial, $hora_final, $sexo) {
        date_default_timezone_set('America/Lima');
        $fechaActual = date('Y-m-d', strtotime(urldecode($fecha)));
        $stm = $this->pdo->prepare("CALL char_ejecutivo_anual_por_tienda(?,?,?,?,?,?)");
        $stm->execute(array($idtienda, $opcion, $fechaActual, $hora_inicial, $hora_final, $sexo));

        $rs = $stm->fetchAll(PDO::FETCH_OBJ);

        $total = array();
        $label = array();
        $cantidades = array();
        $montos = array();

        //falta concatener

        foreach ($rs as $key => $inter) {
            array_push($label, $key + 1);
            array_push($cantidades, $inter->cantidadProducto);
            array_push($montos, $inter->totalProducto);
        }

        array_push($total, $label, $cantidades, $montos, $rs);

        return $total;
    }

    public function chart_ejecutivo($opcion, $fecha, $hora_inicial, $hora_final, $sexo) {
        date_default_timezone_set('America/Lima');
        $fechaActual = date('Y-m-d', strtotime(urldecode($fecha)));
        $stm = $this->pdo->prepare("CALL char_ejecutivo_anual(?,?,?,?,?)");
        $stm->execute(array($opcion, $fechaActual, $hora_inicial, $hora_final, $sexo));

        $rs = $stm->fetchAll(PDO::FETCH_OBJ);

        $total = array();
        $tiendas = array();
        $intervenciones = array();
        $recuperado = array();

        foreach ($rs as $inter) {
            array_push($tiendas, $inter->tienda);
            array_push($intervenciones, $inter->intervenciones);
            array_push($recuperado, $inter->recuperado);
        }

        array_push($total, $tiendas, $intervenciones, $recuperado, $rs);

        return $total;
    }

    public function chart_ejecutivo_2($opcion, $fecha, $hora_inicial, $hora_final, $sexo,$meses) {
        date_default_timezone_set('America/Lima');

        $mesesitos = json_decode($meses);
        //return $mesesitos;

        $arrayTotales = array();

        //HACEMOS 12 PETICIONES AL SERVER

        foreach ($mesesitos as $i) {
        //for ($i = 1; $i <= 12; $i++) {
            $mes = $i;
            if ($i < 10) {
                $mes = '0' . $i;
            }
            $fechaActual = date('Y-' . $mes . '-d', strtotime(urldecode($fecha)));
            $db_conect_det = new Conexion();
            $pdo_det = $db_conect_det->getConexion();
            $stm = $pdo_det->prepare("CALL char_ejecutivo_anual(?,?,?,?,?)");
            $stm->execute(array($opcion, $fechaActual, $hora_inicial, $hora_final, $sexo));
            $rs = $stm->fetchAll(PDO::FETCH_OBJ);

            $total = array();
            $tiendas = array();
            $intervenciones = array();
            $recuperado = array();
            
            $interrecupero = array();

            $importe1 = 0;
            $importe2 = 0;

            foreach ($rs as $inter) {
                $importe1 = $importe1 + $inter->intervenciones;
                $importe2 = $importe2 + $inter->recuperado;
                array_push($tiendas, $inter->tienda);
                array_push($intervenciones, $inter->intervenciones);
                array_push($recuperado, $inter->recuperado);
            }
            $mesletras = $this->getMes($i-1);
            array_push($interrecupero, $intervenciones, $recuperado);
            array_push($total, $tiendas, $interrecupero, $rs, $importe1, $importe2,$mesletras);
            array_push($arrayTotales, $total);
        }

        return $arrayTotales;
    }
    
    function getMes ($i){
        $meses = array('ENERO','FEBRERO','MARZO','ABRIL','MAYO','JUNIO','JULIO','AGOSTO','SEPTIEMBRE','OCTUBRE','NOVIEMBRE','DICIEMBRE');
        return $meses[$i];
        
    }

    public function chart_incidente($reporte,$idTienda,$opcion, $fecha, $hora_inicial, $hora_final) {
        date_default_timezone_set('America/Lima');
        $fechaActual = date('Y-m-d', strtotime(urldecode($fecha)));
        $stm = $this->pdo->prepare("CALL char_incidente(?,?,?,?,?,?,?)");
        $stm->execute(array($reporte ,$idTienda, $opcion, $fechaActual, $hora_inicial, $hora_final,''));

        $rs = $stm->fetchAll(PDO::FETCH_OBJ);

        $total = array();
        $tiendas = array();
        $accidentes = array();
        $incidentes = array();

        foreach ($rs as $inter) {
            array_push($tiendas, $inter->tienda);
            array_push($accidentes, $inter->accidentes);
            array_push($incidentes, $inter->incidentes);
        }

        array_push($total, $tiendas, $accidentes, $incidentes, $rs);

        return $total;
    }

    public function chart_incidente_2($reporte, $idTienda, $opcion, $fecha, $hora_inicial, $hora_final) {
        date_default_timezone_set('America/Lima');
        $fechaActual = date('Y-m-d', strtotime(urldecode($fecha)));

        //para la cabecera
        $stm = $this->pdo->prepare("CALL char_incidente(?,?,?,?,?,?,?)");
        $stm->execute(array($reporte,$idTienda, $opcion, $fechaActual, $hora_inicial, $hora_final,'accidente'));
        $rs = $stm->fetchAll(PDO::FETCH_OBJ);

        //para el detalle
        $db = new Conexion();
        $pdo = $db->getConexion();
        $stm_det = $pdo->prepare("CALL char_incidente(?,?,?,?,?,?,?)");
        $stm_det->execute(array(3,$idTienda, $opcion, $fechaActual, $hora_inicial, $hora_final,'accidente'));
        $rs_det = $stm_det->fetchAll(PDO::FETCH_OBJ);

        $cab_incidentes = $this->cab_incidente($idTienda, $opcion, $fechaActual, $hora_inicial, $hora_final);
        $det_incidentes = $this->det_incidente($idTienda, $opcion, $fechaActual, $hora_inicial, $hora_final);

        $total = array();

        array_push($total, $rs,$rs_det,$cab_incidentes,$det_incidentes);
        return $total;
    }

    public function cab_incidente($idTienda, $opcion, $fechaActual, $hora_inicial, $hora_final){
        $db = new Conexion();
        $pdo = $db->getConexion();
        $stm_det = $pdo->prepare("CALL char_incidente(?,?,?,?,?,?,?)");
        $stm_det->execute(array(2,$idTienda, $opcion, $fechaActual, $hora_inicial, $hora_final,'incidente'));
        return $stm_det->fetchAll(PDO::FETCH_OBJ);
    }

    public function det_incidente($idTienda, $opcion, $fecha, $hora_inicial, $hora_final){
        date_default_timezone_set('America/Lima');
        $fechaActual = date('Y-m-d', strtotime(urldecode($fecha)));
        $db = new Conexion();
        $pdo = $db->getConexion();
        $stm_det = $pdo->prepare("CALL char_incidente(?,?,?,?,?,?,?)");
        $stm_det->execute(array(3,$idTienda, $opcion, $fechaActual, $hora_inicial, $hora_final,'incidente'));
        return $stm_det->fetchAll(PDO::FETCH_OBJ);
    }



    public function reporte_main_sensomatizado($reporte,$idTienda,$opcion, $fecha, $hora_inicial, $hora_final){
        date_default_timezone_set('America/Lima');
        $fechaActual = date('Y-m-d', strtotime(urldecode($fecha)));
        $stm = $this->pdo->prepare("CALL char_sensomatizado(?,?,?,?,?,?)");
        $stm->execute(array($reporte ,$idTienda, $opcion, $fechaActual, $hora_inicial, $hora_final));

        $rs = $stm->fetchAll(PDO::FETCH_OBJ);

        $total = array();
        $tiendas = array();
        $intervenciones = array();
        $recuperado = array();

        foreach ($rs as $inter) {
            array_push($tiendas, $inter->tienda);
            array_push($intervenciones, $inter->sensomatizado);
            array_push($recuperado, $inter->total);
        }

        array_push($total, $tiendas, $intervenciones, $recuperado, $rs);

        return $total;
    }

    public function reporte_det_sensomatizado($reporte,$idTienda,$opcion, $fecha, $hora_inicial, $hora_final){
        date_default_timezone_set('America/Lima');
        $fechaActual = date('Y-m-d', strtotime(urldecode($fecha)));
        $stm = $this->pdo->prepare("CALL char_sensomatizado(?,?,?,?,?,?)");
        $stm->execute(array($reporte,$idTienda, $opcion, $fechaActual, $hora_inicial, $hora_final));
        $rs = $stm->fetchAll(PDO::FETCH_OBJ);

        $total = array();
        $label = array();
        $cantidades = array();
        $montos = array();

        foreach ($rs as $key => $inter) {
            array_push($label, $key + 1);
            array_push($cantidades, $inter->cantidadProducto);
            array_push($montos, $inter->totalProducto);
        }


        array_push($total, $label, $cantidades, $montos, $rs);
        return $total;
    }


    public function chart_operatividad($idproducto) {
        $stm = $this->pdo->prepare("CALL char_operatividad(?,?,?)");
        $stm->execute(array(1 ,0, $idproducto));
        $rs = $stm->fetchAll(PDO::FETCH_OBJ);
        $total = array();
        $tiendas = array();
        $accidentes = array();
        $incidentes = array();
        foreach ($rs as $inter) {
            array_push($tiendas, $inter->tienda);
            array_push($accidentes, $inter->reubicados);
            array_push($incidentes, $inter->inoperativo);
        }
        array_push($total, $tiendas, $accidentes, $incidentes, $rs);
        return $total;
    }

    public function chart_det_operatividad() {
        $stm = $this->pdo->prepare("CALL char_operatividad(?,?,?)");
        $stm->execute(array(2 ,0, 0));
        return $stm->fetchAll(PDO::FETCH_OBJ);
    }
}
