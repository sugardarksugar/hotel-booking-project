import { client } from "./db";
import path from "path";
import TelegramBot from "node-telegram-bot-api";
import express from "express";
import dotenv from "dotenv";
import { v4 as uuidv4 } from "uuid";

dotenv.config();

export const postRouter = express.Router();

export type Memo = {
  id: Number;
  content: string;
  image?: string;
};

const token = "5774103762:AAEgtyDRqanuMAJ2Ivtza2S16eanqnyJIgs";
const bot = new TelegramBot(token, { polling: true });
// Select the postInformation in DB

postRouter.post("/memo01", async (req, res) => {
  let { searchId } = req.body;
  let result = await client.query(
    `
      select comment.comment,
      users.username,
      hotel.hotel_name ,
      comment.hotel_id,
      comment.users_id,
      comment.id as comment_id,
      hotel_review.id as review_id,
      hotel_review.star as star
      from comment
      
      inner join hotel on hotel.id = comment.hotel_id
      inner join users on users.id = comment.users_id
      inner join hotel_review on hotel_review.comment_id = comment.id
      where comment.hotel_id = $1
      order by comment.id desc`,
    [searchId]
  );
  let comment: any = result.rows;
  return res.json(comment);
});

// Adding the postInformation in DB
postRouter.post("/postComment", async (req, res) => {
  let { content, id, star } = req.body;

  if (!content) {
    res.status(400);
    return res.json({ error: "Missing Content" });
  }
  if (!star || star == 0) {
    res.status(400);
    return res.json({ error: "Missing star" });
  }
  if (star > 5) {
    res.status(400);
    return res.json({ error: "Don't input the star which is out of range" });
  }
  let result01 = await client.query(
    `insert into comment (comment,hotel_id,users_id) values ($1,$2,$3) returning id`,
    [content, id, req.session["user_id"]]
  );
  console.log(result01.rows);
  let result02 = await client.query(
    `
    insert into hotel_review (hotel_id, star,comment_id,users_id) values ($1,$2,$3,$4)`,
    [id, star, result01.rows[0].id, req.session["user_id"]]
  );
  console.log(result01);
  console.log(result02);
  return res.json({ status: true });
});

//Delete the post in DB

postRouter.delete("/delete_post", async (req, res) => {
  let { id } = req.body;
  id;
  if (!id) {
    res.status(400).json({
      status: false,
      message: "Missing comment id.",
    });
  }
  let result02 = await client.query(
    ` delete from hotel_review where comment_id = $1`,
    [id]
  );
  let result01 = await client.query(`delete from comment where id = $1 `, [id]);

  console.log(result01, result02);
  return res.json({ status: true });
});

//Editing the post in DB

postRouter.post("/edit_post", async (req, res) => {
  let { id, newContent } = req.body;
  if (!id) {
    res.status(400).json({
      status: false,
      message: "Missing comment id.",
    });
  }

  await client.query(`update comment set comment = $1 where id = $2`, [
    newContent,
    id,
  ]);
  return res.json({ status: true });
});

// Select the information in DB

postRouter.get("/getHotelInformation", async (req, res) => {
  let { id } = req.query;
  let respond = await client.query(`select * from hotel where id = $1`, [id]);
  let result = respond.rows;
  return res.json(result);
});

// Select the Average in DB

postRouter.post("/getAvgHotelStar", async (req, res) => {
  try {
    let { id } = req.body;

    let respond = await client.query(
      `select avg(star) as avg from hotel_review where hotel_id = $1 group by hotel_id `,
      [id]
    );
    let result = respond.rows;
    result;
    return res.json(result);
  } catch (error) {
    return res.json({});
  }
});

// Select the Review in DB

postRouter.post("/getReviewer", async (req, res) => {
  let { id } = req.body;
  try {
    let respond = await client.query(
      `select count(id) as sum from hotel_review where hotel_id = $1 group by hotel_id`,
      [id]
    );
    let result = respond.rows;
    return res.json(result);
  } catch (error) {
    res.status(400);
    return res.json({ error: error });
  }
});

