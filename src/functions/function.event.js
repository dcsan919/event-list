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
        async filtro (req, res) {
          try {
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
                     //Cambié la forma de consulta pa que puedan buscar por el primer nombre sin necesidad de que pongan todo el nombre
                     //filtro?nombre_evento= algo así y te saldrá el evento
                     if (nombre_evento) {
                      sql += ' AND a.nombre LIKE ?';
                      params.push(`${nombre_evento}%`);
                    }
                    if (hora) {
                      sql += ' AND a.hora = ?';
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

            //await agregado xd
            const results = await new Promise((resolve, reject)=>{
              db.query(sql, params, (error, results) => {
                if (error) {
                  reject(error);
                } else {
                  resolve(results);
                }
              })
            })

              if (results.length === 0) {
                let errorMsg = 'No se encontraron eventos con ';

                const filterMessages = [];
                if (nombre_evento) filterMessages.push(`el nombre: ${nombre_evento}`);
                if (hora) filterMessages.push(`la hora: ${hora}`);
                if (category) filterMessages.push(`la categoría: ${category}`)
                if (tipo_evento) filterMessages.push(`el tipo de evento: ${tipo_evento}`)

                if (filterMessages.length > 0) {
                  errorMsg += ' ' + filterMessages.join(', ');
              }
              return res.status(404).json({ error: errorMsg });
              }
              res.json(results);
          
          } catch (error) {
            console.error({messaje: "Error with filter", error})
            res.status(500).json({ error: "Error en la consulta" });
          }
    };
    
}
module.exports = new Evento
