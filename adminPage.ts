// import { log } from "console";
import express from "express";
import { client } from "./db";

export const adminPageRouter = express.Router();

adminPageRouter.post("/getSalesRecord", async (req, res) => {
  let { info_dateStr } = req.body;
  // console.log(req.body);

  try {
    let respond = await client.query(
      /* sql */ `SELECT SUM(price) FROM payment_record WHERE checkin_date = $1 AND status = 'true' `,
      [info_dateStr]
    );
    let result = respond.rows;
    // console.log(result);
    return res.json(result);
  } catch (error) {
    console.log(error);

    res.status(400);
    return res.json({ message: error });
  }
});

adminPageRouter.post("/getBookedHotels", async (req, res) => {
  let { info_dateStr } = req.body;
  console.log(info_dateStr);

  try {
    let respond = await client.query(
      /* sql */ `SELECT  hotel_name, SUM(price) FROM payment_record WHERE checkin_date = $1 and status = 'true' GROUP BY hotel_name`,
      [info_dateStr]
    );
    let result = respond.rows;
    console.log(result);
    return res.json(result);
  } catch (error) {
    res.status(400);
    return res.json({ message: error });
  }
});
adminPageRouter.get("/getTotalMonthProfit", async (req, res) => {
  let respond = await client.query(`SELECT
  DATE_TRUNC('month',checkin_date)
    AS  production_to_month,
  SUM(price) AS money_count
FROM payment_record
GROUP BY DATE_TRUNC('month',checkin_date) order by production_to_month asc`);
  let result = respond.rows;
  console.log(result);
  return res.json(result);
});