// Select the coordinate in DB

postRouter.get("/getCoordinate", async (req, res) => {
  let { id } = req.query;
  try {
    let respond = await client.query(`select x, y from hotel where id = $1`, [
      id,
    ]);
    let result = respond.rows;
    return res.json(result);
  } catch (error) {
    res.status(400);
    return res.json({ error: error });
  }
});

// Select the hotelStar in DB

postRouter.get("/getAllHotelStar", async (req, res) => {
  let { id } = req.query;

  try {
    let respond = await client.query(
      `
      SELECT star ,COUNT(star)
      FROM hotel_review
      WHERE hotel_id = $1
      GROUP BY star
      `,
      [id]
    );
    let result = respond.rows;
    /*
    [
      {star: 2, count: 4}, // 0
      {star: 3, count: 40},//1
      {star: 5, count: 3}//2
    ]
    */

    let starObj = {};
    /*
    {
      1: 0,
      2; 4,
      3: 40
      4: 0,
      5: 3
    }
    */
    for (let i = 1; i < 6; i++) {
      let ind = result.findIndex((v: any) => v.star === i);
      starObj[i] = ind >= 0 ? +result[ind].count : 0;
    }

    // ({ result, starObj });

    return res.json(starObj);
  } catch (error) {
    error;

    res.status(400);
    return res.json({ error: error });
  }
});

// Select the hotelImage in DB

postRouter.get("/getHotelImage", async (req, res) => {
  let { id } = req.query;
  console.log(id);
  let respond = await client.query(
    `
  select image_name from hotel_image where hotel_id = $1`,
    [id]
  );
  let result = respond.rows;
  return res.json(result);
});

// Create the Payment in DB

const stripe = require("stripe")(process.env.STRIPE_PRIVATE_KEY);

postRouter.get("/create-checkout-session", async (req, res) => {
  let { id, nor, date } = req.query;
  console.log(req.query);
  console.log(date);

  const internal_references_id = uuidv4();

  await client.query(
    "INSERT INTO payment_record (internal_references_id , user_id, status, number_of_room, checkin_date, hotel_id) VALUES ($1, $2, 'pending',$3 ,$4,$5)",
    [internal_references_id, req.session["user_id"] ?? -1, nor, date, id]
  );

  let storeItems = await client.query(`select * from hotel where id = $1`, [
    id,
  ]);

  let result = storeItems.rows;

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "HKD",
            product_data: {
              name: result[0].hotel_name,
            },
            unit_amount: result[0].price * 100,
          },
          quantity: nor,
        },
        {
          price_data: {
            currency: "HKD",
            product_data: {
              name: internal_references_id,
            },
            unit_amount: 0,
          },
          quantity: 1,
        },
      ],
      payment_intent_data: {
        metadata: {
          internal_references_id: internal_references_id,
          user_id: req.session["user_id"],
          nor,
          date,
          id,
        },
      },
      success_url: `http://localhost:8080/checkOutSuccess.html`,
      cancel_url: `http://localhost:8080/checkOutCancel.html?refId=${internal_references_id}`,
    });

    res.json({ url: session.url });
  } catch (err) {
    res.status(500);
    if (err instanceof Error) {
      console.log(err.message);
    } else {
      console.log("Unexpected error", err);
    }
  }
});

postRouter.post(`/checkOutCancel`, async (req, res) => {
  let { refId } = req.body;
  console.log(refId);
  let respond = await client.query(
    `select payment_intent_id from payment_record where internal_references_id = $1`,
    [refId]
  );
  let result = respond.rows;
  if (!result[0].payment_intent_id) {
    let deletePayment = await client.query(
      `delete from payment_record where internal_references_id = $1`,
      [refId]
    );
    return res.json(deletePayment);
  }
  console.log(result);
  return res.json(result);
});

//Robot

let date = new Date();
let year = date.getFullYear();
let month = date.getMonth() + 1;
let day = date.getDate();

