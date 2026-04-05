import { registerUser, loginUser } from "./auth.services";
import { registerSchema, loginSchema } from "./auth.schema";
import type { Request, Response, NextFunction } from "express";
import { parseOrThrow } from "../../middleware/validation";

export const register = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { name, email, password } = parseOrThrow(registerSchema, req.body)
        const user = await registerUser(name, email, password)
        res.status(200).json({
            success: true,
            message: "User Created Successfully",
            data: user
        })
    } catch (error) {
        next(error)
    }
}

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = parseOrThrow(loginSchema, req.body)
    const result = await loginUser(email, password)
    
    res.json({ success: true, data: result })
  } catch (err) {
    next(err)
  }
}
