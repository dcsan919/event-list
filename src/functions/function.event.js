const db = require('../../db/db');

class Evento{
       getEvents(req, res){
              const sql = `SELECT a.evento_id, a.nombre AS nombre_evento, a.fecha_inicio, a.fecha_termino, a.hora, a.ubicacion, a.max_per, a.estado, a.fecha_autorizacion, b.nombre AS tipo_evento, e.nombre AS organizador_nombre, e.nombre AS autorizado_nombre, c.estado, d.nombre AS categoria_nombre, f.imagen_url 
                         FROM Eventos a 
                         INNER JOIN Tipos_Evento b ON a.tipo_evento_id = b.tipo_evento_id  
                         INNER JOIN Validacion c ON a.validacion_id = c.validacion_id 
                         INNER JOIN Categorias d ON a.categoria_id = d.categoria_id
                         INNER JOIN Usuarios e ON a.organizador_id = e.usuario_id
                         INNER JOIN Imagenes f ON a.evento_id = f.evento_id
                         WHERE c.estado = "APROBADO"
                         ORDER BY ABS(DATEDIFF(fecha_inicio, CURDATE()))`;
              db.query(sql, (error, results) => {
              if (error) {
                  console.error("Error al realizar la consulta:", error);
                  res.status(500).json({ error: "Error al obtener datos de la base de datos" });
                  return;
              }
              res.json(results);
          });
       }
      
       //filtro por Nombre de evento, Categoría y tipo de evento
        filtro (req, res) {
        const { nombre_evento, hora, category, tipo_evento } = req.query;
        
        let sql = `SELECT a.evento_id, a.nombre AS nombre_evento, a.fecha_inicio, a.fecha_termino, a.hora, a.ubicacion, a.max_per, a.estado, a.fecha_autorizacion, 
                            b.nombre AS tipo_evento, e.nombre AS organizador_nombre, e.nombre AS autorizado_nombre, c.estado, d.nombre AS categoria_nombre, f.imagen_url 
                     FROM Eventos a 
                     INNER JOIN Tipos_Evento b ON a.tipo_evento_id = b.tipo_evento_id  
                     INNER JOIN Validacion c ON a.validacion_id = c.validacion_id 
                     INNER JOIN Categorias d ON a.categoria_id = d.categoria_id
                     INNER JOIN Usuarios e ON a.organizador_id = e.usuario_id
                     INNER JOIN Imagenes f ON a.evento_id = f.evento_id
                     WHERE 1=1 AND c.estado = "APROBADO"`
                     const params = [];
                     if (nombre_evento) {
                      sql += ' AND a.nombre = ?';
                      params.push(nombre_evento);
                    }
                    if (hora) {
                      sql += ' AND a.nombre = ?';
                      params.push(hora);
                    }
                     if (category) {
                      sql += ' AND d.nombre = ?';
                      params.push(category);
                    }
                      if (tipo_evento) {
                        sql += ' AND b.nombre = ?';
                        params.push(tipo_evento);
                    } 
                    sql += ' ORDER BY ABS(DATEDIFF(fecha_inicio, CURDATE()))';

        db.query(sql, params, (error, results) => {
            if (error) {
                console.error("Error en la consulta", error);
                return res.status(500).json({ error: "Error en la consulta" });
            }
            if (results.length === 0) {
              let errorMsg = 'No se encontraron eventos con';
              if (category && tipo_evento) {
                errorMsg += ` la categoria: ${category} y el tipo de evento: ${tipo_evento}`;
              } else if (nombre_evento) {
                errorMsg += ` el nombre': ${nombre_evento}`;
              } else if (category) {
                errorMsg += ` la categoria': ${category}`;
              } else if (tipo_evento) {
                errorMsg += ` el tipo de evento: ${tipo_evento}`;
              }
              return res.status(404).json({ error: errorMsg });
            }
            res.json(results);
        });
    };
    
}
module.exports = new Evento