bot.onText(/\/start/, async (msg) => {
  const chatId = msg.chat.id;
  let str = `Now you can use our service in telegram !
click /Recommend to find our recommendation of Hotel
click /Distract  to find the distract of Hotel
`;
  bot.sendPhoto(chatId, path.join(__dirname, "/public/hotel.png"));
  bot.sendMessage(chatId, str);
});

bot.onText(/\/Recommend/, async (msg) => {
  const chatId = msg.chat.id;
  await bot.sendMessage(
    chatId,
    "We recommend you to reside EmperorLeo, QueenFelix, KingMody"
  );
  bot.sendMessage(
    chatId,
    "click /EmperorLeo to see the Information of EmperorLeo "
  );
  bot.sendMessage(
    chatId,
    "click /TyrantFelix to see the Information of QueenFelix "
  );
  bot.sendMessage(
    chatId,
    "click /KingMody to see the Information of KingMody "
  );
});

bot.onText(/\/Distract/, async (msg) => {
  const chatId = msg.chat.id;
  let str = `We have two Distract of Hotel to provide you to select it
click /KwunTong to find the Hotel on Kwun Tong
click /ToKwaWan to find the Hotel on To Kwa Wan
  `;
  bot.sendMessage(chatId, str);
});

bot.onText(/\/KwunTong/, async (msg) => {
  const chatId = msg.chat.id;
  let getKwunTongHotelInformation = await client.query(
    `select hotel_name from hotel where distract = $1 order by id`,
    ["kwun tong"]
  );
  let kwunTongHotelInformation = getKwunTongHotelInformation.rows;
  console.log(kwunTongHotelInformation[0].hotel_name);
  let str = `We have five hotel in Kwun Tong
click /HotelWithoutSurprise to see the information of Hotel Without Surprise
click /QueenFelix to see the information of QueenFelix
click /KingMody to see the information of KingMody
click /TheCheapHotel to see the information of The Cheap Hotel
click /HKHotel to see the information of HK Hotel
  `;
  bot.sendMessage(chatId, str);
});

bot.onText(/\/ToKwaWan/, async (msg) => {
  const chatId = msg.chat.id;
  let gettoKwaWanHotelInformation = await client.query(
    `select hotel_name from hotel where distract = $1 order by id`,
    ["to kwa wan"]
  );
  let toKwaWanHotelInformation = gettoKwaWanHotelInformation.rows;
  console.log(toKwaWanHotelInformation);
  let str = `We have five hotel in Kwun Tong
click /NormalHotel to see the information of Normal Hotel
click /DisappointedHotel to see the information of Disappointed Hotel
click /HotelForSexOnly to see the information of Hotel for Sex Only
click /TeckyHotel to see the information of Tecky Hotel
click /EmperorLeo to see the information of Emperor Leo
  `;
  bot.sendMessage(chatId, str);
});

bot.onText(/\/HotelWithoutSurprise/, async (msg) => {
  const chatId = msg.chat.id;
  let id = 1;
  let getHotelWithoutSurpriseInformation = await client.query(
    `select * from hotel where id = ${id}`
  );
  let getAvailableRoomOfHotelWithoutSurprise = await client.query(
    `select hotel.total_room_number - COUNT(payment_record.hotel_id) as available_room ,
    hotel.hotel_name
    from hotel
   JOIN payment_record ON payment_record.hotel_id = hotel.id
   where payment_record.checkin_date = $1
  AND hotel.id = $2
   GROUP BY hotel.id

   UNION

    select total_room_number - 0 as available_room ,
    hotel.hotel_name
    from hotel
    where id not in (
      select hotel_id
      from payment_record
      where checkin_date = $1
    )
    AND hotel.id = $2

   `,
    [`${year}-${month}-${day}`, id]
  );
  let getAvailableRoom = getAvailableRoomOfHotelWithoutSurprise.rows;
  // console.log(getAvailableRoom[0].available_room);

  let hotelWithoutSurpriseInformation = getHotelWithoutSurpriseInformation.rows;
  console.log(hotelWithoutSurpriseInformation[0].hotel_name);
  bot.sendPhoto(chatId, path.join(__dirname, `/public/res/hotel${id}.jpeg`));
  let str = `This is the Information of HotelWithoutSurprise
Address:${hotelWithoutSurpriseInformation[0].address}
Level: ${hotelWithoutSurpriseInformation[0].level}
Amenities:WIFI
Available: ${getAvailableRoom[0].available_room}
Price:HKD$ ${hotelWithoutSurpriseInformation[0].price}
Click here to book it! http://www.localhost:8080/post.html?id=${id}&date=${year}-${month}-${day}&nor=1
  `;
  bot.sendMessage(chatId, str);
});

