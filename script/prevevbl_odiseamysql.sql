-- phpMyAdmin SQL Dump
-- version 4.2.11
-- http://www.phpmyadmin.net
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 19-08-2015 a las 00:55:00
-- Versión del servidor: 5.6.21
-- Versión de PHP: 5.6.3

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Base de datos: `prevevbl_odiseamysql`
--

DELIMITER $$
--
-- Procedimientos
--
CREATE DEFINER=`root`@`127.0.0.1` PROCEDURE `char_ejecutivo_anual`(
	p_opcion varchar(1),
	p_fecha varchar(10),
	p_hora_inicial varchar(8),
	p_hora_final varchar(8) ,
	p_sexo varchar(1)
)
	BEGIN

		declare primer_dia varchar(10);
		declare ultimo_dia varchar(10);

		-- POR MES
		if (p_opcion = '1') then
			set primer_dia = date_format(p_fecha,'%Y-%m-01');
			set ultimo_dia = LAST_DAY(p_fecha);
		else
			-- ANUAL ENERO DICIEMBRE BY ANIO
			set primer_dia = date_format(p_fecha,'%Y-01-01');
			set ultimo_dia = date_format(p_fecha,'%Y-12-31');
		end if;


		IF(p_hora_inicial>p_hora_final) THEN
			SELECT
				t.nom_tien as tienda,
				coalesce(count(d.intervenciones),0) as intervenciones,
				coalesce(ROUND(sum(d.recuperado),2),0) as recuperado
			FROM
				(   select
							c.id_tien as idTienda,
							c.num_inte as intervenciones,
							c.total_recuperado as recuperado
						from cab_interven c
							inner join tendero te on te.id_ten = c.id_ten
						where
							DATE(c.fec_inte) between primer_dia and ultimo_dia
							AND
							TIME(c.fec_inte) not between '09:01:00' AND '21:59:59'
							AND
							te.sexo like CONCAT("%",p_sexo,"%")
				) d
				RIGHT JOIN tienda t ON t.id_tien = d.idTienda
			where t.id_tien > 0
			GROUP BY t.id_tien
			ORDER BY t.id_tien ASC;

		ELSE
			SELECT
				t.nom_tien as tienda,
				coalesce(count(d.intervenciones),0) as intervenciones,
				coalesce(ROUND(sum(d.recuperado),2),0) as recuperado
			FROM
				(   select
							c.id_tien as idTienda,
							c.num_inte as intervenciones,
							c.total_recuperado as recuperado
						from cab_interven c
							inner join tendero te on te.id_ten = c.id_ten
						where
							DATE(c.fec_inte) between primer_dia and ultimo_dia
							AND
							TIME(c.fec_inte) between p_hora_inicial AND p_hora_final
							AND
							te.sexo like CONCAT("%",p_sexo,"%")
				) d
				RIGHT JOIN tienda t ON t.id_tien = d.idTienda
			where t.id_tien > 0
			GROUP BY t.id_tien
			ORDER BY t.id_tien ASC;
		END IF;

	END$$

CREATE DEFINER=`root`@`127.0.0.1` PROCEDURE `char_ejecutivo_anual_por_tienda`(
	p_id_tien INT(11),
	p_opcion varchar(1),
	p_fecha varchar(10),
	p_hora_inicial varchar(8),
	p_hora_final varchar(8) ,
	p_sexo varchar(1)
)
	BEGIN

		declare primer_dia varchar(10);
		declare ultimo_dia varchar(10);

		-- POR MES
		if (p_opcion = '1') then
			set primer_dia = date_format(p_fecha,'%Y-%m-01');
			set ultimo_dia = LAST_DAY(p_fecha);
		else
			-- ANUAL ENERO DICIEMBRE BY ANIO
			set primer_dia = date_format(p_fecha,'%Y-01-01');
			set ultimo_dia = date_format(p_fecha,'%Y-12-31');
		end if;

		IF(p_hora_inicial>p_hora_final) THEN
			SELECT
				c.nom_prev AS nombrePrevencionista,
				c.dni_prev AS dniPrevencionista,
				IF(c.tipo_hurto = '1', 'INTERNO', 'EXTERNO') AS tipoHurto,
				coalesce(d.cod_pro,'SIN CODIGO') AS codigoProducto,
				coalesce(d.des_pro,'SIN PRODUCTO') AS descripcionProducto,
				coalesce(d.mar_pro,'SIN MARCA') AS marcaProducto,
				coalesce(d.cant,0) AS cantidadProducto,
				coalesce(d.cant * d.precio,0) AS totalProducto
			FROM
				cab_interven c
				LEFT JOIN det_interven d ON c.num_inte = d.num_inte
				INNER JOIN tendero te ON te.id_ten = c.id_ten
			WHERE
				c.id_tien = p_id_tien
				AND
				DATE(c.fec_inte) BETWEEN primer_dia AND ultimo_dia
				AND
				TIME(c.fec_inte) not between '09:01:00' AND '21:59:59'
				AND
				te.sexo LIKE CONCAT("%",p_sexo,"%");
		ELSE
			SELECT
				c.nom_prev AS nombrePrevencionista,
				c.dni_prev AS dniPrevencionista,
				IF(c.tipo_hurto = '1', 'INTERNO', 'EXTERNO') AS tipoHurto,
				coalesce(d.cod_pro,'SIN CODIGO') AS codigoProducto,
				coalesce(d.des_pro,'SIN PRODUCTO') AS descripcionProducto,
				coalesce(d.mar_pro,'SIN MARCA') AS marcaProducto,
				coalesce(d.cant,0) AS cantidadProducto,
				coalesce(d.cant * d.precio,0) AS totalProducto
			FROM
				cab_interven c
				LEFT JOIN det_interven d ON c.num_inte = d.num_inte
				INNER JOIN tendero te ON te.id_ten = c.id_ten
			WHERE
				c.id_tien = p_id_tien
				AND
				DATE(c.fec_inte) BETWEEN primer_dia AND ultimo_dia
				AND
				TIME(c.fec_inte) between p_hora_inicial AND p_hora_final
				AND
				te.sexo LIKE CONCAT("%",p_sexo,"%");

		END IF;
	END$$

CREATE DEFINER=`root`@`127.0.0.1` PROCEDURE `char_incidente`(
	p_reporte INT(11),
	p_id_tien INT(11),
	p_opcion varchar(1),
	p_fecha varchar(10),
	p_hora_inicial varchar(8),
	p_hora_final varchar(8),
	p_tipo varchar(9)
)
	BEGIN
		declare primer_dia varchar(10);
		declare ultimo_dia varchar(10);

		-- POR MES
		if (p_opcion = '1') then
			set primer_dia = date_format(p_fecha,'%Y-%m-01');
			set ultimo_dia = LAST_DAY(p_fecha);
		else
			--  ANUAL ENERO DICIEMBRE BY ANIO
			set primer_dia = date_format(p_fecha,'%Y-01-01');
			set ultimo_dia = date_format(p_fecha,'%Y-12-31');
		end if;

		IF(p_hora_inicial>p_hora_final) THEN

			CASE p_reporte

				WHEN 1 THEN
				SELECT
					t.nom_tien as tienda,
					COALESCE(SUM(IF(d.tipo = 'accidente', 1, 0)),0) AS accidentes,
					COALESCE(SUM(IF(d.tipo = 'incidente', 1, 0)),0) AS incidentes
				FROM
					(
						SELECT
							c.id_tien AS idTienda,
							c.tipo
						FROM cab_incidente c
						WHERE
							DATE(c.fecha_accidente) BETWEEN primer_dia AND ultimo_dia
							AND
							TIME(c.fecha_accidente) not between '09:01:00' AND '21:59:59'
					) d
					RIGHT JOIN tienda t ON t.id_tien = d.idTienda
				WHERE t.id_tien > 0
				GROUP BY t.id_tien
				ORDER BY t.id_tien ASC;

				WHEN 2 THEN
				SELECT
					c.id_incidente AS idIncidente,
					c.nombre_involucrado AS nombreInvolucrado,
					c.dni_involucrado AS dniInvolucrado,
					c.edad_accidentado AS edadInvolucrado,
					c.sexo_accidentado AS sexoInvolucrado
				FROM
					cab_incidente c
				WHERE
					c.id_tien = p_id_tien
					AND
					c.tipo = p_tipo
					AND
					DATE(c.fecha_accidente) BETWEEN primer_dia AND ultimo_dia
					AND
					TIME(c.fecha_accidente) not between '09:01:00' AND '21:59:59'
				ORDER BY c.id_incidente ASC;

				WHEN 3 THEN
				SELECT
					c.id_incidente as idIncidente,
					coalesce(d.es_activo,'NO') AS esActivo,
					coalesce(d.cod_pro,'SIN CODIGO') AS codigoProducto,
					coalesce(d.desc_pro,'SIN PRODUCTO') AS descripcionProducto,
					coalesce(d.mar_pro,'SIN MARCA') AS marcaProducto,
					coalesce(d.cant,0) AS cantidadProducto,
					coalesce(d.precio,0) AS precioProducto,
					coalesce(d.cant * d.precio,0) AS totalProducto
				FROM
					cab_incidente c
					INNER JOIN det_incidente d ON c.id_incidente = d.id_incidente
				WHERE
					c.id_tien = p_id_tien
					AND
					c.tipo = p_tipo
					AND
					DATE(c.fecha_accidente) BETWEEN primer_dia AND ultimo_dia
					AND
					TIME(c.fecha_accidente) not between '09:01:00' AND '21:59:59'
				ORDER BY c.id_incidente ASC;

			END CASE;

		ELSE

			CASE p_reporte

				WHEN 1 THEN
				SELECT
					t.nom_tien as tienda,
					COALESCE(SUM(IF(d.tipo = 'accidente', 1, 0)),0) AS accidentes,
					COALESCE(SUM(IF(d.tipo = 'incidente', 1, 0)),0) AS incidentes
				FROM
					(
						SELECT
							c.id_tien AS idTienda,
							c.tipo
						FROM cab_incidente c
						WHERE
							DATE(c.fecha_accidente) BETWEEN primer_dia AND ultimo_dia
							AND
							TIME(c.fecha_accidente) BETWEEN p_hora_inicial AND p_hora_final
					) d
					RIGHT JOIN tienda t ON t.id_tien = d.idTienda
				WHERE t.id_tien > 0
				GROUP BY t.id_tien
				ORDER BY t.id_tien ASC;

				WHEN 2 THEN
				SELECT
					c.id_incidente AS idIncidente,
					c.nombre_involucrado AS nombreInvolucrado,
					c.dni_involucrado AS dniInvolucrado,
					c.edad_accidentado AS edadInvolucrado,
					c.sexo_accidentado AS sexoInvolucrado
				FROM
					cab_incidente c
				WHERE
					c.id_tien = p_id_tien
					AND
					c.tipo = p_tipo
					AND
					DATE(c.fecha_accidente) BETWEEN primer_dia AND ultimo_dia
					AND
					TIME(c.fecha_accidente) BETWEEN p_hora_inicial AND p_hora_final
				ORDER BY c.id_incidente ASC;

				WHEN 3 THEN
				SELECT
					c.id_incidente as idIncidente,
					coalesce(d.es_activo,'NO') AS esActivo,
					coalesce(d.cod_pro,'SIN CODIGO') AS codigoProducto,
					coalesce(d.desc_pro,'SIN PRODUCTO') AS descripcionProducto,
					coalesce(d.mar_pro,'SIN MARCA') AS marcaProducto,
					coalesce(d.cant,0) AS cantidadProducto,
					coalesce(d.precio,0) AS precioProducto,
					coalesce(d.cant * d.precio,0) AS totalProducto
				FROM
					cab_incidente c
					INNER JOIN det_incidente d ON c.id_incidente = d.id_incidente
				WHERE
					c.id_tien = p_id_tien
					AND
					c.tipo = p_tipo
					AND
					DATE(c.fecha_accidente) BETWEEN primer_dia AND ultimo_dia
					AND
					TIME(c.fecha_accidente) BETWEEN p_hora_inicial AND p_hora_final
				ORDER BY c.id_incidente ASC;

			END CASE;

		END IF;

	END$$

