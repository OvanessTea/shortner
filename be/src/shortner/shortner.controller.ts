import { NextFunction, Request, Response } from "express";
import { Error as MongooseError } from "mongoose";
import { getShortURL } from "./shortner.service";
import { ShortnerModel } from "./shortner.model";
import { transformError } from "../helpers/transform-error";
import BadRequestError from "../errors/bad-request-error";
import NotFoundError from "../errors/not-found-error";
import ForbiddenError from "../errors/forbidden-error";

export const createShortURL = async (req: Request, res: Response, next: NextFunction) => {
    const { url } = req.body;
    const ownerId = res.locals.user.id;

    try {
        const shortLink = await getShortURL(url);

        const newShortURL = await ShortnerModel.create({
            originalLink: url,
            shortLink,
            owner: ownerId,
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

export const getShortURLs = async (req: Request, res: Response, next: NextFunction) => {
    const ownerId = res.locals.user.id;

    try {
        const shortURLs = await ShortnerModel.find({ owner: ownerId }) || [];

        res.status(200).json(shortURLs.map((shortURL) => ({
            id: shortURL._id,
            originalLink: shortURL.originalLink,
            shortLink: shortURL.shortLink,
        }))
        );
    } catch (error) {
        if (error instanceof MongooseError.ValidationError) {
            const errors = transformError(error);
            return next(new BadRequestError(errors[0].message));
        }

        next(error);
    }
}

export const updateShortURL = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const { url } = req.body;
    const ownerId = res.locals.user.id;

    
    try {
        const currentShortLink = await ShortnerModel.findById(id).orFail(new NotFoundError("Short URL not found"));
        if (!currentShortLink.checkOwner(ownerId)) return next(new ForbiddenError("You have no permission to update this short URL"));

        const shortLink = await getShortURL(url); 
        await currentShortLink.updateOne({ shortLink, originalLink: url });
        await currentShortLink.save();

        res.status(200).json({
            id,
            originalLink: url,
            shortLink: shortLink,
        });
    } catch (error) {
        if (error instanceof MongooseError.CastError) {
            return next(new BadRequestError("Invalid short URL ID"));
        }
        if (error instanceof MongooseError.DocumentNotFoundError) {
            return next(new NotFoundError("Short URL not found"));
        }
        if (error instanceof MongooseError.ValidationError) {
            const errors = transformError(error);
            return next(new BadRequestError(errors[0].message));
        }

        next(error);
    }
}

export const deleteShortURL = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const ownerId = res.locals.user.id;

    try {
        const shortLink = await ShortnerModel.findById(id).orFail(new NotFoundError("Short URL not found"));
        if (!shortLink.checkOwner(ownerId)) return next(new ForbiddenError("You have no permission to delete this short URL"));
        await ShortnerModel.findByIdAndDelete(id);

        res.status(204).send({ id });
    } catch (error) {
        if (error instanceof MongooseError.CastError) {
            return next(new BadRequestError("Invalid short URL ID"));
        }
        if (error instanceof MongooseError.DocumentNotFoundError) {
            return next(new NotFoundError("Short URL not found"));
        }

        next(error);
    }
}