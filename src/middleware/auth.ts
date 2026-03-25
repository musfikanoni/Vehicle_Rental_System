import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import config from "../config";
import { pool } from "../config/db";

const auth = () => {
    return async (req: Request, res: Response, next: NextFunction) => {
        const token = req.headers.authorization; // 'bearer edkgdkg' ['bearer', 'gsargsfh']
        if(!token){
            throw new Error("You are not authorized")
        }
        const secret = `${config.secret_key}`
        const decoded = jwt.verify(token, secret) as JwtPayload
        const user = await pool.query(
            `
            SELECT * FROM users WHERE email=$1
            `, [decoded.email]
        )

        if(user.rows.length === 0){
            throw new Error("User not found!")
        }

        // req.user = decoded
        
        next()
    }
}

export default auth;