CREATE DEFINER=`root`@`127.0.0.1` PROCEDURE `char_operatividad`(
	p_reporte INT(11),
	p_id_tien INT(11),
	p_id_producto INT(11)
)
	BEGIN

		CASE p_reporte
			WHEN 1 THEN
			-- REPORTE DE TODAS LAS TIENDAS CON CAMPOS DE REUBICACION E INOPERATIVO X PRODUCTO
			SELECT
				t.nom_tien as tienda,
				COALESCE(SUM(d.reubicados),0) AS reubicados,
				COALESCE(SUM(d.inoperativo),0) AS inoperativo
			FROM
				(   select
							c.id_tien as idTienda,
							c.cantidad_reubicacion as reubicados,
							c.cantidad_inoperativo as inoperativo
						from det_operatividad c
						where c.id_producto = p_id_producto
				) d
				RIGHT JOIN tienda t ON t.id_tien = d.idTienda
			where t.id_tien > 0
			GROUP BY t.id_tien
			ORDER BY t.id_tien ASC;

			WHEN 2 THEN
			-- REPORTE DE TODAS LAS TIENDAS CON TODOS LOS PRODUCTOS
			SELECT
				t.nom_tien as atienda,
				IF(c.id_producto = 1,c.cantidad_inoperativo,0) as producto1,
				IF(c.id_producto = 2,c.cantidad_inoperativo,0) as producto2,
				IF(c.id_producto = 3,c.cantidad_inoperativo,0) as producto3,
				IF(c.id_producto = 4,c.cantidad_inoperativo,0) as producto4,
				IF(c.id_producto = 5,c.cantidad_inoperativo,0) as producto5,
				IF(c.id_producto = 6,c.cantidad_inoperativo,0) as producto6,
				IF(c.id_producto = 7,c.cantidad_inoperativo,0) as producto7,
				IF(c.id_producto = 8,c.cantidad_inoperativo,0) as producto8,
				IF(c.id_producto = 9,c.cantidad_inoperativo,0) as producto9,
				IF(c.id_producto = 10,c.cantidad_inoperativo,0) as producto10,
				IF(c.id_producto = 11,c.cantidad_inoperativo,0) as producto11,
				IF(c.id_producto = 12,c.cantidad_inoperativo,0) as producto12,
				IF(c.id_producto = 13,c.cantidad_inoperativo,0) as producto13,
				IF(c.id_producto = 14,c.cantidad_inoperativo,0) as producto14,
				IF(c.id_producto = 15,c.cantidad_inoperativo,0) as producto15,
				IF(c.id_producto = 16,c.cantidad_inoperativo,0) as producto16,
				IF(c.id_producto = 17,c.cantidad_inoperativo,0) as producto17,
				IF(c.id_producto = 18,c.cantidad_inoperativo,0) as producto18,
				IF(c.id_producto = 19,c.cantidad_inoperativo,0) as producto19,
				IF(c.id_producto = 20,c.cantidad_inoperativo,0) as producto20,
				IF(c.id_producto = 21,c.cantidad_inoperativo,0) as producto21,
				IF(c.id_producto = 22,c.cantidad_inoperativo,0) as producto22,
				IF(c.id_producto = 23,c.cantidad_inoperativo,0) as producto23,
				IF(c.id_producto = 24,c.cantidad_inoperativo,0) as producto24,
				IF(c.id_producto = 25,c.cantidad_inoperativo,0) as producto25
			FROM
				(
					select
						d.id_tien as idTienda,
						d.id_producto as id_producto,
						d.cantidad_inoperativo as cantidad_inoperativo
					from det_operatividad d
				) c
				RIGHT JOIN tienda t ON t.id_tien = c.idTienda
			where t.id_tien > 0
			ORDER BY t.id_tien ASC;
		END CASE;

	END$$

CREATE DEFINER=`root`@`127.0.0.1` PROCEDURE `char_sensomatizado`(
	p_reporte INT(11),
	p_id_tien INT(11),
	p_opcion varchar(1),
	p_fecha varchar(10),
	p_hora_inicial varchar(8),
	p_hora_final varchar(8)
)
	BEGIN
		declare primer_dia varchar(10);
		declare ultimo_dia varchar(10);

		-- POR MES
		if (p_opcion = '1') then
			set primer_dia = date_format(p_fecha,'%Y-%m-01');
			set ultimo_dia = LAST_DAY(p_fecha);
		else
			--  ANUAL ENERO DICIEMBRE BY ANIO
			set primer_dia = date_format(p_fecha,'%Y-01-01');
			set ultimo_dia = date_format(p_fecha,'%Y-12-31');
		end if;

		-- CONDICIONAL PARA EL RANGO DE FECHAS CUANDO ES MENOR
		-- 22:00 9:00
		IF(p_hora_inicial>p_hora_final) THEN

			CASE p_reporte
				WHEN 1 THEN
				SELECT
					t.nom_tien as tienda,
					coalesce(sum(d.cantidad),0) as sensomatizado,
					coalesce(ROUND(sum(d.total),2),0) as total
				FROM
					(   select
								c.id_tien as idTienda,
								coalesce(s.cant,0) as cantidad,
								coalesce(ROUND(s.precio * s.cant,2),0) as total
							from cab_sensor c
								LEFT join det_sensor s
									ON c.id_sensor = s.id_sensor
							where
								DATE(c.fecha_registro) between primer_dia and ultimo_dia
								AND
								TIME(c.fecha_registro) not between '09:01:00' AND '21:59:59'
					) d
					RIGHT JOIN tienda t ON t.id_tien = d.idTienda
				where t.id_tien > 0
				GROUP BY t.id_tien
				ORDER BY t.id_tien ASC;

				WHEN 2 THEN
				SELECT
					c.id_sensor AS idSensor,
					c.nom_prev AS nombrePrevencionista,
					coalesce(d.cod_pro,'SIN CODIGO') AS codigoProducto,
					coalesce(d.desc_pro,'SIN PRODUCTO') AS descripcionProducto,
					coalesce(d.mar_pro,'SIN MARCA') AS marcaProducto,
					coalesce(d.cant,0) AS cantidadProducto,
					coalesce(d.precio,0) AS precioProducto,
					coalesce(d.cant * d.precio,0) AS totalProducto
				FROM
					cab_sensor c
					LEFT JOIN det_sensor d ON c.id_sensor = d.id_sensor
				WHERE
					c.id_tien = p_id_tien
					AND
					DATE(c.fecha_registro) BETWEEN primer_dia AND ultimo_dia
					AND
					TIME(c.fecha_registro) not between '09:01:00' AND '21:59:59';
			END CASE;

		ELSE
			-- HORARIO NORMAL DE MENOR A MAYOR LAS BUSQUEDA SON CORRECTAS

			CASE p_reporte
				WHEN 1 THEN
				SELECT
					t.nom_tien as tienda,
					coalesce(sum(d.cantidad),0) as sensomatizado,
					coalesce(ROUND(sum(d.total),2),0) as total
				FROM
					(   select
								c.id_tien as idTienda,
								coalesce(s.cant,0) as cantidad,
								coalesce(ROUND(s.precio * s.cant,2),0) as total
							from cab_sensor c
								LEFT join det_sensor s
									ON c.id_sensor = s.id_sensor
							where
								DATE(c.fecha_registro) between primer_dia and ultimo_dia
								AND
								TIME(c.fecha_registro) between p_hora_inicial AND p_hora_final
					) d
					RIGHT JOIN tienda t ON t.id_tien = d.idTienda
				where t.id_tien > 0
				GROUP BY t.id_tien
				ORDER BY t.id_tien ASC;

				WHEN 2 THEN
				SELECT
					c.id_sensor AS idSensor,
					c.nom_prev AS nombrePrevencionista,
					coalesce(d.cod_pro,'SIN CODIGO') AS codigoProducto,
					coalesce(d.desc_pro,'SIN PRODUCTO') AS descripcionProducto,
					coalesce(d.mar_pro,'SIN MARCA') AS marcaProducto,
					coalesce(d.cant,0) AS cantidadProducto,
					coalesce(d.precio,0) AS precioProducto,
					coalesce(d.cant * d.precio,0) AS totalProducto
				FROM
					cab_sensor c
					LEFT JOIN det_sensor d ON c.id_sensor = d.id_sensor
				WHERE
					c.id_tien = p_id_tien
					AND
					DATE(c.fecha_registro) BETWEEN primer_dia AND ultimo_dia
					AND
					TIME(c.fecha_registro) BETWEEN p_hora_inicial AND p_hora_final;
			END CASE;

		END IF;

	END$$

CREATE DEFINER=`root`@`127.0.0.1` PROCEDURE `sp_get_productos`()
	BEGIN
		select id_producto as idProducto, nombre as nombreProducto from producto;
	END$$

CREATE DEFINER=`root`@`127.0.0.1` PROCEDURE `sp_get_tiendas`()
	BEGIN
		select id_tien as idTienda, nom_tien as nombreTienda from tienda
		where id_tien > 0;
	END$$

