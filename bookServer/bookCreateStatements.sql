drop database if exists bookdb;
create database bookdb;

create table bookdb.book(
    bookID integer not null primary key,
    name varchar(62) not null,
    author varchar(12) not null,
    type varchar(26) not null,
    year integer not null
);

drop user if exists 'adrian'@'localhost';
create user 'adrian'@'localhost' identified by 'tN5LKSaK';

grant all privileges on bookdb.* to 'adrian'@'localhost';

insert into bookdb.book values(1, 'SQL-mysteries','Matt Wilson' ,'pocketbook' , 1990 );
insert into bookdb.book values(2, 'The SQL adventures ', 'Isla Shore' , 'hardcover' , 2012 )

