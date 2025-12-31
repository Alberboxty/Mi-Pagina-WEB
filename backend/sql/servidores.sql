CREATE TYPE estado_servidor AS ENUM (
    'online',
    'offline',
    'mantenimiento'
);

CREATE TABLE servidores (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nombre_servidor VARCHAR(100) NOT NULL,
    estado estado_servidor NOT NULL,
    ip VARCHAR(45) NOT NULL,
    imagen BYTEA NOT NULL,
    description TEXT NOT NULL,
    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE media (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nombre_servidor VARCHAR(100) NOT NULL,
    imagen TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);