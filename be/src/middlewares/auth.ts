import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import NotAuthorizedError from "../errors/not-authorized-error";

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.accessToken;

    if (!token) {
        return next(new NotAuthorizedError("Requires authentication"));
    }

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET as string) as { id: string };
        res.locals.user = payload;
        next();
    } catch {
        next(new NotAuthorizedError("Requires authentication"));
    }
} 
