import express from "express";
import { print } from "listening-on";
import { postRouter } from "./Post";
import { userRouter } from "./userRouter";
import expressSession from "express-session";
import path from "path";
import { searchRouter } from "./search";
import { isLoggedIn } from "./guards";
import { userBookingRouter } from "./userBookingRouter";
import dotenv from "dotenv";
dotenv.config();
import grant from "grant";
import { paymentRouter } from "./paymentRouter";
import { adminPageRouter } from "./adminPage";

let app = express();
const grantExpress = grant.express({
  defaults: {
    origin: "http://localhost:8080",
    transport: "session",
    state: true,
  },
  google: {
    key: process.env.GOOGLE_CLIENT_ID || "",
    secret: process.env.GOOGLE_CLIENT_SECRET || "",
    scope: ["profile", "email"],
    callback: "/login/google",
  },
});
app.use(
  expressSession({
    secret: "hehexd",
    resave: true,
    saveUninitialized: true,
  })
);

declare module "express-session" {
  interface SessionData {
    user_id?: number;
    username?: string;
    admin?: boolean;
    super_admin?: boolean;
    grant?: {
      response: { access_token: string };
    };
  }
}
app.use(grantExpress as express.RequestHandler);

app.use(paymentRouter);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(postRouter);
app.use(userRouter);
app.use(searchRouter);
app.use(userBookingRouter);
app.use(userBookingRouter);
app.use(adminPageRouter);

app.use(express.static("public"));
app.use(isLoggedIn, express.static("protected"));

app.use((req, res) => {
  res.status(404);
  res.sendFile(path.resolve("public", "404.html"));
});

let port = 8080;
app.listen(port, () => {
  print(port);
});
