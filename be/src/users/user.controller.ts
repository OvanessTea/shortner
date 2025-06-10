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

        // token

        res.status(201).json({ id: user._id });
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