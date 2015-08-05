<?php
session_start();
if (@$_SESSION['acceso'] != true) {
    header('Location: index.php');
} else {
    if (@$_SESSION['rol'] == 'ADMINISTRADOR') {
        header('Location: admin.php');
    } else if (@$_SESSION['rol'] == 'JEFE DE ODISEA') {
        header('Location: odisea.php');
    } else if (@$_SESSION['rol'] == 'GERENTE DE PREVENCION') {
        header('Location: oeschle.php');
    }
}
?>
<!DOCTYPE html>
<html lang="es" ng-app="ngOdisea" ng-controller="OdiseaController">

<head>
    <meta charset="UTF-8">
    <title ng-bind="pageTitle"></title>
    <meta name="viewport" content="width=device-width, initial-scale=1,user-scalable=no">
    <link rel="stylesheet" href="resources/assets/bootstrap/css/bootstrap.min.css"/>
    <link href="https://maxcdn.bootstrapcdn.com/font-awesome/4.3.0/css/font-awesome.min.css" rel="stylesheet"
          type="text/css">
    <link href="https://code.ionicframework.com/ionicons/2.0.1/css/ionicons.min.css" rel="stylesheet" type="text/css">
    <link rel="stylesheet" href="resources/assets/theme/admin.lte.css"/>
    <link rel="stylesheet" href="resources/assets/theme/_all-skins.min.css"/>
    <link rel="stylesheet" href="resources/css/transition.css"/>
    <link rel="stylesheet" href="http://daneden.github.io/animate.css/animate.min.css">
    <link rel="stylesheet" href="resources/assets/chart/angular-chart.css"/>
    <link rel="stylesheet" href="resources/assets/xeditable/css/xeditable.css"/>
    <link rel="stylesheet" href="resources/assets/dialog/dialogs.min.css"/>
    <link rel="stylesheet" href="resources/css/imeco.css"/>
</head>

<body class="skin-red sidebar-mini">
<div class="wrapper">
    <header class="main-header">
        <a href="#home" class="logo">
                    <span class="logo-mini">
                        <img style="width: 40px;" src="resources/img/otros/logo-mini.png">
                    </span>
                    <span class="logo-lg">
                        <img src="resources/img/otros/logooes.png">
                    </span>
        </a>

        <nav class="navbar navbar-static-top" role="navigation">
            <a href="#" class="sidebar-toggle" data-toggle="offcanvas" role="button">
                <span class="sr-only">Toggle navigation</span>
            </a>

            <div class="navbar-custom-menu">
                <ul class="nav navbar-nav">
                    <li class="dropdown user user-menu">
                        <a href="" class="dropdown-toggle" data-toggle="dropdown">
                            <img src="resources/img/otros/user2-160x160.jpg" class="user-image" alt="User Image"/>
                            <span class="hidden-xs"> Usuario </span>
                        </a>
                        <ul class="dropdown-menu">
                            <li class="user-header">
                                <img src="resources/img/otros/user2-160x160.jpg" class="img-circle" alt="User Image"/>

                                <p>
                                    <?= $_SESSION['rol'] ?>
                                </p>
                            </li>

                            <li class="user-footer">
                                <div class="pull-right">
                                    <a id="id-btn-exit" href="php/controller/LoginController.php?op=2"
                                       class="btn btn-default btn-flat">Salir</a>
                                </div>
                            </li>
                        </ul>
                    </li>
                </ul>
            </div>
        </nav>
    </header>
    <aside class="main-sidebar">
        <section class="sidebar">
            <div class="user-panel">
                <div class="pull-left image">
                    <img src="resources/img/otros/user2-160x160.jpg" class="img-circle" alt="User Image"/>
                </div>
                <div class="pull-left info">
                    <p> <?= $_SESSION['rol'] ?>  </p>
                    <a href="#"><i class="fa fa-circle text-success"></i> Online</a>
                </div>
            </div>
            <ul class="sidebar-menu">
                <li class="header">Menu</li>
                <li class="treeview">
                    <a href=""><i class='fa fa-user'></i> <span>Intervenciones</span>
                        <i class="fa fa-angle-left pull-right"></i>
                    </a>
                    <ul class="treeview-menu">
                        <li><a href="#intervenciones"><i
                                    class="fa fa-file-text"></i><span>Visualizar Registros</span></a></li>
                     </ul>
                </li>
                <li class="treeview">
                    <a href="">
                        <i class='fa fa-ambulance'></i>
                        <span>Reporte de Riesgos</span>
                        <i class="fa fa-angle-left pull-right"></i>
                    </a>
                    <ul class="treeview-menu">
                        <li>
                            <a href="#incidentes">
                                <i class="fa fa-file-text"></i>
                                <span>Ver Registros</span>
                            </a>
                        </li>
                    </ul>
                </li>
                <li class="treeview">
                    <a href="">
                        <i class='fa fa-cab'></i>
                        <span>Continuidad Operativa</span>
                        <i class="fa fa-angle-left pull-right"></i>
                    </a>
                    <ul class="treeview-menu">
                        <li>
                            <a href="">
                                <i class="fa fa-circle-o text-aqua"></i>
                                <span>Reportes</span>
                            </a>
                        </li>
                    </ul>
                </li>
                <li class="treeview">
                    <a href="">
                        <i class='fa fa-laptop'></i>
                        <span>Prod. No Sensomatizado</span>
                        <i class="fa fa-angle-left pull-right"></i>
                    </a>
                    <ul class="treeview-menu">
                        <li>
                            <a href="#nosensomatizados">
                                <i class="fa fa-circle-o text-aqua"></i>
                                <span>Visualizar Registros</span>
                            </a>
                        </li>
                    </ul>
                </li>
                <li class="header">
                    <center><img src="resources/img/otros/logo.png" width="90%"></center>
                </li>
            </ul>
        </section>
    </aside>

    <div class="content-wrapper">
        <section class="content" ui-view="main">
        </section>
    </div>

    <footer class="main-footer imeco-center" style="padding: 0 !important;">
        <strong>Desarrollado Por
            <a target="_blank" href="http://www.innovatechperusac.com/">INNOVATECHPERÚ.</a></strong>
        Copyright © 2015
    </footer>
