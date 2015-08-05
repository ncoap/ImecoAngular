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
        <title>PREVENCION EN divNEA - GRUPO ODISEA</title>
        <meta name="viewport" content="width=device-width, initial-scale=1,user-scalable=no">
        <link rel='stylesheet prefetch' href='http://netdna.bootstrapcdn.com/font-awesome/4.0.3/css/font-awesome.min.css'>
        <link rel="stylesheet" href="resources/assets/bootstrap/css/bootstrap.min.css"/>
        <link rel="stylesheet" href="resources/assets/theme/admin.lte.css"/>
        <link rel='stylesheet prefetch' href='http://daneden.github.io/animate.css/animate.min.css'>
        <link href="resources/barner/owl/owl.carousel.css" rel="stylesheet">
        <link href="resources/barner/owl/owl.theme.css" rel="stylesheet">
        <link href="resources/barner/demos/demo.css" rel="stylesheet">
        <link rel="stylesheet" href="resources/barner/css/style.css">
        <style>
            #idLogo{
                -webkit-animation-duration: 2.5s;
                -webkit-animation-delay: 0s;
            }

            #owl-demo .item{
                margin: 3px;
            }
            #owl-demo .item img{
                display: block;
                width: 100%;
                height: auto;
            }
        </style>
    </head>

    <body>

    <center>
        <img id="idLogo" style="margin-top: 32px" class="loologin animated infinite zoomIn"  src="view/img/logo.png">
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

    <div id="owl-demo" class="owl-carousel" style="
         position: absolute;
         bottom: 1em;">
            <div class="item"><img class="img-rounded lazyOwl" src="resources/barner/img/1.jpg"></div>
            <div class="item"><img class="img-rounded lazyOwl" src="resources/barner/img/2.jpg" ></div>
            <div class="item"><img class="img-rounded lazyOwl" src="resources/barner/img/3.jpg" ></div>
            <div class="item"><img class="img-rounded lazyOwl" src="resources/barner/img/5.jpg" ></div>
            <div class="item"><img class="img-rounded lazyOwl" src="resources/barner/img/4.jpg" ></div>
        <div class="item"><img class="img-rounded lazyOwl" src="resources/barner/img/1.jpg"></div>
        <div class="item"><img class="img-rounded lazyOwl" src="resources/barner/img/2.jpg" ></div>
        <div class="item"><img class="img-rounded lazyOwl" src="resources/barner/img/3.jpg" ></div>
        <div class="item"><img class="img-rounded lazyOwl" src="resources/barner/img/5.jpg" ></div>
        <div class="item"><img class="img-rounded lazyOwl" src="resources/barner/img/4.jpg" ></div>
    </div>

    <script src="resources/barner/js/jquery.min.js"></script>
<!--    <script src="resources/barner/jquery.scrollbox.js"></script>-->
    <script src="resources/barner/owl/owl.carousel.js"></script>

    <script>

        /*$(function () {
            $('#demo4').scrollbox({
                direction: 'h'
            });
        });*/
        $(document).ready(function(){
            $("#owl-demo").owlCarousel({
                items : 7,
                lazyLoad : true,
                loop:true,
                autoplayTimeout:1000,
                autoplay : true,
                margin:10,
                slideSpeed: 2000,
                autoplay: 1000,
                stopOnHover : true,
                pagination : false,
                responsive: true,
                itemsDesktop : [1000,5], //5 items between 1000px and 901px
                itemsDesktopSmall : [900,3], // betweem 900px and 601px
                itemsTablet: [600,2], //2 items between 600 and 0
                itemsMobile : false
            });
        });

        $(".logologin").mouseenter(function () {
            $(".logologin").animate({width: '375px'});
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
