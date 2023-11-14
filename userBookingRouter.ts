import express from "express";
// import path from 'path'
// import json from 'json'
import { client } from "./db";
export const userBookingRouter = express.Router();

userBookingRouter.get("/bookingRecord", async (req, res) => {
  try {
    let userIdFromSession = req.session["user_id"];
    console.log("userIdFromSession:", userIdFromSession);
    let admin = req.session["admin"];
    let username = req.session["username"];

    if (admin === true) {
      let hotelAdminNotification = await client.query(
        `select
        payment_record.price as price,
        payment_record.checkin_date as checkin_date,
        payment_record.status as status,
        users.username as username,
        payment_record.id as id
        from payment_record
        JOIN users on payment_record.user_id = users.id
        where hotel_name = $1`,
        [username]
      );
      let findHotelAdminNotification = hotelAdminNotification.rows;
      console.log("findHotelAdminNotification:", findHotelAdminNotification);
      return res.json({
        findHotelAdminNotification: findHotelAdminNotification,
        admin: admin,
      });
    }
    let userBookedHotel = await client.query(
      `select 
            hotel.hotel_name as hotel_name,
            payment_record.price as price,
            payment_record.checkin_date as checkin_date,
            payment_record.status as status,
            payment_record.id as id
            from payment_record
            JOIN hotel on payment_record.hotel_id = hotel.id
            where user_id = $1`,
      [userIdFromSession]
    );

    let allBookedHotel = userBookedHotel.rows;

    return res.json({
      allBookedHotel: allBookedHotel,
      admin: admin,
    });
  } catch (error) {
    console.log(error);
    return res.json({});
  }
});

userBookingRouter.delete("/bookingRecord/cancelbooking", async (req, res) => {
  const { id } = req.body;
  let user_id = req.session["user_id"];
  console.log("id:", id);
  console.log("user_id:", user_id);

  if (!id || !user_id) {
    res.status(400).json({
      status: false,
      message: "Missing user_id and booking id.",
    });
  }
  await client.query(
    `delete from payment_record where user_id = $1 and id = $2 `,
    [user_id, id]
  );

  res.status(200).json({
    status: true,
    message: "Booking have been canceled",
  });
});
