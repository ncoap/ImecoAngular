<?php
session_start();
if (@$_SESSION['acceso'] == true) {
    if (@$_SESSION['rol'] == 'ADMINISTRADOR') {
        header('Location: admin.php');
    } else {
        header('Location: jefe.php');
    }
}
?>
<!DOCTYPE html>
<html >
    <head>
        <meta charset="UTF-8">
        <title>PREVENCION EN LINEA - GRUPO ODISEA</title>
        <link rel='stylesheet prefetch' href='http://daneden.github.io/animate.css/animate.min.css'>
        <link rel='stylesheet prefetch' href='http://fonts.googleapis.com/css?family=Roboto:400,100,400italic,700italic,700'>
        <link href="barner/demos/demo.css" rel="stylesheet">
        <link rel="stylesheet" href="barner/css/style.css">
    </head>

    <body>

    <center>
        <img class="logologin"  src="view/img/logo.png">
    </center>

    <div class='form animated flipInX victor-form'>
        <form action="php/controller/LoginController.php" method="post">
            <input type="hidden" name="op" value="1">
            <input placeholder='Username' type='text' name="user" >
            <input placeholder='Password' type='password' name="pass">
            <button class='animated infinite pulse victor-button'>Login</button>
        </form>
    </div>

    <div id="demo4" class="scroll-img" style="
         position: absolute;
         bottom: 0;
         left: 150px;">
        <ul>
            <li><img src="barner/img/1.jpg" width="140"></li>
            <li><img src="barner/img/2.jpg" width="140"></li>
            <li><img src="barner/img/3.jpg" width="140"></li>
            <li><img src="barner/img/4.jpg" width="140"></li>
            <li><img src="barner/img/5.jpg" width="140"></li>
            <li><img src="barner/img/1.jpg" width="140"></li>
            <li><img src="barner/img/2.jpg" width="140"></li>
            <li><img src="barner/img/3.jpg" width="140"></li>
            <li><img src="barner/img/4.jpg" width="140"></li>
            <li><img src="barner/img/5.jpg" width="140"></li>
        </ul>
    </div>

    <script src="barner/js/jquery.min.js"></script>
    <script src="barner/jquery.scrollbox.js"></script>

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
