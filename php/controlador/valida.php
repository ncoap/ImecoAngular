<?php
session_start();
if (isset($_POST['accion'])) {
    $accion = $_POST['accion'];
} else {
    header('Location: ../vista/index.php');
}

include '../util/util.php';

$cnx = new util();
$cn = $cnx->getConexion();

$tildes = $cn->query("SET NAMES 'utf8'");
switch ($accion) {
    case 'editainsti':
        if ($_POST) {
            $texto = $_REQUEST['editor1'];

            if ($texto == '') {
                $array = array();
                $array['valid'] = 0;
                $array['message'] = ' <font class="msg">Tiene que llenar este campo!</font>';
                echo json_encode($array);
            } else {
                $array = array();
                $array['valid'] = 1;
                $array['message'] = '  <font class="msg"> Se actualizo correctamente!</font>';
                echo json_encode($array);
                $res = $cn->prepare("call editainsti(:cuer)");
                $res->bindParam(":cuer", $texto);
                $res->execute();
            }
        }
        break;

    case 'eliminaslider':

        $arc = $_REQUEST['arcborra'];

        unlink('../slider/' . $arc);
        header('Location: ../vista/index.php');

        break;
    case 'eliminaslider2':

        $arc = $_REQUEST['arcborra'];
        header('Location: ../vista/index.php');
        unlink('../slider2/' . $arc);


        break;

    case 'subeslider1':
        $formatos = array('.jpg', '.png');
        $directorio = '../slider';
        if (isset($_POST['boton'])) {
            $nombreArchivo = $_FILES['archivo']['name'];
            $nombreTmpArchivo = $_FILES['archivo']['tmp_name'];
            $ext = substr($nombreArchivo, strrpos($nombreArchivo, '.'));
            if (in_array($ext, $formatos)) {
                if (move_uploaded_file($nombreTmpArchivo, "$directorio/$nombreArchivo")) {
                    header('Location: ../vista/index.php');
                } else {
                    header('Location: ../vista/index.php');
                }
            } else {
                header('Location: ../vista/index.php');
            }
        }
        break;

    case 'subeslider2':
        $formatos = array('.jpg', '.png');
        $directorio2 = '../slider2/';


        if (isset($_POST['boton2'])) {
            $nombreArchivo2 = $_FILES['archivo2']['name'];
            $nombreTmpArchivo2 = $_FILES['archivo2']['tmp_name'];
            $ext2 = substr($nombreArchivo2, strrpos($nombreArchivo2, '.'));
            if (in_array($ext2, $formatos)) {
                if (move_uploaded_file($nombreTmpArchivo2, "$directorio2/$nombreArchivo2")) {
                    header('Location: ../vista/index.php');
                } else {
                    header('Location: ../vista/index.php');
                }
            } else {
                header('Location: ../vista/index.php');
            }
        }
        break;

    case 'nuevopers':
        $nom = $_REQUEST['nomstf'];
        $ruta = "../staff/";
        $archivo = @$_FILES['img']['tmp_name'];
        $nom_archivo = @$_FILES['img']['name'];
        $ext = pathinfo($nom_archivo);
        if ($nom == '') {
            $_SESSION['okk'] = '<font class="msg2">Tiene que llenar todos los campos!</font>';
            header('location: ../vista/staff.php');
        } else {
            $res = $cn->prepare("call nuevopers(:nom)");
            $res->bindParam(":nom", $nom);
            $res->execute();
            foreach ($res as $row) {
                move_uploaded_file($archivo, $ruta . "/" . $row[0] . "." . @$ext['extension']);
            }
        }
        header('Location: ../vista/staff.php');
        break;

    case 'eliminapers':
        $cod = $_REQUEST['cod'];
        $array = array();
        $array['valid'] = 0;
        $array['message'] = 'Se Elimino correctamente';
        echo json_encode($array);
        $res = $cn->prepare("call eliminapers(:cod)");
        $res->bindParam("cod", $cod);
        $res->execute();
        break;

    case 'actcontacto':
        $fono1 = $_REQUEST['fono1'];
        $fono2 = $_REQUEST['fono2'];
        $dire = $_REQUEST['dire'];
        $email = $_REQUEST['email'];
        if ($dire == '') {
            $array = array();
            $array['valid'] = 0;
            $array['message'] = ' <font class="msg">Tiene que llenar todos los campos!</font>';
            echo json_encode($array);
        } else {
            $array = array();
            $array['valid'] = 1;
            $array['message'] = '  <font class="msg"> Se actualizo correctamente!</font>';
            echo json_encode($array);
            $res = $cn->prepare("call actcontacto(:tl1, :tl2, :dire, :mail)");
            $res->bindParam(":tl1", $fono1);
            $res->bindParam(":tl2", $fono2);
            $res->bindParam(":dire", $dire);
            $res->bindParam(":mail", $email);
            $res->execute();
        }
        break;
    case 'registrar_enlace':
        $titulo = $_POST['titulo'];
        $enlace = $_POST['enlace'];
        $res = $cn->prepare("CALL sp_registrar_enlace_interes(:p_titulo, :p_enlace)");
        $res->bindParam(":p_titulo", $titulo);
        $res->bindParam(":p_enlace", $enlace);
        $res->execute();
        //COMO MANEJO LOS ERRORES DEL PROCEDIMIENTO REGISTRO ????
        echo json_encode("OK");
        break;
    case 'eliminapers':
        $cod = $_REQUEST['cod'];
        $array = array();
        $array['valid'] = 0;
        $array['message'] = 'Se Elimino correctamente';
        echo json_encode($array);
        $res = $cn->prepare("call eliminacurso(:cod)");
        $res->bindParam("cod", $cod);
        $res->execute();
        break;
    default:
        header("Location: ../vista/index.php");
        break;
}
?>