bot.onText(/\/TyrantFelix/, async (msg) => {
  const chatId = msg.chat.id;
  let id = 2;
  let getTyrantFelixInDB = await client.query(
    `select * from hotel where id = ${id}`
  );
  let getAvailableRoomOfTyrantFelix = await client.query(
    `select hotel.total_room_number - COUNT(payment_record.hotel_id) as available_room ,
    hotel.hotel_name
    from hotel
   JOIN payment_record ON payment_record.hotel_id = hotel.id
   where payment_record.checkin_date = $1
  AND hotel.id = $2
   GROUP BY hotel.id

   UNION

    select total_room_number - 0 as available_room ,
    hotel.hotel_name
    from hotel
    where id not in (
      select hotel_id
      from payment_record
      where checkin_date = $1
    )
    AND hotel.id = $2

   `,
    [`${year}-${month}-${day}`, id]
  );

  console.log(getAvailableRoomOfTyrantFelix);

  let getAvailableRoom = getAvailableRoomOfTyrantFelix.rows;

  let TyrantFelix = getTyrantFelixInDB.rows;
  bot.sendPhoto(chatId, path.join(__dirname, `/public/res/hotel${id}.jpeg`));

  let str = `🥳 This is the Information of TyrantFelix 🥳
Address: ${TyrantFelix[0].address}
Level: ${TyrantFelix[0].level}
Amenities: GYM, Swimming Pool, WIFI, SPA
Available: ${getAvailableRoom[0].available_room}
Price: HKD$${TyrantFelix[0].price}
Click here to book it! http://www.localhost:8080/post.html?id=${id}&date=${year}-${month}-${day}&nor=1
  `;
  bot.sendMessage(chatId, str);
});

bot.onText(/\/KingMody/, async (msg) => {
  const chatId = msg.chat.id;
  let id = 3;
  let getKingModyInDB = await client.query(
    `select * from hotel where id = ${id}`
  );
  let KingMody = getKingModyInDB.rows;

  let getAvailableRoomOfKingMody = await client.query(
    `select hotel.total_room_number - COUNT(payment_record.hotel_id) as available_room ,
    hotel.hotel_name
    from hotel
   JOIN payment_record ON payment_record.hotel_id = hotel.id
   where payment_record.checkin_date = $1
  AND hotel.id = $2
   GROUP BY hotel.id

   UNION

    select total_room_number - 0 as available_room ,
    hotel.hotel_name
    from hotel
    where id not in (
      select hotel_id
      from payment_record
      where checkin_date = $1
    )
    AND hotel.id = $2

   `,
    [`${year}-${month}-${day}`, id]
  );

  let getAvailableRoom = getAvailableRoomOfKingMody.rows;

  bot.sendPhoto(chatId, path.join(__dirname, `/public/res/hotel${id}.jpeg`));

  let str = `😘 This is the Information of KingMody 😘
Address: ${KingMody[0].address}
Level: ${KingMody[0].level}
Amenities: GYM, Swimming Pool, WIFI, SPA
Available: ${getAvailableRoom[0].available_room}
Price: HKD$${KingMody[0].price}
Click here to book it! http://www.localhost:8080/post.html?id=${id}&date=${year}-${month}-${day}&nor=1
  `;
  bot.sendMessage(chatId, str);
});