</div>

<script src="resources/assets/jquery/jQuery-2.1.4.min.js"></script>
<script src="resources/assets/bootstrap/js/bootstrap.min.js"></script>
<script src="resources/assets/theme/js/app.js"></script>
<script>
    $(function () {
        $("body").addClass('sidebar-collapse');
    });
</script>

<script src="resources/assets/angular/angular-1.3.min.js"></script>
<script src="resources/assets/angular/ui-bootstrap-tpls-0.13.0.min.js"></script>
<script src="resources/assets/angular/angular-ui-router.min.js"></script>
<script src="resources/assets/angular/angular-resource.min.js"></script>
<script src="resources/assets/angular/angular-animate.min.js"></script>

<script src="resources/assets/angular/texteditor/textAngular-sanitize.min.js"></script>
<script src="resources/assets/angular/texteditor/textAngular.min.js"></script>


<!--modales personlizadas de angular-->
<script src="resources/assets/dialog/dialogs.js"></script>

<!--CHART-->
<script src="resources/assets/chart/Chart.min.js"></script>
<script src="resources/assets/chart/angular-chart.min.js"></script>

<!--EDITABLE-->
<script src="resources/assets/xeditable/js/xeditable.min.js"></script>


<script src="oeschle2.js"></script>
<script src="resources/assets/angular/checklist-model.js"></script>
<script src="oeschle2/home/home.js"></script>
<script src="oeschle2/operatividad/operatividad.js"></script>
<script src="oeschle2/intervencion/listar/listar_intervencion.js"></script>
<script src="oeschle2/intervencion/registrar/registrar_intervencion.js"></script>
<script src="oeschle2/intervencion/actualizar/actualizar_intervencion.js"></script>
<script src="oeschle2/intervencion/consolidado/consolidado.js"></script>
<script src="oeschle2/intervencion/reporte/ejecutivo.js"></script>
<script src="oeschle2/sensomatizado/listar/listar_sensomatizado.js"></script>
<script src="oeschle2/sensomatizado/registrar/registrar_sensomatizado.js"></script>
<script src="oeschle2/sensomatizado/actualizar/actualizar_sensomatizado.js"></script>
<script src="oeschle2/incidente/listar/listar_incidente.js"></script>
<script src="oeschle2/incidente/registrar/registrar_incidente.js"></script>
<script src="oeschle2/incidente/actualizar/actualizar_incidente.js"></script>

</body>
</html>