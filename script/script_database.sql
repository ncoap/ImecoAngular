CREATE DATABASE  IF NOT EXISTS `prevevbl_odiseamysql`;
USE `prevevbl_odiseamysql`;



DROP TABLE IF EXISTS `empresa`;
CREATE TABLE `empresa` (
  `id_emp` int(11) NOT NULL,
  `nom_emp` varchar(50) NOT NULL,
  `usuario` varchar(15) NOT NULL,
  `pass_emp` varchar(15) NOT NULL,
  `estado` varchar(1) NOT NULL,
  PRIMARY KEY (`id_emp`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

LOCK TABLES `empresa` WRITE;
INSERT INTO `empresa` VALUES (1,'oechsle','empresa','12345','A');
UNLOCK TABLES;


DROP TABLE IF EXISTS `tienda`;
CREATE TABLE `tienda` (
  `id_tien` int(11) NOT NULL,
  `nom_tien` varchar(35) NOT NULL,
  `id_emp` int(11) NOT NULL,
  `usuario` varchar(15) NOT NULL,
  `pass_tien` varchar(15) NOT NULL,
  `estado` varchar(1) NOT NULL,
  PRIMARY KEY (`id_tien`),
  KEY `FK_idemp_tien` (`id_emp`),
  CONSTRAINT `FK_idemp_tien` FOREIGN KEY (`id_emp`) REFERENCES `empresa` (`id_emp`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

LOCK TABLES `tienda` WRITE;
INSERT INTO `tienda` VALUES (1,'(OECHSLE) Salaverry',1,'tienda_retail','grupoodisea2015','A'),(2,'(OECHSLE) Jockey Plaza',1,'tienda_retail','grupoodisea2015','A'),(3,'(OECHSLE) Plaza Norte',1,'tienda_retail','grupoodisea2015','A'),(4,'(OECHSLE) Centro Civico',1,'tienda_retail','grupoodisea2015','A'),(5,'(OECHSLE) JR Union',1,'tienda_retail','grupoodisea2015','A'),(6,'(OECHSLE) Primavera',1,'tienda_retail','grupoodisea2015','A'),(7,'(OECHSLE) Plaza Lima Norte',1,'tienda_retail','grupoodisea2015','A'),(8,'(OECHSLE) CUSCO',1,'tienda_retail','grupoodisea2015','A'),(9,'(OECHSLE) AREQUIPA',1,'tienda_retail','grupoodisea2015','A'),(10,'(OECHSLE) JULIACA',1,'tienda_retail','grupoodisea2015','A'),(11,'(OECHSLE) HUANCAYO',1,'tienda_retail','grupoodisea2015','A'),(12,'(OECHSLE) BARRANCA',1,'tienda_retail','grupoodisea2015','A'),(13,'(OECHSLE) CAJAMARCA',1,'tienda_retail','grupoodisea2015','A'),(14,'(OECHSLE) CHICLAYO',1,'tienda_retail','grupoodisea2015','A'),(15,'(OECHSLE) PUCALLPA',1,'tienda_retail','grupoodisea2015','A'),(16,'(OECHSLE) TRUJILLO',1,'tienda_retail','grupoodisea2015','A'),(17,'(OECHSLE) PIURA',1,'tienda_retail','grupoodisea2015','A'),(18,'(OECHSLE) HUANCAYO',1,'tienda_retail','grupoodisea2015','A'),(19,'(OECHSLE) ICA',1,'tienda_retail','grupoodisea2015','A'),(20,'CARPA Pro',1,'tienda_retail','grupoodisea2015','A'),(21,'CARPA Santa Clara',1,'tienda_retail','grupoodisea2015','A');
UNLOCK TABLES;



DROP TABLE IF EXISTS `puesto`;
CREATE TABLE `puesto` (
  `id_pues` int(11) NOT NULL,
  `des_pues` varchar(35) NOT NULL,
  PRIMARY KEY (`id_pues`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

LOCK TABLES `puesto` WRITE;
INSERT INTO `puesto` VALUES (1,'Tangos(Puerta)'),(2,'Movil (Sala de ventas)'),(3,'Aguia (Cctv)'),(4,'Alto Valor'),(5,'Almacen'),(6,'Probadores');
UNLOCK TABLES;


DROP TABLE IF EXISTS `tipo_tendero`;
CREATE TABLE `tipo_tendero` (
  `id_tip_ten` int(11) NOT NULL,
  `des_tip_ten` varchar(20) NOT NULL,
  PRIMARY KEY (`id_tip_ten`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

LOCK TABLES `tipo_tendero` WRITE;
INSERT INTO `tipo_tendero` VALUES (1,'Oportunista'),(2,'Profesional'),(3,'Interno');
UNLOCK TABLES;



DROP TABLE IF EXISTS `tendero`;
CREATE TABLE `tendero` (
  `id_ten` int(11) NOT NULL AUTO_INCREMENT,
  `nom_ten` varchar(100) NOT NULL,
  `ape_ten` varchar(100) NOT NULL,
  `dir_ten` varchar(150) NOT NULL,
  `doc_ten` varchar(15) NOT NULL,
  `id_tip_ten` int(11) NOT NULL,
  `fec_nac` date NOT NULL,
  `sexo` char(1) NOT NULL,
  `foto_ten` varchar(150) NOT NULL,
  PRIMARY KEY (`id_ten`),
  UNIQUE KEY `doc_ten` (`doc_ten`),
  KEY `FK_Ten_Tip` (`id_tip_ten`),
  CONSTRAINT `FK_Ten_Tip` FOREIGN KEY (`id_tip_ten`) REFERENCES `tipo_tendero` (`id_tip_ten`)
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=latin1;

LOCK TABLES `tendero` WRITE;
INSERT INTO `tendero` VALUES (1,'JOSELLY ALEXANDRA','GUERRERO NARVAEZ','lar gardewinas','58687858',1,'1990-06-05','M','view/imagen_tendero/1.jpg'),(2,'LIZBETH LIDUVINA','LLANCARI RIVEROS','san juan de lurigancho','15254578',1,'1990-05-05','F','view/imagen_tendero/2.jpg'),(3,'CARMEN ROSA','CANCHARI CUELLAR','san isidro','56544258',2,'1990-08-05','M','view/imagen_tendero/3.jpg'),(4,'ALBERT GONZALO','SILVA AHRENS','jicamarca','87554847',2,'1990-05-05','M','view/imagen_tendero/4.jpg'),(5,'CAROLINE GIULIANA','TERRONES MORENO','miraflores','69685587',2,'1990-09-05','M','view/imagen_tendero/5.jpg'),(6,'Nelson','Coqchi','Las Galeras','46435529',1,'2015-07-08','M','view/imagen_tendero/46435529.jpg'),(12,'jOSE lUIS','ADMIN','MASETRAS','69584475',1,'2015-07-09','M','view/imagen_tendero/69584475.jpg'),(13,'NUEVO TENDERO','COQCHI APAZA','','12345678',1,'2015-07-09','M','view/imagen_tendero/12345678.jpg'),(14,'rezo','goez','','56456676',1,'2015-07-10','M','view/imagen_tendero/56456676.jpg'),(15,'5432','54321','','99999999',1,'2015-07-10','M','view/imagen_tendero/99999999.jpg'),(17,'probando','asdasd','','69685580',1,'2015-07-11','M','view/imagen_tendero/69685580.jpg'),(18,'nelson montes','sanomamani','','46435522',1,'2015-07-11','M','view/imagen_tendero/46435523.jpg'),(19,'CHAPI','RAMOS HUILCA','','46465523',1,'2015-07-11','M','view/imagen_tendero/46465523.jpg'),(20,'asd','asd','','46435521',1,'2015-07-11','M','view/imagen_tendero/46435523.jpg'),(21,'CONDORI','RAMOS','CALLE BAJA','46435531',2,'2015-07-11','M','view/imagen_tendero/46435531.jpg'),(22,'VREONICA','CARMENSITA','LAS MALVINAS','11112222',3,'2015-07-11','M','view/imagen_tendero/11112222.jpg'),(23,'ASDAS','ASDAS','','11113333',1,'2015-07-11','M','view/imagen_tendero/11113333.jpg'),(24,'asdasd','asdasd','','11115555',1,'2015-07-11','M','view/imagen_tendero/11115555.jpg');
UNLOCK TABLES;



DROP TABLE IF EXISTS `cab_interven`;
CREATE TABLE `cab_interven` (
  `num_inte` int(11) NOT NULL AUTO_INCREMENT,
  `fec_inte` datetime NOT NULL,
  `id_ten` int(11) NOT NULL,
  `der_ten` varchar(25) DEFAULT NULL,
  `lugar_derivacion` varchar(150) DEFAULT NULL,
  `dni_prev` int(11) NOT NULL,
  `nom_prev` varchar(150) DEFAULT NULL,
  `id_pues` int(11) NOT NULL,
  `mod_empl` varchar(500) DEFAULT NULL,
  `det_inte` varchar(600) DEFAULT NULL,
  `id_tien` int(11) NOT NULL,
  PRIMARY KEY (`num_inte`),
  KEY `FK_idTen_Cab_in` (`id_ten`),
  KEY `FK_idprev_Cab_in` (`dni_prev`),
  KEY `FK_idpues_Cab_in` (`id_pues`),
  KEY `FK_idtien_Cab_in` (`id_tien`),
  CONSTRAINT `FK_idpues_Cab_in` FOREIGN KEY (`id_pues`) REFERENCES `puesto` (`id_pues`),
  CONSTRAINT `FK_idten_Cab_in` FOREIGN KEY (`id_ten`) REFERENCES `tendero` (`id_ten`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `FK_idtien_Cab_in` FOREIGN KEY (`id_tien`) REFERENCES `tienda` (`id_tien`)
) ENGINE=InnoDB AUTO_INCREMENT=48 DEFAULT CHARSET=latin1;



DROP TABLE IF EXISTS `det_interven`;
CREATE TABLE `det_interven` (
  `num_inte` int(11) NOT NULL,
  `cod_pro` varchar(30) DEFAULT NULL,
  `des_pro` varchar(100) DEFAULT NULL,
  `mar_pro` varchar(50) DEFAULT NULL,
  `cant` int(11) DEFAULT NULL,
  `precio` double DEFAULT NULL,
  KEY `FK_numinte_Cab_in` (`num_inte`),
  CONSTRAINT `fk_det_inter_cab_inter` FOREIGN KEY (`num_inte`) REFERENCES `cab_interven` (`num_inte`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;



DROP TABLE IF EXISTS `producto_sensomatizado`;
CREATE TABLE `producto_sensomatizado` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `dni_prev` varchar(15) NOT NULL,
  `nom_prev` varchar(150) NOT NULL,
  `fecha_registro` datetime NOT NULL,
  `cod_pro` varchar(30) NOT NULL,
  `desc_pro` varchar(100) NOT NULL,
  `mar_pro` varchar(50) NOT NULL,
  `cant_pro` int(11) NOT NULL,
  `precio_pro` double NOT NULL,
  `total_pro` double NOT NULL,
  `observaciones` varchar(600) NOT NULL,
  `foto_producto` varchar(250) NOT NULL,
  `id_tien` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_sensomattizado_tienda_idx` (`id_tien`),
  CONSTRAINT `fk_sensomattizado_tienda` FOREIGN KEY (`id_tien`) REFERENCES `tienda` (`id_tien`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=latin1;






DELIMITER ;;
CREATE DEFINER=`root`@`%` FUNCTION `diaSemana`(dia int) RETURNS varchar(15) CHARSET latin1
BEGIN

DECLARE diaSemana VARCHAR(15);

CASE dia
      WHEN 1 THEN SET diaSemana = 'Lunes';
      WHEN 2 THEN SET diaSemana = 'Martes';
      WHEN 3 THEN SET diaSemana = 'Miercoles';
      WHEN 4 THEN SET diaSemana = 'Jueves';
      WHEN 5 THEN SET diaSemana = 'Viernes';
      WHEN 6 THEN SET diaSemana = 'Sabado';
      WHEN 0 THEN SET diaSemana = 'Domingo';
    END CASE;
return diaSemana;
END ;;
DELIMITER ;


DELIMITER ;;
CREATE DEFINER=`root`@`%` PROCEDURE `exist_tendero_by_dni`(p_dni int)
select coalesce(count(id_ten),0) as exist from tendero where  doc_ten = p_dni ;;
DELIMITER ;


DELIMITER ;;
CREATE DEFINER=`root`@`%` PROCEDURE `get_detalle_intervencion_by_id`(p_id int)
select cod_pro as codigo, des_pro as producto,
mar_pro as marca, cant as cantidad , precio
from det_interven where num_inte = p_id ;;
DELIMITER ;


DELIMITER ;;
CREATE DEFINER=`root`@`%` PROCEDURE `get_tendero_by_dni`(p_dni varchar(15))
select 
id_ten as id, 
nom_ten as nombre ,  
ape_ten as apellido , 
dir_ten as direccion ,
doc_ten as dni , 
id_tip_ten as tipo, 
fec_nac as nacimiento, 
sexo , 
foto_ten as foto 
from 
tendero 
where doc_ten = p_dni ;;
DELIMITER ;


DELIMITER ;;
CREATE DEFINER=`root`@`%` PROCEDURE `listado_intervenciones_multiple`(
	col_tienda varchar(100),
	col_tendero varchar(100),
	col_dni varchar(20),
	col_sexo varchar(20),
	col_tipoTendero varchar(100),
	col_fecha_desde varchar(50),
	col_fecha_hasta varchar(50)
)
BEGIN
SET @npfx_query = CONCAT(
"SELECT 
inter.num_inte as id,
ti.nom_tien AS tienda,
CONCAT(ten.nom_ten,', ',ten.ape_ten) AS tendero,
ten.foto_ten AS foto,
ten.doc_ten AS dni,
TIMESTAMPDIFF(YEAR, ten.fec_nac, CURDATE()) AS edad,
ten.sexo as sexo,
diaSemana(DATE_FORMAT(inter.fec_inte , '%w')) AS dia,
DATE_FORMAT(inter.fec_inte , '%h:%i %p') AS hora,
DATE_FORMAT(inter.fec_inte , '%d/%m/%Y') AS fecha,
tipo.des_tip_ten as tipoTendero
FROM 
cab_interven inter 
INNER JOIN tienda ti 
on inter.id_tien = ti.id_tien 
INNER JOIN tendero ten  
ON inter.id_ten = ten.id_ten 
INNER JOIN tipo_tendero tipo  
ON ten.id_tip_ten = tipo.id_tip_ten 
WHERE ",col_tienda," 
AND CONCAT(ten.nom_ten,', ',ten.ape_ten) LIKE '%",col_tendero,"%' 
AND ten.doc_ten LIKE '%",col_dni,"%' 
AND ten.sexo LIKE '%",col_sexo,"%'
AND ",col_tipoTendero," 
AND inter.fec_inte BETWEEN '",col_fecha_desde,"' AND '",col_fecha_hasta,"' ORDER BY inter.fec_inte DESC");
PREPARE not_prefixed FROM @npfx_query;
EXECUTE not_prefixed;
END ;;
DELIMITER ;



DELIMITER ;;
CREATE DEFINER=`root`@`127.0.0.1` PROCEDURE `listado_productos_no_sensomatizados_multiple`(
	col_tienda varchar(100),
	col_nombre varchar(150),
	col_dni varchar(20),
	col_fecha_desde varchar(50),
	col_fecha_hasta varchar(50)
)
BEGIN
SET @npfx_query = CONCAT(
"SELECT 
p.id,
p.dni_prev as dni,
p.nom_prev as prevencionista,
DATE_FORMAT(p.fecha_registro,'%d/%m/%Y %h:%i %p') as fecha,
p.cod_pro as codigo,
p.desc_pro as descripcion,
p.mar_pro as marca,
p.cant_pro as cantidad,
p.precio_pro as precio,
p.total_pro as total,
p.observaciones as observaciones,
p.foto_producto as foto,
t.nom_tien as tienda
FROM 
producto_sensomatizado p 
inner join tienda t 
ON t.id_tien = p.id_tien
WHERE ",col_tienda,"  
AND p.nom_prev LIKE '%",col_nombre,"%' 
AND p.dni_prev LIKE '%",col_dni,"%'
AND p.fecha_registro BETWEEN '",col_fecha_desde,"' AND '",col_fecha_hasta,"' ORDER BY p.fecha_registro DESC");
PREPARE not_prefixed FROM @npfx_query;
EXECUTE not_prefixed;
END ;;
DELIMITER ;



DELIMITER ;;
CREATE DEFINER=`root`@`127.0.0.1` PROCEDURE `sp_get_id_tendero_by_dni`(
p_dni varchar(15)
)
BEGIN


SELECT id_ten from tendero where doc_ten = p_dni;

END ;;
DELIMITER ;



DELIMITER ;;
CREATE DEFINER=`root`@`127.0.0.1` PROCEDURE `sp_get_ultimos_tenderos`()
BEGIN
select 
ti.nom_tien as tienda,
DATE_FORMAT(c.fec_inte,'%d/%m/%Y %h:%i %p') as fecha,
CONCAT(t.ape_ten,', ',t.nom_ten) as tendero,
t.foto_ten as foto
from cab_interven c
inner join tendero t on c.id_ten = t.id_ten  
inner join tienda ti on c.id_tien = ti.id_tien
order by c.fec_inte DESC limit 10; 
END ;;
DELIMITER ;



DELIMITER ;;
CREATE DEFINER=`root`@`%` PROCEDURE `sp_listar_intervenciones`(
)
SELECT 
inter.num_inte as id,
ti.nom_tien AS tienda, 
CONCAT(ten.ape_ten,', ',ten.nom_ten) AS tendero,
ten.foto_ten AS foto,
ten.doc_ten AS dni,
TIMESTAMPDIFF(YEAR, ten.fec_nac, CURDATE()) AS edad,
IF(ten.sexo = 'M','Masculino','Femenino') as sexo,
diaSemana(DATE_FORMAT(inter.fec_inte , '%w')) as dia,
DATE_FORMAT(inter.fec_inte , '%h:%i %p') as hora,
DATE_FORMAT(inter.fec_inte , '%d/%m/%Y') as fecha,
tipo.des_tip_ten as tipoTendero
FROM 
cab_interven inter 
INNER JOIN tienda ti 
on inter.id_tien = ti.id_tien 
INNER JOIN tendero ten  
ON inter.id_ten = ten.id_ten 
INNER JOIN tipo_tendero tipo  
ON ten.id_tip_ten = tipo.id_tip_ten
order by inter.fec_inte desc ;;
DELIMITER ;



DELIMITER ;;
CREATE DEFINER=`root`@`127.0.0.1` PROCEDURE `sp_listar_productos_no_sensomatizados`()
BEGIN

SELECT 
p.id,
p.dni_prev as dni,
p.nom_prev as prevencionista,
DATE_FORMAT(p.fecha_registro,'%d/%m/%Y %h:%i %p') as fecha,
p.cod_pro as codigo,
p.desc_pro as descripcion,
p.mar_pro as marca,
p.cant_pro as cantidad,
p.precio_pro as precio,
p.total_pro as total,
p.observaciones as observaciones,
p.foto_producto as foto,
t.nom_tien as tienda
FROM 
producto_sensomatizado p 
inner join tienda t 
ON t.id_tien = p.id_tien
order by p.fecha_registro DESC;

END ;;
DELIMITER ;



DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_login`(
usu varchar(15),
pas varchar(15)

)
BEGIN
      DECLARE c INT; 
      SELECT COUNT(*) INTO c FROM tienda WHERE usuario=usu and pass_tien=pas;
      IF c >= 1 THEN
         Select 'success' resp;   
      ELSE
         Select 'fail' resp;
      END IF;
END ;;
DELIMITER ;


DELIMITER ;;
CREATE DEFINER=`root`@`127.0.0.1` PROCEDURE `sp_register_cab_interven`(
p_fec_inte DATETIME,
p_id_ten INT(11),
p_der_ten VARCHAR(25),
p_lugar_derivacion VARCHAR(150),
p_dni_prev INT(11),
p_nom_prev VARCHAR(150),
p_id_pues INT(11),
p_mod_empl VARCHAR(500),
p_det_inte VARCHAR(600),
p_id_tien INT(11)
)
BEGIN

insert into cab_interven (fec_inte, id_ten, der_ten, lugar_derivacion, dni_prev, nom_prev,id_pues,mod_empl,det_inte,id_tien) 
values (p_fec_inte, p_id_ten, p_der_ten, p_lugar_derivacion, p_dni_prev, p_nom_prev,p_id_pues,p_mod_empl,p_det_inte,p_id_tien);

SELECT LAST_INSERT_ID() as newid;

END ;;
DELIMITER ;


DELIMITER ;;
CREATE DEFINER=`root`@`127.0.0.1` PROCEDURE `sp_register_det_interven`(
p_num_inte INT(11),
p_cod_pro VARCHAR(30),
p_des_pro VARCHAR(100),
p_mar_pro VARCHAR(50),
p_cant INT(11),
p_precio DECIMAL(8,2)
)
BEGIN

insert into det_interven values (p_num_inte, p_cod_pro, p_des_pro, p_mar_pro, p_cant, p_precio);

END ;;
DELIMITER ;




DELIMITER ;;
CREATE DEFINER=`root`@`127.0.0.1` PROCEDURE `sp_register_producto_no_sensomatizado`(
p_dni_prev VARCHAR(15),
p_nom_prev VARCHAR(150),
p_fecha_registro DATETIME,
p_cod_pro VARCHAR(30),
p_desc_pro VARCHAR(100),
p_mar_pro VARCHAR(50),
p_cant_pro INT(11),
p_precio_pro DOUBLE,
p_total_pro DOUBLE,
p_observaciones VARCHAR(600),
p_foto_producto VARCHAR(250),
p_id_tien INT(11)
)
BEGIN

insert into producto_sensomatizado(
dni_prev, nom_prev, fecha_registro, cod_pro, desc_pro, mar_pro, cant_pro, precio_pro, total_pro, observaciones, foto_producto, id_tien
)
values 
(
p_dni_prev,
p_nom_prev,
p_fecha_registro,
p_cod_pro,
p_desc_pro,
p_mar_pro,
p_cant_pro,
p_precio_pro,
p_total_pro,
p_observaciones,
p_foto_producto,
p_id_tien
);
END ;;
DELIMITER ;



DELIMITER ;;
CREATE DEFINER=`root`@`127.0.0.1` PROCEDURE `sp_register_tendero`(
p_nom_ten VARCHAR(100),
p_ape_ten VARCHAR(100),
p_dir_ten VARCHAR(150),
p_doc_ten VARCHAR(15),
p_id_tip_ten INT(11),
p_fec_nac DATE,
p_sexo CHAR(1),
p_foto_ten VARCHAR(150)
)
BEGIN

insert into tendero(nom_ten, ape_ten, dir_ten, doc_ten, id_tip_ten, fec_nac, sexo, foto_ten) 
values (p_nom_ten, p_ape_ten, p_dir_ten, p_doc_ten, p_id_tip_ten, p_fec_nac, p_sexo, p_foto_ten);

END ;;
DELIMITER ;



DELIMITER ;;
CREATE DEFINER=`root`@`127.0.0.1` PROCEDURE `sp_update_tendero`(
p_id_tend INT(11),
p_nom_ten VARCHAR(100),
p_ape_ten VARCHAR(100),
p_dir_ten VARCHAR(150),
p_doc_ten VARCHAR(15),
p_id_tip_ten INT(11),
p_fec_nac DATE,
p_sexo CHAR(1),
p_foto_ten VARCHAR(150)

)
BEGIN

update tendero set 
nom_ten = p_nom_ten, 
ape_ten = p_ape_ten, 
dir_ten = p_dir_ten, 
doc_ten = p_doc_ten, 
id_tip_ten = p_id_tip_ten, 
fec_nac =  p_fec_nac, 
sexo = p_sexo, 
foto_ten = p_foto_ten
where id_ten = p_id_tend;

END ;;
DELIMITER ;


DELIMITER ;;
CREATE PROCEDURE `sp_get_tiendas`(
)
BEGIN
select id_tien as id, nom_tien as tienda from tienda where id_tien > 0;;
END ;;
DELIMITER ;

DELIMITER ;;
CREATE PROCEDURE `sp_update_cab_interven`(
p_num_inte INT(11),
p_fec_inte DATETIME,
p_id_ten INT(11),
p_der_ten VARCHAR(25),
p_lugar_derivacion VARCHAR(150),
p_dni_prev VARCHAR(15),
p_nom_prev VARCHAR(150),
p_id_pues INT(11),
p_mod_empl VARCHAR(500),
p_det_inte VARCHAR(600),
p_id_tien INT(11)
)
BEGIN

update cab_interven set 
fec_inte = p_fec_inte , 
id_ten = p_id_ten, 
der_ten = p_der_ten, 
lugar_derivacion = p_lugar_derivacion, 
dni_prev = p_dni_prev, 
nom_prev = p_nom_prev,
id_pues = p_id_pues,
mod_empl = p_mod_empl,
det_inte = p_det_inte, 
id_tien = p_id_tien
WHERE 
num_inte = p_num_inte;


END ;;
DELIMITER ;


DELIMITER ;;
CREATE PROCEDURE `sp_delete_det_interven_by_num_inte`(
p_num_inte INT(11),
)
BEGIN
-- eliminamos el detalle para el nuevo registro
delete from det_interven where num_inte = p_num_inte;

END ;;
DELIMITER ;