bot.onText(/\/TheCheapHotel/, async (msg) => {
  const chatId = msg.chat.id;
  let id = 4;
  let getTheCheapHotelInDB = await client.query(
    `select * from hotel where id = ${id}`
  );
  let theCheapHotel = getTheCheapHotelInDB.rows;

  let getAvailableRoomOfTheCheapHotel = await client.query(
    `select hotel.total_room_number - COUNT(payment_record.hotel_id) as available_room ,
    hotel.hotel_name
    from hotel
   JOIN payment_record ON payment_record.hotel_id = hotel.id
   where payment_record.checkin_date = $1
  AND hotel.id = $2
   GROUP BY hotel.id

   UNION

    select total_room_number - 0 as available_room ,
    hotel.hotel_name
    from hotel
    where id not in (
      select hotel_id
      from payment_record
      where checkin_date = $1
    )
    AND hotel.id = $2

   `,
    [`${year}-${month}-${day}`, id]
  );

  let getAvailableRoom = getAvailableRoomOfTheCheapHotel.rows;

  bot.sendPhoto(chatId, path.join(__dirname, `/public/res/hotel${id}.jpeg`));

  let str = `This is the Information of the CheapHotel
Address:${theCheapHotel[0].address}
Level: ${theCheapHotel[0].level}
Amenities:WIFI
Available: ${getAvailableRoom[0].available_room}
Price:HKD$${theCheapHotel[0].price}
click here to book it! http://www.localhost:8080/post.html?id=${id}&date=${year}-${month}-${day}&nor=1
  `;
  bot.sendMessage(chatId, str);
});

bot.onText(/\/HKHotel/, async (msg) => {
  const chatId = msg.chat.id;
  let id = 5;
  let getHKHotelInDB = await client.query(
    `select * from hotel where id = ${id}`
  );
  let HKHotelInformation = getHKHotelInDB.rows;

  let getAvailableRoomOfHKHotel = await client.query(
    `select hotel.total_room_number - COUNT(payment_record.hotel_id) as available_room ,
    hotel.hotel_name
    from hotel
   JOIN payment_record ON payment_record.hotel_id = hotel.id
   where payment_record.checkin_date = $1
  AND hotel.id = $2
   GROUP BY hotel.id

   UNION

    select total_room_number - 0 as available_room ,
    hotel.hotel_name
    from hotel
    where id not in (
      select hotel_id
      from payment_record
      where checkin_date = $1
    )
    AND hotel.id = $2

   `,
    [`${year}-${month}-${day}`, id]
  );

  let getAvailableRoom = getAvailableRoomOfHKHotel.rows;

  bot.sendPhoto(chatId, path.join(__dirname, `/public/res/hotel${id}.jpeg`));

  let str = `This is the Information of HK Hotel
Address:${HKHotelInformation[0].address}
Level: ${HKHotelInformation[0].level}
Amenities:GYM, Swimming, WIFI
Available: ${getAvailableRoom[0].available_room}
Price:HKD$${HKHotelInformation[0].price}
  Click here to book it! http://www.localhost:8080/post.html?id=${id}&date=${year}-${month}-${day}&nor=1
  `;
  bot.sendMessage(chatId, str);
});

bot.onText(/\/NormalHotel/, async (msg) => {
  const chatId = msg.chat.id;
  let id = 6;
  let getNormalHotelInDB = await client.query(
    `select * from hotel where id = ${id}`
  );
  let NormalHotelInformation = getNormalHotelInDB.rows;

  let getAvailableRoomOfNormalHotel = await client.query(
    `select hotel.total_room_number - COUNT(payment_record.hotel_id) as available_room ,
    hotel.hotel_name
    from hotel
   JOIN payment_record ON payment_record.hotel_id = hotel.id
   where payment_record.checkin_date = $1
  AND hotel.id = $2
   GROUP BY hotel.id

   UNION

    select total_room_number - 0 as available_room ,
    hotel.hotel_name
    from hotel
    where id not in (
      select hotel_id
      from payment_record
      where checkin_date = $1
    )
    AND hotel.id = $2

   `,
    [`${year}-${month}-${day}`, id]
  );

  let getAvailableRoom = getAvailableRoomOfNormalHotel.rows;

  bot.sendPhoto(chatId, path.join(__dirname, `/public/res/hotel${id}.jpeg`));

  let str = `This is the Information of Disappointed Hotel
Address:${NormalHotelInformation[0].address}
Level: ${NormalHotelInformation[0].level}
Amenities: WIFI
Available: ${getAvailableRoom[0].available_room}
Price:HKD$${NormalHotelInformation[0].price}
Click here to book it! http://www.localhost:8080/post.html?id=${id}&date=${year}-${month}-${day}&nor=1
  `;
  bot.sendMessage(chatId, str);
});

