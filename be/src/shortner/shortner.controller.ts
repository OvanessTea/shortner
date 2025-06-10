import { NextFunction, Request, Response } from "express";
import { Error as MongooseError } from "mongoose";
import { getShortURL } from "./shortner.service";
import { ShortnerModel } from "./shortner.model";
import { transformError } from "../helpers/transform-error";
import BadRequestError from "../errors/bad-request-error";

export const createShortURL = async (req: Request, res: Response, next: NextFunction) => {
    const { url } = req.body;

    try {
        const shortLink = await getShortURL(url);

        const newShortURL = await ShortnerModel.create({
            originalLink: url,
            shortLink,
        });

        res.status(201).json({
            id: newShortURL._id,
            originalLink: newShortURL.originalLink,
            shortLink: newShortURL.shortLink,
        });
    } catch (error) {
        if (error instanceof MongooseError.ValidationError) {
            const errors = transformError(error);
            return next(new BadRequestError(errors[0].message));
        }

        next(error);
    }
}