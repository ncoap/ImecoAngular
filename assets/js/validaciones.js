
/*Eliminar personal*/

function elimina(codi) {
    var oForm = {
        cod: codi,
        accion: 'eliminapers'
    }
    $.ajax({
        url: '../controlador/valida.php',
        type: 'POST',
        dataType: 'json',
        data: oForm,
        success: function (json) {
            if (json.valid == 0) {
                $('#' + codi).hide(1000);
            }
        }
    }).fail(function () {
        alert("error");
    });
}

/*Elimina curso*/
function elimina2(codi2) {
    var oForm2 = {
        cod: codi2,
        accion: 'eliminacurso'
    }
    $.ajax({
        url: '../controlador/valida.php',
        type: 'POST',
        dataType: 'json',
        data: oForm2,
        success: function (json) {
            if (json.valid == 0) {
                $('#' + codi2).hide(1000);
            }
        }
    }).fail(function () {
        alert("error");
    });
}


jQuery(document).ready(function () {


    $('.success-message').hide();
    $('.error-message').hide();
    /*actualizar seccion institucional*/
    $("#form1").submit(function (e) {
        e.preventDefault();

        var form1 = $(this);
        var postdata = form1.serialize();

        $.ajax({
            type: 'POST',
            url: '../controlador/valida.php',
            data: postdata,
            dataType: 'json',
            success: function (json) {
                if (json.valid == 0) {
                    $('.success-message').hide();
                    $('.error-message').hide();
                    $('.error-message').html(json.message);
                    $('.error-message').fadeIn(1000);
                    $('.error-message').fadeOut(3000);
                }
                else {
                    $('.error-message').hide();
                    $('.success-message').hide();
                    $('.success-message').html(json.message);
                    $('.success-message').fadeIn(1000);
                    $('.success-message').fadeOut(3000);
                }
            }
        });

    });

    /*Actualizar contacto*/
    $("#formcontac").submit(function (e) {
        e.preventDefault();

        var formcontac = $(this);
        var postdata = formcontac.serialize();

        $.ajax({
            type: 'POST',
            url: '../controlador/valida.php',
            data: postdata,
            dataType: 'json',
            success: function (json) {
                if (json.valid == 0) {
                    $('.success-message').hide();
                    $('.error-message').hide();
                    $('.error-message').html(json.message);
                    $('.error-message').fadeIn(1000);
                    $('.error-message').fadeOut(3000);
                }
                else {
                    $('.error-message').hide();
                    $('.success-message').hide();
                    $('.success-message').html(json.message);
                    $('.success-message').fadeIn(1000);
                    $('.success-message').fadeOut(3000);
                }
            }
        });

    });


//       /*eliminar imagenes de slider*/
//       $(".form4").submit(function(e) {
//		e.preventDefault();
//		 
//		var form4 = $(this);
//	    var postdata = form4.serialize();
//	   
//	    $.ajax({
//	        type: 'POST',
//	        url: '../controlador/valida.php',
//	        data: postdata,
//	        dataType: 'json',
//	        success: function(json) {
//                     
//	            if(json.valid == 0) {
//	              
//                      
//	            }
//	            else {
//                        $('.este').fadeOut(3000);
//	                
//                       
//	            }
//	        }
//	    });
//           
//	});
//        
//        $(".form2").submit(function(e) {
//		e.preventDefault();
//		 
//		var form2 = $(this);
//	    var postdata = form2.serialize();
//	   
//	    $.ajax({
//	        type: 'POST',
//	        url: '../controlador/valida.php',
//	        data: postdata,
//	        dataType: 'json',
//	        success: function(json) {
//                     
//	            if(json.valid == 0) {
//	              
//                      
//	            }
//	            else {
//                        $('.este').fadeOut(3000);
////	                 $('.este').fadeIn(3000);
//                       
//	            }
//	        }
//	    });
//           
//	});

    /*Ingresar nuevo Personal*/
    $("#fnewstf").submit(function (e) {
        e.preventDefault();
        var fnewstf = $(this);
        var postdata = fnewstf.serialize();
        $.ajax({
            type: 'POST',
            url: '../controlador/valida.php',
            data: postdata,
            dataType: 'json',
            success: function (json) {
                if (json.valid == 0) {
                    $('.success-message').hide();
                    $('.error-message').hide();
                    $('.error-message').html(json.message);
                    $('.error-message').fadeIn(1000);
                    $('.error-message').fadeOut(3000);
                }
                else {
                    $('.error-message').hide();
                    $('.success-message').hide();
                    $('.success-message').html(json.message);
                    $('.success-message').fadeIn(1000);
                    $('.success-message').fadeOut(3000);
                    setTimeout(function () {
                        location.reload();
                    }, 4000);
                }
            }
        });
    });
});


function CKupdate() {
    for (instance in CKEDITOR.instances)
        CKEDITOR.instances[instance].updateElement();
}
$('#formulariohide').hide();

function muestraformulario() {
    $('#formulariohide').fadeIn(2000);
}

function ocultaformulario() {
    $('#formulariohide').fadeOut(2000);
}



