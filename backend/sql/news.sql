imagen
titulo
asunto
descripción
fecha_creacion
version
autor
publicado


CREATE TABLE noticias (
    id              SERIAL PRIMARY KEY,
    imagen          VARCHAR(500),
    titulo          VARCHAR(200) NOT NULL,
    asunto          VARCHAR(50) NOT NULL,
    descripcion     VARCHAR(2000) NOT NULL,
    fecha_creacion  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    version         VARCHAR(20),
    autor_id        INTEGER REFERENCES usuarios(id) ON DELETE SET NULL,
    publicado       BOOLEAN NOT NULL DEFAULT FALSE
);




SELECT n.*, u.nombre AS autor_nombre
FROM noticias n
JOIN usuarios u ON n.autor_id = u.id
WHERE n.id = $1;