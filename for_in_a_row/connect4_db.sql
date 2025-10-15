create DATABASE if not exists connect4_db;
use connect4_db;

create table if not exists games (
	id int auto_increment primary key,
    code varchar(100) unique,
    board text,
    turn int default 1,
    winner int default null,
    created_at timestamp default current_timestamp,
    updated_at timestamp default current_timestamp on update current_timestamp
    );