bot.onText(/\/DisappointedHotel/, async (msg) => {
  const chatId = msg.chat.id;
  let id = 7;
  let getDisappointedHotelInDB = await client.query(
    `select * from hotel where id = ${id}`
  );
  let DisappointedHotelInformation = getDisappointedHotelInDB.rows;

  let getAvailableRoomOfDisappointedHotel = await client.query(
    `select hotel.total_room_number - COUNT(payment_record.hotel_id) as available_room ,
    hotel.hotel_name
    from hotel
   JOIN payment_record ON payment_record.hotel_id = hotel.id
   where payment_record.checkin_date = $1
  AND hotel.id = $2
   GROUP BY hotel.id

   UNION

    select total_room_number - 0 as available_room ,
    hotel.hotel_name
    from hotel
    where id not in (
      select hotel_id
      from payment_record
      where checkin_date = $1
    )
    AND hotel.id = $2

   `,
    [`${year}-${month}-${day}`, id]
  );

  let getAvailableRoom = getAvailableRoomOfDisappointedHotel.rows;

  bot.sendPhoto(chatId, path.join(__dirname, `/public/res/hotel${id}.jpeg`));

  let str = `This is the Information of Disappointed Hotel
Address:${DisappointedHotelInformation[0].address}
Level: ${DisappointedHotelInformation[0].level}
Amenities: WIFI
Available: ${getAvailableRoom[0].available_room}
Price:HKD$${DisappointedHotelInformation[0].price}
Click here to book it! http://www.localhost:8080/post.html?id=${id}&date=${year}-${month}-${day}&nor=1
  `;
  bot.sendMessage(chatId, str);
});

bot.onText(/\/HotelForSexOnly/, async (msg) => {
  const chatId = msg.chat.id;
  let id = 8;
  let getHotelForSexOnlyInDB = await client.query(
    `select * from hotel where id = ${id}`
  );
  let HotelForSexOnlyInformation = getHotelForSexOnlyInDB.rows;

  let getAvailableRoomOfHotelForSexOnly = await client.query(
    `select hotel.total_room_number - COUNT(payment_record.hotel_id) as available_room ,
    hotel.hotel_name
    from hotel
   JOIN payment_record ON payment_record.hotel_id = hotel.id
   where payment_record.checkin_date = $1
  AND hotel.id = $2
   GROUP BY hotel.id

   UNION

    select total_room_number - 0 as available_room ,
    hotel.hotel_name
    from hotel
    where id not in (
      select hotel_id
      from payment_record
      where checkin_date = $1
    )
    AND hotel.id = $2

   `,
    [`${year}-${month}-${day}`, id]
  );

  let getAvailableRoom = getAvailableRoomOfHotelForSexOnly.rows;

  bot.sendPhoto(chatId, path.join(__dirname, `/public/res/hotel${id}.jpeg`));

  let str = `This is the Information of Hotel for Sex Only
Address:${HotelForSexOnlyInformation[0].address}
Level: ${HotelForSexOnlyInformation[0].level}
Amenities: WIFI
Available: ${getAvailableRoom[0].available_room}
Price:HKD$${HotelForSexOnlyInformation[0].price}
Click here to book it! http://www.localhost:8080/post.html?id=${id}&date=${year}-${month}-${day}&nor=1
  `;
  bot.sendMessage(chatId, str);
});

