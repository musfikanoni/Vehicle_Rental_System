import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import config from "../config";
import { pool } from "../config/db";

const auth = (...roles: ("admin" | "customer")[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization;
    if (!token) {
      throw new Error("You are not authorized");
    }
    const secret = `${config.secret_key}`;
    const decoded = jwt.verify(token, secret) as JwtPayload;
    console.log(decoded);
    const user = await pool.query(
            `
            SELECT * FROM users WHERE email=$1
            `,
      [decoded.email],
    );

    if (user.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found!",
      });
    }

    req.user = decoded;

    if (roles.length && !roles.includes(decoded.role)) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized",
      });
    }

    next();
  };
};

export default auth;
