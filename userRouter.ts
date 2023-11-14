import express from "express";
// import path from 'path'
// import json from 'json'
import fetch from "cross-fetch";

import { client } from "./db";
import { checkPassword } from "./hash";
import { hashPassword } from "./hash";
import { createTransport } from "nodemailer";

export const userRouter = express.Router();

// register
userRouter.post("/signup", async (req, res) => {
  try {
    let { username, password, email } = req.body;
    console.log("email:", email);

    if (!username) {
      res.status(400);
      return res.json({ error: "Username is missing" });
    }

    if (!password) {
      res.status(400);
      return res.json({ error: "Password is missing" });
    }

    if (password.length < 8) {
      res.status(400);
      return res.json({
        error: "Please enter at least 8 character",
      });
    }

    let usernameSearchResult = await client.query(
      `select from users where username = $1`,
      [username]
    );

    let emailSearchResult = await client.query(
      `select from users where email = $1`,
      [email]
    );

    let usernameInDataBase = usernameSearchResult.rows.length;

    if (usernameInDataBase > 0) {
      res.status(400);
      return res.json({ error: "Username already used" });
    }

    let emailInDateBase = emailSearchResult.rows.length;

    if (emailInDateBase > 0) {
      res.status(400);
      return res.json({ error: "Email already used" });
    }

    const maskPassword = await hashPassword(password);

    await client.query(
      `insert into users(username,password,email,admin) values ($1,$2,$3,$4)`,
      [username, maskPassword, email, false]
    );

    let transporter = createTransport({
      service: "Outlook365",
      auth: {
        user: process.env.FLM_OUTLOOKAC,
        pass: process.env.FLM_OUTLOOKPASS,
      },
    });

    let options = {
      from: process.env.FLM_OUTLOOKAC,
      to: email,
      subject: "Welcome to FLM_HotelScanner",
      text: `Welcome ${username} !
    Thank you for registration, hope you enjoy our services!
    Click the below link to return to our Home Page:
    http://www.localhost:8080
    Hope to see you soon.
                `,
    };

    transporter.sendMail(options, (err, info) => {
      if (err) {
        console.log(err);
        return;
      }
      console.log("Sent:" + info.response);
    });

    res.status(200);
    return res.json({ message: "Register success! Please Sign in now." });
  } catch (error) {
    res.status(500);
    return res.json({ error: String(error) });
  }
});

// login
userRouter.post("/signin", async (req, res) => {
  try {
    let { username, password } = req.body;

    if (!username) {
      res.status(400);
      return res.json({ status: false, message: "Username is missing" });
    }

    if (!password) {
      res.status(400);
      return res.json({ status: false, message: "Password is missing" });
    }
    let usernameSearchResult = await client.query(
      `select id,username,password,admin , super_admin from users where username = $1`,
      [username]
    );

    let user = usernameSearchResult.rows[0];
    console.log("user:", user);

    if (!user) {
      res.status(400);
      return res.json({
        status: false,
        message: "Username or password is wrong!",
      });
    }

    const match = await checkPassword(password, user.password);

    if (match) {
      req.session["user_id"] = user.id;
      req.session["username"] = user.username;
      req.session["admin"] = user.admin;
      req.session["super_admin"] = user.super_admin;
      console.log(req.session);

      req.session.save();
      res.status(200);
      return res.json({
        status: true,
        message: "Login successful!",
        redirectUrl: "/",
      });
    }

    return res.json({
      status: false,
      message: "Username or password is wrong!",
    });
  } catch (error) {
    console.log(error);

    res.status(500);
    return res.json({ error: String(error) });
  }
});

userRouter.get("/user", async (req, res) => {
  let username = req.session["username"];
  let user_id = req.session["user_id"];
  let admin = req.session["admin"];
  let super_admin = req.session["super_admin"];
  console.log(super_admin);

  res.json({
    username: username,
    users_id: user_id,
    admin: admin,
    super_admin: super_admin,
  });
  console.log("username:", username);
});

userRouter.get("/signout", async (req, res) => {
  req.session.destroy(() => {});
  res.json({ status: true });
});

userRouter.get("/login/google", loginGoogle);
// userRouter.post('/login', login);

async function loginGoogle(req: express.Request, res: express.Response) {
  const accessToken = (req.session as any).grant?.response.access_token;
  const fetchRes = await fetch(
    "https://www.googleapis.com/oauth2/v2/userinfo",
    {
      method: "get",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  console.log("accessToken:", accessToken);

  const result = await fetchRes.json();
  console.log("result:", result);

  const users = (
    await client.query(`SELECT * FROM users WHERE email = $1`, [result.email])
  ).rows;
  // console.log('users:', users);

  // let user = users[0];
  // console.log('user:', user);

  if (users.length == 0) {
    let username = result.name;
    let password = Math.random() * 100;
    let admin = false;
    // Create the user when the user does not exist
    let user = (
      await client.query(
        `INSERT INTO users (username,password,admin,email) 
              VALUES ($1,$2,$3,$4) RETURNING *`,
        [username, password, admin, result.email]
      )
    ).rows[0];

    console.log("user:", user);

    req.session["username"] = user?.username;
    req.session["user_id"] = user?.id;
    req.session["admin"] = user?.admin;
    return res.redirect("/");
  }
  req.session["username"] = users[0]?.username;
  req.session["user_id"] = users[0]?.id;
  req.session["admin"] = users[0]?.admin;
  console.log("users:", users);
  return res.redirect("/");
}