CREATE DEFINER=`root`@`127.0.0.1` PROCEDURE `sp_incidente`(
	opcion int,
	col_busqueda varchar(500),
	p_pag INT,
	p_id_incidente BIGINT,
	p_id_tien INT(11),
	p_tipo varchar(9),
	p_nombre_involucrado VARCHAR(150),
	p_dni_involucrado VARCHAR(15),
	p_acto_condicion_insegura VARCHAR(500),
	p_edad_accidentado INT(11),
	p_sexo_accidentado CHAR(1),
	p_fecha_accidente DATETIME,
	p_nivel_gravedad VARCHAR(15),
	p_diagnostico  VARCHAR(500),
	p_descanso_medico CHAR(2),
	p_cantidad_dias INT(11),
	p_descripcion_causas VARCHAR(500),
	p_lesion VARCHAR(30),
	p_acciones_correctivas_realizadas VARCHAR(500),
	p_total DOUBLE,
	p_cod_pro varchar(30),
	p_desc_pro varchar(100),
	p_mar_pro varchar(50),
	p_cant int,
	p_precio double,
	p_es_activo CHAR(2)
)
	BEGIN

		declare indice INT;
		set indice = (p_pag - 1)*10;

		CASE opcion
			WHEN 1 THEN
			-- listado por filtros
			SET @npfx_query = CONCAT(
					"SELECT
            c.id_incidente as idIncidente,
            t.id_tien as idTienda,
            t.nom_tien as nombreTienda,
          c.tipo as tipo,
            c.nombre_involucrado as nombreInvolucrado,
            c.dni_involucrado as dniInvolucrado,
            c.acto_condicion_insegura as actoCondicionInsegura,
            c.edad_accidentado as edadAccidentado,
            c.sexo_accidentado as sexoAccidentado,
            diaSemana(DATE_FORMAT(c.fecha_accidente , '%w')) AS diaAccidente,
          DATE_FORMAT(c.fecha_accidente , '%h:%i %p') AS horaAccidente,
          DATE_FORMAT(c.fecha_accidente , '%d/%m/%Y') AS fechaAccidente,
            c.fecha_accidente as fechaAccidenteCompleta,
            c.nivel_gravedad as nivelGravedad,
            c.diagnostico as diagnostico,
            c.descanso_medico as descansoMedico,
            c.cantidad_dias as cantidadDias,
            c.descripcion_causas as descripcionCausas,
            c.lesion as lesion,
            c.acciones_correctivas_realizadas as accionesCorrectivasRealizadas,
          c.total
            FROM
            cab_incidente c
            inner join tienda t
            ON t.id_tien = c.id_tien
            WHERE ",col_busqueda," ORDER BY c.fecha_accidente DESC LIMIT ",indice,", 10");
			PREPARE not_prefixed FROM @npfx_query;
			EXECUTE not_prefixed;

			WHEN 2 THEN
			SET @npfx_query = CONCAT(
					"SELECT
          coalesce(COUNT(c.id_incidente),0) as num
          FROM
          cab_incidente c
          inner join tienda t
          ON t.id_tien = c.id_tien
          WHERE ",col_busqueda);
			PREPARE not_prefixed FROM @npfx_query;
			EXECUTE not_prefixed;

			WHEN 3 THEN
			-- listado del detalle
			SELECT
				cod_pro AS codigo,
				desc_pro AS descripcion,
				mar_pro AS marca,
				cant AS cantidad ,
				precio,
				es_activo as esActivo
			FROM det_incidente WHERE id_incidente = p_id_incidente;

			WHEN 4 THEN
			-- INSERT NEW CABECERA
			INSERT INTO cab_incidente
			(id_tien,tipo,nombre_involucrado,dni_involucrado,acto_condicion_insegura,edad_accidentado,
			 sexo_accidentado,fecha_accidente,nivel_gravedad,
			 diagnostico,descanso_medico,cantidad_dias,
			 descripcion_causas,lesion,acciones_correctivas_realizadas,total)
			VALUES
				(p_id_tien,p_tipo,p_nombre_involucrado,p_dni_involucrado,
				 p_acto_condicion_insegura,
				 p_edad_accidentado,p_sexo_accidentado,p_fecha_accidente,
				 p_nivel_gravedad,p_diagnostico,p_descanso_medico,p_cantidad_dias,
				 p_descripcion_causas,p_lesion,p_acciones_correctivas_realizadas,p_total);

			SELECT LAST_INSERT_ID() AS newid;

			WHEN 5 THEN
			-- UPDATE CABECERA
			UPDATE cab_incidente set
				id_tien = p_id_tien,
				tipo = p_tipo,
				nombre_involucrado = p_nombre_involucrado,
				dni_involucrado = p_dni_involucrado,
				acto_condicion_insegura = p_acto_condicion_insegura,
				edad_accidentado = p_edad_accidentado,
				sexo_accidentado = p_sexo_accidentado,
				fecha_accidente = p_fecha_accidente,
				nivel_gravedad = p_nivel_gravedad,
				diagnostico = p_diagnostico,
				descanso_medico = p_descanso_medico,
				cantidad_dias = p_cantidad_dias,
				descripcion_causas = p_descripcion_causas,
				lesion = p_lesion,
				acciones_correctivas_realizadas = p_acciones_correctivas_realizadas,
				total = p_total
			WHERE id_incidente = p_id_incidente;

			WHEN 6 THEN
			-- DELETE ROW
			DELETE FROM det_incidente where id_incidente = p_id_incidente;
			DELETE FROM cab_incidente where id_incidente = p_id_incidente;
			WHEN 7 THEN
			-- INSERT DETALLE
			INSERT INTO det_incidente
			(id_incidente,cod_pro,desc_pro,mar_pro,cant,precio,es_activo)
			VALUES
				(p_id_incidente,p_cod_pro,p_desc_pro,p_mar_pro,p_cant,p_precio,p_es_activo);

			WHEN 8 THEN
			-- GET
			select nombre_involucrado as nombre from cab_incidente
			where dni_involucrado = p_dni_involucrado LIMIT 1;

			WHEN 9 THEN
			-- DELETE only detalle
			DELETE FROM det_incidente where id_incidente = p_id_incidente;

		END CASE;


	END$$

CREATE DEFINER=`root`@`127.0.0.1` PROCEDURE `sp_intervencion`(
	opcion int,
	col_busqueda varchar(500),
	p_pag INT,
	p_num_inte INT(11),
	p_fec_inte DATETIME,
	p_id_ten INT(11),
	p_der_ten VARCHAR(25),
	p_lugar_derivacion VARCHAR(150),
	p_dni_prev INT(11),
	p_nom_prev VARCHAR(150),
	p_id_pues INT(11),
	p_mod_empl VARCHAR(500),
	p_det_inte VARCHAR(600),
	p_id_tien INT(11),
	p_total_recuperado DOUBLE,
	p_tipo_hurto char(1),
	p_cod_pro varchar(30),
	p_desc_pro varchar(100),
	p_mar_pro varchar(50),
	p_cant int,
	p_precio double
)
	BEGIN

		declare indice INT;
		set indice = (p_pag - 1)*10;

		CASE opcion
			WHEN 1 THEN
			-- LISTADO POR FILTRO DE BUSQUEDA
      -- SP listado_intervenciones_multiple
			SET @npfx_query = CONCAT(
					"SELECT
          inter.num_inte as idIntervencion,
          ten.id_ten as idTendero,
          ten.nom_ten as nombreTendero,
          ten.ape_ten as apellidoTendero,
          CONCAT(ten.nom_ten,', ',ten.ape_ten) AS nombreCompletoTendero,
          ten.dir_ten as direccionTendero,
          ten.doc_ten AS dniTendero,
          TIMESTAMPDIFF(YEAR, ten.fec_nac, CURDATE()) AS edadTendero,
          ten.fec_nac AS nacimientoTendero,
          ten.sexo as sexoTendero,
          diaSemana(DATE_FORMAT(inter.fec_inte , '%w')) AS diaIntervencion,
          DATE_FORMAT(inter.fec_inte , '%h:%i %p') AS horaIntervencion,
          DATE_FORMAT(inter.fec_inte , '%d/%m/%Y') AS fechaIntervencion,
          inter.fec_inte as fechaCompletaIntervencion,
          inter.der_ten as derivacionIntervencion,
          inter.lugar_derivacion as lugarDerivacion,
          inter.dni_prev as dniPrevencionista,
          inter.nom_prev as nombrePrevencionista,
          inter.id_pues as idPuesto,
          inter.mod_empl as modalidadEmpleada,
          inter.det_inte as detalleIntervencion,
          inter.total_recuperado as totalRecuperado,
          inter.tipo_hurto as tipoHurto,
          ti.id_tien as idTienda,
          ti.nom_tien AS nombreTienda,
          tipo.id_tip_ten as idTipoTendero,
          tipo.des_tip_ten as tipoTendero
          FROM
          cab_interven inter
          INNER JOIN tienda ti
          on inter.id_tien = ti.id_tien
          INNER JOIN tendero ten
          ON inter.id_ten = ten.id_ten
          INNER JOIN tipo_tendero tipo
          ON ten.id_tip_ten = tipo.id_tip_ten
          WHERE ",
					col_busqueda,
					" ORDER BY inter.fec_inte DESC LIMIT ",indice,", 10");
			PREPARE not_prefixed FROM @npfx_query;
			EXECUTE not_prefixed;

			WHEN 2 THEN
			-- get_row_count_cab_interven
			SET @npfx_query = CONCAT(
					"SELECT
          coalesce(COUNT(inter.num_inte),0) as numIntervenciones
          FROM
          cab_interven inter
          INNER JOIN tienda ti
          on inter.id_tien = ti.id_tien
          INNER JOIN tendero ten
          ON inter.id_ten = ten.id_ten
          INNER JOIN tipo_tendero tipo
          ON ten.id_tip_ten = tipo.id_tip_ten
          WHERE ",col_busqueda);
			PREPARE not_prefixed FROM @npfx_query;
			EXECUTE not_prefixed;

			WHEN 3 THEN
			-- get_detalle_intervencion_by_id
			SELECT cod_pro AS codigo, des_pro AS descripcion,
						 mar_pro AS marca, cant AS cantidad , precio
			FROM det_interven WHERE num_inte = p_num_inte;

			WHEN 4 THEN
			-- INSERT NUEVA CABECERA DE INTERVENCION
      -- sp_register_cab_interven
			INSERT INTO cab_interven
			(fec_inte, id_ten, der_ten, lugar_derivacion,
			 dni_prev, nom_prev,id_pues,mod_empl,det_inte,id_tien,total_recuperado,tipo_hurto)
			VALUES (p_fec_inte, p_id_ten, p_der_ten, p_lugar_derivacion, p_dni_prev,
							p_nom_prev,p_id_pues,p_mod_empl,p_det_inte,p_id_tien,p_total_recuperado,p_tipo_hurto);
			SELECT LAST_INSERT_ID() AS newid;

			WHEN 5 THEN
			-- ACTUALIZAR CABECERA DE INTERVENCION
      -- sp_update_cab_interven
			UPDATE cab_interven SET
				fec_inte = p_fec_inte,
				id_ten = p_id_ten,
				der_ten = p_der_ten,
				lugar_derivacion = p_lugar_derivacion,
				dni_prev = p_dni_prev,
				nom_prev = p_nom_prev,
				id_pues = p_id_pues,
				mod_empl = p_mod_empl,
				det_inte = p_det_inte,
				id_tien = p_id_tien,
				total_recuperado = p_total_recuperado,
				tipo_hurto = p_tipo_hurto
			WHERE num_inte = p_num_inte;

			WHEN 6 THEN
			-- DELETE REGISTRO DE INTERVENCION
      -- sp_delete_intervencion
			DELETE FROM det_interven where num_inte = p_num_inte;
			DELETE FROM cab_interven where num_inte = p_num_inte;

			WHEN 7 THEN
			-- INSERT DETALLE DE INTERVENCION
      -- sp_register_det_interven
			INSERT INTO det_interven VALUES (p_num_inte, p_cod_pro, p_desc_pro, p_mar_pro, p_cant, p_precio);

			WHEN 8 THEN
			-- GET NOMBRE PREVENCIONISTA
      -- get_name_prevencionista_by_dni
			SELECT nom_prev AS nombre FROM cab_interven WHERE dni_prev = p_dni_prev LIMIT 1;

			WHEN 9 THEN
			-- DELETE ONLY DETALLE DE INTERVENCION
      -- sp_delete_det_interven_by_num_inte
			DELETE FROM det_interven where num_inte = p_num_inte;

			WHEN 10 THEN
			-- sp_get_ultimos_tenderos ultimas intervenciones
			select
				t.id_ten as idTendero,
				t.doc_ten as dniTendero,
				ti.nom_tien as nombreTienda,
				diaSemana(DATE_FORMAT(c.fec_inte , '%w')) AS diaIntervencion,
				DATE_FORMAT(c.fec_inte , '%h:%i %p') AS horaIntervencion,
				DATE_FORMAT(c.fec_inte,'%d/%m/%Y') as fechaIntervencion,
				CONCAT(t.ape_ten,', ',t.nom_ten) as nombreCompletoTendero
			from cab_interven c
				inner join tendero t on c.id_ten = t.id_ten
				inner join tienda ti on c.id_tien = ti.id_tien
			order by c.fec_inte DESC limit 10;

		END CASE;

	END$$

CREATE DEFINER=`root`@`127.0.0.1` PROCEDURE `sp_login`(
	usu varchar(15),
	pas varchar(15)
)
	BEGIN
		SELECT nom_tien as usuario,
					 rol as rol from tienda
		WHERE usuario=usu and pass_tien=pas
		limit 1;
		-- DECLARE c INT;
    -- SELECT COUNT(*) INTO c FROM tienda
    -- WHERE usuario=usu and pass_tien=pas;
    -- IF c >= 1 THEN
    -- Select 'success' resp;
    -- ELSE
  --  Select 'fail' resp;
    -- END IF;
	END$$

CREATE DEFINER=`root`@`127.0.0.1` PROCEDURE `sp_operatividad`(
	opcion int,
	p_id_det_operatividad bigint(20),
	p_id_operatividad bigint(20),
	p_id_tien int(11),
	p_id_producto int(11),
	p_marca_equipo varchar(150),
	p_modelo_equipo varchar(150),
	p_capacidad_equipo varchar(150),
	p_cantidad_total int(11),
	p_cantidad_interna int(11),
	p_cantidad_externa int(11),
	p_cantidad_inoperativo int(11),
	p_cantidad_operativo int(11),
	p_cantidad_reubicacion int(11),
	p_otros varchar(250),
	p_observaciones varchar(500)
)
	BEGIN
		CASE opcion

			WHEN 1 THEN
			select
				o.id_det_operatividad as idDetOperatividad,
				o.id_operatividad as idOperatividad,
				t.id_tien as idTienda,
				t.nom_tien AS nombreTienda,
				o.id_producto as idProducto,
				p.nombre as nombreProducto,
				o.marca_equipo as marcaEquipo,
				o.modelo_equipo as modeloEquipo,
				o.capacidad_equipo as capacidadEquipo,
				o.cantidad_total AS cantidadTotal,
				o.cantidad_interna AS cantidadInterna,
				o.cantidad_externa AS cantidadExterna,
				o.cantidad_inoperativo AS cantidadInoperativo,
				o.cantidad_operativo AS cantidadOperativo,
				o.cantidad_reubicacion as cantidadReubicacion
			FROM det_operatividad o
				INNER JOIN tienda t
					ON t.id_tien = o.id_tien
				INNER JOIN producto p
					ON p.id_producto = o.id_producto
			WHERE o.id_producto = p_id_producto
			order by o.id_det_operatividad ASC;


			WHEN 2 THEN
			UPDATE det_operatividad SET
				id_operatividad = p_id_operatividad,
				id_tien = p_id_tien,
				id_producto = p_id_producto,
				marca_equipo = p_marca_equipo,
				modelo_equipo = p_modelo_equipo,
				capacidad_equipo = p_capacidad_equipo,
				cantidad_total = p_cantidad_total,
				cantidad_interna = p_cantidad_interna,
				cantidad_externa = p_cantidad_externa,
				cantidad_inoperativo = p_cantidad_inoperativo,
				cantidad_operativo = p_cantidad_operativo,
				cantidad_reubicacion = p_cantidad_reubicacion,
				otros = p_otros,
				observaciones = p_observaciones
			WHERE id_det_operatividad = p_id_det_operatividad;

			WHEN 3 THEN
			DELETE FROM det_operatividad where id_det_operatividad = p_id_det_operatividad;

			WHEN 4 THEN
			INSERT INTO det_operatividad (
				id_operatividad,id_tien,id_producto,
				marca_equipo,modelo_equipo,capacidad_equipo,
				cantidad_total,cantidad_interna,cantidad_externa,
				cantidad_inoperativo,cantidad_operativo,cantidad_reubicacion,
				otros,observaciones
			)
			values (
				p_id_operatividad,p_id_tien,p_id_producto,p_marca_equipo,
				p_modelo_equipo,p_capacidad_equipo,
				p_cantidad_total,p_cantidad_interna,p_cantidad_externa,p_cantidad_inoperativo,
				p_cantidad_operativo,p_cantidad_reubicacion,p_otros,p_observaciones
			);

			SELECT LAST_INSERT_ID() AS newid;

		END CASE;
	END$$

CREATE DEFINER=`root`@`127.0.0.1` PROCEDURE `sp_sensomatizado`(
	opcion int,
	col_busqueda varchar(500),
	p_pag INT,
	p_id_sensor BIGINT,
	p_dni_prev varchar(15),
	p_nom_prev varchar(150),
	p_fecha_registro datetime,
	p_total double,
	p_observaciones varchar(600),
	p_id_tien int,
	p_cod_pro varchar(30),
	p_desc_pro varchar(100),
	p_mar_pro varchar(50),
	p_cant int,
	p_precio double
)
	BEGIN

		declare indice INT;
		set indice = (p_pag - 1)*10;

		CASE opcion
			WHEN 1 THEN
			-- listado por filtros
			SET @npfx_query = CONCAT(
					"SELECT
            c.id_sensor as idSensor,
            c.dni_prev as dniPrevencionista,
            c.nom_prev as nombrePrevencionista,
                  DATE_FORMAT(c.fecha_registro , '%h:%i %p') AS horaIntervencion,
                  diaSemana(DATE_FORMAT(c.fecha_registro , '%w')) AS diaIntervencion,
            DATE_FORMAT(c.fecha_registro,'%d/%m/%Y') as fecha,
            c.fecha_registro as fechaCompleta,
            c.total as total,
            c.observaciones as observaciones,
            t.id_tien as idTienda,
            t.nom_tien as nombreTienda,
                  coalesce(d.cod_pro,'SIN CODIGO') as codigoProducto,
                  coalesce(d.desc_pro,'SIN PRODUCTO') as descripcionProducto,
                  coalesce(d.mar_pro,'SIN MARCA') as marcaProducto,
                  coalesce(d.cant,0) as cantidadProducto,
                  coalesce(d.precio,0) as precioProducto,
                  coalesce(ROUND(d.precio * d.cant,2),0) as totalProducto
            FROM
            cab_sensor c
            inner join tienda t
            ON t.id_tien = c.id_tien
                  left join det_sensor d
            on c.id_sensor = d.id_sensor
            WHERE ",col_busqueda,"
            ORDER BY c.fecha_registro DESC LIMIT ",indice,", 10");
			PREPARE not_prefixed FROM @npfx_query;
			EXECUTE not_prefixed;

			WHEN 2 THEN
			SET @npfx_query = CONCAT(
					"SELECT
          coalesce(COUNT(c.id_sensor),0) as numSensores
          FROM
          cab_sensor c
          inner join tienda t
          ON t.id_tien = c.id_tien
                left join det_sensor d
                on c.id_sensor = d.id_sensor
          WHERE ",col_busqueda);
			PREPARE not_prefixed FROM @npfx_query;
			EXECUTE not_prefixed;

			WHEN 3 THEN
			-- listado del detalle por id_sensor
			SELECT
				cod_pro AS codigo,
				desc_pro AS descripcion,
				mar_pro AS marca,
				cant AS cantidad ,
				precio
			FROM det_sensor WHERE id_sensor = p_id_sensor;

			WHEN 4 THEN
			-- INSERT NEW CABECERA
			INSERT INTO cab_sensor
			(dni_prev, nom_prev, fecha_registro, total, observaciones, id_tien)
			VALUES
				(p_dni_prev, p_nom_prev, p_fecha_registro, p_total, p_observaciones, p_id_tien);

			SELECT LAST_INSERT_ID() AS newid;

			WHEN 5 THEN
			-- UPDATE CABECERA
			UPDATE cab_sensor set
				dni_prev = p_dni_prev,
				nom_prev = p_nom_prev,
				fecha_registro = p_fecha_registro,
				total = p_total,
				observaciones = p_observaciones,
				id_tien = p_id_tien
			WHERE id_sensor = p_id_sensor;
			WHEN 6 THEN
			-- DELETE ROW
			DELETE FROM det_sensor where id_sensor = p_id_sensor;
			DELETE FROM cab_sensor where id_sensor = p_id_sensor;
			WHEN 7 THEN
			-- INSERT DETALLE
			INSERT INTO det_sensor
			(id_sensor,cod_pro,desc_pro,mar_pro,cant,precio)
			VALUES
				(p_id_sensor,p_cod_pro,p_desc_pro,p_mar_pro,p_cant,p_precio);

			WHEN 8 THEN
			-- GET
			select nom_prev as nombre from cab_sensor
			where dni_prev = p_dni_prev LIMIT 1;

			WHEN 9 THEN
			-- DELETE only detalle
			DELETE FROM det_sensor where id_sensor = p_id_sensor;

		END CASE;


	END$$

CREATE DEFINER=`root`@`127.0.0.1` PROCEDURE `sp_tendero`(
	opcion int,
	p_id_tend INT(11),
	p_nom_ten VARCHAR(100),
	p_ape_ten VARCHAR(100),
	p_dir_ten VARCHAR(150),
	p_doc_ten VARCHAR(15),
	p_id_tip_ten INT(11),
	p_fec_nac DATE,
	p_sexo CHAR(1)
)
	BEGIN
		CASE opcion
			WHEN 1 THEN
			-- INSERT NUEVo TENDERO
      -- sp_register_tendero
			INSERT INTO tendero(nom_ten, ape_ten, dir_ten, doc_ten, id_tip_ten, fec_nac, sexo)
			VALUES (p_nom_ten, p_ape_ten, p_dir_ten, p_doc_ten, p_id_tip_ten, p_fec_nac, p_sexo);
			SELECT LAST_INSERT_ID() AS newid;

			WHEN 2 THEN
			-- ACTUALIZAR TENDERO sp_update_tendero
			UPDATE tendero SET
				nom_ten = p_nom_ten,
				ape_ten = p_ape_ten,
				dir_ten = p_dir_ten,
				doc_ten = p_doc_ten,
				id_tip_ten = p_id_tip_ten,
				fec_nac =  p_fec_nac,
				sexo = p_sexo
			WHERE id_ten = p_id_tend;

			WHEN 3 THEN
			-- GET ID TENDERO BY DNI
      -- sp_get_id_tendero_by_dni
			SELECT id_ten from tendero where doc_ten = p_doc_ten;

			WHEN 4 THEN
			-- GET TENDERO
      -- get_tendero_by_dni
			SELECT
				id_ten AS idTendero,
				nom_ten AS nombreTendero ,
				ape_ten AS apellidoTendero ,
				dir_ten AS direccionTendero ,
				doc_ten AS dniTendero ,
				id_tip_ten AS idTipoTendero,
				fec_nac AS nacimientoTendero,
				sexo AS sexoTendero
			FROM tendero WHERE doc_ten = p_doc_ten;

			WHEN 5 THEN
			-- EXITE TENDERO
      -- exist_tendero_by_dni
			SELECT coalesce(count(id_ten),0) AS exist FROM tendero WHERE doc_ten = p_doc_ten;

		END CASE;

	END$$

--
-- Funciones
--
CREATE DEFINER=`root`@`127.0.0.1` FUNCTION `diaSemana`(dia int) RETURNS varchar(15) CHARSET latin1
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
	END$$

CREATE DEFINER=`root`@`127.0.0.1` FUNCTION `mes`(mes int) RETURNS varchar(15) CHARSET latin1
	BEGIN

		DECLARE v_mes VARCHAR(15);

		CASE mes
			WHEN 1 THEN SET v_mes = 'ENERO';
			WHEN 2 THEN SET v_mes = 'FEBRERO';
			WHEN 3 THEN SET v_mes = 'MARZO';
			WHEN 4 THEN SET v_mes = 'ABRIL';
			WHEN 5 THEN SET v_mes = 'MAYO';
			WHEN 6 THEN SET v_mes = 'JUNIO';
			WHEN 7 THEN SET v_mes = 'JULIO';
			WHEN 8 THEN SET v_mes = 'AGOSTO';
			WHEN 9 THEN SET v_mes = 'SEPTIEMBRE';
			WHEN 10 THEN SET v_mes = 'OCTUBRE';
			WHEN 11 THEN SET v_mes = 'NOVIEMBRE';
			WHEN 12 THEN SET v_mes = 'DICIEMBRE';
		END CASE;
		return v_mes;
	END$$

DELIMITER ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `cab_incidente`
--

CREATE TABLE IF NOT EXISTS `cab_incidente` (
	`id_incidente` bigint(20) NOT NULL,
	`id_tien` int(11) NOT NULL,
	`tipo` varchar(9) NOT NULL DEFAULT 'accidente' COMMENT 'accidente',
	`nombre_involucrado` varchar(150) NOT NULL,
	`dni_involucrado` varchar(15) NOT NULL,
	`acto_condicion_insegura` varchar(500) NOT NULL,
	`edad_accidentado` int(11) NOT NULL,
	`sexo_accidentado` char(1) NOT NULL,
	`fecha_accidente` datetime NOT NULL,
	`nivel_gravedad` varchar(15) NOT NULL COMMENT 'ALTO\nMODERADO\nBAJO\n',
	`diagnostico` varchar(500) NOT NULL,
	`descanso_medico` char(2) NOT NULL COMMENT 'SI\nNO',
	`cantidad_dias` int(11) NOT NULL,
	`descripcion_causas` varchar(500) NOT NULL,
	`lesion` varchar(30) NOT NULL COMMENT 'INCAPACIDAD TEMPORAL\nINCAPACIDAD PERMANENTE',
	`acciones_correctivas_realizadas` varchar(500) NOT NULL,
	`total` double NOT NULL DEFAULT '0'
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8;

--
-- Volcado de datos para la tabla `cab_incidente`
--

INSERT INTO `cab_incidente` (`id_incidente`, `id_tien`, `tipo`, `nombre_involucrado`, `dni_involucrado`, `acto_condicion_insegura`, `edad_accidentado`, `sexo_accidentado`, `fecha_accidente`, `nivel_gravedad`, `diagnostico`, `descanso_medico`, `cantidad_dias`, `descripcion_causas`, `lesion`, `acciones_correctivas_realizadas`, `total`) VALUES
	(1, 1, 'accidente', 'JOSE DOMINGUEZ DE LA CRUZ', '15264512', 'CAIDA DE CAMARA', 25, 'M', '2015-07-05 00:00:00', 'ALTO', 'sin diagnostico', 'NO', 0, 'sin causas', 'INCAPACIDAD TEMPORAL', 'sin acciones correctivas', 0),
	(2, 2, 'accidente', 'FELICIANO', '58256562', 'ROBO', 10, 'F', '2015-07-03 13:15:00', 'ALTO', 'sin diagnostico', 'NO', 0, 'sin causas', 'INCAPACIDAD TEMPORAL', 'sin acciones correctivas', 0),
	(4, 4, 'accidente', 'ANGEL', '25458952', 'CAIDA', 32, 'M', '2015-07-05 15:13:00', 'ALTO', 'sin diagnostico', 'NO', 0, 'sin causas', 'INCAPACIDAD TEMPORAL', 'sin acciones correctivas', 0),
	(6, 11, 'accidente', 'Ricardo coqchi', '46435523', 'sin condicion', 20, 'M', '2015-08-01 11:15:00', 'BAJO', '', 'NO', 0, 'sin descripcion', 'INCAPACIDAD TEMPORAL', 'sin acciones correctivas', 300),
	(7, 4, 'accidente', 'RICARDI COQCHI', '15262252', 'sin condicion', 20, 'M', '2015-08-01 11:26:00', 'BAJO', '', 'NO', 0, 'sin descripcion', 'INCAPACIDAD TEMPORAL', 'sin acciones correctivas', 30),
	(8, 1, 'accidente', 'RICARDITO', '25142236', 'sin condicion', 20, 'M', '2015-08-01 11:38:00', 'BAJO', '', 'NO', 0, 'sin descripcion', 'INCAPACIDAD TEMPORAL', 'sin acciones correctivas', 24),
	(9, 1, 'incidente', 'NELSON', '15265598', 'sin condicion', 20, 'M', '2015-08-01 11:42:00', 'BAJO', '', 'NO', 0, 'sin descripcion', 'INCAPACIDAD TEMPORAL', 'sin acciones correctivas', 25),
	(10, 1, 'incidente', 'JOSE ESPINADO DMOIN', '59654475', 'sin condicion', 20, 'M', '2015-08-03 14:42:00', 'BAJO', 'sin diagnostico', 'NO', 0, 'sin descripcion', 'INCAPACIDAD TEMPORAL', 'sin acciones correctivas', 25),
	(11, 1, 'incidente', 'JUAN CLAUDIO DOMINGUEZ', '48592615', 'sin condicion', 20, 'M', '2015-08-09 00:46:00', 'BAJO', 'sin diagnostico', 'NO', 0, 'sin descripcion', 'INCAPACIDAD TEMPORAL', 'sin acciones correctivas', 0),
	(12, 1, 'incidente', 'Juan Dominguez', '89652214', 'sin condicion', 20, 'M', '2015-08-09 00:51:00', 'BAJO', 'sin diagnostico', 'NO', 0, 'sin descripcion', 'INCAPACIDAD TEMPORAL', 'sin acciones correctivas', 55);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `cab_interven`
--

CREATE TABLE IF NOT EXISTS `cab_interven` (
	`num_inte` int(11) NOT NULL,
	`fec_inte` datetime NOT NULL,
	`id_ten` int(11) NOT NULL,
	`der_ten` varchar(25) DEFAULT NULL,
	`lugar_derivacion` varchar(150) DEFAULT NULL,
	`dni_prev` varchar(15) NOT NULL,
	`nom_prev` varchar(150) DEFAULT NULL,
	`id_pues` int(11) NOT NULL,
	`mod_empl` varchar(500) DEFAULT NULL,
	`det_inte` varchar(600) DEFAULT NULL,
	`id_tien` int(11) NOT NULL,
	`total_recuperado` double NOT NULL DEFAULT '0',
	`tipo_hurto` char(1) NOT NULL DEFAULT '1' COMMENT '1 INTERNO\n2 EXTERNO'
) ENGINE=InnoDB AUTO_INCREMENT=63 DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `cab_interven`
--

INSERT INTO `cab_interven` (`num_inte`, `fec_inte`, `id_ten`, `der_ten`, `lugar_derivacion`, `dni_prev`, `nom_prev`, `id_pues`, `mod_empl`, `det_inte`, `id_tien`, `total_recuperado`, `tipo_hurto`) VALUES
	(7, '2015-05-16 19:00:00', 4, 'Otros', NULL, '15254587', 'NUÑEZ ESPINOZA, LUIS ANTONIO', 1, NULL, NULL, 2, 123.47, '2'),
	(10, '2015-05-19 21:00:00', 3, 'Comisaria', NULL, '98653265', 'ANAYA BRIONES, ISSA JOAN', 1, NULL, NULL, 15, 706.66, '2'),
	(11, '2015-05-22 21:00:00', 1, 'Dirincri', NULL, '14152636', 'APAZA MESTAS, CARLA PAOLA', 1, NULL, NULL, 2, 1211.83, '1'),
	(24, '2015-07-09 06:56:00', 6, 'Comisaria', '', '25365587', 'BONIFACIO PACCO, FREYER MIGUEL', 1, 'inasd', 'ererrerere', 1, 390, '2'),
	(25, '2015-07-09 07:14:00', 6, 'Comisaria', '', '34546654', 'LEON MELGAREJO, ELEOENAI MERARI', 1, 'administracoin', 'incidentes', 1, 180, '1'),
	(26, '2015-07-09 07:17:00', 6, 'Comisaria', '', '45253368', 'LIMA TUNQUI, MARYLUZ HANA', 1, 'modalidad emplead', 'detalle de la intervenicon', 1, 750, '2'),
	(27, '2015-07-09 10:18:00', 6, 'Comisaria', '', '25145526', 'LIZANA AUCCASI, JHOSELIN YHOREIMA', 1, 'fdgdfg', 'dfgdfgdfgdfgdfg', 1, 408, '1'),
	(28, '2015-07-09 10:26:00', 6, 'Comisaria', '', '58585666', 'LOPEZ OLANDA, ALISSON ILENE', 1, 'dfgdfgdfg', 'dfgdfgdfg', 1, 0, '1'),
	(29, '2015-07-09 11:34:00', 6, 'Comisaria', '', '56545534', 'SANDOVAL POZO, CLAUDIA MELISSA', 1, '', '', 1, 0, '2'),
	(30, '2015-07-09 11:37:00', 6, 'Comisaria', '', '78657798', 'SIVIRICHI BARRAZA, SANDRA SHERINE', 1, '', '', 10, 125.25, '1'),
	(31, '2015-07-09 11:47:00', 6, 'Comisaria', '', '63528596', 'TORRE AGUIRRE, PATRICIA', 1, '', '', 10, 20.55, '1'),
	(32, '2015-07-09 16:33:00', 12, 'Comisaria', '', '43534255', 'TRUJILLO ZELAYA, DOMINGO', 1, 'ASDASDAS', 'ASDASDASD', 1, 0, '2'),
	(33, '2015-07-09 17:22:00', 13, 'Comisaria', '', '12355555', 'VALDIVIA SALAZAR, ROSITA MARISOL', 1, '', '', 1, 0, '1'),
	(34, '2015-07-10 14:04:00', 14, 'Comisaria', '', '23454988', 'VALENCIA ROCA, SHEYLA JOHANA', 1, '', '', 1, 0, '1'),
	(37, '2015-07-10 20:09:00', 6, 'Comisaria', '', '98685965', 'FLORES LÓPEZ, KEVYN GABRIEL', 1, 'asdasd', 'asdas', 5, 0, '2'),
	(38, '2015-07-11 07:37:00', 6, 'Comisaria', '', '45564434', 'GIL ACUÑA, LADY SMITH ', 1, 'asdasd', 'asdasd', 1, 0, '1'),
	(39, '2015-07-11 07:57:00', 17, 'Comisaria', '', '46435523', 'GOMEZ VILCHEZ, GONZALO', 1, '', '', 1, 0, '2'),
	(40, '2015-07-11 08:09:00', 18, 'Comisaria', '', '69655524', 'GUERREROS NAVARRETE, RAÚL ALONSO', 1, '', '', 3, 0, '1'),
	(41, '2015-07-11 08:21:00', 19, 'Comisaria', '', '12123345', 'GUZMAN LEON, ALEXIS', 1, '', '', 1, 0, '1'),
	(42, '2015-07-11 08:29:00', 20, 'Comisaria', '', '56567787', 'CHAVEZ HUAYTA, ROGER VLADIMIR', 1, '', '', 3, 0, '2'),
	(43, '2015-07-11 08:32:00', 21, 'Comisaria', '', '12345565', 'CHUQUITAYPE CHACALTANA, ALICIA D.', 1, '', '', 4, 0, '1'),
	(44, '2015-07-11 09:04:00', 21, 'Comisaria', '', '48591526', 'CONDORI CHAISA, JOSEPH IVAN', 1, '', '', 1, 0, '2'),
	(45, '2015-07-23 21:20:00', 25, 'Dirincri', '', '48592636', 'Jose Elimiliano', 4, '', '', 12, 600, '2'),
	(46, '2015-07-23 22:56:00', 25, 'Comisaria', '', '12355555', 'VALDIVIA SALAZAR, ROSITA MARISOL', 1, 'asd', 'asdas', 13, 1050.5, '1'),
	(47, '2015-07-24 07:24:00', 26, 'Comisaria', '', '48592615', 'Nuevo PREVEN', 1, 'asd', 'qwe', 11, 20, '1'),
	(48, '2015-07-24 07:27:00', 27, 'Comisaria', '', '48592615', 'Nuevo PREVEN', 1, '', '', 5, 30, '1'),
	(49, '2015-07-28 15:44:00', 26, 'Otros', 'Soltado', '15264859', 'JUAN DOMINGUEZ', 1, 'A MANO ARMADA', 'INFORMACION DE DETALLE', 1, 250.25, '2'),
	(50, '2015-07-28 15:51:00', 26, 'Dirincri', '', '48592615', 'Nuevo PREVEN', 1, 'ADMIN', 'INFORMADOR', 17, 240, '1'),
	(51, '2015-07-28 16:09:00', 26, 'Comisaria', '', '49564859', 'Nuevos Ademanes', 1, '', '', 3, 250.2, '1'),
	(52, '2015-07-28 16:11:00', 26, 'Comisaria', '', '49568858', 'MONTES SANOMAMANI', 1, '', '', 15, 20, '1'),
	(53, '2015-07-30 12:49:00', 26, 'Comisaria', '', '48592615', 'JOSE FELICIANO', 1, '', '', 3, 120, '1'),
	(54, '2015-07-30 13:40:00', 28, 'Comisaria', '', '48596636', 'DIONALY VARGAS', 4, '', '', 4, 30, '1'),
	(55, '2015-08-03 09:54:00', 29, 'Comisaria', '', '15263526', 'QUISPE QUISPE', 3, '', '', 7, 325, '1'),
	(56, '2015-08-04 11:28:00', 26, 'Comisaria', '', '56235562', 'JUAN DOMINGUEZ PEREZ PEREZ', 4, '', '', 5, 150.25, '2'),
	(57, '2015-08-04 12:12:00', 26, 'Comisaria', '', '48592615', 'Nuevo PREVEN', 1, 'ADMINISTRADOR', 'INFORMACION DE LAS MIMSA', 13, 65, '1'),
	(58, '2015-08-04 12:18:00', 26, 'Comisaria', '', '48592615', 'Nuevo PREVEN', 1, '', '', 3, 300.46, '1'),
	(59, '2015-08-04 12:20:00', 26, 'Comisaria', '', '48592615', 'Nuevo PREVEN', 1, 'sin modidad', 'sin intervencion', 3, 1500, '1'),
	(60, '2015-08-04 12:25:00', 28, 'Comisaria', '', '12345565', 'CHUQUITAYPE CHACALTANA, ALICIA D.', 1, '', '', 5, 2000, '1'),
	(61, '2015-08-17 15:08:00', 30, 'Interno', '', '46435523', 'GOMEZ VILCHEZ, GONZALO', 2, 'LE ROBARON', 'LE ROABRON', 14, 0, '2'),
	(62, '2015-08-17 15:17:00', 31, 'Interno', '', '45764336', 'dfg', 4, 'csd', 'fvdg', 3, 0, '2');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `cab_operatividad`
--

CREATE TABLE IF NOT EXISTS `cab_operatividad` (
	`id_operatividad` bigint(20) NOT NULL,
	`fecha_registro` date NOT NULL,
	`estado` varchar(10) NOT NULL DEFAULT 'EN PROCESO' COMMENT 'REGISTRADO'
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8 COMMENT='CONSOLIDADO DE CHECK LIST GENERAL DE OPERATIVIDAD TIENDAS OECHSLE';

--
-- Volcado de datos para la tabla `cab_operatividad`
--

INSERT INTO `cab_operatividad` (`id_operatividad`, `fecha_registro`, `estado`) VALUES
	(1, '2015-07-01', 'EN PROCESO');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `cab_sensor`
--

CREATE TABLE IF NOT EXISTS `cab_sensor` (
	`id_sensor` bigint(20) NOT NULL,
	`dni_prev` varchar(15) NOT NULL,
	`nom_prev` varchar(150) NOT NULL,
	`fecha_registro` datetime NOT NULL,
	`total` double NOT NULL,
	`observaciones` varchar(600) DEFAULT NULL,
	`id_tien` int(11) NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8;

--
-- Volcado de datos para la tabla `cab_sensor`
--

INSERT INTO `cab_sensor` (`id_sensor`, `dni_prev`, `nom_prev`, `fecha_registro`, `total`, `observaciones`, `id_tien`) VALUES
	(3, '48592632', 'NELSON COQCHI APAZA', '2015-07-28 21:48:00', 250, 'SIN OBSERVACIONES', 11),
	(4, '46435523', 'JUAN DOMINGUEZ PEREZ', '2015-07-28 21:52:00', 240, 'SIN OBSERVACIONES', 3),
	(5, '48592636', 'CARMEN DE LA CRUZ', '2015-07-29 00:43:00', 250, 'SIN OBSERVACIONES', 2),
	(6, '46435523', 'JUAN DOMINGUEZ PEREZ', '2015-07-29 22:00:00', 130, 'SIN OBSERVACIONES', 6),
	(7, '46435523', 'JUAN DOMINGUEZ PEREZ', '2015-08-03 16:44:00', 1370.75, 'SIN OBSERVACIONES', 6),
	(8, '46435523', 'JUAN DOMINGUEZ PEREZ', '2015-08-04 16:38:00', 120, 'SIN OBSERVACIONES', 3),
	(9, '48592636', 'CARMEN DE LA CRUZ', '2015-08-04 16:42:00', 255, 'SIN OBSERVACIONES', 4),
	(10, '46435523', 'JUAN DOMINGUEZ PEREZ', '2015-08-08 16:18:00', 110, 'SIN OBSERVACIONES', 6);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `det_incidente`
--

CREATE TABLE IF NOT EXISTS `det_incidente` (
	`id_incidente` bigint(20) NOT NULL,
	`cod_pro` varchar(30) DEFAULT NULL,
	`desc_pro` varchar(100) DEFAULT NULL,
	`mar_pro` varchar(50) DEFAULT NULL,
	`cant` int(11) DEFAULT NULL,
	`precio` double DEFAULT NULL,
	`es_activo` char(2) NOT NULL DEFAULT 'SI'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Volcado de datos para la tabla `det_incidente`
--

INSERT INTO `det_incidente` (`id_incidente`, `cod_pro`, `desc_pro`, `mar_pro`, `cant`, `precio`, `es_activo`) VALUES
	(1, 'ERT', 'POLO', '', 1, 0, 'NO'),
	(1, 'ER', ' CAMARA', '', 1, 0, 'NO'),
	(2, 'ERT-25', 'CAMISA', '', 1, 0, 'NO'),
	(2, 'DF', 'LAMPARA', '', 1, 0, 'NO'),
	(4, 'DF', 'PANTALON', '', 1, 0, 'SI'),
	(4, 'DF', 'PANTALON', '', 1, 0, 'NO'),
	(9, 'RER', 'POLO', 'ADIDAS', 1, 25, 'SI'),
	(10, 'ER-215', 'CAMI', 'CAM', 1, 25, 'NO'),
	(11, '485', 'ESCALERA', '', 1, 0, 'SI'),
	(12, 'ER', 'CAMARA', 'imeco', 1, 55, 'SI');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `det_interven`
--

CREATE TABLE IF NOT EXISTS `det_interven` (
	`num_inte` int(11) NOT NULL,
	`cod_pro` varchar(30) DEFAULT NULL,
	`des_pro` varchar(100) DEFAULT NULL,
	`mar_pro` varchar(50) DEFAULT NULL,
	`cant` int(11) DEFAULT NULL,
	`precio` double DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `det_interven`
--

INSERT INTO `det_interven` (`num_inte`, `cod_pro`, `des_pro`, `mar_pro`, `cant`, `precio`) VALUES
	(24, 'cod', 'CORTES', 'adidas', 12, 20),
	(24, 'er-3', 'CORTAS', 'puma', 10, 15),
	(25, 'er-22', 'POLOS', 'adidas', 12, 15),
	(26, 'por-25', 'PANTALON', 'MARC', 25, 30),
	(27, 'er-25', 'CELULAR', 'UMBRO', 12, 23),
	(27, 'we-68', 'CORTAS', 'UMBRO', 12, 11),
	(28, 'er', 'ZAPATO', 'ADIDAS', 34, 0),
	(29, 'Erp32', 'ZAPATILLA', 'PLART', 0, 0),
	(32, '2342', 'CELULAR', 'FILA', 0, 0),
	(33, '12', 'CELULAR', 'ADIDAS', 0, 0),
	(34, '23', 'CORTE', 'NIKE', 0, 0),
	(45, 'ER-25', 'LAS GALERIAS', 'INFROMACION', 20, 30),
	(46, 'ER-69', 'CAMISA', 'KAS', 2, 150.25),
	(46, 'TR-36', 'ADMIN', 'ASD', 12, 20),
	(46, 'KR-25', 'ZAPATILLA', 'NIKE', 2, 250),
	(46, 'HT-58', 'POLO', 'Fila', 1, 10),
	(31, 'ER-25', 'COLLAR', 'PILAS', 1, 20.55),
	(30, 'Re', 'ROPA', 'ERP', 1, 125.25),
	(47, 'TR', 'polo', 'adidas', 2, 10),
	(48, 'RT-25', 'POLOS', 'ADIDAS', 2, 15),
	(11, 'FR-2589', 'GORRAS B13', 'B13', 3, 250.36),
	(11, 'RT-3655', 'PANTALONES ROJOS', 'PANTALONES', 3, 120.25),
	(11, 'ER-25', 'CAMISAS', 'DOLORES', 1, 100),
	(49, 'ER-25', 'CASETERA', 'IMECO', 1, 250.25),
	(50, 'ER-25', 'CASETERA', 'local', 2, 120),
	(51, 'ER-36', 'camisas', 'filpo', 1, 250.2),
	(52, 'ER-5', 'celular', 'samsung', 1, 20),
	(53, 'er-25', 'POLO', 'ADIDAS', 1, 120),
	(54, 'er', 'polo', 'adidas', 1, 10),
	(54, 'er2', 'camisero', 'pum', 1, 20),
	(55, 'ER', 'GORRAS', 'ADIDAS', 1, 150),
	(55, 'ER-2', 'CAMISAS', 'FILP', 1, 25),
	(55, 'RT', 'PANTALON', 'FIL', 2, 75),
	(10, 'DE-2522', 'PANTALONES', 'ADIDAS', 1, 47.36),
	(10, 'DE-2522', 'CAMISAS', 'ADIDAS', 5, 59.65),
	(10, 'GF-5895', 'CAMISAS CUELLO CAMISERO', 'FILIPO', 3, 120.35),
	(7, 'DE-2522', 'POLOS', 'UMBRO', 1, 15.25),
	(7, 'DE-2522', 'JEAN', 'UMBRO', 1, 78.22),
	(7, 'RT-36', 'ASD', 'SDF', 2, 15),
	(56, 'ca-25', 'CASACAS', 'PIM', 1, 150.25),
	(57, 'er-25', 'JEAN', 'TIGRE', 1, 65),
	(58, 'ER-36', 'POLERAS', 'EASY', 2, 150.23),
	(59, 'er-36', 'laptop', 'HP', 1, 1500),
	(60, 'BIC-25', 'BICICLETA', 'monta', 1, 2000),
	(61, 'ASDAS', 'ASDAS', '', 0, 0);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `det_operatividad`
--

CREATE TABLE IF NOT EXISTS `det_operatividad` (
	`id_det_operatividad` bigint(20) NOT NULL,
	`id_operatividad` bigint(20) NOT NULL,
	`id_tien` int(11) NOT NULL,
	`id_producto` int(11) NOT NULL,
	`marca_equipo` varchar(150) NOT NULL,
	`modelo_equipo` varchar(150) NOT NULL,
	`capacidad_equipo` varchar(150) NOT NULL,
	`cantidad_total` int(11) NOT NULL DEFAULT '0',
	`cantidad_interna` int(11) NOT NULL DEFAULT '0',
	`cantidad_externa` int(11) NOT NULL DEFAULT '0',
	`cantidad_inoperativo` int(11) NOT NULL DEFAULT '0',
	`cantidad_operativo` int(11) NOT NULL DEFAULT '0',
	`cantidad_reubicacion` int(11) NOT NULL,
	`otros` varchar(250) DEFAULT NULL,
	`observaciones` varchar(500) DEFAULT NULL
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8;

--
-- Volcado de datos para la tabla `det_operatividad`
--

INSERT INTO `det_operatividad` (`id_det_operatividad`, `id_operatividad`, `id_tien`, `id_producto`, `marca_equipo`, `modelo_equipo`, `capacidad_equipo`, `cantidad_total`, `cantidad_interna`, `cantidad_externa`, `cantidad_inoperativo`, `cantidad_operativo`, `cantidad_reubicacion`, `otros`, `observaciones`) VALUES
	(1, 1, 1, 1, ' ', ' ', ' ', 10, 5, 5, 7, 3, 2, ' ', 'sin observaciones'),
	(2, 1, 2, 1, ' ', ' ', ' ', 25, 18, 7, 10, 15, 3, '', ''),
	(3, 1, 3, 1, ' ', ' ', ' ', 10, 5, 5, 0, 10, 4, ' ', 'sin observaciones'),
	(4, 1, 4, 1, ' ', ' ', ' ', 15, 13, 2, 9, 6, 2, '', ''),
	(5, 1, 5, 1, ' ', ' ', ' ', 20, 10, 10, 2, 18, 5, '', ''),
	(7, 1, 17, 1, 'josefina', 'new', 'cap', 10, 10, 0, 5, 5, 0, '', ''),
	(8, 1, 11, 1, 'nelso', 'asds', 'dfgg', 25, 15, 10, 15, 10, 2, '', ''),
	(11, 1, 10, 2, 'm', 'mo', 'cap', 15, 10, 5, 2, 13, 0, '', ''),
	(12, 1, 4, 3, 'china', 'chi', 'c', 30, 18, 12, 20, 10, 0, '', '');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `det_sensor`
--

CREATE TABLE IF NOT EXISTS `det_sensor` (
	`id_sensor` bigint(20) NOT NULL,
	`cod_pro` varchar(30) DEFAULT NULL,
	`desc_pro` varchar(100) DEFAULT NULL,
	`mar_pro` varchar(50) DEFAULT NULL,
	`cant` int(11) DEFAULT NULL,
	`precio` double DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Volcado de datos para la tabla `det_sensor`
--

INSERT INTO `det_sensor` (`id_sensor`, `cod_pro`, `desc_pro`, `mar_pro`, `cant`, `precio`) VALUES
	(6, 'ER-25', 'CAMISAS', 'AS', 1, 20),
	(6, 'ER-32', 'POLOS', 'puma', 2, 55),
	(7, '123', 'LICUADORA', 'Recco', 1, 120.25),
	(7, 'LED 5050LB', 'TV', 'LG', 1, 1250.5),
	(8, 'cod', 'ZAPATILLA', 'adidas', 1, 120),
	(9, 'ER-255T', 'ZAPATILLA', 'NIKE', 1, 255),
	(10, 'ER-25', 'CAMISAS', '', 2, 55);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `prevencionista`
--

CREATE TABLE IF NOT EXISTS `prevencionista` (
	`dni_prev` varchar(15) NOT NULL,
	`nom_prev` varchar(150) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Volcado de datos para la tabla `prevencionista`
--

INSERT INTO `prevencionista` (`dni_prev`, `nom_prev`) VALUES
	('14253665', 'LOSTAUNAU AVALOS, ANDDHRE PHILIPPE'),
	('24153625', 'GOYONECHE SOLARI, JOSUÁ JOHAO'),
	('45155586', 'JIMENEZ VILLANUEVA, CHRISTOPHER BRYAN'),
	('48591254', 'COTERA CARI, JOSE ALFREDO'),
	('48596653', 'CAMARENA LEON, WALDIR'),
	('51515615', 'CASTRO MORAN, EVELYN EMMA');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `producto`
--

CREATE TABLE IF NOT EXISTS `producto` (
	`id_producto` int(11) NOT NULL,
	`nombre` varchar(100) NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8;

--
-- Volcado de datos para la tabla `producto`
--

INSERT INTO `producto` (`id_producto`, `nombre`) VALUES
	(1, 'ANTENAS AM'),
	(2, 'BATERIAS'),
	(3, 'CAMARAS DOMO'),
	(4, 'CAMARAS FIJAS'),
	(5, 'CONTACTOS MAGNETICO (DE APERTURA)'),
	(6, 'DESACOPLADOR ELECTRICO'),
	(7, 'DESACOPLADOR MANUAL'),
	(8, 'DETECTORES DE HUMO'),
	(9, 'DISCO DURO/VCR'),
	(10, 'DVR/MULTIPLEXOR'),
	(11, 'ESTACIONES MANUALES'),
	(12, 'EXTINTORES'),
	(13, 'GABINETES'),
	(14, 'JOYSTICK'),
	(15, 'LUCES STROBOSCOPICAS'),
	(16, 'MATRIZ'),
	(17, 'MONITOR'),
	(18, 'PANEL'),
	(19, 'PIR(DETECTOR DE MOVIMIENTOS)'),
	(20, 'RADIOS'),
	(21, 'SOPORTE'),
	(22, 'GRUPO ELECTRÓGENO'),
	(23, 'BOMBA CONTRAINCENDIO'),
	(24, 'AIRE ACONDICIONADO'),
	(25, 'GABINETE CONTRAINCENDIO');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `puesto`
--

CREATE TABLE IF NOT EXISTS `puesto` (
	`id_pues` int(11) NOT NULL,
	`des_pues` varchar(35) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `puesto`
--

INSERT INTO `puesto` (`id_pues`, `des_pues`) VALUES
	(1, 'Tangos(Puerta)'),
	(2, 'Movil (Sala de ventas)'),
	(3, 'Aguia (Cctv)'),
	(4, 'Alto Valor'),
	(5, 'Almacen'),
	(6, 'Probadores');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tendero`
--

CREATE TABLE IF NOT EXISTS `tendero` (
	`id_ten` int(11) NOT NULL,
	`nom_ten` varchar(100) NOT NULL,
	`ape_ten` varchar(100) NOT NULL,
	`dir_ten` varchar(150) NOT NULL,
	`doc_ten` varchar(15) NOT NULL,
	`id_tip_ten` int(11) NOT NULL,
	`fec_nac` date NOT NULL,
	`sexo` char(1) NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=32 DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `tendero`
--

INSERT INTO `tendero` (`id_ten`, `nom_ten`, `ape_ten`, `dir_ten`, `doc_ten`, `id_tip_ten`, `fec_nac`, `sexo`) VALUES
	(1, 'JOSELLY ALEXANDRA', 'GUERRERO NARVAEZ', 'lar gardewinas', '58687858', 1, '1990-06-05', 'M'),
	(2, 'LIZBETH LIDUVINA', 'LLANCARI RIVEROS', 'san juan de lurigancho', '15254578', 1, '1990-05-05', 'F'),
	(3, 'CARMEN ROSA', 'CANCHARI CUELLAR', 'san isidro', '56544258', 1, '1990-08-05', 'M'),
	(4, 'ALBERT GONZALO', 'SILVA AHRENS', 'jicamarca', '87554847', 2, '1990-05-05', 'M'),
	(5, 'CAROLINE GIULIANA', 'TERRONES MORENO', 'miraflores', '69685587', 2, '1990-09-05', 'M'),
	(6, 'Nelson', 'Coqchi', 'Las Galeras', '46435529', 1, '2015-07-08', 'M'),
	(12, 'jOSE lUIS', 'ADMIN', 'MASETRAS', '69584475', 1, '2015-07-09', 'M'),
	(13, 'NUEVO TENDERO', 'COQCHI APAZA', '', '12345678', 1, '2015-07-09', 'M'),
	(14, 'rezo', 'goez', '', '56456676', 1, '2015-07-10', 'M'),
	(15, '5432', '54321', '', '99999999', 1, '2015-07-10', 'M'),
	(17, 'probando', 'asdasd', '', '69685580', 1, '2015-07-11', 'M'),
	(18, 'nelson montes', 'sanomamani', '', '46435522', 1, '2015-07-11', 'M'),
	(19, 'CHAPI', 'RAMOS HUILCA', '', '46465523', 1, '2015-07-11', 'M'),
	(20, 'asd', 'asd', '', '46435521', 1, '2015-07-11', 'M'),
	(21, 'CONDORI', 'RAMOS', 'CALLE BAJA', '46435531', 2, '2015-07-11', 'M'),
	(22, 'VREONICA', 'CARMENSITA', 'LAS MALVINAS', '11112222', 3, '2015-07-11', 'M'),
	(23, 'ASDAS', 'ASDAS', '', '11113333', 1, '2015-07-11', 'M'),
	(24, 'asdasd', 'asdasd', '', '11115555', 1, '2015-07-11', 'M'),
	(25, 'Nelson', 'Coqchi Apaza', 'SAN JUAN DE LURIGANCHO', '44444444', 1, '1990-04-22', 'M'),
	(26, 'PANCHO', 'GOMEZ SALDAÑA', 'LOS JIRONEZ DE ACAPULCO', '46435523', 2, '2015-07-24', 'M'),
	(27, 'JOSE', 'JUSTINO', '', '49468825', 1, '1990-05-10', 'M'),
	(28, 'JOSE', 'DOMINGUEZ', 'las nalvinas', '48591625', 1, '1990-07-30', 'M'),
	(29, 'javier', 'de la cruz', 'san juan de lurigancho', '56232214', 2, '1990-08-03', 'M'),
	(30, 'CRISTIAN', 'SDASDASD', 'LAS FLORES', '755462573', 2, '1996-08-17', 'M'),
	(31, 'dgjk', 'sgb', 'xbj', '467890779', 2, '2015-08-17', 'M');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tienda`
--

CREATE TABLE IF NOT EXISTS `tienda` (
	`id_tien` int(11) NOT NULL,
	`nom_tien` varchar(35) NOT NULL,
	`usuario` varchar(15) NOT NULL,
	`pass_tien` varchar(15) NOT NULL,
	`estado` varchar(1) NOT NULL,
	`rol` varchar(45) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `tienda`
--

INSERT INTO `tienda` (`id_tien`, `nom_tien`, `usuario`, `pass_tien`, `estado`, `rol`) VALUES
	(0, 'ADMINISTRADOR', 'grupo odisea', 'RUC 20451806972', 'A', 'ADMINISTRADOR'),
	(1, '(OECHSLE) Salaverry', 'grupo odisea', '980597009', 'A', 'JEFE DE ODISEA'),
	(2, '(OECHSLE) Jockey Plaza', 'Daniel', '46178', 'A', 'GERENTE DE PREVENCION'),
	(3, '(OECHSLE) Plaza Norte', 'oechsle', '20493020618', 'A', 'JEFE DE PREVENCION'),
	(4, '(OECHSLE) Centro Civico', 'oechsle', '20493020618', 'A', 'JEFES DE PREVENCION'),
	(5, '(OECHSLE) JR Union', 'oechsle', '20493020618', 'A', 'JEFES DE PREVENCION'),
	(6, '(OECHSLE) Primavera', 'oechsle', '20493020618', 'A', 'JEFES DE PREVENCION'),
	(7, '(OECHSLE) Plaza Lima Norte', 'oechsle', '20493020618', 'A', 'JEFES DE PREVENCION'),
	(8, '(OECHSLE) CUSCO', 'oechsle', '20493020618', 'A', 'JEFES DE PREVENCION'),
	(9, '(OECHSLE) AREQUIPA', 'oechsle', '20493020618', 'A', 'JEFES DE PREVENCION'),
	(10, '(OECHSLE) JULIACA', 'oechsle', '20493020618', 'A', 'JEFES DE PREVENCION'),
	(11, '(OECHSLE) HUANCAYO', 'oechsle', '20493020618', 'A', 'JEFES DE PREVENCION'),
	(12, '(OECHSLE) BARRANCA', 'oechsle', '20493020618', 'A', 'JEFES DE PREVENCION'),
	(13, '(OECHSLE) CAJAMARCA', 'oechsle', '20493020618', 'A', 'JEFES DE PREVENCION'),
	(14, '(OECHSLE) CHICLAYO', 'oechsle', '20493020618', 'A', 'JEFES DE PREVENCION'),
	(15, '(OECHSLE) PUCALLPA', 'oechsle', '20493020618', 'A', 'JEFES DE PREVENCION'),
	(16, '(OECHSLE) TRUJILLO', 'oechsle', '20493020618', 'A', 'JEFES DE PREVENCION'),
	(17, '(OECHSLE) PIURA', 'oechsle', '20493020618', 'A', 'JEFES DE PREVENCION'),
	(18, '(OECHSLE) HUANCAYO', 'oechsle', '20493020618', 'A', 'JEFES DE PREVENCION'),
	(19, '(OECHSLE) ICA', 'oechsle', '20493020618', 'A', 'JEFES DE PREVENCION'),
	(20, 'CARPA Pro', 'oechsle', '20493020618', 'A', 'JEFES DE PREVENCION'),
	(21, 'CARPA Santa Clara', 'oechsle', '20493020618', 'A', 'JEFES DE PREVENCION');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tipo_tendero`
--

CREATE TABLE IF NOT EXISTS `tipo_tendero` (
	`id_tip_ten` int(11) NOT NULL,
	`des_tip_ten` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `tipo_tendero`
--

INSERT INTO `tipo_tendero` (`id_tip_ten`, `des_tip_ten`) VALUES
	(1, 'Oportunista'),
	(2, 'Profesional'),
	(3, 'Interno');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `cab_incidente`
--
ALTER TABLE `cab_incidente`
ADD PRIMARY KEY (`id_incidente`), ADD KEY `fk_cab_incidente_tienda_idx` (`id_tien`);

--
-- Indices de la tabla `cab_interven`
--
ALTER TABLE `cab_interven`
ADD PRIMARY KEY (`num_inte`), ADD KEY `FK_idTen_Cab_in` (`id_ten`), ADD KEY `FK_idprev_Cab_in` (`dni_prev`), ADD KEY `FK_idpues_Cab_in` (`id_pues`), ADD KEY `FK_idtien_Cab_in` (`id_tien`);

--
-- Indices de la tabla `cab_operatividad`
--
ALTER TABLE `cab_operatividad`
ADD PRIMARY KEY (`id_operatividad`);

--
-- Indices de la tabla `cab_sensor`
--
ALTER TABLE `cab_sensor`
ADD PRIMARY KEY (`id_sensor`), ADD KEY `fk_cab_sensro_tienda_idx` (`id_tien`);

--
-- Indices de la tabla `det_incidente`
--
ALTER TABLE `det_incidente`
ADD KEY `fk_det_incidente_cab_incidente_idx` (`id_incidente`);

--
-- Indices de la tabla `det_interven`
--
ALTER TABLE `det_interven`
ADD KEY `FK_numinte_Cab_in` (`num_inte`);

--
-- Indices de la tabla `det_operatividad`
--
ALTER TABLE `det_operatividad`
ADD PRIMARY KEY (`id_det_operatividad`), ADD KEY `fk_detopera_cab_operativis_idx` (`id_operatividad`), ADD KEY `fk_det_operativida_tienda_idx` (`id_tien`), ADD KEY `fk_det_operatividad_producto_idx` (`id_producto`);

--
-- Indices de la tabla `det_sensor`
--
ALTER TABLE `det_sensor`
ADD KEY `fk_det_sensor_cab_sensor_idx` (`id_sensor`);

--
-- Indices de la tabla `prevencionista`
--
ALTER TABLE `prevencionista`
ADD PRIMARY KEY (`dni_prev`);

--
-- Indices de la tabla `producto`
--
ALTER TABLE `producto`
ADD PRIMARY KEY (`id_producto`);

--
-- Indices de la tabla `puesto`
--
ALTER TABLE `puesto`
ADD PRIMARY KEY (`id_pues`);

--
-- Indices de la tabla `tendero`
--
ALTER TABLE `tendero`
ADD PRIMARY KEY (`id_ten`), ADD UNIQUE KEY `doc_ten` (`doc_ten`), ADD KEY `FK_Ten_Tip` (`id_tip_ten`);

--
-- Indices de la tabla `tienda`
--
ALTER TABLE `tienda`
ADD PRIMARY KEY (`id_tien`);

--
-- Indices de la tabla `tipo_tendero`
--
ALTER TABLE `tipo_tendero`
ADD PRIMARY KEY (`id_tip_ten`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `cab_incidente`
--
ALTER TABLE `cab_incidente`
MODIFY `id_incidente` bigint(20) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=13;
--
-- AUTO_INCREMENT de la tabla `cab_interven`
--
ALTER TABLE `cab_interven`
MODIFY `num_inte` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=63;
--
-- AUTO_INCREMENT de la tabla `cab_operatividad`
--
ALTER TABLE `cab_operatividad`
MODIFY `id_operatividad` bigint(20) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=2;
--
-- AUTO_INCREMENT de la tabla `cab_sensor`
--
ALTER TABLE `cab_sensor`
MODIFY `id_sensor` bigint(20) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=11;
--
-- AUTO_INCREMENT de la tabla `det_operatividad`
--
ALTER TABLE `det_operatividad`
MODIFY `id_det_operatividad` bigint(20) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=13;
--
-- AUTO_INCREMENT de la tabla `producto`
--
ALTER TABLE `producto`
MODIFY `id_producto` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=26;
--
-- AUTO_INCREMENT de la tabla `tendero`
--
ALTER TABLE `tendero`
MODIFY `id_ten` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=32;
--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `cab_incidente`
--
ALTER TABLE `cab_incidente`
ADD CONSTRAINT `fk_cab_incidente_tienda` FOREIGN KEY (`id_tien`) REFERENCES `tienda` (`id_tien`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Filtros para la tabla `cab_interven`
--
ALTER TABLE `cab_interven`
ADD CONSTRAINT `FK_idpues_Cab_in` FOREIGN KEY (`id_pues`) REFERENCES `puesto` (`id_pues`),
ADD CONSTRAINT `FK_idten_Cab_in` FOREIGN KEY (`id_ten`) REFERENCES `tendero` (`id_ten`) ON DELETE NO ACTION ON UPDATE NO ACTION,
ADD CONSTRAINT `FK_idtien_Cab_in` FOREIGN KEY (`id_tien`) REFERENCES `tienda` (`id_tien`);

--
-- Filtros para la tabla `cab_sensor`
--
ALTER TABLE `cab_sensor`
ADD CONSTRAINT `fk_cab_sensro_tienda` FOREIGN KEY (`id_tien`) REFERENCES `tienda` (`id_tien`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Filtros para la tabla `det_incidente`
--
ALTER TABLE `det_incidente`
ADD CONSTRAINT `fk_det_incidente_cab_incidente` FOREIGN KEY (`id_incidente`) REFERENCES `cab_incidente` (`id_incidente`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Filtros para la tabla `det_interven`
--
ALTER TABLE `det_interven`
ADD CONSTRAINT `fk_det_inter_cab_inter` FOREIGN KEY (`num_inte`) REFERENCES `cab_interven` (`num_inte`);

--
-- Filtros para la tabla `det_operatividad`
--
ALTER TABLE `det_operatividad`
ADD CONSTRAINT `fk_det_operativida_tienda` FOREIGN KEY (`id_tien`) REFERENCES `tienda` (`id_tien`) ON DELETE NO ACTION ON UPDATE NO ACTION,
ADD CONSTRAINT `fk_det_operatividad_producto` FOREIGN KEY (`id_producto`) REFERENCES `producto` (`id_producto`) ON DELETE NO ACTION ON UPDATE NO ACTION,
ADD CONSTRAINT `fk_detopera_cab_operativis` FOREIGN KEY (`id_operatividad`) REFERENCES `cab_operatividad` (`id_operatividad`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Filtros para la tabla `det_sensor`
--
ALTER TABLE `det_sensor`
ADD CONSTRAINT `fk_det_sensor_cab_sensor` FOREIGN KEY (`id_sensor`) REFERENCES `cab_sensor` (`id_sensor`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Filtros para la tabla `tendero`
--
ALTER TABLE `tendero`
ADD CONSTRAINT `FK_Ten_Tip` FOREIGN KEY (`id_tip_ten`) REFERENCES `tipo_tendero` (`id_tip_ten`);

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
