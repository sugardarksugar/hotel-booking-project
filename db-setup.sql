CREATE USER ccc with SUPERUSER PASSWORD 'ccc';
CREATE USER ddd WITH PASSWORD 'ddd' SUPERUSER;
create table hotel(
    id serial primary key,
    hotel_name varchar(50) not null,
    price integer not null,
    gym boolean not null,
    pool boolean not null,
    wifi boolean,
    spa boolean,
    level integer,
    distract varchar(255),
    address varchar(500) not null,
    total_room_number integer not null
);
insert into hotel_info (
        hotel_name,
        price,
        gym,
        pool,
        wifi,
        spa,
        level,
        address,
        total_room_number
    )
values (
        'Hotel Without Surprise',
        405,
        false,
        false,
        true,
        false,
        null,
        'ind Hotel, 326 Kwun Tong Rd',
        40
    );
insert into hotel_info (
        hotel_name,
        price,
        gym,
        pool,
        wifi,
        spa,
        level,
        address,
        total_room_number
    )
values (
        'Queen Felix',
        628,
        true,
        true,
        true,
        true,
        5,
        'Nina Hotel Kowloon East, 38 Chong Yip St, Kwun Tong',
        100
    );
insert into hotel_info (
        hotel_name,
        price,
        gym,
        pool,
        wifi,
        spa,
        level,
        address,
        total_room_number
    )
values (
        'King Mody',
        70,
        true,
        true,
        true,
        true,
        5,
        'Holiday Inn Express Hong Kong Kowloon CBD2 Kwun Tong, How Ming St, 九十七號 How Ming Street 97, Kwun Tong, Kowloon',
        100
    );
insert into hotel_info (
        hotel_name,
        price,
        gym,
        pool,
        wifi,
        spa,
        level,
        address,
        total_room_number
    )
values (
        'The Cheap Hotel',
        320,
        false,
        false,
        true,
        false,
        null,
        'Hotel COZi ‧ Harbour View, 163 Wai Yip St, Kwun Tong',
        18
    );
insert into hotel_info (
        hotel_name,
        price,
        gym,
        pool,
        wifi,
        spa,
        level,
        address,
        total_room_number
    )
values (
        'HK Hotel',
        405,
        true,
        true,
        true,
        false,
        3,
        '香港觀塘帝盛酒店, 84 Hung To Rd, Kwun Tong',
        30
    );
insert into hotel_info (
        hotel_name,
        price,
        gym,
        pool,
        wifi,
        spa,
        level,
        address,
        total_room_number
    )
values (
        'Normal Hotel',
        561,
        true,
        false,
        true,
        false,
        4,
        'Harbour Plaza 8 Degrees, 199 Kowloon City Rd, To Kwa Wan',
        50
    );
insert into hotel_info (
        hotel_name,
        price,
        gym,
        pool,
        wifi,
        spa,
        level,
        address,
        total_room_number
    )
values (
        'Disappointed Hotel',
        279,
        false,
        false,
        true,
        false,
        null,
        'O Hotel, 42號 Kowloon City Rd, To Kwa Wan',
        25
    );
insert into hotel_info (
        hotel_name,
        price,
        gym,
        pool,
        wifi,
        spa,
        level,
        address,
        total_room_number
    )
values (
        'Hotel for Sex Only',
        289,
        false,
        false,
        true,
        false,
        null,
        'iclub Ma Tau Wai Hotel, 8 Ha Heung Rd, To Kwa Wan',
        20
    );
insert into hotel_info (
        hotel_name,
        price,
        gym,
        pool,
        wifi,
        spa,
        level,
        address,
        total_room_number
    )
values (
        'Tecky Hotel',
        533,
        true,
        true,
        true,
        true,
        5,
        'Regal Oriental Hotel, 30-38 Sa Po Rd, Kowloon City',
        100
    );
insert into hotel_info (
        hotel_name,
        price,
        gym,
        pool,
        wifi,
        spa,
        level,
        address,
        total_room_number
    )
values (
        'Emperor Leo',
        877,
        true,
        true,
        true,
        true,
        5,
        'Harbour Grand Kowloon, Whampoa Garden, 20 Tak Fung St, Hung Hom',
        100
    );
