<?php
session_start();
if (@$_SESSION['acceso'] == true) {
    
    if (@$_SESSION['rol'] == 'ADMINISTRADOR') {
        header('Location: admin.php');
    } else if (@$_SESSION['rol'] == 'JEFE DE ODISEA') {
        header('Location: odisea.php');
    } else if (@$_SESSION['rol'] == 'GERENTE DE PREVENCION') {
        header('Location: oeschle1.php');
    } else if (@$_SESSION['rol'] == 'JEFE DE PREVENCION') {
        header('Location: oeschle2.php');
    }
    
}
?>
<!DOCTYPE html>
<html >
    <head>
        <meta charset="UTF-8">
        <title>PREVENCION EN LINEA - GRUPO ODISEA</title>
        <meta name="viewport" content="width=device-width, initial-scale=1,user-scalable=no">
        <link rel='stylesheet prefetch' href='http://netdna.bootstrapcdn.com/font-awesome/4.0.3/css/font-awesome.min.css'>
        <link rel="stylesheet" href="resources/assets/bootstrap/css/bootstrap.min.css"/>
        <link rel="stylesheet" href="resources/assets/theme/admin.lte.css"/>
        <link rel='stylesheet prefetch' href='http://daneden.github.io/animate.css/animate.min.css'>
        <link href="resources/barner/demos/demo.css" rel="stylesheet">
        <link rel="stylesheet" href="resources/barner/css/style.css">
    </head>

    <body>

    <center>
        <img style="margin-top: 32px" class="loologin animated infinite pulse"  src="view/img/logo.png">
    </center>

    <div class='victor-form'>
        <form class="form-horizontal" action="php/controller/LoginController.php" method="post">
            <input type="hidden" name="op" value="1">
            <div class="form-group">       
                <div class="col-xs-12">
                    <input class="form-control victor-input" placeholder='Username' type='text' name="user" style="padding: 1.4em" >
                </div>
            </div>
            <div class="form-group">
                <div class="col-xs-12">
                    <input class="form-control victor-input" placeholder='Password' type='password' name="pass" style="padding: 1.4em">
                </div>
            </div>
            <div>
                <button class='animated infinite pulse btn btn-block victor-button'>Login</button>
            </div>

        </form>
    </div>


    <div id="demo4" class="scroll-img" style="
         position: absolute;
         bottom: 0;
         left: 5%">
        <ul>
            <li><img class="img-rounded" src="resources/barner/img/1.jpg" width="140"></li>
            <li><img class="img-rounded" src="resources/barner/img/2.jpg" width="140"></li>
            <li><img class="img-rounded" src="resources/barner/img/3.jpg" width="140"></li>
            <li><img class="img-rounded" src="resources/barner/img/4.jpg" width="140"></li>
            <li><img class="img-rounded" src="resources/barner/img/5.jpg" width="140"></li>
            <li><img class="img-rounded" src="resources/barner/img/1.jpg" width="140"></li>
            <li><img class="img-rounded" src="resources/barner/img/2.jpg" width="140"></li>
            <li><img class="img-rounded" src="resources/barner/img/3.jpg" width="140"></li>
            <li><img class="img-rounded" src="resources/barner/img/4.jpg" width="140"></li>
            <li><img class="img-rounded" src="resources/barner/img/5.jpg" width="140"></li>
        </ul>
    </div>

    <script src="resources/barner/js/jquery.min.js"></script>
    <script src="resources/barner/jquery.scrollbox.js"></script>

    <script>
        $(function () {
            $('#demo4').scrollbox({
                direction: 'h'
            });
        });

        $(".logologin").mouseenter(function () {
            $(".logologin").animate({width: '350px'});
        });
        $(".logologin").mouseleave(function () {
            $(".logologin").animate({width: '380px'});
        });

        setTimeout(function () {
            $(".logologin").fadeIn(500);
        }, 600);

    </script>
</body>
</html>
