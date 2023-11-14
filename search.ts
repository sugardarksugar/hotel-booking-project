import express from "express";
import { client } from "./db";

export const searchRouter = express.Router();

async function getAllHotelData(date: string, location: string, order?: string) {
  let finalQuery = `
  select 
    hotel.total_room_number - COUNT(payment_record.hotel_id) as available_room,
    COUNT(payment_record.hotel_id) as total_booked_num,
    hotel.*
    from hotel
    JOIN payment_record ON payment_record.hotel_id = hotel.id
    where payment_record.checkin_date = $1 and
    distract = $2
    GROUP BY hotel.id

UNION 

    select total_room_number - 0 as available_room,
    0 as total_booked_num,
    hotel.* 
    from hotel
    where id not in (
      select hotel_id 
      from payment_record 
      where checkin_date = $1
    )
    AND hotel.distract = $2
  `;

  if (!!order) {
    finalQuery += `ORDER BY ${order}`;
  }

  let totalResult = await client.query(finalQuery, [date, location]);
  console.log(totalResult);

  return totalResult.rows;
}

//receiving request from frontend
searchRouter.post("/searchHotel", async (req, res) => {
  let { order } = req.query;
  const { location, date, numberOfRoom } = req.body;
  console.log({ location, date, numberOfRoom });

  const data: any[] = await getAllHotelData(date, location, order as string);
  // console.log(data);

  return res.json({ result: data });
});

// let result = await client.query(
//   /* sql */ "select * from hotel where distract = $1",
//   [location]
// );

// let result2 = await client.query(
//   /* sql */ `
//   select *,
//   booking_date + interval '8 hour' as t
//   from booking
//   where booking_date = $1`,
//   [date]
// );

// let result3 = await client.query(
//   /* sql */ "select total_room_number from hotel"
// );

//selecting data from DB which is booked hotel
//   let result4 = await client.query(
//     /* sql */ `select
//     hotel.total_room_number - COUNT(booking.hotel_id) as available_room,
//     hotel.*,
//     COUNT(booking.hotel_id) as total_booked_num
//     from hotel
//     JOIN booking ON booking.hotel_id = hotel.id
//     where booking.booking_date = $1 and
//     distract = $2
//     GROUP BY hotel.id`,
//     [date,location]
//   );

// //selecting data from DB which is non-booked hotel
//   let result5 = await client.query(
//     /* sql */ `
//     select total_room_number as available_room,
//     hotel.*
//     from hotel
//     where id not in (
//       select hotel_id
//       from booking
//       where booking_date = $1
//     )
//     AND hotel.distract = $2
//     `,[date,location]);

// console.log(result4.rows);
// console.log(result4.rows.length);
// console.log(result5.rows.length);

//join two results together for pushing back to frontend
// let arrFromDB:any[] = [...result4.rows, ...result5.rows]
// console.log(arrFromDB)
