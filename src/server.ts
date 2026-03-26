import express, { Request, Response } from "express";
import { userRoute } from "./modules/user/user.route";
import { initDB } from "./config/db";
import { authRoute } from "./modules/auth/auth.route";
import { vehicleRoute } from "./modules/vehicles/vehicles.route";

const app = express();
app.use(express.json());

initDB();

//http://localhost:5000/users => http://localhost:5000/api/v1/users
//http://localhost:5000/auth => http://localhost:5000/api/v1/signin

app.use("/api/v1/signup", userRoute);
app.use("/api/v1/users", userRoute);
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/vehicles", vehicleRoute);
// app.use("/api/v1/vehicles/:vehicleId", vehicleRoute);

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    message: "this is the root route",
    path: req.path,
  });
});

app.listen(5000, () => {
  console.log("server is running on port 5000");
});
