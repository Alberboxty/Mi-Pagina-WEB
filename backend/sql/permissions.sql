CREATE TABLE route_permissions (

    id_route_permission INTEGER
        GENERATED ALWAYS AS IDENTITY
        PRIMARY KEY,

    route VARCHAR(255) NOT NULL,

    method VARCHAR(10) NOT NULL,

    id_permission INTEGER NOT NULL,

    FOREIGN KEY (id_permission)
        REFERENCES permissions(id_permission)
        ON DELETE CASCADE

);