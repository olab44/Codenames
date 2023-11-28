create table roles (
    role_id SERIAL PRIMARY KEY,
    role_name VARCHAR(50) NOT NULL
);

insert into roles (role_name) values
    ('red boss'),
    ('red_agent'),
    ('blue boss'),
    ('blue agent');
