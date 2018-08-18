drop table if exists shoes, cart;

create table shoes (
    id serial not null primary key,
    brand varchar(50) not null,
    colour varchar(50) not null,
    size int not null,
    price money not null,
    qty int not null
);

create table cart (
    id serial not null primary key,
    shoe_id int not null,
    qty int not null,
    subtotal money not null
);

