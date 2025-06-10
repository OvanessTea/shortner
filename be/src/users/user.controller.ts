import { Request, Response, NextFunction } from "express";
import { UserModel } from "./user.model";
import { Error as MongooseError } from "mongoose";
import { transformError } from "../helpers/transform-error";
import BadRequestError from "../errors/bad-request-error";
import { ERROR_CODES } from "../constants/error-codes";
import Conflict from "../errors/conflict-error";

export const createUser = async (req: Request, res: Response, next: NextFunction) => {
    const userData = req.body;

    try {
        const user = await UserModel.create(userData);

        const token = user.generateToken();

        res
            .status(201)
            .cookie(
                "accessToken",
                token,
                {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === "production",
                    maxAge: 24 * 60 * 60 * 1000,
                    sameSite: "strict",
                }
            )
            .json({ id: user._id });
    } catch (error) {
        if (error instanceof MongooseError.ValidationError) {
            const errors = transformError(error);
            return next(new BadRequestError(errors[0].message));
        }

        if ((error as Error).message.startsWith(ERROR_CODES.DUPLICATE_EMAIL)) {
            return next(new Conflict("User with this email already exists"));
        }

        next(error);
    }
}

export const loginUser = async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    try {
        const user = await UserModel.findByCredentials(email, password);
        const token = user.generateToken();

        res
            .status(201)
            .cookie(
                "accessToken",
                token,
                {
                    httpOnly: true,
                }
            )
            .send({ id: user._id });
    } catch (error) {
        next(error);
    }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const logoutUser = async (_req: Request, res: Response, _next: NextFunction) => {
    res.clearCookie("accessToken", {
        httpOnly: true,
    });
    res.send({ message: "Logged out successfully" });
}