<?php
session_start();

if (@$_SESSION['acceso'] != true) {
    header('Location: index.php');
} else {
    if (@$_SESSION['rol'] == 'JEFE DE ODISEA') {
        header('Location: odisea.php');
    } else if (@$_SESSION['rol'] == 'GERENTE DE PREVENCION') {
        header('Location: oeschle1.php');
    } else if (@$_SESSION['rol'] == 'JEFE DE PREVENCION') {
        header('Location: oeschle2.php');
    }
}
?>
<!DOCTYPE html>
<html lang="es" ng-app="ngOdisea" ng-controller="OdiseaController">

    <head>
        <meta charset="UTF-8">
        <title ng-bind="pageTitle"></title>
        <meta name="viewport" content="width=device-width, initial-scale=1,user-scalable=no">
        <link rel='stylesheet prefetch' href='http://netdna.bootstrapcdn.com/font-awesome/4.0.3/css/font-awesome.min.css'>
        <link rel="stylesheet" href="resources/assets/bootstrap/css/bootstrap.min.css"/>
        <link rel="stylesheet" href="resources/assets/theme/admin.lte.css"/>
        <link rel="stylesheet" href="resources/assets/theme/_all-skins.min.css"/>
        <link rel="stylesheet" href="resources/css/transition.css"/>
        <link rel='stylesheet prefetch' href='http://daneden.github.io/animate.css/animate.min.css'>
        <link rel="stylesheet" href="resources/assets/chart/angular-chart.css"/>
        <link rel="stylesheet" href="resources/assets/dialog/dialogs.min.css"/>
        <link rel="stylesheet" href="resources/css/imeco.css"/>
    </head>

    <body class="skin-red sidebar-mini">
        <div class="wrapper">
            <header class="main-header">
                <a href="index.php" class="logo">
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
                                <a href="#" class="dropdown-toggle" data-toggle="dropdown">
                                    <img src="resources/img/otros/user2-160x160.jpg" class="user-image" alt="User Image"/>
                                    <span class="hidden-xs"> Usuario </span>
                                </a>
                                <ul class="dropdown-menu">
                                    <li class="user-header">
                                        <img src="resources/img/otros/user2-160x160.jpg" class="img-circle" alt="User Image" />
                                        <p>
                                            <?= $_SESSION['rol'] ?>
                                        </p>
                                    </li>

                                    <li class="user-footer">
                                        <div class="pull-right">
                                            <a id="id-btn-exit" href="php/controller/LoginController.php?op=2" class="btn btn-default btn-flat">Salir</a>
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
                            <img src="resources/img/otros/user2-160x160.jpg" class="img-circle" alt="User Image" />
                        </div>
                        <div class="pull-left info">
                            <p> <?= $_SESSION['rol'] ?>  </p>
                            <a href="#"><i class="fa fa-circle text-success"></i> Online</a>
                        </div>
                    </div>
                    <ul class="sidebar-menu">
                        <li class="header">Menu</li>
                        <li class="treeview">
                            <a href=""><i class='fa fa-users'></i> <span>Intervenciones</span> 
                                <i class="fa fa-angle-left pull-right"></i>
                            </a>
                            <ul class="treeview-menu">
                                <li><a href="#intervencion"><i class="fa fa-file"></i><span>Registrar Intervención</span></a></li>
                                <li><a href="#intervenciones"><i class="fa fa-file"></i><span>Visualizar Registros</span></a></li>
                                <li><a href="#consolidado"><i class='fa fa-book'></i><span>Gráficas por Mes</span></a></li>
                                <li><a href="#ejecutivo"><i class='fa fa-file'></i><span>Reporte Ejecutivo</span></a></li>
                            </ul>
                        </li>
                        <li class="treeview">
                            <a href=""><i class='fa fa-book'></i> <span>Reporte de Riesgos </span> <i class="fa fa-angle-left pull-right"></i></a>
                            <ul class="treeview-menu">
                                <li><a href="#"><i class="fa fa-file"></i><span>Registro de accidentes</span></a></li>
                                <li><a href="#"><i class="fa fa-file"></i><span>Registro de incidentes</span></a></li>                 
                                <li><a href="#"><i class='area-chart'></i><span>Graficas por mes</span></a></li>

                            </ul>
                        </li>
                        <li class="treeview">
                            <a href="">
                                <i class='fa fa-book'></i>
                                <span>Continuidad Operativa</span> 
                                <i class="fa fa-angle-left pull-right"></i>
                            </a>
                            <ul class="treeview-menu">
                                <li><a href="#"><i class="fa fa-circle-o"></i><span>Cctv</span></a></li>
                                <li><a href="#"><i class="fa fa-circle-o"></i><span>Lci</span></a></li>
                                <li><a href="#"><i class="fa fa-circle-o"></i><span>Antenas</span></a></li>
                                <li><a href="#"><i class="fa fa-circle-o"></i><span>Radios</span></a></li>
                            </ul>
                        </li>
                        <li class="treeview">
                            <a href="">
                                <i class='fa fa-book'></i>
                                <span>Prod. No Sensomatizado</span> 
                                <i class="fa fa-angle-left pull-right"></i>
                            </a>
                            <ul class="treeview-menu">
                                <li><a href="#nosensomatizado"><i class="fa fa-circle-o"></i><span>Registro de Producto</span></a></li>
                                <li><a href="#nosensomatizados"><i class="fa fa-circle-o"></i><span>Visualizar Registros</span></a></li>
                            </ul>
                        </li>
                        <li class="header"><center> <img src="resources/img/otros/logo.png" width="90%"></center> </li>
                    </ul>
                </section>
            </aside>

            <div class="content-wrapper">
                <section class="content" ui-view="main">
                </section>
            </div>

            <footer class="main-footer imeco-center" >
                <strong>Desarrollado Por 
                    <a target="_blank" href="http://www.innovatechperusac.com/">INNOVATECHPERÚ.</a></strong>
                Copyright © 2015
            </footer>
        </div>

        <script src="resources/assets/jquery/jQuery-2.1.4.min.js"></script>
        <script src="resources/assets/bootstrap/js/bootstrap.min.js"></script>
        <script src="resources/assets/theme/js/app.js" ></script>
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


        <script src="admin.js"></script>
        <script src="resources/assets/angular/checklist-model.js"></script>
        <script src="view/home/home.js"></script>
        <script src="view/intervencion/listar/listar_intervencion.js"></script>
        <script src="view/intervencion/registrar/registrar_intervencion.js"></script>
        <script src="view/intervencion/actualizar/actualizar_intervencion.js"></script>
        <script src="view/intervencion/consolidado/consolidado.js"></script>
        <script src="view/intervencion/reporte/ejecutivo.js"></script>
        <script src="view/sensomatizado/listar/listar_sensomatizado.js"></script>
        <script src="view/sensomatizado/registrar/registrar_sensomatizado.js"></script>
        <script src="view/sensomatizado/actualizar/actualizar_sensomatizado.js"></script>


    </body>
</html>