import { client } from "./db";

import express from "express";
import dotenv from "dotenv";
import bodyparser from "body-parser";
import { createTransport } from "nodemailer";
import { getStripeData } from "./payTest";

const timer = (t: number) => {
  return new Promise((rec) => setTimeout(() => rec(true), t));
};

dotenv.config();

const stripe = require("stripe")(process.env.STRIPE_PRIVATE_KEY);

export const paymentRouter = express.Router();

//Payment Record
paymentRouter.post(
  "/hook",
  bodyparser.raw({ type: "application/json" }),
  async (req, res) => {
    let signingsecret = process.env.SIGNINGSECRET;

    const payload = req.body;
    const sig = req.headers["stripe-signature"];
    let event;
    try {
      event = stripe.webhooks.constructEvent(payload, sig, signingsecret);
    } catch (error) {
      console.log(error);
      res.status(400).json({ success: true });
      return;
    }
    // console.log(event?.type);
    // console.log(event);
    // console.log(event?.data.object);
    // console.log(event?.data);
    // console.log(event?.data.object.id);

    // let data = event.data.object.charges.data;
    // console.log(data);

    // this first
    if (event.type === "payment_intent.succeeded") {
      console.log("payment_intent.succeeded", event.data.object);

      // let record = event.data.object.metadata;
      let user_id = event.data.object.metadata.user_id;
      let date = event.data.object.metadata.date;
      let hotel_id = event.data.object.metadata.id;
      let nor = event.data.object.metadata.nor;
      let internal_references_id =
        event.data.object.metadata.internal_references_id;

      let receipt = event.data.object.charges.data[0].receipt_url;

      let payment_intent_id = event.data.object.id;

      await client.query(
        `update payment_record set hotel_id = $1, checkin_date = $2, number_of_room = $3, user_id = $4, receipts = $5, payment_intent_id = $6 where internal_references_id = $7 RETURNING id`,
        [
          hotel_id,
          date,
          nor,
          user_id,
          receipt,
          payment_intent_id,
          internal_references_id,
        ]
      );
      // we have clients data (email) in here
      // and pi_3M4dKrI11DBOYm9q0c6UXjts
      // save the pi_3M4dS7I11DBOYm9q1IkMwCXW to database,

      // INSERT

      //   console.log("CHARGES", event.data.object.charges.data);
    }

    if (event.type === "checkout.session.completed") {
      //   console.log("checkout.session.completed", event.data.object);
      //   console.log("CS_completed", event.data.object.payment_intent);

      let itemDetails = await getStripeData(event.data.object.id);
      //   console.log(itemDetails[0].description);
      // console.log("result", itemDetails);
      // console.log(itemDetails[0].description);
      //   console.log(itemDetails[0]);

      // UPDATE

      // we have cs_test_xxxxxx in here (event.data.object.charges:)
      // we have
      console.log("DATAAAAAA", event.data.object);

      let itemName = itemDetails[0].description;
      //   console.log(event.data.object);
      //   console.log(event.data.object);
      //   console.log(event.data.object);
      let customerEmail = event.data.object.customer_details.email;
      //   console.log(customerEmail);
      let amount_total = event.data.object.amount_total / 100;
      //   console.log(amount_total);
      let currency = event.data.object.currency;
      //   console.log(currency);
      let referenceId = event.data.object.id;
      // console.log(referenceId);
      let py_id = event.data.object.payment_intent;

      let payment_intent_id = event.data.object.payment_intent;

      // let internal_references_id =
      //   event.data.object.metadata.internal_references_id;

      // console.log("internal_references_id", internal_references_id);

      // console.log("EMAIL", customerEmail);
      try {
      } catch (error) {}
      await timer(3000);

      let a = await client.query(
        `UPDATE payment_record 
          set email = $1, 
          price = $2, 
          currency = $3, 
          reference_id = $4, 
          hotel_name = $5 , 
          status = true 
          where payment_intent_id = $6 
          RETURNING id`,
        [
          customerEmail,
          amount_total,
          currency,
          referenceId,
          itemName,
          payment_intent_id,
        ]
      );

      console.log("AAAAAAA", a.rows);

      let result01 = await client.query(
        `select receipts from payment_record where payment_intent_id = $1`,
        [py_id]
      );

      // console.log(result01.rows);
      const receipt = result01.rows[0].receipts;
      console.log(receipt);

      let respond = await client.query(
        `select address from hotel where hotel_name = $1`,
        [itemName]
      );
      let result = respond.rows;
      console.log(result);
      let transporter = createTransport({
        service: "Outlook365",
        auth: {
          user: process.env.FLM_OUTLOOKAC,
          pass: process.env.FLM_OUTLOOKPASS,
        },
      });

      let options = {
        from: process.env.FLM_OUTLOOKAC,
        to: customerEmail,
        subject: "Your Payment is Successful!!",
        text: `This is detail of your payment:
          Hotel Name: ${itemName}
          PaymentID:${referenceId},
          Price:${amount_total},
          Address:${result[0].address}
          receipt:${receipt}
          Hope you enjoy the Hotel!
                                `,
      };

      transporter.sendMail(options, (err, info) => {
        if (err) {
          console.log(err);
          return;
        }
        console.log("Sent:" + info.response);
      });
    }

    // console.log(event?.data.checkout.session);
    res.json({
      success: true,
    });
  }
);
