import express, { Express, NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
import path from "path";

dotenv.config();

const app: Express = express();
const host = process.env.APP_HOST || 'localhost';
const port = process.env.APP_PORT || 7700;

app.use(express.json());
app.use(express.urlencoded());

//Express configuration.
app.set("host", host);
app.set("port", port);

//Using custom cors policy
app.use((req:any, res:any, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE,OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With");

  if (req.method === "OPTIONS") {
    return res.sendStatus(200); // Handle preflight quickly
  }

  next();
});

const workshopApi = require("./modules/workshop/workshop.route");
const paymentApi = require("./modules/payment/payment.route");
const adminApi = require("./modules/admin/admin.route");
const registerApi = require("./modules/workshopregister/workshopRegister.route");

app.use("/api/admin", adminApi);
app.use("/api/workshop", workshopApi);
app.use("/api/payments", paymentApi);
app.use("/api/register",registerApi)


// Error handling middleware
app.use((error: any, req: Request, res: Response, next: NextFunction) => {
  console.error('Unhandled error:', error);
  res.status(500).json({ 
    error: 'Internal server error',
    message: error.message 
  });
});
app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});

app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

app.listen(app.get("port"), () => {
  console.log(
    "Server started at %s : %d ",
    app.get("host"),
    app.get("port"),
  );
});

module.exports = app;
 