-------------------------------------------------------------------------------------------------------------------------------------------------------------
create table users(
    id serial primary key,
    admin boolean not null,
    username VARCHAR(255) not null,
    password VARCHAR(255) not null,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP
);
insert into users(admin, username, password)
values(true, 'Mody', 'Mody');
insert into users(admin, username, password)
values(true, 'Leo', 'Leo');
insert into users(admin, username, password)
values(true, 'Felix', 'Felix');
---------------------------------------------------------------------------------------------------------------------------------------------------------
create table booking(
    id serial primary key,
    booking_date DATE not null,
    created_at TIMESTAMP DEFAULT NOW(),
    hotel_id INTEGER REFERENCES hotel_info(id) not null,
    users_id INTEGER REFERENCES users(id) not null
);
--------------------------------------------------------------------------------------------------------------------------------------------------------------
create table ban_table(
    id serial primary key,
    users_id INTEGER REFERENCES users(id) not null,
    created_at TIMESTAMP DEFAULT NOW(),
    reason varchar(500),
    ban_date integer
);
---------------------------------------------------------------------------------------------------------------------------------------------------------------
create table hotel_review(
    id serial primary key,
    star integer,
    users_id integer not null REFERENCES users(id),
    created_at TIMESTAMP DEFAULT NOW()
);
--------------------------------------------------------------------------------------------------------------------------------------------------------------
create table comment(
    id serial primary key,
    users_id integer not null REFERENCES users(id),
    comment varchar(1000) not null,
    image varchar(255),
    hotel_id integer not null REFERENCES hotel_info(id),
    created_at TIMESTAMP DEFAULT NOW()
);
create table comment_image(
    id serial PRIMARY key,
    comment_id integer REFERENCES comment(id) image VARCHAR(255)
);
--------------------------------------------------------------------------------------------------------------------------------------------------------------
alter table hotel_info
    rename to hotel;
alter table booking_record
    rename to booking;
alter table ban_table
    rename to ban;
alter table hotel_review
add column hotel_id integer not null REFERENCES hotel(id);
update hotel
SET distract = 'kwun tong'
where id = 1;
update hotel
SET distract = 'kwun tong'
where id = 2;
update hotel
SET distract = 'kwun tong'
where id = 3;
update hotel
SET distract = 'kwun tong'
where id = 4;
update hotel
SET distract = 'kwun tong'
where id = 5;
update hotel
SET distract = 'to kwa wan'
where id = 6;
update hotel
SET distract = 'to kwa wan'
where id = 7;
update hotel
SET distract = 'to kwa wan'
where id = 8;
update hotel
SET distract = 'to kwa wan'
where id = 9;
update hotel
SET distract = 'to kwa wan'
where id = 10;
-- insert into booking 
-- ( booking_date, hotel_id, users_id)
-- VALUES
-- ('09-11-2022', 2,2)
-- insert into booking 
-- ( booking_date, hotel_id, users_id)
-- VALUES
-- ('09-11-2022', 1,1),
-- ('14-11-2022', 2,1),
-- ('09-11-2022', 1,1),
-- ('09-11-2022', 1,1);
-- select hotel.total_room_number - COUNT(hotel.*) as count_hotel,
-- hotel.hotel_name
-- from booking
-- LEFT JOIN hotel ON booking.hotel_id = hotel.id
-- where booking_date = '09-11-2022'
-- GROUP BY hotel.id;
select hotel.total_room_number - COUNT(booking.id) as count_hotel,
    hotel.hotel_name
from hotel
    JOIN booking ON booking.hotel_id = hotel.id
where booking.booking_date = '09-11-2022'
GROUP BY hotel.id;
select total_room_number,
    hotel_name,
    id
from hotel
where id not in (
        select hotel_id
        from booking
        where booking_date = '09-11-2022'
    );
-- select hotel.total_room_number - COUNT(booking.id) as count_hotel,
-- hotel.hotel_name
-- from hotel
-- LEFT JOIN booking ON booking.hotel_id = hotel.id
-- where booking.booking_date = '09-11-2022'
-- GROUP BY hotel.id;
-- select total_room_number as count_hotel, hotel_name from hotel where id NOT IN (select hotel.total_room_number - COUNT(booking.id) as count_hotel,
-- hotel.hotel_name
-- from hotel
-- JOIN booking ON booking.hotel_id = hotel.id
-- where booking.booking_date = '09-11-2022'
-- GROUP BY hotel.id);
select hotel.total_room_number - COUNT(booking.hotel_id) as available_room,
    hotel.*,
    COUNT(booking.hotel_id) as total_booked_num
from hotel
    JOIN booking ON booking.hotel_id = hotel.id
where booking.booking_date = '09-11-2022'
GROUP BY hotel.id;
select total_room_number as available_room,
    hotel_name,
    id
from hotel
where id not in (
        select hotel_id
        from booking
        where booking_date = '09-11-2022'
    );
select total_room_number,
    hotel_name,
    id
from hotel
where id not in (
        select hotel_idid
        from booking
        where booking_date = '09-11-2022'
    );