bot.onText(/\/TeckyHotel/, async (msg) => {
  const chatId = msg.chat.id;
  let id = 9;
  let getTeckyHotelInDB = await client.query(
    `select * from hotel where id = ${id}`
  );
  let TeckyHotelInformation = getTeckyHotelInDB.rows;

  let getAvailableRoomOfTeckyHotel = await client.query(
    `select hotel.total_room_number - COUNT(payment_record.hotel_id) as available_room ,
    hotel.hotel_name
    from hotel
   JOIN payment_record ON payment_record.hotel_id = hotel.id
   where payment_record.checkin_date = $1
  AND hotel.id = $2
   GROUP BY hotel.id

   UNION

    select total_room_number - 0 as available_room ,
    hotel.hotel_name
    from hotel
    where id not in (
      select hotel_id
      from payment_record
      where checkin_date = $1
    )
    AND hotel.id = $2

   `,
    [`${year}-${month}-${day}`, id]
  );

  let getAvailableRoom = getAvailableRoomOfTeckyHotel.rows;

  bot.sendPhoto(chatId, path.join(__dirname, `/public/res/hotel${id}.jpeg`));

  let str = `This is the Information of Hotel for Sex Only
Address:${TeckyHotelInformation[0].address}
Level: ${TeckyHotelInformation[0].level}
Amenities: GYM, Swimming Pool, WIFI, SPA
Available: ${getAvailableRoom[0].available_room}
Price:HKD$${TeckyHotelInformation[0].price}
Click here to book it! http://www.localhost:8080/post.html?id=${id}&date=${year}-${month}-${day}&nor=1
  `;
  bot.sendMessage(chatId, str);
});

bot.onText(/\/EmperorLeo/, async (msg) => {
  const chatId = msg.chat.id;
  let id = 10;
  let getQueenFelixInDB = await client.query(
    `select * from hotel where id = ${id}`
  );
  let queenFelix = getQueenFelixInDB.rows;

  bot.sendPhoto(chatId, path.join(__dirname, `/public/res/hotel${id}.jpeg`));

  let getAvailableRoomOfTeckyHotel = await client.query(
    `select hotel.total_room_number - COUNT(payment_record.hotel_id) as available_room ,
    hotel.hotel_name
    from hotel
   JOIN payment_record ON payment_record.hotel_id = hotel.id
   where payment_record.checkin_date = $1
  AND hotel.id = $2
   GROUP BY hotel.id

   UNION

    select total_room_number - 0 as available_room ,
    hotel.hotel_name
    from hotel
    where id not in (
      select hotel_id
      from payment_record
      where checkin_date = $1
    )
    AND hotel.id = $2

   `,
    [`${year}-${month}-${day}`, id]
  );

  let getAvailableRoom = getAvailableRoomOfTeckyHotel.rows;

  // console.log(emperorLeo);

  let str = `🤤 This is the Information of EmperorLeo 🤤
Address: ${queenFelix[0].address}
Level: ${queenFelix[0].level}
Amenities: GYM, Swimming Pool, WIFI, SPA
Available: ${getAvailableRoom[0].available_room}
Price: HKD$${queenFelix[0].price}
Click here to book it! http://www.localhost:8080/post.html?id=${id}&date=${year}-${month}-${day}&nor=1
  `;

  bot.sendMessage(chatId, str);
});

bot.onText(/\/mody/, async (msg) => {
  let result = await client.query("select * from comment");
  let messages = JSON.stringify(result.rows);
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, messages);
});
async () => {
  let getEmperorLeoInDB = await client.query(
    "select * from hotel where id = 10"
  );
  let getQueenFelixInDB = await client.query(
    "select * from hotel where id = 2"
  );
  let getKingModyInDB = await client.query("select * from hotel where id = 3");
  let messageForResultOfLeo = getEmperorLeoInDB.rows;
  let messageForResultOfFelix = getQueenFelixInDB.rows;
  let messageForResultOfMody = getKingModyInDB.rows;
  console.log(messageForResultOfLeo[0].hotel_name);
  console.log(messageForResultOfFelix[0].hotel_name);
  console.log(messageForResultOfMody[0].hotel_name);
};
