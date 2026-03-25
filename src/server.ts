import express, { Request, Response } from "express";
import { useRoute } from "./modules/user/user.route";
import { initDB } from "./config/db";
import { authRoute } from "./modules/auth/auth.route";

const app = express();
app.use(express.json());

initDB();

//http://localhost:5000/users => http://localhost:5000/api/v1/users
//http://localhost:5000/auth => http://localhost:5000/api/v1/signin

app.use("/api/v1/signup", useRoute);
app.use("/api/v1/users", useRoute);
app.use("/api/v1/auth", authRoute);

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    message: "this is the root route",
    path: req.path,
  });
});

app.listen(5000, () => {
  console.log("server is running on port 5000");
});