insert INTO hotel_review(star, users_id, hotel_id)
values (5, 1, 1);
insert INTO hotel_review(star, users_id, hotel_id)
values (4, 1, 2);
insert INTO hotel_review(star, usgiers_id, hotel_id)
values (4, 1, 3);
insert INTO hotel_review(star, users_id, hotel_id)
values (4, 1, 4);
insert INTO hotel_review(star, users_id, hotel_id)
values (4, 1, 5);
insert INTO hotel_review(star, users_id, hotel_id)
values (4, 1, 6);
insert INTO hotel_review(star, users_id, hotel_id)
values (4, 1, 7);
insert INTO hotel_review(star, users_id, hotel_id)
values (4, 1, 8);
insert INTO hotel_review(star, users_id, hotel_id)
values (4, 1, 9);
insert INTO hotel_review(star, users_id, hotel_id)
values (4, 1, 10);
update hotel
set x = 22.316419
where id = 1;
update hotel
set y = 114.2156046
where id = 1;
--
update hotel
set x = 22.3141482
where id = 2;
update hotel
set y = 114.219058
where id = 2;
--
update hotel
set x = 22.312787
where id = 3;
update hotel
set y = 114.2231214
where id = 3;
--
update hotel
set x = 22.312137
where id = 4;
update hotel
set y = 114.2195804
where id = 4;
--
update hotel
set x = 22.3080455
where id = 5;
update hotel
set y = 114.2243306
where id = 5;
--
update hotel
set x = 22.3229344
where id = 6;
update hotel
set y = 114.1906691
where id = 6;
--
update hotel
set x = 22.3173373
where id = 7;
update hotel
set y = 114.1879691
where id = 7;
--
update hotel
set x = 22.3162046
where id = 8;
update hotel
set y = 114.1887168
where id = 8;
--
update hotel
set x = 22.3299782
where id = 9;
update hotel
set y = 114.1930606
where id = 9;
--
update hotel
set x = 22.3027009
where id = 10;
update hotel
set y = 114.1923303
where id = 10;
--
update hotel
set level = 1
where id = 1;
update hotel
set level = 2
where id = 6;
update hotel
set level = 1
where id = 7;
update hotel
set level = 4
where id = 8;
insert into booking_record (
        booking_date,
        created_at,
        hotel_id,
        users_id
    )
values ('2022-11-10', '2022-11-10', 3, 86);
ALTER TABLE hotel_review
add COLUMN comment_id integer REFERENCES comment(id);
CREATE table hotel_image(
    id serial primary key,
    hotel_id integer not null,
    image_Name varchar(255) not null
);
insert into hotel_image(hotel_id, image_Name)
values (1, 'hotel1.jpeg');
insert into hotel_image(hotel_id, image_Name)
values (2, 'hotel2.jpeg');
insert into hotel_image(hotel_id, image_Name)
values (3, 'hotel3.jpeg');
insert into hotel_image(hotel_id, image_Name)
values (4, 'hotel4.jpeg');
insert into hotel_image(hotel_id, image_Name)
values (5, 'hotel5.jpeg');
insert into hotel_image(hotel_id, image_Name)
values (6, 'hotel6.jpeg');
insert into hotel_image(hotel_id, image_Name)
values (7, 'hotel7.jpeg');
insert into hotel_image(hotel_id, image_Name)
values (8, 'hotel8.jpeg');
insert into hotel_image(hotel_id, image_Name)
values (9, 'hotel9.jpeg');
insert into hotel_image(hotel_id, image_Name)
values (10, 'hotel10.jpeg');
-- add email into users
ALTER TABLE users
ADD COLUMN email VARCHAR(255) not NULL;
DELETE FROM users
where id > 52;
ALTER TABLE users
ADD COLUMN email VARCHAR(255) not NULL;
ALTER TABLE users
ADD COLUMN email VARCHAR(255) not NULL;
CREATE table payment_record (
    id serial primary key,
    created_at TIMESTAMP DEFAULT NOW(),
    email varchar(255) not null,
    price integer not null,
    reference_id varchar(255) not null,
    status varchar(50)
)
ALTER TABLE payment_record
ADD COLUMN currency VARCHAR(30) not NULL;
ALTER table payment_record
add column Hotel_name varchar(255);
drop table payment_record create table payment_record(
    id serial primary key,
    created_at TIMESTAMP DEFAULT NOW(),
    email varchar(255),
    price integer,
    reference_id varchar(255),
    status varchar(50),
    receipts varchar (255),
    Hotel_name varchar(255),
    currency VARCHAR(30),
    payment_intent_id varchar(255)
);

alter table payment_record add column user_id integer;
alter table payment_record add column internam_references_id varchar(255);
alter table payment_record add column number_of_room integer;
alter table payment_record add column checkin_date date;
alter table payment_record add column hotel_id integer;

delete from payment_record
SELECT hotel_name
FROM payment_record
WHERE hotel_id = 5
    and checkin_date = '2022-11-11';
ALTER TABLE payment_record
ADD FOREIGN KEY (user_id) REFERENCES users(id);
ALTER TABLE payment_record
ADD FOREIGN KEY (hotel_id) REFERENCES hotel(id);

SELECT Price from payment_record where checkin_date between '2022-01-01' and '2022-12-31'
-- SELECT Price from payment_record where checkin_date between '2022-02-01' and '2022-02-31'

update users set admin = true where id = 20;

ALTER TABLE  RENAME TO learners

ALTER TABLE users ADD COLUMN super_admin boolean;

update users set super_admin = true where id = 6;
delete from
alter table hotel_info
    RENAME to hotel
alter table ban_table
    rename to ban

update hotel set hotel_name = Tyrant Felix where id = 2;
